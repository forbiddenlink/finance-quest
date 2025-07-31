'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import ComprehensiveNavigation from '@/components/shared/ui/ComprehensiveNavigation';
import { ArrowLeft, BookOpen, Target, Star } from 'lucide-react';

export default function CurriculumPage() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
            {/* Header */}
            <div className="bg-slate-900/50 backdrop-blur-xl border-b border-slate-700/50 sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-6 py-4">
                    <div className="flex items-center justify-between">
                        <Link href="/" className="flex items-center text-white hover:text-blue-400 transition-colors">
                            <ArrowLeft className="w-5 h-5 mr-2" />
                            Back to Home
                        </Link>
                        <div className="flex items-center space-x-4">
                            <Link href="/health-assessment">
                                <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                                    <Target className="w-4 h-4 mr-2" />
                                    Take Assessment
                                </Button>
                            </Link>
                            <Link href="/chapter1">
                                <Button className="bg-amber-600 hover:bg-amber-700 text-white">
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
                        <h1 className="text-5xl md:text-6xl font-bold mb-6">
                            <span className="bg-gradient-to-r from-blue-400 via-blue-500 to-amber-400 bg-clip-text text-transparent">
                                Complete Financial
                            </span>
                            <br />
                            <span className="text-white">Mastery Curriculum</span>
                        </h1>
                        <p className="text-xl text-gray-400 max-w-3xl mx-auto mb-8">
                            30 comprehensive chapters across 6 specialized learning tracks.
                            From financial psychology to advanced wealth management - master every aspect of personal finance.
                        </p>

                        <div className="flex flex-wrap items-center justify-center gap-8 text-sm text-gray-400 mb-12">
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
                                <div className="w-3 h-3 bg-navy-500 rounded-full"></div>
                                <span>Real AI Coaching</span>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-12">
                            <div className="bg-white/5 backdrop-blur-xl border border-navy-500/20 rounded-2xl p-6">
                                <div className="w-12 h-12 bg-gradient-to-r from-navy-500 to-navy-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                                    <BookOpen className="w-6 h-6 text-white" />
                                </div>
                                <h3 className="text-lg font-bold text-white mb-2">Foundation Track</h3>
                                <p className="text-gray-400 text-sm">Master psychology, banking, income, and debt fundamentals</p>
                                <div className="mt-3 text-amber-400 text-xs font-medium">✅ 5 Chapters Available</div>
                            </div>

                            <div className="bg-white/5 backdrop-blur-xl border border-amber-500/20 rounded-2xl p-6">
                                <div className="w-12 h-12 bg-gradient-to-r from-amber-500 to-amber-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                                    <Target className="w-6 h-6 text-white" />
                                </div>
                                <h3 className="text-lg font-bold text-white mb-2">Advanced Tracks</h3>
                                <p className="text-gray-400 text-sm">Investment, protection, tax planning, and economic literacy</p>
                                <div className="mt-3 text-navy-400 text-xs font-medium">🚧 25 Chapters Coming Soon</div>
                            </div>

                            <div className="bg-white/5 backdrop-blur-xl border border-amber-500/20 rounded-2xl p-6">
                                <div className="w-12 h-12 bg-gradient-to-r from-amber-500 to-amber-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                                    <Star className="w-6 h-6 text-white" />
                                </div>
                                <h3 className="text-lg font-bold text-white mb-2">Complete Mastery</h3>
                                <p className="text-gray-400 text-sm">Professional-level financial literacy with certification</p>
                                <div className="mt-3 text-blue-400 text-xs font-medium">🎯 Industry Recognition</div>
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
                    <h2 className="text-3xl font-bold text-white mb-4">Ready to Transform Your Financial Life?</h2>
                    <p className="text-gray-400 text-lg mb-8 max-w-2xl mx-auto">
                        Start with our proven Foundation Track and unlock the complete curriculum as you master each chapter.
                    </p>
                    <div className="flex flex-wrap items-center justify-center gap-4">
                        <Link href="/health-assessment">
                            <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 text-lg">
                                <Target className="w-5 h-5 mr-2" />
                                Start with Assessment
                            </Button>
                        </Link>
                        <Link href="/chapter1">
                            <Button size="lg" variant="outline" className="border-white/20 text-white hover:bg-white/10 px-8 py-4 text-lg">
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
