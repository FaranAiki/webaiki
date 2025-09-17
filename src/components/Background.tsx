"use client";

import Image from 'next/image';
import { useState, useEffect } from 'react';
import React, { useRef } from 'react';

const SLIDE_DURATION = 10000; // Duration per slide 

// Matrix effect
const MatrixRain = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas dimensions to fill the screen
    const setCanvasDimensions = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    setCanvasDimensions();

    // The characters to be used in the rain effect
    const math_symbols = '∀∁∂∃∄∅∆∇∈∉∊∋∌∍∎∏∐∑−∓∔∕∖∗∘⋅√∛∜∝∞∟∠∡∢∣∤∥∦∧∨∩∪∫∬∭∮∯∰∱∲∳∴∵∶∷∸∹∺∻∼∽∾∿≀≁≂≃≄≅≆≇≈≉≊≋≌≍≎≏≐≑≒≓≔≕≖≗≘≙≚≛≜≝≞≟≠≡≢≤≥≦≧≨≩≪≫≬≭≮≯≰≱≲≳≴≵≶≷≸≹≺≻≼≽≾≿⊀⊁⊂⊃⊄⊅⊆⊇⊈⊉⊊⊋⊌⊍⊎⊏⊐⊑⊒⊓⊔⊕⊖⊗⊘⊙⊚⊛⊜⊝⊞⊟⊠⊡⊢⊣⊤⊥⊦⊧⊨⊩⊪⊫⊬⊭⊮⊯⊰⊱⊲⊳⊴⊵⊶⊷⊸⊹⊺⊻⊼⊽⊾⊿⋀⋁⋂⋃⋅∗⋇⋈⋉⋊⋋⋌⋍⋎⋏⋐⋑⋒⋓⋔⋕⋖⋗⋘⋙⋚⋛⋜⋝⋞⋟⋠⋡⋢⋣⋤⋥⋦⋧⋨⋩⋪⋫⋬⋭⋮⋯⋰⋱⋲⋳⋴⋵⋶⋷⋸⋹⋺⋻⋼⋽⋾⋿⨀⨁⨂⨃⨄⨅⨆⨌⨍⨎⨏⨐⨑⨒⨓⨔⨕⨖⨗⨘⨙⨚⨛⨜⨝⩽⩾⩿⪀⪁⪂⪃⪄⪅⪆⪇⪈⪉⪊⪋⪌⪍⪎⪏⪐⪑⪒⪓⪔⪕⪖⪗⪘⪙⪚⪛⪜⪝⪞⪟⪠⪮⪯⪰⪱⪲⪳⪴⪵⪶⪷⪸⪹⪺><=⫹⫺';
    const greek_alphabets = 'eΑαΒβΓγΔδΕεΖζΗηΘθΙιΚκΛλΜμΝνΞξΟοΠπΡρΣσςΤτΥυΦφΧχΨψΩω';
    const latin = 'abmnxyzw';
    const nums = '0123456789';
    const characters = math_symbols + greek_alphabets + latin + nums;

    const fontSize = 16;
    const columns = Math.floor(canvas.width / fontSize);

    const drops: number[] = [];
    for (let i = 0; i < columns; i++) {
      drops[i] = 1;
    }

    const draw = () => {
      // Create the fading effect by drawing a semi-transparent black rectangle
      ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Set the color and font for the characters
      ctx.fillStyle = `rgb(${17 + Math.floor(Math.random() * 10 - 5)}, ${255 + Math.floor(Math.random() * 10 - 5)}, ${240 + Math.floor(Math.random() * 10 - 5)})`; // '#11EEFF'; // Cyan text is basic
      ctx.font = `${fontSize}px monospace`;

      // Loop through each column
      for (let i = 0; i < drops.length; i++) {
        // Pick a random character
        const text = characters.charAt(Math.floor(Math.random() * characters.length));
        
        // Draw the character
        ctx.fillText(text, i * fontSize *(1 + (Math.random() -0.5)*0.025), drops[i] * fontSize);

        // Reset the drop to the top of the screen randomly to make the rain effect uneven
        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }

        // Move the drop down
        drops[i]++;
      }
    };

    // 33 from 1000/60 (60 fps) ~ 33 ms 
    const animationInterval = setInterval(draw, 33);

    const handleResize = () => {
      setCanvasDimensions();
    };
    window.addEventListener('resize', handleResize);

    // Cleanup function to stop the animation and remove event listener
    return () => {
      clearInterval(animationInterval);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed top-0 left-0 w-full h-full z-[-1] bg-black opacity-30 hover:opacity-40 transition-all"
    />
  );
};

export type BackgroundProps = {
  carousel: string[]
};

export default function Background( {carousel}: BackgroundProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % carousel.length);
    }, SLIDE_DURATION);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 w-full h-full z-[-1]">
      {carousel.map((src, index) => (
        <Image
          key={index}
          src={`/images/background/${src}`}
          alt={`Background image ${index + 1}`}
          fill    
          style={{objectFit:"cover"}} // thanks stackoverflow
          quality={100}
          priority={index === 0}
          className={`transition-opacity blur-xs duration-1000 ease-in-out ${
            index === currentIndex ? 'opacity-50' : 'opacity-0'
          }`}
        />
      ))}
      {/* Darken it to make texts easy to read */}
      <div className="absolute inset-0 bg-black opacity-50" />
      <MatrixRain/>
    </div>
  );
}
