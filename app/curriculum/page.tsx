'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import ComprehensiveNavigation from '@/components/shared/ui/ComprehensiveNavigation';
import { ArrowLeft, BookOpen, Target, Star } from 'lucide-react';
import { theme } from '@/lib/theme';

export default function CurriculumPage() {
    return (
        <div className={`min-h-screen ${theme.backgrounds.primary}`}>
            {/* Header */}
            <div className={`${theme.backgrounds.header} border-b ${theme.borderColors.primary} sticky top-0 z-50`}>
                <div className="max-w-7xl mx-auto px-6 py-4">
                    <div className="flex items-center justify-between">
                        <Link href="/" className={`flex items-center ${theme.textColors.primary} hover:${theme.textColors.accent} transition-colors`}>
                            <ArrowLeft className="w-5 h-5 mr-2" />
                            Back to Home
                        </Link>
                        <div className="flex items-center space-x-4">
                            <Link href="/health-assessment">
                                <Button className={`${theme.buttons.primary}`}>
                                    <Target className="w-4 h-4 mr-2" />
                                    Take Assessment
                                </Button>
                            </Link>
                            <Link href="/chapter1">
                                <Button className={`${theme.buttons.accent}`}>
                                    <BookOpen className="w-4 h-4 mr-2" />
                                    Start Learning
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            {/* Hero Section */}
            <div className="relative py-20">
                <div className="max-w-7xl mx-auto px-6 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <h1 className={`${theme.typography.heading1} md:text-6xl mb-6`}>
                            <span className="bg-gradient-to-r from-blue-400 via-blue-500 to-amber-400 bg-clip-text text-transparent">
                                Complete Financial
                            </span>
                            <br />
                            <span className={theme.textColors.primary}>Mastery Curriculum</span>
                        </h1>
                        <p className={`${theme.typography.heading4} ${theme.textColors.secondary} max-w-3xl mx-auto mb-8`}>
                            30 comprehensive chapters across 6 specialized learning tracks.
                            From financial psychology to advanced wealth management - master every aspect of personal finance.
                        </p>

                        <div className={`flex flex-wrap items-center justify-center gap-8 ${theme.typography.small} ${theme.textColors.muted} mb-12`}>
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                                <span>30 Specialized Chapters</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 bg-amber-500 rounded-full"></div>
                                <span>180+ Interactive Lessons</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 bg-amber-500 rounded-full"></div>
                                <span>20+ Financial Calculators</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                                <span>Real AI Coaching</span>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-12">
                            <div className={`${theme.backgrounds.card} border border-blue-500/20 rounded-2xl ${theme.spacing.md}`}>
                                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                                    <BookOpen className={`w-6 h-6 ${theme.textColors.primary}`} />
                                </div>
                                <h3 className={`${theme.typography.heading4} ${theme.textColors.primary} mb-2`}>Foundation Track</h3>
                                <p className={`${theme.textColors.secondary} ${theme.typography.small}`}>Master psychology, banking, income, and debt fundamentals</p>
                                <div className={`mt-3 ${theme.textColors.accent} ${theme.typography.tiny} font-medium`}>✅ 5 Chapters Available</div>
                            </div>

                            <div className={`${theme.backgrounds.card} border ${theme.borderColors.accent} rounded-2xl ${theme.spacing.md}`}>
                                <div className="w-12 h-12 bg-gradient-to-r from-amber-500 to-amber-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                                    <Target className={`w-6 h-6 ${theme.textColors.primary}`} />
                                </div>
                                <h3 className={`${theme.typography.heading4} ${theme.textColors.primary} mb-2`}>Advanced Tracks</h3>
                                <p className={`${theme.textColors.secondary} ${theme.typography.small}`}>Investment, protection, tax planning, and economic literacy</p>
                                <div className={`mt-3 ${theme.textColors.warning} ${theme.typography.tiny} font-medium`}>🚧 25 Chapters Coming Soon</div>
                            </div>

                            <div className={`${theme.backgrounds.card} border ${theme.borderColors.accent} rounded-2xl ${theme.spacing.md}`}>
                                <div className="w-12 h-12 bg-gradient-to-r from-amber-500 to-amber-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                                    <Star className={`w-6 h-6 ${theme.textColors.primary}`} />
                                </div>
                                <h3 className={`${theme.typography.heading4} ${theme.textColors.primary} mb-2`}>Complete Mastery</h3>
                                <p className={`${theme.textColors.secondary} ${theme.typography.small}`}>Professional-level financial literacy with certification</p>
                                <div className={`mt-3 ${theme.textColors.accent} ${theme.typography.tiny} font-medium`}>🎯 Industry Recognition</div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* Comprehensive Navigation */}
            <div className="pb-20">
                <ComprehensiveNavigation />
            </div>

            {/* Call to Action */}
            <div className="bg-gradient-to-r from-blue-900/30 via-slate-800/30 to-blue-900/30 border-t border-blue-700/30 py-16">
                <div className="max-w-4xl mx-auto px-6 text-center">
                    <h2 className={`${theme.typography.heading2} ${theme.textColors.primary} mb-4`}>Ready to Transform Your Financial Life?</h2>
                    <p className={`${theme.textColors.secondary} ${theme.typography.heading4} mb-8 max-w-2xl mx-auto`}>
                        Start with our proven Foundation Track and unlock the complete curriculum as you master each chapter.
                    </p>
                    <div className="flex flex-wrap items-center justify-center gap-4">
                        <Link href="/health-assessment">
                            <Button size="lg" className={`${theme.buttons.primary} px-8 py-4 ${theme.typography.heading4}`}>
                                <Target className="w-5 h-5 mr-2" />
                                Start with Assessment
                            </Button>
                        </Link>
                        <Link href="/chapter1">
                            <Button size="lg" className={`${theme.buttons.ghost} border ${theme.borderColors.primary} backdrop-blur-sm px-8 py-4 ${theme.typography.heading4}`}>
                                <BookOpen className="w-5 h-5 mr-2" />
                                Begin Chapter 1
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
