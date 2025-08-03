'use client';

import { useState, useRef, ReactNode } from 'react';
import { theme } from '@/lib/theme';

interface InteractiveCardProps {
  children: ReactNode;
  className?: string;
  intensity?: number;
  glowColor?: string;
}

export default function InteractiveCard({
  children,
  className = '',
  intensity = 0.1,
  glowColor = 'rgba(59, 130, 246, 0.5)'
}: InteractiveCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;

    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setMousePosition({ x, y });
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setMousePosition({ x: 0, y: 0 });
  };

  const getTransform = () => {
    if (!isHovered || !cardRef.current) return '';

    const rect = cardRef.current.getBoundingClientRect();
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = (mousePosition.y - centerY) * intensity * -1;
    const rotateY = (mousePosition.x - centerX) * intensity;

    return `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(${isHovered ? '10px' : '0px'})`;
  };

  const getGlowPosition = () => {
    if (!isHovered || !cardRef.current) return { x: '50%', y: '50%' };

    const rect = cardRef.current.getBoundingClientRect();
    const x = (mousePosition.x / rect.width) * 100;
    const y = (mousePosition.y / rect.height) * 100;

    return { x: `${x}%`, y: `${y}%` };
  };

  const glowPosition = getGlowPosition();

  return (
    <div
      ref={cardRef}
      className={`relative transition-all duration-300 ease-out ${className}`}
      style={{
        transform: getTransform(),
        transformStyle: 'preserve-3d'
      }}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Glow Effect */}
      {isHovered && (
        <div
          className="absolute inset-0 rounded-lg opacity-50 blur-xl transition-all duration-300 pointer-events-none"
          style={{
            background: `radial-gradient(circle 200px at ${glowPosition.x} ${glowPosition.y}, ${glowColor}, transparent)`,
            zIndex: -1
          }}
        />
      )}

      {/* Shine Effect */}
      {isHovered && (
        <div
          className="absolute inset-0 rounded-lg opacity-20 transition-all duration-300 pointer-events-none"
          style={{
            background: `radial-gradient(circle 100px at ${glowPosition.x} ${glowPosition.y}, rgba(255, 255, 255, 0.8), transparent)`,
          }}
        />
      )}

      {/* Card Content */}
      <div
        className="relative z-10 h-full w-full"
        style={{
          transform: 'translateZ(20px)'
        }}
      >
        {children}
      </div>

      {/* Border Highlight */}
      {isHovered && (
        <div
          className={`absolute inset-0 rounded-lg border-2 ${theme.borderColors.muted}/20 pointer-events-none transition-all duration-300`}
          style={{
            boxShadow: `0 0 20px ${glowColor}`
          }}
        />
      )}
    </div>
  );
}
