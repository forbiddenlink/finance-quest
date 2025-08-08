'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { theme } from '@/lib/theme';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import {
  Shield,
  Heart,
  Home,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  ChevronRight,
  ChevronLeft,
  BookOpen,
  Building,
  Calculator,
  Clock
} from 'lucide-react';

interface InsuranceRiskManagementLessonEnhancedProps {
  onComplete?: () => void;
}

export default function InsuranceRiskManagementLessonEnhanced({ onComplete }: InsuranceRiskManagementLessonEnhancedProps) {
  const [currentLesson, setCurrentLesson] = useState(0);
  const [completedLessons, setCompletedLessons] = useState<boolean[]>(new Array(6).fill(false));
  const [timeSpent, setTimeSpent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeSpent(prev => prev + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const lessons = [
    {
      id: 1,
      title: 'Life Insurance Fundamentals',
      icon: Heart,
      duration: '8 min',
      content: {
        overview: 'Master the essential types of life insurance and determine your optimal coverage needs.',
        keyPoints: [
          'Term vs. permanent life insurance differences',
          'Coverage amount calculation methods',
          'Beneficiary designation strategies',
          'Policy riders and additional benefits',
          'Cost factors and premium optimization'
        ],
        sections: [
          {
            title: 'Types of Life Insurance',
            content: `Life insurance comes in two main categories:

**Term Life Insurance:**
• Temporary coverage for specific period (10, 20, or 30 years)
• Lower premiums, no cash value
• Ideal for income replacement during working years
• Best for young families with mortgages and dependents

**Permanent Life Insurance:**
• Whole life, universal, and variable life policies
• Higher premiums but builds cash value
• Lifetime coverage with investment component
• Useful for estate planning and tax strategies

**Choosing the Right Type:**
Most financial experts recommend term life for income replacement and investing the premium difference in retirement accounts.`
          },
          {
            title: 'Coverage Amount Calculation',
            content: `Determine your life insurance needs using these methods:

**10x Annual Income Rule:**
• Quick estimate: 10 times your annual salary
• Simple but may not account for specific needs

**DIME Method (Debt, Income, Mortgage, Education):**
• Add up all debts to be paid off
• Calculate income replacement (5-10 years)
• Include remaining mortgage balance
• Factor in children&apos;s education costs

**Human Life Value Approach:**
• Calculate present value of future earnings
• Subtract personal consumption
• Consider career growth and inflation

**Example Calculation:**
For $60,000 annual income, 30-year-old with mortgage:
• Debt payoff: $250,000 (mortgage)
• Income replacement: $600,000 (10x salary)
• Total need: $850,000 coverage`
          },
          {
            title: 'Policy Features and Riders',
            content: `Enhance your life insurance with additional benefits:

**Common Policy Riders:**
• **Accelerated Death Benefit:** Access funds if terminally ill
• **Waiver of Premium:** Continue coverage if disabled
• **Term Conversion:** Convert term to permanent without exam
• **Child Protection:** Coverage for children
• **Accidental Death:** Double benefits for accidental death

**Beneficiary Considerations:**
• Primary and contingent beneficiaries
• Specific percentages or dollar amounts
• Trust as beneficiary for estate planning
• Regular reviews after major life events

**Cost Optimization Strategies:**
• Annual premium payments (vs. monthly)
• Excellent health ratings through medical exams
• Non-smoker discounts
• Group life insurance through employers`
          }
        ],
        practicalExample: {
          title: 'Life Insurance Planning Example',
          scenario: 'Sarah, 32, married with two young children, $75,000 salary, $300,000 mortgage',
          calculation: `**Coverage Need Analysis:**
• Mortgage payoff: $300,000
• Income replacement (10 years): $750,000
• Children&apos;s education fund: $100,000
• Final expenses: $25,000
• **Total Coverage Needed: $1,175,000**

**Policy Recommendation:**
• $1.2 million 20-year term life policy
• Estimated premium: $600-900 annually
• Add waiver of premium rider
• Review in 5 years or after major life changes`,
          keyTakeaway: 'Term life insurance provides maximum coverage at lowest cost during peak earning years when dependents need protection most.'
        }
      }
    },
    {
      id: 2,
      title: 'Health & Disability Insurance',
      icon: Shield,
      duration: '10 min',
      content: {
        overview: 'Protect your earning capacity and manage healthcare costs through comprehensive health and disability coverage.',
        keyPoints: [
          'Health insurance plan types and selection',
          'Short-term vs. long-term disability insurance',
          'Own occupation vs. any occupation coverage',
          'Social Security disability limitations',
          'Employer benefits optimization'
        ],
        sections: [
          {
            title: 'Health Insurance Essentials',
            content: `Navigate health insurance options effectively:

**Plan Types:**
• **HMO (Health Maintenance Organization):** Lower costs, network restrictions
• **PPO (Preferred Provider Organization):** Flexibility, higher costs
• **HDHP (High-Deductible Health Plan):** Lower premiums, HSA eligibility
• **EPO (Exclusive Provider Organization):** No referrals, network only

**Key Terms to Understand:**
• **Deductible:** Amount you pay before insurance kicks in
• **Copay:** Fixed amount for services
• **Coinsurance:** Percentage you pay after deductible
• **Out-of-pocket maximum:** Annual limit on your expenses

**HSA Benefits (with HDHP):**
• Triple tax advantage (deduct, grow, withdraw tax-free)
• $4,300 individual / $8,550 family contribution limits (2024)
• Funds roll over annually
• Investment options for long-term growth`
          },
          {
            title: 'Disability Insurance Protection',
            content: `Protect your most valuable asset - your ability to earn income:

**Why Disability Insurance Matters:**
• 1 in 4 workers will experience disability before retirement
• Social Security disability is limited and hard to qualify
• Most people have no plan for income replacement

**Short-Term Disability:**
• Covers 3-12 months of disability
• Typically 60-70% of income replacement
• Often provided by employers
• Covers pregnancy, surgeries, injuries

**Long-Term Disability:**
• Covers disabilities lasting longer than 90 days
• Essential for protecting career earnings
• Should replace 60-70% of income
• Can last until retirement age

**Own Occupation vs. Any Occupation:**
• **Own Occupation:** Can&apos;t perform your specific job
• **Any Occupation:** Can&apos;t perform any job suitable for education/experience
• Own occupation provides better protection but costs more`
          },
          {
            title: 'Coverage Strategy and Optimization',
            content: `Maximize your health and disability protection:

**Employer Benefits Analysis:**
• Review group health plan options annually
• Maximize employer contributions to HSA
• Understand group disability coverage limitations
• Consider supplemental individual policies

**Individual Policy Advantages:**
• Portable coverage between jobs
• Own occupation definitions available
• Tax-free benefits (if premiums paid with after-tax dollars)
• Guaranteed renewability

**Cost-Effective Strategies:**
• Longer elimination periods reduce premiums
• Exclude Social Security integration for better benefits
• Add cost-of-living adjustments for inflation protection
• Consider residual benefits for partial disabilities

**Integration with Emergency Fund:**
• Disability insurance works with emergency savings
• Longer elimination periods require larger emergency funds
• Consider 3-6 month emergency fund minimum`
          }
        ],
        practicalExample: {
          title: 'Disability Insurance Planning',
          scenario: 'Mike, 35, software engineer, $95,000 salary, employer provides basic group disability',
          calculation: `**Income Protection Gap Analysis:**
• Monthly income: $7,917
• Group LTD benefit: $4,750 (60% of income)
• Social Security estimate: $2,200
• Total coverage: $6,950 (88% replacement)

**Recommendation:**
• Supplement with individual policy: $1,500/month
• Own occupation definition for first 2 years
• 90-day elimination period
• Cost-of-living adjustment rider
• **Estimated premium: $125-175/month**`,
          keyTakeaway: 'Disability insurance is crucial for high earners whose standard of living depends on continued income production.'
        }
      }
    },
    {
      id: 3,
      title: 'Property & Casualty Insurance',
      icon: Home,
      duration: '9 min',
      content: {
        overview: 'Protect your assets and limit liability exposure through comprehensive property and casualty insurance coverage.',
        keyPoints: [
          'Homeowners and renters insurance essentials',
          'Auto insurance coverage types and limits',
          'Umbrella insurance for liability protection',
          'Personal property valuation strategies',
          'Claims process and documentation'
        ],
        sections: [
          {
            title: 'Homeowners & Renters Insurance',
            content: `Protect your home and belongings effectively:

**Homeowners Insurance Coverage:**
• **Dwelling Coverage (HO-1 to HO-8):** Structure protection
• **Personal Property:** Contents and belongings
• **Liability Protection:** Legal claims against you
• **Additional Living Expenses:** Temporary housing costs

**Key Coverage Decisions:**
• **Replacement Cost vs. Actual Cash Value:** Pay more for replacement cost
• **Coverage Limits:** Insure home for full replacement cost, not market value
• **Deductible Selection:** Higher deductibles = lower premiums

**Renters Insurance Benefits:**
• Personal property protection
• Liability coverage for accidents
• Additional living expenses
• Very affordable ($100-300 annually)

**Common Exclusions:**
• Floods (separate flood insurance needed)
• Earthquakes (separate coverage required)
• Business property (need separate policy)
• High-value items (need scheduled coverage)`
          },
          {
            title: 'Auto Insurance Optimization',
            content: `Structure comprehensive auto protection:

**Required Coverage Types:**
• **Liability Insurance:** Bodily injury and property damage to others
• **Personal Injury Protection (PIP):** Your medical expenses
• **Uninsured/Underinsured Motorist:** Protection from inadequate coverage

**Optional but Important Coverage:**
• **Collision:** Damage to your vehicle from accidents
• **Comprehensive:** Theft, vandalism, natural disasters
• **Gap Insurance:** Covers loan balance vs. vehicle value

**Coverage Limit Recommendations:**
• Liability: $100,000/$300,000/$100,000 minimum
• Consider $250,000/$500,000/$100,000 for better protection
• Match uninsured motorist to liability limits

**Cost Reduction Strategies:**
• Multi-policy discounts (bundle with home/renters)
• Good driver discounts
• Defensive driving course credits
• Higher deductibles on collision/comprehensive
• Usage-based insurance programs`
          },
          {
            title: 'Umbrella Insurance Protection',
            content: `Extend liability protection beyond basic policies:

**Why Umbrella Insurance Matters:**
• Protects against catastrophic liability claims
• Covers gaps in underlying policies
• Provides worldwide coverage
• Relatively inexpensive for high protection

**Coverage Features:**
• $1-5 million typical coverage amounts
• Sits above auto and homeowners liability
• Covers legal defense costs
• Protects personal assets from lawsuits

**Who Needs Umbrella Insurance:**
• High net worth individuals
• Professionals with lawsuit risk
• Anyone with significant assets to protect
• Parents of teenage drivers

**Cost Considerations:**
• $1 million coverage: $200-400 annually
• Requires underlying liability minimums
• Multi-million coverage available
• Excellent value for asset protection

**Common Umbrella Exclusions:**
• Business activities
• Professional liability
• Intentional acts
• Criminal activity`
          }
        ],
        practicalExample: {
          title: 'Property Insurance Portfolio',
          scenario: 'Jennifer, homeowner with $400,000 house, two cars, $150,000 savings',
          calculation: `**Insurance Portfolio Analysis:**
• Home replacement cost: $400,000 (not market value)
• Personal property: $200,000 (50% of dwelling)
• Auto liability: $250,000/$500,000/$100,000
• Umbrella: $1 million over underlying policies

**Annual Premium Estimate:**
• Homeowners: $1,200-1,800
• Auto (2 vehicles): $1,500-2,500
• Umbrella: $300-400
• **Total: $3,000-4,700 annually**`,
          keyTakeaway: 'Comprehensive property insurance protects your largest assets while umbrella coverage shields against catastrophic liability claims.'
        }
      }
    },
    {
      id: 4,
      title: 'Business & Professional Insurance',
      icon: Building,
      duration: '8 min',
      content: {
        overview: 'Navigate business insurance requirements and professional liability protection for entrepreneurs and professionals.',
        keyPoints: [
          'General liability and professional liability differences',
          'Errors and omissions insurance essentials',
          'Key person and business interruption insurance',
          'Workers compensation requirements',
          'Cyber liability and data breach protection'
        ],
        sections: [
          {
            title: 'Professional Liability Protection',
            content: `Protect your professional practice and reputation:

**Professional Liability (E&O) Insurance:**
• Covers claims of professional negligence
• Protects against errors, omissions, and missed deadlines
• Essential for consultants, lawyers, doctors, accountants
• Covers legal defense costs even for frivolous claims

**Key Features:**
• **Occurrence vs. Claims-Made:** When coverage applies
• **Retroactive Date:** Coverage for prior work
• **Extended Reporting Period:** Coverage after policy ends
• **Prior Acts Coverage:** Protection for previous work

**Industry-Specific Considerations:**
• **Healthcare:** Medical malpractice with high limits
• **Technology:** Cyber liability and data breach coverage
• **Finance:** Securities violations and fiduciary liability
• **Real Estate:** Transaction errors and disclosure issues

**Coverage Limits and Costs:**
• $1-2 million per claim typical
• Annual premiums: $1,000-10,000+ depending on risk
• Higher limits available for high-risk professions
• Group coverage through professional associations`
          },
          {
            title: 'General Business Insurance',
            content: `Foundation coverage for business operations:

**General Liability Insurance:**
• Third-party bodily injury and property damage
• Product liability and completed operations
• Personal and advertising injury claims
• Essential for any business with public interaction

**Commercial Property Insurance:**
• Building and equipment protection
• Business personal property coverage
• Loss of income from covered perils
• Extra expense coverage for temporary operations

**Workers Compensation:**
• Required by law in most states
• Medical expenses for work-related injuries
• Disability benefits for injured workers
• Protection against employee lawsuits

**Business Interruption Coverage:**
• Lost income from covered business suspension
• Extra expenses to maintain operations
• Extended period of indemnity
• Civil authority and contingent coverage`
          },
          {
            title: 'Modern Business Risk Management',
            content: `Address contemporary business insurance needs:

**Cyber Liability Insurance:**
• Data breach response and notification costs
• Cyber extortion and ransomware coverage
• Business interruption from cyber attacks
• Third-party liability for data compromises

**Key Person Insurance:**
• Life insurance on critical employees
• Protects business from key person loss
• Funds for recruitment and training replacement
• Can be owned by business or individual

**Employment Practices Liability:**
• Protection against wrongful termination claims
• Sexual harassment and discrimination coverage
• Wage and hour dispute protection
• Workplace violation allegations

**Directors and Officers (D&O):**
• Personal liability protection for leadership
• Corporate reimbursement coverage
• Entity coverage for the organization
• Essential for nonprofits and corporations

**Commercial Auto Insurance:**
• Vehicle fleet protection
• Hired and non-owned auto coverage
• Commercial use distinctions
• Higher liability limits than personal auto`
          }
        ],
        practicalExample: {
          title: 'Small Business Insurance Program',
          scenario: 'Mark&apos;s consulting firm, 5 employees, $500,000 annual revenue, technology focus',
          calculation: `**Business Insurance Portfolio:**
• General Liability: $1M/$2M limits
• Professional Liability: $1M per claim, $3M aggregate
• Cyber Liability: $1M with breach response
• Commercial Property: $100,000 equipment/contents
• Workers Compensation: Required coverage
• Business Auto: $1M liability

**Annual Premium Estimate:**
• General Liability: $800-1,200
• Professional Liability: $2,500-4,000
• Cyber Liability: $1,500-2,500
• Other Coverages: $2,000-3,000
• **Total: $6,800-10,700 annually**`,
          keyTakeaway: 'Business insurance protects both company assets and personal wealth of business owners from operational risks and liability claims.'
        }
      }
    },
    {
      id: 5,
      title: 'Risk Assessment & Management',
      icon: AlertTriangle,
      duration: '9 min',
      content: {
        overview: 'Develop systematic approaches to identify, evaluate, and manage personal and financial risks throughout your life.',
        keyPoints: [
          'Personal risk assessment methodology',
          'Risk tolerance vs. risk capacity differences',
          'Self-insurance vs. insurance decisions',
          'Risk management hierarchy strategies',
          'Life stage risk adaptation'
        ],
        sections: [
          {
            title: 'Risk Identification and Assessment',
            content: `Systematically evaluate your risk exposure:

**Personal Risk Categories:**
• **Income Risks:** Job loss, disability, career changes
• **Health Risks:** Medical expenses, long-term care needs
• **Asset Risks:** Property damage, theft, liability claims
• **Life Stage Risks:** Marriage, children, divorce, retirement

**Risk Assessment Framework:**
• **Probability:** How likely is this risk to occur?
• **Impact:** What would be the financial consequence?
• **Timing:** When might this risk materialize?
• **Control:** How much influence do you have over this risk?

**Risk Quantification Methods:**
• Expected value calculations (probability × impact)
• Scenario analysis for different outcomes
• Monte Carlo simulations for complex risks
• Stress testing for extreme events

**Risk Register Creation:**
• List all identified risks
• Rate probability and impact (1-5 scale)
• Calculate risk scores
• Prioritize by highest scores
• Track mitigation strategies`
          },
          {
            title: 'Risk Management Strategies',
            content: `Apply systematic approaches to manage identified risks:

**Risk Management Hierarchy:**
1. **Risk Avoidance:** Eliminate the risk entirely
2. **Risk Reduction:** Minimize probability or impact
3. **Risk Transfer:** Use insurance or contracts
4. **Risk Retention:** Accept and self-fund the risk

**Insurance vs. Self-Insurance Decisions:**
• **Insure:** Low probability, high impact risks
• **Self-Insure:** High probability, low impact risks
• **Emergency Fund:** First line of defense
• **Insurance:** Catastrophic protection

**Risk Tolerance vs. Risk Capacity:**
• **Risk Tolerance:** Emotional comfort with uncertainty
• **Risk Capacity:** Financial ability to absorb losses
• **Risk Perception:** How you view specific risks
• **Risk Alignment:** Match strategies to both tolerance and capacity

**Diversification Strategies:**
• Income source diversification
• Geographic risk spreading
• Time-based risk distribution
• Asset class diversification`
          },
          {
            title: 'Life Stage Risk Adaptation',
            content: `Adjust risk management as your life evolves:

**Young Adult (20s-30s):**
• Focus on income protection (disability insurance)
• Basic term life insurance if dependents
• Health insurance with HSA
• Renters insurance and auto coverage
• Build emergency fund before investing

**Family Building (30s-40s):**
• Increase life insurance significantly
• Own occupation disability coverage
• Umbrella insurance for liability protection
• 529 education savings for children
• Homeowners insurance with adequate coverage

**Peak Earning (40s-50s):**
• Maximum life insurance needs
• Long-term care insurance consideration
• Asset protection strategies
• Tax-efficient risk management
• Estate planning integration

**Pre-Retirement (50s-60s):**
• Reduce life insurance needs gradually
• Focus on health and long-term care risks
• Asset preservation strategies
• Social Security optimization
• Medicare supplement planning

**Retirement (60s+):**
• Minimal life insurance needs
• Healthcare cost management
• Long-term care protection
• Legacy and estate planning
• Sequence of returns risk management`
          }
        ],
        practicalExample: {
          title: 'Comprehensive Risk Assessment',
          scenario: 'Lisa, 38, married, two children, $120,000 combined household income, $200,000 mortgage',
          calculation: `**Risk Assessment Matrix:**
• **High Impact/High Probability:** Disability of primary earner
• **High Impact/Low Probability:** Premature death
• **Medium Impact/Medium Probability:** Job loss
• **Low Impact/High Probability:** Minor property damage

**Risk Management Plan:**
• Disability insurance: $5,000/month benefit
• Life insurance: $750,000 term policy
• Emergency fund: 6 months expenses ($30,000)
• Umbrella insurance: $1 million coverage
• **Total annual cost: $4,500-6,000**`,
          keyTakeaway: 'Effective risk management requires systematic assessment, prioritization, and appropriate mix of insurance and self-insurance strategies.'
        }
      }
    },
    {
      id: 6,
      title: 'Insurance Portfolio Integration',
      icon: TrendingUp,
      duration: '10 min',
      content: {
        overview: 'Integrate insurance planning with overall financial strategy for optimal protection and wealth building coordination.',
        keyPoints: [
          'Insurance and investment coordination',
          'Tax implications of insurance decisions',
          'Estate planning insurance integration',
          'Regular portfolio reviews and updates',
          'Cost optimization across all coverage'
        ],
        sections: [
          {
            title: 'Insurance-Investment Coordination',
            content: `Align insurance and investment strategies:

**Term Life + Invest the Difference:**
• Buy term life insurance for protection
• Invest premium savings in retirement accounts
• Generally more cost-effective than permanent life
• Provides flexibility and higher returns

**Permanent Life Insurance Considerations:**
• Tax-deferred cash value growth
• Tax-free death benefit
• Estate liquidity for high net worth
• Business succession planning

**HSA as Insurance Investment Tool:**
• Triple tax advantage
• No required minimum distributions
• Becomes retirement account after age 65
• Covers future healthcare costs in retirement

**Disability Insurance + Emergency Fund:**
• Coordinate elimination periods with emergency savings
• Longer elimination periods reduce premiums
• Emergency fund covers gap until benefits begin
• Consider 3-6 month minimum emergency fund

**Self-Insurance Thresholds:**
• Higher deductibles for lower premiums
• Self-insure small, frequent losses
• Reserve insurance for catastrophic risks
• Regular cost-benefit analysis`
          },
          {
            title: 'Tax-Efficient Insurance Planning',
            content: `Optimize insurance decisions for tax efficiency:

**Tax Treatment of Insurance:**
• **Life Insurance:** Tax-free death benefits
• **Disability Insurance:** Tax-free if premiums paid with after-tax dollars
• **Health Insurance:** Deductible premiums, tax-free benefits
• **Long-Term Care:** Qualified plans have tax advantages

**Employer vs. Individual Coverage:**
• Group life insurance: First $50,000 tax-free
• Group disability: Benefits taxable if employer pays
• Individual policies: Often better tax treatment
• Portability advantages of individual coverage

**Business Insurance Tax Benefits:**
• Deductible as business expense
• Key person insurance limitations
• Split-dollar arrangements
• Section 162 executive bonus plans

**Estate Planning Tax Considerations:**
• Life insurance trusts (ILITs) remove from estate
• Generation-skipping transfer tax planning
• Gift tax implications of premium payments
• State estate tax considerations`
          },
          {
            title: 'Portfolio Management and Optimization',
            content: `Maintain and optimize your insurance portfolio:

**Annual Insurance Review:**
• Coverage amount adequacy
• Beneficiary designations
• Premium competitiveness
• Policy performance
• Life changes impact

**Life Event Triggers for Review:**
• Marriage or divorce
• Birth or adoption of children
• Home purchase or relocation
• Job changes or income increases
• Health status changes
• Retirement planning

**Cost Optimization Strategies:**
• Multi-policy discounts
• Annual vs. monthly premium payments
• Carrier financial strength ratings
• Claims service quality
• Coverage gap analysis

**Integration with Financial Plan:**
• Coordinate with retirement planning
• Align with estate planning objectives
• Consider tax planning implications
• Monitor against changing needs
• Benchmark against best practices

**Technology and Tools:**
• Insurance comparison websites
• Policy management apps
• Beneficiary tracking systems
• Claims documentation
• Financial planning software integration`
          }
        ],
        practicalExample: {
          title: 'Integrated Insurance Financial Plan',
          scenario: 'David & Sarah, ages 42 & 39, $180,000 combined income, $450,000 home, two teenagers',
          calculation: `**Comprehensive Insurance Portfolio:**
• Term Life: $1.5M on David, $1M on Sarah
• Disability: 60% income replacement each
• Homeowners: $450,000 dwelling, $225,000 contents
• Auto: $250,000/$500,000/$100,000 liability
• Umbrella: $2 million coverage
• Long-term care: Hybrid life/LTC policies

**Integration Benefits:**
• Multi-policy discount: 15% savings
• HSA maximization: $8,550 annually
• Term conversion options
• Estate tax planning
• **Total premium optimization: $2,000 annual savings**`,
          keyTakeaway: 'Integrated insurance planning maximizes protection while minimizing costs through strategic coordination with overall financial objectives.'
        }
      }
    }
  ];

  const handleNext = () => {
    if (currentLesson < lessons.length - 1) {
      setCurrentLesson(currentLesson + 1);
    }
  };

  const handlePrevious = () => {
    if (currentLesson > 0) {
      setCurrentLesson(currentLesson - 1);
    }
  };

  const handleMarkComplete = () => {
    const newCompleted = [...completedLessons];
    newCompleted[currentLesson] = true;
    setCompletedLessons(newCompleted);
  };

  const allLessonsCompleted = completedLessons.every(completed => completed);
  const progress = (completedLessons.filter(completed => completed).length / lessons.length) * 100;

  const handleCompleteAllLessons = () => {
    if (onComplete) {
      onComplete();
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Header */}
      <div className="mb-8">
        <div className={`flex items-center justify-between mb-4`}>
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg ${theme.backgrounds.card}`}>
              <Shield className={`w-6 h-6 ${theme.textColors.primary}`} />
            </div>
            <div>
              <h1 className={`text-2xl font-bold ${theme.textColors.primary}`}>
                Insurance & Risk Management
              </h1>
              <p className={`${theme.textColors.secondary}`}>
                Lesson {currentLesson + 1} of {lessons.length} • {lessons[currentLesson].duration}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Clock className={`w-4 h-4 ${theme.textColors.secondary}`} />
            <span className={`text-sm ${theme.textColors.secondary}`}>
              {Math.floor(timeSpent / 60)}:{(timeSpent % 60).toString().padStart(2, '0')}
            </span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-4">
          <div className="flex justify-between items-center mb-2">
            <span className={`text-sm ${theme.textColors.secondary}`}>Overall Progress</span>
            <span className={`text-sm font-medium ${theme.textColors.primary}`}>{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Lesson Navigation */}
        <div className="grid grid-cols-6 gap-2">
          {lessons.map((lesson, index) => {
            const Icon = lesson.icon;
            return (
              <button
                key={index}
                onClick={() => setCurrentLesson(index)}
                className={`p-3 rounded-lg border transition-all duration-200 ${
                  index === currentLesson
                    ? `${theme.backgrounds.primary} border-blue-500 text-white`
                    : completedLessons[index]
                    ? `${theme.backgrounds.card} border-green-500/30 ${theme.textColors.primary}`
                    : `${theme.backgrounds.card} ${theme.borderColors.primary} ${theme.textColors.secondary} hover:${theme.borderColors.primary}`
                }`}
              >
                <Icon className="w-5 h-5 mx-auto mb-1" />
                <div className="text-xs font-medium">{lesson.title.split(' ')[0]}</div>
                {completedLessons[index] && (
                  <CheckCircle className={`w-3 h-3 ${theme.status?.success?.text || 'text-emerald-400'} mx-auto mt-1`} />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Current Lesson Content */}
      <motion.div
        key={currentLesson}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className={`${theme.backgrounds.card} border ${theme.borderColors.primary} mb-6`}>
          <CardHeader>
            <CardTitle className={`flex items-center gap-3 ${theme.textColors.primary}`}>
              {React.createElement(lessons[currentLesson].icon, { className: 'w-6 h-6' })}
              {lessons[currentLesson].title}
            </CardTitle>
            <p className={`${theme.textColors.secondary}`}>
              {lessons[currentLesson].content.overview}
            </p>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Key Points */}
            <div className={`${theme.backgrounds.card} rounded-lg p-4`}>
              <h4 className={`font-semibold ${theme.textColors.primary} mb-3`}>
                Key Learning Points:
              </h4>
              <ul className="space-y-2">
                {lessons[currentLesson].content.keyPoints.map((point, index) => (
                  <li key={index} className={`flex items-start gap-2 ${theme.textColors.secondary}`}>
                    <CheckCircle className={`w-4 h-4 ${theme.status?.success?.text || 'text-emerald-400'} mt-0.5 flex-shrink-0`} />
                    {point}
                  </li>
                ))}
              </ul>
            </div>

            {/* Content Sections */}
            {lessons[currentLesson].content.sections.map((section, index) => (
              <div key={index} className="space-y-4">
                <h3 className={`text-xl font-bold ${theme.textColors.primary}`}>
                  {section.title}
                </h3>
                <div className={`${theme.textColors.secondary} space-y-4`}>
                  {section.content.split('\n\n').map((paragraph, pIndex) => (
                    <div key={pIndex} className="whitespace-pre-line">
                      {paragraph}
                    </div>
                  ))}
                </div>
              </div>
            ))}

            {/* Practical Example */}
            <div className={`${theme.backgrounds.glass} border ${theme.borderColors.primary} rounded-lg p-6`}>
              <h4 className={`font-bold ${theme.textColors.primary} mb-3 flex items-center gap-2`}>
                <Calculator className="w-5 h-5" />
                {lessons[currentLesson].content.practicalExample.title}
              </h4>
              <div className={`${theme.textColors.secondary} space-y-3`}>
                <p><strong>Scenario:</strong> {lessons[currentLesson].content.practicalExample.scenario}</p>
                <div className="whitespace-pre-line">
                  <strong>Analysis:</strong>
                  {lessons[currentLesson].content.practicalExample.calculation}
                </div>
                <div className={`${theme.backgrounds.primary} rounded-lg p-4`}>
                  <p className={`font-medium ${theme.textColors.primary}`}>
                    💡 Key Takeaway: {lessons[currentLesson].content.practicalExample.keyTakeaway}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Navigation and Completion */}
      <div className="flex items-center justify-between">
        <Button
          onClick={handlePrevious}
          disabled={currentLesson === 0}
          variant="outline"
          className={`${theme.buttons.secondary}`}
        >
          <ChevronLeft className="w-4 h-4 mr-2" />
          Previous
        </Button>

        <div className="flex items-center gap-4">
          {!completedLessons[currentLesson] && (
            <Button
              onClick={handleMarkComplete}
              variant="outline"
              className={theme.buttons.secondary}
            >
              <CheckCircle className="w-4 h-4 mr-2" />
              Mark Complete
            </Button>
          )}

          {allLessonsCompleted && (
            <Button
              onClick={handleCompleteAllLessons}
              className={theme.buttons.primary}
            >
              <BookOpen className="w-4 h-4 mr-2" />
              Complete All Lessons
            </Button>
          )}
        </div>

        <Button
          onClick={handleNext}
          disabled={currentLesson === lessons.length - 1}
          className={theme.buttons.primary}
        >
          Next
          <ChevronRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </div>
  );
}
