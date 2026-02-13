'use client';

import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { theme } from '@/lib/theme';

export default function PrivacyPolicyPage() {
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
        <h1 className={`text-4xl font-bold ${theme.textColors.primary} mb-8`}>Privacy Policy</h1>
        <p className={`${theme.textColors.secondary} mb-8`}>Last updated: February 2026</p>

        <div className={`prose prose-invert max-w-none ${theme.textColors.secondary}`}>
          <section className="mb-8">
            <h2 className={`text-2xl font-semibold ${theme.textColors.primary} mb-4`}>1. Introduction</h2>
            <p className="mb-4">
              Welcome to Finance Quest. We respect your privacy and are committed to protecting your personal data.
              This privacy policy explains how we collect, use, and safeguard your information when you use our
              financial literacy platform.
            </p>
          </section>

          <section className="mb-8">
            <h2 className={`text-2xl font-semibold ${theme.textColors.primary} mb-4`}>2. Information We Collect</h2>
            <p className="mb-4">We collect and process the following types of information:</p>
            <ul className="list-disc pl-6 mb-4 space-y-2">
              <li><strong>Learning Progress:</strong> Your lesson completions, quiz scores, and educational achievements stored locally in your browser</li>
              <li><strong>Calculator Inputs:</strong> Financial data you enter into our calculators (processed locally, not stored on our servers)</li>
              <li><strong>Usage Analytics:</strong> Anonymous usage patterns to improve our platform</li>
              <li><strong>AI Interactions:</strong> Questions you ask our AI coaching system to provide personalized responses</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className={`text-2xl font-semibold ${theme.textColors.primary} mb-4`}>3. How We Use Your Information</h2>
            <p className="mb-4">We use your information to:</p>
            <ul className="list-disc pl-6 mb-4 space-y-2">
              <li>Track and display your learning progress</li>
              <li>Provide personalized AI coaching recommendations</li>
              <li>Improve our educational content and tools</li>
              <li>Maintain and optimize platform performance</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className={`text-2xl font-semibold ${theme.textColors.primary} mb-4`}>4. Data Storage</h2>
            <p className="mb-4">
              Your learning progress is stored locally in your browser using localStorage. This means your data
              stays on your device and is not transmitted to our servers. Calculator inputs are processed
              client-side and are not stored or transmitted.
            </p>
          </section>

          <section className="mb-8">
            <h2 className={`text-2xl font-semibold ${theme.textColors.primary} mb-4`}>5. Third-Party Services</h2>
            <p className="mb-4">We use the following third-party services:</p>
            <ul className="list-disc pl-6 mb-4 space-y-2">
              <li><strong>OpenAI:</strong> Powers our AI coaching features. Questions you ask are sent to OpenAI for processing.</li>
              <li><strong>Vercel:</strong> Hosts our platform and provides analytics</li>
            </ul>
            <p className="mb-4">
              We recommend reviewing the privacy policies of these services for more information about how they
              handle data.
            </p>
          </section>

          <section className="mb-8">
            <h2 className={`text-2xl font-semibold ${theme.textColors.primary} mb-4`}>6. Your Rights</h2>
            <p className="mb-4">You have the right to:</p>
            <ul className="list-disc pl-6 mb-4 space-y-2">
              <li>Clear your local learning progress data at any time through your browser settings</li>
              <li>Choose not to use AI coaching features</li>
              <li>Request information about what data we have collected</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className={`text-2xl font-semibold ${theme.textColors.primary} mb-4`}>7. Cookies</h2>
            <p className="mb-4">
              We use essential cookies to ensure the platform functions correctly. We do not use advertising
              or tracking cookies.
            </p>
          </section>

          <section className="mb-8">
            <h2 className={`text-2xl font-semibold ${theme.textColors.primary} mb-4`}>8. Children&apos;s Privacy</h2>
            <p className="mb-4">
              Finance Quest is designed for users of all ages interested in learning about personal finance.
              We do not knowingly collect personal information from children under 13 without parental consent.
            </p>
          </section>

          <section className="mb-8">
            <h2 className={`text-2xl font-semibold ${theme.textColors.primary} mb-4`}>9. Changes to This Policy</h2>
            <p className="mb-4">
              We may update this privacy policy from time to time. We will notify you of any changes by posting
              the new policy on this page and updating the &quot;Last updated&quot; date.
            </p>
          </section>

          <section className="mb-8">
            <h2 className={`text-2xl font-semibold ${theme.textColors.primary} mb-4`}>10. Contact Us</h2>
            <p className="mb-4">
              If you have any questions about this privacy policy, please contact us through our website.
            </p>
          </section>
        </div>

        {/* Footer Links */}
        <div className={`mt-12 pt-8 border-t ${theme.borderColors.primary}`}>
          <div className="flex gap-6">
            <Link href="/terms" className={`${theme.textColors.secondary} hover:${theme.textColors.primary} transition-colors`}>
              Terms of Service
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
