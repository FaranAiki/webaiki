"use client";

import React, { useState, memo, useEffect } from 'react';
import { MessageSquare, X, LoaderCircle } from 'lucide-react';
import { useRef } from 'react';
import { useTheme } from 'next-themes';
import dynamic from 'next/dynamic';

const Draggable = dynamic(() => import('react-draggable'), { ssr: false });

interface AskMePopupProps {
  typeOfWaitingAnswer: string[];
  ask_title: string;
  question_answer: string;
  question_title: string;
  submit: string;
  waiting: string;
  provide_question: string;
}

function AskMePopup({typeOfWaitingAnswer, ask_title, question_answer, question_title, submit, waiting, provide_question }: AskMePopupProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  const nodeRef = useRef(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim()) return;

    setIsLoading(true);
    setError('');
    setAnswer(typeOfWaitingAnswer[Math.floor(Math.random() * typeOfWaitingAnswer.length)]);

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

  if (!mounted) return null;

  const isDark = resolvedTheme === 'dark';

  // Dynamic Styles
  const popupBg = isDark ? 'bg-gray-800/95 border-gray-700' : 'bg-white/95 border-gray-300';
  const headerBorder = isDark ? 'border-gray-600' : 'border-gray-200';
  const titleText = isDark ? 'text-white' : 'text-gray-900';
  const closeBtn = isDark ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-black';
  const labelText = isDark ? 'text-gray-300' : 'text-gray-700';
  const inputBg = isDark ? 'bg-gray-900/85 text-gray-200 border-gray-600' : 'bg-gray-50 text-gray-900 border-gray-300';
  const answerBg = isDark ? 'bg-gray-900/85 text-gray-200 border-gray-600' : 'bg-gray-50 text-gray-900 border-gray-300';

  return (
  <>
    <button
      onClick={handleOpenPopup}
      className={`fixed bottom-6 left-6 z-20 ${isDark? 'bg-cyan-600' : 'bg-white'} ${isDark? 'text-white' : 'text-black'} p-4 rounded-full shadow-lg hover:${isDark? 'bg-cyan-500' : 'bg-cyan-200'} transition-[colors,transform] transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-opacity-75`}
      aria-label={ask_title}
    >
      <MessageSquare size={24} />
    </button>

    {isOpen && (
      <Draggable nodeRef={nodeRef} handle=".drag-handle">
      <div ref={nodeRef} className="flex justify-center absolute fixed w-screen h-screen top-0 left-0">
        <div
          className="fixed bottom-25 w-auto md:h-auto md:left-6 flex items-center justify-center z-30 animate-fade-in duration-300 transition-[transform]"
          role="dialog"
          aria-modal="true"
          aria-labelledby="popup-title"
        >
          <div className={`${popupBg} backdrop-blur-sm border rounded-lg shadow-2xl w-95`}>
            <div
              className={`no-select drag-handle flex justify-between items-center p-4 border-b ${headerBorder} cursor-grab active:cursor-grabbing`}
            >
              <h2 id="popup-title" className={`text-lg font-semibold ${titleText}`}>{ask_title}</h2>
              <button onClick={() => setIsOpen(false)} className={closeBtn} aria-label="Close">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-4">
              <h3 id="popup-question" className={`text-base opacity-75 ${labelText} mb-1`}>{question_title}</h3>
              <textarea
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="..."
                className={`pt-2 w-full h-12 p-2 ${inputBg} border rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500 no-scrollbar`}
                required
                disabled={isLoading}
              />
              <h3 id="popup-answer" className={`text-base opacity-75 ${labelText} mt-2 mb-1`}>{question_answer}</h3>
              <div className={`pt-2 w-full h-43 p-2 ${answerBg} border rounded-md no-scrollbar overflow-y-auto`}>
                {isLoading && <div className="flex items-center text-gray-400"><LoaderCircle size={16} className="animate-spin mr-2" /><span>{answer}</span></div>}
                {error && <p className="text-red-400">{error}</p>}
                {!isLoading && !error && answer && <p>{answer}</p>}
                {!isLoading && !error && !answer && <p className="text-gray-500">{provide_question}</p>}
              </div>
              <button
                type="submit"
                className="mt-4 w-full bg-cyan-600/85 text-white py-2 px-4 rounded-md hover:bg-cyan-500/85 transition-colors focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-opacity-75 font-semibold disabled:bg-gray-500/85 disabled:cursor-not-allowed"
                disabled={isLoading || !question.trim()}
              >
                {isLoading ? waiting : submit}
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
