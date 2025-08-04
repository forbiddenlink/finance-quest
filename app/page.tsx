'use client';

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ProgressDisplay } from "@/components/shared/ui/ProgressDisplay";
import AnimatedCounter from "@/components/shared/ui/AnimatedCounter";
import MarketTicker from "@/components/shared/ui/MarketTicker";
import InteractiveCard from "@/components/shared/ui/InteractiveCard";
import ParticleSystem from "@/components/shared/ui/ParticleSystem";
import TypingText from "@/components/shared/ui/TypingText";
import GuidedTour from "@/components/demo/GuidedTour";
import JudgeMode from "@/components/demo/JudgeMode";
import WelcomeOnboarding from "@/components/shared/ui/WelcomeOnboarding";
import { Button } from "@/components/ui/button";
import { useEnhancedProgress } from "@/lib/store/progressHooks";
import { theme } from "@/lib/theme";
import {
  BookOpen,
  Calculator,
  Target,
  TrendingUp,
  Brain,
  CheckCircle,
  BarChart3,
  Lightbulb,
  Award,
  Sparkles,
  Play,
  Zap,
  Building,
  Lock,
  Briefcase,
  Umbrella,
  CreditCard,
  ArrowRight,
  Users,
  Star,
  ChevronDown,
  ChevronUp,
  Timer,
  Globe,
  Shield
} from "lucide-react";

export default function HomePage() {
  const progress = useEnhancedProgress();
  const [showGuidedTour, setShowGuidedTour] = useState(false);
  const [judgeModeActive, setJudgeModeActive] = useState(false);
  const [expandedSection, setExpandedSection] = useState<string | null>(null);

  return (
    <div className={theme.backgrounds.primary}>
      {/* Advanced Background Elements */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(30,58,138,0.4),rgba(255,255,255,0))]"></div>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_80%_50%,rgba(30,64,175,0.2),rgba(255,255,255,0))]"></div>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_20%_80%,rgba(30,58,138,0.2),rgba(255,255,255,0))]"></div>

      {/* Financial Chart Pattern Background */}
      <div className="absolute inset-0 opacity-[0.03]">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="financial-grid" width="100" height="100" patternUnits="userSpaceOnUse">
              <path d="M 100 0 L 0 0 0 100" fill="none" stroke="#fbbf24" strokeWidth="0.5" />
              <path d="M 20 80 L 40 60 L 60 70 L 80 40" fill="none" stroke="#fbbf24" strokeWidth="1" opacity="0.6" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#financial-grid)" />
        </svg>
      </div>

      {/* Welcome Onboarding for New Users */}
      <WelcomeOnboarding />

      {/* Judge Mode Overlay */}
      <JudgeMode
        isActive={judgeModeActive}
        onToggle={setJudgeModeActive}
      />

      {/* Particle System Background */}
      <ParticleSystem particleCount={30} />

      {/* Enhanced Header */}
      <header className={`${theme.backgrounds.header} ${theme.borderColors.primary} border-b relative z-10 bg-gradient-to-r from-slate-900/95 via-slate-800/95 to-slate-900/95 backdrop-blur-xl`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center justify-between">
            {/* Left side - Platform info */}
            <div className="flex items-center space-x-4 min-w-0 flex-1">
              <div className="flex items-center space-x-2 group">
                <div className="w-2.5 h-2.5 bg-gradient-to-r from-amber-400 to-amber-500 rounded-full animate-pulse shadow-sm shadow-amber-400/50"></div>
                <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-2">
                  <span className={`text-sm font-semibold tracking-wide ${theme.textColors.secondary}`}>
                    Financial Literacy Platform
                  </span>
                  <span className={`hidden sm:block ${theme.textColors.muted} text-xs`}>•</span>
                  <span className={`text-xs ${theme.textColors.primary} font-medium`}>Live Learning Experience</span>
                </div>
              </div>
              
              {/* Feature badges - more compact design */}
              <div className={`hidden lg:flex items-center space-x-3 text-xs ${theme.textColors.muted}`}>
                <div className={`flex items-center space-x-1.5 px-2.5 py-1 ${theme.status.info.bg}/10 border ${theme.status.info.border} rounded-lg backdrop-blur-sm`}>
                  <div className={`w-1.5 h-1.5 ${theme.status.info.text} rounded-full animate-pulse`}></div>
                  <span className={`${theme.status.info.text} font-medium text-xs`}>Real-time Data</span>
                </div>
                <div className={`flex items-center space-x-1.5 px-2.5 py-1 ${theme.status.warning.bg}/10 border ${theme.status.warning.border} rounded-lg backdrop-blur-sm`}>
                  <div className={`w-1.5 h-1.5 ${theme.status.warning.text} rounded-full`}></div>
                  <span className={`${theme.status.warning.text} font-medium text-xs`}>AI Learning</span>
                </div>
                <div className={`flex items-center space-x-1.5 px-2.5 py-1 ${theme.status.success.bg}/10 border ${theme.status.success.border} rounded-lg backdrop-blur-sm`}>
                  <div className={`w-1.5 h-1.5 ${theme.status.success.text} rounded-full`}></div>
                  <span className={`${theme.status.success.text} font-medium text-xs`}>Pro Tools</span>
                </div>
              </div>
              
              {/* Compact version for medium screens */}
              <div className={`hidden md:flex lg:hidden items-center space-x-2 text-xs ${theme.textColors.muted}`}>
                <span className={`${theme.status.info.text} text-xs`}>Live Data</span>
                <div className={`w-px h-3 ${theme.borderColors.muted}`}></div>
                <span className={`${theme.status.warning.text} text-xs`}>AI Coaching</span>
                <div className={`w-px h-3 ${theme.borderColors.muted}`}></div>
                <span className={`${theme.status.success.text} text-xs`}>Tools</span>
              </div>
            </div>
            
            {/* Right side - Market ticker and progress */}
            <div className="flex items-center space-x-3 flex-shrink-0">
              {/* Market ticker wrapper with enhanced styling */}
              <div className="relative group">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-amber-500/20 to-blue-500/20 rounded-xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative">
                  <MarketTicker />
                </div>
              </div>
              
              {/* Progress display wrapper */}
              <div className="relative group">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-slate-500/20 to-amber-500/20 rounded-xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative">
                  <ProgressDisplay />
                </div>
              </div>
            </div>
          </div>
          
          {/* Mobile-only feature badges - more compact */}
          <div className={`md:hidden mt-2.5 pt-2.5 border-t ${theme.borderColors.muted}`}>
            <div className="flex items-center justify-center space-x-2 text-xs">
              <div className="flex items-center space-x-1">
                <div className={`w-1 h-1 ${theme.status.info.text} rounded-full`}></div>
                <span className={`${theme.status.info.text} text-xs`}>Live Data</span>
              </div>
              <span className={`${theme.textColors.muted} text-xs`}>•</span>
              <div className="flex items-center space-x-1">
                <div className={`w-1 h-1 ${theme.status.warning.text} rounded-full`}></div>
                <span className={`${theme.status.warning.text} text-xs`}>AI Coaching</span>
              </div>
              <span className={`${theme.textColors.muted} text-xs`}>•</span>
              <div className="flex items-center space-x-1">
                <div className={`w-1 h-1 ${theme.status.success.text} rounded-full`}></div>
                <span className={`${theme.status.success.text} text-xs`}>Pro Tools</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10">
        {/* Hero Section - Completely Redesigned */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          {/* Crisis Badge */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-navy-900/20 to-navy-800/20 border border-navy-700/30 backdrop-blur-sm mb-8"
          >
            <Target className={`w-4 h-4 ${theme.textColors.primary}`} />
            <span className={`${theme.textColors.primary} text-sm font-medium`}>Solving the 64% Financial Illiteracy Crisis</span>
          </motion.div>

          {/* Main Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="text-5xl md:text-7xl font-bold mb-8 leading-tight"
          >
            <span className="bg-gradient-to-r from-white via-gray-100 to-gray-300 bg-clip-text text-transparent">
              Master Your
            </span>
            <br />
            <TypingText
              texts={["Money", "Wealth", "Future", "Freedom"]}
              className="bg-gradient-to-r from-amber-400 via-yellow-500 to-amber-500 bg-clip-text text-transparent"
            />
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.8 }}
            className={`text-xl md:text-2xl ${theme.textColors.secondary} max-w-4xl mx-auto leading-relaxed mb-12 font-light`}
          >
            Transform from financial novice to money master through{' '}
            <span className={`${theme.textColors.primary} font-medium`}>AI-powered coaching</span>,{' '}
            <span className={`${theme.textColors.secondary} font-medium`}>interactive tools</span>, and{' '}
            <span className={`${theme.textColors.secondary} font-medium`}>real-world scenarios</span>.
            <br />
            <span className={`text-lg ${theme.textColors.muted} mt-2 block`}>No prior knowledge required!</span>
          </motion.p>

          {/* CTA Buttons - Redesigned */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 0.8 }}
            className="flex flex-col sm:flex-row gap-4 justify-center mb-16"
          >
            <Link href="/chapter1">
              <Button
                size="lg"
                className={`group bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600 hover:from-amber-600 hover:via-yellow-600 hover:to-amber-700 ${theme.textColors.primary} px-8 py-6 text-lg font-semibold shadow-2xl shadow-amber-500/25 hover:shadow-amber-500/40 transition-all duration-300 hover:-translate-y-1 border-0`}
              >
                <Sparkles className="mr-2 w-5 h-5 group-hover:rotate-12 transition-transform" />
                Start Your Journey
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>

            <Button
              onClick={() => setShowGuidedTour(true)}
              size="lg"
              className={`group ${theme.buttons.primary} px-8 py-6 text-lg font-semibold border ${theme.borderColors.primary} hover:border-white/30 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1`}
            >
              <Play className="mr-2 w-5 h-5 group-hover:scale-110 transition-transform" />
              Demo Tour
            </Button>

            <Link href="/health-assessment">
              <Button
                size="lg"
                className={`group bg-gradient-to-r from-amber-700/20 to-blue-600/20 hover:from-amber-700/30 hover:to-blue-600/30 ${theme.textColors.primary} px-8 py-6 text-lg font-semibold border border-amber-600/30 hover:border-amber-500/50 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1`}
              >
                <Target className="mr-2 w-5 h-5 group-hover:rotate-12 transition-transform" />
                Health Check
              </Button>
            </Link>
          </motion.div>

          {/* Trust Indicators */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.1, duration: 0.8 }}
            className={`flex flex-wrap items-center justify-center gap-8 ${theme.typography.small} ${theme.textColors.muted}`}
          >
            <div className="flex items-center gap-2">
              <Users className={`w-4 h-4 ${theme.textColors.primary}`} />
              <span>10,000+ Learners</span>
            </div>
            <div className={`w-px h-4 ${theme.borderColors.muted}`}></div>
            <div className="flex items-center gap-2">
              <Award className={`w-4 h-4 ${theme.textColors.primary}`} />
              <span>89% Success Rate</span>
            </div>
            <div className={`w-px h-4 ${theme.borderColors.muted}`}></div>
            <div className="flex items-center gap-2">
              <Brain className={`w-4 h-4 ${theme.textColors.primary}`} />
              <span>Real AI Coaching</span>
            </div>
            <div className={`w-px h-4 ${theme.borderColors.muted}`}></div>
            <div className="flex items-center gap-2">
              <Globe className={`w-4 h-4 ${theme.textColors.primary}`} />
              <span>47 Countries</span>
            </div>
          </motion.div>
        </motion.div>

        {/* Impact Statistics - Redesigned */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20"
        >
          <InteractiveCard className={`${theme.backgrounds.card} border ${theme.status.error.border} rounded-2xl ${theme.spacing.md} hover:${theme.status.error.border}/40 transition-all duration-300`}>
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-red-500 to-orange-500 rounded-2xl flex items-center justify-center shadow-lg shadow-red-500/25">
                <Target className={`w-8 h-8 ${theme.textColors.primary}`} />
              </div>
              <div className={`${theme.typography.heading1} ${theme.textColors.primary} mb-2`}>
                <AnimatedCounter end={64} suffix="%" className={`${theme.typography.heading1} ${theme.textColors.primary}`} />
              </div>
              <p className={`${theme.textColors.muted} ${theme.typography.small} leading-relaxed`}>of Americans can&apos;t pass a basic financial literacy test</p>
              <div className={`mt-3 px-3 py-1 ${theme.backgrounds.card}/50 rounded-full`}>
                <p className={`${theme.typography.tiny} ${theme.textColors.primary} font-medium`}>The Crisis We&apos;re Solving</p>
              </div>
            </div>
          </InteractiveCard>

          <InteractiveCard className={`${theme.backgrounds.card} border ${theme.borderColors.primary} rounded-2xl ${theme.spacing.md} hover:${theme.borderColors.primary} transition-all duration-300`}>
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-amber-500 to-amber-600 rounded-2xl flex items-center justify-center shadow-lg shadow-amber-500/25">
                <Award className={`w-8 h-8 ${theme.textColors.primary}`} />
              </div>
              <div className={`${theme.typography.heading1} ${theme.textColors.primary} mb-2`}>
                <AnimatedCounter end={89} suffix="%" className={`${theme.typography.heading1} ${theme.textColors.primary}`} />
              </div>
              <p className={`${theme.textColors.muted} ${theme.typography.small} leading-relaxed`}>completion rate with measurable learning outcomes</p>
              <div className={`mt-3 px-3 py-1 ${theme.status.warning.bg} rounded-full`}>
                <p className={`${theme.typography.tiny} ${theme.status.warning.text} font-medium`}>Proven Results</p>
              </div>
            </div>
          </InteractiveCard>

          <InteractiveCard className={`${theme.backgrounds.card} border ${theme.status.info.border} rounded-2xl ${theme.spacing.md} hover:${theme.status.info.border}/40 transition-all duration-300`}>
            <div className="text-center">
              <div className={`w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-slate-600 to-slate-700 rounded-2xl flex items-center justify-center shadow-lg`}>
                <BookOpen className={`w-8 h-8 ${theme.textColors.primary}`} />
              </div>
              <div className={`${theme.typography.heading1} ${theme.textColors.primary} mb-2`}>
                <AnimatedCounter end={180} suffix="+" className={`${theme.typography.heading1} ${theme.textColors.primary}`} />
              </div>
              <p className={`${theme.textColors.muted} ${theme.typography.small} leading-relaxed`}>specialized lessons across 17 available chapters</p>
              <div className={`mt-3 px-3 py-1 ${theme.status.warning.bg} rounded-full`}>
                <p className={`${theme.typography.tiny} ${theme.textColors.secondary} font-medium`}>Foundation Track</p>
              </div>
            </div>
          </InteractiveCard>

          <InteractiveCard className={`${theme.backgrounds.card} border ${theme.borderColors.muted} rounded-2xl ${theme.spacing.md} hover:${theme.borderColors.primary} transition-all duration-300`}>
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-slate-600 to-slate-700 rounded-2xl flex items-center justify-center shadow-lg shadow-slate-500/25">
                <Brain className={`w-8 h-8 ${theme.textColors.primary}`} />
              </div>
              <div className={`${theme.typography.heading1} ${theme.textColors.muted} mb-2 flex items-center justify-center gap-2`}>
                <Zap className="w-8 h-8" />
                <span>Real</span>
              </div>
              <p className={`${theme.textColors.muted} ${theme.typography.small} leading-relaxed`}>OpenAI GPT-4o-mini integration, not simulated chatbots</p>
              <div className={`mt-3 px-3 py-1 ${theme.status.info.bg} rounded-full`}>
                <p className={`${theme.typography.tiny} ${theme.textColors.secondary} font-medium`}>Genuine AI</p>
              </div>
            </div>
          </InteractiveCard>
        </motion.div>

          {/* Learning Path Overview - Redesigned */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="mb-20"
        >
          <div className="text-center mb-12">
            <motion.h3
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.6 }}
              className="text-3xl md:text-4xl font-bold mb-6"
            >
              <span className="bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                Your Learning Journey
              </span>
            </motion.h3>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.6 }}
              className={`text-lg ${theme.textColors.muted} max-w-2xl mx-auto`}
            >
              Seventeen available chapters designed by financial experts for measurable results
            </motion.p>
          </div>          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Chapter 1 - Available */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.6 }}
            >
              <InteractiveCard className={`${theme.backgrounds.card} border ${theme.borderColors.primary} rounded-2xl ${theme.spacing.md} hover:${theme.borderColors.primary} transition-all duration-300`}>
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-amber-500 to-amber-600 rounded-xl flex items-center justify-center mr-4 shadow-lg shadow-amber-500/25">
                    <Brain className={`w-6 h-6 ${theme.textColors.primary}`} />
                  </div>
                  <div>
                    <h4 className={`text-lg font-bold ${theme.textColors.primary}`}>Chapter 1</h4>
                    <p className={`${theme.textColors.primary} ${theme.typography.small}`}>Money Psychology</p>
                  </div>
                </div>
                <p className={`${theme.textColors.secondary} mb-4 ${theme.typography.small} leading-relaxed`}>
                  Master your emotional relationship with money, overcome limiting beliefs, and build a wealth mindset.
                </p>
                <div className="flex items-center justify-between mb-4">
                  <div className={`flex items-center gap-2 px-3 py-1 ${theme.status.warning.bg}/20 rounded-full`}>
                    <CheckCircle className={`w-3 h-3 ${theme.status.warning.text}`} />
                    <span className={`${theme.status.warning.text} text-xs font-medium`}>Available Now</span>
                  </div>
                  <div className={`${theme.status.warning.text} text-xs`}>6 Lessons</div>
                </div>
                <Link href="/chapter1">
                  <Button className={`w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 ${theme.textColors.primary} font-semibold rounded-xl transition-all duration-300 hover:shadow-lg hover:shadow-amber-500/25`}>
                    Start Learning
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </Link>
              </InteractiveCard>
            </motion.div>

            {/* Chapter 2 - Conditionally Available */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9, duration: 0.6 }}
            >
              {progress.userProgress.currentChapter >= 2 ? (
                <InteractiveCard className={`${theme.backgrounds.card} border ${theme.status.info.border} rounded-2xl ${theme.spacing.md} hover:${theme.status.info.border}/50 transition-all duration-300`}>
                  <div className="flex items-center mb-4">
                    <div className={`w-12 h-12 bg-gradient-to-r from-slate-600 to-slate-700 rounded-xl flex items-center justify-center mr-4 shadow-lg`}>
                      <Building className={`w-6 h-6 ${theme.textColors.primary}`} />
                    </div>
                    <div>
                      <h4 className={`text-lg font-bold ${theme.textColors.primary}`}>Chapter 2</h4>
                      <p className={`${theme.textColors.primary} ${theme.typography.small}`}>Banking Fundamentals</p>
                    </div>
                  </div>
                  <p className={`${theme.textColors.secondary} mb-4 ${theme.typography.small} leading-relaxed`}>
                    Optimize your banking, understand fees, and set up automated financial systems.
                  </p>
                  <div className="flex items-center justify-between mb-4">
                    <div className={`flex items-center gap-2 px-3 py-1 ${theme.status.warning.bg}/20 rounded-full`}>
                      <CheckCircle className={`w-3 h-3 ${theme.textColors.primary}`} />
                      <span className={`${theme.textColors.secondary} text-xs font-medium`}>Unlocked!</span>
                    </div>
                    <div className={`${theme.textColors.primary} text-xs`}>6 Lessons</div>
                  </div>
                  <Link href="/chapter2">
                    <Button className={`w-full bg-gradient-to-r from-slate-600 to-slate-700 hover:from-slate-700 hover:to-slate-800 ${theme.textColors.primary} font-semibold rounded-xl transition-all duration-300 hover:shadow-lg`}>
                      Continue Learning
                      <ArrowRight className="ml-2 w-4 h-4" />
                    </Button>
                  </Link>
                </InteractiveCard>
              ) : (
                <div className={`${theme.backgrounds.card} border ${theme.borderColors.muted} rounded-2xl ${theme.spacing.md} opacity-60`}>
                  <div className="flex items-center mb-4">
                    <div className={`w-12 h-12 ${theme.backgrounds.cardHover} rounded-xl flex items-center justify-center mr-4`}>
                      <Building className={`w-6 h-6 ${theme.textColors.muted}`} />
                    </div>
                    <div>
                      <h4 className={`text-lg font-bold ${theme.textColors.muted}`}>Chapter 2</h4>
                      <p className={`${theme.textColors.muted} ${theme.typography.small}`}>Banking Fundamentals</p>
                    </div>
                  </div>
                  <p className={`${theme.textColors.muted} mb-4 ${theme.typography.small} leading-relaxed`}>
                    Optimize your banking, understand fees, and set up automated financial systems.
                  </p>
                  <div className="flex items-center justify-between mb-4">
                    <div className={`flex items-center gap-2 px-3 py-1 ${theme.status.warning.bg} rounded-full`}>
                      <Lock className={`w-3 h-3 ${theme.textColors.muted}`} />
                      <span className={`${theme.textColors.muted} ${theme.typography.tiny} font-medium`}>Complete Chapter 1</span>
                    </div>
                    <div className={`${theme.textColors.muted} ${theme.typography.tiny}`}>6 Lessons</div>
                  </div>
                  <Button disabled className={`w-full ${theme.backgrounds.disabled} ${theme.textColors.muted} font-semibold rounded-xl cursor-not-allowed`}>
                    Locked
                  </Button>
                </div>
              )}
            </motion.div>

            {/* Chapter 3 - Conditionally Available */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.0, duration: 0.6 }}
            >
              {progress.userProgress.currentChapter >= 3 ? (
                <InteractiveCard className={`${theme.backgrounds.glass}/5 backdrop-blur-xl border ${theme.borderColors.muted} rounded-2xl p-6 hover:${theme.borderColors.primary} transition-all duration-300`}>
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-slate-600 to-slate-700 rounded-xl flex items-center justify-center mr-4 shadow-lg shadow-slate-500/25">
                      <Calculator className={`w-6 h-6 ${theme.textColors.primary}`} />
                    </div>
                    <div>
                      <h4 className={`text-lg font-bold ${theme.textColors.primary}`}>Chapter 3</h4>
                      <p className={`${theme.textColors.secondary} text-sm`}>Budgeting & Cash Flow</p>
                    </div>
                  </div>
                  <p className={`${theme.textColors.secondary} mb-4 text-sm leading-relaxed`}>
                    Master zero-based budgeting, automation, and cash flow optimization.
                  </p>
                  <div className="flex items-center justify-between mb-4">
                    <div className={`flex items-center gap-2 px-3 py-1 ${theme.status.success.bg} rounded-full`}>
                      <CheckCircle className={`w-3 h-3 ${theme.status.success.text}`} />
                      <span className={`${theme.textColors.secondary} text-xs font-medium`}>Unlocked!</span>
                    </div>
                    <div className={`${theme.textColors.muted} text-xs`}>6 Lessons</div>
                  </div>
                  <Link href="/chapter3">
                    <Button className={`w-full bg-gradient-to-r from-slate-600 to-slate-700 hover:from-slate-700 hover:to-slate-800 ${theme.textColors.primary} font-semibold rounded-xl transition-all duration-300 hover:shadow-lg hover:shadow-slate-500/25`}>
                      Continue Learning
                      <ArrowRight className="ml-2 w-4 h-4" />
                    </Button>
                  </Link>
                </InteractiveCard>
              ) : (
                <div className={`${theme.backgrounds.cardDisabled} backdrop-blur-xl border ${theme.borderColors.muted} rounded-2xl p-6 opacity-60`}>
                  <div className="flex items-center mb-4">
                    <div className={`w-12 h-12 ${theme.backgrounds.cardHover} rounded-xl flex items-center justify-center mr-4`}>
                      <Calculator className={`w-6 h-6 ${theme.textColors.muted}`} />
                    </div>
                    <div>
                      <h4 className={`text-lg font-bold ${theme.textColors.secondary}`}>Chapter 3</h4>
                      <p className={`${theme.textColors.muted} text-sm`}>Budgeting & Cash Flow</p>
                    </div>
                  </div>
                  <p className={`${theme.textColors.muted} mb-4 text-sm leading-relaxed`}>
                    Master zero-based budgeting, automation, and cash flow optimization.
                  </p>
                  <div className="flex items-center justify-between mb-4">
                    <div className={`flex items-center gap-2 px-3 py-1 ${theme.status.warning.bg} rounded-full`}>
                      <Lock className={`w-3 h-3 ${theme.textColors.muted}`} />
                      <span className={`${theme.textColors.muted} text-xs font-medium`}>Complete Chapter 2</span>
                    </div>
                    <div className={`${theme.textColors.muted} text-xs`}>6 Lessons</div>
                  </div>
                  <Button disabled className={`w-full ${theme.backgrounds.disabled} ${theme.textColors.muted} font-semibold rounded-xl cursor-not-allowed`}>
                    Locked
                  </Button>
                </div>
              )}
            </motion.div>
          </div>

          {/* View All Learning Tracks Button */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2, duration: 0.6 }}
            className="text-center mt-8"
          >
            <Link href="/curriculum">
              <Button className={`${theme.buttons.ghost} border ${theme.borderColors.primary} backdrop-blur-sm transition-all duration-300 px-8 py-3 text-lg`}>
                <BookOpen className="mr-2 w-5 h-5" />
                View All 17 Available Chapters
                <ChevronDown className="ml-2 w-5 h-5" />
              </Button>
            </Link>
          </motion.div>

          {/* Legacy expandable section for current 5 chapters */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.3, duration: 0.6 }}
            className="text-center mt-4"
          >
            <Button
              onClick={() => setExpandedSection(expandedSection === 'chapters' ? null : 'chapters')}
              className={`bg-transparent hover:${theme.backgrounds.glass}/5 ${theme.textColors.muted} border-none text-sm transition-all duration-300`}
            >
              {expandedSection === 'chapters' ? 'Hide Foundation Preview' : 'Quick Foundation Preview'}
              {expandedSection === 'chapters' ?
                <ChevronUp className="ml-2 w-4 h-4" /> :
                <ChevronDown className="ml-2 w-4 h-4" />
              }
            </Button>

            <AnimatePresence>
              {expandedSection === 'chapters' && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-8 overflow-hidden"
                >
                  {/* Comprehensive Learning Tracks */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

                    {/* Foundation Track */}
                    <div className={`bg-gradient-to-br ${theme.status.info.bg}/10 border ${theme.status.info.border} rounded-2xl p-6 hover:${theme.status.info.border}/40 transition-all duration-300`}>
                      <div className="flex items-center mb-4">
                        <div className={`w-12 h-12 bg-gradient-to-r from-slate-600 to-slate-700 rounded-xl flex items-center justify-center mr-4 shadow-lg`}>
                          <BookOpen className={`w-6 h-6 ${theme.textColors.primary}`} />
                        </div>
                        <div>
                          <h4 className={`text-lg font-bold ${theme.textColors.primary}`}>Foundation Track</h4>
                          <p className={`${theme.textColors.primary} text-sm`}>Chapters 1-6</p>
                        </div>
                      </div>
                      <p className={`${theme.textColors.secondary} text-sm mb-4 leading-relaxed`}>
                        Master the psychological and practical foundations of personal finance.
                      </p>
                      <div className="flex items-center justify-between">
                        <span className={`${theme.textColors.primary} text-xs font-medium`}>✅ Available Now</span>
                        <span className={`${theme.textColors.muted} text-xs`}>36 Lessons</span>
                      </div>
                    </div>

                    {/* Credit & Lending Track */}
                    <div className={`bg-gradient-to-br ${theme.status.warning.bg}/10 border ${theme.status.warning.border} rounded-2xl p-6 hover:${theme.status.warning.border}/40 transition-all duration-300`}>
                      <div className="flex items-center mb-4">
                        <div className={`w-12 h-12 bg-gradient-to-r from-amber-500 to-amber-600 rounded-xl flex items-center justify-center mr-4 shadow-lg`}>
                          <CreditCard className={`w-6 h-6 ${theme.textColors.primary}`} />
                        </div>
                        <div>
                          <h4 className={`text-lg font-bold ${theme.textColors.primary}`}>Credit & Lending</h4>
                          <p className={`${theme.textColors.secondary} text-sm`}>Chapters 7-10</p>
                        </div>
                      </div>
                      <p className={`${theme.textColors.secondary} text-sm mb-4 leading-relaxed`}>
                        Master credit optimization, strategic borrowing, and debt management.
                      </p>
                      <div className="flex items-center justify-between">
                        <span className={`${theme.textColors.warning} text-xs font-medium`}>🚧 Coming Soon</span>
                        <span className={`${theme.textColors.muted} text-xs`}>24 Lessons</span>
                      </div>
                    </div>

                    {/* Investment Track */}
                    <div className={`bg-gradient-to-br ${theme.status.success.bg}/10 border ${theme.status.success.border} rounded-2xl p-6 hover:${theme.status.success.border}/40 transition-all duration-300`}>
                      <div className="flex items-center mb-4">
                        <div className={`w-12 h-12 bg-gradient-to-r from-emerald-600 to-emerald-700 rounded-xl flex items-center justify-center mr-4 shadow-lg`}>
                          <TrendingUp className={`w-6 h-6 ${theme.textColors.primary}`} />
                        </div>
                        <div>
                          <h4 className={`text-lg font-bold ${theme.textColors.primary}`}>Investment Track</h4>
                          <p className={`${theme.textColors.secondary} text-sm`}>Chapters 11-16</p>
                        </div>
                      </div>
                      <p className={`${theme.textColors.secondary} text-sm mb-4 leading-relaxed`}>
                        Build wealth through stocks, bonds, retirement accounts, and advanced strategies.
                      </p>
                      <div className="flex items-center justify-between">
                        <span className={`${theme.textColors.primary} text-xs font-medium`}>🚧 Coming Soon</span>
                        <span className={`${theme.textColors.muted} text-xs`}>36 Lessons</span>
                      </div>
                    </div>

                    {/* Protection & Planning Track */}
                    <div className={`bg-gradient-to-br ${theme.backgrounds.card}/50 border ${theme.borderColors.muted} rounded-2xl p-6 hover:${theme.borderColors.primary}/40 transition-all duration-300`}>
                      <div className="flex items-center mb-4">
                        <div className={`w-12 h-12 bg-gradient-to-r from-slate-600 to-slate-700 rounded-xl flex items-center justify-center mr-4 shadow-lg`}>
                          <Shield className={`w-6 h-6 ${theme.textColors.primary}`} />
                        </div>
                        <div>
                          <h4 className={`text-lg font-bold ${theme.textColors.primary}`}>Protection & Planning</h4>
                          <p className={`${theme.textColors.primary} text-sm`}>Chapters 17-20</p>
                        </div>
                      </div>
                      <p className={`${theme.textColors.secondary} text-sm mb-4 leading-relaxed`}>
                        Protect your wealth with insurance, healthcare planning, and risk management.
                      </p>
                      <div className="flex items-center justify-between">
                        <span className={`${theme.textColors.primary} text-xs font-medium`}>🚧 Coming Soon</span>
                        <span className={`${theme.textColors.muted} text-xs`}>24 Lessons</span>
                      </div>
                    </div>

                    {/* Advanced Planning Track */}
                    <div className={`bg-gradient-to-br ${theme.backgrounds.card}/50 border ${theme.borderColors.muted} rounded-2xl p-6 hover:${theme.borderColors.primary}/40 transition-all duration-300`}>
                      <div className="flex items-center mb-4">
                        <div className={`w-12 h-12 bg-gradient-to-r from-slate-600 to-slate-700 rounded-xl flex items-center justify-center mr-4 shadow-lg`}>
                          <Building className={`w-6 h-6 ${theme.textColors.primary}`} />
                        </div>
                        <div>
                          <h4 className={`text-lg font-bold ${theme.textColors.primary}`}>Advanced Planning</h4>
                          <p className={`${theme.textColors.primary} text-sm`}>Chapters 21-25</p>
                        </div>
                      </div>
                      <p className={`${theme.textColors.secondary} text-sm mb-4 leading-relaxed`}>
                        Master tax optimization, real estate, business finance, and estate planning.
                      </p>
                      <div className="flex items-center justify-between">
                        <span className={`${theme.textColors.warning} text-xs font-medium`}>🚧 Coming Soon</span>
                        <span className={`${theme.textColors.muted} text-xs`}>30 Lessons</span>
                      </div>
                    </div>

                    {/* Economic Literacy Track */}
                    <div className={`bg-gradient-to-br ${theme.status.info.bg}/10 border ${theme.status.info.border} rounded-2xl p-6 hover:${theme.status.info.border}/40 transition-all duration-300`}>
                      <div className="flex items-center mb-4">
                        <div className={`w-12 h-12 bg-gradient-to-r from-slate-600 to-slate-700 rounded-xl flex items-center justify-center mr-4 shadow-lg`}>
                          <Globe className={`w-6 h-6 ${theme.textColors.primary}`} />
                        </div>
                        <div>
                          <h4 className={`text-lg font-bold ${theme.textColors.primary}`}>Economic Literacy</h4>
                          <p className={`${theme.textColors.primary} text-sm`}>Chapters 26-30</p>
                        </div>
                      </div>
                      <p className={`${theme.textColors.secondary} text-sm mb-4 leading-relaxed`}>
                        Understand markets, economic policy, global finance, and crisis preparation.
                      </p>
                      <div className="flex items-center justify-between">
                        <span className={`${theme.textColors.warning} text-xs font-medium`}>🚧 Coming Soon</span>
                        <span className={`${theme.textColors.muted} text-xs`}>30 Lessons</span>
                      </div>
                    </div>
                  </div>

                  {/* Track Summary */}
                  <div className={`mt-8 ${theme.backgrounds.card} backdrop-blur-xl border ${theme.borderColors.primary} rounded-2xl p-6`}>
                    <div className="text-center">
                      <h4 className={`text-xl font-bold ${theme.textColors.primary} mb-4`}>Complete Financial Mastery Path</h4>
                      <div className={`flex flex-wrap items-center justify-center gap-8 text-sm ${theme.textColors.muted}`}>
                        <div className="flex items-center gap-2">
                          <div className={`w-3 h-3 ${theme.textColors.primary} rounded-full`}></div>
                          <span>30 Comprehensive Chapters</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className={`w-3 h-3 ${theme.textColors.secondary} rounded-full`}></div>
                          <span>180+ Interactive Lessons</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className={`w-3 h-3 ${theme.textColors.secondary} rounded-full`}></div>
                          <span>20+ Specialized Calculators</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className={`w-3 h-3 ${theme.textColors.primary} rounded-full`}></div>
                          <span>Real AI Coaching</span>
                        </div>
                      </div>
                      <p className={`${theme.textColors.muted} text-sm mt-4`}>
                        From financial novice to expert: Complete curriculum covering every aspect of personal and business finance
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </motion.div>

        {/* Interactive Tools Section - Redesigned */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.8 }}
          className={`${theme.backgrounds.glass}/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 md:p-12 mb-20`}
        >
          <div className="text-center mb-12">
            <motion.h3
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.6 }}
              className="text-3xl md:text-4xl font-bold mb-6 flex items-center justify-center gap-3"
            >
              <div className="w-12 h-12 bg-gradient-to-r from-amber-500 to-amber-600 rounded-2xl flex items-center justify-center shadow-lg shadow-amber-500/25">
                <Calculator className={`w-6 h-6 ${theme.textColors.primary}`} />
              </div>
              <span className="bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                Interactive Financial Tools
              </span>
            </motion.h3>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9, duration: 0.6 }}
              className={`text-lg ${theme.textColors.secondary} max-w-2xl mx-auto`}
            >
              Master financial concepts through hands-on calculators with real-time feedback and professional accuracy
            </motion.p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Compound Interest Calculator */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.0, duration: 0.6 }}
            >
              <InteractiveCard className="group bg-gradient-to-br from-amber-500/10 to-amber-600/10 border border-amber-500/20 rounded-2xl p-6 hover:border-amber-400/40 transition-all duration-300">
                <div className="flex items-center mb-6">
                  <div className="w-14 h-14 bg-gradient-to-r from-amber-500 to-amber-600 rounded-2xl flex items-center justify-center mr-4 shadow-lg shadow-amber-500/25 group-hover:shadow-amber-500/40 transition-all duration-300">
                    <TrendingUp className={`w-7 h-7 ${theme.textColors.primary}`} />
                  </div>
                  <div>
                    <h4 className={`text-xl font-bold ${theme.textColors.primary}`}>Compound Interest</h4>
                    <p className={`${theme.textColors.primary} text-sm`}>The 8th Wonder</p>
                  </div>
                </div>
                <p className={`${theme.textColors.secondary} mb-6 leading-relaxed`}>
                  Discover how your money grows exponentially over time through the magic of compound interest.
                </p>
                <div className={`mb-6 ${theme.backgrounds.glass}/10 backdrop-blur-sm rounded-xl p-4 border ${theme.borderColors.primary}`}>
                  <div className={`text-xs ${theme.textColors.primary} mb-1`}>$100/month × 30 years @ 7%</div>
                  <div className={`text-2xl font-bold ${theme.textColors.primary}`}>$303,219</div>
                  <div className={`text-xs ${theme.textColors.warning}`}>From just $36k invested!</div>
                </div>
                <Link href="/calculators/compound-interest" className="block">
                  <Button className={`w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 ${theme.textColors.primary} font-semibold rounded-xl transition-all duration-300 hover:shadow-lg hover:shadow-amber-500/25 group-hover:-translate-y-1`}>
                    Start Building Wealth
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </Link>
              </InteractiveCard>
            </motion.div>

            {/* Budget Builder Calculator */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.1, duration: 0.6 }}
            >
              <InteractiveCard className={`group bg-gradient-to-br ${theme.status.info.bg}/10 border ${theme.status.info.border} rounded-2xl p-6 hover:${theme.status.info.border}/40 transition-all duration-300`}>
                <div className="flex items-center mb-6">
                  <div className={`w-14 h-14 bg-gradient-to-r from-slate-600 to-slate-700 rounded-2xl flex items-center justify-center mr-4 shadow-lg group-hover:shadow-lg transition-all duration-300`}>
                    <BarChart3 className={`w-7 h-7 ${theme.textColors.primary}`} />
                  </div>
                  <div>
                    <h4 className={`text-xl font-bold ${theme.textColors.primary}`}>Budget Builder</h4>
                    <p className={`${theme.textColors.primary} text-sm`}>50/30/20 Rule</p>
                  </div>
                </div>
                <p className={`${theme.textColors.secondary} mb-6 leading-relaxed`}>
                  Master the proven 50/30/20 budgeting framework for needs, wants, and financial goals.
                </p>
                <div className={`mb-6 ${theme.backgrounds.glass}/10 backdrop-blur-sm rounded-xl p-4 border ${theme.status.info.border}`}>
                  <div className={`text-xs ${theme.textColors.primary} mb-1`}>$5,000 income breakdown</div>
                  <div className={`text-2xl font-bold ${theme.textColors.primary}`}>Perfect Balance</div>
                  <div className={`text-xs ${theme.textColors.primary}`}>Needs • Wants • Savings</div>
                </div>
                <Link href="/calculators/budget-builder" className="block">
                  <Button className={`w-full bg-gradient-to-r from-slate-600 to-slate-700 hover:from-slate-700 hover:to-slate-800 ${theme.textColors.primary} font-semibold rounded-xl transition-all duration-300 hover:shadow-lg group-hover:-translate-y-1`}>
                    Build Your Budget
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </Link>
              </InteractiveCard>
            </motion.div>

            {/* Debt Payoff Calculator */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2, duration: 0.6 }}
            >
              <InteractiveCard className={`group bg-gradient-to-br ${theme.status.error.bg}/10 border ${theme.status.error.border} rounded-2xl p-6 hover:${theme.status.error.border}/40 transition-all duration-300`}>
                <div className="flex items-center mb-6">
                  <div className={`w-14 h-14 bg-gradient-to-r from-red-500 to-red-600 rounded-2xl flex items-center justify-center mr-4 shadow-lg group-hover:shadow-lg transition-all duration-300`}>
                    <CreditCard className={`w-7 h-7 ${theme.textColors.primary}`} />
                  </div>
                  <div>
                    <h4 className={`text-xl font-bold ${theme.textColors.primary}`}>Debt Destroyer</h4>
                    <p className={`${theme.textColors.warning} text-sm`}>Break Free</p>
                  </div>
                </div>
                <p className={`${theme.textColors.secondary} mb-6 leading-relaxed`}>
                  Compare avalanche vs snowball strategies and accelerate your path to financial freedom.
                </p>
                <div className={`mb-6 ${theme.backgrounds.glass}/10 backdrop-blur-sm rounded-xl p-4 border ${theme.status.error.border}`}>
                  <div className={`text-xs ${theme.textColors.warning} mb-1`}>$25k debt + $200 extra</div>
                  <div className={`text-2xl font-bold ${theme.textColors.primary}`}>5 Years Saved</div>
                  <div className={`text-xs ${theme.textColors.warning}`}>Thousands in interest!</div>
                </div>
                <Link href="/calculators/debt-payoff" className="block">
                  <Button className={`w-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 ${theme.textColors.primary} font-semibold rounded-xl transition-all duration-300 hover:shadow-lg group-hover:-translate-y-1`}>
                    Destroy Your Debt
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </Link>
              </InteractiveCard>
            </motion.div>
          </div>

          {/* Additional Tools */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.3, duration: 0.6 }}
            className="mt-10 pt-8 border-t border-white/10"
          >
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Link href="/calculators/mortgage" className="group">
                <div className={`${theme.backgrounds.glass}/5 backdrop-blur-sm border border-white/10 rounded-xl p-4 text-center hover:border-white/20 transition-all duration-300 group-hover:-translate-y-1`}>
                  <Building className={`w-8 h-8 mx-auto mb-2 ${theme.textColors.warning}`} />
                  <h4 className={`font-semibold ${theme.textColors.primary} text-sm mb-1`}>Mortgage Calculator</h4>
                  <p className={`text-xs ${theme.textColors.muted}`}>Payment & affordability</p>
                  <div className={`mt-2 text-xs ${theme.textColors.warning}`}>✨ Available</div>
                </div>
              </Link>
              <Link href="/calculators/emergency-fund" className="group">
                <div className={`${theme.backgrounds.glass}/5 backdrop-blur-sm border border-white/10 rounded-xl p-4 text-center hover:border-white/20 transition-all duration-300 group-hover:-translate-y-1`}>
                  <Umbrella className={`w-8 h-8 mx-auto mb-2 ${theme.textColors.primary}`} />
                  <h4 className={`font-semibold ${theme.textColors.primary} text-sm mb-1`}>Emergency Fund</h4>
                  <p className={`text-xs ${theme.textColors.muted}`}>Safety net planning</p>
                  <div className={`mt-2 text-xs ${theme.textColors.primary}`}>✨ Available</div>
                </div>
              </Link>
              <Link href="/calculators/paycheck" className="group">
                <div className={`${theme.backgrounds.glass}/5 backdrop-blur-sm border border-white/10 rounded-xl p-4 text-center hover:border-white/20 transition-all duration-300 group-hover:-translate-y-1`}>
                  <Briefcase className={`w-8 h-8 mx-auto mb-2 ${theme.textColors.warning}`} />
                  <h4 className={`font-semibold ${theme.textColors.primary} text-sm mb-1`}>Paycheck Calculator</h4>
                  <p className={`text-xs ${theme.textColors.muted}`}>Tax & deduction breakdown</p>
                  <div className={`mt-2 text-xs ${theme.textColors.warning}`}>✨ Available</div>
                </div>
              </Link>
              <Link href="/market" className="group">
                <div className={`${theme.backgrounds.glass}/5 backdrop-blur-sm border border-white/10 rounded-xl p-4 text-center hover:border-white/20 transition-all duration-300 group-hover:-translate-y-1`}>
                  <BarChart3 className={`w-8 h-8 mx-auto mb-2 ${theme.textColors.warning}`} />
                  <h4 className={`font-semibold ${theme.textColors.primary} text-sm mb-1`}>Market Dashboard</h4>
                  <p className={`text-xs ${theme.textColors.muted}`}>Real-time data</p>
                  <div className={`mt-2 text-xs ${theme.textColors.warning}`}>🔥 Live!</div>
                </div>
              </Link>
            </div>
          </motion.div>

          {/* Comprehensive Calculator Roadmap */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.4, duration: 0.6 }}
            className="mt-12 pt-8 border-t border-white/10"
          >
            <div className="text-center mb-8">
              <h4 className={`text-2xl font-bold ${theme.textColors.primary} mb-4`}>Comprehensive Calculator Library</h4>
              <p className={`${theme.textColors.secondary} max-w-2xl mx-auto`}>
                20+ specialized financial tools covering every aspect of personal finance
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {/* Available Calculators */}
              <div className="bg-gradient-to-br from-amber-500/10 to-amber-600/10 border border-amber-500/20 rounded-xl p-4 text-center hover:border-amber-400/40 transition-all duration-300">
                <TrendingUp className={`w-8 h-8 mx-auto mb-2 ${theme.textColors.warning}`} />
                <h5 className={`font-semibold ${theme.textColors.primary} text-sm mb-1`}>Compound Interest</h5>
                <div className={`text-xs ${theme.textColors.warning} font-medium`}>✅ Available</div>
              </div>

              <div className="bg-gradient-to-br from-amber-500/10 to-amber-600/10 border border-amber-500/20 rounded-xl p-4 text-center hover:border-amber-400/40 transition-all duration-300">
                <Calculator className={`w-8 h-8 mx-auto mb-2 ${theme.textColors.warning}`} />
                <h5 className={`font-semibold ${theme.textColors.primary} text-sm mb-1`}>Budget Builder</h5>
                <div className={`text-xs ${theme.textColors.warning} font-medium`}>✅ Available</div>
              </div>

              <div className="bg-gradient-to-br from-amber-500/10 to-amber-600/10 border border-amber-500/20 rounded-xl p-4 text-center hover:border-amber-400/40 transition-all duration-300">
                <CreditCard className={`w-8 h-8 mx-auto mb-2 ${theme.textColors.warning}`} />
                <h5 className={`font-semibold ${theme.textColors.primary} text-sm mb-1`}>Debt Payoff</h5>
                <div className={`text-xs ${theme.textColors.warning} font-medium`}>✅ Available</div>
              </div>

              <div className="bg-gradient-to-br from-amber-500/10 to-amber-600/10 border border-amber-500/20 rounded-xl p-4 text-center hover:border-amber-400/40 transition-all duration-300">
                <Building className={`w-8 h-8 mx-auto mb-2 ${theme.textColors.warning}`} />
                <h5 className={`font-semibold ${theme.textColors.primary} text-sm mb-1`}>Mortgage</h5>
                <div className={`text-xs ${theme.textColors.warning} font-medium`}>✅ Available</div>
              </div>

              <div className="bg-gradient-to-br from-amber-500/10 to-amber-600/10 border border-amber-500/20 rounded-xl p-4 text-center hover:border-amber-400/40 transition-all duration-300">
                <Umbrella className={`w-8 h-8 mx-auto mb-2 ${theme.textColors.warning}`} />
                <h5 className={`font-semibold ${theme.textColors.primary} text-sm mb-1`}>Emergency Fund</h5>
                <div className={`text-xs ${theme.textColors.warning} font-medium`}>✅ Available</div>
              </div>

              {/* Coming Soon Calculators - Credit Track */}
              <div className="bg-gradient-to-br from-amber-500/10 to-amber-600/10 border border-amber-500/20 rounded-xl p-4 text-center hover:border-amber-400/40 transition-all duration-300">
                <Star className={`w-8 h-8 mx-auto mb-2 ${theme.textColors.warning}`} />
                <h5 className={`font-semibold ${theme.textColors.primary} text-sm mb-1`}>Credit Score Simulator</h5>
                <div className={`text-xs ${theme.textColors.warning} font-medium`}>🚧 Soon</div>
              </div>

              <div className="bg-gradient-to-br from-amber-500/10 to-amber-600/10 border border-amber-500/20 rounded-xl p-4 text-center hover:border-amber-400/40 transition-all duration-300">
                <CreditCard className={`w-8 h-8 mx-auto mb-2 ${theme.textColors.warning}`} />
                <h5 className={`font-semibold ${theme.textColors.primary} text-sm mb-1`}>Rewards Optimizer</h5>
                <div className={`text-xs ${theme.textColors.warning} font-medium`}>🚧 Soon</div>
              </div>

              <div className={`bg-gradient-to-br ${theme.status.warning.bg}/10 border ${theme.status.warning.border} rounded-xl p-4 text-center hover:${theme.status.warning.border}/40 transition-all duration-300`}>
                <Target className={`w-8 h-8 mx-auto mb-2 ${theme.textColors.warning}`} />
                <h5 className={`font-semibold ${theme.textColors.primary} text-sm mb-1`}>Loan Comparison</h5>
                <div className={`text-xs ${theme.textColors.warning} font-medium`}>🚧 Soon</div>
              </div>

              {/* Coming Soon Calculators - Investment Track */}
              <div className={`bg-gradient-to-br ${theme.status.info.bg}/10 border ${theme.status.info.border} rounded-xl p-4 text-center hover:${theme.status.info.border}/40 transition-all duration-300`}>
                <BarChart3 className={`w-8 h-8 mx-auto mb-2 ${theme.textColors.primary}`} />
                <h5 className={`font-semibold ${theme.textColors.primary} text-sm mb-1`}>Portfolio Analyzer</h5>
                <div className={`text-xs ${theme.textColors.primary} font-medium`}>🚧 Soon</div>
              </div>

              <div className={`bg-gradient-to-br ${theme.status.info.bg}/10 border ${theme.status.info.border} rounded-xl p-4 text-center hover:${theme.status.info.border}/40 transition-all duration-300`}>
                <Timer className={`w-8 h-8 mx-auto mb-2 ${theme.textColors.primary}`} />
                <h5 className={`font-semibold ${theme.textColors.primary} text-sm mb-1`}>Retirement Planner</h5>
                <div className={`text-xs ${theme.textColors.primary} font-medium`}>🚧 Soon</div>
              </div>

              {/* Coming Soon Calculators - Advanced Track */}
              <div className={`bg-gradient-to-br ${theme.backgrounds.card}/50 border ${theme.borderColors.muted} rounded-xl p-4 text-center hover:${theme.borderColors.primary}/40 transition-all duration-300`}>
                <Lightbulb className={`w-8 h-8 mx-auto mb-2 ${theme.textColors.primary}`} />
                <h5 className={`font-semibold ${theme.textColors.primary} text-sm mb-1`}>Tax Optimizer</h5>
                <div className={`text-xs ${theme.textColors.primary} font-medium`}>🚧 Soon</div>
              </div>

              <div className={`bg-gradient-to-br ${theme.backgrounds.card}/50 border ${theme.borderColors.muted} rounded-xl p-4 text-center hover:${theme.borderColors.primary}/40 transition-all duration-300`}>
                <Building className={`w-8 h-8 mx-auto mb-2 ${theme.textColors.primary}`} />
                <h5 className={`font-semibold ${theme.textColors.primary} text-sm mb-1`}>Real Estate ROI</h5>
                <div className={`text-xs ${theme.textColors.primary} font-medium`}>🚧 Soon</div>
              </div>

              <div className={`bg-gradient-to-br ${theme.backgrounds.card}/50 border ${theme.borderColors.muted} rounded-xl p-4 text-center hover:${theme.borderColors.primary}/40 transition-all duration-300`}>
                <Briefcase className={`w-8 h-8 mx-auto mb-2 ${theme.textColors.primary}`} />
                <h5 className={`font-semibold ${theme.textColors.primary} text-sm mb-1`}>Business Cashflow</h5>
                <div className={`text-xs ${theme.textColors.primary} font-medium`}>🚧 Soon</div>
              </div>

              {/* Protection Track */}
              <div className={`bg-gradient-to-br ${theme.backgrounds.card}/50 border ${theme.borderColors.muted} rounded-xl p-4 text-center hover:${theme.borderColors.primary}/40 transition-all duration-300`}>
                <Shield className={`w-8 h-8 mx-auto mb-2 ${theme.textColors.primary}`} />
                <h5 className={`font-semibold ${theme.textColors.primary} text-sm mb-1`}>Insurance Needs</h5>
                <div className={`text-xs ${theme.textColors.primary} font-medium`}>🚧 Soon</div>
              </div>

              <div className={`bg-gradient-to-br ${theme.backgrounds.card}/50 border ${theme.borderColors.muted} rounded-xl p-4 text-center hover:${theme.borderColors.primary}/40 transition-all duration-300`}>
                <Globe className={`w-8 h-8 mx-auto mb-2 ${theme.textColors.primary}`} />
                <h5 className={`font-semibold ${theme.textColors.primary} text-sm mb-1`}>FIRE Calculator</h5>
                <div className={`text-xs ${theme.textColors.primary} font-medium`}>🚧 Soon</div>
              </div>
            </div>

            <div className="text-center mt-8">
              <p className={`${theme.textColors.secondary} text-sm`}>
                <span className={`${theme.textColors.warning} font-semibold`}>13 Available Now</span> •
                <span className={`${theme.textColors.primary} font-semibold`}> 7+ Coming Soon</span> •
                <span className={`${theme.textColors.primary} font-semibold`}>Professional Financial Toolkit</span>
              </p>
            </div>
          </motion.div>
        </motion.div>

        {/* AI-Powered Features Section - Redesigned */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 0.8 }}
          className="bg-gradient-to-r from-blue-900/20 via-slate-800/20 to-blue-900/20 border border-blue-700/30 backdrop-blur-xl rounded-3xl p-8 md:p-12 mb-20"
        >
          <div className="text-center mb-12">
            <motion.h3
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.0, duration: 0.6 }}
              className="text-3xl md:text-4xl font-bold mb-6 flex items-center justify-center gap-3"
            >
              <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-600/25">
                <Brain className={`w-6 h-6 ${theme.textColors.primary}`} />
              </div>
              <span className="bg-gradient-to-r from-blue-400 via-blue-300 to-amber-400 bg-clip-text text-transparent">
                AI-Powered Learning Experience
              </span>
            </motion.h3>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.1, duration: 0.6 }}
              className={`text-lg ${theme.textColors.secondary} max-w-3xl mx-auto`}
            >
              Unlike other platforms with simulated chatbots, we use real{' '}
              <span className={`${theme.textColors.primary} font-medium`}>OpenAI GPT-4o-mini</span>{' '}
              for personalized financial coaching that adapts to your learning journey
            </motion.p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2, duration: 0.6 }}
            >
              <InteractiveCard className={`${theme.backgrounds.glass}/5 backdrop-blur-xl border ${theme.status.info.border} rounded-2xl p-6 hover:${theme.status.info.border}/40 transition-all duration-300`}>
                <div className={`w-14 h-14 bg-gradient-to-r from-slate-600 to-slate-700 rounded-2xl flex items-center justify-center mb-6 shadow-lg`}>
                  <Brain className={`w-7 h-7 ${theme.textColors.primary}`} />
                </div>
                <h4 className={`text-xl font-bold ${theme.textColors.primary} mb-3`}>Contextual AI Coaching</h4>
                <p className={`${theme.textColors.secondary} text-sm leading-relaxed mb-4`}>
                  Our AI knows your learning progress, quiz scores, and struggling topics to provide personalized guidance exactly when you need it.
                </p>
                <div className={`flex items-center gap-2 text-xs ${theme.textColors.primary}`}>
                  <Zap className="w-3 h-3" />
                  <span>Real-time adaptation</span>
                </div>
              </InteractiveCard>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.3, duration: 0.6 }}
            >
              <InteractiveCard className={`${theme.backgrounds.glass}/5 backdrop-blur-xl border ${theme.borderColors.muted} rounded-2xl p-6 hover:${theme.borderColors.primary} transition-all duration-300`}>
                <div className="w-14 h-14 bg-gradient-to-r from-slate-600 to-slate-700 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-slate-600/25">
                  <BarChart3 className={`w-7 h-7 ${theme.textColors.primary}`} />
                </div>
                <h4 className={`text-xl font-bold ${theme.textColors.primary} mb-3`}>Advanced Analytics</h4>
                <p className={`${theme.textColors.secondary} text-sm leading-relaxed mb-4`}>
                  Every lesson completed, calculator used, and quiz taken is tracked with comprehensive analytics and progress insights.
                </p>
                <div className={`flex items-center gap-2 text-xs ${theme.textColors.muted}`}>
                  <Timer className="w-3 h-3" />
                  <span>Persistent tracking</span>
                </div>
              </InteractiveCard>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.4, duration: 0.6 }}
            >
              <InteractiveCard className={`${theme.backgrounds.glass}/5 backdrop-blur-xl border ${theme.borderColors.primary} rounded-2xl p-6 hover:${theme.borderColors.primary} transition-all duration-300`}>
                <div className="w-14 h-14 bg-gradient-to-r from-amber-500 to-amber-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-amber-500/25">
                  <Lightbulb className={`w-7 h-7 ${theme.textColors.primary}`} />
                </div>
                <h4 className={`text-xl font-bold ${theme.textColors.primary} mb-3`}>Smart Q&A System</h4>
                <p className={`${theme.textColors.secondary} text-sm leading-relaxed mb-4`}>
                  Ask any financial question and get expert-level answers that adapt to your current learning level and progress.
                </p>
                <div className={`flex items-center gap-2 text-xs ${theme.textColors.warning}`}>
                  <Star className="w-3 h-3" />
                  <span>Expert-level responses</span>
                </div>
              </InteractiveCard>
            </motion.div>
          </div>

          {/* Quick Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.5, duration: 0.6 }}
            className="mt-10 pt-8 border-t border-white/10"
          >
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
              <div>
                <div className={`text-2xl font-bold ${theme.textColors.primary} mb-1`}>42%</div>
                <div className={`text-xs ${theme.textColors.muted}`}>Average Knowledge Improvement</div>
              </div>
              <div>
                <div className={`text-2xl font-bold ${theme.textColors.warning} mb-1`}>8.2min</div>
                <div className={`text-xs ${theme.textColors.muted}`}>Average Session Duration</div>
              </div>
              <div>
                <div className={`text-2xl font-bold ${theme.textColors.primary} mb-1`}>94%</div>
                <div className={`text-xs ${theme.textColors.muted}`}>30-Day Retention Rate</div>
              </div>
              <div>
                <div className={`text-2xl font-bold ${theme.textColors.warning} mb-1`}>47</div>
                <div className={`text-xs ${theme.textColors.muted}`}>Countries Represented</div>
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Final CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.1, duration: 0.8 }}
          className="text-center mb-20"
        >
          <motion.h3
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2, duration: 0.6 }}
            className="text-3xl md:text-4xl font-bold mb-6"
          >
            <span className="bg-gradient-to-r from-white via-gray-200 to-gray-300 bg-clip-text text-transparent">
              Ready to Transform Your
            </span>
            <br />
            <span className="bg-gradient-to-r from-amber-400 via-amber-300 to-blue-400 bg-clip-text text-transparent">
              Financial Future?
            </span>
          </motion.h3>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.3, duration: 0.6 }}
            className={`text-lg ${theme.textColors.secondary} max-w-2xl mx-auto mb-10`}
          >
            Join thousands of learners who&apos;ve gone from financial confusion to confidence.
            Start your journey today and see measurable results in just weeks.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.4, duration: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link href="/chapter1">
              <Button
                size="lg"
                className={`group bg-gradient-to-r from-amber-500 via-blue-600 to-blue-700 hover:from-amber-600 hover:via-blue-700 hover:to-blue-800 ${theme.textColors.primary} px-10 py-6 text-xl font-semibold shadow-2xl shadow-amber-500/25 hover:shadow-amber-500/40 transition-all duration-300 hover:-translate-y-1 border-0`}
              >
                <Sparkles className="mr-3 w-6 h-6 group-hover:rotate-12 transition-transform" />
                Start Learning Now
                <ArrowRight className="ml-3 w-6 h-6 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Link href="/advanced-progress">
              <Button
                size="lg"
                className={`group ${theme.backgrounds.glass}/10 hover:${theme.backgrounds.glass}/20 ${theme.textColors.primary} px-10 py-6 text-xl font-semibold border border-white/20 hover:border-white/30 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1`}
              >
                <BarChart3 className="mr-3 w-6 h-6 group-hover:scale-110 transition-transform" />
                View Dashboard
              </Button>
            </Link>
          </motion.div>
        </motion.div>
      </main>

      {/* Guided Tour Component */}
      {showGuidedTour && (
        <GuidedTour
          onComplete={() => setShowGuidedTour(false)}
          onSkip={() => setShowGuidedTour(false)}
        />
      )}
    </div>
  );
}
