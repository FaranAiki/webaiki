"use client";

import dynamic from 'next/dynamic';

// Safe to use ssr: false here because we are inside a "use client" file
const AskMePopup = dynamic(() => import("@/components/AskMePopup"), { ssr: false });
const Background = dynamic(() => import("@/components/Background"), { ssr: false });

interface ClientOnlyWidgetsProps {
  dict: Record<string, string>;
  backgrounds: string[];
}

export default function ClientOnlyWidgets({ dict, backgrounds }: ClientOnlyWidgetsProps) {
  // Moved the array initialization here to clean up the Server Component
  const typeOfWaitingAnswer = [
    dict.gemini_wait1,
    dict.gemini_wait2,
    dict.gemini_wait3,
    dict.gemini_wait4,
    dict.gemini_wait5,
    dict.gemini_wait6,
    dict.gemini_wait7,
    dict.gemini_wait8
  ];

  return (
    <>
      <AskMePopup 
        typeOfWaitingAnswer={typeOfWaitingAnswer} 
        ask_title={dict.Ask_About} 
        question_title={dict.Question_Title} 
        question_answer={dict.Question_Answer} 
        submit={dict.Submit} 
        waiting={dict.Waiting} 
        provide_question={dict.Provide_Question}
      />
      <Background carousel={backgrounds} />
    </>
  );
}
