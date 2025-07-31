'use client';

import { motion } from 'framer-motion';

interface FinanceQuestLogoProps {
    size?: 'sm' | 'md' | 'lg';
    className?: string;
    showText?: boolean;
}

export default function FinanceQuestLogo({
    size = 'md',
    className = '',
    showText = true
}: FinanceQuestLogoProps) {
    const sizeClasses = {
        sm: 'w-8 h-8',
        md: 'w-10 h-10',
        lg: 'w-12 h-12'
    };

    const textSizeClasses = {
        sm: 'text-sm',
        md: 'text-lg',
        lg: 'text-xl'
    };

    return (
        <div className={`flex items-center space-x-3 ${className}`}>
            {/* Unique Financial Logo - Stylized "FQ" with growth chart */}
            <motion.div
                className={`${sizeClasses[size]} relative`}
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
            >
                {/* Background gradient circle */}
                <div className="absolute inset-0 bg-gradient-to-br from-amber-500 via-yellow-500 to-amber-600 rounded-xl shadow-lg shadow-amber-500/25"></div>

                {/* Logo content */}
                <div className="relative w-full h-full flex items-center justify-center rounded-xl overflow-hidden">
                    {/* Stylized "FQ" with growth chart accent */}
                    <svg
                        viewBox="0 0 40 40"
                        className="w-full h-full"
                        fill="none"
                    >
                        {/* Background pattern - subtle grid */}
                        <defs>
                            <pattern id="grid" width="4" height="4" patternUnits="userSpaceOnUse">
                                <path d="M 4 0 L 0 0 0 4" fill="none" stroke="rgba(30,58,138,0.1)" strokeWidth="0.5" />
                            </pattern>
                        </defs>
                        <rect width="40" height="40" fill="url(#grid)" />

                        {/* Letter "F" */}
                        <path
                            d="M 8 10 L 8 30 M 8 10 L 18 10 M 8 19 L 15 19"
                            stroke="#1e3a8a"
                            strokeWidth="2.5"
                            strokeLinecap="round"
                            fill="none"
                        />

                        {/* Letter "Q" with growth chart tail */}
                        <circle
                            cx="28"
                            cy="20"
                            r="7"
                            stroke="#1e3a8a"
                            strokeWidth="2.5"
                            fill="none"
                        />

                        {/* Growth chart accent inside Q */}
                        <path
                            d="M 23 24 L 26 21 L 29 23 L 33 17"
                            stroke="#1e3a8a"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            fill="none"
                        />

                        {/* Small growth arrow */}
                        <path
                            d="M 31 17 L 33 17 L 33 19"
                            stroke="#1e3a8a"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            fill="none"
                        />
                    </svg>
                </div>
            </motion.div>

            {/* Text */}
            {showText && (
                <div className="flex flex-col">
                    <h1 className={`${textSizeClasses[size]} font-bold text-white leading-tight`}>
                        Finance Quest
                    </h1>
                    <p className={`text-xs text-amber-300 leading-tight ${size === 'sm' ? 'hidden' : ''}`}>
                        Master Your Future
                    </p>
                </div>
            )}
        </div>
    );
}
