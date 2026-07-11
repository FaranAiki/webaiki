import { useState, useEffect } from 'react';

export function useUserInteraction(delayMs = 3000) {
  const [hasInteracted, setHasInteracted] = useState(false);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout | undefined = undefined;
    
    const handleInteraction = () => {
      setHasInteracted(true);
      cleanUp();
    };

    const cleanUp = () => {
      window.removeEventListener('mousemove', handleInteraction);
      window.removeEventListener('scroll', handleInteraction);
      window.removeEventListener('touchstart', handleInteraction);
      window.removeEventListener('keydown', handleInteraction);
      if (timeoutId) clearTimeout(timeoutId);
    };

    window.addEventListener('mousemove', handleInteraction, { once: true });
    window.addEventListener('scroll', handleInteraction, { once: true });
    window.addEventListener('touchstart', handleInteraction, { once: true });
    window.addEventListener('keydown', handleInteraction, { once: true });
    
    // Fallback: if user doesn't interact, load anyway after delay
    timeoutId = setTimeout(handleInteraction, delayMs);

    return cleanUp;
  }, [delayMs]);

  return hasInteracted;
}
