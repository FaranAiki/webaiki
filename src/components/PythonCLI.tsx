"use client";

import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  JSX,
} from "react";

// --- Skrip Demo ---
const DEMO_SCRIPT = `
import sys
import platform
import time

print(f"Hello from Pyodide!")
print(f"Python version: {sys.version}")

print("\\n--- Running a demo loop ---")
for i in range(3):
    print(f"Count: {i}")
    time.sleep(0.5) 

print("\\n--- Testing Input (REPL Style) ---")

# Karena 'isatty: true' sudah diset di worker, prompt input akan otomatis di-flush
name = input("Siapa nama kamu? ") 
print(f"Halo, {name}!")

age = input(f"Berapa umur {name}? ")
print(f"Wow, {age} tahun!")

"Demo selesai."
`;

// --- Worker Code ---
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

interface HistoryItem {
  type: "system" | "input" | "output" | "error";
  text: string;
}

type PythonCLIProps = {
  searchParams: {
    type?: string;
    source?: string;
  };
};

export default function PythonCLI({
  searchParams,
}: PythonCLIProps): JSX.Element {
  const [isLoading, setIsLoading] = useState(true);
  const [isFetchingScript, setIsFetchingScript] = useState(false);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [isWaitingForInput, setIsWaitingForInput] = useState(false);
  const [currentInput, setCurrentInput] = useState("");
  const [script, setScript] = useState<string | null>(null);
  
  const workerRef = useRef<Worker | null>(null);
  const sabRef = useRef<SharedArrayBuffer | null>(null);
  
  const terminalContainerRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

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

    worker.onmessage = (e) => {
      const { type, text } = e.data;
      
      switch (type) {
        case 'ready':
          setIsLoading(false);
          addToHistory({ type: "system", text: "Python Environment Ready.\n" });
          break;
        case 'output':
          addToHistory({ type: "output", text: text });
          break;
        case 'error':
          const cleanMsg = text.replace(/^PythonError: Traceback \(most recent call last\):/, 'Traceback:');
          addToHistory({ type: "error", text: cleanMsg });
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
    async function fetchScript() {
      if (searchParams.type === "python" && searchParams.source) {
        setIsFetchingScript(true);
        addToHistory({ type: "system", text: `Fetching ${searchParams.source}...\n` });
        try {
          const res = await fetch(searchParams.source);
          if (!res.ok) throw new Error(res.statusText);
          const text = await res.text();
          setScript(text);
          addToHistory({ type: "system", text: "Script loaded.\n" });
        } catch (e: unknown) {
          // Fix for "Unexpected any" error
          const errorMessage = e instanceof Error ? e.message : String(e);
          addToHistory({ type: "error", text: `Fetch Error: ${errorMessage}\n` });
          setScript(DEMO_SCRIPT);
        } finally {
          setIsFetchingScript(false);
        }
      } else {
        setScript(DEMO_SCRIPT);
      }
    }
    fetchScript();
  }, [searchParams, addToHistory]);

  // --- Auto Run ---
  useEffect(() => {
    if (!isLoading && !isFetchingScript && script && workerRef.current) {
      addToHistory({ type: "system", text: "--- Running Script ---\n" });
      workerRef.current.postMessage({ type: 'run', data: { script } });
    }
  }, [isLoading, isFetchingScript, script, addToHistory]);

  // --- Auto Scroll ---
  useEffect(() => {
    if (terminalContainerRef.current) {
      terminalContainerRef.current.scrollTop = terminalContainerRef.current.scrollHeight;
    }
  }, [history, isWaitingForInput]);

  // --- Input Logic ---
  const handleInputSubmit = (e: React.FormEvent) => {
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
                  // item.type === "input" ? "text-cyan-300 font-bold" :
                  // item.type === "error" ? "text-gray-" : // Changed from red-400 to amber-400
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
                    onChange={(e) => setCurrentInput(e.target.value)}
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
