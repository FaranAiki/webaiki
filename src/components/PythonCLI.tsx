"use client";

import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  FormEvent,
  ChangeEvent,
} from "react";

// --- Types ---

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
  searchParams: {
    type?: string;
    source?: string;
  };
}

// --- Skrip Demo ---
const DEMO_SCRIPT = `
while True:
    eval(input(">>> "))
`;

const WORKER_CODE = `
importScripts("https://cdn.jsdelivr.net/pyodide/v0.26.1/full/pyodide.js");

let pyodide = null;
let stdinBuffer = null;
// Decoder untuk mengubah Uint8Array dari 'write' handler menjadi string
const decoder = new TextDecoder();

self.onmessage = async (event) => {
  const { type, data } = event.data;

  if (type === 'init') {
    try {
      stdinBuffer = new Int32Array(data.sab);

      pyodide = await loadPyodide({ indexURL: "https://cdn.jsdelivr.net/pyodide/v0.26.1/full/" });
      
      // FIX: Mengganti 'batched' dengan 'write' untuk mendukung 'isatty: true'
      pyodide.setStdout({
        write: (buffer) => {
          // buffer adalah Uint8Array, kita decode ke string
          const text = decoder.decode(buffer);
          self.postMessage({ type: 'output', text: text });
          // return jumlah bytes yang ditulis (wajib)
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
          
          Atomics.wait(stdinBuffer, 0, 0);
          Atomics.store(stdinBuffer, 0, 0);
          
          const length = stdinBuffer[1];
          const sharedBytes = new Uint8Array(data.sab, 8, length);
          const localBytes = new Uint8Array(sharedBytes); 
          // Decode input dari main thread
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
}: PythonCLIProps) {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isFetchingScript, setIsFetchingScript] = useState<boolean>(false);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [isWaitingForInput, setIsWaitingForInput] = useState<boolean>(false);
  const [currentInput, setCurrentInput] = useState<string>("");
  const [script, setScript] = useState<string | null>(null);
  
  const workerRef = useRef<Worker | null>(null);
  const sabRef = useRef<SharedArrayBuffer | null>(null);
  const ranScriptRef = useRef<string | null>(null); // Track execution to prevent double runs
  
  const terminalContainerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const addToHistory = useCallback((item: HistoryItem) => {
    setHistory((prev) => {
      // Logika gabung output
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
        text: "CRITICAL ERROR: SharedArrayBuffer is not defined.\nPastikan header COOP & COEP aktif." 
      });
      setIsLoading(false);
      return;
    }

    const blob = new Blob([WORKER_CODE], { type: "application/javascript" });
    const worker = new Worker(URL.createObjectURL(blob));
    workerRef.current = worker;

    const sab = new SharedArrayBuffer(1024 * 10);
    sabRef.current = sab;

    worker.onmessage = (e: MessageEvent<WorkerMessageData>) => {
      const { type, text } = e.data;
      
      switch (type) {
        case 'ready':
          setIsLoading(false);
          addToHistory({ type: "system", text: "Python Environment Ready.\n" });
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
          // Saat input diminta, pastikan tidak ada newline di akhir prompt terakhir
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
          setTimeout(() => inputRef.current?.focus(), 10);
          break;
        case 'finished':
          addToHistory({ type: "system", text: "\n--- Program Selesai ---\n" });
          break;
      }
    };

    worker.postMessage({ type: 'init', data: { sab } });

    return () => {
      worker.terminate();
    };
  }, [addToHistory]);

  // --- Script Fetching ---
  useEffect(() => {
    const controller = new AbortController(); // Create controller
    let isSubscribed = true;

    async function fetchScript() {
      if (searchParams.type === "python" && searchParams.source) {
        if (isSubscribed) setIsFetchingScript(true);
        
        // Reset ranScriptRef so new scripts can run
        if (ranScriptRef.current !== searchParams.source) {
            ranScriptRef.current = null; 
        }
        
        addToHistory({ type: "system", text: `Fetching ${searchParams.source}...\n` });
        
        try {
          const res = await fetch(searchParams.source!, { 
              signal: controller.signal 
          });
          
          if (!res.ok) throw new Error(res.statusText);
          const text = await res.text();
          
          if (isSubscribed) {
            setScript(text);
            addToHistory({ type: "system", text: "Script loaded.\n" });
          }
        } catch (e: unknown) {
          if (e instanceof Error && e.name === 'AbortError') {
             // Request was aborted, do nothing
             return; 
          }
          if (isSubscribed) {
            const errorMessage = e instanceof Error ? e.message : String(e);
            addToHistory({ type: "error", text: `Fetch Error: ${errorMessage}\n` });
            setScript(DEMO_SCRIPT); // Fallback to demo
          }
        } finally {
          if (isSubscribed) setIsFetchingScript(false);
        }
      } else {
        if (isSubscribed) setScript(DEMO_SCRIPT);
      }
    }

    fetchScript();

    return () => {
      isSubscribed = false;
      controller.abort(); // Cancel request on unmount/re-run
    };
  }, [searchParams, addToHistory]);

  // --- Auto Run ---
  useEffect(() => {
    // Only run if:
    // 1. Everything is ready
    // 2. We haven't already run this exact script content (tracked by ranScriptRef)
    if (
        !isLoading && 
        !isFetchingScript && 
        script && 
        workerRef.current && 
        ranScriptRef.current !== script
    ) {
      addToHistory({ type: "system", text: "--- Running Script ---\n" });
      workerRef.current.postMessage({ type: 'run', data: { script } });
      ranScriptRef.current = script; // Mark this script as run
    }
  }, [isLoading, isFetchingScript, script, addToHistory]);

  // --- Auto Scroll ---
  useEffect(() => {
    if (terminalContainerRef.current) {
      terminalContainerRef.current.scrollTop = terminalContainerRef.current.scrollHeight;
    }
  }, [history, isWaitingForInput]);

  // --- Input Logic ---
  const handleInputSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!isWaitingForInput || !sabRef.current) return;

    addToHistory({ type: "input", text: currentInput + "\n" });

    const sab = sabRef.current;
    const int32View = new Int32Array(sab);
    const encoder = new TextEncoder();
    const bytes = encoder.encode(currentInput);

    if (bytes.length > 1024 * 8) {
      alert("Input too long!");
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

  const handleTerminalClick = () => {
    if (isWaitingForInput && inputRef.current) {
      inputRef.current.focus();
    }
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setCurrentInput(e.target.value);
  };

  return (
    <div className="font-sans flex items-center justify-center min-h-screen p-4 no-scrollbar bg-black">
      <div className="w-full max-w-3xl bg-gray-900 text-gray-100 rounded-lg shadow-2xl overflow-hidden flex flex-col h-[80vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between p-3 bg-gray-800 border-b border-gray-700 shrink-0">
          <div className="flex space-x-2">
            <span className="w-3 h-3 bg-red-500 rounded-full"></span>
            <span className="w-3 h-3 bg-yellow-500 rounded-full"></span>
            <span className="w-3 h-3 bg-green-500 rounded-full"></span>
          </div>
          <span className="font-mono text-sm opacity-80">Python Web Terminal</span>
          <div className="w-24 text-right text-xs text-blue-300 animate-pulse">
            {(isLoading || isFetchingScript) && "Loading..."}
          </div>
        </div>

        {/* Terminal Body (REPL Style) */}
        <div 
          ref={terminalContainerRef} 
          className="flex-1 p-4 font-mono text-sm overflow-y-auto cursor-text"
          onClick={handleTerminalClick}
        >
          <pre className="whitespace-pre-wrap break-words font-mono">
            {history.map((item, index) => (
              <span 
                key={index} 
                className={
                  item.type === "system" ? "text-gray-500 italic" : "text-gray-100"
                }
              >
                {item.text}
              </span>
            ))}

            {isWaitingForInput && (
              <span className="inline-flex">
                <form onSubmit={handleInputSubmit} className="inline">
                  <input
                    ref={inputRef}
                    type="text"
                    value={currentInput}
                    onChange={handleInputChange}
                    className="bg-transparent border-none outline-none text-cyan-300 font-bold p-0 m-0 min-w-[1ch] w-auto"
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
          </pre>
        </div>

      </div>
    </div>
  );
}
