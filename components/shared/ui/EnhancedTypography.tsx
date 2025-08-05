'use client';

import React, { forwardRef, HTMLAttributes } from 'react';
import { motion, MotionProps } from 'framer-motion';
import { theme } from '@/lib/theme';
import { typographyClasses } from '@/lib/theme/typography';
import { microAnimations } from '@/lib/theme/advancedDesign';

// Enhanced Typography Components with Animation Support

interface TypographyProps {
    variant?: 'primary' | 'secondary' | 'muted' | 'accent' | 'success' | 'warning' | 'error';
    gradient?: boolean;
    animate?: boolean;
    className?: string;
    children: React.ReactNode;
}

// Display Text Component
interface DisplayProps extends TypographyProps {
    size?: 'hero' | 'large' | 'medium';
}

export const Display = forwardRef<HTMLHeadingElement, DisplayProps>(
    ({ size = 'medium', variant = 'primary', gradient = false, animate = true, className = '', children }, ref) => {
        const sizeClasses = {
            hero: typographyClasses.displayHero,
            large: typographyClasses.displayLarge,
            medium: typographyClasses.displayMedium
        };

        const variantClasses = {
            primary: theme.textColors.primary,
            secondary: theme.textColors.secondary,
            muted: theme.textColors.muted,
            accent: theme.textColors.accent,
            success: theme.textColors.success,
            warning: theme.textColors.warning,
            error: theme.textColors.error
        };

        const classes = `${sizeClasses[size]} ${gradient ? theme.textColors.gradient.primary : variantClasses[variant]} ${className}`;

        if (animate) {
            return (
                <motion.h1
                    ref={ref}
                    className={classes}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                >
                    {children}
                </motion.h1>
            );
        }

        return (
            <h1 ref={ref} className={classes}>
                {children}
            </h1>
        );
    }
);

Display.displayName = 'Display';

// Heading Component
interface HeadingProps extends TypographyProps {
    level?: 1 | 2 | 3 | 4 | 5 | 6;
    responsive?: boolean;
}

export const Heading = forwardRef<HTMLHeadingElement, HeadingProps>(
    ({ level = 2, variant = 'primary', gradient = false, animate = true, responsive = false, className = '', children }, ref) => {
        const levelClasses = {
            1: responsive ? 'text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight leading-tight' : typographyClasses.h1,
            2: responsive ? 'text-xl md:text-2xl lg:text-3xl font-bold tracking-normal leading-tight' : typographyClasses.h2,
            3: responsive ? 'text-lg md:text-xl lg:text-2xl font-semibold tracking-normal leading-snug' : typographyClasses.h3,
            4: typographyClasses.h4,
            5: typographyClasses.h5,
            6: typographyClasses.h6
        };

        const variantClasses = {
            primary: theme.textColors.primary,
            secondary: theme.textColors.secondary,
            muted: theme.textColors.muted,
            accent: theme.textColors.accent,
            success: theme.textColors.success,
            warning: theme.textColors.warning,
            error: theme.textColors.error
        };

        const classes = `${levelClasses[level]} ${gradient ? theme.textColors.gradient.primary : variantClasses[variant]} ${className}`;

        if (animate) {
            const animatedProps = {
                ref,
                className: classes,
                initial: { opacity: 0, y: 20 },
                animate: { opacity: 1, y: 0 },
                transition: { duration: 0.6, ease: "easeOut" as const }
            };

            switch (level) {
                case 1:
                    return <motion.h1 {...animatedProps}>{children}</motion.h1>;
                case 2:
                    return <motion.h2 {...animatedProps}>{children}</motion.h2>;
                case 3:
                    return <motion.h3 {...animatedProps}>{children}</motion.h3>;
                case 4:
                    return <motion.h4 {...animatedProps}>{children}</motion.h4>;
                case 5:
                    return <motion.h5 {...animatedProps}>{children}</motion.h5>;
                case 6:
                    return <motion.h6 {...animatedProps}>{children}</motion.h6>;
                default:
                    return <motion.h2 {...animatedProps}>{children}</motion.h2>;
            }
        }

        const staticProps = { ref, className: classes };

        switch (level) {
            case 1:
                return <h1 {...staticProps}>{children}</h1>;
            case 2:
                return <h2 {...staticProps}>{children}</h2>;
            case 3:
                return <h3 {...staticProps}>{children}</h3>;
            case 4:
                return <h4 {...staticProps}>{children}</h4>;
            case 5:
                return <h5 {...staticProps}>{children}</h5>;
            case 6:
                return <h6 {...staticProps}>{children}</h6>;
            default:
                return <h2 {...staticProps}>{children}</h2>;
        }
    }
);

Heading.displayName = 'Heading';

// Body Text Component
interface BodyProps extends TypographyProps {
    size?: 'small' | 'medium' | 'large';
    responsive?: boolean;
}

export const Body = forwardRef<HTMLParagraphElement, BodyProps>(
    ({ size = 'medium', variant = 'secondary', animate = false, responsive = false, className = '', children }, ref) => {
        const sizeClasses = {
            small: typographyClasses.bodySmall,
            medium: responsive ? 'text-sm md:text-base lg:text-lg font-normal tracking-normal leading-relaxed' : typographyClasses.bodyMedium,
            large: typographyClasses.bodyLarge
        };

        const variantClasses = {
            primary: theme.textColors.primary,
            secondary: theme.textColors.secondary,
            muted: theme.textColors.muted,
            accent: theme.textColors.accent,
            success: theme.textColors.success,
            warning: theme.textColors.warning,
            error: theme.textColors.error
        };

        const classes = `${sizeClasses[size]} ${variantClasses[variant]} ${className}`;

        if (animate) {
            return (
                <motion.p
                    ref={ref}
                    className={classes}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, ease: "easeOut" }}
                >
                    {children}
                </motion.p>
            );
        }

        return (
            <p ref={ref} className={classes}>
                {children}
            </p>
        );
    }
);

Body.displayName = 'Body';

// Label Component
interface LabelProps extends TypographyProps {
    size?: 'small' | 'medium' | 'large';
    htmlFor?: string;
}

export const Label = forwardRef<HTMLLabelElement, LabelProps>(
    ({ size = 'medium', variant = 'primary', className = '', htmlFor, children }, ref) => {
        const sizeClasses = {
            small: typographyClasses.labelSmall,
            medium: typographyClasses.labelMedium,
            large: typographyClasses.labelLarge
        };

        const variantClasses = {
            primary: theme.textColors.primary,
            secondary: theme.textColors.secondary,
            muted: theme.textColors.muted,
            accent: theme.textColors.accent,
            success: theme.textColors.success,
            warning: theme.textColors.warning,
            error: theme.textColors.error
        };

        return (
            <label
                ref={ref}
                htmlFor={htmlFor}
                className={`${sizeClasses[size]} ${variantClasses[variant]} ${className}`}
            >
                {children}
            </label>
        );
    }
);

Label.displayName = 'Label';

// Caption Component
interface CaptionProps extends TypographyProps {
    size?: 'medium' | 'large';
}

export const Caption = forwardRef<HTMLSpanElement, CaptionProps>(
    ({ size = 'medium', variant = 'muted', className = '', children }, ref) => {
        const sizeClasses = {
            medium: typographyClasses.captionMedium,
            large: typographyClasses.captionLarge
        };

        const variantClasses = {
            primary: theme.textColors.primary,
            secondary: theme.textColors.secondary,
            muted: theme.textColors.muted,
            accent: theme.textColors.accent,
            success: theme.textColors.success,
            warning: theme.textColors.warning,
            error: theme.textColors.error
        };

        return (
            <span
                ref={ref}
                className={`${sizeClasses[size]} ${variantClasses[variant]} ${className}`}
            >
                {children}
            </span>
        );
    }
);

Caption.displayName = 'Caption';

// Financial Text Components
interface FinancialTextProps {
    value: number;
    variant?: 'positive' | 'negative' | 'neutral';
    size?: 'small' | 'medium' | 'large';
    animate?: boolean;
    className?: string;
}

export const CurrencyText = forwardRef<HTMLSpanElement, FinancialTextProps>(
    ({ value, variant = 'neutral', size = 'medium', animate = true, className = '' }, ref) => {
        const sizeClasses = {
            small: typographyClasses.metric,
            medium: typographyClasses.currencyLarge,
            large: 'text-3xl font-bold tracking-tight leading-none font-mono'
        };

        const variantClasses = {
            positive: theme.textColors.success,
            negative: theme.textColors.error,
            neutral: theme.textColors.primary
        };

        const formatCurrency = (val: number) => {
            return new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'USD',
                minimumFractionDigits: 0,
                maximumFractionDigits: val % 1 === 0 ? 0 : 2
            }).format(val);
        };

        const classes = `${sizeClasses[size]} ${variantClasses[variant]} ${className}`;

        if (animate) {
            return (
                <motion.span
                    ref={ref}
                    className={classes}
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                >
                    {formatCurrency(value)}
                </motion.span>
            );
        }

        return (
            <span ref={ref} className={classes}>
                {formatCurrency(value)}
            </span>
        );
    }
);

CurrencyText.displayName = 'CurrencyText';

export const PercentageText = forwardRef<HTMLSpanElement, FinancialTextProps>(
    ({ value, variant = 'neutral', size = 'medium', animate = true, className = '' }, ref) => {
        const sizeClasses = {
            small: typographyClasses.metric,
            medium: typographyClasses.percentage,
            large: 'text-xl font-bold tracking-tight leading-none font-mono'
        };

        const variantClasses = {
            positive: theme.textColors.success,
            negative: theme.textColors.error,
            neutral: theme.textColors.primary
        };

        const classes = `${sizeClasses[size]} ${variantClasses[variant]} ${className}`;

        if (animate) {
            return (
                <motion.span
                    ref={ref}
                    className={classes}
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                >
                    {value >= 0 ? '+' : ''}{value.toFixed(1)}%
                </motion.span>
            );
        }

        return (
            <span ref={ref} className={classes}>
                {value >= 0 ? '+' : ''}{value.toFixed(1)}%
            </span>
        );
    }
);

PercentageText.displayName = 'PercentageText';

// Enhanced Card Components
interface EnhancedCardProps {
    variant?: 'default' | 'elevated' | 'interactive' | 'glass';
    padding?: 'sm' | 'md' | 'lg' | 'xl';
    animate?: boolean;
    hover?: boolean;
    className?: string;
    children: React.ReactNode;
}

export const EnhancedCard = forwardRef<HTMLDivElement, EnhancedCardProps>(
    ({ variant = 'default', padding = 'md', animate = true, hover = true, className = '', children }, ref) => {
        const variantClasses = {
            default: theme.backgrounds.card,
            elevated: theme.backgrounds.cardElevated,
            interactive: theme.backgrounds.card,
            glass: theme.backgrounds.glass
        };

        const paddingClasses = {
            sm: 'p-4',
            md: 'p-6',
            lg: 'p-8',
            xl: 'p-10'
        };

        const classes = `${variantClasses[variant]} ${paddingClasses[padding]} border ${theme.borderColors.primary} rounded-xl ${hover && variant === 'interactive' ? 'hover:' + theme.backgrounds.cardHover + ' cursor-pointer' : ''
            } ${className}`;

        if (animate) {
            return (
                <motion.div
                    ref={ref}
                    className={classes}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    whileHover={hover ? { y: -4 } : undefined}
                    transition={{ duration: 0.4, ease: "easeOut" }}
                >
                    {children}
                </motion.div>
            );
        }

        return (
            <div ref={ref} className={classes}>
                {children}
            </div>
        );
    }
);

EnhancedCard.displayName = 'EnhancedCard';

// Enhanced Button Component
interface EnhancedButtonProps {
    variant?: 'primary' | 'secondary' | 'accent' | 'success' | 'warning' | 'error' | 'ghost';
    size?: 'sm' | 'md' | 'lg' | 'xl';
    loading?: boolean;
    disabled?: boolean;
    icon?: React.ReactNode;
    iconPosition?: 'left' | 'right';
    animate?: boolean;
    type?: 'button' | 'submit' | 'reset';
    className?: string;
    children: React.ReactNode;
    onClick?: () => void;
}

export const EnhancedButton = forwardRef<HTMLButtonElement, EnhancedButtonProps>(
    ({
        variant = 'primary',
        size = 'md',
        loading = false,
        disabled = false,
        icon,
        iconPosition = 'left',
        animate = true,
        type = 'button',
        className = '',
        children,
        onClick
    }, ref) => {
        const variantClasses = {
            primary: theme.buttons.primary,
            secondary: theme.buttons.secondary,
            accent: theme.buttons.accent,
            success: theme.buttons.success,
            warning: theme.buttons.warning,
            error: theme.buttons.error,
            ghost: theme.buttons.ghost
        };

        const sizeClasses = {
            sm: 'px-3 py-1.5 text-sm',
            md: 'px-4 py-2 text-base',
            lg: 'px-6 py-3 text-lg',
            xl: 'px-8 py-4 text-xl'
        };

        const classes = `${variantClasses[variant]} ${sizeClasses[size]} rounded-lg font-semibold transition-all duration-200 ${theme.interactive.focus} ${disabled ? 'opacity-50 cursor-not-allowed' : ''
            } ${className} flex items-center justify-center space-x-2`;

        if (animate) {
            return (
                <motion.button
                    ref={ref}
                    type={type}
                    disabled={disabled || loading}
                    className={classes}
                    whileHover={!disabled ? { scale: 1.02 } : undefined}
                    whileTap={!disabled ? { scale: 0.98 } : undefined}
                    transition={{ duration: 0.1 }}
                    onClick={onClick}
                >
                    {loading && (
                        <motion.div
                            className="w-4 h-4 border-2 border-current border-t-transparent rounded-full"
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        />
                    )}
                    {icon && iconPosition === 'left' && !loading && icon}
                    <span>{children}</span>
                    {icon && iconPosition === 'right' && !loading && icon}
                </motion.button>
            );
        }

        return (
            <button
                ref={ref}
                type={type}
                disabled={disabled || loading}
                className={classes}
                onClick={onClick}
            >
                {loading && (
                    <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                )}
                {icon && iconPosition === 'left' && !loading && icon}
                <span>{children}</span>
                {icon && iconPosition === 'right' && !loading && icon}
            </button>
        );
    }
);

EnhancedButton.displayName = 'EnhancedButton';

// Enhanced Input Component
interface EnhancedInputProps {
    type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url';
    value?: string | number;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    placeholder?: string;
    error?: string;
    label?: string;
    required?: boolean;
    disabled?: boolean;
    animate?: boolean;
    className?: string;
}

export const EnhancedInput = forwardRef<HTMLInputElement, EnhancedInputProps>(
    ({
        type = 'text',
        value,
        onChange,
        placeholder,
        error,
        label,
        required = false,
        disabled = false,
        animate = true,
        className = ''
    }, ref) => {
        const inputClasses = `w-full px-4 py-3 bg-slate-800/50 border ${error ? 'border-red-500 focus:border-red-500' : 'border-white/10 focus:border-blue-500'
            } rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all duration-200 ${disabled ? 'opacity-50 cursor-not-allowed' : ''
            }`;

        const content = (
            <div className="space-y-2">
                {label && (
                    <Label variant="primary" className="block">
                        {label} {required && <span className="text-red-400">*</span>}
                    </Label>
                )}
                <input
                    ref={ref}
                    type={type}
                    value={value}
                    onChange={onChange}
                    placeholder={placeholder}
                    disabled={disabled}
                    className={`${inputClasses} ${className}`}
                />
                {error && (
                    <Caption variant="error" className="flex items-center space-x-1">
                        <span className="w-4 h-4 text-red-400">⚠</span>
                        <span>{error}</span>
                    </Caption>
                )}
            </div>
        );

        if (animate) {
            return (
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                >
                    {content}
                </motion.div>
            );
        }

        return <div>{content}</div>;
    }
);

EnhancedInput.displayName = 'EnhancedInput';

// Export all components
export {
    typographyClasses,
    microAnimations
};
