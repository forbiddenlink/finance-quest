'use client';

import Link from 'next/link';
import { ArrowLeft, BookOpen, Shield, Target, Users, Award, GraduationCap, TrendingUp, CheckCircle } from 'lucide-react';
import { theme } from '@/lib/theme';

export default function AboutPage() {
  return (
    <div className={`min-h-screen ${theme.backgrounds.primary}`}>
      {/* Header */}
      <div className={`${theme.backgrounds.header} border-b ${theme.borderColors.primary} sticky top-0 z-50`}>
        <div className="max-w-4xl mx-auto px-6 py-4">
          <Link href="/" className={`flex items-center ${theme.textColors.primary} hover:${theme.textColors.secondary} transition-colors`}>
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Home
          </Link>
        </div>
      </div>

      {/* Hero Section */}
      <div className="max-w-4xl mx-auto px-6 py-12">
        <h1 className={`text-4xl font-bold ${theme.textColors.primary} mb-4`}>About Finance Quest</h1>
        <p className={`text-xl ${theme.textColors.secondary} mb-12`}>
          Democratizing financial literacy through evidence-based education and AI-powered coaching.
        </p>

        {/* Mission Section */}
        <section className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-gradient-to-r from-amber-500 to-amber-600 rounded-xl flex items-center justify-center">
              <Target className="w-5 h-5 text-white" />
            </div>
            <h2 className={`text-2xl font-semibold ${theme.textColors.primary}`}>Our Mission</h2>
          </div>
          <p className={`${theme.textColors.secondary} mb-4 leading-relaxed`}>
            Financial literacy is one of the most important life skills, yet it&apos;s rarely taught in schools.
            Finance Quest was created to fill this gap by providing free, comprehensive financial education
            that&apos;s accessible to everyone, regardless of their background or prior knowledge.
          </p>
          <p className={`${theme.textColors.secondary} leading-relaxed`}>
            We believe that understanding personal finance shouldn&apos;t require expensive courses or confusing
            jargon. Our platform breaks down complex financial concepts into digestible lessons, interactive
            calculators, and personalized AI coaching.
          </p>
        </section>

        {/* Expertise Section */}
        <section className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
              <GraduationCap className="w-5 h-5 text-white" />
            </div>
            <h2 className={`text-2xl font-semibold ${theme.textColors.primary}`}>Our Expertise</h2>
          </div>
          <p className={`${theme.textColors.secondary} mb-6 leading-relaxed`}>
            Our curriculum is developed by financial educators and reviewed against established personal
            finance frameworks including:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className={`p-4 rounded-xl border ${theme.borderColors.primary} ${theme.backgrounds.card}`}>
              <h3 className={`font-semibold ${theme.textColors.primary} mb-2`}>Academic Foundations</h3>
              <ul className={`${theme.textColors.secondary} text-sm space-y-1`}>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                  <span>Behavioral economics principles (Thaler, Kahneman)</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                  <span>Modern portfolio theory fundamentals</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                  <span>Financial planning best practices (CFP curriculum)</span>
                </li>
              </ul>
            </div>
            <div className={`p-4 rounded-xl border ${theme.borderColors.primary} ${theme.backgrounds.card}`}>
              <h3 className={`font-semibold ${theme.textColors.primary} mb-2`}>Practical Knowledge</h3>
              <ul className={`${theme.textColors.secondary} text-sm space-y-1`}>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                  <span>Real-world budgeting strategies (50/30/20, zero-based)</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                  <span>Debt payoff methods (avalanche, snowball)</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                  <span>Tax-advantaged account strategies</span>
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* Content Standards */}
        <section className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <h2 className={`text-2xl font-semibold ${theme.textColors.primary}`}>Content Standards</h2>
          </div>
          <p className={`${theme.textColors.secondary} mb-6 leading-relaxed`}>
            We hold ourselves to high standards for accuracy, objectivity, and educational value:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className={`p-4 rounded-xl border ${theme.borderColors.primary} ${theme.backgrounds.card}`}>
              <Award className={`w-6 h-6 ${theme.textColors.warning} mb-2`} />
              <h3 className={`font-semibold ${theme.textColors.primary} mb-1`}>Evidence-Based</h3>
              <p className={`${theme.textColors.secondary} text-sm`}>
                Content is based on peer-reviewed research and established financial principles.
              </p>
            </div>
            <div className={`p-4 rounded-xl border ${theme.borderColors.primary} ${theme.backgrounds.card}`}>
              <Users className={`w-6 h-6 ${theme.textColors.primary} mb-2`} />
              <h3 className={`font-semibold ${theme.textColors.primary} mb-1`}>Unbiased</h3>
              <p className={`${theme.textColors.secondary} text-sm`}>
                We don&apos;t sell financial products or receive commissions. Our only goal is education.
              </p>
            </div>
            <div className={`p-4 rounded-xl border ${theme.borderColors.primary} ${theme.backgrounds.card}`}>
              <BookOpen className={`w-6 h-6 ${theme.textColors.primary} mb-2`} />
              <h3 className={`font-semibold ${theme.textColors.primary} mb-1`}>Accessible</h3>
              <p className={`${theme.textColors.secondary} text-sm`}>
                Complex topics explained in plain language, suitable for beginners to advanced learners.
              </p>
            </div>
            <div className={`p-4 rounded-xl border ${theme.borderColors.primary} ${theme.backgrounds.card}`}>
              <TrendingUp className={`w-6 h-6 ${theme.textColors.warning} mb-2`} />
              <h3 className={`font-semibold ${theme.textColors.primary} mb-1`}>Up-to-Date</h3>
              <p className={`${theme.textColors.secondary} text-sm`}>
                Content is regularly reviewed and updated to reflect current tax laws and best practices.
              </p>
            </div>
          </div>
        </section>

        {/* Disclaimer */}
        <section className="mb-12">
          <div className={`p-6 rounded-xl border border-amber-500/30 bg-amber-500/10`}>
            <h2 className={`text-lg font-semibold ${theme.textColors.primary} mb-3`}>Important Disclaimer</h2>
            <p className={`${theme.textColors.secondary} text-sm leading-relaxed`}>
              Finance Quest provides general financial education for informational purposes only. Our content,
              calculators, and AI coaching do not constitute personalized financial, investment, tax, or legal
              advice. Individual financial situations vary significantly, and what works for one person may not
              be appropriate for another. We strongly recommend consulting with qualified professionals
              (financial advisors, CPAs, attorneys) before making significant financial decisions. Past
              performance and historical data do not guarantee future results.
            </p>
          </div>
        </section>

        {/* Platform Stats */}
        <section className="mb-12">
          <h2 className={`text-2xl font-semibold ${theme.textColors.primary} mb-6`}>Platform Overview</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className={`p-4 rounded-xl border ${theme.borderColors.primary} ${theme.backgrounds.card} text-center`}>
              <div className={`text-3xl font-bold ${theme.textColors.warning} mb-1`}>17+</div>
              <div className={`${theme.textColors.secondary} text-sm`}>Chapters</div>
            </div>
            <div className={`p-4 rounded-xl border ${theme.borderColors.primary} ${theme.backgrounds.card} text-center`}>
              <div className={`text-3xl font-bold ${theme.textColors.primary} mb-1`}>100+</div>
              <div className={`${theme.textColors.secondary} text-sm`}>Lessons</div>
            </div>
            <div className={`p-4 rounded-xl border ${theme.borderColors.primary} ${theme.backgrounds.card} text-center`}>
              <div className={`text-3xl font-bold ${theme.textColors.warning} mb-1`}>20+</div>
              <div className={`${theme.textColors.secondary} text-sm`}>Calculators</div>
            </div>
            <div className={`p-4 rounded-xl border ${theme.borderColors.primary} ${theme.backgrounds.card} text-center`}>
              <div className={`text-3xl font-bold ${theme.textColors.primary} mb-1`}>AI</div>
              <div className={`${theme.textColors.secondary} text-sm`}>Coaching</div>
            </div>
          </div>
        </section>

        {/* Footer Links */}
        <div className={`mt-12 pt-8 border-t ${theme.borderColors.primary}`}>
          <div className="flex flex-wrap gap-6">
            <Link href="/privacy" className={`${theme.textColors.secondary} hover:${theme.textColors.primary} transition-colors`}>
              Privacy Policy
            </Link>
            <Link href="/terms" className={`${theme.textColors.secondary} hover:${theme.textColors.primary} transition-colors`}>
              Terms of Service
            </Link>
            <Link href="/curriculum" className={`${theme.textColors.secondary} hover:${theme.textColors.primary} transition-colors`}>
              Full Curriculum
            </Link>
            <Link href="/" className={`${theme.textColors.secondary} hover:${theme.textColors.primary} transition-colors`}>
              Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
