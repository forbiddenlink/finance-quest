'use client';

import { motion } from 'framer-motion';
import { theme } from '@/lib/theme';
import { DollarSign, TrendingUp, Zap } from 'lucide-react';

interface SavingsImpactVisualizerProps {
  currentRate: number;
  optimizedRate: number;
  amount: number;
  years: number;
}

export default function SavingsImpactVisualizer({ 
  currentRate, 
  optimizedRate, 
  amount, 
  years 
}: SavingsImpactVisualizerProps) {
  const currentEarnings = amount * (currentRate / 100) * years;
  const optimizedEarnings = amount * (optimizedRate / 100) * years;
  const extraEarnings = optimizedEarnings - currentEarnings;

  return (
    <div className={`p-6 ${theme.backgrounds.cardHover} border ${theme.borderColors.primary} rounded-lg`}>
      <h4 className={`text-lg font-bold ${theme.textColors.primary} mb-4 flex items-center gap-2`}>
        <Zap className="w-5 h-5 text-yellow-400" />
        Smart Banking Impact Visualizer
      </h4>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Current Bank */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className={`p-4 ${theme.status.error.bg} rounded-lg text-center relative overflow-hidden`}
        >
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-red-500/20 to-transparent"
            animate={{ x: ['-100%', '100%'] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          />
          <DollarSign className={`w-8 h-8 ${theme.status.error.text} mx-auto mb-2 relative z-10`} />
          <h5 className={`font-bold ${theme.status.error.text} mb-1 relative z-10`}>Current Bank</h5>
          <div className={`text-2xl font-bold ${theme.status.error.text} relative z-10`}>
            ${currentEarnings.toFixed(0)}
          </div>
          <div className={`text-xs ${theme.status.error.text} relative z-10`}>
            {currentRate}% APY over {years} years
          </div>
        </motion.div>

        {/* Optimized Bank */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className={`p-4 ${theme.status.success.bg} rounded-lg text-center relative overflow-hidden`}
        >
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-green-500/20 to-transparent"
            animate={{ x: ['-100%', '100%'] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          />
          <TrendingUp className={`w-8 h-8 ${theme.status.success.text} mx-auto mb-2 relative z-10`} />
          <h5 className={`font-bold ${theme.status.success.text} mb-1 relative z-10`}>Optimized Bank</h5>
          <div className={`text-2xl font-bold ${theme.status.success.text} relative z-10`}>
            ${optimizedEarnings.toFixed(0)}
          </div>
          <div className={`text-xs ${theme.status.success.text} relative z-10`}>
            {optimizedRate}% APY over {years} years
          </div>
        </motion.div>

        {/* Extra Earnings */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, type: "spring" }}
          className={`p-4 ${theme.status.info.bg} rounded-lg text-center relative overflow-hidden`}
        >
          <motion.div
            animate={{ 
              scale: [1, 1.1, 1],
              opacity: [0.3, 0.6, 0.3]
            }}
            transition={{ duration: 2, repeat: Infinity }}
            className="absolute inset-0 bg-blue-500/20 rounded-lg"
          />
          <motion.div
            animate={{ rotate: [0, 360] }}
            transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
            className="relative z-10"
          >
            <Zap className={`w-8 h-8 ${theme.status.info.text} mx-auto mb-2`} />
          </motion.div>
          <h5 className={`font-bold ${theme.status.info.text} mb-1 relative z-10`}>Extra Earnings</h5>
          <div className={`text-2xl font-bold ${theme.status.info.text} relative z-10`}>
            +${extraEarnings.toFixed(0)}
          </div>
          <div className={`text-xs ${theme.status.info.text} relative z-10`}>
            Free money from smart choice!
          </div>
        </motion.div>
      </div>

      {/* Impact Statement */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className={`mt-6 p-4 ${theme.backgrounds.card} rounded-lg text-center`}
      >
        <p className={`font-bold ${theme.textColors.primary} text-lg`}>
          💡 Smart banking choice earns you an extra{' '}
          <span className={`${theme.status.success.text}`}>
            ${extraEarnings.toFixed(0)}
          </span>
          {' '}over {years} years!
        </p>
        <p className={`text-sm ${theme.textColors.secondary} mt-2`}>
          That&apos;s like getting paid ${(extraEarnings / years).toFixed(0)} per year for 5 minutes of research.
        </p>
      </motion.div>
    </div>
  );
}
