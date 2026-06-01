import React, { useState, useEffect } from 'react';

export type HoverableWordsProps = {
  children?: string; // Make children optional to handle undefined gracefully
  className?: string;
  prophover?: string;
};

// Helper function to process the word splitting logic
const processWords = (text: string, separatorRegex: RegExp, hoverClass: string, isMobile: boolean) => {
  if (isMobile) {
    return <React.Fragment>{text}</React.Fragment>;
  }

  const parts = text.split(new RegExp(`(${separatorRegex.source})`)).filter(Boolean);
  
  return parts.map((part, index) =>
    separatorRegex.test(part) ? (
      <React.Fragment key={index}>{part}</React.Fragment>
    ) : (
      <span key={index} className={hoverClass}>
        {part}
      </span>
    )
  );
};

export default function HoverableWords({ children, className, prophover }: HoverableWordsProps) {
  const [isMobile, setIsMobile] = useState(false);
  const finalClassName = className || '';
  
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Return early if no children are provided to prevent crash
  if (!children) {
    return <p className={finalClassName}></p>;
  }

  const finalPropHover = prophover || 'transition-transform inline-block duration-200 ease-in-out hover:text-xl hover:font-semibold cursor-pointer';

  const separatorRegex = /[\"\'\[\]\(\)\s]+/;
  
  // Regex to split by <b>...</b> or <i>...</i> tags (case-insensitive)
  const tagRegex = /(<b>.*?<\/b>|<i>.*?<\/i>)/gi;

  // Ensure children is treated as a string before splitting
  const segments = String(children).split(tagRegex).filter(Boolean);

  return (
    <p className={finalClassName}>
      {segments.map((segment, i) => {
        const lowerSegment = segment.toLowerCase();
        if (lowerSegment.startsWith('<b>') && lowerSegment.endsWith('</b>')) {
          const content = segment.slice(3, -4); // Remove tags
          return (
            <span key={i} className="font-bold">
              {processWords(content, separatorRegex, finalPropHover, isMobile)}
            </span>
          );
        }
        if (lowerSegment.startsWith('<i>') && lowerSegment.endsWith('</i>')) {
          const content = segment.slice(3, -4); // Remove tags
          return (
            <span key={i} className="italic">
              {processWords(content, separatorRegex, finalPropHover, isMobile)}
            </span>
          );
        }
        // Plain text segment
        return <React.Fragment key={i}>{processWords(segment, separatorRegex, finalPropHover, isMobile)}</React.Fragment>;
      })}
    </p>
  );
}
