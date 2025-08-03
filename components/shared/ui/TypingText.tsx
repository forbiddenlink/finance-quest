'use client';

import { useState, useEffect } from 'react';

interface TypingTextProps {
  texts: string[];
  typingSpeed?: number;
  deletingSpeed?: number;
  pauseTime?: number;
  className?: string;
  prefix?: string;
  cursorColor?: string;
}

export default function TypingText({
  texts,
  typingSpeed = 100,
  deletingSpeed = 50,
  pauseTime = 2000,
  className = '',
  prefix = '',
  cursorColor = '#3B82F6'
}: TypingTextProps) {
  const [mounted, setMounted] = useState(false);
  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  const [currentText, setCurrentText] = useState(texts[0] || ''); // Start with first text to avoid hydration mismatch
  const [isDeleting, setIsDeleting] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  // Fix hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  // Don&apos;t run typing animation until mounted
  useEffect(() => {
    if (!mounted) return;
    
    const currentFullText = texts[currentTextIndex];
    
    const timer = setTimeout(() => {
      if (isPaused) {
        setIsPaused(false);
        setIsDeleting(true);
        return;
      }

      if (isDeleting) {
        if (currentText === '') {
          setIsDeleting(false);
          setCurrentTextIndex((prev) => (prev + 1) % texts.length);
        } else {
          setCurrentText(currentFullText.substring(0, currentText.length - 1));
        }
      } else {
        if (currentText === currentFullText) {
          setIsPaused(true);
        } else {
          setCurrentText(currentFullText.substring(0, currentText.length + 1));
        }
      }
    }, isPaused ? pauseTime : isDeleting ? deletingSpeed : typingSpeed);

    return () => clearTimeout(timer);
  }, [mounted, currentText, currentTextIndex, isDeleting, isPaused, texts, typingSpeed, deletingSpeed, pauseTime]);

  // Render static text until mounted to prevent hydration mismatch
  if (!mounted) {
    return (
      <span className={`inline-block ${className}`}>
        {prefix}{texts[0]}
        <span 
          className="animate-pulse ml-1"
          style={{ color: cursorColor }}
        >
          |
        </span>
      </span>
    );
  }

  return (
    <span className={`inline-block ${className}`}>
      {prefix}{currentText}
      <span 
        className="animate-pulse ml-1"
        style={{ color: cursorColor }}
      >
        |
      </span>
    </span>
  );
}
