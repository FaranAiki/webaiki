import React from 'react';

export type HoverableWordsProps = {
  children: string;
  className?: string;
  prophover?: string;
};

// Helper function to process the word splitting logic
const processWords = (text: string, separatorRegex: RegExp, hoverClass: string) => {
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
  const finalClassName = className || '';
  const finalPropHover = prophover || 'transition-all inline-block duration-200 ease-in-out hover:text-xl hover:font-semibold cursor-pointer';

  const separatorRegex = /[\"\'\[\]\(\)\s]+/;
  
  // Regex to split by <b>...</b> or <i>...</i> tags
  // Note: This does not support nested tags for simplicity
  const tagRegex = /(<b>.*?<\/b>|<i>.*?<\/i>)/g;

  const segments = children.split(tagRegex).filter(Boolean);

  return (
    <p className={finalClassName}>
      {segments.map((segment, i) => {
        if (segment.startsWith('<b>') && segment.endsWith('</b>')) {
          const content = segment.slice(3, -4); // Remove tags
          return (
            <span key={i} className="font-bold">
              {processWords(content, separatorRegex, finalPropHover)}
            </span>
          );
        }
        if (segment.startsWith('<i>') && segment.endsWith('</i>')) {
          const content = segment.slice(3, -4); // Remove tags
          return (
            <span key={i} className="italic">
              {processWords(content, separatorRegex, finalPropHover)}
            </span>
          );
        }
        // Plain text segment
        return <React.Fragment key={i}>{processWords(segment, separatorRegex, finalPropHover)}</React.Fragment>;
      })}
    </p>
  );
}
