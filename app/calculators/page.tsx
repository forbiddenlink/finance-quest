import CompoundInterestCalculator from '@/components/shared/calculators/CompoundInterestCalculator';
import Link from 'next/link';

export default function CalculatorsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
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
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Interactive Financial Tools
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Experiment with different scenarios and see how financial decisions impact your future
          </p>
        </div>

        <CompoundInterestCalculator />
      </main>
    </div>
  );
}
