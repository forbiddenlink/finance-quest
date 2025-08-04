/**
 * Finance Quest - Enhanced Theme Configuration v2.0
 * 
 * Advanced theme system with modern fintech aesthetics, micro-interaction support,
 * and comprehensive design tokens for consistent visual hierarchy.
 */

// Extended Color Palette with Fintech-inspired Colors
export const colors = {
    // Primary Brand Colors (Enhanced Slate + Blue + Amber + Emerald)
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
        950: '#0a0f1c', // Ultra dark for depth
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
        950: '#172554', // Ultra dark blue
    },
    emerald: {
        50: '#ecfdf5',
        100: '#d1fae5',
        200: '#a7f3d0',
        300: '#6ee7b7',
        400: '#34d399',
        500: '#10b981',
        600: '#059669',
        700: '#047857',
        800: '#065f46',
        900: '#064e3b',
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
    // Fintech accent colors
    purple: {
        500: '#8b5cf6',
        600: '#7c3aed',
        700: '#6d28d9',
    },
    pink: {
        500: '#ec4899',
        600: '#db2777',
        700: '#be185d',
    },
    // Neutral palette
    white: '#ffffff',
    black: '#000000',
    transparent: 'transparent',
    current: 'currentColor',
} as const;

// Enhanced Background System with Depth Layers
export const backgrounds = {
    // Primary backgrounds
    primary: 'bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900',
    primaryLight: 'bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800',
    
    // Header and navigation
    header: 'bg-slate-950/90 backdrop-blur-xl border-b border-white/5',
    headerFloating: 'bg-slate-900/80 backdrop-blur-2xl shadow-xl shadow-black/20',
    
    // Card system with depth levels
    card: 'bg-white/5 backdrop-blur-xl',
    cardElevated: 'bg-white/8 backdrop-blur-xl',
    cardHover: 'bg-white/10 backdrop-blur-xl',
    cardPressed: 'bg-white/15 backdrop-blur-xl',
    cardDisabled: 'bg-white/3 backdrop-blur-xl',
    
    // Glass morphism variants
    glass: 'bg-white/5 backdrop-blur-xl border border-white/10',
    glassStrong: 'bg-white/10 backdrop-blur-2xl border border-white/20',
    glassSoft: 'bg-white/3 backdrop-blur-lg border border-white/5',
    
    // Overlay and modal backgrounds
    overlay: 'bg-black/50 backdrop-blur-sm',
    modal: 'bg-slate-900/95 backdrop-blur-xl border border-white/10',
    
    // Special effects
    shimmer: 'bg-gradient-to-r from-transparent via-white/10 to-transparent',
    glow: 'bg-gradient-radial from-blue-500/20 via-transparent to-transparent',
} as const;

// Enhanced Text Colors with Semantic Meaning
export const textColors = {
    // Primary hierarchy
    primary: 'text-white',
    secondary: 'text-slate-300',
    tertiary: 'text-slate-400',
    muted: 'text-slate-500',
    disabled: 'text-slate-600',
    
    // Brand and accent colors
    accent: 'text-amber-400',
    accentSecondary: 'text-amber-300',
    brand: 'text-blue-400',
    
    // Semantic colors
    success: 'text-emerald-400',
    successStrong: 'text-emerald-300',
    warning: 'text-amber-400',
    warningStrong: 'text-amber-300',
    error: 'text-red-400',
    errorStrong: 'text-red-300',
    info: 'text-blue-400',
    infoStrong: 'text-blue-300',
    
    // Interactive states
    link: 'text-blue-400 hover:text-blue-300',
    linkHover: 'text-blue-300',
    
    // Special gradients
    gradient: {
        primary: 'bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent',
        success: 'bg-gradient-to-r from-emerald-400 to-blue-500 bg-clip-text text-transparent',
        warning: 'bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent',
        premium: 'bg-gradient-to-r from-purple-400 via-pink-500 to-amber-400 bg-clip-text text-transparent',
    },
} as const;

// Enhanced Border System
export const borderColors = {
    primary: 'border-white/10',
    secondary: 'border-white/5',
    accent: 'border-amber-500/20',
    accentHover: 'border-amber-400/40',
    accentStrong: 'border-amber-400/60',
    muted: 'border-slate-700',
    strong: 'border-white/20',
    
    // Semantic borders
    success: 'border-emerald-500/30',
    warning: 'border-amber-500/30',
    error: 'border-red-500/30',
    info: 'border-blue-500/30',
    
    // Interactive states
    hover: 'border-white/20',
    focus: 'border-blue-500/50',
    active: 'border-amber-500/50',
} as const;

// Enhanced Button System with Micro-Interactions
export const buttons = {
    // Primary button variants
    primary: 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/30 border border-blue-400/20',
    primaryLarge: 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-xl shadow-blue-500/30 hover:shadow-2xl hover:shadow-blue-500/40 border border-blue-400/30',
    
    // Secondary variants
    secondary: 'bg-slate-700/80 hover:bg-slate-600/80 text-white border border-slate-600/50 hover:border-slate-500/50 shadow-lg hover:shadow-xl',
    
    // Accent variants
    accent: 'bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-900 shadow-lg shadow-amber-500/25 hover:shadow-xl hover:shadow-amber-500/30 border border-amber-400/20',
    
    // Success variant
    success: 'bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white shadow-lg shadow-emerald-500/25 hover:shadow-xl hover:shadow-emerald-500/30 border border-emerald-400/20',
    
    // Warning variant
    warning: 'bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white shadow-lg shadow-amber-500/25 hover:shadow-xl hover:shadow-amber-500/30 border border-amber-400/20',
    
    // Error variant
    error: 'bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white shadow-lg shadow-red-500/25 hover:shadow-xl hover:shadow-red-500/30 border border-red-400/20',
    
    // Ghost variants
    ghost: 'bg-transparent hover:bg-white/10 text-slate-300 hover:text-white border border-white/10 hover:border-white/20',
    ghostAccent: 'bg-transparent hover:bg-amber-500/10 text-amber-400 hover:text-amber-300 border border-amber-500/20 hover:border-amber-400/30',
    
    // Minimal variants
    minimal: 'bg-transparent hover:bg-white/5 text-slate-400 hover:text-white',
    minimalAccent: 'bg-transparent hover:bg-amber-500/5 text-amber-400 hover:text-amber-300',
} as const;

// Enhanced Tab System
export const tabs = {
    active: 'bg-gradient-to-r from-amber-500 to-amber-600 text-slate-900 shadow-lg shadow-amber-500/25 border border-amber-400/20',
    inactive: 'text-slate-300 hover:text-white hover:bg-slate-700/50 border border-transparent hover:border-white/10',
    container: 'bg-slate-900/80 backdrop-blur-xl border border-white/10 rounded-xl',
    list: 'bg-slate-800/50 backdrop-blur-xl border border-white/10 rounded-lg p-1',
} as const;

// Enhanced Progress System
export const progress = {
    bar: 'bg-gradient-to-r from-amber-500 to-blue-500',
    barSuccess: 'bg-gradient-to-r from-emerald-500 to-emerald-600',
    barWarning: 'bg-gradient-to-r from-amber-500 to-amber-600',
    barError: 'bg-gradient-to-r from-red-500 to-red-600',
    background: 'bg-slate-700/50',
    backgroundDark: 'bg-slate-800',
    text: 'text-slate-300',
    glow: 'shadow-lg shadow-blue-500/25',
} as const;

// Enhanced Status System
export const status = {
    success: {
        bg: 'bg-emerald-500/15',
        bgStrong: 'bg-emerald-500/25',
        border: 'border-emerald-500/30',
        borderStrong: 'border-emerald-500/50',
        text: 'text-emerald-400',
        textStrong: 'text-emerald-300',
        glow: 'shadow-lg shadow-emerald-500/20',
    },
    warning: {
        bg: 'bg-amber-500/15',
        bgStrong: 'bg-amber-500/25',
        border: 'border-amber-500/30',
        borderStrong: 'border-amber-500/50',
        text: 'text-amber-400',
        textStrong: 'text-amber-300',
        glow: 'shadow-lg shadow-amber-500/20',
    },
    error: {
        bg: 'bg-red-500/15',
        bgStrong: 'bg-red-500/25',
        border: 'border-red-500/30',
        borderStrong: 'border-red-500/50',
        text: 'text-red-400',
        textStrong: 'text-red-300',
        glow: 'shadow-lg shadow-red-500/20',
    },
    info: {
        bg: 'bg-blue-500/15',
        bgStrong: 'bg-blue-500/25',
        border: 'border-blue-500/30',
        borderStrong: 'border-blue-500/50',
        text: 'text-blue-400',
        textStrong: 'text-blue-300',
        glow: 'shadow-lg shadow-blue-500/20',
    },
    neutral: {
        bg: 'bg-slate-500/15',
        bgStrong: 'bg-slate-500/25',
        border: 'border-slate-500/30',
        borderStrong: 'border-slate-500/50',
        text: 'text-slate-400',
        textStrong: 'text-slate-300',
        glow: 'shadow-lg shadow-slate-500/20',
    },
} as const;

// Enhanced Interactive Elements with Micro-Interaction Support
export const interactive = {
    // Hover effects
    hover: 'hover:-translate-y-1 hover:shadow-xl transition-all duration-300 ease-out',
    hoverSoft: 'hover:-translate-y-0.5 hover:shadow-lg transition-all duration-200 ease-out',
    hoverStrong: 'hover:-translate-y-2 hover:shadow-2xl transition-all duration-400 ease-out',
    
    // Glow effects
    glow: 'hover:shadow-lg hover:shadow-amber-500/25 transition-shadow duration-300',
    glowBlue: 'hover:shadow-lg hover:shadow-blue-500/25 transition-shadow duration-300',
    glowGreen: 'hover:shadow-lg hover:shadow-emerald-500/25 transition-shadow duration-300',
    glowStrong: 'hover:shadow-xl hover:shadow-amber-500/40 transition-shadow duration-300',
    
    // Scale effects
    scale: 'hover:scale-105 transition-transform duration-200 ease-out',
    scaleSmall: 'hover:scale-102 transition-transform duration-150 ease-out',
    scaleLarge: 'hover:scale-110 transition-transform duration-300 ease-out',
    
    // Press effects
    press: 'active:scale-95 transition-transform duration-100',
    pressDeep: 'active:scale-90 transition-transform duration-150',
    
    // Combined effects for cards
    card: 'hover:-translate-y-1 hover:scale-102 hover:shadow-xl transition-all duration-300 ease-out cursor-pointer',
    cardStrong: 'hover:-translate-y-2 hover:scale-105 hover:shadow-2xl transition-all duration-400 ease-out cursor-pointer',
    
    // Focus states
    focus: 'focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:ring-offset-2 focus:ring-offset-slate-900',
    focusAccent: 'focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:ring-offset-2 focus:ring-offset-slate-900',
} as const;

// Enhanced Typography with Fintech Hierarchy
export const typography = {
    display: 'text-6xl font-bold tracking-tight',
    heading1: 'text-4xl font-bold tracking-tight',
    heading2: 'text-3xl font-bold tracking-tight',
    heading3: 'text-2xl font-semibold tracking-tight',
    heading4: 'text-xl font-semibold tracking-tight',
    heading5: 'text-lg font-semibold',
    heading6: 'text-base font-semibold',
    
    // Body text
    body: 'text-base leading-relaxed',
    bodyLarge: 'text-lg leading-relaxed',
    bodySmall: 'text-sm leading-relaxed',
    
    // Specialized text
    caption: 'text-xs leading-normal',
    overline: 'text-xs font-medium uppercase tracking-wider',
    label: 'text-sm font-medium',
    
    // Code and monospace
    code: 'font-mono text-sm',
    codeInline: 'font-mono text-xs bg-slate-800/50 px-1.5 py-0.5 rounded',
} as const;

// Enhanced Spacing System
export const spacing = {
    none: 'p-0',
    xs: 'p-2',
    sm: 'p-4',
    md: 'p-6', 
    lg: 'p-8',
    xl: 'p-12',
    xxl: 'p-16',
    
    // Specific spacing patterns
    cardPadding: 'p-6 lg:p-8',
    sectionPadding: 'px-4 py-8 sm:px-6 lg:px-8',
    containerPadding: 'px-4 sm:px-6 lg:px-8',
} as const;

// Enhanced Shadow System with Depth Layers
export const shadows = {
    none: 'shadow-none',
    sm: 'shadow-sm',
    md: 'shadow-md',
    lg: 'shadow-lg',
    xl: 'shadow-xl',
    '2xl': 'shadow-2xl',
    
    // Colored shadows for depth and emphasis
    glow: 'shadow-lg shadow-amber-500/25',
    glowStrong: 'shadow-xl shadow-amber-500/40',
    glowBlue: 'shadow-lg shadow-blue-500/25',
    glowGreen: 'shadow-lg shadow-emerald-500/25',
    glowPurple: 'shadow-lg shadow-purple-500/25',
    
    // Elevation system
    floating: 'shadow-2xl shadow-black/25',
    elevated: 'shadow-xl shadow-black/20',
    raised: 'shadow-lg shadow-black/15',
} as const;

// Enhanced Animation Durations and Easings
export const animations = {
    // Duration tokens
    duration: {
        fastest: 'duration-75',
        fast: 'duration-150',
        normal: 'duration-200',
        slow: 'duration-300',
        slower: 'duration-500',
        slowest: 'duration-700',
    },
    
    // Easing functions
    ease: {
        linear: 'ease-linear',
        in: 'ease-in',
        out: 'ease-out',
        inOut: 'ease-in-out',
    },
    
    // Common animation patterns
    fadeIn: 'animate-fade-in',
    slideUp: 'animate-slide-up',
    scaleIn: 'animate-scale-in',
    pulse: 'animate-pulse',
    bounce: 'animate-bounce',
    spin: 'animate-spin',
} as const;

// Utility functions for common component patterns
export const themeUtils = {
    // Enhanced glass morphism
    glass: (variant: 'soft' | 'normal' | 'strong' = 'normal') => {
        const variants = {
            soft: 'bg-white/3 backdrop-blur-lg border border-white/5',
            normal: 'bg-white/5 backdrop-blur-xl border border-white/10',
            strong: 'bg-white/10 backdrop-blur-2xl border border-white/20',
        };
        return `${variants[variant]} rounded-xl`;
    },
    
    // Enhanced interactive cards
    interactiveCard: (size: 'sm' | 'md' | 'lg' = 'md') => {
        const sizes = {
            sm: 'p-4',
            md: 'p-6',
            lg: 'p-8',
        };
        return `bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl ${sizes[size]} hover:-translate-y-1 hover:shadow-xl hover:shadow-amber-500/25 transition-all duration-300 cursor-pointer`;
    },
    
    // Enhanced page backgrounds with depth
    pageBackground: (variant: 'default' | 'dark' | 'light' = 'default') => {
        const variants = {
            default: 'min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900',
            dark: 'min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-black',
            light: 'min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800',
        };
        return `${variants[variant]} relative overflow-hidden`;
    },
    
    // Calculator container with enhanced spacing
    calculatorContainer: () => 'grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8',
    
    // Enhanced lesson cards
    lessonCard: () => 'bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-6 lg:p-8 mb-6 lg:mb-8',
    
    // Enhanced quiz containers
    quizContainer: () => 'bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-6 lg:p-8',
    
    // Section containers with responsive padding
    section: () => 'max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8 lg:py-12',
    
    // Form elements
    input: () => 'bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-colors',
    
    // Enhanced button with size variants
    button: (variant: 'primary' | 'secondary' | 'accent' = 'primary', size: 'sm' | 'md' | 'lg' = 'md') => {
        const sizeClasses = {
            sm: 'px-3 py-1.5 text-sm',
            md: 'px-4 py-2 text-base',
            lg: 'px-6 py-3 text-lg',
        };
        return `${buttons[variant]} ${sizeClasses[size]} rounded-lg font-semibold transition-all duration-200 ${interactive.focus}`;
    },

    // Calculator-specific utilities
    calculatorWrapper: () => 'max-w-7xl mx-auto bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl shadow-2xl',
    
    calculatorSection: () => 'bg-white/5 backdrop-blur-xl border border-white/10 rounded-lg p-6',
    
    calculatorInput: (hasError = false) => `
        w-full px-4 py-3 
        bg-slate-800/50 
        border ${hasError ? 'border-red-500 focus:border-red-500' : 'border-white/10 focus:border-yellow-500'} 
        rounded-lg 
        text-white placeholder-slate-400 
        focus:outline-none focus:ring-2 focus:ring-yellow-500/50 
        transition-all duration-200
    `,
    
    calculatorLabel: () => 'block text-sm font-medium text-white mb-2',
    
    calculatorResult: (variant: 'primary' | 'success' | 'warning' | 'error' | 'info' = 'primary') => {
        const variants = {
            primary: 'bg-white/5 border-white/10',
            success: 'bg-emerald-500/15 border-emerald-500/30',
            warning: 'bg-amber-500/15 border-amber-500/30',
            error: 'bg-red-500/15 border-red-500/30',
            info: 'bg-blue-500/15 border-blue-500/30'
        };
        return `${variants[variant]} border rounded-xl p-6 backdrop-blur-xl`;
    },
    
    calculatorChart: () => 'bg-white/5 border border-white/10 rounded-lg p-4 backdrop-blur-xl',
    
    calculatorInsight: (type: 'success' | 'warning' | 'error' | 'info' = 'info') => {
        const variants = {
            success: 'bg-emerald-500/15 border-emerald-500/30 text-emerald-400',
            warning: 'bg-amber-500/15 border-amber-500/30 text-amber-400',
            error: 'bg-red-500/15 border-red-500/30 text-red-400',
            info: 'bg-blue-500/15 border-blue-500/30 text-blue-400'
        };
        return `${variants[type]} border rounded-lg p-4 backdrop-blur-xl`;
    },
    
    calculatorGrid: () => 'grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8',
    
    calculatorFieldGrid: (cols: 1 | 2 | 3 | 4 = 2) => `grid grid-cols-1 ${cols >= 2 ? 'md:grid-cols-2' : ''} ${cols >= 3 ? 'lg:grid-cols-3' : ''} ${cols >= 4 ? 'xl:grid-cols-4' : ''} gap-4`,
    
    calculatorValidationError: () => 'text-red-400 text-sm mt-1 flex items-center gap-1',
    
    calculatorLoadingSpinner: () => 'animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-500',
    
    calculatorProgressBar: (percentage: number) => `
        relative w-full bg-slate-700 rounded-full h-4 overflow-hidden
    `,
    
    calculatorMetric: () => 'text-center p-4 bg-white/5 border border-white/10 rounded-lg backdrop-blur-xl',
    
    calculatorTooltip: () => 'absolute z-10 px-3 py-2 text-sm bg-slate-800 border border-white/10 rounded-lg shadow-xl backdrop-blur-xl',
} as const;

// Complete enhanced theme object
// Import gradient utilities
import { 
    gradientBackgrounds, 
    consistentTextColors, 
    consistentBorders,
    getGradientClass,
    getCelebrationGradient,
    getMarketGradient,
    getConsistentCardClasses,
    getConsistentButtonClasses
} from './gradients';

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
    animations,
    utils: themeUtils,
    
    // Enhanced gradient system
    gradients: {
        backgrounds: gradientBackgrounds,
        getClass: getGradientClass,
        celebration: getCelebrationGradient,
        market: getMarketGradient
    },
    
    // Consistent component utilities
    consistent: {
        textColors: consistentTextColors,
        borders: consistentBorders,
        cardClasses: getConsistentCardClasses,
        buttonClasses: getConsistentButtonClasses
    }
} as const;

export default theme;

// Re-export gradient utilities for direct import
export {
    gradientBackgrounds,
    consistentTextColors,
    consistentBorders,
    getGradientClass,
    getCelebrationGradient,
    getMarketGradient,
    getConsistentCardClasses,
    getConsistentButtonClasses
};
