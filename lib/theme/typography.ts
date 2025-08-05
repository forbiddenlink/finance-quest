/**
 * Advanced Typography System for Finance Quest
 * Professional typography scale with semantic meaning and micro-animations
 */

export const advancedTypography = {
    // Professional type scale with Golden Ratio progression
    scale: {
        xs: '0.75rem',     // 12px - captions, helper text
        sm: '0.875rem',    // 14px - small body text
        base: '1rem',      // 16px - base body text
        lg: '1.125rem',    // 18px - large body text
        xl: '1.25rem',     // 20px - small headings
        '2xl': '1.5rem',   // 24px - h3 equivalent
        '3xl': '1.875rem', // 30px - h2 equivalent
        '4xl': '2.25rem',  // 36px - h1 equivalent
        '5xl': '3rem',     // 48px - hero text
        '6xl': '3.75rem',  // 60px - display text
        '7xl': '4.5rem',   // 72px - large display
        '8xl': '6rem',     // 96px - massive display
        '9xl': '8rem'      // 128px - hero display
    },

    // Professional line heights for readability
    lineHeight: {
        none: '1',
        tight: '1.25',
        snug: '1.375',
        normal: '1.5',
        relaxed: '1.625',
        loose: '2'
    },

    // Letter spacing for hierarchy and readability
    letterSpacing: {
        tighter: '-0.05em',
        tight: '-0.025em',
        normal: '0em',
        wide: '0.025em',
        wider: '0.05em',
        widest: '0.1em'
    },

    // Font weights with semantic meaning
    weight: {
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

    // Font families optimized for fintech
    family: {
        display: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
        body: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
        mono: "'JetBrains Mono', 'Fira Code', 'Monaco', 'Consolas', monospace",
        financial: "'SF Mono', 'Monaco', 'Inconsolata', 'Roboto Mono', monospace"
    }
} as const;

// Semantic typography system for consistent component usage
export const typographyTokens = {
    // Display typography for hero sections
    display: {
        hero: {
            fontSize: advancedTypography.scale['8xl'],
            lineHeight: advancedTypography.lineHeight.none,
            fontWeight: advancedTypography.weight.black,
            letterSpacing: advancedTypography.letterSpacing.tight,
            fontFamily: advancedTypography.family.display
        },
        large: {
            fontSize: advancedTypography.scale['6xl'],
            lineHeight: advancedTypography.lineHeight.tight,
            fontWeight: advancedTypography.weight.extrabold,
            letterSpacing: advancedTypography.letterSpacing.tight,
            fontFamily: advancedTypography.family.display
        },
        medium: {
            fontSize: advancedTypography.scale['5xl'],
            lineHeight: advancedTypography.lineHeight.tight,
            fontWeight: advancedTypography.weight.bold,
            letterSpacing: advancedTypography.letterSpacing.normal,
            fontFamily: advancedTypography.family.display
        }
    },

    // Heading hierarchy
    heading: {
        h1: {
            fontSize: advancedTypography.scale['4xl'],
            lineHeight: advancedTypography.lineHeight.tight,
            fontWeight: advancedTypography.weight.bold,
            letterSpacing: advancedTypography.letterSpacing.tight,
            fontFamily: advancedTypography.family.display
        },
        h2: {
            fontSize: advancedTypography.scale['3xl'],
            lineHeight: advancedTypography.lineHeight.tight,
            fontWeight: advancedTypography.weight.bold,
            letterSpacing: advancedTypography.letterSpacing.normal,
            fontFamily: advancedTypography.family.display
        },
        h3: {
            fontSize: advancedTypography.scale['2xl'],
            lineHeight: advancedTypography.lineHeight.snug,
            fontWeight: advancedTypography.weight.semibold,
            letterSpacing: advancedTypography.letterSpacing.normal,
            fontFamily: advancedTypography.family.display
        },
        h4: {
            fontSize: advancedTypography.scale.xl,
            lineHeight: advancedTypography.lineHeight.snug,
            fontWeight: advancedTypography.weight.semibold,
            letterSpacing: advancedTypography.letterSpacing.normal,
            fontFamily: advancedTypography.family.display
        },
        h5: {
            fontSize: advancedTypography.scale.lg,
            lineHeight: advancedTypography.lineHeight.normal,
            fontWeight: advancedTypography.weight.medium,
            letterSpacing: advancedTypography.letterSpacing.normal,
            fontFamily: advancedTypography.family.display
        },
        h6: {
            fontSize: advancedTypography.scale.base,
            lineHeight: advancedTypography.lineHeight.normal,
            fontWeight: advancedTypography.weight.medium,
            letterSpacing: advancedTypography.letterSpacing.wide,
            fontFamily: advancedTypography.family.display
        }
    },

    // Body text variants
    body: {
        large: {
            fontSize: advancedTypography.scale.lg,
            lineHeight: advancedTypography.lineHeight.relaxed,
            fontWeight: advancedTypography.weight.normal,
            letterSpacing: advancedTypography.letterSpacing.normal,
            fontFamily: advancedTypography.family.body
        },
        medium: {
            fontSize: advancedTypography.scale.base,
            lineHeight: advancedTypography.lineHeight.relaxed,
            fontWeight: advancedTypography.weight.normal,
            letterSpacing: advancedTypography.letterSpacing.normal,
            fontFamily: advancedTypography.family.body
        },
        small: {
            fontSize: advancedTypography.scale.sm,
            lineHeight: advancedTypography.lineHeight.normal,
            fontWeight: advancedTypography.weight.normal,
            letterSpacing: advancedTypography.letterSpacing.normal,
            fontFamily: advancedTypography.family.body
        }
    },

    // Specialized text types
    label: {
        large: {
            fontSize: advancedTypography.scale.base,
            lineHeight: advancedTypography.lineHeight.tight,
            fontWeight: advancedTypography.weight.medium,
            letterSpacing: advancedTypography.letterSpacing.normal,
            fontFamily: advancedTypography.family.body
        },
        medium: {
            fontSize: advancedTypography.scale.sm,
            lineHeight: advancedTypography.lineHeight.tight,
            fontWeight: advancedTypography.weight.medium,
            letterSpacing: advancedTypography.letterSpacing.normal,
            fontFamily: advancedTypography.family.body
        },
        small: {
            fontSize: advancedTypography.scale.xs,
            lineHeight: advancedTypography.lineHeight.tight,
            fontWeight: advancedTypography.weight.medium,
            letterSpacing: advancedTypography.letterSpacing.wide,
            fontFamily: advancedTypography.family.body
        }
    },

    // Financial data typography
    financial: {
        currency: {
            fontSize: advancedTypography.scale['2xl'],
            lineHeight: advancedTypography.lineHeight.none,
            fontWeight: advancedTypography.weight.bold,
            letterSpacing: advancedTypography.letterSpacing.tight,
            fontFamily: advancedTypography.family.financial
        },
        percentage: {
            fontSize: advancedTypography.scale.lg,
            lineHeight: advancedTypography.lineHeight.tight,
            fontWeight: advancedTypography.weight.semibold,
            letterSpacing: advancedTypography.letterSpacing.normal,
            fontFamily: advancedTypography.family.financial
        },
        metric: {
            fontSize: advancedTypography.scale.base,
            lineHeight: advancedTypography.lineHeight.tight,
            fontWeight: advancedTypography.weight.medium,
            letterSpacing: advancedTypography.letterSpacing.normal,
            fontFamily: advancedTypography.family.financial
        }
    },

    // Caption and helper text
    caption: {
        large: {
            fontSize: advancedTypography.scale.sm,
            lineHeight: advancedTypography.lineHeight.normal,
            fontWeight: advancedTypography.weight.normal,
            letterSpacing: advancedTypography.letterSpacing.normal,
            fontFamily: advancedTypography.family.body
        },
        medium: {
            fontSize: advancedTypography.scale.xs,
            lineHeight: advancedTypography.lineHeight.normal,
            fontWeight: advancedTypography.weight.normal,
            letterSpacing: advancedTypography.letterSpacing.normal,
            fontFamily: advancedTypography.family.body
        }
    },

    // Code and technical text
    code: {
        inline: {
            fontSize: advancedTypography.scale.sm,
            lineHeight: advancedTypography.lineHeight.tight,
            fontWeight: advancedTypography.weight.medium,
            letterSpacing: advancedTypography.letterSpacing.normal,
            fontFamily: advancedTypography.family.mono
        },
        block: {
            fontSize: advancedTypography.scale.sm,
            lineHeight: advancedTypography.lineHeight.relaxed,
            fontWeight: advancedTypography.weight.normal,
            letterSpacing: advancedTypography.letterSpacing.normal,
            fontFamily: advancedTypography.family.mono
        }
    }
} as const;

// Tailwind CSS class generators for typography
export const typographyClasses = {
    // Display classes
    displayHero: 'text-8xl font-black tracking-tight leading-none',
    displayLarge: 'text-6xl font-extrabold tracking-tight leading-tight',
    displayMedium: 'text-5xl font-bold tracking-normal leading-tight',

    // Heading classes
    h1: 'text-4xl font-bold tracking-tight leading-tight',
    h2: 'text-3xl font-bold tracking-normal leading-tight',
    h3: 'text-2xl font-semibold tracking-normal leading-snug',
    h4: 'text-xl font-semibold tracking-normal leading-snug',
    h5: 'text-lg font-medium tracking-normal leading-normal',
    h6: 'text-base font-medium tracking-wide leading-normal',

    // Body classes
    bodyLarge: 'text-lg font-normal tracking-normal leading-relaxed',
    bodyMedium: 'text-base font-normal tracking-normal leading-relaxed',
    bodySmall: 'text-sm font-normal tracking-normal leading-normal',

    // Label classes
    labelLarge: 'text-base font-medium tracking-normal leading-tight',
    labelMedium: 'text-sm font-medium tracking-normal leading-tight',
    labelSmall: 'text-xs font-medium tracking-wide leading-tight',

    // Financial classes
    currencyLarge: 'text-2xl font-bold tracking-tight leading-none font-mono',
    percentage: 'text-lg font-semibold tracking-normal leading-tight font-mono',
    metric: 'text-base font-medium tracking-normal leading-tight font-mono',

    // Caption classes
    captionLarge: 'text-sm font-normal tracking-normal leading-normal',
    captionMedium: 'text-xs font-normal tracking-normal leading-normal',

    // Code classes
    codeInline: 'text-sm font-medium tracking-normal leading-tight font-mono',
    codeBlock: 'text-sm font-normal tracking-normal leading-relaxed font-mono'
} as const;

// Responsive typography utilities
export const responsiveTypography = {
    // Responsive display
    displayResponsive: 'text-5xl md:text-6xl lg:text-8xl font-black tracking-tight leading-none',

    // Responsive headings
    h1Responsive: 'text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight leading-tight',
    h2Responsive: 'text-xl md:text-2xl lg:text-3xl font-bold tracking-normal leading-tight',
    h3Responsive: 'text-lg md:text-xl lg:text-2xl font-semibold tracking-normal leading-snug',

    // Responsive body
    bodyResponsive: 'text-sm md:text-base lg:text-lg font-normal tracking-normal leading-relaxed'
} as const;

// Typography animation variants for Framer Motion
export const typographyAnimations = {
    fadeInUp: {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.6, ease: "easeOut" }
    },

    slideInLeft: {
        initial: { opacity: 0, x: -30 },
        animate: { opacity: 1, x: 0 },
        transition: { duration: 0.5, ease: "easeOut" }
    },

    scaleIn: {
        initial: { opacity: 0, scale: 0.9 },
        animate: { opacity: 1, scale: 1 },
        transition: { duration: 0.4, ease: "easeOut" }
    },

    typewriter: {
        initial: { width: 0 },
        animate: { width: "auto" },
        transition: { duration: 2, ease: "easeOut" }
    },

    highlight: {
        initial: { backgroundSize: "0% 100%" },
        animate: { backgroundSize: "100% 100%" },
        transition: { duration: 0.8, ease: "easeInOut" }
    }
} as const;

// Utility functions for typography
export const typographyUtils = {
    // Get typography class by semantic meaning
    getHeading: (level: 1 | 2 | 3 | 4 | 5 | 6) => {
        const headings = {
            1: typographyClasses.h1,
            2: typographyClasses.h2,
            3: typographyClasses.h3,
            4: typographyClasses.h4,
            5: typographyClasses.h5,
            6: typographyClasses.h6
        };
        return headings[level];
    },

    // Get body text class by size
    getBody: (size: 'small' | 'medium' | 'large' = 'medium') => {
        const body = {
            small: typographyClasses.bodySmall,
            medium: typographyClasses.bodyMedium,
            large: typographyClasses.bodyLarge
        };
        return body[size];
    },

    // Get label class by size
    getLabel: (size: 'small' | 'medium' | 'large' = 'medium') => {
        const labels = {
            small: typographyClasses.labelSmall,
            medium: typographyClasses.labelMedium,
            large: typographyClasses.labelLarge
        };
        return labels[size];
    },

    // Get caption class by size
    getCaption: (size: 'medium' | 'large' = 'medium') => {
        const captions = {
            medium: typographyClasses.captionMedium,
            large: typographyClasses.captionLarge
        };
        return captions[size];
    },

    // Combine typography with colors from theme
    combineWithTheme: (typographyClass: string, colorClass: string) => {
        return `${typographyClass} ${colorClass}`;
    },

    // Generate financial number formatting
    formatCurrency: (value: number, showCents = true) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: showCents ? 2 : 0,
            maximumFractionDigits: showCents ? 2 : 0
        }).format(value);
    },

    formatPercentage: (value: number, precision = 1) => {
        return `${value.toFixed(precision)}%`;
    },

    formatNumber: (value: number, compact = false) => {
        if (compact && Math.abs(value) >= 1000) {
            return new Intl.NumberFormat('en-US', {
                notation: 'compact',
                maximumFractionDigits: 1
            }).format(value);
        }
        return new Intl.NumberFormat('en-US').format(value);
    }
} as const;

const typographyExport = {
    typography: advancedTypography,
    tokens: typographyTokens,
    classes: typographyClasses,
    responsive: responsiveTypography,
    animations: typographyAnimations,
    utils: typographyUtils
};

export default typographyExport;
