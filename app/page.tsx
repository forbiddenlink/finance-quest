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
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Master Your Money, Master Your Future
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Learn financial literacy from zero to hero through interactive lessons, 
            hands-on calculators, and real-world scenarios. No prior knowledge required!
          </p>
        </div>

        {/* Chapter Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-500">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Chapter 1: Money Fundamentals</h3>
            <p className="text-gray-600 mb-4">Income, banking, and paycheck basics</p>
            <div className="flex items-center justify-between">
              <span className="text-sm text-blue-600 font-medium">Available Now</span>
              <Link href="/chapter1">
                <button className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors">
                  Start Learning
                </button>
              </Link>
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg shadow-md p-6 border-l-4 border-gray-300">
            <h3 className="text-lg font-semibold text-gray-500 mb-2">Chapter 2: Budgeting Mastery</h3>
            <p className="text-gray-500 mb-4">50/30/20 rule, expense tracking, emergency funds</p>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-400 font-medium">Locked</span>
              <button className="bg-gray-300 text-gray-500 px-4 py-2 rounded-md cursor-not-allowed">
                Complete Chapter 1
              </button>
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg shadow-md p-6 border-l-4 border-gray-300">
            <h3 className="text-lg font-semibold text-gray-500 mb-2">Chapter 3: Debt & Credit</h3>
            <p className="text-gray-500 mb-4">Credit scores, good vs bad debt, loan strategies</p>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-400 font-medium">Locked</span>
              <button className="bg-gray-300 text-gray-500 px-4 py-2 rounded-md cursor-not-allowed">
                Complete Chapter 2
              </button>
            </div>
          </div>
        </div>

        {/* Featured Calculator Preview */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">Try Our Interactive Calculators</h3>
          <p className="text-gray-600 mb-6">
            Experience the power of compound interest and see your money grow over time
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gradient-to-r from-green-100 to-emerald-100 rounded-lg p-6">
              <h4 className="text-lg font-semibold mb-2 text-green-900">💰 Compound Interest Calculator</h4>
              <p className="text-green-800 mb-4">See how your savings can grow exponentially over time</p>
              <Link href="/calculators/compound-interest">
                <button className="bg-green-500 text-white px-6 py-3 rounded-md hover:bg-green-600 transition-colors">
                  Build Your Wealth
                </button>
              </Link>
            </div>
            
            <div className="bg-gradient-to-r from-blue-100 to-cyan-100 rounded-lg p-6">
              <h4 className="text-lg font-semibold mb-2 text-blue-900">🧮 Paycheck Calculator</h4>
              <p className="text-blue-800 mb-4">Understand gross vs net pay and tax deductions</p>
              <Link href="/calculators/paycheck">
                <button className="bg-blue-500 text-white px-6 py-3 rounded-md hover:bg-blue-600 transition-colors">
                  Calculate Take-Home
                </button>
              </Link>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="text-3xl font-bold text-blue-600 mb-2">64%</div>
            <p className="text-gray-600">of Americans can't pass a basic financial literacy test</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="text-3xl font-bold text-green-600 mb-2">80%+</div>
            <p className="text-gray-600">mastery rate required to unlock next chapter</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="text-3xl font-bold text-purple-600 mb-2">5</div>
            <p className="text-gray-600">comprehensive chapters covering all financial basics</p>
          </div>
        </div>
      </main>
    </div>
  );
}
