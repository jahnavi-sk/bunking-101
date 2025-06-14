'use client';
import { useState, useEffect } from 'react';
import Image from "next/image";
import { Spotlight } from "@/components/ui/spotlight-new";
import Link from "next/link";

export default function Home() {
  const [displayedText, setDisplayedText] = useState('');
  const [showButtons, setShowButtons] = useState(false);
  const [currentLineIndex, setCurrentLineIndex] = useState(0);
  const [currentCharIndex, setCurrentCharIndex] = useState(0);
  
  const textLines = [
    "Hi there !",
    "Want to skip a few classes but still maintain your attendance?",
    "Bunking101 is here to help you out!"
  ];
  
  const typingSpeed = 50; // milliseconds per character
  const lineDelay = 500; // delay between lines

  useEffect(() => {
    if (currentLineIndex < textLines.length) {
      const currentLine = textLines[currentLineIndex];
      
      if (currentCharIndex < currentLine.length) {
        const timer = setTimeout(() => {
          setDisplayedText(prev => prev + currentLine[currentCharIndex]);
          setCurrentCharIndex(prev => prev + 1);
        }, typingSpeed);
        
        return () => clearTimeout(timer);
      } else {
        // Finished current line, move to next line after delay
        const timer = setTimeout(() => {
          setDisplayedText(prev => prev + '\n');
          setCurrentLineIndex(prev => prev + 1);
          setCurrentCharIndex(0);
        }, lineDelay);
        
        return () => clearTimeout(timer);
      }
    } else {
      // All lines typed, show buttons after a short delay
      const timer = setTimeout(() => {
        setShowButtons(true);
      }, 1000);
      
      return () => clearTimeout(timer);
    }
  }, [currentCharIndex, currentLineIndex, textLines, typingSpeed, lineDelay]);

  const formatText = (text: string) => {
    const parts = text.split('Bunking101');
    if (parts.length === 2) {
      return (
        <>
          {parts[0]}
          <span className="text-purple-400 font-semibold">Bunking101</span>
          {parts[1]}
        </>
      );
    }
    return text;
  };

  return (
    <div className="min-h-screen bg-black/[0.96] bg-grid-white/[0.02] relative overflow-hidden flex items-center justify-center">
      <Spotlight
        gradientFirst="radial-gradient(68.54% 68.72% at 55.02% 31.46%, hsla(210, 100%, 85%, .08) 0, hsla(210, 100%, 55%, .02) 50%, hsla(210, 100%, 45%, 0) 80%)"
        gradientSecond="radial-gradient(50% 50% at 50% 50%, hsla(210, 100%, 85%, .06) 0, hsla(210, 100%, 55%, .02) 80%, transparent 100%)"
        gradientThird="radial-gradient(50% 50% at 50% 50%, hsla(210, 100%, 85%, .04) 0, hsla(210, 100%, 45%, .02) 80%, transparent 100%)"
        translateY={-350}
        width={560}
        height={1380}
        smallWidth={240}
        duration={7}
        xOffset={100}
      />
      
      <div className="p-4 max-w-4xl mx-auto relative z-10 w-full text-center">
        {/* Typing Text */}

        <div className="mb-12">
          <h1 className="text-xl md:text-6xl lg:text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-400 leading-tight">
            {displayedText.split('\n').map((line, index) => (
              <div 
                key={index} 
                className={`
                  min-h-[1.2em]
                  ${index === 0 ? 'text-7xl' : ''}
                  ${index === 1 ? 'text-3xl' : ''}
                  ${index === 2 ? 'text-5xl' : ''}
                `}>
                {formatText(line)}
                {index === currentLineIndex && (
                  <span className="animate-pulse text-purple-400">|</span>
                )}
              </div>
            ))}
          </h1>
        </div>

        {/* Buttons */}
        <div className={`transition-all duration-1000 transform ${
          showButtons 
            ? 'opacity-100 translate-y-0' 
            : 'opacity-0 translate-y-8'
        }`}>
          {showButtons && (
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              {/* Login Button */}
              <Link href="/auth?mode=login">
                <button className="relative px-8 py-4 text-lg font-bold text-white bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg shadow-lg transform transition-all duration-300 hover:scale-105  focus:outline-none focus:ring-4 focus:ring-blue-300 group min-w-[200px]">
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                    </svg>
                    Login
                  </span>
                 </button>
              </Link>

              {/* Sign Up Button */}
              <Link href="/auth?mode=signup">
                <button className="relative px-8 py-4 text-lg font-bold text-white bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg shadow-lg transform transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-4 focus:ring-purple-300 group min-w-[200px]">
                 
                  {/* Button content */}
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                    </svg>
                    Sign Up
                  </span> 
                 </button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}