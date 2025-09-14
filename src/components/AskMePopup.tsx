// Using client for events
"use client";

import { useState } from 'react';
import { MessageSquare, X } from 'lucide-react';
import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextRequest, NextResponse } from "next/server";

// This is generated using Gemini Pro and I am going to modify it 
export async function POST(req: NextRequest) {
  // Call from the server 
  const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
  if (!GEMINI_API_KEY) {
    return NextResponse.json({ error: "Gemini API key not configured" }, { status: 500 });
  }

  const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({ model: "gemini-pro" });

  try {
    const { question } = await req.json();
    if (!question) {
      return NextResponse.json({ error: "Question is required" }, { status: 400 });
    }

    const prompt = `Answer this question: ${question}`;
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    return NextResponse.json({ answer: text });

  } catch (error) {
    console.error("Error calling Gemini API:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// The layout for popup
export default function AskMePopup() {
  const [isOpen, setIsOpen] = useState(false);
  const [ansMessage, setAnsMessage] = useState("Provide a question first.");
  const [message, setMessage] = useState('');

  // Gemini API how
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    console.log("Question:", message);
    alert(`Use gemini here using API`);
    setMessage('')
    setAnsMessage("Waiting for an answer ....");
    setIsOpen(true);
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 left-6 z-20 bg-cyan-600 text-white p-4 rounded-full shadow-lg hover:bg-cyan-500 transition-all transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-opacity-75"
        aria-label="Ask me a question about Faran Aiki"
      >
        <MessageSquare size={24} />
      </button>

      {/* Popup Modal */}
      {isOpen && (
        <div 
          className="transform transition-all fixed bottom-20 left-6 z-30 animate-fade-in-up duration-300"
          role="dialog"
          aria-modal="true"
          aria-labelledby="popup-title"
        >
          <div className="bg-gray-800/85 border border-gray-700 rounded-lg shadow-2xl w-80">
            <div className="flex justify-between items-center p-4 border-b border-gray-600">
              <h2 id="popup-title" className="text-lg font-semibold text-white-400">Ask me about Faran Aiki</h2>
              <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-white" aria-label="Close">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-4">
              <h3 id="popup-question" className="text-lg opacity-75 text-white-400">Question</h3>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="..."
                className="pt-2 w-full h-12 p-2 bg-gray-900 text-gray-200 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500 no-scrollbar"
                required
              />
              <h3 id="popup-answer" className="text-lg opacity-75 text-white-400">Answer</h3>
              <textarea readOnly
                className="pt-2 w-full h-32 p-2 bg-gray-900 text-gray-200 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500 no-scrollbar"
                placeholder={ansMessage}
              /> 
              <button
                type="submit"
                className="mt-4 w-full bg-cyan-600 text-white py-2 px-4 rounded-md hover:bg-cyan-500 transition-colors focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-opacity-75 font-semibold"
              >
                Submit
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

