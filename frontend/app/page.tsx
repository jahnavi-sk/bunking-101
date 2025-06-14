'use client';
import { useState, useEffect } from 'react';
import { Spotlight } from "@/components/ui/spotlight-new";
import Login from "@/components/Login";
import SignUp from "@/components/SignUp"; 

export default function Home() {
  const [displayedText, setDisplayedText] = useState('');
  const [showButtons, setShowButtons] = useState(false);
  const [showIntro, setIntro] = useState(true);
  const [typingDone, setTypingDone] = useState(false);


  const [currentLineIndex, setCurrentLineIndex] = useState(0);
  const [currentCharIndex, setCurrentCharIndex] = useState(0);
  const [mode, setMode] = useState<"login" | "signup" | null>(null);

  const textLines = [
    "Hi there !",
    "Want to skip a few classes but still maintain your attendance?",
    "Bunking101 is here to help you out!"
  ];

  const typingSpeed = 50;
  const lineDelay = 500;

  useEffect(() => {
    if (typingDone) {
    setDisplayedText(textLines.join('\n'));
    setShowButtons(true);
    return;
  }

    if (currentLineIndex < textLines.length) {
      const currentLine = textLines[currentLineIndex];

      if (currentCharIndex < currentLine.length) {
        const timer = setTimeout(() => {
          setDisplayedText(prev => prev + currentLine[currentCharIndex]);
          setCurrentCharIndex(prev => prev + 1);
        }, typingSpeed);
        return () => clearTimeout(timer);
      } else {
        const timer = setTimeout(() => {
          setDisplayedText(prev => prev + '\n');
          setCurrentLineIndex(prev => prev + 1);
          setCurrentCharIndex(0);
        }, lineDelay);
        return () => clearTimeout(timer);
      }
    } else {
      const timer = setTimeout(() => {
        setShowButtons(true);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [currentCharIndex, currentLineIndex]);

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
      <Spotlight /* spotlight props here */ />

      <div className="p-4 max-w-4xl mx-auto relative z-10 w-full text-center">
        { showIntro && (
            <div className="mb-12">
          <h1 className="text-xl md:text-6xl lg:text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-400 leading-tight">
            {displayedText.split('\n').map((line, index) => (
              <div key={index} className={`
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

          )}
        
        {/* Conditional Rendering */}
        {mode === "login" && <Login onBack={() => {
    setMode(null);
    setIntro(true);
    setShowButtons(true);
  }} />
}
        {mode === "signup" && <SignUp onBack={() => {
    setMode(null);
    setIntro(true);
  }} />
}
        
        {mode === null && showButtons && (
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center transition-opacity duration-500">
            <button
              onClick={() => {setIntro(false); setMode("login");}}
              className="relative px-8 py-4 text-lg font-bold text-white bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg shadow-lg hover:scale-105 transition"
            >
              Login
            </button>

            <button
              onClick={() => {setIntro(false); setMode("signup");}}
              className="relative px-8 py-4 text-lg font-bold text-white bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg shadow-lg hover:scale-105 transition"
            >
              Sign Up
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
