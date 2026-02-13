'use client';

import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { theme } from '@/lib/theme';

export default function TermsOfServicePage() {
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

      {/* Content */}
      <div className="max-w-4xl mx-auto px-6 py-12">
        <h1 className={`text-4xl font-bold ${theme.textColors.primary} mb-8`}>Terms of Service</h1>
        <p className={`${theme.textColors.secondary} mb-8`}>Last updated: February 2026</p>

        <div className={`prose prose-invert max-w-none ${theme.textColors.secondary}`}>
          <section className="mb-8">
            <h2 className={`text-2xl font-semibold ${theme.textColors.primary} mb-4`}>1. Acceptance of Terms</h2>
            <p className="mb-4">
              By accessing and using Finance Quest, you agree to be bound by these Terms of Service. If you
              do not agree to these terms, please do not use our platform.
            </p>
          </section>

          <section className="mb-8">
            <h2 className={`text-2xl font-semibold ${theme.textColors.primary} mb-4`}>2. Description of Service</h2>
            <p className="mb-4">
              Finance Quest is a financial literacy education platform that provides:
            </p>
            <ul className="list-disc pl-6 mb-4 space-y-2">
              <li>Interactive lessons on personal finance topics</li>
              <li>Financial calculators and tools</li>
              <li>AI-powered coaching and Q&A</li>
              <li>Progress tracking and gamification features</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className={`text-2xl font-semibold ${theme.textColors.primary} mb-4`}>3. Educational Purpose Disclaimer</h2>
            <p className="mb-4">
              <strong>Important:</strong> Finance Quest is designed for educational purposes only. The content,
              calculators, and AI coaching provided on this platform:
            </p>
            <ul className="list-disc pl-6 mb-4 space-y-2">
              <li>Do NOT constitute financial, investment, tax, or legal advice</li>
              <li>Should NOT be used as the sole basis for any financial decisions</li>
              <li>Are NOT a substitute for consultation with qualified financial professionals</li>
              <li>May not reflect current market conditions or regulations</li>
            </ul>
            <p className="mb-4">
              Always consult with qualified financial advisors, tax professionals, or legal experts before
              making significant financial decisions.
            </p>
          </section>

          <section className="mb-8">
            <h2 className={`text-2xl font-semibold ${theme.textColors.primary} mb-4`}>4. User Responsibilities</h2>
            <p className="mb-4">As a user of Finance Quest, you agree to:</p>
            <ul className="list-disc pl-6 mb-4 space-y-2">
              <li>Use the platform for lawful educational purposes only</li>
              <li>Not attempt to reverse engineer, hack, or compromise the platform</li>
              <li>Not use the AI features to generate harmful or inappropriate content</li>
              <li>Verify any financial calculations independently before making decisions</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className={`text-2xl font-semibold ${theme.textColors.primary} mb-4`}>5. Calculator Accuracy</h2>
            <p className="mb-4">
              Our financial calculators are designed to provide estimates and educational illustrations. While
              we strive for accuracy:
            </p>
            <ul className="list-disc pl-6 mb-4 space-y-2">
              <li>Results are approximations and may not reflect actual outcomes</li>
              <li>Tax calculations may not account for all deductions, credits, or your specific situation</li>
              <li>Investment projections assume consistent returns, which is unrealistic</li>
              <li>We recommend using professional tools for actual financial planning</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className={`text-2xl font-semibold ${theme.textColors.primary} mb-4`}>6. AI Coaching Limitations</h2>
            <p className="mb-4">
              Our AI coaching feature is powered by large language models and has limitations:
            </p>
            <ul className="list-disc pl-6 mb-4 space-y-2">
              <li>AI responses may contain errors or outdated information</li>
              <li>AI cannot access real-time market data or your actual financial accounts</li>
              <li>AI advice is general and not tailored to your specific circumstances</li>
              <li>AI is not a licensed financial advisor</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className={`text-2xl font-semibold ${theme.textColors.primary} mb-4`}>7. Intellectual Property</h2>
            <p className="mb-4">
              All content on Finance Quest, including lessons, quizzes, calculators, and design elements, is
              protected by copyright and other intellectual property laws. You may not reproduce, distribute,
              or create derivative works without permission.
            </p>
          </section>

          <section className="mb-8">
            <h2 className={`text-2xl font-semibold ${theme.textColors.primary} mb-4`}>8. Limitation of Liability</h2>
            <p className="mb-4">
              To the maximum extent permitted by law, Finance Quest and its creators shall not be liable for
              any direct, indirect, incidental, special, or consequential damages resulting from:
            </p>
            <ul className="list-disc pl-6 mb-4 space-y-2">
              <li>Your use of or inability to use the platform</li>
              <li>Any financial decisions made based on content or calculations</li>
              <li>Errors or inaccuracies in educational content</li>
              <li>AI-generated responses or recommendations</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className={`text-2xl font-semibold ${theme.textColors.primary} mb-4`}>9. Changes to Terms</h2>
            <p className="mb-4">
              We reserve the right to modify these terms at any time. Continued use of the platform after
              changes constitutes acceptance of the new terms.
            </p>
          </section>

          <section className="mb-8">
            <h2 className={`text-2xl font-semibold ${theme.textColors.primary} mb-4`}>10. Governing Law</h2>
            <p className="mb-4">
              These terms shall be governed by and construed in accordance with applicable laws, without
              regard to conflict of law principles.
            </p>
          </section>

          <section className="mb-8">
            <h2 className={`text-2xl font-semibold ${theme.textColors.primary} mb-4`}>11. Contact</h2>
            <p className="mb-4">
              For questions about these Terms of Service, please contact us through our website.
            </p>
          </section>
        </div>

        {/* Footer Links */}
        <div className={`mt-12 pt-8 border-t ${theme.borderColors.primary}`}>
          <div className="flex gap-6">
            <Link href="/privacy" className={`${theme.textColors.secondary} hover:${theme.textColors.primary} transition-colors`}>
              Privacy Policy
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
