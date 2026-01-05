"use client";

import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  FormEvent,
  ChangeEvent,
  KeyboardEvent,
} from "react";

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
  searchParams: {
    type?: string;
    source?: string;
  };
}

const DEMO_SCRIPT = `
import pygame
import random
import asyncio

async def main():
    pygame.init()
    screen = pygame.display.set_mode((600, 400))
    clock = pygame.time.Clock()
    colors = [(255, 0, 0), (0, 255, 0), (0, 0, 255), (255, 255, 0)]
    
    print("Pygame is running in the web environment!")

    running = True
    while running:
        for event in pygame.event.get():
            if event.type == pygame.QUIT:
                running = False
        
        screen.fill((20, 20, 30))
        for _ in range(5):
            pos = (random.randint(0, 600), random.randint(0, 400))
            pygame.draw.circle(screen, random.choice(colors), pos, random.randint(10, 50))
        
        pygame.display.flip()
        await asyncio.sleep(0) # Yield control to the browser
        clock.tick(30)

asyncio.run(main())
`;

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
      
      // Fix: Use simple object assignments instead of Proxies to avoid recursion errors.
      // Proxies can cause infinite loops when Pyodide's getattr/setattr calls trigger traps.
      await pyodide.runPythonAsync(\`
        import js
        from js import Object

        def create_mock_element(name="element"):
            el = js.Object.new()
            el.style = js.Object.new()
            # Initialize common style properties used by SDL2/Pygame
            el.style.cursor = "default"
            el.style.width = "600px"
            el.style.height = "400px"
            el.style.overflow = "hidden"
            el.style.pointerEvents = "auto"
            
            el.addEventListener = lambda x, y, z=None: None
            el.removeEventListener = lambda x, y: None
            el.setAttribute = lambda x, y: None
            el.appendChild = lambda x: None
            el.removeChild = lambda x: None
            el.focus = lambda: None
            el.blur = lambda: None
            el.id = name
            el.tagName = name.upper()
            
            def get_rect():
                rect = js.Object.new()
                rect.width = 600
                rect.height = 400
                rect.top = 0
                rect.left = 0
                rect.bottom = 400
                rect.right = 600
                rect.x = 0
                rect.y = 0
                return rect
            
            el.getBoundingClientRect = get_rect
            return el

        # Apply global shims safely
        if not hasattr(js, "document"):
            doc = js.Object.new()
            doc.createElement = lambda x: create_mock_element(x)
            doc.querySelector = lambda x: create_mock_element("query")
            doc.getElementById = lambda x: create_mock_element(x)
            doc.getElementsByTagName = lambda x: js.Array.from_([create_mock_element(x)])
            doc.hasFocus = lambda: True
            doc.body = create_mock_element("body")
            doc.documentElement = create_mock_element("html")
            js.document = doc
            
        if not hasattr(js, "window"):
            js.window = js
            js.window.devicePixelRatio = 1.0
            js.window.innerWidth = 600
            js.window.innerHeight = 400
            js.window.addEventListener = lambda x, y, z=None: None
            js.window.removeEventListener = lambda x, y: None
            
        if not hasattr(js, "screen"):
            screen = js.Object.new()
            screen.width = 1920
            screen.height = 1080
            screen.availWidth = 1920
            screen.availHeight = 1080
            screen.colorDepth = 24
            js.screen = screen
      \`);

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
          Atomics.wait(stdinBuffer, 0, 0);
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
      if (data.isPygame) {
        if (data.canvas) {
           pyodide.canvas.setCanvas2D(data.canvas);
        }
        await pyodide.loadPackage("micropip");
        const micropip = pyodide.pyimport("micropip");
        await micropip.install("pygame-ce");
      }

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
}: PythonCLIProps) {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isFetchingScript, setIsFetchingScript] = useState<boolean>(false);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [isWaitingForInput, setIsWaitingForInput] = useState<boolean>(false);
  const [currentInput, setCurrentInput] = useState<string>("");
  const [script, setScript] = useState<string | null>(null);
  const [isPygame, setIsPygame] = useState<boolean>(false);
   
  const workerRef = useRef<Worker | null>(null);
  const sabRef = useRef<SharedArrayBuffer | null>(null);
  const ranScriptRef = useRef<string | null>(null); 
   
  const terminalContainerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

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
        text: "CRITICAL ERROR: SharedArrayBuffer is not defined.\nEnsure COOP/COEP headers are set." 
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
          addToHistory({ type: "system", text: "\n--- Program Finished ---\n" });
          break;
      }
    };

    worker.postMessage({ type: 'init', data: { sab } });

    return () => {
      worker.terminate();
    };
  }, [addToHistory]);

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
            setIsPygame(text.includes("import pygame"));
          }
        } catch (e: unknown) {
          if (e instanceof Error && e.name === 'AbortError') return;
          
          if (isSubscribed) {
            setScript(DEMO_SCRIPT); 
            setIsPygame(DEMO_SCRIPT.includes("import pygame"));
          }
        } finally {
          if (isSubscribed) setIsFetchingScript(false);
        }
      } else {
        if (isSubscribed) {
          setScript(DEMO_SCRIPT);
          setIsPygame(DEMO_SCRIPT.includes("import pygame"));
        }
      }
    }

    fetchScript();

    return () => {
      isSubscribed = false;
      controller.abort();
    };
  }, [searchParams, addToHistory]);

  // --- Auto Run ---
  useEffect(() => {
    if (
        !isLoading && 
        !isFetchingScript && 
        script && 
        workerRef.current && 
        ranScriptRef.current !== script
    ) {
      const payload: any = { script, isPygame };
      
      if (isPygame && canvasRef.current) {
        try {
          const offscreen = canvasRef.current.transferControlToOffscreen();
          payload.canvas = offscreen;
          workerRef.current.postMessage({ type: 'run', data: payload }, [offscreen]);
        } catch (e) {
          workerRef.current.postMessage({ type: 'run', data: payload });
        }
      } else {
        workerRef.current.postMessage({ type: 'run', data: payload });
      }
      
      ranScriptRef.current = script; 
    }
  }, [isLoading, isFetchingScript, script, isPygame]);

  useEffect(() => {
    if (terminalContainerRef.current) {
      terminalContainerRef.current.scrollTop = terminalContainerRef.current.scrollHeight;
    }
  }, [history, isWaitingForInput]);

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
      addToHistory({ type: "error", text: "Input too long!\n" });
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
    <div className="font-sans flex items-center justify-center min-h-screen p-4 md:p-24 no-scrollbar bg-gray-950">
      <div className="w-full max-w-4xl bg-gray-900 text-gray-100 rounded-lg shadow-2xl overflow-hidden flex flex-col h-[85vh] border border-gray-800">
        
        <div className="flex items-center justify-between p-4 bg-gray-800 border-b border-gray-700 shrink-0 select-none bg-opacity-90">
          <div className="w-24 flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
            <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
          </div>
          <span className="font-mono text-xs font-bold opacity-80 uppercase tracking-widest">
             {terminalTitle} {isPygame ? "(Pygame Mode)" : ""}
          </span>
          <div className="w-24"></div>
        </div>

        <div 
          ref={terminalContainerRef} 
          className="flex-1 relative font-mono text-sm overflow-hidden bg-opacity-80"
          onClick={handleTerminalClick}
        >
          {isPygame && (
            <div className="absolute inset-0 flex items-center justify-center bg-black z-10">
              <canvas 
                ref={canvasRef} 
                id="canvas"
                className="max-w-full max-h-full shadow-2xl border border-gray-800"
                style={{ imageRendering: 'pixelated' }}
              />
            </div>
          )}

          <div className={`p-4 h-full overflow-y-auto ${isPygame ? 'opacity-30' : 'opacity-100'}`}>
            <div className="whitespace-pre-wrap break-words font-mono no-scrollbar">
              
              {(isLoading || isFetchingScript) && (
                  <div className="text-blue-300 animate-pulse mb-2">
                      {loadingText}
                  </div>
              )}

              {history.map((item, index) => (
                <span 
                  key={index} 
                  className={
                    item.type === "system" ? "text-gray-500 italic" : 
                    item.type === "error" ? "text-red-400" :
                    item.type === "input" ? "text-cyan-400 font-bold" :
                    "text-gray-300"
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
              
              {!isWaitingForInput && !isLoading && !isPygame && (
                    <span className="inline-block w-2 h-4 bg-gray-500 animate-pulse align-middle ml-1" />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
