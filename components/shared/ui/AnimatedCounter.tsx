'use client';

import { useState, useEffect } from 'react';

interface AnimatedCounterProps {
  end: number;
  duration?: number;
  prefix?: string;
  suffix?: string;
  className?: string;
  decimals?: number;
}

export default function AnimatedCounter({ 
  end, 
  duration = 2000, 
  prefix = '', 
  suffix = '', 
  className = '',
  decimals = 0 
}: AnimatedCounterProps) {
  const [mounted, setMounted] = useState(false);
  const [count, setCount] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  // Fix hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    
    // Intersection Observer for triggering animation when visible
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isVisible) {
          setIsVisible(true);
        }
      },
      { threshold: 0.5 }
    );

    const element = document.getElementById(`counter-${end}`);
    if (element) {
      observer.observe(element);
    }

    return () => observer.disconnect();
  }, [mounted, end, isVisible]);

  useEffect(() => {
    if (!mounted || !isVisible) return;

    let startTime: number;
    let animationFrame: number;

    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);
      
      // Easing function for smooth animation
      const easeOutCubic = 1 - Math.pow(1 - progress, 3);
      const currentCount = Math.floor(easeOutCubic * end);
      
      setCount(currentCount);

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);

    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
    };
  }, [mounted, end, duration, isVisible]);

  const formatNumber = (num: number) => {
    return num.toLocaleString('en-US', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    });
  };

  // Show final number immediately on server, animate on client
  if (!mounted) {
    return (
      <span 
        id={`counter-${end}`}
        className={`inline-block ${className}`}
      >
        {prefix}{formatNumber(end)}{suffix}
      </span>
    );
  }

  return (
    <span 
      id={`counter-${end}`}
      className={`inline-block ${className} ${isVisible ? 'animate-number-count' : 'opacity-0'}`}
    >
      {prefix}{formatNumber(count)}{suffix}
    </span>
  );
}
