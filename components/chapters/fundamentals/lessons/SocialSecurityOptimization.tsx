'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Calculator, Users, DollarSign, TrendingUp, Info } from 'lucide-react';
import { theme } from '@/lib/theme';
import GradientCard from '@/components/shared/ui/GradientCard';

interface SocialSecurityOptimizationProps {
  className?: string;
}

interface ClaimingStrategy {
  age: number;
  monthlyBenefit: number;
  lifetime62: number;
  lifetime67: number;
  lifetime70: number;
  breakEven: string;
}

export default function SocialSecurityOptimization({ className = '' }: SocialSecurityOptimizationProps) {
  const [birthYear, setBirthYear] = useState(1980);
  const [estimatedBenefit, setEstimatedBenefit] = useState(2800);
  const [lifeExpectancy, setLifeExpectancy] = useState(85);
  const [spouseAge, setSpouseAge] = useState('');
  const [spouseBenefit, setSpouseBenefit] = useState(1800);
  const [marriedFiling, setMarriedFiling] = useState(false);
  const [showResults, setShowResults] = useState(false);

  // Calculate Full Retirement Age based on birth year
  const getFullRetirementAge = (year: number): number => {
    if (year <= 1937) return 65;
    if (year <= 1942) return 65 + (year - 1937) * 2 / 12;
    if (year <= 1954) return 66;
    if (year <= 1959) return 66 + (year - 1954) * 2 / 12;
    return 67;
  };

  const fullRetirementAge = getFullRetirementAge(birthYear);

  // Calculate benefits at different claiming ages
  const calculateBenefits = (): ClaimingStrategy[] => {
    const fra = fullRetirementAge;
    const baseMonthly = estimatedBenefit;

    const strategies: ClaimingStrategy[] = [];

    // Age 62 (early claiming)
    const age62Monthly = baseMonthly * 0.75; // 25% reduction
    const age62Lifetime = age62Monthly * (lifeExpectancy - 62) * 12;

    // Full Retirement Age
    const fraMonthly = baseMonthly;
    const fraLifetime = baseMonthly * (lifeExpectancy - fra) * 12;

    // Age 70 (delayed retirement credits)
    const age70Monthly = baseMonthly * 1.32; // 32% increase (8% per year * 4 years)
    const age70Lifetime = age70Monthly * (lifeExpectancy - 70) * 12;

    strategies.push(
      {
        age: 62,
        monthlyBenefit: age62Monthly,
        lifetime62: age62Lifetime,
        lifetime67: fraLifetime,
        lifetime70: age70Lifetime,
        breakEven: 'Age 77'
      },
      {
        age: fra,
        monthlyBenefit: fraMonthly,
        lifetime62: age62Lifetime,
        lifetime67: fraLifetime,
        lifetime70: age70Lifetime,
        breakEven: 'Age 80'
      },
      {
        age: 70,
        monthlyBenefit: age70Monthly,
        lifetime62: age62Lifetime,
        lifetime67: fraLifetime,
        lifetime70: age70Lifetime,
        breakEven: 'Age 83'
      }
    );

    return strategies;
  };

  // Generate chart data for lifetime benefits
  const generateChartData = () => {
    const strategies = calculateBenefits();
    const chartData = [];

    for (let age = 62; age <= lifeExpectancy; age++) {
      const data: { age: number;[key: string]: number } = { age };

      // Age 62 claiming
      if (age >= 62) {
        data.claimAt62 = strategies[0].monthlyBenefit * (age - 62 + 1) * 12;
      }

      // FRA claiming
      if (age >= fullRetirementAge) {
        data.claimAtFRA = strategies[1].monthlyBenefit * (age - fullRetirementAge + 1) * 12;
      }

      // Age 70 claiming
      if (age >= 70) {
        data.claimAt70 = strategies[2].monthlyBenefit * (age - 70 + 1) * 12;
      }

      chartData.push(data);
    }

    return chartData;
  };

  const handleCalculate = () => {
    setShowResults(true);
  };

  const strategies = calculateBenefits();
  const chartData = generateChartData();

  // Determine optimal strategy
  const getOptimalStrategy = () => {
    if (lifeExpectancy < 77) return { age: 62, reason: 'Early claiming maximizes total benefits for shorter lifespans' };
    if (lifeExpectancy < 80) return { age: fullRetirementAge, reason: 'Full benefits balance risk and reward' };
    return { age: 70, reason: 'Delayed claiming maximizes lifetime benefits for longer lifespans' };
  };

  const optimal = getOptimalStrategy();

  return (
    <div className={`space-y-6 ${className}`}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <GradientCard variant="glass" gradient="blue" className="p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className={`${theme.status.info.bg} p-3 rounded-lg`}>
              <Users className={`w-6 h-6 ${theme.status.info.text}`} />
            </div>
            <div>
              <h3 className={`text-2xl font-bold ${theme.textColors.primary}`}>
                Social Security Claiming Strategy Optimizer
              </h3>
              <p className={`${theme.textColors.secondary}`}>
                Find your optimal claiming age to maximize lifetime Social Security benefits
              </p>
            </div>
          </div>

          {/* Input Form */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
            <div>
              <label className={`block text-sm font-medium ${theme.textColors.primary} mb-2`}>
                Birth Year
              </label>
              <input
                type="number"
                value={birthYear}
                onChange={(e) => setBirthYear(parseInt(e.target.value) || 1980)}
                min="1940"
                max="2000"
                placeholder="1980"
                aria-label="Birth year for retirement calculation"
                className={`w-full px-4 py-3 ${theme.backgrounds.card} border ${theme.borderColors.muted} rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 ${theme.textColors.primary}`}
              />
            </div>

            <div>
              <label className={`block text-sm font-medium ${theme.textColors.primary} mb-2`}>
                Estimated Monthly Benefit at FRA
              </label>
              <div className="relative">
                <DollarSign className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 ${theme.textColors.muted}`} />
                <input
                  type="number"
                  value={estimatedBenefit}
                  onChange={(e) => setEstimatedBenefit(parseInt(e.target.value) || 2800)}
                  min="500"
                  max="5000"
                  placeholder="2800"
                  aria-label="Estimated monthly Social Security benefit at full retirement age"
                  className={`w-full pl-12 pr-4 py-3 ${theme.backgrounds.card} border ${theme.borderColors.muted} rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 ${theme.textColors.primary}`}
                />
              </div>
            </div>

            <div>
              <label className={`block text-sm font-medium ${theme.textColors.primary} mb-2`}>
                Life Expectancy
              </label>
              <input
                type="number"
                value={lifeExpectancy}
                onChange={(e) => setLifeExpectancy(parseInt(e.target.value) || 85)}
                min="70"
                max="100"
                placeholder="85"
                aria-label="Estimated life expectancy"
                className={`w-full px-4 py-3 ${theme.backgrounds.card} border ${theme.borderColors.muted} rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 ${theme.textColors.primary}`}
              />
            </div>

            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="married"
                checked={marriedFiling}
                onChange={(e) => setMarriedFiling(e.target.checked)}
                className="w-5 h-5 text-blue-500 rounded focus:ring-2 focus:ring-blue-500/20"
              />
              <label htmlFor="married" className={`text-sm font-medium ${theme.textColors.primary}`}>
                Married (considering spousal benefits)
              </label>
            </div>

            {marriedFiling && (
              <>
                <div>
                  <label className={`block text-sm font-medium ${theme.textColors.primary} mb-2`}>
                    Spouse Current Age
                  </label>
                  <input
                    type="number"
                    value={spouseAge}
                    onChange={(e) => setSpouseAge(e.target.value)}
                    min="55"
                    max="75"
                    placeholder="65"
                    aria-label="Spouse current age"
                    className={`w-full px-4 py-3 ${theme.backgrounds.card} border ${theme.borderColors.muted} rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 ${theme.textColors.primary}`}
                  />
                </div>

                <div>
                  <label className={`block text-sm font-medium ${theme.textColors.primary} mb-2`}>
                    Spouse Estimated Benefit
                  </label>
                  <div className="relative">
                    <DollarSign className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 ${theme.textColors.muted}`} />
                    <input
                      type="number"
                      value={spouseBenefit}
                      onChange={(e) => setSpouseBenefit(parseInt(e.target.value) || 1800)}
                      min="500"
                      max="5000"
                      placeholder="1800"
                      aria-label="Spouse estimated monthly benefit"
                      className={`w-full pl-12 pr-4 py-3 ${theme.backgrounds.card} border ${theme.borderColors.muted} rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 ${theme.textColors.primary}`}
                    />
                  </div>
                </div>
              </>
            )}
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleCalculate}
            className={`w-full md:w-auto px-8 py-3 ${theme.buttons.primary} rounded-xl transition-all hover-lift flex items-center justify-center mx-auto`}
          >
            <Calculator className="w-5 h-5 mr-2" />
            Calculate Optimal Strategy
          </motion.button>
        </GradientCard>
      </motion.div>

      <AnimatePresence>
        {showResults && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-6"
          >
            {/* Key Insights */}
            <GradientCard variant="glass" gradient="green" className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <TrendingUp className={`w-6 h-6 ${theme.status.success.text}`} />
                <h4 className={`text-xl font-bold ${theme.textColors.primary}`}>
                  Optimal Strategy Recommendation
                </h4>
              </div>

              <div className={`p-4 ${theme.status.success.bg} border-l-4 ${theme.status.success.border} rounded-lg mb-4`}>
                <p className={`text-lg font-semibold ${theme.status.success.text} mb-2`}>
                  Optimal Claiming Age: {optimal.age} years
                </p>
                <p className={`${theme.textColors.secondary}`}>
                  {optimal.reason}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center">
                  <p className={`text-2xl font-bold ${theme.textColors.primary}`}>
                    {fullRetirementAge}
                  </p>
                  <p className={`text-sm ${theme.textColors.secondary}`}>
                    Your Full Retirement Age
                  </p>
                </div>
                <div className="text-center">
                  <p className={`text-2xl font-bold ${theme.status.success.text}`}>
                    ${strategies[1].monthlyBenefit.toLocaleString()}
                  </p>
                  <p className={`text-sm ${theme.textColors.secondary}`}>
                    Full Monthly Benefit
                  </p>
                </div>
                <div className="text-center">
                  <p className={`text-2xl font-bold ${theme.status.info.text}`}>
                    ${strategies[2].lifetime70.toLocaleString()}
                  </p>
                  <p className={`text-sm ${theme.textColors.secondary}`}>
                    Max Lifetime Benefits (Age 70)
                  </p>
                </div>
              </div>
            </GradientCard>

            {/* Comparison Table */}
            <GradientCard variant="glass" gradient="purple" className="p-6">
              <h4 className={`text-xl font-bold ${theme.textColors.primary} mb-6 text-center`}>
                Claiming Strategy Comparison
              </h4>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className={`border-b ${theme.borderColors.muted}`}>
                      <th className={`text-left py-3 px-4 ${theme.textColors.primary} font-semibold`}>
                        Claiming Age
                      </th>
                      <th className={`text-left py-3 px-4 ${theme.textColors.primary} font-semibold`}>
                        Monthly Benefit
                      </th>
                      <th className={`text-left py-3 px-4 ${theme.textColors.primary} font-semibold`}>
                        Total Lifetime Benefits
                      </th>
                      <th className={`text-left py-3 px-4 ${theme.textColors.primary} font-semibold`}>
                        Break-Even vs Age 62
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {strategies.map((strategy, index) => (
                      <motion.tr
                        key={strategy.age}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className={`border-b ${theme.borderColors.muted} ${strategy.age === optimal.age ? theme.status.success.bg : ''
                          }`}
                      >
                        <td className={`py-3 px-4 ${theme.textColors.primary} font-medium`}>
                          {strategy.age}
                          {strategy.age === optimal.age && (
                            <span className={`ml-2 text-xs ${theme.status.success.text} font-bold`}>
                              OPTIMAL
                            </span>
                          )}
                        </td>
                        <td className={`py-3 px-4 ${theme.textColors.secondary}`}>
                          ${strategy.monthlyBenefit.toLocaleString()}
                        </td>
                        <td className={`py-3 px-4 ${theme.textColors.secondary}`}>
                          ${(strategy.age === 62 ? strategy.lifetime62 :
                            strategy.age === fullRetirementAge ? strategy.lifetime67 :
                              strategy.lifetime70).toLocaleString()}
                        </td>
                        <td className={`py-3 px-4 ${theme.textColors.secondary}`}>
                          {strategy.breakEven}
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </GradientCard>

            {/* Lifetime Benefits Chart */}
            <GradientCard variant="glass" gradient="blue" className="p-6">
              <h4 className={`text-xl font-bold ${theme.textColors.primary} mb-6 text-center`}>
                Cumulative Benefits by Claiming Age
              </h4>

              <div className="h-96">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis
                      dataKey="age"
                      stroke="#9CA3AF"
                      label={{ value: 'Age', position: 'insideBottom', offset: -5 }}
                    />
                    <YAxis
                      stroke="#9CA3AF"
                      tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
                      label={{ value: 'Cumulative Benefits', angle: -90, position: 'insideLeft' }}
                    />
                    <Tooltip
                      formatter={(value: number, name: string) => [
                        `$${value?.toLocaleString() || 0}`,
                        name === 'claimAt62' ? 'Claim at 62' :
                          name === 'claimAtFRA' ? `Claim at ${fullRetirementAge}` :
                            'Claim at 70'
                      ]}
                      labelFormatter={(age) => `Age: ${age}`}
                      contentStyle={{
                        backgroundColor: '#1F2937',
                        border: '1px solid #374151',
                        borderRadius: '8px'
                      }}
                    />
                    <Legend />
                    <Area
                      type="monotone"
                      dataKey="claimAt62"
                      stackId="1"
                      stroke="#EF4444"
                      fill="#EF4444"
                      fillOpacity={0.3}
                      name="Claim at 62"
                    />
                    <Area
                      type="monotone"
                      dataKey="claimAtFRA"
                      stackId="2"
                      stroke="#3B82F6"
                      fill="#3B82F6"
                      fillOpacity={0.3}
                      name={`Claim at ${fullRetirementAge}`}
                    />
                    <Area
                      type="monotone"
                      dataKey="claimAt70"
                      stackId="3"
                      stroke="#10B981"
                      fill="#10B981"
                      fillOpacity={0.3}
                      name="Claim at 70"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </GradientCard>

            {/* Additional Considerations */}
            <GradientCard variant="glass" gradient="yellow" className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <Info className={`w-6 h-6 ${theme.status.warning.text}`} />
                <h4 className={`text-xl font-bold ${theme.textColors.primary}`}>
                  Important Considerations
                </h4>
              </div>

              <div className="space-y-4">
                <div className={`p-4 ${theme.status.info.bg} border-l-4 ${theme.status.info.border} rounded-lg`}>
                  <h5 className={`font-semibold ${theme.status.info.text} mb-2`}>
                    Health & Longevity
                  </h5>
                  <p className={`${theme.textColors.secondary} text-sm`}>
                    If you have health concerns or family history of shorter lifespans, claiming earlier might be beneficial. If you&apos;re healthy with good longevity genetics, delaying often pays off.
                  </p>
                </div>

                <div className={`p-4 ${theme.status.warning.bg} border-l-4 ${theme.status.warning.border} rounded-lg`}>
                  <h5 className={`font-semibold ${theme.status.warning.text} mb-2`}>
                    Financial Need
                  </h5>
                  <p className={`${theme.textColors.secondary} text-sm`}>
                    If you need income immediately and don&apos;t have other retirement savings, claiming at 62 might be necessary despite the reduction in benefits.
                  </p>
                </div>

                <div className={`p-4 ${theme.status.success.bg} border-l-4 ${theme.status.success.border} rounded-lg`}>
                  <h5 className={`font-semibold ${theme.status.success.text} mb-2`}>
                    Working in Retirement
                  </h5>
                  <p className={`${theme.textColors.secondary} text-sm`}>
                    If claiming before full retirement age while working, earnings above $22,320 (2024) reduce benefits by $1 for every $2 earned. Consider delaying if you plan to work.
                  </p>
                </div>
              </div>
            </GradientCard>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
