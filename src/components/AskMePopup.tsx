"use client";

import React, { useState, memo } from 'react';
import { MessageSquare, X, LoaderCircle } from 'lucide-react';
import { useRef } from 'react';
import Draggable from 'react-draggable';

function AskMePopup() {
  // State untuk visibilitas, pertanyaan, jawaban, loading, dan error
  const [isOpen, setIsOpen] = useState(false);
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const nodeRef = useRef(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim()) return;

    setIsLoading(true);
    setError('');
    setAnswer('Thinking...');

    try {
      const response = await fetch('/api/gemini', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ question }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "An unknown error occurred");
      }
      
      const data = await response.json();
      setAnswer(data.answer); 
      // setQuestion(''); 

    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("unknown");
      }
      setAnswer(''); 
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenPopup = () => {
    setIsOpen(!isOpen);
    setQuestion('');
    setAnswer('');
    setError('');
    setIsLoading(false);
  }

  // TODO FIX THISSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSS
  return (
  <>
    <button
      onClick={handleOpenPopup}
      className="fixed bottom-6 left-6 z-20 bg-cyan-600 text-white p-4 rounded-full shadow-lg hover:bg-cyan-500 transition-all transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-opacity-75"
      aria-label="Ask me a question about Faran Aiki"
    >
      <MessageSquare size={24} />
    </button>

    {isOpen && (
      <Draggable nodeRef={nodeRef} handle=".drag-handle">
        <div className="fixed h-screen w-screen z-5" ref={nodeRef}>
        <div
          className="fixed -top-585 sm:-top-285 md:-top-185 lg:-top-135 md:left-6 -left-3 flex items-center justify-center z-30 animate-fade-in duration-300 transition-all"
          role="dialog"
          aria-modal="true"
          aria-labelledby="popup-title"
        >
          <div className="bg-gray-800/85 backdrop-blur-sm border border-gray-700 rounded-lg shadow-2xl w-95">
            <div
              // This div is now the handle for dragging
              className="no-select drag-handle flex justify-between items-center p-4 border-b border-gray-600 cursor-grab active:cursor-grabbing"
            >
              <h2 id="popup-title" className="text-lg font-semibold text-white">Ask me about Faran Aiki</h2>
              <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-white" aria-label="Close">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-4">
              <h3 id="popup-question" className="text-base opacity-75 text-gray-300 mb-1">Question</h3>
              <textarea
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="..."
                className="pt-2 w-full h-12 p-2 bg-gray-900/85 text-gray-200 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500 no-scrollbar"
                required
                disabled={isLoading}
              />
              <h3 id="popup-answer" className="text-base opacity-75 text-gray-300 mt-2 mb-1">Answer</h3>
              <div className="pt-2 w-full h-43 p-2 bg-gray-900/85 text-gray-200 border border-gray-600 rounded-md no-scrollbar overflow-y-auto">
                {isLoading && <div className="flex items-center text-gray-400"><LoaderCircle size={16} className="animate-spin mr-2" /><span>{answer}</span></div>}
                {error && <p className="text-red-400">{error}</p>}
                {!isLoading && !error && answer && <p>{answer}</p>}
                {!isLoading && !error && !answer && <p className="text-gray-500">Provide a question first.</p>}
              </div>
              <button
                type="submit"
                className="mt-4 w-full bg-cyan-600/85 text-white py-2 px-4 rounded-md hover:bg-cyan-500/85 transition-colors focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-opacity-75 font-semibold disabled:bg-gray-500/85 disabled:cursor-not-allowed"
                disabled={isLoading || !question.trim()}
              >
                {isLoading ? 'Waiting...' : 'Submit'}
              </button>
            </form>
          </div>
        </div>
        </div>
      </Draggable>
    )}
  </>
);}

export default memo(AskMePopup); 
