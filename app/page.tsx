import Image from "next/image";
import Link from "next/link";
import { ProgressDisplay } from "@/components/shared/ui/ProgressDisplay";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900">Finance Quest</h1>
            <div className="flex items-center space-x-4">
              <ProgressDisplay />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <div className="mb-6">
            <span className="bg-red-100 text-red-800 text-sm font-medium px-3 py-1 rounded-full">
              🚨 Solving the 64% Financial Illiteracy Crisis
            </span>
          </div>
          <h2 className="text-5xl font-bold text-gray-900 mb-6 leading-tight">
            Master Your Money,<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-green-600">
              Master Your Future
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Transform from financial novice to money master through AI-powered personalized coaching, 
            interactive calculators, and real-world scenarios. <strong>No prior knowledge required!</strong>
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/chapter1">
              <button className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg">
                🚀 Start Your Journey
              </button>
            </Link>
            <Link href="/calculators/compound-interest">
              <button className="bg-white text-blue-600 px-8 py-4 rounded-lg text-lg font-semibold border-2 border-blue-600 hover:bg-blue-50 transition-all shadow-lg">
                💰 Try Calculator
              </button>
            </Link>
            <Link href="/progress">
              <button className="bg-gradient-to-r from-purple-600 to-indigo-700 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:from-purple-700 hover:to-indigo-800 transition-all shadow-lg">
                📊 View Progress
              </button>
            </Link>
          </div>
        </div>

        {/* Comprehensive Chapter Overview - 10 Modules */}
        <div className="mb-16">
          <div className="text-center mb-8">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">Complete Financial Education Curriculum</h3>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              10 comprehensive modules covering everything from basic budgeting to advanced wealth building
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {/* Chapter 1 - Available */}
            <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-blue-500 transform hover:scale-105 transition-all">
              <div className="flex items-center mb-3">
                <span className="text-2xl mr-3">💰</span>
                <h4 className="text-lg font-bold text-gray-900">Money Fundamentals</h4>
              </div>
              <p className="text-gray-600 mb-4">Income, banking, paycheck basics, direct deposits</p>
              <div className="flex items-center justify-between">
                <span className="text-sm text-green-600 font-medium bg-green-100 px-2 py-1 rounded">✅ Available Now</span>
                <Link href="/chapter1">
                  <button className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors">
                    Start Learning
                  </button>
                </Link>
              </div>
            </div>

            {/* Chapter 2 - Locked */}
            <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl shadow-lg p-6 border-l-4 border-gray-300">
              <div className="flex items-center mb-3">
                <span className="text-2xl mr-3 opacity-50">📊</span>
                <h4 className="text-lg font-bold text-gray-500">Budgeting Mastery</h4>
              </div>
              <p className="text-gray-500 mb-4">50/30/20 rule, expense tracking, emergency funds, cash flow</p>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-400 font-medium bg-gray-200 px-2 py-1 rounded">🔒 Complete Chapter 1</span>
                <button className="bg-gray-300 text-gray-500 px-4 py-2 rounded-lg cursor-not-allowed">
                  Locked
                </button>
              </div>
            </div>

            {/* Chapter 3 - Locked */}
            <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl shadow-lg p-6 border-l-4 border-gray-300">
              <div className="flex items-center mb-3">
                <span className="text-2xl mr-3 opacity-50">💳</span>
                <h4 className="text-lg font-bold text-gray-500">Debt & Credit</h4>
              </div>
              <p className="text-gray-500 mb-4">Credit scores, good vs bad debt, loan strategies, credit cards</p>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-400 font-medium bg-gray-200 px-2 py-1 rounded">🔒 Complete Chapter 2</span>
                <button className="bg-gray-300 text-gray-500 px-4 py-2 rounded-lg cursor-not-allowed">
                  Locked
                </button>
              </div>
            </div>

            {/* Chapter 4 - Locked */}
            <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl shadow-lg p-6 border-l-4 border-gray-300">
              <div className="flex items-center mb-3">
                <span className="text-2xl mr-3 opacity-50">📈</span>
                <h4 className="text-lg font-bold text-gray-500">Investment Fundamentals</h4>
              </div>
              <p className="text-gray-500 mb-4">Compound interest, stocks/bonds, 401k matching, diversification</p>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-400 font-medium bg-gray-200 px-2 py-1 rounded">🔒 Complete Chapter 3</span>
                <button className="bg-gray-300 text-gray-500 px-4 py-2 rounded-lg cursor-not-allowed">
                  Locked
                </button>
              </div>
            </div>

            {/* Chapter 5 - Locked */}
            <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl shadow-lg p-6 border-l-4 border-gray-300">
              <div className="flex items-center mb-3">
                <span className="text-2xl mr-3 opacity-50">🎯</span>
                <h4 className="text-lg font-bold text-gray-500">Advanced Investing</h4>
              </div>
              <p className="text-gray-500 mb-4">ETFs, mutual funds, index funds, risk tolerance, portfolio allocation</p>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-400 font-medium bg-gray-200 px-2 py-1 rounded">🔒 Complete Chapter 4</span>
                <button className="bg-gray-300 text-gray-500 px-4 py-2 rounded-lg cursor-not-allowed">
                  Locked
                </button>
              </div>
            </div>

            {/* Chapter 6 - Locked */}
            <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl shadow-lg p-6 border-l-4 border-gray-300">
              <div className="flex items-center mb-3">
                <span className="text-2xl mr-3 opacity-50">🧾</span>
                <h4 className="text-lg font-bold text-gray-500">Taxes & Planning</h4>
              </div>
              <p className="text-gray-500 mb-4">Tax brackets, deductions, credits, W-4s, tax-advantaged accounts</p>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-400 font-medium bg-gray-200 px-2 py-1 rounded">🔒 Complete Chapter 5</span>
                <button className="bg-gray-300 text-gray-500 px-4 py-2 rounded-lg cursor-not-allowed">
                  Locked
                </button>
              </div>
            </div>
          </div>

          {/* Show More Button */}
          <div className="text-center">
            <details className="inline-block">
              <summary className="bg-gradient-to-r from-purple-100 to-pink-100 text-purple-800 px-6 py-3 rounded-lg cursor-pointer hover:from-purple-200 hover:to-pink-200 transition-all font-medium">
                📚 View All 10 Chapters (4 More)
              </summary>
              <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg p-4 border border-gray-200">
                  <span className="text-lg mr-2 opacity-50">🛡️</span>
                  <h5 className="font-semibold text-gray-500 text-sm">Insurance & Protection</h5>
                  <p className="text-xs text-gray-400 mt-1">Health, auto, life, disability insurance</p>
                </div>
                <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg p-4 border border-gray-200">
                  <span className="text-lg mr-2 opacity-50">🏠</span>
                  <h5 className="font-semibold text-gray-500 text-sm">Real Estate Finance</h5>
                  <p className="text-xs text-gray-400 mt-1">Mortgages, down payments, rent vs buy</p>
                </div>
                <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg p-4 border border-gray-200">
                  <span className="text-lg mr-2 opacity-50">📊</span>
                  <h5 className="font-semibold text-gray-500 text-sm">Economic Concepts</h5>
                  <p className="text-xs text-gray-400 mt-1">Inflation, interest rates, market cycles</p>
                </div>
                <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg p-4 border border-gray-200">
                  <span className="text-lg mr-2 opacity-50">🏖️</span>
                  <h5 className="font-semibold text-gray-500 text-sm">Advanced Planning</h5>
                  <p className="text-xs text-gray-400 mt-1">Retirement, estate basics, financial independence</p>
                </div>
              </div>
            </details>
          </div>
        </div>

        {/* Featured Interactive Tools */}
        <div className="bg-gradient-to-r from-white to-blue-50 rounded-2xl shadow-xl p-8 mb-16 border border-blue-100">
          <div className="text-center mb-8">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">🧮 Interactive Financial Tools</h3>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Experience the power of financial concepts through hands-on calculators with real-time feedback
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Compound Interest Calculator */}
            <div className="group bg-gradient-to-br from-green-50 to-emerald-100 rounded-xl p-6 border border-green-200 hover:shadow-lg transition-all transform hover:scale-105">
              <div className="flex items-center mb-4">
                <div className="bg-green-500 text-white p-3 rounded-lg mr-4 group-hover:bg-green-600 transition-colors">
                  <span className="text-2xl">�</span>
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
                <button className="w-full bg-green-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-green-600 transition-all text-sm">
                  Start Building Wealth
                </button>
              </Link>
            </div>
            
            {/* Budget Builder Calculator */}
            <div className="group bg-gradient-to-br from-blue-50 to-indigo-100 rounded-xl p-6 border border-blue-200 hover:shadow-lg transition-all transform hover:scale-105">
              <div className="flex items-center mb-4">
                <div className="bg-blue-500 text-white p-3 rounded-lg mr-4 group-hover:bg-blue-600 transition-colors">
                  <span className="text-2xl">📊</span>
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
                  <span className="text-2xl">�</span>
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

          {/* Coming Soon Calculators */}
          <div className="mt-8 pt-6 border-t border-blue-200">
            <p className="text-center text-blue-700 font-medium mb-4">🔮 Coming Soon</p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div className="text-center bg-white bg-opacity-40 rounded-lg p-3">
                <span className="text-2xl block mb-1">🏠</span>
                <p className="text-xs font-medium text-blue-800">Mortgage Calculator</p>
              </div>
              <div className="text-center bg-white bg-opacity-40 rounded-lg p-3">
                <span className="text-2xl block mb-1">🏖️</span>
                <p className="text-xs font-medium text-blue-800">Retirement Planner</p>
              </div>
              <div className="text-center bg-white bg-opacity-40 rounded-lg p-3">
                <span className="text-2xl block mb-1">�</span>
                <p className="text-xs font-medium text-blue-800">Auto Loan Calculator</p>
              </div>
            </div>
          </div>
        </div>

        {/* AI-Powered Features Section */}
        <div className="bg-gradient-to-r from-purple-50 to-indigo-100 rounded-2xl shadow-xl p-8 mb-16 border border-purple-200">
          <div className="text-center mb-8">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">🤖 AI-Powered Learning Experience</h3>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Unlike other platforms with simulated chatbots, we use real OpenAI GPT-4o-mini for personalized financial coaching
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-xl p-6 shadow-lg border border-purple-100">
              <div className="bg-purple-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <span className="text-2xl">🧠</span>
              </div>
              <h4 className="text-lg font-bold text-gray-900 mb-2">Contextual AI Coaching</h4>
              <p className="text-gray-600 text-sm leading-relaxed">
                Our AI knows your learning progress, quiz scores, and struggling topics to provide personalized guidance exactly when you need it.
              </p>
            </div>
            
            <div className="bg-white rounded-xl p-6 shadow-lg border border-purple-100">
              <div className="bg-blue-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <span className="text-2xl">📊</span>
              </div>
              <h4 className="text-lg font-bold text-gray-900 mb-2">Progress Tracking</h4>
              <p className="text-gray-600 text-sm leading-relaxed">
                Every lesson completed, calculator used, and quiz taken is tracked across sessions with persistent localStorage and analytics.
              </p>
            </div>
            
            <div className="bg-white rounded-xl p-6 shadow-lg border border-purple-100">
              <div className="bg-green-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <span className="text-2xl">💬</span>
              </div>
              <h4 className="text-lg font-bold text-gray-900 mb-2">Ask Anything</h4>
              <p className="text-gray-600 text-sm leading-relaxed">
                Got a financial question? Ask our AI assistant anytime during lessons. It's disabled during quizzes to maintain assessment integrity.
              </p>
            </div>
          </div>
        </div>

        {/* Impact Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-center mb-16">
          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-red-500">
            <div className="text-4xl font-bold text-red-600 mb-2">64%</div>
            <p className="text-gray-600 text-sm">of Americans can't pass a basic financial literacy test</p>
            <p className="text-xs text-red-500 mt-2 font-medium">The problem we're solving</p>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-green-500">
            <div className="text-4xl font-bold text-green-600 mb-2">80%+</div>
            <p className="text-gray-600 text-sm">mastery rate required to unlock next chapter</p>
            <p className="text-xs text-green-500 mt-2 font-medium">Real learning outcomes</p>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-purple-500">
            <div className="text-4xl font-bold text-purple-600 mb-2">10</div>
            <p className="text-gray-600 text-sm">comprehensive chapters covering all financial basics</p>
            <p className="text-xs text-purple-500 mt-2 font-medium">Complete curriculum</p>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-blue-500">
            <div className="text-4xl font-bold text-blue-600 mb-2">Real</div>
            <p className="text-gray-600 text-sm">OpenAI GPT-4o-mini integration, not simulated chatbots</p>
            <p className="text-xs text-blue-500 mt-2 font-medium">Genuine AI coaching</p>
          </div>
        </div>
      </main>
    </div>
  );
}
