'use client';

import React, { useEffect, useState } from 'react';

interface CelebrationConfettiProps {
  isActive: boolean;
  onComplete?: () => void;
  colors?: string[];
  particleCount?: number;
  duration?: number;
}

interface Particle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  size: number;
  gravity: number;
  life: number;
  maxLife: number;
}

const CelebrationConfetti: React.FC<CelebrationConfettiProps> = ({
  isActive,
  onComplete,
  colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD', '#98D8C8'],
  particleCount = 50,
  duration = 3000
}) => {
  const [particles, setParticles] = useState<Particle[]>([]);
  const [animationId, setAnimationId] = useState<number | null>(null);

  useEffect(() => {
    if (isActive) {
      startConfetti();
      const timer = setTimeout(() => {
        stopConfetti();
        onComplete?.();
      }, duration);

      return () => {
        clearTimeout(timer);
        stopConfetti();
      };
    }
  }, [isActive, duration, onComplete]);

  const createParticle = (index: number): Particle => {
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;
    
    return {
      id: index,
      x: centerX + (Math.random() - 0.5) * 100,
      y: centerY + (Math.random() - 0.5) * 100,
      vx: (Math.random() - 0.5) * 20,
      vy: Math.random() * -15 - 5,
      color: colors[Math.floor(Math.random() * colors.length)],
      size: Math.random() * 8 + 4,
      gravity: 0.3,
      life: 1,
      maxLife: Math.random() * 100 + 50
    };
  };

  const startConfetti = () => {
    const newParticles = Array.from({ length: particleCount }, (_, i) => createParticle(i));
    setParticles(newParticles);
    animate(newParticles);
  };

  const animate = (currentParticles: Particle[]) => {
    const updateParticles = () => {
      setParticles(prevParticles => {
        const updated = prevParticles.map(particle => ({
          ...particle,
          x: particle.x + particle.vx,
          y: particle.y + particle.vy,
          vy: particle.vy + particle.gravity,
          life: particle.life - 1 / particle.maxLife
        })).filter(particle => 
          particle.life > 0 && 
          particle.y < window.innerHeight + 50 &&
          particle.x > -50 && 
          particle.x < window.innerWidth + 50
        );

        if (updated.length === 0) {
          stopConfetti();
          return [];
        }

        return updated;
      });

      const id = requestAnimationFrame(updateParticles);
      setAnimationId(id);
    };

    updateParticles();
  };

  const stopConfetti = () => {
    if (animationId) {
      cancelAnimationFrame(animationId);
      setAnimationId(null);
    }
    setParticles([]);
  };

  if (!isActive && particles.length === 0) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-50">
      {particles.map(particle => (
        <div
          key={particle.id}
          className="absolute rounded-full animate-spin"
          style={{
            left: `${particle.x}px`,
            top: `${particle.y}px`,
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            backgroundColor: particle.color,
            opacity: particle.life,
            transform: `rotate(${particle.x * 2}deg)`,
            boxShadow: `0 0 6px ${particle.color}40`
          }}
        />
      ))}
    </div>
  );
};

export default CelebrationConfetti;
