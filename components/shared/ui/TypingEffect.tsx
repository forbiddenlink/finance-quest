'use client';

import { useState, useEffect, useCallback } from 'react';
import { theme } from '@/lib/theme';

interface TypingEffectProps {
    text: string;
    speed?: number;
    delay?: number;
    className?: string;
    onComplete?: () => void;
}

export default function TypingEffect({
    text,
    speed = 50,
    delay = 0,
    className = '',
    onComplete
}: TypingEffectProps) {
    const [displayText, setDisplayText] = useState('');
    const [isComplete, setIsComplete] = useState(false);

    const startTyping = useCallback(() => {
        let currentIndex = 0;
        setDisplayText('');
        setIsComplete(false);

        const timer = setInterval(() => {
            if (currentIndex < text.length) {
                setDisplayText(prev => prev + text[currentIndex]);
                currentIndex++;
            } else {
                clearInterval(timer);
                setIsComplete(true);
                onComplete?.();
            }
        }, speed);

        return () => clearInterval(timer);
    }, [text, speed, onComplete]);

    useEffect(() => {
        if (delay > 0) {
            const delayTimer = setTimeout(() => {
                startTyping();
            }, delay);
            return () => clearTimeout(delayTimer);
        } else {
            startTyping();
        }
    }, [text, speed, delay, startTyping]);

    return (
        <span className={className}>
            {displayText}
            {!isComplete && (
                <span className={`animate-pulse ${theme.textColors.primary}`}>|</span>
            )}
        </span>
    );
}