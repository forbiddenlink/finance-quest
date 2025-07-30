import Link from 'next/link';
import { TrendingUp, PieChart, CreditCard, Home, Umbrella, Car, Target, Zap, Gamepad2, Calculator, Brain } from 'lucide-react';

export default function CalculatorsPage() {
  const calculators = [
    {
      id: 'compound-interest',
      title: 'Compound Interest Calculator',
      description: 'See how your money grows exponentially over time with the power of compound interest',
      icon: TrendingUp,
      bgColor: 'from-green-50 to-emerald-100',
      borderColor: 'border-green-200',
      textColor: 'text-green-900',
      buttonColor: 'bg-green-500 hover:bg-green-600',
      example: '$100/month for 30 years = $303,219 at 7%',
      href: '/calculators/compound-interest'
    },
    {
      id: 'budget-builder',
      title: 'Budget Builder Calculator',
      description: 'Create your personal budget using the proven 50/30/20 rule for needs, wants, and savings',
      icon: PieChart,
      bgColor: 'from-blue-50 to-indigo-100',
      borderColor: 'border-blue-200',
      textColor: 'text-blue-900',
      buttonColor: 'bg-blue-500 hover:bg-blue-600',
      example: 'Balance $5,000 income: $2,500 needs, $1,500 wants, $1,000 savings',
      href: '/calculators/budget-builder'
    },
    {
      id: 'debt-payoff',
      title: 'Debt Payoff Calculator',
      description: 'Compare avalanche vs snowball strategies and see how extra payments accelerate freedom',
      icon: CreditCard,
      bgColor: 'from-red-50 to-pink-100',
      borderColor: 'border-red-200',
      textColor: 'text-red-900',
      buttonColor: 'bg-red-500 hover:bg-red-600',
      example: '$25,000 debt paid off 5 years faster with $200 extra monthly',
      href: '/calculators/debt-payoff'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/" className="text-blue-600 hover:text-blue-800 font-medium">
                ← Back to Home
              </Link>
              <h1 className="text-2xl font-bold text-gray-900">Financial Calculators</h1>
            </div>
            <div className="bg-purple-100 px-3 py-1 rounded-full">
              <span className="text-sm font-medium text-purple-800 flex items-center gap-1">
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
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Interactive Financial Tools
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Master your money with hands-on calculators that show you exactly how financial decisions impact your future.
            <strong> No guessing, just clear numbers and actionable insights.</strong>
          </p>
        </div>

        {/* Calculator Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {calculators.map((calc) => (
            <div
              key={calc.id}
              className={`group bg-gradient-to-br ${calc.bgColor} border ${calc.borderColor} rounded-xl p-6 hover:shadow-xl transition-all transform hover:scale-105`}
            >
              <div className="flex items-center mb-4">
                <div className="bg-white bg-opacity-80 p-3 rounded-lg mr-4 group-hover:bg-opacity-100 transition-all">
                  <calc.icon className="w-8 h-8" />
                </div>
                <h3 className={`text-xl font-bold ${calc.textColor}`}>
                  {calc.title}
                </h3>
              </div>

              <p className={`${calc.textColor} mb-6 leading-relaxed`}>
                {calc.description}
              </p>

              <div className="bg-white bg-opacity-60 rounded-lg p-3 mb-6">
                <p className="text-sm font-medium text-gray-700 mb-1">Example Result:</p>
                <p className={`text-sm ${calc.textColor} font-semibold`}>
                  {calc.example}
                </p>
              </div>

              <Link href={calc.href}>
                <button className={`w-full ${calc.buttonColor} text-white px-6 py-3 rounded-lg font-semibold transition-all shadow-md group-hover:shadow-lg`}>
                  Start Calculating
                </button>
              </Link>
            </div>
          ))}
        </div>

        {/* Coming Soon Section */}
        <div className="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-2xl p-8">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-purple-900 mb-4 flex items-center justify-center gap-2">
              <Zap className="w-6 h-6" />
              More Tools Coming Soon
            </h3>
            <p className="text-purple-700 max-w-2xl mx-auto">
              We&apos;re building a complete suite of financial calculators to help you master every aspect of money management
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white bg-opacity-50 rounded-lg p-4 text-center">
              <Home className="w-8 h-8 mx-auto mb-2 text-purple-600" />
              <h4 className="font-semibold text-purple-800 text-sm">Mortgage Calculator</h4>
              <p className="text-xs text-purple-600 mt-1">Monthly payments & amortization</p>
            </div>
            <div className="bg-white bg-opacity-50 rounded-lg p-4 text-center">
              <Umbrella className="w-8 h-8 mx-auto mb-2 text-purple-600" />
              <h4 className="font-semibold text-purple-800 text-sm">Retirement Planner</h4>
              <p className="text-xs text-purple-600 mt-1">How much you need to retire</p>
            </div>
            <div className="bg-white bg-opacity-50 rounded-lg p-4 text-center">
              <Car className="w-8 h-8 mx-auto mb-2 text-purple-600" />
              <h4 className="font-semibold text-purple-800 text-sm">Auto Loan Calculator</h4>
              <p className="text-xs text-purple-600 mt-1">Car payments & total costs</p>
            </div>
            <div className="bg-white bg-opacity-50 rounded-lg p-4 text-center">
              <Target className="w-8 h-8 mx-auto mb-2 text-purple-600" />
              <h4 className="font-semibold text-purple-800 text-sm">Savings Goal Tracker</h4>
              <p className="text-xs text-purple-600 mt-1">Timeline to reach your goals</p>
            </div>
          </div>
        </div>

        {/* Educational Value */}
        <div className="mt-12 bg-blue-50 border border-blue-200 rounded-2xl p-8">
          <h3 className="text-2xl font-bold text-blue-900 text-center mb-6 flex items-center justify-center gap-2">
            <Brain className="w-6 h-6" />
            Why Interactive Calculators Work
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Target className="w-8 h-8 text-blue-600" />
              </div>
              <h4 className="font-semibold text-blue-900 mb-2">Visual Learning</h4>
              <p className="text-blue-700 text-sm">
                See your money grow or shrink in real-time. Charts and graphs make abstract concepts concrete.
              </p>
            </div>
            <div className="text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Zap className="w-8 h-8 text-blue-600" />
              </div>
              <h4 className="font-semibold text-blue-900 mb-2">Immediate Feedback</h4>
              <p className="text-blue-700 text-sm">
                Change one number and instantly see the impact. No waiting, no guessing - just clear results.
              </p>
            </div>
            <div className="text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Gamepad2 className="w-8 h-8 text-blue-600" />
              </div>
              <h4 className="font-semibold text-blue-900 mb-2">Hands-On Practice</h4>
              <p className="text-blue-700 text-sm">
                Try different scenarios safely. Make mistakes and learn without risking real money.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
