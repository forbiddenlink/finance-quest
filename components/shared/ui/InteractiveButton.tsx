'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { LucideIcon, Loader2 } from 'lucide-react';

interface InteractiveButtonProps {
  children: React.ReactNode;
  onClick?: () => void | Promise<void>;
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'ghost';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  icon?: LucideIcon;
  iconPosition?: 'left' | 'right';
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
  className?: string;
  withRipple?: boolean;
  withGlow?: boolean;
  withPulse?: boolean;
  withBounce?: boolean;
  pressDepth?: number;
}

export default function InteractiveButton({
  children,
  onClick,
  variant = 'primary',
  size = 'md',
  icon: Icon,
  iconPosition = 'left',
  disabled = false,
  loading = false,
  fullWidth = false,
  className = '',
  withRipple = true,
  withGlow = false,
  withPulse = false,
  withBounce = false,
  pressDepth = 2
}: InteractiveButtonProps) {
  const [isPressed, setIsPressed] = useState(false);
  const [ripples, setRipples] = useState<Array<{ id: number; x: number; y: number }>>([]);
  const [isLoading, setIsLoading] = useState(false);

  const getVariantClasses = () => {
    switch (variant) {
      case 'primary':
        return {
          bg: 'bg-gradient-to-r from-blue-600 to-blue-700',
          hover: 'hover:from-blue-500 hover:to-blue-600',
          text: 'text-white',
          border: 'border-blue-500',
          shadow: 'shadow-blue-500/25',
          glow: 'shadow-blue-500/50'
        };
      case 'secondary':
        return {
          bg: 'bg-gradient-to-r from-gray-600 to-gray-700',
          hover: 'hover:from-gray-500 hover:to-gray-600',
          text: 'text-white',
          border: 'border-gray-500',
          shadow: 'shadow-gray-500/25',
          glow: 'shadow-gray-500/50'
        };
      case 'success':
        return {
          bg: 'bg-gradient-to-r from-green-600 to-green-700',
          hover: 'hover:from-green-500 hover:to-green-600',
          text: 'text-white',
          border: 'border-green-500',
          shadow: 'shadow-green-500/25',
          glow: 'shadow-green-500/50'
        };
      case 'warning':
        return {
          bg: 'bg-gradient-to-r from-amber-600 to-amber-700',
          hover: 'hover:from-amber-500 hover:to-amber-600',
          text: 'text-white',
          border: 'border-amber-500',
          shadow: 'shadow-amber-500/25',
          glow: 'shadow-amber-500/50'
        };
      case 'error':
        return {
          bg: 'bg-gradient-to-r from-red-600 to-red-700',
          hover: 'hover:from-red-500 hover:to-red-600',
          text: 'text-white',
          border: 'border-red-500',
          shadow: 'shadow-red-500/25',
          glow: 'shadow-red-500/50'
        };
      case 'ghost':
        return {
          bg: 'bg-transparent',
          hover: 'hover:bg-white/5',
          text: 'text-white',
          border: 'border-white/20',
          shadow: 'shadow-none',
          glow: 'shadow-white/20'
        };
      default:
        return {
          bg: 'bg-gradient-to-r from-blue-600 to-blue-700',
          hover: 'hover:from-blue-500 hover:to-blue-600',
          text: 'text-white',
          border: 'border-blue-500',
          shadow: 'shadow-blue-500/25',
          glow: 'shadow-blue-500/50'
        };
    }
  };

  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return { padding: 'px-3 py-2', text: 'text-sm', icon: 'w-4 h-4' };
      case 'md':
        return { padding: 'px-4 py-2', text: 'text-base', icon: 'w-5 h-5' };
      case 'lg':
        return { padding: 'px-6 py-3', text: 'text-lg', icon: 'w-6 h-6' };
      case 'xl':
        return { padding: 'px-8 py-4', text: 'text-xl', icon: 'w-7 h-7' };
      default:
        return { padding: 'px-4 py-2', text: 'text-base', icon: 'w-5 h-5' };
    }
  };

  const variantClasses = getVariantClasses();
  const sizeClasses = getSizeClasses();

  const handleClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
    if (disabled || loading || isLoading) return;

    // Create ripple effect
    if (withRipple) {
      const rect = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const newRipple = { id: Date.now(), x, y };
      
      setRipples(prev => [...prev, newRipple]);
      setTimeout(() => {
        setRipples(prev => prev.filter(ripple => ripple.id !== newRipple.id));
      }, 600);
    }

    // Handle async operations
    if (onClick) {
      try {
        setIsLoading(true);
        await onClick();
      } finally {
        setIsLoading(false);
      }
    }
  };

  const isButtonLoading = loading || isLoading;

  return (
    <motion.button
      className={`
        relative overflow-hidden font-semibold rounded-lg border transition-all duration-200
        ${sizeClasses.padding} ${sizeClasses.text} ${variantClasses.bg} ${variantClasses.hover} 
        ${variantClasses.text} ${variantClasses.border} ${variantClasses.shadow}
        ${withGlow ? `${variantClasses.glow} shadow-lg` : ''}
        ${fullWidth ? 'w-full' : ''}
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        ${className}
        focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:ring-offset-2 focus:ring-offset-gray-900
      `}
      onClick={handleClick}
      disabled={disabled || isButtonLoading}
      onMouseDown={() => setIsPressed(true)}
      onMouseUp={() => setIsPressed(false)}
      onMouseLeave={() => setIsPressed(false)}
      whileHover={!disabled ? { 
        scale: withBounce ? 1.05 : 1.02,
        y: -1
      } : {}}
      whileTap={!disabled ? { 
        scale: 0.98,
        y: pressDepth
      } : {}}
      animate={withPulse ? {
        boxShadow: [
          `0 0 0 0 ${variantClasses.glow}`,
          `0 0 0 10px transparent`,
          `0 0 0 0 transparent`
        ]
      } : {}}
      transition={{
        boxShadow: { duration: 1, repeat: Infinity }
      }}
    >
      {/* Background shine effect */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12"
        initial={{ x: '-100%' }}
        animate={{ x: '200%' }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
          delay: Math.random() * 2
        }}
      />

      {/* Ripple effects */}
      {withRipple && ripples.map(ripple => (
        <motion.div
          key={ripple.id}
          className="absolute rounded-full bg-white/20 pointer-events-none"
          style={{
            left: ripple.x - 10,
            top: ripple.y - 10,
          }}
          initial={{ width: 20, height: 20, opacity: 0.8 }}
          animate={{ 
            width: 100, 
            height: 100, 
            opacity: 0,
            x: -40,
            y: -40
          }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        />
      ))}

      {/* Button content */}
      <div className="relative z-10 flex items-center justify-center space-x-2">
        {Icon && iconPosition === 'left' && !isButtonLoading && (
          <motion.div
            animate={withBounce ? { rotate: [0, 10, -10, 0] } : {}}
            transition={{ duration: 0.3 }}
          >
            <Icon className={`${sizeClasses.icon}`} />
          </motion.div>
        )}
        
        {isButtonLoading && (
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          >
            <Loader2 className={`${sizeClasses.icon}`} />
          </motion.div>
        )}
        
        <span className={isButtonLoading ? 'opacity-75' : ''}>
          {children}
        </span>
        
        {Icon && iconPosition === 'right' && !isButtonLoading && (
          <motion.div
            animate={withBounce ? { rotate: [0, 10, -10, 0] } : {}}
            transition={{ duration: 0.3 }}
          >
            <Icon className={`${sizeClasses.icon}`} />
          </motion.div>
        )}
      </div>

      {/* Press depth shadow */}
      {isPressed && (
        <motion.div
          className="absolute inset-0 bg-black/20 rounded-lg"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.1 }}
        />
      )}
    </motion.button>
  );
}
