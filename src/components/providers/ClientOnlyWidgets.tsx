"use client";

import Background from '@/components/layout/Background';

interface ClientOnlyWidgetsProps {
  backgrounds: string[];
}

export default function ClientOnlyWidgets({ backgrounds }: ClientOnlyWidgetsProps) {
  return (
    <>
      <Background carousel={backgrounds} />
    </>
  );
}
