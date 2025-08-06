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
    Users,
    Calculator,
    Briefcase,
    Lightbulb,
    Home,
    Heart,
    Umbrella,
    Timer,
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
                    title: 'Budgeting & Cash Flow Mastery',
                    description: 'Zero-based budgeting, automation, expense tracking',
                    icon: <Calculator className="w-5 h-5" />,
                    route: '/chapter3',
                    lessons: 6,
                    isAvailable: progress.userProgress.currentChapter >= 3,
                    isCompleted: progress.userProgress.currentChapter >= 4
                },
                {
                    id: 4,
                    title: 'Emergency Funds & Financial Security',
                    description: 'Fund sizing, safety strategies, protection planning',
                    icon: <Umbrella className="w-5 h-5" />,
                    route: '/chapter4',
                    lessons: 6,
                    isAvailable: progress.userProgress.currentChapter >= 4,
                    isCompleted: progress.userProgress.currentChapter >= 5
                },
                {
                    id: 5,
                    title: 'Income & Career Optimization',
                    description: 'Salary negotiation, benefits, side hustles',
                    icon: <Briefcase className="w-5 h-5" />,
                    route: '/chapter5',
                    lessons: 6,
                    isAvailable: progress.userProgress.currentChapter >= 5,
                    isCompleted: progress.userProgress.currentChapter >= 6
                },
                {
                    id: 6,
                    title: 'Credit & Debt Management',
                    description: 'Credit scores, debt elimination strategies',
                    icon: <CreditCard className="w-5 h-5" />,
                    route: '/chapter6',
                    lessons: 6,
                    isAvailable: progress.userProgress.currentChapter >= 6,
                    isCompleted: progress.userProgress.currentChapter >= 7
                }
            ]
        },
        {
            id: 'credit-lending',
            title: 'Credit & Lending Track',
            description: 'Master credit optimization, strategic borrowing, and debt management',
            icon: <CreditCard className="w-6 h-6" />,
            color: 'amber',
            totalLessons: 0,
            status: 'coming-soon',
            chapters: []
        },
        {
            id: 'protection',
            title: 'Protection & Planning Track',
            description: 'Protect your wealth with insurance, healthcare planning, and risk management',
            icon: <Shield className="w-6 h-6" />,
            color: 'purple',
            totalLessons: 0,
            status: 'coming-soon',
            chapters: []
        },
        {
            id: 'investment',
            title: 'Investment Track',
            description: 'Build wealth through stocks, bonds, retirement accounts, and advanced strategies',
            icon: <TrendingUp className="w-6 h-6" />,
            color: 'green',
            totalLessons: 42,
            status: 'available',
            chapters: [
                {
                    id: 7,
                    title: 'Investment Fundamentals',
                    description: 'Risk vs return, diversification, dollar-cost averaging',
                    icon: <TrendingUp className="w-5 h-5" />,
                    route: '/chapter7',
                    lessons: 6,
                    isAvailable: progress.userProgress.currentChapter >= 7,
                    isCompleted: progress.userProgress.currentChapter >= 8
                },
                {
                    id: 8,
                    title: 'Portfolio Construction & Asset Allocation',
                    description: 'Modern portfolio theory, rebalancing, risk tolerance',
                    icon: <BarChart3 className="w-5 h-5" />,
                    route: '/chapter8',
                    lessons: 6,
                    isAvailable: progress.userProgress.currentChapter >= 8,
                    isCompleted: progress.userProgress.currentChapter >= 9
                },
                {
                    id: 9,
                    title: 'Retirement Planning & Long-Term Wealth',
                    description: '401k optimization, IRA strategies, withdrawal planning',
                    icon: <Timer className="w-5 h-5" />,
                    route: '/chapter9',
                    lessons: 6,
                    isAvailable: progress.userProgress.currentChapter >= 9,
                    isCompleted: progress.userProgress.currentChapter >= 10
                },
                {
                    id: 10,
                    title: 'Tax Optimization & Planning',
                    description: 'Tax-efficient investing, retirement account strategies',
                    icon: <Calculator className="w-5 h-5" />,
                    route: '/chapter10',
                    lessons: 6,
                    isAvailable: progress.userProgress.currentChapter >= 10,
                    isCompleted: progress.userProgress.currentChapter >= 11
                },
                {
                    id: 11,
                    title: 'Insurance & Risk Management',
                    description: 'Life, disability, property insurance optimization',
                    icon: <Shield className="w-5 h-5" />,
                    route: '/chapter11',
                    lessons: 6,
                    isAvailable: progress.userProgress.currentChapter >= 11,
                    isCompleted: progress.userProgress.currentChapter >= 12
                },
                {
                    id: 12,
                    title: 'Real Estate & Property Investment',
                    description: 'Primary residence vs investment, mortgage strategies',
                    icon: <Home className="w-5 h-5" />,
                    route: '/chapter12',
                    lessons: 6,
                    isAvailable: progress.userProgress.currentChapter >= 12,
                    isCompleted: progress.userProgress.currentChapter >= 13
                },
                {
                    id: 13,
                    title: 'Stock Market Mastery & Trading',
                    description: 'Fundamental and technical analysis, trading strategies',
                    icon: <TrendingUp className="w-5 h-5" />,
                    route: '/chapter13',
                    lessons: 6,
                    isAvailable: progress.userProgress.currentChapter >= 13,
                    isCompleted: progress.userProgress.currentChapter >= 14
                }
            ]
        },
        {
            id: 'protection-planning',
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
            description: 'Master advanced concepts like bonds, alternative investments, and business finance',
            icon: <Building className="w-6 h-6" />,
            color: 'indigo',
            totalLessons: 24,
            status: 'available',
            chapters: [
                {
                    id: 14,
                    title: 'Bonds & Fixed Income',
                    description: 'Government vs corporate bonds, yield analysis',
                    icon: <Shield className="w-5 h-5" />,
                    route: '/chapter14',
                    lessons: 6,
                    isAvailable: progress.userProgress.currentChapter >= 14,
                    isCompleted: progress.userProgress.currentChapter >= 15
                },
                {
                    id: 15,
                    title: 'Alternative Investments',
                    description: 'REITs, commodities, cryptocurrency basics',
                    icon: <Star className="w-5 h-5" />,
                    route: '/chapter15',
                    lessons: 6,
                    isAvailable: progress.userProgress.currentChapter >= 15,
                    isCompleted: progress.userProgress.currentChapter >= 16
                },
                {
                    id: 16,
                    title: 'Business & Entrepreneurship Finance',
                    description: 'Business structures, cash flow, business credit',
                    icon: <Briefcase className="w-5 h-5" />,
                    route: '/chapter16',
                    lessons: 6,
                    isAvailable: progress.userProgress.currentChapter >= 16,
                    isCompleted: progress.userProgress.currentChapter >= 17
                },
                {
                    id: 17,
                    title: 'Estate Planning & Wealth Transfer',
                    description: 'Wills, trusts, beneficiaries, tax strategies',
                    icon: <Users className="w-5 h-5" />,
                    route: '/chapter17',
                    lessons: 6,
                    isAvailable: progress.userProgress.currentChapter >= 17,
                    isCompleted: progress.userProgress.currentChapter >= 18
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
            blue: { bg: `${theme.backgrounds.primary}`, border: `${theme.borderColors.primary}`, text: `${theme.textColors.primary}` },
            amber: { bg: `${theme.status.warning.bg}`, border: `${theme.status.warning.border}`, text: `${theme.status.warning.text}` },
            green: { bg: `${theme.status.success.bg}`, border: `${theme.status.success.border}`, text: `${theme.status.success.text}` },
            purple: { bg: `${theme.backgrounds.card}`, border: `${theme.borderColors.primary}`, text: `${theme.textColors.primary}` },
            indigo: { bg: `${theme.backgrounds.card}`, border: `${theme.borderColors.primary}`, text: `${theme.textColors.primary}` },
            cyan: { bg: `${theme.backgrounds.primary}`, border: `${theme.borderColors.primary}`, text: `${theme.textColors.primary}` },
        };
        return colorMap[color as keyof typeof colorMap][variant];
    };

    return (
        <div className="max-w-7xl mx-auto p-6">
            <div className="text-center mb-12">
                <h2 className={`text-4xl font-bold ${theme.textColors.primary} mb-4`}>Comprehensive Financial Education</h2>
                <p className={`${theme.textColors.muted} text-lg max-w-3xl mx-auto`}>
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
                                        <h3 className={`text-xl font-bold ${theme.textColors.primary}`}>{track.title}</h3>
                                        <p className={`text-sm ${getColorClasses(track.color, 'text')}`}>
                                            {track.totalLessons} Lessons • {track.chapters.length} Chapters
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center">
                                    {track.status === 'available' ? (
                                        <span className={`${theme.status.warning.text} text-xs font-medium ${theme.status.warning.bg.replace("/20", "")}/20 px-3 py-1 rounded-full mr-3`}>
                                            ✅ Available
                                        </span>
                                    ) : (
                                        <span className="text-navy-400 text-xs font-medium bg-navy-400/20 px-3 py-1 rounded-full mr-3">
                                            🚧 Coming Soon
                                        </span>
                                    )}
                                    {expandedTrack === track.id ? (
                                        <ChevronDown className={`w-5 h-5 ${theme.textColors.muted}`} />
                                    ) : (
                                        <ChevronRight className={`w-5 h-5 ${theme.textColors.muted}`} />
                                    )}
                                </div>
                            </div>
                            <p className={`${theme.textColors.secondary} text-sm mb-4`}>{track.description}</p>
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
                                            className={`${theme.backgrounds.glass}/5 backdrop-blur-sm border ${theme.borderColors.muted}/10 rounded-xl p-4 ${chapter.isAvailable ? 'hover:${theme.borderColors.muted}/20 cursor-pointer' : 'opacity-60'
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
            <div className={`mt-12 ${theme.backgrounds.glass}/5 backdrop-blur-xl border ${theme.borderColors.muted}/10 rounded-2xl p-8`}>
                <div className="text-center">
                    <h3 className={`text-2xl font-bold ${theme.textColors.primary} mb-6`}>Your Learning Journey</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        <div className="text-center">
                            <div className={`text-3xl font-bold ${theme.textColors.primary} mb-2`}>
                                {progress.userProgress.currentChapter - 1}
                            </div>
                            <p className={`${theme.textColors.muted} text-sm`}>Chapters Completed</p>
                        </div>
                        <div className="text-center">
                            <div className={`text-3xl font-bold ${theme.status.warning.text} mb-2`}>
                                {progress.userProgress.completedLessons.length}
                            </div>
                            <p className={`${theme.textColors.muted} text-sm`}>Lessons Completed</p>
                        </div>
                        <div className="text-center">
                            <div className={`text-3xl font-bold ${theme.status.warning.text} mb-2`}>
                                {Math.round(((progress.userProgress.currentChapter - 1) / 17) * 100)}%
                            </div>
                            <p className={`${theme.textColors.muted} text-sm`}>Overall Progress</p>
                        </div>
                        <div className="text-center">
                            <div className="text-3xl font-bold text-navy-400 mb-2">17</div>
                            <p className={`${theme.textColors.muted} text-sm`}>Available Chapters</p>
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
                <h4 className={`font-semibold ${theme.textColors.primary} text-sm`}>Chapter {chapter.id}: {chapter.title}</h4>
                <p className={`${theme.textColors.muted} text-xs`}>{chapter.description}</p>
            </div>
        </div>
        <div className="flex items-center">
            <span className={`${theme.textColors.muted} text-xs mr-3`}>{chapter.lessons} Lessons</span>
            {chapter.isCompleted ? (
                <CheckCircle className={`w-4 h-4 ${theme.status.warning.text}`} />
            ) : chapter.isAvailable ? (
                <ChevronRight className={`w-4 h-4 ${theme.textColors.muted}`} />
            ) : (
                <Lock className={`w-4 h-4 ${theme.textColors.muted}`} />
            )}
        </div>
    </div>
);

export default ComprehensiveNavigation;
