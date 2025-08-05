'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useProgressStore } from '@/lib/store/progressStore';
import { theme } from '@/lib/theme';
import {
    ChevronLeft,
    ChevronRight,
    Target,
    Clock,
    TrendingUp,
    Award,
    BookOpen,
    Calculator,
    Brain,
    Zap,
    CheckCircle,
    ArrowRight,
    DollarSign,
    PiggyBank,
    CreditCard,
    Home,
    Car,
    GraduationCap,
    Briefcase,
    X
} from 'lucide-react';

interface OnboardingStep {
    id: string;
    title: string;
    description: string;
    component: React.ComponentType<{ onNext: () => void; onPrev: () => void; data: any; setData: (data: any) => void }>;
}

interface UserPreferences {
    goals: string[];
    experienceLevel: 'beginner' | 'intermediate' | 'advanced';
    timeCommitment: number; // minutes per day
    focusAreas: string[];
    learningStyle: 'visual' | 'hands-on' | 'reading' | 'mixed';
    notifications: boolean;
    weeklyGoal: number;
}

// Financial Goal Selection Component
const GoalSelectionStep: React.FC<{ onNext: () => void; onPrev: () => void; data: any; setData: (data: any) => void }> = ({
    onNext, data, setData
}) => {
    const goals = [
        { id: 'budgeting', label: 'Master Budgeting', icon: PiggyBank, description: 'Learn to track and control your spending' },
        { id: 'investing', label: 'Start Investing', icon: TrendingUp, description: 'Build wealth through smart investment strategies' },
        { id: 'debt', label: 'Eliminate Debt', icon: CreditCard, description: 'Create a plan to become debt-free' },
        { id: 'emergency', label: 'Emergency Fund', icon: Target, description: 'Build a financial safety net' },
        { id: 'home', label: 'Buy a Home', icon: Home, description: 'Prepare for homeownership' },
        { id: 'retirement', label: 'Retire Comfortably', icon: Clock, description: 'Plan for your golden years' },
        { id: 'education', label: 'Fund Education', icon: GraduationCap, description: 'Save for education expenses' },
        { id: 'business', label: 'Start a Business', icon: Briefcase, description: 'Learn entrepreneurial finance' }
    ];

    const selectedGoals = data.goals || [];

    const toggleGoal = (goalId: string) => {
        const newGoals = selectedGoals.includes(goalId)
            ? selectedGoals.filter((g: string) => g !== goalId)
            : [...selectedGoals, goalId];
        setData({ ...data, goals: newGoals });
    };

    return (
        <div className="max-w-2xl mx-auto">
            <div className="text-center mb-8">
                <h2 className={`text-3xl font-bold ${theme.textColors.primary} mb-4`}>
                    What are your financial goals?
                </h2>
                <p className={`text-lg ${theme.textColors.secondary}`}>
                    Select all that apply. We'll personalize your learning path based on your goals.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                {goals.map((goal) => {
                    const IconComponent = goal.icon;
                    const isSelected = selectedGoals.includes(goal.id);

                    return (
                        <motion.button
                            key={goal.id}
                            onClick={() => toggleGoal(goal.id)}
                            className={`p-6 rounded-xl border-2 text-left transition-all duration-200 ${isSelected
                                    ? `${theme.borderColors.accent} ${theme.backgrounds.cardHover}`
                                    : `${theme.borderColors.primary} ${theme.backgrounds.card} hover:${theme.backgrounds.cardHover}`
                                }`}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            <div className="flex items-start space-x-4">
                                <div className={`p-3 rounded-lg ${isSelected ? 'bg-blue-500/20' : theme.backgrounds.glass + '/20'}`}>
                                    <IconComponent className={`w-6 h-6 ${isSelected ? 'text-blue-400' : theme.textColors.accent}`} />
                                </div>
                                <div className="flex-1">
                                    <h3 className={`font-semibold ${theme.textColors.primary} mb-2`}>
                                        {goal.label}
                                    </h3>
                                    <p className={`text-sm ${theme.textColors.secondary}`}>
                                        {goal.description}
                                    </p>
                                </div>
                                {isSelected && (
                                    <CheckCircle className="w-6 h-6 text-blue-400 flex-shrink-0" />
                                )}
                            </div>
                        </motion.button>
                    );
                })}
            </div>

            <div className="flex justify-center">
                <motion.button
                    onClick={onNext}
                    disabled={selectedGoals.length === 0}
                    className={`px-8 py-3 rounded-xl font-semibold transition-all duration-200 ${selectedGoals.length > 0
                            ? `${theme.buttons.primary} hover:scale-105`
                            : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                        }`}
                    whileHover={selectedGoals.length > 0 ? { scale: 1.05 } : {}}
                    whileTap={selectedGoals.length > 0 ? { scale: 0.95 } : {}}
                >
                    Continue
                    <ArrowRight className="w-5 h-5 ml-2 inline" />
                </motion.button>
            </div>
        </div>
    );
};

// Experience Level Selection Component
const ExperienceLevelStep: React.FC<{ onNext: () => void; onPrev: () => void; data: any; setData: (data: any) => void }> = ({
    onNext, onPrev, data, setData
}) => {
    const levels = [
        {
            id: 'beginner',
            title: 'Beginner',
            description: 'New to personal finance and eager to learn the basics',
            features: ['Start with fundamentals', 'Step-by-step guidance', 'Basic terminology', 'Simple concepts'],
            color: 'text-green-400 bg-green-500/20'
        },
        {
            id: 'intermediate',
            title: 'Intermediate',
            description: 'Some knowledge of finance but want to deepen understanding',
            features: ['Build on existing knowledge', 'Advanced strategies', 'Investment basics', 'Goal-oriented planning'],
            color: 'text-blue-400 bg-blue-500/20'
        },
        {
            id: 'advanced',
            title: 'Advanced',
            description: 'Strong financial foundation, looking for expert-level insights',
            features: ['Complex strategies', 'Portfolio optimization', 'Tax planning', 'Wealth management'],
            color: 'text-purple-400 bg-purple-500/20'
        }
    ];

    const selectedLevel = data.experienceLevel;

    return (
        <div className="max-w-3xl mx-auto">
            <div className="text-center mb-8">
                <h2 className={`text-3xl font-bold ${theme.textColors.primary} mb-4`}>
                    What's your experience level?
                </h2>
                <p className={`text-lg ${theme.textColors.secondary}`}>
                    This helps us customize the difficulty and pace of your learning journey.
                </p>
            </div>

            <div className="space-y-4 mb-8">
                {levels.map((level) => (
                    <motion.button
                        key={level.id}
                        onClick={() => setData({ ...data, experienceLevel: level.id })}
                        className={`w-full p-6 rounded-xl border-2 text-left transition-all duration-200 ${selectedLevel === level.id
                                ? `${theme.borderColors.accent} ${theme.backgrounds.cardHover}`
                                : `${theme.borderColors.primary} ${theme.backgrounds.card} hover:${theme.backgrounds.cardHover}`
                            }`}
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.99 }}
                    >
                        <div className="flex items-start justify-between">
                            <div className="flex-1">
                                <div className="flex items-center mb-3">
                                    <div className={`p-2 rounded-lg ${level.color} mr-4`}>
                                        <Brain className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h3 className={`text-xl font-semibold ${theme.textColors.primary}`}>
                                            {level.title}
                                        </h3>
                                        <p className={`text-sm ${theme.textColors.secondary}`}>
                                            {level.description}
                                        </p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-2 mt-4">
                                    {level.features.map((feature, index) => (
                                        <div key={index} className="flex items-center">
                                            <CheckCircle className={`w-4 h-4 ${theme.textColors.accent} mr-2`} />
                                            <span className={`text-sm ${theme.textColors.secondary}`}>{feature}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {selectedLevel === level.id && (
                                <div className="ml-4">
                                    <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                                        <CheckCircle className="w-5 h-5 text-white" />
                                    </div>
                                </div>
                            )}
                        </div>
                    </motion.button>
                ))}
            </div>

            <div className="flex justify-between">
                <motion.button
                    onClick={onPrev}
                    className={`px-6 py-3 rounded-xl border ${theme.borderColors.primary} ${theme.textColors.secondary} hover:${theme.backgrounds.cardHover} transition-all duration-200`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                >
                    <ChevronLeft className="w-5 h-5 mr-2 inline" />
                    Back
                </motion.button>

                <motion.button
                    onClick={onNext}
                    disabled={!selectedLevel}
                    className={`px-8 py-3 rounded-xl font-semibold transition-all duration-200 ${selectedLevel
                            ? `${theme.buttons.primary} hover:scale-105`
                            : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                        }`}
                    whileHover={selectedLevel ? { scale: 1.05 } : {}}
                    whileTap={selectedLevel ? { scale: 0.95 } : {}}
                >
                    Continue
                    <ArrowRight className="w-5 h-5 ml-2 inline" />
                </motion.button>
            </div>
        </div>
    );
};

// Time Commitment Selection Component
const TimeCommitmentStep: React.FC<{ onNext: () => void; onPrev: () => void; data: any; setData: (data: any) => void }> = ({
    onNext, onPrev, data, setData
}) => {
    const timeOptions = [
        { minutes: 10, label: '10 minutes', description: 'Quick daily sessions', sessions: '1 lesson per day' },
        { minutes: 20, label: '20 minutes', description: 'Balanced learning pace', sessions: '1-2 lessons per day' },
        { minutes: 30, label: '30 minutes', description: 'Focused study time', sessions: '2-3 lessons per day' },
        { minutes: 45, label: '45 minutes', description: 'Deep learning sessions', sessions: '3-4 lessons per day' },
        { minutes: 60, label: '1 hour', description: 'Intensive study schedule', sessions: '4+ lessons per day' }
    ];

    const selectedTime = data.timeCommitment;

    return (
        <div className="max-w-2xl mx-auto">
            <div className="text-center mb-8">
                <h2 className={`text-3xl font-bold ${theme.textColors.primary} mb-4`}>
                    How much time can you commit daily?
                </h2>
                <p className={`text-lg ${theme.textColors.secondary}`}>
                    We'll create a realistic learning schedule that fits your lifestyle.
                </p>
            </div>

            <div className="space-y-3 mb-8">
                {timeOptions.map((option) => (
                    <motion.button
                        key={option.minutes}
                        onClick={() => setData({ ...data, timeCommitment: option.minutes, weeklyGoal: Math.floor(option.minutes / 10) * 7 })}
                        className={`w-full p-4 rounded-xl border-2 text-left transition-all duration-200 ${selectedTime === option.minutes
                                ? `${theme.borderColors.accent} ${theme.backgrounds.cardHover}`
                                : `${theme.borderColors.primary} ${theme.backgrounds.card} hover:${theme.backgrounds.cardHover}`
                            }`}
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.99 }}
                    >
                        <div className="flex items-center justify-between">
                            <div className="flex items-center">
                                <div className={`p-3 rounded-lg ${selectedTime === option.minutes ? 'bg-blue-500/20' : theme.backgrounds.glass + '/20'} mr-4`}>
                                    <Clock className={`w-6 h-6 ${selectedTime === option.minutes ? 'text-blue-400' : theme.textColors.accent}`} />
                                </div>
                                <div>
                                    <h3 className={`text-lg font-semibold ${theme.textColors.primary}`}>
                                        {option.label}
                                    </h3>
                                    <p className={`text-sm ${theme.textColors.secondary}`}>
                                        {option.description} • {option.sessions}
                                    </p>
                                </div>
                            </div>

                            {selectedTime === option.minutes && (
                                <CheckCircle className="w-6 h-6 text-blue-400" />
                            )}
                        </div>
                    </motion.button>
                ))}
            </div>

            <div className="flex justify-between">
                <motion.button
                    onClick={onPrev}
                    className={`px-6 py-3 rounded-xl border ${theme.borderColors.primary} ${theme.textColors.secondary} hover:${theme.backgrounds.cardHover} transition-all duration-200`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                >
                    <ChevronLeft className="w-5 h-5 mr-2 inline" />
                    Back
                </motion.button>

                <motion.button
                    onClick={onNext}
                    disabled={!selectedTime}
                    className={`px-8 py-3 rounded-xl font-semibold transition-all duration-200 ${selectedTime
                            ? `${theme.buttons.primary} hover:scale-105`
                            : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                        }`}
                    whileHover={selectedTime ? { scale: 1.05 } : {}}
                    whileTap={selectedTime ? { scale: 0.95 } : {}}
                >
                    Complete Setup
                    <ArrowRight className="w-5 h-5 ml-2 inline" />
                </motion.button>
            </div>
        </div>
    );
};

// Welcome & Summary Component
const WelcomeStep: React.FC<{ onNext: () => void; onPrev: () => void; data: any; setData: (data: any) => void }> = ({
    onNext
}) => {
    return (
        <div className="max-w-2xl mx-auto text-center">
            <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2 }}
                className="mb-8"
            >
                <div className={`w-24 h-24 ${theme.backgrounds.accent} rounded-full flex items-center justify-center mx-auto mb-6`}>
                    <DollarSign className="w-12 h-12 text-white" />
                </div>
            </motion.div>

            <motion.h1
                className={`text-4xl font-bold ${theme.textColors.primary} mb-4`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
            >
                Welcome to Finance Quest!
            </motion.h1>

            <motion.p
                className={`text-xl ${theme.textColors.secondary} mb-8`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
            >
                Your journey to financial literacy starts here. Let's personalize your learning experience.
            </motion.p>

            <motion.div
                className={`${theme.backgrounds.card} border ${theme.borderColors.primary} rounded-xl p-6 mb-8`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
            >
                <h3 className={`text-lg font-semibold ${theme.textColors.primary} mb-4`}>
                    What you'll get:
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[
                        { icon: BookOpen, text: 'Personalized lessons' },
                        { icon: Calculator, text: 'Interactive calculators' },
                        { icon: Award, text: 'Achievement tracking' },
                        { icon: Brain, text: 'AI-powered coaching' }
                    ].map(({ icon: Icon, text }, index) => (
                        <motion.div
                            key={text}
                            className="flex items-center"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.6 + index * 0.1 }}
                        >
                            <div className={`p-2 ${theme.backgrounds.glass}/20 rounded-lg mr-3`}>
                                <Icon className={`w-5 h-5 ${theme.textColors.accent}`} />
                            </div>
                            <span className={`${theme.textColors.secondary}`}>{text}</span>
                        </motion.div>
                    ))}
                </div>
            </motion.div>

            <motion.button
                onClick={onNext}
                className={`px-8 py-4 rounded-xl font-semibold text-lg ${theme.buttons.primary} hover:scale-105 transition-all duration-200`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
            >
                Get Started
                <ArrowRight className="w-6 h-6 ml-2 inline" />
            </motion.button>
        </div>
    );
};

// Main Onboarding Component
export const EnhancedOnboardingSystem: React.FC<{ onComplete: (preferences: UserPreferences) => void }> = ({
    onComplete
}) => {
    const [currentStep, setCurrentStep] = useState(0);
    const [userData, setUserData] = useState<Partial<UserPreferences>>({});
    const [isVisible, setIsVisible] = useState(true);

    const steps: OnboardingStep[] = [
        {
            id: 'welcome',
            title: 'Welcome',
            description: 'Introduction to Finance Quest',
            component: WelcomeStep
        },
        {
            id: 'goals',
            title: 'Goals',
            description: 'Select your financial goals',
            component: GoalSelectionStep
        },
        {
            id: 'experience',
            title: 'Experience',
            description: 'Choose your experience level',
            component: ExperienceLevelStep
        },
        {
            id: 'time',
            title: 'Time Commitment',
            description: 'Set your daily learning time',
            component: TimeCommitmentStep
        }
    ];

    const handleNext = () => {
        if (currentStep < steps.length - 1) {
            setCurrentStep(currentStep + 1);
        } else {
            // Complete onboarding
            const preferences: UserPreferences = {
                goals: userData.goals || [],
                experienceLevel: userData.experienceLevel || 'beginner',
                timeCommitment: userData.timeCommitment || 20,
                focusAreas: userData.goals || [],
                learningStyle: 'mixed',
                notifications: true,
                weeklyGoal: userData.weeklyGoal || 14
            };

            onComplete(preferences);
            setIsVisible(false);
        }
    };

    const handlePrev = () => {
        if (currentStep > 0) {
            setCurrentStep(currentStep - 1);
        }
    };

    const handleSkip = () => {
        const defaultPreferences: UserPreferences = {
            goals: ['budgeting', 'investing'],
            experienceLevel: 'beginner',
            timeCommitment: 20,
            focusAreas: ['budgeting', 'investing'],
            learningStyle: 'mixed',
            notifications: true,
            weeklyGoal: 14
        };

        onComplete(defaultPreferences);
        setIsVisible(false);
    };

    if (!isVisible) return null;

    const CurrentStepComponent = steps[currentStep].component;

    return (
        <AnimatePresence>
            <motion.div
                className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
            >
                <motion.div
                    className={`w-full max-w-4xl ${theme.backgrounds.modal} border ${theme.borderColors.primary} rounded-2xl shadow-2xl`}
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.9, opacity: 0 }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                >
                    {/* Header */}
                    <div className={`${theme.backgrounds.cardHover} border-b ${theme.borderColors.primary} p-6 rounded-t-2xl`}>
                        <div className="flex items-center justify-between">
                            <div>
                                <h2 className={`text-xl font-semibold ${theme.textColors.primary}`}>
                                    Setup Your Learning Journey
                                </h2>
                                <p className={`text-sm ${theme.textColors.muted} mt-1`}>
                                    Step {currentStep + 1} of {steps.length}: {steps[currentStep].description}
                                </p>
                            </div>

                            <div className="flex items-center space-x-4">
                                <button
                                    onClick={handleSkip}
                                    className={`text-sm ${theme.textColors.muted} hover:${theme.textColors.secondary} transition-colors`}
                                >
                                    Skip Setup
                                </button>
                                <button
                                    onClick={handleSkip}
                                    className={`p-2 hover:${theme.backgrounds.card} rounded-lg transition-colors`}
                                >
                                    <X className={`w-5 h-5 ${theme.textColors.muted}`} />
                                </button>
                            </div>
                        </div>

                        {/* Progress Bar */}
                        <div className="mt-4">
                            <div className="w-full bg-slate-700/30 rounded-full h-2">
                                <motion.div
                                    className="h-2 bg-blue-500 rounded-full"
                                    initial={{ width: 0 }}
                                    animate={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
                                    transition={{ duration: 0.3 }}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="p-8">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={currentStep}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                transition={{ duration: 0.3 }}
                            >
                                <CurrentStepComponent
                                    onNext={handleNext}
                                    onPrev={handlePrev}
                                    data={userData}
                                    setData={setUserData}
                                />
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

export default EnhancedOnboardingSystem;
