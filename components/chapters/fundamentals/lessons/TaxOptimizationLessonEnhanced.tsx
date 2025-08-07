'use client';

import { useState } from 'react';
import { useProgressStore } from '@/lib/store/progressStore';
import { theme } from '@/lib/theme';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import {
  TrendingUp,
  Target,
  CheckCircle,
  Lightbulb,
  DollarSign,
  Award,
  AlertTriangle,
  PiggyBank,
  Building2,
  Receipt
} from 'lucide-react';
import toast from 'react-hot-toast';

// Import interactive components
import TaxBracketVisualizerEngine from './TaxBracketVisualizerEngine';
import DeductionMaximizerPro from './DeductionMaximizerPro';
import TaxStrategySimulator from './TaxStrategySimulator';

interface TaxOptimizationLessonProps {
  onComplete?: () => void;
}

interface LessonContent {
  title: string;
  icon: typeof TrendingUp;
  content: string;
  keyPoints: string[];
  practicalAction: string;
  realMoneyExample: string;
  warningTip: string;
  interactiveComponent?: React.ComponentType;
}

const enhancedLessons: LessonContent[] = [
  {
    title: 'Tax-Advantaged Accounts: The Foundation of Tax Planning',
    icon: Building2,
    content: 'Tax-advantaged accounts are your most powerful wealth-building tools. Traditional 401(k)s and IRAs provide immediate tax deductions, reducing current income taxes while building retirement wealth. Roth accounts use after-tax dollars but provide tax-free growth and withdrawals. HSAs offer triple tax advantages: deductible contributions, tax-free growth, and tax-free qualified withdrawals.',
    keyPoints: [
      'Traditional 401(k): Immediate tax deduction, taxed in retirement ($23,500 limit + $7,500 catch-up)',
      'Roth 401(k): After-tax contributions, tax-free retirement withdrawals (same limits)',
      'Traditional IRA: Tax deduction if eligible, $7,000 limit + $1,000 catch-up',
      'Roth IRA: After-tax contributions, tax-free growth ($7,000 limit, income restrictions)',
      'HSA: Triple tax advantage, $4,300 individual/$8,550 family limits'
    ],
    practicalAction: 'Maximize employer 401(k) match first (free money), then HSA if available, then Roth IRA up to limits. Young workers: prioritize Roth accounts for tax-free growth. High earners: use traditional accounts for immediate tax savings. Calculate your tax savings: multiply contribution by marginal tax rate.',
    realMoneyExample: 'Sarah earns $85,000 (22% tax bracket). She contributes $10,000 to traditional 401(k): saves $2,200 in taxes immediately. Her husband maxes Roth IRA at $7,000. After 30 years at 8% returns: 401(k) = $100,000 (taxable), Roth IRA = $70,000 (tax-free). Total tax savings at retirement: $15,400+ on Roth alone.',
    warningTip: "Don't contribute to traditional IRAs if you can't deduct them - you'll pay taxes twice. If your employer offers Roth 401(k), consider it for tax diversification. Never withdraw from retirement accounts early except extreme emergencies - penalties and lost compound growth are devastating.",
    interactiveComponent: TaxBracketVisualizerEngine
  },
  {
    title: 'Strategic Tax Deductions & Credits: Maximizing Your Refund',
    icon: Receipt,
    content: 'Deductions reduce taxable income (saving marginal tax rate %), while credits reduce taxes owed dollar-for-dollar. Standard deduction ($14,600 single/$29,200 married filing jointly) vs itemizing depends on total deductible expenses. Key deductions: mortgage interest, state/local taxes (SALT $10K cap), charitable donations, business expenses.',
    keyPoints: [
      'Credits > Deductions: $1 credit = $1 tax savings vs $1 deduction = marginal rate savings',
      'Child Tax Credit: $2,000 per child under 17, partially refundable',
      'Earned Income Tax Credit: Up to $7,430 for families, phases out with income',
      'Education Credits: American Opportunity ($2,500) and Lifetime Learning ($2,000)',
      'Business deductions: Home office, mileage, equipment, health insurance (self-employed)'
    ],
    practicalAction: 'Track deductible expenses throughout the year: charitable donations, business mileage, medical expenses over 7.5% AGI. If self-employed, maximize business deductions and consider Solo 401(k). Bunch charitable donations in alternate years to exceed standard deduction. Time income and deductions around tax bracket thresholds.',
    realMoneyExample: 'Married couple earns $120,000. Itemized deductions: $15,000 mortgage interest + $10,000 SALT + $8,000 charity = $33,000 vs $29,200 standard deduction. Extra $3,800 deduction saves $836 in 22% bracket. Plus $4,000 Child Tax Credit for two kids. Total tax benefit: $4,836 vs standard deduction.',
    warningTip: "SALT deduction capped at $10,000 - expensive mistake for high earners in high-tax states. Keep receipts for all charitable donations. Don't confuse tax credits with deductions - credits are much more valuable. Audit risk increases with large charitable deductions relative to income.",
    interactiveComponent: DeductionMaximizerPro
  },
  {
    title: 'Tax-Loss Harvesting & Investment Tax Efficiency',
    icon: TrendingUp,
    content: 'Tax-loss harvesting involves selling losing investments to offset gains, reducing taxable income by up to $3,000 annually (excess losses carry forward). Asset location places tax-inefficient investments in tax-advantaged accounts and tax-efficient investments in taxable accounts. Index funds in taxable accounts, bonds and REITs in retirement accounts.',
    keyPoints: [
      "Wash sale rule: Can't buy same/substantially identical security within 30 days",
      'Long-term capital gains: 0%, 15%, or 20% based on income (much lower than ordinary rates)',
      'Tax-efficient funds: Index funds with low turnover minimize taxable distributions',
      'Asset location: Bonds/REITs in tax-advantaged, stocks in taxable accounts',
      'Tax-managed funds: Designed to minimize taxable distributions for wealthy investors'
    ],
    practicalAction: 'Review taxable investment accounts in November for tax-loss harvesting opportunities. Sell losing positions to offset any realized gains. If no gains, harvest up to $3,000 losses against ordinary income. Buy similar (not identical) investments to maintain market exposure. Use ETFs over mutual funds in taxable accounts for tax efficiency.',
    realMoneyExample: 'Investor realizes $20,000 capital gains from stock sale. Harvests $15,000 in losses from underperforming funds. Net taxable gain: $5,000 instead of $20,000. In 22% bracket with 15% capital gains rate: saves $2,250 in taxes ($15,000 × 15%). Uses losses to offset future gains or $3,000 annually against ordinary income.',
    warningTip: "Wash sale rule violations disallow loss deduction - wait 31 days or buy different asset class. Don't let tax tail wag investment dog - never hold bad investments just for tax losses. Frequent trading for tax benefits can trigger day trader status and ordinary income treatment."
  },
  {
    title: 'Business & Side Hustle Tax Strategies',
    icon: Building2,
    content: 'Business income offers powerful tax deductions unavailable to employees. Legitimate business expenses reduce taxable income: equipment, supplies, marketing, travel, home office. Self-employed can deduct health insurance premiums and contribute to Solo 401(k) with higher limits. Consider LLC or S-Corp election for tax optimization.',
    keyPoints: [
      'Home office deduction: Simplified ($5/sq ft up to $1,500) or actual expense method',
      'Business mileage: $0.655 per business mile (2023 rate), keep detailed logs',
      'Solo 401(k): Contribute as employee ($23,500) plus employer (25% of compensation)',
      'Health insurance: 100% deductible for self-employed individuals',
      'Equipment purchases: Section 179 allows immediate expensing up to $1.16M'
    ],
    practicalAction: 'Track all business expenses meticulously with receipts and documentation. Use separate business bank account and credit card. Consider Solo 401(k) if self-employed - higher contribution limits than regular IRA. If profitable side business, explore S-Corp election to save self-employment taxes on distributions.',
    realMoneyExample: 'Freelance consultant earns $60,000. Business deductions: $5,000 equipment + $3,000 home office + $2,000 travel + $4,000 health insurance = $14,000. Taxable income: $46,000 vs $60,000. Tax savings in 22% bracket: $3,080. Plus self-employment tax savings on deductions: additional $2,142 (15.3% × $14,000).',
    warningTip: "Business must be profitable in 3 of 5 years or IRS may classify as hobby, disallowing deductions. Keep detailed records - IRS scrutinizes home office and business travel deductions. Don't deduct personal expenses as business costs - potential fraud charges and penalties."
  },
  {
    title: 'Advanced Tax Planning: Timing & Strategic Moves',
    icon: Target,
    content: 'Advanced tax planning involves timing income and deductions to optimize tax brackets. Bunching deductions into alternating years can exceed standard deduction thresholds. Income timing around retirement, marriage, or business sale can save thousands. Consider Roth conversions in low-income years to fill lower tax brackets.',
    keyPoints: [
      'Bunching strategy: Accelerate or delay deductible expenses to optimize timing',
      'Roth conversions: Convert traditional IRA to Roth during low-income years',
      'Income timing: Delay bonuses or accelerate business income based on tax brackets',
      'Qualified Small Business Stock: Up to $10M gain exclusion for startup investments',
      'Charitable Remainder Trusts: Donate appreciated assets, receive income stream'
    ],
    practicalAction: "Project next year's income and tax bracket. If expecting lower income year, consider Roth conversions to fill lower brackets. Bunch charitable donations and medical expenses in alternating years. Time large asset sales around low-income periods or use installment sales to spread gains.",
    realMoneyExample: 'Early retiree has $30,000 annual expenses, $20,000 in taxable income. Converts $44,000 traditional IRA to Roth (fills 12% bracket to $94,300 married filing jointly). Pays $5,280 in taxes now vs 22-24% in later retirement. Over 20 years, saves $15,000+ in taxes on tax-free Roth growth.',
    warningTip: "Roth conversions increase current year taxes - ensure you have cash to pay without touching retirement funds. Don't convert too much and push into higher brackets. Complex strategies like CRTs require professional advice and significant assets to justify costs."
  },
  {
    title: 'Tax Planning Integration: Building Wealth-Maximizing Systems',
    icon: Award,
    content: 'Effective tax planning integrates with overall financial strategy. Tax savings should be invested, not spent, to compound wealth building. Coordinate tax planning with retirement planning, estate planning, and investment allocation. Regular tax planning reviews ensure strategies remain optimal as life circumstances change.',
    keyPoints: [
      'Tax alpha: Additional returns from tax-efficient investing and planning strategies',
      'Multi-year planning: Optimize taxes across multiple years, not just current year',
      'Professional guidance: Complex situations benefit from CPA or tax attorney advice',
      'State tax planning: Consider state income tax rates for retirement location decisions',
      'Estate tax planning: Use annual exclusion gifts and lifetime exemption strategically'
    ],
    practicalAction: 'Conduct annual tax planning review by October to implement year-end strategies. Coordinate with financial advisor and CPA for comprehensive planning. Use tax software or professional for complex situations. Reinvest tax savings into investment accounts to accelerate wealth building.',
    realMoneyExample: 'High-earning couple ($300K) implements comprehensive tax strategy: Max 401(k)s ($46,000), HSA ($8,300), tax-loss harvesting ($3,000), charitable bunching ($20,000 vs $10,000 annually). Total tax savings: $24,000 annually in 32% bracket. Invested over 20 years at 8%: $1.17M additional wealth from tax optimization alone.',
    warningTip: "Tax laws change frequently - strategies legal today may not be tomorrow. Don't be penny-wise and pound-foolish: spending $5,000 on planning to save $500 doesn't make sense. Focus on highest-impact strategies first: retirement accounts, employer match, and basic deductions before complex strategies.",
    interactiveComponent: TaxStrategySimulator
  }
];

export default function TaxOptimizationLessonEnhanced({ onComplete }: TaxOptimizationLessonProps) {
  const [currentLesson, setCurrentLesson] = useState(0);
  const [completedLessons, setCompletedLessons] = useState<boolean[]>(new Array(6).fill(false));
  const [startTime] = useState(new Date());

  const { completeLesson } = useProgressStore();

  const handleLessonComplete = (lessonIndex: number) => {
    const newCompleted = [...completedLessons];
    newCompleted[lessonIndex] = true;
    setCompletedLessons(newCompleted);

    // If this is the last lesson and all are completed
    if (lessonIndex === enhancedLessons.length - 1 && newCompleted.every(Boolean)) {
      const totalTime = Math.round((new Date().getTime() - startTime.getTime()) / 1000 / 60);
      completeLesson('chapter10-tax-optimization-lesson', totalTime);

      if (onComplete) {
        onComplete();
      }

      toast.success('Tax optimization mastery achieved! 🎯', {
        duration: 4000,
        position: 'top-center',
      });
    } else {
      toast.success('Lesson completed! Continue learning.', {
        duration: 2000,
        position: 'top-center',
      });
    }
  };

  const currentLessonContent = enhancedLessons[currentLesson];
  const Icon = currentLessonContent.icon;
  const progress = ((currentLesson + 1) / enhancedLessons.length) * 100;
  const completedCount = completedLessons.filter(Boolean).length;

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="text-center mb-8">
        <div className={`w-16 h-16 ${theme.status.info.bg} rounded-2xl flex items-center justify-center mx-auto mb-4`}>
          <Icon className={`w-8 h-8 ${theme.status.info.text}`} />
        </div>
        <h1 className={`text-3xl font-bold ${theme.textColors.primary} mb-2`}>
          Tax Optimization & Strategic Planning
        </h1>
        <p className={`${theme.textColors.secondary} max-w-2xl mx-auto`}>
          Master tax-advantaged accounts, deductions, and strategic planning to minimize taxes and maximize wealth building.
        </p>
      </div>

      {/* Progress Overview */}
      <div className={`${theme.backgrounds.card} border ${theme.borderColors.primary} rounded-xl p-6 mb-8`}>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className={`text-xl font-semibold ${theme.textColors.primary}`}>
              {currentLessonContent.title}
            </h2>
            <p className={`text-sm ${theme.textColors.muted}`}>
              Lesson {currentLesson + 1} of {enhancedLessons.length}
            </p>
          </div>
          {completedLessons[currentLesson] && (
            <div className={`w-10 h-10 ${theme.status.success.bg} rounded-full flex items-center justify-center`}>
              <CheckCircle className={`w-6 h-6 ${theme.status.success.text}`} />
            </div>
          )}
        </div>

        {/* Progress Bar */}
        <div className={`w-full bg-slate-800/50 rounded-full h-2 mb-8`}>
          <div
            className={`h-2 ${theme.status.success.bg} rounded-full transition-all duration-500`}
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Lesson Content */}
        <div className="space-y-6">
          <div>
            <h3 className={`text-lg font-semibold ${theme.textColors.primary} mb-3 flex items-center`}>
              <Lightbulb className={`w-5 h-5 ${theme.status.info.text} mr-2`} />
              Core Concept
            </h3>
            <p className={`${theme.textColors.secondary} leading-relaxed`}>
              {currentLessonContent.content}
            </p>
          </div>

          {/* Interactive Component */}
          {currentLessonContent.interactiveComponent && (
            <div className="my-8">
              <div className={`${theme.backgrounds.glass} border ${theme.borderColors.primary} rounded-xl p-1 mb-4`}>
                <div className="flex items-center justify-center py-3">
                  <div className={`w-8 h-8 ${theme.status.info.bg} rounded-lg flex items-center justify-center mr-3`}>
                    <Icon className={`w-4 h-4 ${theme.status.info.text}`} />
                  </div>
                  <h4 className={`text-lg font-semibold ${theme.textColors.primary}`}>
                    Interactive Learning Tool
                  </h4>
                </div>
              </div>
              <currentLessonContent.interactiveComponent />
            </div>
          )}

          <div>
            <h3 className={`text-lg font-semibold ${theme.textColors.primary} mb-3 flex items-center`}>
              <Target className={`w-5 h-5 ${theme.status.warning.text} mr-2`} />
              Key Points
            </h3>
            <ul className={`space-y-2 ${theme.textColors.secondary}`}>
              {currentLessonContent.keyPoints.map((point, index) => (
                <li key={index} className="flex items-start">
                  <CheckCircle className={`w-4 h-4 ${theme.status.success.text} mr-2 mt-0.5 flex-shrink-0`} />
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className={`${theme.status.info.bg}/10 border ${theme.status.info.border} p-4 rounded-lg`}>
            <h3 className={`text-lg font-semibold ${theme.textColors.primary} mb-3 flex items-center`}>
              <PiggyBank className={`w-5 h-5 ${theme.status.info.text} mr-2`} />
              Practical Action
            </h3>
            <p className={`${theme.textColors.secondary} leading-relaxed`}>
              {currentLessonContent.practicalAction}
            </p>
          </div>

          <div className={`${theme.status.success.bg}/10 border ${theme.status.success.border} p-4 rounded-lg`}>
            <h3 className={`text-lg font-semibold ${theme.textColors.primary} mb-3 flex items-center`}>
              <DollarSign className={`w-5 h-5 ${theme.status.success.text} mr-2`} />
              Real Money Example
            </h3>
            <p className={`${theme.textColors.secondary} leading-relaxed`}>
              {currentLessonContent.realMoneyExample}
            </p>
          </div>

          {/* Interactive Component */}
          {currentLessonContent.interactiveComponent && (
            <div className="mt-8">
              <div className={`mb-4 p-4 ${theme.status.info.bg}/10 border ${theme.status.info.border} rounded-lg`}>
                <h3 className={`text-lg font-semibold ${theme.textColors.primary} mb-2 flex items-center`}>
                  <Target className={`w-5 h-5 ${theme.status.info.text} mr-2`} />
                  Interactive Learning Tool
                </h3>
                <p className={`text-sm ${theme.textColors.secondary}`}>
                  Practice the concepts you just learned with this hands-on tool. Experiment with different scenarios to deepen your understanding.
                </p>
              </div>
              <currentLessonContent.interactiveComponent />
            </div>
          )}

          <div className={`${theme.status.warning.bg}/10 border ${theme.status.warning.border} p-4 rounded-lg`}>
            <h3 className={`text-lg font-semibold ${theme.textColors.primary} mb-3 flex items-center`}>
              <AlertTriangle className={`w-5 h-5 ${theme.status.warning.text} mr-2`} />
              Warning
            </h3>
            <p className={`${theme.textColors.secondary} leading-relaxed`}>
              {currentLessonContent.warningTip}
            </p>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex justify-between items-center mt-8 pt-6 border-t border-slate-700">
          <Button
            variant="outline"
            onClick={() => setCurrentLesson(Math.max(0, currentLesson - 1))}
            disabled={currentLesson === 0}
            className="flex items-center gap-2"
          >
            Previous Lesson
          </Button>

          <div className="flex items-center space-x-4">
            {!completedLessons[currentLesson] && (
              <Button
                onClick={() => handleLessonComplete(currentLesson)}
                className={`${theme.buttons.primary} flex items-center gap-2`}
              >
                <CheckCircle className="w-4 h-4" />
                Complete Lesson
              </Button>
            )}

            <Button
              variant="outline"
              onClick={() => setCurrentLesson(Math.min(enhancedLessons.length - 1, currentLesson + 1))}
              disabled={currentLesson === enhancedLessons.length - 1}
              className="flex items-center gap-2"
            >
              Next Lesson
            </Button>
          </div>
        </div>
      </div>

      {/* Completion Status */}
      {completedCount === enhancedLessons.length && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className={`${theme.backgrounds.glass} border ${theme.borderColors.primary} rounded-xl p-8 text-center`}
        >
          <Award className={`w-16 h-16 ${theme.status.success.text} mx-auto mb-4`} />
          <h3 className={`text-2xl font-bold ${theme.textColors.primary} mb-2`}>
            Congratulations! 🎉
          </h3>
          <p className={`${theme.textColors.secondary} max-w-md mx-auto`}>
            You&apos;ve mastered tax optimization and strategic planning. You now understand how to minimize taxes and maximize wealth building through smart tax strategies.
          </p>
        </motion.div>
      )}
    </div>
  );
}
