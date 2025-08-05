'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { theme } from '@/lib/theme';
import CelebrationConfetti from './CelebrationConfetti';
import {
    Trophy,
    Star,
    Award,
    Crown,
    Sparkles,
    Zap,
    Target,
    X,
    ExternalLink
} from 'lucide-react';

interface Achievement {
    id: string;
    title: string;
    description: string;
    tier: 'bronze' | 'silver' | 'gold' | 'platinum' | 'legendary';
    xpReward: number;
    rarity: number;
    category: 'learning' | 'consistency' | 'mastery' | 'milestone';
}

interface AchievementNotificationProps {
    achievement: Achievement | null;
    isVisible: boolean;
    onClose: () => void;
    onViewDetails?: () => void;
}

const tierConfig = {
    bronze: {
        icon: Award,
        color: 'text-amber-600',
        bgColor: 'bg-amber-500/20',
        borderColor: 'border-amber-500/40',
        glowColor: 'shadow-amber-500/25',
        gradient: 'from-amber-500 to-amber-600'
    },
    silver: {
        icon: Star,
        color: 'text-slate-300',
        bgColor: 'bg-slate-400/20',
        borderColor: 'border-slate-400/40',
        glowColor: 'shadow-slate-400/25',
        gradient: 'from-slate-400 to-slate-500'
    },
    gold: {
        icon: Trophy,
        color: 'text-yellow-400',
        bgColor: 'bg-yellow-500/20',
        borderColor: 'border-yellow-500/40',
        glowColor: 'shadow-yellow-500/25',
        gradient: 'from-yellow-400 to-yellow-500'
    },
    platinum: {
        icon: Crown,
        color: 'text-blue-400',
        bgColor: 'bg-blue-500/20',
        borderColor: 'border-blue-500/40',
        glowColor: 'shadow-blue-500/25',
        gradient: 'from-blue-400 to-blue-500'
    },
    legendary: {
        icon: Sparkles,
        color: 'text-purple-400',
        bgColor: 'bg-purple-500/20',
        borderColor: 'border-purple-500/40',
        glowColor: 'shadow-purple-500/25',
        gradient: 'from-purple-400 to-pink-500'
    }
};

export default function AchievementNotification({
    achievement,
    isVisible,
    onClose,
    onViewDetails
}: AchievementNotificationProps) {
    const [showConfetti, setShowConfetti] = useState(false);

    useEffect(() => {
        if (isVisible && achievement) {
            setShowConfetti(true);

            // Auto-hide after 8 seconds for non-legendary achievements
            if (achievement.tier !== 'legendary') {
                const timer = setTimeout(() => {
                    onClose();
                }, 8000);
                return () => clearTimeout(timer);
            }
        }
    }, [isVisible, achievement, onClose]);

    if (!achievement) return null;

    const tierStyle = tierConfig[achievement.tier];
    const TierIcon = tierStyle.icon;

    return (
        <AnimatePresence>
            {isVisible && (
                <>
                    {/* Confetti Effect */}
                    {showConfetti && (
                        <CelebrationConfetti
                            isActive={showConfetti}
                            onComplete={() => setShowConfetti(false)}
                            particleCount={achievement.tier === 'legendary' ? 100 : achievement.tier === 'platinum' ? 75 : 50}
                            duration={achievement.tier === 'legendary' ? 5000 : 3000}
                        />
                    )}

                    {/* Notification Overlay */}
                    <motion.div
                        className="fixed inset-0 z-50 flex items-center justify-center p-4"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        style={{ pointerEvents: 'none' }}
                    >
                        {/* Background Blur */}
                        <motion.div
                            className="absolute inset-0 bg-black/20 backdrop-blur-sm"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            style={{ pointerEvents: 'auto' }}
                            onClick={onClose}
                        />

                        {/* Achievement Card */}
                        <motion.div
                            className={`relative ${theme.backgrounds.modal} border-2 ${tierStyle.borderColor} rounded-2xl max-w-md w-full overflow-hidden ${tierStyle.glowColor} shadow-2xl`}
                            initial={{ scale: 0.5, opacity: 0, y: 50 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.8, opacity: 0, y: 30 }}
                            transition={{
                                type: "spring",
                                stiffness: 300,
                                damping: 20
                            }}
                            style={{ pointerEvents: 'auto' }}
                        >
                            {/* Animated Background Gradient */}
                            <motion.div
                                className={`absolute inset-0 bg-gradient-to-br ${tierStyle.gradient} opacity-5`}
                                animate={{
                                    opacity: [0.05, 0.1, 0.05],
                                    scale: [1, 1.02, 1]
                                }}
                                transition={{
                                    duration: 3,
                                    repeat: Infinity,
                                    ease: "easeInOut"
                                }}
                            />

                            {/* Shine Effect for Legendary */}
                            {achievement.tier === 'legendary' && (
                                <motion.div
                                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
                                    animate={{ x: ['-100%', '200%'] }}
                                    transition={{
                                        duration: 2,
                                        repeat: Infinity,
                                        ease: "easeInOut"
                                    }}
                                />
                            )}

                            {/* Close Button */}
                            <button
                                onClick={onClose}
                                className={`absolute top-4 right-4 w-8 h-8 ${theme.backgrounds.cardHover} border ${theme.borderColors.primary} rounded-full flex items-center justify-center hover:${theme.backgrounds.cardHover} transition-colors z-10`}
                            >
                                <X className={`w-4 h-4 ${theme.textColors.primary}`} />
                            </button>

                            {/* Header */}
                            <div className="text-center pt-8 pb-6 px-6">
                                <motion.div
                                    className="relative inline-block"
                                    animate={achievement.tier === 'legendary' ? {
                                        rotate: [0, 5, -5, 0],
                                        scale: [1, 1.05, 1]
                                    } : {}}
                                    transition={{
                                        duration: 2,
                                        repeat: Infinity,
                                        ease: "easeInOut"
                                    }}
                                >
                                    {/* Icon Background */}
                                    <motion.div
                                        className={`w-20 h-20 ${tierStyle.bgColor} ${tierStyle.borderColor} border-2 rounded-3xl flex items-center justify-center mx-auto mb-4 ${tierStyle.glowColor} shadow-lg relative overflow-hidden`}
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        transition={{
                                            type: "spring",
                                            stiffness: 300,
                                            damping: 15,
                                            delay: 0.2
                                        }}
                                    >
                                        <TierIcon className={`w-10 h-10 ${tierStyle.color} relative z-10`} />

                                        {/* Pulse Effect */}
                                        <motion.div
                                            className={`absolute inset-0 ${tierStyle.bgColor} rounded-3xl`}
                                            animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.1, 0.3] }}
                                            transition={{
                                                duration: 1.5,
                                                repeat: Infinity,
                                                ease: "easeInOut"
                                            }}
                                        />
                                    </motion.div>

                                    {/* Floating Sparkles for High-Tier Achievements */}
                                    {(achievement.tier === 'platinum' || achievement.tier === 'legendary') && (
                                        <>
                                            {[...Array(6)].map((_, i) => (
                                                <motion.div
                                                    key={i}
                                                    className="absolute w-2 h-2"
                                                    style={{
                                                        left: `${20 + Math.cos((i * Math.PI * 2) / 6) * 40}px`,
                                                        top: `${20 + Math.sin((i * Math.PI * 2) / 6) * 40}px`,
                                                    }}
                                                    animate={{
                                                        scale: [0, 1, 0],
                                                        rotate: [0, 180, 360],
                                                        opacity: [0, 1, 0]
                                                    }}
                                                    transition={{
                                                        duration: 2,
                                                        repeat: Infinity,
                                                        delay: i * 0.2,
                                                        ease: "easeInOut"
                                                    }}
                                                >
                                                    <Sparkles className={`w-2 h-2 ${tierStyle.color}`} />
                                                </motion.div>
                                            ))}
                                        </>
                                    )}
                                </motion.div>

                                {/* Achievement Title */}
                                <motion.h2
                                    className={`text-2xl font-bold ${theme.textColors.primary} mb-2`}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.3 }}
                                >
                                    Achievement Unlocked!
                                </motion.h2>

                                {/* Achievement Name */}
                                <motion.h3
                                    className={`text-xl font-semibold ${tierStyle.color} mb-3`}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.4 }}
                                >
                                    {achievement.title}
                                </motion.h3>

                                {/* Tier Badge */}
                                <motion.div
                                    className={`inline-flex items-center px-3 py-1 ${tierStyle.bgColor} ${tierStyle.borderColor} border rounded-full`}
                                    initial={{ opacity: 0, scale: 0 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: 0.5, type: "spring" }}
                                >
                                    <span className={`text-sm font-medium ${tierStyle.color} uppercase tracking-wide`}>
                                        {achievement.tier}
                                    </span>
                                </motion.div>
                            </div>

                            {/* Description */}
                            <motion.div
                                className="px-6 pb-6"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.6 }}
                            >
                                <p className={`text-center ${theme.textColors.secondary} leading-relaxed`}>
                                    {achievement.description}
                                </p>
                            </motion.div>

                            {/* Rewards & Stats */}
                            <motion.div
                                className={`${theme.backgrounds.cardHover} border-t ${theme.borderColors.primary} px-6 py-4`}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.7 }}
                            >
                                <div className="grid grid-cols-2 gap-4">
                                    {/* XP Reward */}
                                    <div className="text-center">
                                        <div className="flex items-center justify-center space-x-1 mb-1">
                                            <Zap className={`w-4 h-4 ${theme.textColors.accent}`} />
                                            <span className={`text-lg font-bold ${theme.textColors.accent}`}>
                                                +{achievement.xpReward}
                                            </span>
                                        </div>
                                        <span className={`text-xs ${theme.textColors.muted}`}>XP Earned</span>
                                    </div>

                                    {/* Rarity */}
                                    <div className="text-center">
                                        <div className="flex items-center justify-center space-x-1 mb-1">
                                            <Target className={`w-4 h-4 ${theme.textColors.primary}`} />
                                            <span className={`text-lg font-bold ${theme.textColors.primary}`}>
                                                {achievement.rarity}%
                                            </span>
                                        </div>
                                        <span className={`text-xs ${theme.textColors.muted}`}>Have This</span>
                                    </div>
                                </div>
                            </motion.div>

                            {/* Action Buttons */}
                            {onViewDetails && (
                                <motion.div
                                    className="px-6 pb-6"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.8 }}
                                >
                                    <button
                                        onClick={onViewDetails}
                                        className={`w-full ${theme.buttons.primary} flex items-center justify-center space-x-2 py-3 rounded-xl transition-all duration-300 hover:scale-105`}
                                    >
                                        <span>View All Achievements</span>
                                        <ExternalLink className="w-4 h-4" />
                                    </button>
                                </motion.div>
                            )}

                            {/* Legendary Special Effects */}
                            {achievement.tier === 'legendary' && (
                                <motion.div
                                    className="absolute inset-0 pointer-events-none"
                                    animate={{
                                        boxShadow: [
                                            `0 0 20px ${tierStyle.glowColor}`,
                                            `0 0 40px ${tierStyle.glowColor}`,
                                            `0 0 20px ${tierStyle.glowColor}`
                                        ]
                                    }}
                                    transition={{
                                        duration: 2,
                                        repeat: Infinity,
                                        ease: "easeInOut"
                                    }}
                                />
                            )}
                        </motion.div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
