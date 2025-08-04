'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { CheckCircle, FileText, Shield, Users, TrendingUp, BookOpen, AlertTriangle, Target, Zap } from 'lucide-react';
import { theme } from '@/lib/theme';

interface EstatePlanningLessonProps {
  onComplete?: () => void;
}

const EstatePlanningLesson: React.FC<EstatePlanningLessonProps> = ({ onComplete }) => {
  const [currentSection, setCurrentSection] = useState(0);

  const sections = [
    'Estate Planning Fundamentals',
    'Trust Structures & Strategies',
    'Tax Planning & Optimization',
    'Wealth Transfer Techniques',
    'Implementation & Best Practices'
  ];

  const handleNext = () => {
    if (currentSection < sections.length - 1) {
      setCurrentSection(currentSection + 1);
    } else {
      onComplete?.();
    }
  };

  const renderSection = () => {
    switch (currentSection) {
      case 0:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div className="text-center mb-8">
              <div className={`inline-flex items-center justify-center w-16 h-16 ${theme.backgrounds.glass} rounded-full border ${theme.borderColors.primary} mb-4`}>
                <FileText className="w-8 h-8 text-purple-400" />
              </div>
              <h2 className={`text-3xl font-bold ${theme.textColors.primary} mb-4`}>
                Estate Planning Fundamentals
              </h2>
              <p className={`text-lg ${theme.textColors.secondary} max-w-2xl mx-auto`}>
                Understanding the essential components of estate planning and why it matters for everyone, not just the wealthy.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className={`${theme.backgrounds.glass} border ${theme.borderColors.primary}`}>
                <CardHeader>
                  <CardTitle className={`${theme.textColors.primary} flex items-center gap-2`}>
                    <FileText className="w-5 h-5 text-blue-400" />
                    Essential Documents
                  </CardTitle>
                </CardHeader>
                <CardContent className={theme.textColors.secondary}>
                  <ul className="space-y-2">
                    <li>• <strong>Will:</strong> Directs asset distribution after death</li>
                    <li>• <strong>Power of Attorney:</strong> Financial decision authority</li>
                    <li>• <strong>Healthcare Directives:</strong> Medical decision instructions</li>
                    <li>• <strong>Beneficiary Designations:</strong> Direct asset transfers</li>
                    <li>• <strong>Guardian Nominations:</strong> Care for minor children</li>
                  </ul>
                </CardContent>
              </Card>

              <Card className={`${theme.backgrounds.glass} border ${theme.borderColors.primary}`}>
                <CardHeader>
                  <CardTitle className={`${theme.textColors.primary} flex items-center gap-2`}>
                    <Target className="w-5 h-5 text-green-400" />
                    Planning Objectives
                  </CardTitle>
                </CardHeader>
                <CardContent className={theme.textColors.secondary}>
                  <ul className="space-y-2">
                    <li>• <strong>Asset Protection:</strong> Safeguard wealth from creditors</li>
                    <li>• <strong>Tax Minimization:</strong> Reduce estate and gift taxes</li>
                    <li>• <strong>Family Security:</strong> Provide for dependents</li>
                    <li>• <strong>Business Continuity:</strong> Ensure smooth transitions</li>
                    <li>• <strong>Charitable Goals:</strong> Support causes you care about</li>
                  </ul>
                </CardContent>
              </Card>
            </div>

            <Card className={`${theme.backgrounds.glass} border border-blue-200/20`}>
              <CardContent className="p-6">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-6 h-6 text-blue-400 mt-1" />
                  <div>
                    <h4 className="text-lg font-semibold text-blue-300 mb-2">Why Estate Planning Matters</h4>
                    <p className={theme.textColors.secondary}>
                      Without proper estate planning, state laws determine how your assets are distributed, 
                      which may not align with your wishes. Additionally, your family may face unnecessary 
                      taxes, delays, and legal complications during an already difficult time.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        );

      case 1:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div className="text-center mb-8">
              <div className={`inline-flex items-center justify-center w-16 h-16 ${theme.backgrounds.glass} rounded-full border ${theme.borderColors.primary} mb-4`}>
                <Shield className="w-8 h-8 text-green-400" />
              </div>
              <h2 className={`text-3xl font-bold ${theme.textColors.primary} mb-4`}>
                Trust Structures & Strategies
              </h2>
              <p className={`text-lg ${theme.textColors.secondary} max-w-2xl mx-auto`}>
                Trusts provide powerful tools for asset protection, tax optimization, and controlled wealth distribution.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className={`${theme.backgrounds.glass} border ${theme.borderColors.primary}`}>
                <CardHeader>
                  <CardTitle className={`${theme.textColors.primary} text-lg`}>
                    Revocable Trusts
                  </CardTitle>
                </CardHeader>
                <CardContent className={theme.textColors.secondary}>
                  <ul className="space-y-2 text-sm">
                    <li>• Avoid probate process</li>
                    <li>• Maintain privacy</li>
                    <li>• Plan for incapacity</li>
                    <li>• Flexible management</li>
                    <li>• No tax benefits</li>
                  </ul>
                </CardContent>
              </Card>

              <Card className={`${theme.backgrounds.glass} border ${theme.borderColors.primary}`}>
                <CardHeader>
                  <CardTitle className={`${theme.textColors.primary} text-lg`}>
                    Irrevocable Trusts
                  </CardTitle>
                </CardHeader>
                <CardContent className={theme.textColors.secondary}>
                  <ul className="space-y-2 text-sm">
                    <li>• Estate tax reduction</li>
                    <li>• Asset protection</li>
                    <li>• Generation-skipping</li>
                    <li>• Charitable planning</li>
                    <li>• Cannot be changed</li>
                  </ul>
                </CardContent>
              </Card>

              <Card className={`${theme.backgrounds.glass} border ${theme.borderColors.primary}`}>
                <CardHeader>
                  <CardTitle className={`${theme.textColors.primary} text-lg`}>
                    Specialized Trusts
                  </CardTitle>
                </CardHeader>
                <CardContent className={theme.textColors.secondary}>
                  <ul className="space-y-2 text-sm">
                    <li>• QTIP trusts (spouses)</li>
                    <li>• GRAT/GRUT trusts</li>
                    <li>• Charitable trusts</li>
                    <li>• Special needs trusts</li>
                    <li>• Dynasty trusts</li>
                  </ul>
                </CardContent>
              </Card>
            </div>

            <Card className={`${theme.backgrounds.glass} border border-green-200/20`}>
              <CardContent className="p-6">
                <div className="flex items-start gap-3">
                  <Shield className="w-6 h-6 text-green-400 mt-1" />
                  <div>
                    <h4 className="text-lg font-semibold text-green-300 mb-2">Trust Benefits</h4>
                    <p className={theme.textColors.secondary}>
                      Trusts allow you to control how and when assets are distributed to beneficiaries, 
                      protect assets from creditors and lawsuits, and potentially reduce estate taxes. 
                      They&apos;re essential tools for multi-generational wealth planning.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        );

      case 2:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div className="text-center mb-8">
              <div className={`inline-flex items-center justify-center w-16 h-16 ${theme.backgrounds.glass} rounded-full border ${theme.borderColors.primary} mb-4`}>
                <TrendingUp className="w-8 h-8 text-purple-400" />
              </div>
              <h2 className={`text-3xl font-bold ${theme.textColors.primary} mb-4`}>
                Tax Planning & Optimization
              </h2>
              <p className={`text-lg ${theme.textColors.secondary} max-w-2xl mx-auto`}>
                Understanding estate and gift tax rules to minimize tax burden and maximize wealth transfer.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className={`${theme.backgrounds.glass} border ${theme.borderColors.primary}`}>
                <CardHeader>
                  <CardTitle className={`${theme.textColors.primary} flex items-center gap-2`}>
                    <TrendingUp className="w-5 h-5 text-purple-400" />
                    2024 Tax Limits
                  </CardTitle>
                </CardHeader>
                <CardContent className={theme.textColors.secondary}>
                  <ul className="space-y-2">
                    <li>• <strong>Estate Tax Exemption:</strong> $13.61 million</li>
                    <li>• <strong>Annual Gift Exclusion:</strong> $18,000 per recipient</li>
                    <li>• <strong>Estate Tax Rate:</strong> 40% above exemption</li>
                    <li>• <strong>GST Tax Exemption:</strong> $13.61 million</li>
                    <li>• <strong>Spousal Portability:</strong> Combine exemptions</li>
                  </ul>
                </CardContent>
              </Card>

              <Card className={`${theme.backgrounds.glass} border ${theme.borderColors.primary}`}>
                <CardHeader>
                  <CardTitle className={`${theme.textColors.primary} flex items-center gap-2`}>
                    <Zap className="w-5 h-5 text-yellow-400" />
                    Tax Strategies
                  </CardTitle>
                </CardHeader>
                <CardContent className={theme.textColors.secondary}>
                  <ul className="space-y-2">
                    <li>• <strong>Annual Gifting:</strong> Use exclusions effectively</li>
                    <li>• <strong>Valuation Discounts:</strong> Family partnerships</li>
                    <li>• <strong>Charitable Giving:</strong> Deductions & legacy</li>
                    <li>• <strong>Generation-Skipping:</strong> Grandchildren transfers</li>
                    <li>• <strong>Grantor Trusts:</strong> Freeze estate values</li>
                  </ul>
                </CardContent>
              </Card>
            </div>

            <Card className={`${theme.backgrounds.glass} border border-purple-200/20`}>
              <CardContent className="p-6">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-6 h-6 text-purple-400 mt-1" />
                  <div>
                    <h4 className="text-lg font-semibold text-purple-300 mb-2">Tax Law Changes Ahead</h4>
                    <p className={theme.textColors.secondary}>
                      The current high estate tax exemption is scheduled to sunset in 2025, potentially 
                      reducing the exemption to around $6.8 million. Consider accelerating wealth 
                      transfer strategies while current exemptions are available.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        );

      case 3:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div className="text-center mb-8">
              <div className={`inline-flex items-center justify-center w-16 h-16 ${theme.backgrounds.glass} rounded-full border ${theme.borderColors.primary} mb-4`}>
                <Users className="w-8 h-8 text-yellow-400" />
              </div>
              <h2 className={`text-3xl font-bold ${theme.textColors.primary} mb-4`}>
                Wealth Transfer Techniques
              </h2>
              <p className={`text-lg ${theme.textColors.secondary} max-w-2xl mx-auto`}>
                Advanced strategies for transferring wealth across generations while minimizing taxes and maximizing impact.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className={`${theme.backgrounds.glass} border ${theme.borderColors.primary}`}>
                <CardHeader>
                  <CardTitle className={`${theme.textColors.primary} flex items-center gap-2`}>
                    <Users className="w-5 h-5 text-yellow-400" />
                    Family Structures
                  </CardTitle>
                </CardHeader>
                <CardContent className={theme.textColors.secondary}>
                  <ul className="space-y-2">
                    <li>• <strong>Family Limited Partnerships:</strong> Valuation discounts</li>
                    <li>• <strong>Family Banks:</strong> Private lending structures</li>
                    <li>• <strong>Dynasty Trusts:</strong> Multi-generational planning</li>
                    <li>• <strong>Family Offices:</strong> Comprehensive management</li>
                    <li>• <strong>Educational Trusts:</strong> Learning & development</li>
                  </ul>
                </CardContent>
              </Card>

              <Card className={`${theme.backgrounds.glass} border ${theme.borderColors.primary}`}>
                <CardHeader>
                  <CardTitle className={`${theme.textColors.primary} flex items-center gap-2`}>
                    <TrendingUp className="w-5 h-5 text-green-400" />
                    Business Succession
                  </CardTitle>
                </CardHeader>
                <CardContent className={theme.textColors.secondary}>
                  <ul className="space-y-2">
                    <li>• <strong>Buy-Sell Agreements:</strong> Succession planning</li>
                    <li>• <strong>ESOPs:</strong> Employee ownership transitions</li>
                    <li>• <strong>Management Buyouts:</strong> Internal transfers</li>
                    <li>• <strong>Strategic Sales:</strong> Third-party acquisitions</li>
                    <li>• <strong>Installment Sales:</strong> Deferred consideration</li>
                  </ul>
                </CardContent>
              </Card>
            </div>

            <Card className={`${theme.backgrounds.glass} border border-yellow-200/20`}>
              <CardContent className="p-6">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-6 h-6 text-yellow-400 mt-1" />
                  <div>
                    <h4 className="text-lg font-semibold text-yellow-300 mb-2">Family Business Statistics</h4>
                    <p className={theme.textColors.secondary}>
                      Only 30% of family businesses survive to the second generation, and just 12% make it 
                      to the third generation. Proper estate and succession planning dramatically improves 
                      these odds by establishing clear governance and transition processes.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        );

      case 4:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div className="text-center mb-8">
              <div className={`inline-flex items-center justify-center w-16 h-16 ${theme.backgrounds.glass} rounded-full border ${theme.borderColors.primary} mb-4`}>
                <CheckCircle className="w-8 h-8 text-green-400" />
              </div>
              <h2 className={`text-3xl font-bold ${theme.textColors.primary} mb-4`}>
                Implementation & Best Practices
              </h2>
              <p className={`text-lg ${theme.textColors.secondary} max-w-2xl mx-auto`}>
                Practical steps for creating and maintaining an effective estate plan that evolves with your life.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className={`${theme.backgrounds.glass} border ${theme.borderColors.primary}`}>
                <CardHeader>
                  <CardTitle className={`${theme.textColors.primary} flex items-center gap-2`}>
                    <BookOpen className="w-5 h-5 text-blue-400" />
                    Getting Started
                  </CardTitle>
                </CardHeader>
                <CardContent className={theme.textColors.secondary}>
                  <ol className="space-y-2 list-decimal list-inside">
                    <li>Inventory all assets and liabilities</li>
                    <li>Define your goals and priorities</li>
                    <li>Assemble your professional team</li>
                    <li>Create basic documents (will, POA)</li>
                    <li>Review beneficiary designations</li>
                    <li>Consider trust structures</li>
                    <li>Implement tax strategies</li>
                  </ol>
                </CardContent>
              </Card>

              <Card className={`${theme.backgrounds.glass} border ${theme.borderColors.primary}`}>
                <CardHeader>
                  <CardTitle className={`${theme.textColors.primary} flex items-center gap-2`}>
                    <Target className="w-5 h-5 text-green-400" />
                    Ongoing Maintenance
                  </CardTitle>
                </CardHeader>
                <CardContent className={theme.textColors.secondary}>
                  <ul className="space-y-2">
                    <li>• <strong>Annual Reviews:</strong> Update as life changes</li>
                    <li>• <strong>Tax Law Changes:</strong> Adapt to new regulations</li>
                    <li>• <strong>Family Communication:</strong> Discuss plans openly</li>
                    <li>• <strong>Asset Retitling:</strong> Fund trusts properly</li>
                    <li>• <strong>Professional Updates:</strong> Keep team informed</li>
                  </ul>
                </CardContent>
              </Card>
            </div>

            <Card className={`${theme.backgrounds.glass} border border-green-200/20`}>
              <CardContent className="p-6">
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-6 h-6 text-green-400 mt-1" />
                  <div>
                    <h4 className="text-lg font-semibold text-green-300 mb-2">Key Takeaways</h4>
                    <p className={theme.textColors.secondary}>
                      Estate planning is an ongoing process, not a one-time event. Start with the basics 
                      and build complexity as your wealth grows. Work with qualified professionals and 
                      communicate your plans with family members to ensure smooth implementation.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Progress Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h1 className={`text-2xl font-bold ${theme.textColors.primary}`}>
            {sections[currentSection]}
          </h1>
          <span className={`text-sm ${theme.textColors.secondary}`}>
            {currentSection + 1} of {sections.length}
          </span>
        </div>
        <Progress value={(currentSection / (sections.length - 1)) * 100} className="mb-2" />
        <p className={`text-sm ${theme.textColors.secondary}`}>
          {Math.round((currentSection / (sections.length - 1)) * 100)}% Complete
        </p>
      </div>

      {/* Section Content */}
      {renderSection()}

      {/* Navigation */}
      <div className="flex justify-between items-center mt-8 pt-6 border-t border-white/10">
        <Button
          variant="outline"
          onClick={() => setCurrentSection(Math.max(0, currentSection - 1))}
          disabled={currentSection === 0}
          className="border-white/20 text-white hover:bg-white/10"
        >
          Previous
        </Button>
        
        <Button
          onClick={handleNext}
          className={currentSection === sections.length - 1 ? 'bg-green-600 hover:bg-green-700' : ''}
        >
          {currentSection === sections.length - 1 ? (
            <>
              <CheckCircle className="w-4 h-4 mr-2" />
              Complete Lesson
            </>
          ) : (
            'Next'
          )}
        </Button>
      </div>
    </div>
  );
};

export default EstatePlanningLesson;
