'use client';

import { useState, useEffect } from 'react';

interface TypingEffectProps {
  text: string;
  speed?: number;
  delay?: number;
  className?: string;
  showCursor?: boolean;
  onComplete?: () => void;
}

export default function TypingEffect({
  text,
  speed = 50,
  delay = 0,
  className = '',
  showCursor = true,
  onComplete
}: TypingEffectProps) {
  const [displayText, setDisplayText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    const startTimer = setTimeout(() => {
      setIsTyping(true);
    }, delay);

    return () => clearTimeout(startTimer);
  }, [delay]);

  useEffect(() => {
    if (!isTyping) return;

    if (currentIndex < text.length) {
      const timer = setTimeout(() => {
        setDisplayText((prev) => prev + text[currentIndex]);
        setCurrentIndex((prev) => prev + 1);
      }, speed);

      return () => clearTimeout(timer);
    } else {
      onComplete?.();
    }
  }, [currentIndex, text, speed, isTyping, onComplete]);

  return (
    <span className={`${className} ${showCursor ? 'animate-typing' : ''}`}>
      {displayText}
      {showCursor && isTyping && currentIndex < text.length && (
        <span className="animate-pulse">|</span>
      )}
    </span>
  );
}
