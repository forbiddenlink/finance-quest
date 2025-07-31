/**
 * Finance Quest - Centralized Theme Configuration
 * 
 * This file contains all theme colors, gradients, and design tokens
 * used throughout the Finance Quest application for consistency.
 */

// Main Color Palette
export const colors = {
  // Primary Brand Colors (Slate + Blue + Amber)
  slate: {
    50: '#f8fafc',
    100: '#f1f5f9',
    200: '#e2e8f0',
    300: '#cbd5e1',
    400: '#94a3b8',
    500: '#64748b',
    600: '#475569',
    700: '#334155',
    800: '#1e293b',
    900: '#0f172a',
  },
  blue: {
    50: '#eff6ff',
    100: '#dbeafe',
    200: '#bfdbfe',
    300: '#93c5fd',
    400: '#60a5fa',
    500: '#3b82f6',
    600: '#2563eb',
    700: '#1d4ed8',
    800: '#1e40af',
    900: '#1e3a8a',
  },
  amber: {
    50: '#fffbeb',
    100: '#fef3c7',
    200: '#fde68a',
    300: '#fcd34d',
    400: '#fbbf24',
    500: '#f59e0b',
    600: '#d97706',
    700: '#b45309',
    800: '#92400e',
    900: '#78350f',
  },
  white: '#ffffff',
  black: '#000000',
  transparent: 'transparent',
  current: 'currentColor',
} as const;

// Background Gradients
export const backgrounds = {
  primary: 'bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800',
  header: 'bg-slate-900/80 backdrop-blur-xl',
  card: 'bg-white/5 backdrop-blur-xl',
  cardHover: 'bg-white/10 backdrop-blur-xl',
  glass: 'bg-white/5 backdrop-blur-xl border border-white/10',
} as const;

// Text Colors
export const textColors = {
  primary: 'text-white',
  secondary: 'text-slate-300',
  muted: 'text-slate-400',
  accent: 'text-amber-400',
  accentSecondary: 'text-amber-300',
  success: 'text-green-400',
  warning: 'text-yellow-400',
  error: 'text-red-400',
} as const;

// Border Colors
export const borderColors = {
  primary: 'border-white/10',
  accent: 'border-amber-500/20',
  accentHover: 'border-amber-400/40',
  muted: 'border-slate-600',
} as const;

// Button Styles
export const buttons = {
  primary: 'bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white',
  secondary: 'bg-slate-700 hover:bg-slate-600 text-white',
  accent: 'bg-amber-600 hover:bg-amber-700 text-slate-900',
  ghost: 'bg-transparent hover:bg-white/10 text-slate-300 hover:text-white',
} as const;

// Tab Styles
export const tabs = {
  active: 'bg-amber-600 text-slate-900',
  inactive: 'text-slate-300 hover:text-white hover:bg-slate-700/50',
  container: 'bg-slate-800/50 backdrop-blur-xl border border-white/10',
} as const;

// Progress Colors
export const progress = {
  bar: 'bg-gradient-to-r from-amber-500 to-blue-500',
  background: 'bg-slate-700',
  text: 'text-slate-300',
} as const;

// Status Colors
export const status = {
  success: {
    bg: 'bg-green-500/20',
    border: 'border-green-500/30',
    text: 'text-green-400',
  },
  warning: {
    bg: 'bg-yellow-500/20',
    border: 'border-yellow-500/30',
    text: 'text-yellow-400',
  },
  error: {
    bg: 'bg-red-500/20',
    border: 'border-red-500/30',
    text: 'text-red-400',
  },
  info: {
    bg: 'bg-blue-500/20',
    border: 'border-blue-500/30',
    text: 'text-blue-400',
  },
} as const;

// Interactive Elements
export const interactive = {
  hover: 'hover:-translate-y-1 hover:shadow-xl transition-all duration-300',
  glow: 'hover:shadow-lg hover:shadow-amber-500/25',
  scale: 'hover:scale-105 transition-transform duration-200',
} as const;

// Typography
export const typography = {
  heading1: 'text-4xl font-bold',
  heading2: 'text-3xl font-bold',
  heading3: 'text-2xl font-semibold',
  heading4: 'text-xl font-semibold',
  body: 'text-base',
  small: 'text-sm',
  tiny: 'text-xs',
} as const;

// Spacing
export const spacing = {
  xs: 'p-2',
  sm: 'p-4',
  md: 'p-6',
  lg: 'p-8',
  xl: 'p-12',
} as const;

// Shadows
export const shadows = {
  sm: 'shadow-sm',
  md: 'shadow-md',
  lg: 'shadow-lg',
  xl: 'shadow-xl',
  glow: 'shadow-lg shadow-amber-500/25',
} as const;

// Complete theme object for easy importing
export const theme = {
  colors,
  backgrounds,
  textColors,
  borderColors,
  buttons,
  tabs,
  progress,
  status,
  interactive,
  typography,
  spacing,
  shadows,
} as const;

export default theme;
