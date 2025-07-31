import { useMemo } from 'react';
import { theme } from './index';
import { themeUtils } from './utils';

/**
 * React hook for accessing theme values and utilities
 */
export const useTheme = () => {
    return useMemo(() => ({
        // Direct access to theme values
        ...theme,

        // Utility functions
        utils: themeUtils,

        // Common component class generators
        components: {
            // Chapter page wrapper
            chapterPage: () => themeUtils.pageBackground(),

            // Chapter content container
            chapterContent: () => 'max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8',

            // Tab navigation container
            tabContainer: () => `${theme.tabs.container} rounded-xl p-1 mb-8`,

            // Lesson content card
            lessonCard: () => themeUtils.glass() + ' p-8 mb-8',

            // Calculator container
            calculatorContainer: () => 'grid grid-cols-1 lg:grid-cols-2 gap-8',

            // Quiz container
            quizContainer: () => themeUtils.glass() + ' p-8',

            // Educational tip box
            tipBox: () => `${theme.status.info.bg} ${theme.status.info.border} ${theme.status.info.text} border rounded-lg p-4`,

            // Success celebration
            successBox: () => `${theme.status.success.bg} ${theme.status.success.border} ${theme.status.success.text} border rounded-lg p-6`,

            // Warning box
            warningBox: () => `${theme.status.warning.bg} ${theme.status.warning.border} ${theme.status.warning.text} border rounded-lg p-4`,

            // Calculator input section
            calculatorInputs: () => themeUtils.glass() + ' p-6',

            // Calculator results section
            calculatorResults: () => themeUtils.glass() + ' p-6',

            // Result highlight
            resultHighlight: () => `${theme.backgrounds.card} ${theme.borderColors.accent} border-2 rounded-lg p-4 text-center`,

            // Navigation button
            navButton: (variant: 'primary' | 'secondary' = 'primary') =>
                themeUtils.button(variant) + ' flex items-center gap-2',

            // Progress indicator
            progressIndicator: () => `${theme.progress.background} rounded-full h-2 overflow-hidden`,

            // Achievement badge
            achievementBadge: () => `${theme.backgrounds.card} ${theme.borderColors.accent} border rounded-full p-3`,
        },

        // Color helpers
        getStatusColor: (type: 'success' | 'warning' | 'error' | 'info') => theme.status[type],

        // Responsive helpers
        responsive: {
            grid: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6',
            container: 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8',
            text: {
                xs: 'text-xs sm:text-sm',
                sm: 'text-sm sm:text-base',
                base: 'text-base sm:text-lg',
                lg: 'text-lg sm:text-xl',
                xl: 'text-xl sm:text-2xl',
            },
        },
    }), []);
};

export default useTheme;
