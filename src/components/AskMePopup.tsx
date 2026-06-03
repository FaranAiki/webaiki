"use client";

import React, { useState, memo, useEffect, useRef } from 'react';
import { MessageSquare, X, LoaderCircle } from 'lucide-react';
import { useTheme } from 'next-themes';
import dynamic from 'next/dynamic';
import { useMutation } from '@tanstack/react-query';

import { usePresentation } from './PresentationContext';
import { useAppStore } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

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

function AskMePopup({
  typeOfWaitingAnswer,
  ask_title,
  question_answer,
  question_title,
  submit,
  waiting,
  provide_question
}: AskMePopupProps) {
  const { isAskMeOpen: isOpen, setAskMeOpen: setIsOpen } = useAppStore();
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const { isPresentationMode } = usePresentation();

  const nodeRef = useRef(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const mutation = useMutation({
    mutationFn: async (q: string) => {
      setAnswer(typeOfWaitingAnswer[Math.floor(Math.random() * typeOfWaitingAnswer.length)]);
      const response = await fetch('/api/gemini', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ question: q }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "An unknown error occurred");
      }
      
      return response.json();
    },
    onSuccess: (data) => {
      setAnswer(data.answer);
    },
    onError: () => {
      setAnswer('');
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim() || mutation.isPending) return;
    mutation.mutate(question);
  };

  const handleOpenPopup = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      setQuestion('');
      setAnswer('');
      mutation.reset();
    }
  }

  if (!mounted) return null;

  // Use CSS to hide in presentation mode to preserve state and avoid mounting issues
  const displayClass = isPresentationMode ? 'hidden' : 'block';
  const isDark = resolvedTheme === 'dark';

  return (
    <div className={displayClass}>
      <Button
        onClick={handleOpenPopup}
        variant="outline"
        size="icon"
        className={`fixed bottom-6 left-6 z-20 h-14 w-14 rounded-full shadow-lg transition-transform hover:scale-110 focus:ring-2 focus:ring-theme-400 bg-theme-surface hover:bg-theme-surface-strong text-foreground border-theme-border`}
        aria-label={ask_title}
      >
        <MessageSquare className="size-6" />
      </Button>

      {isOpen && (
        <Draggable nodeRef={nodeRef} handle=".drag-handle">
          <div ref={nodeRef} className="fixed inset-0 z-30 flex items-center justify-center pointer-events-none md:justify-start md:items-end md:p-6">
            <Card 
              data-lenis-prevent
              className="w-95 pointer-events-auto shadow-2xl backdrop-blur-sm bg-background/95 border-border animate-in fade-in zoom-in duration-300"
            >
              <CardHeader className="drag-handle no-select flex flex-row items-center justify-between p-4 border-b cursor-grab active:cursor-grabbing">
                <CardTitle className="text-lg font-semibold">{ask_title}</CardTitle>
                <Button 
                  variant="ghost" 
                  size="icon-sm" 
                  onClick={() => setIsOpen(false)}
                  aria-label="Close"
                >
                  <X className="size-4" />
                </Button>
              </CardHeader>
              <CardContent className="p-4">
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium opacity-75 mb-1.5">{question_title}</h3>
                    <Textarea
                      value={question}
                      onChange={(e) => setQuestion(e.target.value)}
                      placeholder="..."
                      className="min-h-12 resize-none no-scrollbar"
                      required
                      disabled={mutation.isPending}
                    />
                  </div>
                  <div>
                    <h3 className="text-sm font-medium opacity-75 mb-1.5">{question_answer}</h3>
                    <div className="min-h-43 max-h-43 p-2 bg-muted/50 border rounded-md overflow-y-auto no-scrollbar text-sm">
                      {mutation.isPending && (
                        <div className="flex items-center text-muted-foreground">
                          <LoaderCircle className="animate-spin mr-2 size-4" />
                          <span>{answer}</span>
                        </div>
                      )}
                      {mutation.isError && <p className="text-destructive">{(mutation.error as Error).message}</p>}
                      {!mutation.isPending && !mutation.isError && answer && <p>{answer}</p>}
                      {!mutation.isPending && !mutation.isError && !answer && <p className="text-muted-foreground">{provide_question}</p>}
                    </div>
                  </div>
                  <Button
                    type="submit"
                    className="w-full font-semibold bg-theme-600 hover:bg-theme-500 text-white disabled:opacity-50"
                    disabled={mutation.isPending || !question.trim()}
                  >
                    {mutation.isPending ? waiting : submit}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </Draggable>
      )}
    </div>
  );
}

export default memo(AskMePopup);
