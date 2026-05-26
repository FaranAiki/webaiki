"use client";

// TODO add pygame

import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  FormEvent,
  ChangeEvent,
  KeyboardEvent,
} from "react";

import { formatCJK } from "@/lib/utils";

type HistoryType = 'output' | 'error' | 'system' | 'input';

interface HistoryItem {
  type: HistoryType;
  text: string;
}

interface WorkerMessageData {
  type: 'ready' | 'output' | 'error' | 'input_request' | 'finished';
  text?: string;
}

interface PythonCLIProps {
  loadingText: string, 
  terminalTitle: string,
  terminalError: string,
  terminalFinished: string,
  terminalWelcome: string,
  terminalInputTooLong: string,
  lang?: string,
  searchParams: {
    type?: string;
    source?: string;
  };
}

const WORKER_CODE = `
importScripts("https://cdn.jsdelivr.net/pyodide/v0.26.1/full/pyodide.js");

let pyodide = null;
let stdinBuffer = null;
const decoder = new TextDecoder();

self.onmessage = async (event) => {
  const { type, data } = event.data;

  if (type === 'init') {
    try {
      stdinBuffer = new Int32Array(data.sab);

      pyodide = await loadPyodide({ indexURL: "https://cdn.jsdelivr.net/pyodide/v0.26.1/full/" });
      
      pyodide.setStdout({
        write: (buffer) => {
          const text = decoder.decode(buffer);
          self.postMessage({ type: 'output', text: text });
          return buffer.length;
        },
        isatty: true
      });
      
      pyodide.setStderr({
        write: (buffer) => {
          const text = decoder.decode(buffer);
          self.postMessage({ type: 'error', text: text });
          return buffer.length;
        },
        isatty: true
      });

      pyodide.setStdin({
        stdin: () => {
          self.postMessage({ type: 'input_request' });
          
          // Block until main thread notifies
          Atomics.wait(stdinBuffer, 0, 0);
          // Reset flag immediately after waking
          Atomics.store(stdinBuffer, 0, 0);
          
          const length = stdinBuffer[1];
          const sharedBytes = new Uint8Array(data.sab, 8, length);
          const localBytes = new Uint8Array(sharedBytes); 
          const str = new TextDecoder().decode(localBytes);
          
          return str;
        },
        error: false,
        isatty: true 
      });
      
      self.postMessage({ type: 'ready' });
    } catch (error) {
      self.postMessage({ type: 'error', text: error.toString() });
    }
  }

  if (type === 'run') {
    if (!pyodide) return;
    try {
      await pyodide.runPythonAsync(data.script);
      self.postMessage({ type: 'finished' });
    } catch (error) {
      self.postMessage({ type: 'error', text: error.toString() });
    }
  }
};
`;

export default function PythonCLI({
  searchParams,
  terminalTitle,
  loadingText,
  terminalError,
  terminalFinished,
  terminalWelcome,
  terminalInputTooLong,
  lang,
}: PythonCLIProps) {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isFetchingScript, setIsFetchingScript] = useState<boolean>(false);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [isWaitingForInput, setIsWaitingForInput] = useState<boolean>(false);
  const [currentInput, setCurrentInput] = useState<string>("");
  const [script, setScript] = useState<string | null>(null);
   
  const workerRef = useRef<Worker | null>(null);
  const sabRef = useRef<SharedArrayBuffer | null>(null);
  const ranScriptRef = useRef<string | null>(null); 
   
  const terminalContainerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const demoScript = `
print("${terminalWelcome}")
while True:
    eval(input(">>> "))
`;

  const addToHistory = useCallback((item: HistoryItem) => {
    setHistory((prev) => {
      if (prev.length > 0) {
        const lastIdx = prev.length - 1;
        const lastItem = prev[lastIdx];
        
        if (lastItem.type === 'output' && item.type === 'output') {
            const newHistory = [...prev];
            newHistory[lastIdx] = {
                ...lastItem,
                text: lastItem.text + item.text
            };
            return newHistory;
        }
      }
      return [...prev, item];
    });
  }, []);

  // --- Worker Setup ---
  useEffect(() => {
    if (typeof SharedArrayBuffer === "undefined") {
      addToHistory({ 
        type: "error", 
        text: terminalError
      });
      setIsLoading(false);
      return;
    }

    const blob = new Blob([WORKER_CODE], { type: "application/javascript" });
    const worker = new Worker(URL.createObjectURL(blob));
    workerRef.current = worker;

    const sab = new SharedArrayBuffer(1024 * 10);
    sabRef.current = sab; // Store SAB in ref

    worker.onmessage = (e: MessageEvent<WorkerMessageData>) => {
      const { type, text } = e.data;
      
      switch (type) {
        case 'ready':
          setIsLoading(false);
          break;
        case 'output':
          if (text !== undefined) addToHistory({ type: "output", text: text });
          break;
        case 'error':
          if (text !== undefined) {
            const cleanMsg = text.replace(/^PythonError: Traceback \(most recent call last\):/, 'Traceback:');
            addToHistory({ type: "error", text: cleanMsg });
          }
          break;
        case 'input_request':
          // Remove trailing newline from the last output to keep prompt on same line
          setHistory(prev => {
            if (prev.length === 0) return prev;
            const newHistory = [...prev];
            const lastIndex = newHistory.length - 1;
            const lastItem = newHistory[lastIndex];

            if (lastItem.type === 'output' && lastItem.text.endsWith('\n')) {
                newHistory[lastIndex] = {
                    ...lastItem,
                    text: lastItem.text.slice(0, -1) 
                };
            }
            return newHistory;
          });
          
          setIsWaitingForInput(true);
          break;
        case 'finished':
          addToHistory({ type: "system", text: `\n${terminalFinished}\n` });
          break;
      }
    };

    worker.postMessage({ type: 'init', data: { sab } });

    return () => {
      worker.terminate();
    };
  }, [addToHistory, terminalError, terminalFinished]);

  useEffect(() => {
    const controller = new AbortController();
    let isSubscribed = true;

    async function fetchScript() {
      if (searchParams.type === "python" && searchParams.source) {
        if (isSubscribed) setIsFetchingScript(true);
        
        if (ranScriptRef.current !== searchParams.source) {
            ranScriptRef.current = null; 
        }
        
        try {
          const res = await fetch(searchParams.source!, { 
              signal: controller.signal 
          });
          
          if (!res.ok) throw new Error(res.statusText);
          const text = await res.text();
          
          if (isSubscribed) {
            setScript(text);
          }
        } catch (e: unknown) {
          if (e instanceof Error && e.name === 'AbortError') return;
          
          if (isSubscribed) {
            setScript(demoScript); 
          }
        } finally {
          if (isSubscribed) setIsFetchingScript(false);
        }
      } else {
        if (isSubscribed) setScript(demoScript);
      }
    }

    fetchScript();

    return () => {
      isSubscribed = false;
      controller.abort();
    };
  }, [searchParams, demoScript]);

  // --- Auto Run ---
  useEffect(() => {
    if (
        !isLoading && 
        !isFetchingScript && 
        script && 
        workerRef.current && 
        ranScriptRef.current !== script
    ) {
      workerRef.current.postMessage({ type: 'run', data: { script } });
      ranScriptRef.current = script; 
    }
  }, [isLoading, isFetchingScript, script]);

  useEffect(() => {
    if (terminalContainerRef.current) {
      terminalContainerRef.current.scrollTop = terminalContainerRef.current.scrollHeight;
    }
  }, [history, isWaitingForInput]);

  // Force focus when waiting for input
  useEffect(() => {
    if (isWaitingForInput && inputRef.current) {
        inputRef.current.focus();
    }
  }, [isWaitingForInput]);

  const submitInput = () => {
    if (!isWaitingForInput || !sabRef.current) return;

    addToHistory({ type: "input", text: currentInput + "\n" });

    const sab = sabRef.current;
    const int32View = new Int32Array(sab);
    const encoder = new TextEncoder();
    const bytes = encoder.encode(currentInput);

    if (bytes.length > 1024 * 8) {
      addToHistory({ type: "error", text: `${terminalInputTooLong}\n` });
      return;
    }

    int32View[1] = bytes.length;
    const uint8View = new Uint8Array(sab);
    uint8View.set(bytes, 8);

    Atomics.store(int32View, 0, 1);
    Atomics.notify(int32View, 0);

    setIsWaitingForInput(false);
    setCurrentInput("");
  };

  const handleFormSubmit = (e: FormEvent) => {
    e.preventDefault();
    submitInput();
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
        e.preventDefault();
        submitInput();
    }
  };

  const handleTerminalClick = () => {
    if (isWaitingForInput && inputRef.current) {
      inputRef.current.focus();
    }
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setCurrentInput(e.target.value);
  };

  return (
    <div className="font-sans flex items-center justify-center min-h-screen p-4 no-scrollbar">
      <div className="w-full max-w-3xl bg-gray-900 text-gray-100 rounded-lg shadow-2xl overflow-hidden flex flex-col h-[80vh] border border-gray-800">
        
        <div className="flex items-center justify-between p-3 bg-gray-800 border-b border-gray-700 shrink-0 select-none bg-opacity-90">
          <div className="w-24"></div> 
          <span className="font-mono text-sm font-bold opacity-80 text-center">
             {formatCJK(terminalTitle, lang)}
          </span>
          <div className="w-24"></div>
        </div>

        <div 
          ref={terminalContainerRef} 
          className="flex-1 p-4 font-mono text-sm overflow-y-auto cursor-text scroll-smooth bg-opacity-80"
          onClick={handleTerminalClick}
        >
          <div className="whitespace-pre-wrap break-words font-mono no-scrollbar">
            
            {(isLoading || isFetchingScript) && (
                <div className="text-blue-300 animate-pulse mb-2">
                    {formatCJK(loadingText, lang)}
                </div>
            )}

            {history.map((item, index) => (
              <span 
                key={index} 
                className={
                  item.type === "system" ? "text-gray-500 italic" : 
                  item.type === "input" ? "text-white font-bold" :
                  "text-gray-100"
                }
              >
                {item.text}
              </span>
            ))}

            {isWaitingForInput && (
              <span className="inline-flex align-baseline">
                <form onSubmit={handleFormSubmit} className="inline">
                  <input
                    ref={inputRef}
                    type="text"
                    value={currentInput}
                    onChange={handleInputChange}
                    onKeyDown={handleKeyDown}
                    className="bg-transparent border-none outline-none text-cyan-300 font-bold p-0 m-0 min-w-[1ch]"
                    autoFocus
                    autoComplete="off"
                    style={{ 
                      caretColor: '#22d3ee', 
                      width: `${Math.max(1, currentInput.length)}ch` 
                    }}
                  />
                </form>
              </span>
            )}
            
            {!isWaitingForInput && !isLoading && (
                  <span className="inline-block w-2 h-4 bg-gray-500 animate-pulse align-middle ml-1" />
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
