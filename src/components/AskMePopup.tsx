"use client"; // Diperlukan karena menggunakan state dan event listeners

import { useState } from 'react';
import { MessageSquare, X } from 'lucide-react';

export default function AskMePopup() {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Di aplikasi nyata, Anda akan mengirim pesan ini ke sebuah API endpoint
    console.log("Pesan Terkirim:", message);
    alert(`Terima kasih atas pertanyaan Anda:\n"${message}"\n\n(Ini hanya simulasi, pesan belum terkirim.)`);
    setMessage('');
    setIsOpen(false);
  };

  return (
    <>
      {/* Tombol untuk membuka popup */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 left-6 z-20 bg-cyan-600 text-white p-4 rounded-full shadow-lg hover:bg-cyan-500 transition-transform transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-opacity-75"
        aria-label="Ask me a question"
      >
        <MessageSquare size={24} />
      </button>

      {/* Popup Modal */}
      {isOpen && (
        <div 
          className="fixed bottom-20 left-6 z-30 animate-fade-in-up"
          role="dialog"
          aria-modal="true"
          aria-labelledby="popup-title"
        >
          <div className="bg-gray-800 border border-gray-700 rounded-lg shadow-2xl w-80">
            <div className="flex justify-between items-center p-4 border-b border-gray-600">
              <h2 id="popup-title" className="text-lg font-semibold text-cyan-400">Ask me about anything</h2>
              <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-white" aria-label="Close">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-4">
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Tulis pertanyaan Anda di sini..."
                className="w-full h-32 p-2 bg-gray-900 text-gray-200 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
                required
              />
              <button
                type="submit"
                className="mt-4 w-full bg-cyan-600 text-white py-2 px-4 rounded-md hover:bg-cyan-500 transition-colors focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-opacity-75"
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

