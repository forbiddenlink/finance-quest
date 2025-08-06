'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useProgressStore } from '@/lib/store/progressStore';
import { useEnhancedProgress } from '@/lib/store/progressHooks';
import { NotificationBell } from '@/components/shared/ui/SmartNotificationSystem';
import StreakMotivationWidget from '@/components/shared/ui/StreakMotivationWidget';
import { theme } from '@/lib/theme';
import { microAnimations } from '@/lib/theme/advancedDesign';
import {
    DollarSign,
    Home,
    Calculator,
    TrendingUp,
    User,
    Menu,
    X,
    Crown,
    BookOpen,
    BarChart3,
    ChevronDown
} from 'lucide-react';

interface NavigationItem {
    label: string;
    href: string;
    icon: React.ComponentType<{ className?: string }>;
    badge?: string;
    isNew?: boolean;
    isPro?: boolean;
    description?: string;
}

interface NavigationSection {
    title: string;
    items: NavigationItem[];
}

const EnhancedProgressNavigation: React.FC = () => {
    const pathname = usePathname();
    const { userProgress } = useProgressStore();
    const { getUserRank, getEngagementScore, currentLevel, totalXP } = useEnhancedProgress();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    // Handle scroll effect for navigation bar
    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 10);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Navigation sections - Optimized for header space
    const navigationSections: NavigationSection[] = [
        {
            title: 'Core',
            items: [
                { label: 'Home', href: '/', icon: Home, description: 'Dashboard overview' },
                { label: 'Learn', href: '/curriculum', icon: BookOpen, description: 'All chapters' },
                { label: 'Progress', href: '/progress', icon: TrendingUp, description: 'Track journey' },
                { label: 'Tools', href: '/calculators', icon: Calculator, badge: '13+', description: 'Calculators' },
                { label: 'Market', href: '/market-dashboard', icon: BarChart3, description: 'Live data' }
            ]
        }
    ];

    const userRank = getUserRank();
    const engagementScore = getEngagementScore();
    const completedChapters = userProgress.completedLessons.length;

    return (
        <>
            {/* Enhanced Navigation Bar */}
            <motion.nav
                className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled
                    ? `${theme.backgrounds.headerFloating} shadow-2xl backdrop-blur-2xl`
                    : `${theme.backgrounds.header} backdrop-blur-xl`
                    }`}
                initial={{ y: -100 }}
                animate={{ y: 0 }}
                transition={microAnimations.spring}
            >
                <div className="w-full max-w-6xl mx-auto px-3 sm:px-4 lg:px-6">
                    <div className="flex items-center justify-between h-16 lg:h-20">
                        {/* Logo and Brand */}
                        <motion.div
                            className="flex items-center space-x-2 lg:space-x-3 shrink-0 min-w-0"
                            whileHover={{ scale: 1.02 }}
                            transition={{ duration: 0.2, ease: "easeOut" }}
                        >
                            <Link href="/" className="flex items-center space-x-2 lg:space-x-3">
                                <motion.div
                                    className={`w-8 h-8 lg:w-10 lg:h-10 ${theme.buttons.primary} rounded-xl flex items-center justify-center relative overflow-hidden`}
                                    whileHover={{ rotate: 360 }}
                                    transition={{ duration: 0.8, ease: "easeInOut" }}
                                >
                                    <DollarSign className="w-4 h-4 lg:w-6 lg:h-6 text-white font-bold" />
                                    <motion.div
                                        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                                        animate={{ x: ['-100%', '200%'] }}
                                        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                                    />
                                </motion.div>
                                <div className="hidden sm:block">
                                    <h1 className={`text-base lg:text-lg font-bold ${theme.textColors.primary} truncate`}>
                                        Finance Quest
                                    </h1>
                                    <p className={`text-xs ${theme.textColors.muted} -mt-1 hidden lg:block`}>
                                        Master Your Money
                                    </p>
                                </div>
                            </Link>
                        </motion.div>

                        {/* Desktop Navigation Links */}
                        <div className="hidden lg:flex items-center space-x-2 xl:space-x-4 flex-1 justify-center max-w-3xl mx-4">
                            {navigationSections.map((section) =>
                                section.items.map((item) => {
                                    const IconComponent = item.icon;
                                    const isActive = pathname === item.href;

                                    return (
                                        <motion.div
                                            key={item.href}
                                            whileHover="hover"
                                            whileTap="tap"
                                            variants={microAnimations.variants.buttonPress}
                                        >
                                            <Link
                                                href={item.href}
                                                className={`relative flex items-center space-x-2 px-3 xl:px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 group min-w-0 ${isActive
                                                    ? `${theme.status.info.bg} ${theme.status.info.text} ${theme.status.info.border} border`
                                                    : `${theme.textColors.secondary} hover:${theme.textColors.primary} hover:${theme.backgrounds.cardHover}`
                                                    }`}
                                            >
                                                <IconComponent className={`w-4 h-4 flex-shrink-0 ${item.isPro ? 'text-purple-400' :
                                                    item.isNew ? 'text-green-400' : ''
                                                    }`} />
                                                <span className="whitespace-nowrap text-sm">{item.label}</span>

                                                {/* Badges */}
                                                {item.badge && (
                                                    <motion.span
                                                        className={`ml-2 px-2 py-0.5 text-xs font-semibold rounded-full ${theme.status.warning.bg} ${theme.status.warning.text} flex-shrink-0`}
                                                        initial={{ scale: 0 }}
                                                        animate={{ scale: 1 }}
                                                        transition={{ delay: 0.2, type: "spring" }}
                                                    >
                                                        {item.badge}
                                                    </motion.span>
                                                )}

                                                {item.isPro && (
                                                    <Crown className="w-3 h-3 text-purple-400 ml-1" />
                                                )}

                                                {/* Active indicator */}
                                                {isActive && (
                                                    <motion.div
                                                        className={`absolute bottom-0 left-0 right-0 h-0.5 ${theme.buttons.primary} rounded-full`}
                                                        layoutId="activeTab"
                                                        transition={{ duration: 0.3, ease: "easeOut" }}
                                                    />
                                                )}
                                            </Link>
                                        </motion.div>
                                    );
                                })
                            )}
                        </div>

                        {/* Right side items */}
                        <div className="flex items-center space-x-2 xl:space-x-3 shrink-0 min-w-0">
                            {/* Notifications */}
                            <NotificationBell className="hidden sm:block" />

                            {/* User Profile Dropdown */}
                            <div className="relative">
                                <motion.button
                                    onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                                    className={`flex items-center space-x-3 p-2 rounded-xl ${theme.backgrounds.cardHover} ${theme.borderColors.primary} border transition-all duration-200`}
                                    whileHover="hover"
                                    whileTap="tap"
                                    variants={microAnimations.variants.buttonPress}
                                >
                                    <div className="flex items-center space-x-2">
                                        <div className={`w-8 h-8 ${theme.buttons.primary} rounded-lg flex items-center justify-center`}>
                                            <User className="w-4 h-4 text-white" />
                                        </div>
                                        <div className="hidden sm:block text-left">
                                            <div className={`text-sm font-medium ${theme.textColors.primary}`}>
                                                Level {currentLevel}
                                            </div>
                                            <div className={`text-xs ${theme.textColors.muted}`}>
                                                {typeof userRank === 'object' ? userRank.rank : userRank}
                                            </div>
                                        </div>
                                        <ChevronDown className={`w-4 h-4 ${theme.textColors.muted} transition-transform ${isProfileDropdownOpen ? 'rotate-180' : ''}`} />
                                    </div>
                                </motion.button>

                                {/* Profile Dropdown */}
                                <AnimatePresence>
                                    {isProfileDropdownOpen && (
                                        <motion.div
                                            className={`absolute right-0 top-full mt-2 w-72 ${theme.backgrounds.modal} border ${theme.borderColors.primary} rounded-xl shadow-2xl overflow-hidden`}
                                            initial={{ opacity: 0, y: -10, scale: 0.95 }}
                                            animate={{ opacity: 1, y: 0, scale: 1 }}
                                            exit={{ opacity: 0, y: -10, scale: 0.95 }}
                                            transition={microAnimations.spring}
                                        >
                                            {/* Profile Header */}
                                            <div className={`${theme.backgrounds.cardHover} p-4 border-b ${theme.borderColors.primary}`}>
                                                <div className="flex items-center space-x-3">
                                                    <div className={`w-12 h-12 ${theme.buttons.primary} rounded-xl flex items-center justify-center`}>
                                                        <User className="w-6 h-6 text-white" />
                                                    </div>
                                                    <div>
                                                        <h3 className={`font-semibold ${theme.textColors.primary}`}>
                                                            Level {currentLevel} Learner
                                                        </h3>
                                                        <p className={`text-sm ${theme.textColors.secondary}`}>
                                                            {typeof userRank === 'object' ? userRank.rank : userRank}
                                                        </p>
                                                    </div>
                                                </div>

                                                {/* Progress Stats */}
                                                <div className="grid grid-cols-3 gap-4 mt-4">
                                                    <div className="text-center">
                                                        <div className={`text-lg font-bold ${theme.textColors.brand}`}>
                                                            {(totalXP || 0).toLocaleString()}
                                                        </div>
                                                        <div className={`text-xs ${theme.textColors.muted}`}>XP</div>
                                                    </div>
                                                    <div className="text-center">
                                                        <div className={`text-lg font-bold ${theme.textColors.primary}`}>
                                                            {completedChapters || 0}
                                                        </div>
                                                        <div className={`text-xs ${theme.textColors.muted}`}>Lessons</div>
                                                    </div>
                                                    <div className="text-center">
                                                        <div className={`text-lg font-bold ${theme.status.success.text}`}>
                                                            {engagementScore || 0}%
                                                        </div>
                                                        <div className={`text-xs ${theme.textColors.muted}`}>Engagement</div>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Quick Actions */}
                                            <div className="p-2">
                                                {[
                                                    { label: 'View Progress', href: '/progress', icon: TrendingUp },
                                                    { label: 'Learning Analytics', href: '/advanced-progress', icon: BarChart3, isPro: true },
                                                    { label: 'Settings', href: '/settings', icon: User }
                                                ].map((action) => {
                                                    const ActionIcon = action.icon;
                                                    return (
                                                        <Link
                                                            key={action.href}
                                                            href={action.href}
                                                            className={`flex items-center space-x-3 p-3 rounded-lg hover:${theme.backgrounds.cardHover} transition-colors group`}
                                                            onClick={() => setIsProfileDropdownOpen(false)}
                                                        >
                                                            <ActionIcon className={`w-4 h-4 ${theme.textColors.brand}`} />
                                                            <span className={`${theme.textColors.primary} group-hover:${theme.textColors.primary}`}>
                                                                {action.label}
                                                            </span>
                                                            {action.isPro && (
                                                                <Crown className="w-3 h-3 text-purple-400 ml-auto" />
                                                            )}
                                                        </Link>
                                                    );
                                                })}
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>

                            {/* Mobile Menu Button */}
                            <motion.button
                                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                                className={`lg:hidden p-2 rounded-lg ${theme.backgrounds.cardHover} ${theme.borderColors.primary} border`}
                                whileHover="hover"
                                whileTap="tap"
                                variants={microAnimations.variants.buttonPress}
                            >
                                {isMobileMenuOpen ? (
                                    <X className={`w-5 h-5 ${theme.textColors.primary}`} />
                                ) : (
                                    <Menu className={`w-5 h-5 ${theme.textColors.primary}`} />
                                )}
                            </motion.button>
                        </div>
                    </div>
                </div>

                {/* Mobile Menu */}
                <AnimatePresence>
                    {isMobileMenuOpen && (
                        <motion.div
                            className={`lg:hidden ${theme.backgrounds.modal} border-t ${theme.borderColors.primary}`}
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={microAnimations.spring}
                        >
                            <div className="px-4 py-6 space-y-6">
                                {/* Streak Widget for Mobile */}
                                <div className="md:hidden">
                                    <StreakMotivationWidget size="default" />
                                </div>

                                {/* Navigation Sections */}
                                {navigationSections.map((section) => (
                                    <div key={section.title}>
                                        <h3 className={`text-sm font-semibold ${theme.textColors.muted} uppercase tracking-wide mb-3`}>
                                            {section.title}
                                        </h3>
                                        <div className="space-y-2">
                                            {section.items.map((item) => {
                                                const IconComponent = item.icon;
                                                const isActive = pathname === item.href;

                                                return (
                                                    <Link
                                                        key={item.href}
                                                        href={item.href}
                                                        className={`flex items-center space-x-3 p-3 rounded-lg transition-colors ${isActive
                                                            ? `${theme.status.info.bg} ${theme.status.info.text}`
                                                            : `hover:${theme.backgrounds.cardHover}`
                                                            }`}
                                                        onClick={() => setIsMobileMenuOpen(false)}
                                                    >
                                                        <IconComponent className={`w-5 h-5 ${item.isPro ? 'text-purple-400' :
                                                            item.isNew ? 'text-green-400' :
                                                                theme.textColors.brand
                                                            }`} />
                                                        <div className="flex-1">
                                                            <div className={`font-medium ${theme.textColors.primary} flex items-center`}>
                                                                {item.label}
                                                                {item.badge && (
                                                                    <span className={`ml-2 px-2 py-0.5 text-xs font-semibold rounded-full ${theme.status.warning.bg} ${theme.status.warning.text}`}>
                                                                        {item.badge}
                                                                    </span>
                                                                )}
                                                                {item.isNew && (
                                                                    <span className={`ml-2 px-2 py-0.5 text-xs font-semibold rounded-full ${theme.status.success.bg} ${theme.status.success.text}`}>
                                                                        NEW
                                                                    </span>
                                                                )}
                                                                {item.isPro && (
                                                                    <Crown className="w-4 h-4 text-purple-400 ml-2" />
                                                                )}
                                                            </div>
                                                            {item.description && (
                                                                <div className={`text-sm ${theme.textColors.muted} mt-1`}>
                                                                    {item.description}
                                                                </div>
                                                            )}
                                                        </div>
                                                    </Link>
                                                );
                                            })}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.nav>

            {/* Spacer for fixed navigation */}
            <div className="h-16 lg:h-20 w-full"></div>
        </>
    );
};

export default EnhancedProgressNavigation;
