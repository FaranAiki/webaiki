import React, { useState } from 'react';
import { useSettings } from '../providers/SettingsContext';

export type HoverableWordsProps = {
  children?: string; // Make children optional to handle undefined gracefully
  className?: string;
  prophover?: string;
};

// Helper function to process the word splitting logic
const processWords = (text: string, separatorRegex: RegExp, hoverClass: string, skipSplitting: boolean) => {
  if (skipSplitting) {
    return <React.Fragment>{text}</React.Fragment>;
  }

  const parts = text.split(new RegExp(`(${separatorRegex.source})`)).filter(Boolean);

  return parts.map((part, index) =>
    separatorRegex.test(part) ? (
      <span key={index} className="theme-transition">{part}</span>
    ) : (
      <span key={index} className={hoverClass}>
        {part}
      </span>
    )
  );
};

export default function HoverableWords({ children, className, prophover }: HoverableWordsProps) {
  const [isHovered, setIsHovered] = useState(false);
  const { isAtsMode } = useSettings();
  const finalClassName = className || '';

  // Return early if no children are provided to prevent crash
  if (!children) {
    return <p className={finalClassName}></p>;
  }

  // Only split if the user has hovered this specific paragraph and not in ATS mode
  const skipSplitting = !isHovered || isAtsMode;

  // The "gacor" effect: gradient text on hover with smooth transition
  const gacorHover = 'transition-all inline-block duration-700 ease-in-out hover:scale-105 hover:font-bold cursor-pointer hover:nav-active-gacor';

  const finalPropHover = prophover || gacorHover;

  const separatorRegex = /[\"\'\[\]\(\)\s]+/;

  // Regex to split by <b>...</b> or <i>...</i> tags (case-insensitive)
  const tagRegex = /(<b>.*?<\/b>|<i>.*?<\/i>)/gi;

  // Ensure children is treated as a string before splitting
  const segments = String(children).split(tagRegex).filter(Boolean);

  return (
    <p 
      className={finalClassName}
      onMouseEnter={() => {
        // We only split on desktop devices (width >= 768) when hovered
        if (window.innerWidth >= 768 && !isAtsMode) {
          setIsHovered(true);
        }
      }}
    >
      {segments.map((segment, i) => {
        const lowerSegment = segment.toLowerCase();
        if (lowerSegment.startsWith('<b>') && lowerSegment.endsWith('</b>')) {
          const content = segment.slice(3, -4); // Remove tags
          return (
            <span key={i} className="font-bold">
              {processWords(content, separatorRegex, finalPropHover, skipSplitting)}
            </span>
          );
        }
        if (lowerSegment.startsWith('<i>') && lowerSegment.endsWith('</i>')) {
          const content = segment.slice(3, -4); // Remove tags
          return (
            <span key={i} className="italic">
              {processWords(content, separatorRegex, finalPropHover, skipSplitting)}
            </span>
          );
        }
        // Plain text segment
        return <React.Fragment key={i}>{processWords(segment, separatorRegex, finalPropHover, skipSplitting)}</React.Fragment>;
      })}
    </p>
  );
}
