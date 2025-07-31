import { theme } from './index';

/**
 * Utility functions for applying theme consistently
 */

// Combine multiple theme classes
export const cn = (...classes: (string | undefined | null | false)[]): string => {
    return classes.filter(Boolean).join(' ');
};

// Helper functions for common component patterns
export const themeUtils = {
    // Card styles
    card: (variant: 'default' | 'hover' = 'default') => cn(
        theme.backgrounds.card,
        theme.borderColors.primary,
        'border rounded-xl',
        variant === 'hover' && theme.interactive.hover
    ),

    // Button styles
    button: (variant: keyof typeof theme.buttons = 'primary') => cn(
        theme.buttons[variant],
        'px-6 py-3 rounded-lg font-semibold transition-all duration-200',
        theme.interactive.scale
    ),

    // Tab styles
    tab: (isActive: boolean) => cn(
        'px-6 py-3 rounded-lg font-medium transition-all duration-200',
        isActive ? theme.tabs.active : theme.tabs.inactive
    ),

    // Section container
    section: () => cn(
        'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8',
        theme.spacing.lg
    ),

    // Page background
    pageBackground: () => cn(
        'min-h-screen',
        theme.backgrounds.primary,
        'relative overflow-hidden'
    ),

    // Header
    header: () => cn(
        theme.backgrounds.header,
        theme.borderColors.accent,
        'border-b relative z-10'
    ),

    // Progress bar
    progressBar: () => cn(
        theme.progress.bar,
        'h-2 rounded-full transition-all duration-500'
    ),

    // Status indicator
    status: (type: keyof typeof theme.status) => cn(
        theme.status[type].bg,
        theme.status[type].border,
        theme.status[type].text,
        'border rounded-lg p-4'
    ),

    // Heading
    heading: (level: keyof typeof theme.typography) => cn(
        theme.typography[level],
        theme.textColors.primary
    ),

    // Glass morphism effect
    glass: () => cn(
        theme.backgrounds.glass,
        'backdrop-blur-xl rounded-xl'
    ),

    // Interactive card
    interactiveCard: () => cn(
        theme.backgrounds.card,
        theme.borderColors.primary,
        'border rounded-xl',
        theme.interactive.hover,
        theme.interactive.glow,
        'cursor-pointer'
    ),

    // Form input
    input: () => cn(
        'w-full px-4 py-3 bg-slate-800/50 border border-slate-600',
        'rounded-md text-white placeholder-gray-400',
        'focus:ring-2 focus:ring-amber-500 focus:border-transparent',
        'transition-all duration-200'
    ),

    // Badge
    badge: (variant: 'default' | 'success' | 'warning' | 'error' = 'default') => {
        const variants = {
            default: cn(theme.status.info.bg, theme.status.info.text, theme.status.info.border),
            success: cn(theme.status.success.bg, theme.status.success.text, theme.status.success.border),
            warning: cn(theme.status.warning.bg, theme.status.warning.text, theme.status.warning.border),
            error: cn(theme.status.error.bg, theme.status.error.text, theme.status.error.border),
        };
        return cn(variants[variant], 'px-3 py-1 rounded-full text-xs font-medium border');
    },

    // Icon wrapper
    icon: (size: 'sm' | 'md' | 'lg' = 'md', color: keyof typeof theme.textColors = 'accent') => {
        const sizes = {
            sm: 'w-4 h-4',
            md: 'w-6 h-6',
            lg: 'w-8 h-8',
        };
        return cn(sizes[size], theme.textColors[color]);
    },

    // Gradient text
    gradientText: (type: 'primary' | 'accent' = 'primary') => {
        const gradients = {
            primary: 'bg-gradient-to-r from-blue-400 to-amber-400',
            accent: 'bg-gradient-to-r from-amber-400 to-yellow-400',
        };
        return cn(
            gradients[type],
            'bg-clip-text text-transparent font-bold'
        );
    },
};

export default themeUtils;
