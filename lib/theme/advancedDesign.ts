/**
 * Finance Quest - Advanced Visual Design System v3.0
 * 
 * Next-generation design enhancements with micro-interactions,
 * advanced typography, premium visual effects, and sophisticated layouts
 */

// Enhanced Animation System with Micro-Interactions
const microAnimations = {
    // Spring-based animations for natural feel
    spring: {
        type: "spring",
        stiffness: 300,
        damping: 30
    },

    springGentle: {
        type: "spring",
        stiffness: 200,
        damping: 25
    },

    springBouncy: {
        type: "spring",
        stiffness: 400,
        damping: 20
    },

    // Easing curves for professional feel
    easing: {
        smooth: "cubic-bezier(0.4, 0, 0.2, 1)",
        bounce: "cubic-bezier(0.68, -0.55, 0.265, 1.55)",
        elastic: "cubic-bezier(0.175, 0.885, 0.32, 1.275)",
        snappy: "cubic-bezier(0.25, 0.46, 0.45, 0.94)"
    },

    // Pre-configured animation variants
    variants: {
        fadeInUp: {
            hidden: { opacity: 0, y: 30 },
            visible: {
                opacity: 1,
                y: 0,
                transition: { duration: 0.6, ease: "cubic-bezier(0.4, 0, 0.2, 1)" }
            }
        },

        slideInLeft: {
            hidden: { opacity: 0, x: -50 },
            visible: {
                opacity: 1,
                x: 0,
                transition: { duration: 0.5, ease: "cubic-bezier(0.4, 0, 0.2, 1)" }
            }
        },

        scaleIn: {
            hidden: { opacity: 0, scale: 0.8 },
            visible: {
                opacity: 1,
                scale: 1,
                transition: { duration: 0.4, ease: "cubic-bezier(0.175, 0.885, 0.32, 1.275)" }
            }
        },

        stagger: {
            visible: {
                transition: {
                    staggerChildren: 0.1,
                    delayChildren: 0.2
                }
            }
        },

        // Hover animations
        lift: {
            rest: { y: 0, scale: 1 },
            hover: {
                y: -8,
                scale: 1.02,
                transition: { duration: 0.3, ease: "cubic-bezier(0.4, 0, 0.2, 1)" }
            },
            tap: { scale: 0.98, y: -4 }
        },

        // Button press feedback
        buttonPress: {
            rest: { scale: 1 },
            hover: { scale: 1.05 },
            tap: { scale: 0.95 }
        },

        // Card interactions
        cardHover: {
            rest: {
                y: 0,
                scale: 1,
                rotateX: 0,
                boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)"
            },
            hover: {
                y: -12,
                scale: 1.03,
                rotateX: 5,
                boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
                transition: { duration: 0.4, ease: "cubic-bezier(0.4, 0, 0.2, 1)" }
            }
        }
    }
} as const;

// Advanced Typography Scale with Mathematical Ratios
const advancedTypography = {
    // Perfect Fourth Scale (1.333)
    scale: {
        xs: '0.75rem',     // 12px
        sm: '0.875rem',    // 14px
        base: '1rem',      // 16px
        lg: '1.125rem',    // 18px
        xl: '1.25rem',     // 20px
        '2xl': '1.5rem',   // 24px
        '3xl': '1.875rem', // 30px
        '4xl': '2.25rem',  // 36px
        '5xl': '3rem',     // 48px
        '6xl': '3.75rem',  // 60px
        '7xl': '4.5rem',   // 72px
        '8xl': '6rem',     // 96px
        '9xl': '8rem'      // 128px
    },

    // Enhanced font weights with semantic meaning
    weights: {
        thin: '100',
        extralight: '200',
        light: '300',
        normal: '400',
        medium: '500',
        semibold: '600',
        bold: '700',
        extrabold: '800',
        black: '900'
    },

    // Professional line heights
    lineHeights: {
        none: '1',
        tight: '1.25',
        snug: '1.375',
        normal: '1.5',
        relaxed: '1.625',
        loose: '2'
    },

    // Enhanced letter spacing
    letterSpacing: {
        tighter: '-0.05em',
        tight: '-0.025em',
        normal: '0',
        wide: '0.025em',
        wider: '0.05em',
        widest: '0.1em'
    },

    // Semantic text styles
    styles: {
        displayLarge: 'text-6xl font-bold leading-none tracking-tight',
        displayMedium: 'text-5xl font-bold leading-tight tracking-tight',
        displaySmall: 'text-4xl font-bold leading-tight tracking-tight',

        headlineLarge: 'text-3xl font-semibold leading-tight tracking-tight',
        headlineMedium: 'text-2xl font-semibold leading-tight tracking-tight',
        headlineSmall: 'text-xl font-semibold leading-snug tracking-tight',

        titleLarge: 'text-lg font-medium leading-snug',
        titleMedium: 'text-base font-medium leading-normal',
        titleSmall: 'text-sm font-medium leading-normal',

        bodyLarge: 'text-lg font-normal leading-relaxed',
        bodyMedium: 'text-base font-normal leading-relaxed',
        bodySmall: 'text-sm font-normal leading-normal',

        labelLarge: 'text-sm font-medium leading-normal tracking-wide',
        labelMedium: 'text-xs font-medium leading-normal tracking-wide',
        labelSmall: 'text-xs font-medium leading-tight tracking-wider uppercase',

        // Financial-specific styles
        currency: 'font-mono text-lg font-semibold tabular-nums',
        currencyLarge: 'font-mono text-2xl font-bold tabular-nums',
        percentage: 'font-mono text-base font-medium tabular-nums',
        metric: 'font-mono text-xl font-semibold tabular-nums'
    }
} as const;

// Enhanced Layout System with Professional Spacing
const advancedLayouts = {
    // Container sizes for different content types
    containers: {
        xs: 'max-w-sm',      // 384px - mobile cards
        sm: 'max-w-md',      // 448px - small forms
        md: 'max-w-lg',      // 512px - medium content
        lg: 'max-w-2xl',     // 672px - articles
        xl: 'max-w-4xl',     // 896px - main content
        '2xl': 'max-w-6xl',  // 1152px - dashboard
        '3xl': 'max-w-7xl',  // 1280px - full layout
        full: 'max-w-full'
    },

    // Professional spacing scale based on 8px grid
    spacing: {
        px: '1px',
        0: '0',
        0.5: '0.125rem',   // 2px
        1: '0.25rem',      // 4px
        1.5: '0.375rem',   // 6px
        2: '0.5rem',       // 8px
        2.5: '0.625rem',   // 10px
        3: '0.75rem',      // 12px
        3.5: '0.875rem',   // 14px
        4: '1rem',         // 16px
        5: '1.25rem',      // 20px
        6: '1.5rem',       // 24px
        7: '1.75rem',      // 28px
        8: '2rem',         // 32px
        9: '2.25rem',      // 36px
        10: '2.5rem',      // 40px
        11: '2.75rem',     // 44px
        12: '3rem',        // 48px
        14: '3.5rem',      // 56px
        16: '4rem',        // 64px
        20: '5rem',        // 80px
        24: '6rem',        // 96px
        28: '7rem',        // 112px
        32: '8rem',        // 128px
        36: '9rem',        // 144px
        40: '10rem',       // 160px
        44: '11rem',       // 176px
        48: '12rem',       // 192px
        52: '13rem',       // 208px
        56: '14rem',       // 224px
        60: '15rem',       // 240px
        64: '16rem',       // 256px
        72: '18rem',       // 288px
        80: '20rem',       // 320px
        96: '24rem'        // 384px
    },

    // Grid systems for complex layouts
    grids: {
        autoFit: (minWidth: string) => `grid-cols-[repeat(auto-fit,minmax(${minWidth},1fr))]`,
        autoFill: (minWidth: string) => `grid-cols-[repeat(auto-fill,minmax(${minWidth},1fr))]`,
        responsive: {
            '1-2': 'grid-cols-1 md:grid-cols-2',
            '1-2-3': 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
            '1-2-4': 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
            '2-3-4': 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4',
            'calculator': 'grid-cols-1 lg:grid-cols-2',
            'dashboard': 'grid-cols-1 md:grid-cols-2 xl:grid-cols-3'
        }
    },

    // Flexbox utilities for common patterns
    flex: {
        center: 'flex items-center justify-center',
        centerBetween: 'flex items-center justify-between',
        centerStart: 'flex items-center justify-start',
        centerEnd: 'flex items-center justify-end',
        startBetween: 'flex items-start justify-between',
        endBetween: 'flex items-end justify-between',
        column: 'flex flex-col',
        columnCenter: 'flex flex-col items-center justify-center',
        columnStart: 'flex flex-col items-start',
        columnEnd: 'flex flex-col items-end'
    }
} as const;

// Enhanced Color Palette with Perceptual Color Science
const advancedColors = {
    // Primary brand colors with full HSL range
    brand: {
        50: 'hsl(214, 100%, 97%)',
        100: 'hsl(214, 95%, 93%)',
        200: 'hsl(213, 97%, 87%)',
        300: 'hsl(212, 96%, 78%)',
        400: 'hsl(213, 94%, 68%)',
        500: 'hsl(217, 91%, 60%)',   // Primary
        600: 'hsl(221, 83%, 53%)',
        700: 'hsl(224, 76%, 48%)',
        800: 'hsl(226, 71%, 40%)',
        900: 'hsl(224, 64%, 33%)',
        950: 'hsl(226, 55%, 21%)'
    },

    // Accent colors optimized for financial UI
    accent: {
        50: 'hsl(48, 100%, 96%)',
        100: 'hsl(48, 96%, 89%)',
        200: 'hsl(48, 97%, 77%)',
        300: 'hsl(46, 97%, 65%)',
        400: 'hsl(43, 96%, 56%)',
        500: 'hsl(38, 92%, 50%)',    // Accent
        600: 'hsl(32, 95%, 44%)',
        700: 'hsl(26, 90%, 37%)',
        800: 'hsl(23, 84%, 31%)',
        900: 'hsl(22, 78%, 26%)',
        950: 'hsl(21, 91%, 14%)'
    },

    // Success/Growth colors (optimized for financial gains)
    success: {
        50: 'hsl(138, 76%, 97%)',
        100: 'hsl(141, 84%, 93%)',
        200: 'hsl(141, 79%, 85%)',
        300: 'hsl(142, 77%, 73%)',
        400: 'hsl(142, 69%, 58%)',
        500: 'hsl(142, 71%, 45%)',   // Success
        600: 'hsl(142, 76%, 36%)',
        700: 'hsl(142, 72%, 29%)',
        800: 'hsl(143, 64%, 24%)',
        900: 'hsl(144, 61%, 20%)',
        950: 'hsl(145, 80%, 10%)'
    },

    // Warning/Caution colors
    warning: {
        50: 'hsl(54, 91%, 95%)',
        100: 'hsl(55, 97%, 88%)',
        200: 'hsl(53, 98%, 77%)',
        300: 'hsl(50, 98%, 64%)',
        400: 'hsl(48, 96%, 53%)',
        500: 'hsl(45, 93%, 47%)',    // Warning
        600: 'hsl(41, 96%, 40%)',
        700: 'hsl(35, 91%, 33%)',
        800: 'hsl(32, 81%, 29%)',
        900: 'hsl(28, 73%, 26%)',
        950: 'hsl(26, 83%, 14%)'
    },

    // Error/Loss colors (optimized for financial losses)
    error: {
        50: 'hsl(0, 86%, 97%)',
        100: 'hsl(0, 93%, 94%)',
        200: 'hsl(0, 96%, 89%)',
        300: 'hsl(0, 94%, 82%)',
        400: 'hsl(0, 91%, 71%)',
        500: 'hsl(0, 84%, 60%)',     // Error
        600: 'hsl(0, 72%, 51%)',
        700: 'hsl(0, 74%, 42%)',
        800: 'hsl(0, 70%, 35%)',
        900: 'hsl(0, 63%, 31%)',
        950: 'hsl(0, 75%, 15%)'
    },

    // Premium purple for pro features
    premium: {
        50: 'hsl(270, 100%, 98%)',
        100: 'hsl(269, 100%, 95%)',
        200: 'hsl(269, 100%, 92%)',
        300: 'hsl(268, 100%, 86%)',
        400: 'hsl(270, 95%, 77%)',
        500: 'hsl(271, 91%, 65%)',   // Premium
        600: 'hsl(271, 81%, 56%)',
        700: 'hsl(272, 72%, 47%)',
        800: 'hsl(272, 67%, 39%)',
        900: 'hsl(273, 61%, 32%)',
        950: 'hsl(274, 87%, 21%)'
    }
} as const;

// Advanced Shadow System with Elevation Layers
const advancedShadows = {
    // Material Design inspired elevation system
    elevation: {
        0: 'none',
        1: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        2: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
        3: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        4: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        5: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        6: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        7: '0 35px 60px -12px rgba(0, 0, 0, 0.35)'
    },

    // Colored shadows for brand elements
    colored: {
        brand: '0 10px 25px -5px rgba(59, 130, 246, 0.3)',
        brandHover: '0 20px 40px -5px rgba(59, 130, 246, 0.4)',
        accent: '0 10px 25px -5px rgba(245, 158, 11, 0.3)',
        accentHover: '0 20px 40px -5px rgba(245, 158, 11, 0.4)',
        success: '0 10px 25px -5px rgba(16, 185, 129, 0.3)',
        error: '0 10px 25px -5px rgba(239, 68, 68, 0.3)',
        premium: '0 10px 25px -5px rgba(139, 92, 246, 0.3)'
    },

    // Inner shadows for depth
    inner: {
        soft: 'inset 0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        medium: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.1)',
        strong: 'inset 0 4px 8px 0 rgba(0, 0, 0, 0.15)'
    }
} as const;

// Advanced Border Radius System
const advancedBorderRadius = {
    none: '0',
    xs: '0.125rem',      // 2px
    sm: '0.25rem',       // 4px
    base: '0.375rem',    // 6px
    md: '0.5rem',        // 8px
    lg: '0.75rem',       // 12px
    xl: '1rem',          // 16px
    '2xl': '1.5rem',     // 24px
    '3xl': '2rem',       // 32px
    full: '9999px',

    // Semantic border radius
    button: '0.5rem',
    card: '1rem',
    modal: '1.5rem',
    pill: '9999px'
} as const;

// Component-Specific Design Patterns
const designPatterns = {
    // Glass morphism with multiple variants
    glassMorphism: {
        subtle: 'bg-white/5 backdrop-blur-md border border-white/10',
        medium: 'bg-white/10 backdrop-blur-lg border border-white/20',
        strong: 'bg-white/15 backdrop-blur-xl border border-white/30'
    },

    // Neumorphism for special elements
    neumorphism: {
        raised: 'bg-slate-100 shadow-[8px_8px_16px_#d1d9e6,-8px_-8px_16px_#ffffff]',
        pressed: 'bg-slate-100 shadow-[inset_8px_8px_16px_#d1d9e6,inset_-8px_-8px_16px_#ffffff]'
    },

    // Gradient overlays
    gradientOverlays: {
        primary: 'bg-gradient-to-r from-blue-500/20 to-purple-600/20',
        accent: 'bg-gradient-to-r from-amber-400/20 to-orange-500/20',
        success: 'bg-gradient-to-r from-emerald-400/20 to-teal-500/20',
        premium: 'bg-gradient-to-r from-purple-500/20 to-pink-500/20'
    },

    // Interactive states
    interactiveStates: {
        hover: 'transition-all duration-300 ease-out hover:scale-105 hover:-translate-y-2',
        press: 'active:scale-95 active:translate-y-0',
        focus: 'focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500',
        disabled: 'opacity-50 cursor-not-allowed pointer-events-none'
    },

    // Loading states
    loadingStates: {
        pulse: 'animate-pulse bg-gradient-to-r from-slate-200 via-slate-300 to-slate-200 bg-[length:200%_100%]',
        shimmer: 'relative overflow-hidden bg-slate-200 before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_2s_infinite] before:bg-gradient-to-r before:from-transparent before:via-white/60 before:to-transparent',
        skeleton: 'animate-pulse bg-slate-200 rounded'
    }
} as const;

export {
    microAnimations,
    advancedTypography,
    advancedLayouts,
    advancedColors,
    advancedShadows,
    advancedBorderRadius,
    designPatterns
};
