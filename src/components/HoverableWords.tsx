import React from 'react';

export type HoverableWordsProps = {
  children: string;
  className?: string;
  prophover?: string;
};

// Using gemini algo to just solve things cuz I am too lazy
export default function HoverableWords({ children, className, prophover }: HoverableWordsProps) {
  const finalClassName = className || '';
  const finalPropHover = prophover || 'transition-all inline-block duration-200 ease-in-out hover:text-xl hover:font-semibold cursor-pointer';

  const separatorRegex = /[\"\'\[\]\(\)\s]+/;

  const parts = children.split(new RegExp(`(${separatorRegex.source})`)).filter(Boolean);

  return (
    <p className={`text-lg text-gray-300 max-w-lg leading-relaxed ${finalClassName}`}>
      {parts.map((part, index) =>
        separatorRegex.test(part) ? (
          <React.Fragment key={index}>{part}</React.Fragment>
        ) : (
          <span key={index} className={finalPropHover}>
            {part}
          </span>
        )
      )}
    </p>
  );
}
