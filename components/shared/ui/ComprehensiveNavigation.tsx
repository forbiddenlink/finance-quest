'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { useEnhancedProgress } from '@/lib/store/progressHooks';
import { theme } from '@/lib/theme';
import {
    BookOpen,
    CreditCard,
    TrendingUp,
    Shield,
    Building,
    Globe,
    ChevronRight,
    ChevronDown,
    Lock,
    CheckCircle,
    Star,
    Target,
    Users,
    Calculator,
    Briefcase,
    PiggyBank,
    Lightbulb,
    Home,
    Heart,
    Umbrella,
    Timer,
    Award,
    BarChart3
} from 'lucide-react';

interface LearningTrack {
    id: string;
    title: string;
    description: string;
    icon: React.ReactNode;
    color: string;
    chapters: Chapter[];
    totalLessons: number;
    status: 'available' | 'coming-soon';
}

interface Chapter {
    id: number;
    title: string;
    description: string;
    icon: React.ReactNode;
    route?: string;
    lessons: number;
    isAvailable: boolean;
    isCompleted: boolean;
}

const ComprehensiveNavigation = () => {
    const progress = useEnhancedProgress();
    const [expandedTrack, setExpandedTrack] = useState<string | null>(null);

    const learningTracks: LearningTrack[] = [
        {
            id: 'foundation',
            title: 'Foundation Track',
            description: 'Master the psychological and practical foundations of personal finance',
            icon: <BookOpen className="w-6 h-6" />,
            color: 'blue',
            totalLessons: 36,
            status: 'available',
            chapters: [
                {
                    id: 1,
                    title: 'Money Psychology & Mindset',
                    description: 'Emotional relationships, cognitive biases, goal setting',
                    icon: <Lightbulb className="w-5 h-5" />,
                    route: '/chapter1',
                    lessons: 6,
                    isAvailable: true,
                    isCompleted: progress.userProgress.currentChapter >= 2
                },
                {
                    id: 2,
                    title: 'Banking & Account Fundamentals',
                    description: 'Account optimization, fees, credit unions',
                    icon: <Building className="w-5 h-5" />,
                    route: '/chapter2',
                    lessons: 6,
                    isAvailable: progress.userProgress.currentChapter >= 2,
                    isCompleted: progress.userProgress.currentChapter >= 3
                },
                {
                    id: 3,
                    title: 'Income & Career Finance',
                    description: 'Salary negotiation, benefits, side hustles',
                    icon: <Briefcase className="w-5 h-5" />,
                    route: '/chapter3',
                    lessons: 6,
                    isAvailable: progress.userProgress.currentChapter >= 3,
                    isCompleted: progress.userProgress.currentChapter >= 4
                },
                {
                    id: 4,
                    title: 'Credit & Debt Management',
                    description: 'Credit scores, debt elimination strategies',
                    icon: <CreditCard className="w-5 h-5" />,
                    route: '/chapter4',
                    lessons: 6,
                    isAvailable: progress.userProgress.currentChapter >= 4,
                    isCompleted: progress.userProgress.currentChapter >= 5
                },
                {
                    id: 5,
                    title: 'Emergency Funds & Safety',
                    description: 'Fund sizing, savings strategies',
                    icon: <Umbrella className="w-5 h-5" />,
                    route: '/chapter5',
                    lessons: 6,
                    isAvailable: progress.userProgress.currentChapter >= 5,
                    isCompleted: progress.userProgress.currentChapter >= 6
                },
                {
                    id: 6,
                    title: 'Budgeting Mastery & Cash Flow',
                    description: 'Zero-based budgeting, automation, expense tracking',
                    icon: <Calculator className="w-5 h-5" />,
                    lessons: 6,
                    isAvailable: false,
                    isCompleted: false
                }
            ]
        },
        {
            id: 'credit-lending',
            title: 'Credit & Lending Track',
            description: 'Master credit optimization, strategic borrowing, and debt management',
            icon: <CreditCard className="w-6 h-6" />,
            color: 'amber',
            totalLessons: 24,
            status: 'coming-soon',
            chapters: [
                {
                    id: 7,
                    title: 'Credit Scores & Reports Deep Dive',
                    description: 'FICO vs VantageScore, dispute processes, building strategies',
                    icon: <Star className="w-5 h-5" />,
                    route: '/chapter7',
                    lessons: 6,
                    isAvailable: progress.userProgress.currentChapter >= 6,
                    isCompleted: false
                },
                {
                    id: 8,
                    title: 'Credit Cards Mastery',
                    description: 'Rewards optimization, balance transfers, utilization',
                    icon: <CreditCard className="w-5 h-5" />,
                    lessons: 6,
                    isAvailable: false,
                    isCompleted: false
                },
                {
                    id: 9,
                    title: 'Personal Loans & Lines of Credit',
                    description: 'Shopping strategies, HELOC, payday alternatives',
                    icon: <Target className="w-5 h-5" />,
                    lessons: 6,
                    isAvailable: false,
                    isCompleted: false
                },
                {
                    id: 10,
                    title: 'Student Loans & Education Finance',
                    description: 'Federal vs private, forgiveness programs, refinancing',
                    icon: <BookOpen className="w-5 h-5" />,
                    lessons: 6,
                    isAvailable: false,
                    isCompleted: false
                }
            ]
        },
        {
            id: 'investment',
            title: 'Investment Track',
            description: 'Build wealth through stocks, bonds, retirement accounts, and advanced strategies',
            icon: <TrendingUp className="w-6 h-6" />,
            color: 'green',
            totalLessons: 36,
            status: 'coming-soon',
            chapters: [
                {
                    id: 11,
                    title: 'Investment Fundamentals',
                    description: 'Risk vs return, diversification, dollar-cost averaging',
                    icon: <TrendingUp className="w-5 h-5" />,
                    lessons: 6,
                    isAvailable: false,
                    isCompleted: false
                },
                {
                    id: 12,
                    title: 'Stocks & Equity Investing',
                    description: 'Company analysis, dividend investing, international exposure',
                    icon: <BarChart3 className="w-5 h-5" />,
                    lessons: 6,
                    isAvailable: false,
                    isCompleted: false
                },
                {
                    id: 13,
                    title: 'Bonds & Fixed Income',
                    description: 'Government vs corporate, ladders, municipal bonds',
                    icon: <Shield className="w-5 h-5" />,
                    lessons: 6,
                    isAvailable: false,
                    isCompleted: false
                },
                {
                    id: 14,
                    title: 'Mutual Funds & ETFs',
                    description: 'Expense ratios, active vs passive, index funds',
                    icon: <Users className="w-5 h-5" />,
                    lessons: 6,
                    isAvailable: false,
                    isCompleted: false
                },
                {
                    id: 15,
                    title: 'Retirement Accounts Mastery',
                    description: '401k optimization, IRA types, rollover strategies',
                    icon: <Timer className="w-5 h-5" />,
                    lessons: 6,
                    isAvailable: false,
                    isCompleted: false
                },
                {
                    id: 16,
                    title: 'Advanced Investment Strategies',
                    description: 'Options basics, REITs, tax-loss harvesting',
                    icon: <Award className="w-5 h-5" />,
                    lessons: 6,
                    isAvailable: false,
                    isCompleted: false
                }
            ]
        },
        {
            id: 'protection',
            title: 'Protection & Planning Track',
            description: 'Protect your wealth with insurance, healthcare planning, and risk management',
            icon: <Shield className="w-6 h-6" />,
            color: 'purple',
            totalLessons: 24,
            status: 'coming-soon',
            chapters: [
                {
                    id: 17,
                    title: 'Insurance Fundamentals',
                    description: 'Risk assessment, coverage optimization, claims processes',
                    icon: <Shield className="w-5 h-5" />,
                    lessons: 6,
                    isAvailable: false,
                    isCompleted: false
                },
                {
                    id: 18,
                    title: 'Health Insurance & Healthcare Finance',
                    description: 'Plan types, HSA optimization, medical debt',
                    icon: <Heart className="w-5 h-5" />,
                    lessons: 6,
                    isAvailable: false,
                    isCompleted: false
                },
                {
                    id: 19,
                    title: 'Life & Disability Insurance',
                    description: 'Term vs whole life, coverage calculation',
                    icon: <Users className="w-5 h-5" />,
                    lessons: 6,
                    isAvailable: false,
                    isCompleted: false
                },
                {
                    id: 20,
                    title: 'Property & Casualty Insurance',
                    description: 'Auto/home optimization, umbrella policies',
                    icon: <Home className="w-5 h-5" />,
                    lessons: 6,
                    isAvailable: false,
                    isCompleted: false
                }
            ]
        },
        {
            id: 'advanced',
            title: 'Advanced Planning Track',
            description: 'Master tax optimization, real estate, business finance, and estate planning',
            icon: <Building className="w-6 h-6" />,
            color: 'indigo',
            totalLessons: 30,
            status: 'coming-soon',
            chapters: [
                {
                    id: 21,
                    title: 'Tax Strategy & Optimization',
                    description: 'Bracket optimization, deductions, tax-advantaged accounts',
                    icon: <Calculator className="w-5 h-5" />,
                    lessons: 6,
                    isAvailable: false,
                    isCompleted: false
                },
                {
                    id: 22,
                    title: 'Real Estate Investment',
                    description: 'Primary residence vs investment, mortgage strategies',
                    icon: <Home className="w-5 h-5" />,
                    lessons: 6,
                    isAvailable: false,
                    isCompleted: false
                },
                {
                    id: 23,
                    title: 'Business & Entrepreneurship Finance',
                    description: 'Structure selection, cash flow, business credit',
                    icon: <Briefcase className="w-5 h-5" />,
                    lessons: 6,
                    isAvailable: false,
                    isCompleted: false
                },
                {
                    id: 24,
                    title: 'Estate Planning Fundamentals',
                    description: 'Wills, trusts, beneficiaries, probate avoidance',
                    icon: <Users className="w-5 h-5" />,
                    lessons: 6,
                    isAvailable: false,
                    isCompleted: false
                },
                {
                    id: 25,
                    title: 'Financial Independence & Early Retirement',
                    description: 'FIRE principles, withdrawal strategies',
                    icon: <PiggyBank className="w-5 h-5" />,
                    lessons: 6,
                    isAvailable: false,
                    isCompleted: false
                }
            ]
        },
        {
            id: 'economic',
            title: 'Economic Literacy Track',
            description: 'Understand markets, economic policy, global finance, and crisis preparation',
            icon: <Globe className="w-6 h-6" />,
            color: 'cyan',
            totalLessons: 30,
            status: 'coming-soon',
            chapters: [
                {
                    id: 26,
                    title: 'Economic Fundamentals',
                    description: 'GDP, inflation, Federal Reserve, business cycles',
                    icon: <Globe className="w-5 h-5" />,
                    lessons: 6,
                    isAvailable: false,
                    isCompleted: false
                },
                {
                    id: 27,
                    title: 'Market Psychology & Behavioral Finance',
                    description: 'Bubbles, biases, contrarian thinking',
                    icon: <Lightbulb className="w-5 h-5" />,
                    lessons: 6,
                    isAvailable: false,
                    isCompleted: false
                },
                {
                    id: 28,
                    title: 'Global Economics & Currency',
                    description: 'International investing, currency risk, diversification',
                    icon: <Globe className="w-5 h-5" />,
                    lessons: 6,
                    isAvailable: false,
                    isCompleted: false
                },
                {
                    id: 29,
                    title: 'Economic Policy Impact',
                    description: 'Fiscal vs monetary policy, election impacts on markets',
                    icon: <Building className="w-5 h-5" />,
                    lessons: 6,
                    isAvailable: false,
                    isCompleted: false
                },
                {
                    id: 30,
                    title: 'Crisis Preparation & Recovery',
                    description: 'Recession strategies, portfolio stress testing',
                    icon: <Shield className="w-5 h-5" />,
                    lessons: 6,
                    isAvailable: false,
                    isCompleted: false
                }
            ]
        }
    ];

    const getColorClasses = (color: string, variant: 'bg' | 'border' | 'text') => {
        const colorMap = {
            blue: { bg: 'from-navy-600/10 to-navy-700/10', border: 'border-navy-500/20 hover:border-navy-400/40', text: 'text-navy-400' },
            amber: { bg: 'from-amber-500/10 to-amber-600/10', border: 'border-amber-500/20 hover:border-amber-400/40', text: 'text-amber-400' },
            green: { bg: 'from-navy-600/10 to-amber-600/10', border: 'border-amber-500/20 hover:border-amber-400/40', text: 'text-amber-400' },
            purple: { bg: 'from-navy-600/10 to-navy-700/10', border: 'border-navy-500/20 hover:border-navy-400/40', text: 'text-navy-400' },
            indigo: { bg: 'from-navy-600/10 to-navy-700/10', border: 'border-navy-500/20 hover:border-navy-400/40', text: 'text-navy-400' },
            cyan: { bg: 'from-navy-600/10 to-amber-600/10', border: 'border-amber-500/20 hover:border-amber-400/40', text: 'text-amber-400' },
        };
        return colorMap[color as keyof typeof colorMap][variant];
    };

    return (
        <div className="max-w-7xl mx-auto p-6">
            <div className="text-center mb-12">
                <h2 className="text-4xl font-bold text-white mb-4">Comprehensive Financial Education</h2>
                <p className="text-gray-400 text-lg max-w-3xl mx-auto">
                    Master every aspect of personal finance through 30 specialized chapters across 6 learning tracks
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {learningTracks.map((track, index) => (
                    <motion.div
                        key={track.id}
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1, duration: 0.6 }}
                        className={`bg-gradient-to-br ${getColorClasses(track.color, 'bg')} border ${getColorClasses(track.color, 'border')} rounded-2xl p-6 transition-all duration-300`}
                    >
                        {/* Track Header */}
                        <div
                            className="cursor-pointer"
                            onClick={() => setExpandedTrack(expandedTrack === track.id ? null : track.id)}
                        >
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center">
                                    <div className={`w-12 h-12 bg-gradient-to-r from-${track.color}-500 to-${track.color}-600 rounded-xl flex items-center justify-center mr-4 shadow-lg shadow-${track.color}-500/25`}>
                                        {track.icon}
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold text-white">{track.title}</h3>
                                        <p className={`text-sm ${getColorClasses(track.color, 'text')}`}>
                                            {track.totalLessons} Lessons • {track.chapters.length} Chapters
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center">
                                    {track.status === 'available' ? (
                                        <span className="text-amber-400 text-xs font-medium bg-amber-400/20 px-3 py-1 rounded-full mr-3">
                                            ✅ Available
                                        </span>
                                    ) : (
                                        <span className="text-navy-400 text-xs font-medium bg-navy-400/20 px-3 py-1 rounded-full mr-3">
                                            🚧 Coming Soon
                                        </span>
                                    )}
                                    {expandedTrack === track.id ? (
                                        <ChevronDown className="w-5 h-5 text-gray-400" />
                                    ) : (
                                        <ChevronRight className="w-5 h-5 text-gray-400" />
                                    )}
                                </div>
                            </div>
                            <p className="text-gray-300 text-sm mb-4">{track.description}</p>
                        </div>

                        {/* Expanded Chapters */}
                        <AnimatePresence>
                            {expandedTrack === track.id && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                    className="space-y-3 overflow-hidden"
                                >
                                    {track.chapters.map((chapter) => (
                                        <div
                                            key={chapter.id}
                                            className={`${theme.backgrounds.glass}/5 backdrop-blur-sm border border-white/10 rounded-xl p-4 ${chapter.isAvailable ? 'hover:border-white/20 cursor-pointer' : 'opacity-60'
                                                } transition-all duration-300`}
                                        >
                                            {chapter.route && chapter.isAvailable ? (
                                                <Link href={chapter.route} className="block">
                                                    <ChapterContent chapter={chapter} />
                                                </Link>
                                            ) : (
                                                <ChapterContent chapter={chapter} />
                                            )}
                                        </div>
                                    ))}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.div>
                ))}
            </div>

            {/* Overall Progress Summary */}
            <div className={`mt-12 ${theme.backgrounds.glass}/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8`}>
                <div className="text-center">
                    <h3 className="text-2xl font-bold text-white mb-6">Your Learning Journey</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        <div className="text-center">
                            <div className="text-3xl font-bold text-blue-400 mb-2">
                                {progress.userProgress.currentChapter - 1}
                            </div>
                            <p className="text-gray-400 text-sm">Chapters Completed</p>
                        </div>
                        <div className="text-center">
                            <div className="text-3xl font-bold text-amber-400 mb-2">
                                {progress.userProgress.completedLessons.length}
                            </div>
                            <p className="text-gray-400 text-sm">Lessons Completed</p>
                        </div>
                        <div className="text-center">
                            <div className="text-3xl font-bold text-amber-400 mb-2">
                                {Math.round(((progress.userProgress.currentChapter - 1) / 5) * 100)}%
                            </div>
                            <p className="text-gray-400 text-sm">Foundation Track</p>
                        </div>
                        <div className="text-center">
                            <div className="text-3xl font-bold text-navy-400 mb-2">30</div>
                            <p className="text-gray-400 text-sm">Total Chapters</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const ChapterContent = ({ chapter }: { chapter: Chapter }) => (
    <div className="flex items-center justify-between">
        <div className="flex items-center">
            <div className={`w-8 h-8 ${theme.backgrounds.glass}/10 rounded-lg flex items-center justify-center mr-3`}>
                {chapter.icon}
            </div>
            <div>
                <h4 className="font-semibold text-white text-sm">Chapter {chapter.id}: {chapter.title}</h4>
                <p className="text-gray-400 text-xs">{chapter.description}</p>
            </div>
        </div>
        <div className="flex items-center">
            <span className="text-gray-400 text-xs mr-3">{chapter.lessons} Lessons</span>
            {chapter.isCompleted ? (
                <CheckCircle className="w-4 h-4 text-amber-400" />
            ) : chapter.isAvailable ? (
                <ChevronRight className="w-4 h-4 text-gray-400" />
            ) : (
                <Lock className="w-4 h-4 text-gray-500" />
            )}
        </div>
    </div>
);

export default ComprehensiveNavigation;
