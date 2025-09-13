import React from 'react';

type HoverableWordsProps = {
  children: string;
};

export default function HoverableWords({ children, className='', prophover='transition-all inline-block duration-200 ease-in-out hover:text-xl hover:font-semibold cursor-pointer' }: HoverableWordsProps) {
  const words = children.split(' ');

  return (
    // How to make this className still works lol
    <p className={`text-lg text-gray-300 max-w-lg leading-relaxed ${className}`}>
      {words.map((word, index) => (
        <React.Fragment key={index}>
          <span
            className={prophover}
          >
            {word}
          </span>
          {' '} {/* Adding spaces */}
        </React.Fragment>
      ))}
    </p>
  );
}
