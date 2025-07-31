import Link from 'next/link';
import { TrendingUp, PieChart, CreditCard, Home, Umbrella, Car, Target, Zap, Gamepad2, Calculator, Brain, BarChart3, Calendar, FileText, Shield } from 'lucide-react';
import { theme } from '@/lib/theme';

export default function CalculatorsPage() {
  const calculators = [
    {
      id: 'paycheck',
      title: 'Paycheck Calculator',
      description: 'Calculate your take-home pay and understand exactly where your money goes',
      icon: Calculator,
      bgColor: 'from-green-900/20 to-green-800/30',
      borderColor: 'border-green-600/30',
      textColor: 'text-green-200',
      buttonColor: 'bg-green-600 hover:bg-green-700',
      example: '$70,000 salary = $4,374 monthly take-home (varies by state)',
      href: '/calculators/paycheck'
    },
    {
      id: 'compound-interest',
      title: 'Compound Interest Calculator',
      description: 'See how your money grows exponentially over time with the power of compound interest',
      icon: TrendingUp,
      bgColor: 'from-amber-900/20 to-amber-800/30',
      borderColor: 'border-amber-600/30',
      textColor: 'text-amber-200',
      buttonColor: 'bg-amber-600 hover:bg-amber-700',
      example: '$100/month for 30 years = $303,219 at 7%',
      href: '/calculators/compound-interest'
    },
    {
      id: 'budget-builder',
      title: 'Budget Builder Calculator',
      description: 'Create your personal budget using the proven 50/30/20 rule for needs, wants, and savings',
      icon: PieChart,
      bgColor: 'from-blue-900/20 to-blue-800/30',
      borderColor: 'border-blue-600/30',
      textColor: 'text-blue-200',
      buttonColor: 'bg-blue-600 hover:bg-blue-700',
      example: 'Balance $5,000 income: $2,500 needs, $1,500 wants, $1,000 savings',
      href: '/calculators/budget-builder'
    },
    {
      id: 'debt-payoff',
      title: 'Debt Payoff Calculator',
      description: 'Compare avalanche vs snowball strategies and see how extra payments accelerate freedom',
      icon: CreditCard,
      bgColor: 'from-slate-800/20 to-slate-700/30',
      borderColor: 'border-slate-600/30',
      textColor: 'text-slate-200',
      buttonColor: 'bg-slate-600 hover:bg-slate-700',
      example: '$25,000 debt paid off 5 years faster with $200 extra monthly',
      href: '/calculators/debt-payoff'
    },
    {
      id: 'mortgage',
      title: 'Mortgage Calculator',
      description: 'Calculate mortgage payments, affordability, and compare loan scenarios',
      icon: Home,
      bgColor: 'from-purple-900/20 to-purple-800/30',
      borderColor: 'border-purple-600/30',
      textColor: 'text-purple-200',
      buttonColor: 'bg-purple-600 hover:bg-purple-700',
      example: '$400,000 home at 7% = $2,661/month payment',
      href: '/calculators/mortgage'
    },
    {
      id: 'emergency-fund',
      title: 'Emergency Fund Calculator',
      description: 'Plan your financial safety net with personalized emergency fund targets and timelines',
      icon: Umbrella,
      bgColor: 'from-teal-900/20 to-teal-800/30',
      borderColor: 'border-teal-600/30',
      textColor: 'text-teal-200',
      buttonColor: 'bg-teal-600 hover:bg-teal-700',
      example: '6 months expenses ($18,000) saved in 3 years at $500/month',
      href: '/calculators/emergency-fund'
    },
    {
      id: 'credit-score',
      title: 'Credit Score Simulator',
      description: 'Model credit score improvements and optimize your credit profile strategically',
      icon: Target,
      bgColor: 'from-indigo-900/20 to-indigo-800/30',
      borderColor: 'border-indigo-600/30',
      textColor: 'text-indigo-200',
      buttonColor: 'bg-indigo-600 hover:bg-indigo-700',
      example: 'Improve score from 650 to 750 in 12 months with strategic changes',
      href: '/calculators/credit-score'
    },
    {
      id: 'rewards-optimizer',
      title: 'Rewards Optimizer',
      description: 'Maximize credit card rewards with personalized recommendations based on your spending',
      icon: Zap,
      bgColor: 'from-rose-900/20 to-rose-800/30',
      borderColor: 'border-rose-600/30',
      textColor: 'text-rose-200',
      buttonColor: 'bg-rose-600 hover:bg-rose-700',
      example: 'Earn $800+ annually with optimized card selection and spending strategy',
      href: '/calculators/rewards-optimizer'
    },
    {
      id: 'portfolio-analyzer',
      title: 'Portfolio Analyzer',
      description: 'Analyze your investment portfolio allocation, diversification, and get optimization recommendations',
      icon: BarChart3,
      bgColor: 'from-emerald-900/20 to-emerald-800/30',
      borderColor: 'border-emerald-600/30',
      textColor: 'text-emerald-200',
      buttonColor: 'bg-emerald-600 hover:bg-emerald-700',
      example: 'Optimize $100,000 portfolio for 85% diversification score and balanced risk',
      href: '/calculators/portfolio-analyzer'
    },
    {
      id: 'retirement-planner',
      title: 'Retirement Planner',
      description: 'Plan your retirement with confidence - calculate savings needed and project future income',
      icon: Calendar,
      bgColor: 'from-violet-900/20 to-violet-800/30',
      borderColor: 'border-violet-600/30',
      textColor: 'text-violet-200',
      buttonColor: 'bg-violet-600 hover:bg-violet-700',
      example: 'Save $500/month for 35 years = $1.2M retirement balance at 7% return',
      href: '/calculators/retirement-planner'
    },
    {
      id: 'tax-optimizer',
      title: 'Tax Optimizer',
      description: 'Minimize your tax burden with personalized strategies and legal optimization techniques',
      icon: FileText,
      bgColor: 'from-orange-900/20 to-orange-800/30',
      borderColor: 'border-orange-600/30',
      textColor: 'text-orange-200',
      buttonColor: 'bg-orange-600 hover:bg-orange-700',
      example: 'Reduce $15,000 tax bill by $3,500 with 401(k), IRA, and HSA optimization',
      href: '/calculators/tax-optimizer'
    },
    {
      id: 'bond',
      title: 'Bond Calculator',
      description: 'Analyze bond yields, prices, and interest rate sensitivity for fixed-income investments',
      icon: Shield,
      bgColor: 'from-blue-900/20 to-blue-800/30',
      borderColor: 'border-blue-600/30',
      textColor: 'text-blue-200',
      buttonColor: 'bg-blue-600 hover:bg-blue-700',
      example: '$1,000 bond with 5% coupon = 5.26% YTM when trading at $950',
      href: '/calculators/bond'
    },
    {
      id: 'stock-analysis',
      title: 'Stock Analysis Calculator',
      description: 'Analyze individual stocks using fundamental valuation metrics and risk assessment',
      icon: BarChart3,
      bgColor: 'from-indigo-900/20 to-indigo-800/30',
      borderColor: 'border-indigo-600/30',
      textColor: 'text-indigo-200',
      buttonColor: 'bg-indigo-600 hover:bg-indigo-700',
      example: 'AAPL analysis: $150 current price vs $165 intrinsic value = 10% upside',
      href: '/calculators/stock-analysis'
    }
  ];

  return (
    <div className={theme.backgrounds.primary}>
      {/* Header */}
      <header className={`${theme.backgrounds.header} ${theme.borderColors.accent} border-b backdrop-blur-xl`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/" className={`${theme.textColors.accent} hover:${theme.textColors.accentSecondary} font-medium transition-colors`}>
                ← Back to Home
              </Link>
              <h1 className={`text-2xl font-bold ${theme.textColors.primary}`}>Financial Calculators</h1>
            </div>
            <div className={`${theme.status.warning.bg} border ${theme.status.warning.border} px-3 py-1 rounded-full backdrop-blur-sm`}>
              <span className={`text-sm font-medium ${theme.textColors.accentSecondary} flex items-center gap-1`}>
                <Calculator className="w-4 h-4" />
                Interactive Tools
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h2 className={`text-4xl font-bold ${theme.textColors.primary} mb-4`}>
            Interactive Financial Tools
          </h2>
          <p className={`text-xl ${theme.textColors.secondary} max-w-3xl mx-auto leading-relaxed`}>
            Master your money with hands-on calculators that show you exactly how financial decisions impact your future.
            <strong className={theme.textColors.accent}> No guessing, just clear numbers and actionable insights.</strong>
          </p>
        </div>

        {/* Calculator Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {calculators.map((calc) => (
            <div
              key={calc.id}
              className={`group ${theme.backgrounds.card} backdrop-blur-xl border ${theme.borderColors.primary} rounded-xl p-6 hover:shadow-xl hover:${theme.borderColors.accent} transition-all transform hover:scale-105`}
            >
              <div className="flex items-center mb-4">
                <div className={`${theme.status.warning.bg} p-3 rounded-lg mr-4 group-hover:${theme.status.warning.bg} transition-all`}>
                  <calc.icon className={`w-8 h-8 ${theme.textColors.accent}`} />
                </div>
                <h3 className={`text-xl font-bold ${theme.textColors.primary}`}>
                  {calc.title}
                </h3>
              </div>

              <p className={`${theme.textColors.secondary} mb-6 leading-relaxed`}>
                {calc.description}
              </p>

              <div className={`${theme.backgrounds.cardHover} backdrop-blur-sm rounded-lg p-3 mb-6 border ${theme.borderColors.muted}`}>
                <p className={`text-sm font-medium ${theme.textColors.secondary} mb-1`}>Example Result:</p>
                <p className={`text-sm ${theme.textColors.accent} font-semibold`}>
                  {calc.example}
                </p>
              </div>

              <Link href={calc.href}>
                <button className={`w-full ${theme.buttons.accent} px-6 py-3 rounded-lg font-semibold transition-all shadow-md group-hover:shadow-lg`}>
                  Start Calculating
                </button>
              </Link>
            </div>
          ))}
        </div>

        {/* Coming Soon Section */}
        <div className={`${theme.backgrounds.card} backdrop-blur-xl border ${theme.borderColors.primary} rounded-2xl p-8`}>
          <div className="text-center mb-8">
            <h3 className={`text-2xl font-bold ${theme.textColors.primary} mb-4 flex items-center justify-center gap-2`}>
              <Zap className={`w-6 h-6 ${theme.textColors.accent}`} />
              More Tools Coming Soon
            </h3>
            <p className={`${theme.textColors.secondary} max-w-2xl mx-auto`}>
              We&apos;re building a complete suite of financial calculators to help you master every aspect of money management
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className={`${theme.backgrounds.cardHover} backdrop-blur-sm border ${theme.borderColors.muted} rounded-lg p-4 text-center hover:${theme.borderColors.accent} transition-all`}>
              <Home className={`w-8 h-8 mx-auto mb-2 ${theme.textColors.accent}`} />
              <h4 className={`font-semibold ${theme.textColors.primary} text-sm`}>Mortgage Calculator</h4>
              <p className={`text-xs ${theme.textColors.secondary} mt-1`}>Monthly payments & amortization</p>
            </div>
            <div className={`${theme.backgrounds.cardHover} backdrop-blur-sm border ${theme.borderColors.muted} rounded-lg p-4 text-center hover:${theme.borderColors.accent} transition-all`}>
              <Umbrella className={`w-8 h-8 mx-auto mb-2 ${theme.textColors.accent}`} />
              <h4 className={`font-semibold ${theme.textColors.primary} text-sm`}>Retirement Planner</h4>
              <p className={`text-xs ${theme.textColors.secondary} mt-1`}>How much you need to retire</p>
            </div>
            <div className={`${theme.backgrounds.cardHover} backdrop-blur-sm border ${theme.borderColors.muted} rounded-lg p-4 text-center hover:${theme.borderColors.accent} transition-all`}>
              <Car className={`w-8 h-8 mx-auto mb-2 ${theme.textColors.accent}`} />
              <h4 className={`font-semibold ${theme.textColors.primary} text-sm`}>Auto Loan Calculator</h4>
              <p className={`text-xs ${theme.textColors.secondary} mt-1`}>Car payments & total costs</p>
            </div>
            <div className={`${theme.backgrounds.cardHover} backdrop-blur-sm border ${theme.borderColors.muted} rounded-lg p-4 text-center hover:${theme.borderColors.accent} transition-all`}>
              <Target className={`w-8 h-8 mx-auto mb-2 ${theme.textColors.accent}`} />
              <h4 className={`font-semibold ${theme.textColors.primary} text-sm`}>Savings Goal Tracker</h4>
              <p className={`text-xs ${theme.textColors.secondary} mt-1`}>Timeline to reach your goals</p>
            </div>
          </div>
        </div>

        {/* Educational Value */}
        <div className={`mt-12 ${theme.backgrounds.card} backdrop-blur-xl border ${theme.borderColors.primary} rounded-2xl p-8`}>
          <h3 className={`text-2xl font-bold ${theme.textColors.primary} text-center mb-6 flex items-center justify-center gap-2`}>
            <Brain className={`w-6 h-6 ${theme.textColors.accent}`} />
            Why Interactive Calculators Work
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className={`${theme.status.info.bg} w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4`}>
                <Target className={`w-8 h-8 ${theme.textColors.accent}`} />
              </div>
              <h4 className={`font-semibold ${theme.textColors.primary} mb-2`}>Visual Learning</h4>
              <p className={`${theme.textColors.secondary} text-sm`}>
                See your money grow or shrink in real-time. Charts and graphs make abstract concepts concrete.
              </p>
            </div>
            <div className="text-center">
              <div className={`${theme.status.warning.bg} w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4`}>
                <Zap className={`w-8 h-8 ${theme.textColors.accent}`} />
              </div>
              <h4 className={`font-semibold ${theme.textColors.primary} mb-2`}>Immediate Feedback</h4>
              <p className={`${theme.textColors.secondary} text-sm`}>
                Change one number and instantly see the impact. No waiting, no guessing - just clear results.
              </p>
            </div>
            <div className="text-center">
              <div className={`${theme.backgrounds.cardHover} w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4`}>
                <Gamepad2 className={`w-8 h-8 ${theme.textColors.accent}`} />
              </div>
              <h4 className={`font-semibold ${theme.textColors.primary} mb-2`}>Hands-On Practice</h4>
              <p className={`${theme.textColors.secondary} text-sm`}>
                Try different scenarios safely. Make mistakes and learn without risking real money.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
