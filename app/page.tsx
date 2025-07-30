'use client';

import { useState } from "react";
import Link from "next/link";
import { ProgressDisplay } from "@/components/shared/ui/ProgressDisplay";
import FloatingBackground from "@/components/shared/ui/FloatingBackground";
import AnimatedCounter from "@/components/shared/ui/AnimatedCounter";
import MarketTicker from "@/components/shared/ui/MarketTicker";
import InteractiveCard from "@/components/shared/ui/InteractiveCard";
import ParticleSystem from "@/components/shared/ui/ParticleSystem";
import TypingText from "@/components/shared/ui/TypingText";
import GuidedTour from "@/components/demo/GuidedTour";
import JudgeMode from "@/components/demo/JudgeMode";
import { useProgress } from "@/lib/context/ProgressContext";
import {
  BookOpen,
  Calculator,
  Target,
  TrendingUp,
  Shield,
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
  PieChart,
  FileText,
  Umbrella,
  CreditCard
} from "lucide-react";

export default function HomePage() {
  const { state } = useProgress();
  const [showGuidedTour, setShowGuidedTour] = useState(false);
  const [judgeModeActive, setJudgeModeActive] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-green-50 relative overflow-hidden">
    {/* Judge Mode Overlay */}
    <JudgeMode
      isActive={judgeModeActive}
      onToggle={setJudgeModeActive}
    />

    {/* Particle System Background */}
    <ParticleSystem particleCount={30} />

    {/* Floating Background Icons */}
    <FloatingBackground />

    {/* Header */}
    <header className="bg-white/80 backdrop-blur-md shadow-sm relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-2 rounded-lg animate-pulse-glow">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent font-space">
              Finance Quest
            </h1>
          </div>
          <div className="flex items-center space-x-4">
            <MarketTicker />
            <ProgressDisplay />
          </div>
        </div>
      </div>
    </header>

    {/* Main Content */}
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10">
      {/* Hero Section with Animations */}
      <div className="text-center mb-16">
        <div className="mb-6 animate-fade-in-up">
          <span className="bg-red-100 text-red-800 text-sm font-medium px-4 py-2 rounded-full border border-red-200 animate-pulse-glow flex items-center justify-center gap-2 max-w-fit mx-auto">
            <Target className="w-4 h-4" />
            Solving the 64% Financial Illiteracy Crisis
          </span>
        </div>

        <h2 className="text-6xl font-bold text-gray-900 mb-6 leading-tight animate-fade-in-up stagger-1 font-space">
          <TypingText
            texts={["Master Your Money", "Build Your Wealth", "Secure Your Future", "Take Control"]}
            className="gradient-text-premium"
          />
          <br />
          <span className="gradient-text-gold animate-gradient">
            Master Your Future
          </span>
        </h2>

        <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed mb-8 animate-fade-in-up stagger-2 font-inter">
          Transform from financial novice to money master through AI-powered personalized coaching,
          interactive calculators, and real-world scenarios. <strong>No prior knowledge required!</strong>
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up stagger-3">
          <Link href="/chapter1">
            <button className="group bg-gradient-to-r from-blue-600 via-purple-600 to-blue-700 text-white px-8 py-4 rounded-xl text-lg font-semibold hover:from-blue-700 hover:via-purple-700 hover:to-blue-800 transition-all shadow-lg card-lift animate-pulse-glow font-poppins relative overflow-hidden">
              <div className="absolute inset-0 shimmer-effect opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <span className="flex items-center relative z-10">
                <Sparkles className="mr-2 w-5 h-5" />
                Start Your Journey
              </span>
            </button>
          </Link>

          <button
            onClick={() => setShowGuidedTour(true)}
            className="group bg-gradient-to-r from-yellow-500 via-orange-500 to-red-500 text-white px-8 py-4 rounded-xl text-lg font-semibold hover:from-yellow-600 hover:via-orange-600 hover:to-red-600 transition-all shadow-lg card-lift animate-pulse-glow font-poppins relative overflow-hidden"
          >
            <div className="absolute inset-0 shimmer-effect opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <span className="flex items-center relative z-10">
              <Play className="mr-2 w-5 h-5" />
              Contest Demo Tour
            </span>
          </button>

          <Link href="/health-assessment">
            <button className="group bg-gradient-to-r from-green-500 to-emerald-600 text-white px-8 py-4 rounded-xl text-lg font-semibold hover:from-green-600 hover:to-emerald-700 transition-all shadow-lg card-lift animate-pulse-glow font-poppins relative overflow-hidden">
              <div className="absolute inset-0 shimmer-effect opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <span className="flex items-center relative z-10">
                <Target className="mr-2 w-5 h-5" />
                Health Assessment
              </span>
            </button>
          </Link>
          <Link href="/calculators/compound-interest">
            <button className="group premium-card text-blue-600 px-8 py-4 rounded-xl text-lg font-semibold border-2 border-blue-600/20 hover:border-blue-600/40 transition-all shadow-lg font-poppins relative overflow-hidden">
              <div className="absolute inset-0 shimmer-effect opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <span className="flex items-center relative z-10">
                <Calculator className="mr-2 w-5 h-5 group-hover:rotate-12 transition-transform" />
                Try Calculator
              </span>
            </button>
          </Link>
          <Link href="/progress">
            <button className="group bg-gradient-to-r from-purple-600 to-indigo-700 text-white px-8 py-4 rounded-xl text-lg font-semibold hover:from-purple-700 hover:to-indigo-800 transition-all shadow-lg hover-lift">
              <span className="flex items-center">
                <BarChart3 className="mr-2 w-5 h-5" />
                View Progress
              </span>
            </button>
          </Link>
        </div>
      </div>

      {/* Animated Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-center mb-16">
        <InteractiveCard
          className="premium-card rounded-xl shadow-lg p-6 border-l-4 border-red-500 animate-fade-in-up stagger-1"
          glowColor="rgba(239, 68, 68, 0.3)"
        >
          <div className="text-4xl font-bold text-red-600 mb-2 font-space">
            <AnimatedCounter end={64} suffix="%" className="text-4xl font-bold text-red-600" />
          </div>
          <p className="text-gray-600 text-sm font-inter">of Americans can&apos;t pass a basic financial literacy test</p>
          <p className="text-xs text-red-500 mt-2 font-medium flex items-center justify-center font-poppins">
            <Target className="w-3 h-3 mr-1" />
            The problem we&apos;re solving
          </p>
        </InteractiveCard>

        <InteractiveCard
          className="bg-white/70 backdrop-blur-sm rounded-xl shadow-lg p-6 border-l-4 border-green-500 animate-fade-in-up stagger-2"
          glowColor="rgba(34, 197, 94, 0.3)"
        >
          <div className="text-4xl font-bold text-green-600 mb-2">
            <AnimatedCounter end={80} suffix="%+" className="text-4xl font-bold text-green-600" />
          </div>
          <p className="text-gray-600 text-sm">mastery rate required to unlock next chapter</p>
          <p className="text-xs text-green-500 mt-2 font-medium flex items-center justify-center">
            <Award className="w-3 h-3 mr-1" />
            Real learning outcomes
          </p>
        </InteractiveCard>

        <InteractiveCard
          className="bg-white/70 backdrop-blur-sm rounded-xl shadow-lg p-6 border-l-4 border-purple-500 animate-fade-in-up stagger-3"
          glowColor="rgba(139, 92, 246, 0.3)"
        >
          <div className="text-4xl font-bold text-purple-600 mb-2">
            <AnimatedCounter end={30} className="text-4xl font-bold text-purple-600" />
          </div>
          <p className="text-gray-600 text-sm">comprehensive chapters covering complete financial mastery</p>
          <p className="text-xs text-purple-500 mt-2 font-medium flex items-center justify-center">
            <BookOpen className="w-3 h-3 mr-1" />
            Complete curriculum
          </p>
        </InteractiveCard>

        <InteractiveCard
          className="bg-white/70 backdrop-blur-sm rounded-xl shadow-lg p-6 border-l-4 border-blue-500 animate-fade-in-up stagger-4"
          glowColor="rgba(59, 130, 246, 0.3)"
        >
          <div className="text-4xl font-bold text-blue-600 mb-2 flex items-center justify-center">
            <Zap className="w-10 h-10 mr-2" />
            Real
          </div>
          <p className="text-gray-600 text-sm">OpenAI GPT-4o-mini integration, not simulated chatbots</p>
          <p className="text-xs text-blue-500 mt-2 font-medium flex items-center justify-center">
            <Brain className="w-3 h-3 mr-1" />
            Genuine AI coaching
          </p>
        </InteractiveCard>
      </div>

      {/* Comprehensive Chapter Overview - Foundation Track */}
      <div className="mb-16">
        <div className="text-center mb-8">
          <h3 className="text-3xl font-bold text-gray-900 mb-4 font-space gradient-text-premium">Complete Financial Education Curriculum</h3>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto font-inter">
            30 comprehensive chapters organized in 6 learning tracks - Master every aspect of personal finance
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {/* Chapter 1 - Available */}
          <InteractiveCard
            className="premium-card rounded-xl shadow-lg p-6 border-l-4 border-blue-500 transform transition-all"
            glowColor="rgba(59, 130, 246, 0.3)"
          >
            <div className="flex items-center mb-3">
              <Brain className="w-8 h-8 mr-3 text-purple-600" />
              <h4 className="text-lg font-bold text-gray-900 font-space">Chapter 1: Money Psychology</h4>
            </div>
            <p className="text-gray-600 mb-4 font-inter">Emotional relationship with money, scarcity vs abundance, cognitive biases</p>
            <div className="flex items-center justify-between">
              <span className="text-sm text-green-600 font-medium bg-green-100 px-2 py-1 rounded animate-pulse-glow font-poppins flex items-center gap-1">
                <Target className="w-3 h-3" />
                Available Now
              </span>
              <Link href="/chapter1">
                <button className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:from-blue-600 hover:to-blue-700 transition-all hover:shadow-lg transform hover:scale-105 font-poppins relative overflow-hidden group">
                  <div className="absolute inset-0 shimmer-effect opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <span className="relative z-10">Start Learning</span>
                </button>
              </Link>
            </div>
          </InteractiveCard>

          {/* Chapter 2 - Conditionally Available */}
          {state.userProgress.currentChapter >= 2 ? (
            <InteractiveCard
              className="premium-card rounded-xl shadow-lg p-6 border-l-4 border-green-500 transform transition-all"
              glowColor="rgba(34, 197, 94, 0.3)"
            >
              <div className="flex items-center mb-3">
                <Building className="w-8 h-8 mr-3 text-green-600" />
                <h4 className="text-lg font-bold text-gray-900 font-space">Chapter 2: Banking Fundamentals</h4>
              </div>
              <p className="text-gray-600 mb-4 font-inter">Account optimization, fees, credit unions, direct deposits, transfers</p>
              <div className="flex items-center justify-between">
                <span className="text-sm text-blue-600 font-medium bg-blue-100 px-2 py-1 rounded font-poppins flex items-center gap-1">
                  <CheckCircle className="w-3 h-3" />
                  Unlocked!
                </span>
                <Link href="/chapter2">
                  <button className="bg-gradient-to-r from-green-500 to-green-600 text-white px-4 py-2 rounded-lg font-semibold hover:from-green-600 hover:to-green-700 transition-all hover:shadow-lg transform hover:scale-105 font-poppins">
                    Continue Learning
                  </button>
                </Link>
              </div>
            </InteractiveCard>
          ) : (
            <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl shadow-lg p-6 border-l-4 border-gray-300">
              <div className="flex items-center mb-3">
                <Building className="w-8 h-8 mr-3 text-gray-400" />
                <h4 className="text-lg font-bold text-gray-500">Chapter 2: Banking Fundamentals</h4>
              </div>
              <p className="text-gray-500 mb-4">Account optimization, fees, credit unions, direct deposits, transfers</p>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-400 font-medium bg-gray-200 px-2 py-1 rounded flex items-center gap-1">
                  <Lock className="w-3 h-3" />
                  Complete Chapter 1
                </span>
                <button className="bg-gray-300 text-gray-500 px-4 py-2 rounded-lg cursor-not-allowed">
                  Locked
                </button>
              </div>
            </div>
          )}

          {/* Chapter 3 - Conditionally Available */}
          {state.userProgress.currentChapter >= 3 ? (
            <InteractiveCard
              className="premium-card rounded-xl shadow-lg p-6 border-l-4 border-purple-500 transform transition-all"
              glowColor="rgba(139, 92, 246, 0.3)"
            >
              <div className="flex items-center mb-3">
                <Briefcase className="w-8 h-8 mr-3 text-purple-600" />
                <h4 className="text-lg font-bold text-gray-900 font-space">Chapter 3: Income & Career</h4>
              </div>
              <p className="text-gray-600 mb-4 font-inter">Salary negotiation, pay stubs, benefits, side hustles, skill monetization</p>
              <div className="flex items-center justify-between">
                <span className="text-sm text-blue-600 font-medium bg-blue-100 px-2 py-1 rounded font-poppins flex items-center gap-1">
                  <CheckCircle className="w-3 h-3" />
                  Unlocked!
                </span>
                <Link href="/chapter3">
                  <button className="bg-gradient-to-r from-purple-500 to-purple-600 text-white px-4 py-2 rounded-lg font-semibold hover:from-purple-600 hover:to-purple-700 transition-all hover:shadow-lg transform hover:scale-105 font-poppins">
                    Continue Learning
                  </button>
                </Link>
              </div>
            </InteractiveCard>
          ) : (
            <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl shadow-lg p-6 border-l-4 border-gray-300">
              <div className="flex items-center mb-3">
                <Briefcase className="w-8 h-8 mr-3 text-gray-400" />
                <h4 className="text-lg font-bold text-gray-500">Chapter 3: Income & Career Finance</h4>
              </div>
              <p className="text-gray-500 mb-4">Salary negotiation, pay stubs, benefits, side hustles, skill monetization</p>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-400 font-medium bg-gray-200 px-2 py-1 rounded flex items-center gap-1">
                  <Lock className="w-3 h-3" />
                  Complete Chapter 2
                </span>
                <button className="bg-gray-300 text-gray-500 px-4 py-2 rounded-lg cursor-not-allowed">
                  Locked
                </button>
              </div>
            </div>
          )}

          {/* Chapter 4 - Locked */}
          <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl shadow-lg p-6 border-l-4 border-gray-300">
            <div className="flex items-center mb-3">
              <TrendingUp className="w-8 h-8 mr-3 text-gray-400" />
              <h4 className="text-lg font-bold text-gray-500">Chapter 4: Budgeting Mastery</h4>
            </div>
            <p className="text-gray-500 mb-4">Zero-based budgeting, 50/30/20 rule, expense tracking, automation</p>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-400 font-medium bg-gray-200 px-2 py-1 rounded flex items-center gap-1">
                <Lock className="w-3 h-3" />
                Complete Chapter 3
              </span>
              <button className="bg-gray-300 text-gray-500 px-4 py-2 rounded-lg cursor-not-allowed">
                Locked
              </button>
            </div>
          </div>

          {/* Chapter 5 - Locked */}
          <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl shadow-lg p-6 border-l-4 border-gray-300">
            <div className="flex items-center mb-3">
              <PieChart className="w-8 h-8 mr-3 text-gray-400" />
              <h4 className="text-lg font-bold text-gray-500">Chapter 5: Emergency Funds</h4>
            </div>
            <p className="text-gray-500 mb-4">Fund sizing, high-yield savings, rebuilding strategies</p>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-400 font-medium bg-gray-200 px-2 py-1 rounded flex items-center gap-1">
                <Lock className="w-3 h-3" />
                Complete Chapter 4
              </span>
              <button className="bg-gray-300 text-gray-500 px-4 py-2 rounded-lg cursor-not-allowed">
                Locked
              </button>
            </div>
          </div>

          {/* Chapter 6 - Locked */}
          <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl shadow-lg p-6 border-l-4 border-gray-300">
            <div className="flex items-center mb-3">
              <FileText className="w-8 h-8 mr-3 text-gray-400" />
              <h4 className="text-lg font-bold text-gray-500">Chapter 6: Debt Fundamentals</h4>
            </div>
            <p className="text-gray-500 mb-4">Good vs bad debt, avalanche vs snowball, consolidation, negotiations</p>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-400 font-medium bg-gray-200 px-2 py-1 rounded flex items-center gap-1">
                <Lock className="w-3 h-3" />
                Complete Chapter 5
              </span>
              <button className="bg-gray-300 text-gray-500 px-4 py-2 rounded-lg cursor-not-allowed">
                Locked
              </button>
            </div>
          </div>
        </div>

        {/* Show More Button */}
        <div className="text-center">
          <details className="inline-block">
            <summary className="bg-gradient-to-r from-purple-100 to-pink-100 text-purple-800 px-6 py-3 rounded-lg cursor-pointer hover:from-purple-200 hover:to-pink-200 transition-all font-medium flex items-center justify-center gap-2">
              <BookOpen className="w-4 h-4" />
              View All 30 Chapters (24 More)
            </summary>
            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg p-4 border border-gray-200">
                <Shield className="w-6 h-6 mr-2 text-gray-400 mb-2" />
                <h5 className="font-semibold text-gray-500 text-sm">Credit Track (Chapters 7-10)</h5>
                <p className="text-xs text-gray-400 mt-1">Credit scores, cards, loans, student debt</p>
              </div>
              <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg p-4 border border-gray-200">
                <TrendingUp className="w-6 h-6 mr-2 text-gray-400 mb-2" />
                <h5 className="font-semibold text-gray-500 text-sm">Investment Track (Chapters 11-16)</h5>
                <p className="text-xs text-gray-400 mt-1">Stocks, bonds, funds, retirement accounts</p>
              </div>
              <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg p-4 border border-gray-200">
                <Umbrella className="w-6 h-6 mr-2 text-gray-400 mb-2" />
                <h5 className="font-semibold text-gray-500 text-sm">Protection Track (Chapters 17-20)</h5>
                <p className="text-xs text-gray-400 mt-1">Insurance fundamentals and risk management</p>
              </div>
              <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg p-4 border border-gray-200">
                <Lightbulb className="w-6 h-6 mr-2 text-gray-400 mb-2" />
                <h5 className="font-semibold text-gray-500 text-sm">Advanced Planning (Chapters 21-30)</h5>
                <p className="text-xs text-gray-400 mt-1">Tax strategy, real estate, business, economics</p>
              </div>
            </div>
          </details>
        </div>
      </div>

      {/* Featured Interactive Tools */}
      <div className="bg-gradient-to-r from-white to-blue-50 rounded-2xl shadow-xl p-8 mb-16 border border-blue-100">
        <div className="text-center mb-8">
          <h3 className="text-3xl font-bold text-gray-900 mb-4 flex items-center justify-center gap-3">
            <Calculator className="w-8 h-8 text-blue-600" />
            Interactive Financial Tools
          </h3>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Experience the power of financial concepts through hands-on calculators with real-time feedback
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Compound Interest Calculator */}
          <InteractiveCard
            className="group bg-gradient-to-br from-green-50 to-emerald-100 rounded-xl p-6 border border-green-200"
            glowColor="rgba(34, 197, 94, 0.3)"
          >
            <div className="flex items-center mb-4">
              <div className="bg-green-500 text-white p-3 rounded-lg mr-4 group-hover:bg-green-600 transition-colors">
                <TrendingUp className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-lg font-bold text-green-900">Compound Interest</h4>
                <p className="text-green-700 text-xs">The 8th Wonder</p>
              </div>
            </div>
            <p className="text-green-800 mb-4 leading-relaxed text-sm">
              Watch your money grow exponentially over time through the magic of compound interest.
            </p>
            <div className="mb-4 bg-white bg-opacity-60 rounded-lg p-3">
              <div className="text-xs text-green-700 mb-1">$100/month × 30 years</div>
              <div className="text-xl font-bold text-green-900">$303,219</div>
              <div className="text-xs text-green-600">From $36k invested!</div>
            </div>
            <Link href="/calculators/compound-interest">
              <button className="w-full bg-green-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-green-600 transition-all text-sm hover:shadow-lg transform hover:scale-105">
                Start Building Wealth
              </button>
            </Link>
          </InteractiveCard>

          {/* Budget Builder Calculator */}
          <div className="group bg-gradient-to-br from-blue-50 to-indigo-100 rounded-xl p-6 border border-blue-200 hover:shadow-lg transition-all transform hover:scale-105">
            <div className="flex items-center mb-4">
              <div className="bg-blue-500 text-white p-3 rounded-lg mr-4 group-hover:bg-blue-600 transition-colors">
                <BarChart3 className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-lg font-bold text-blue-900">Budget Builder</h4>
                <p className="text-blue-700 text-xs">50/30/20 Rule</p>
              </div>
            </div>
            <p className="text-blue-800 mb-4 leading-relaxed text-sm">
              Master the proven 50/30/20 budgeting rule for needs, wants, and savings.
            </p>
            <div className="mb-4 bg-white bg-opacity-60 rounded-lg p-3">
              <div className="text-xs text-blue-700 mb-1">$5,000 income breakdown</div>
              <div className="text-xl font-bold text-blue-900">Perfect Balance</div>
              <div className="text-xs text-blue-600">Needs, wants, savings!</div>
            </div>
            <Link href="/calculators/budget-builder">
              <button className="w-full bg-blue-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-600 transition-all text-sm">
                Build Your Budget
              </button>
            </Link>
          </div>

          {/* Debt Payoff Calculator */}
          <div className="group bg-gradient-to-br from-red-50 to-pink-100 rounded-xl p-6 border border-red-200 hover:shadow-lg transition-all transform hover:scale-105">
            <div className="flex items-center mb-4">
              <div className="bg-red-500 text-white p-3 rounded-lg mr-4 group-hover:bg-red-600 transition-colors">
                <CreditCard className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-lg font-bold text-red-900">Debt Destroyer</h4>
                <p className="text-red-700 text-xs">Break Free</p>
              </div>
            </div>
            <p className="text-red-800 mb-4 leading-relaxed text-sm">
              Compare avalanche vs snowball strategies to eliminate debt faster.
            </p>
            <div className="mb-4 bg-white bg-opacity-60 rounded-lg p-3">
              <div className="text-xs text-red-700 mb-1">$25k debt + $200 extra</div>
              <div className="text-xl font-bold text-red-900">5 Years Saved</div>
              <div className="text-xs text-red-600">Thousands in interest!</div>
            </div>
            <Link href="/calculators/debt-payoff">
              <button className="w-full bg-red-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-red-600 transition-all text-sm">
                Destroy Your Debt
              </button>
            </Link>
          </div>
        </div>

        {/* Available & Coming Soon Calculators */}
        <div className="mt-8 pt-6 border-t border-blue-200">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
            <Link href="/calculators/mortgage">
              <div className="text-center bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-3 border border-green-200 hover:shadow-lg transition-all transform hover:scale-105 cursor-pointer">
                <Building className="w-8 h-8 mx-auto mb-2 text-green-600" />
                <p className="text-xs font-medium text-green-800">Mortgage Calculator</p>
                <p className="text-xs text-green-600">✨ Now Available!</p>
              </div>
            </Link>
            <div className="text-center bg-white bg-opacity-40 rounded-lg p-3">
              <Umbrella className="w-8 h-8 mx-auto mb-2 text-gray-400" />
              <p className="text-xs font-medium text-gray-600">Retirement Planner</p>
              <p className="text-xs text-gray-500">Coming Soon</p>
            </div>
            <div className="text-center bg-white bg-opacity-40 rounded-lg p-3">
              <CreditCard className="w-8 h-8 mx-auto mb-2 text-gray-400" />
              <p className="text-xs font-medium text-gray-600">Auto Loan Calculator</p>
              <p className="text-xs text-gray-500">Coming Soon</p>
            </div>
          </div>
        </div>
      </div>

      {/* AI-Powered Features Section */}
      <InteractiveCard className="premium-card bg-gradient-to-r from-purple-50 to-indigo-100 rounded-2xl shadow-xl p-8 mb-16 border border-purple-200">
        <div className="text-center mb-8">
          <h3 className="text-3xl font-bold text-gray-900 mb-4 font-space gradient-text-premium flex items-center justify-center gap-3">
            <Brain className="w-8 h-8 text-purple-600" />
            AI-Powered Learning Experience
          </h3>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto font-inter">
            Unlike other platforms with simulated chatbots, we use real OpenAI GPT-4o-mini for personalized financial coaching
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <InteractiveCard className="premium-card rounded-xl p-6 shadow-lg border border-purple-100" glowColor="rgba(147, 51, 234, 0.3)">
            <div className="bg-gradient-to-br from-purple-100 to-purple-200 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
              <Brain className="w-6 h-6 text-purple-600" />
            </div>
            <h4 className="text-lg font-bold text-gray-900 mb-2 font-space">Contextual AI Coaching</h4>
            <p className="text-gray-600 text-sm leading-relaxed font-inter">
              Our AI knows your learning progress, quiz scores, and struggling topics to provide personalized guidance exactly when you need it.
            </p>
          </InteractiveCard>

          <InteractiveCard className="premium-card rounded-xl p-6 shadow-lg border border-purple-100" glowColor="rgba(59, 130, 246, 0.3)">
            <div className="bg-gradient-to-br from-blue-100 to-blue-200 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
              <BarChart3 className="w-6 h-6 text-blue-600" />
            </div>
            <h4 className="text-lg font-bold text-gray-900 mb-2 font-space">Progress Tracking</h4>
            <p className="text-gray-600 text-sm leading-relaxed font-inter">
              Every lesson completed, calculator used, and quiz taken is tracked across sessions with persistent localStorage and analytics.
            </p>
          </InteractiveCard>

          <InteractiveCard className="premium-card rounded-xl p-6 shadow-lg border border-purple-100" glowColor="rgba(34, 197, 94, 0.3)">
            <div className="bg-gradient-to-br from-green-100 to-green-200 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
              <Sparkles className="w-6 h-6 text-green-600" />
            </div>
            <h4 className="text-lg font-bold text-gray-900 mb-2 font-space">Smart Q&A System</h4>
            <p className="text-gray-600 text-sm leading-relaxed font-inter">
              Ask any financial question and get expert-level answers that adapt to your current learning level and progress.
            </p>
          </InteractiveCard>
        </div>
      </InteractiveCard>

      {/* Impact Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-center mb-16">
        <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-red-500">
          <div className="text-4xl font-bold text-red-600 mb-2">64%</div>
          <p className="text-gray-600 text-sm">of Americans can&apos;t pass a basic financial literacy test</p>
          <p className="text-xs text-red-500 mt-2 font-medium">The problem we&apos;re solving</p>
        </div>
        <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-green-500">
          <div className="text-4xl font-bold text-green-600 mb-2">80%+</div>
          <p className="text-gray-600 text-sm">mastery rate required to unlock next chapter</p>
          <p className="text-xs text-green-500 mt-2 font-medium">Real learning outcomes</p>
        </div>
        <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-purple-500">
          <div className="text-4xl font-bold text-purple-600 mb-2">30</div>
          <p className="text-gray-600 text-sm">comprehensive chapters covering complete financial mastery</p>
          <p className="text-xs text-purple-500 mt-2 font-medium">Complete curriculum</p>
        </div>
        <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-blue-500">
          <div className="text-4xl font-bold text-blue-600 mb-2">Real</div>
          <p className="text-gray-600 text-sm">OpenAI GPT-4o-mini integration, not simulated chatbots</p>
          <p className="text-xs text-blue-500 mt-2 font-medium">Genuine AI coaching</p>
        </div>
      </div>
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
