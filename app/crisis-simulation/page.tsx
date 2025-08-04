'use client';

import { motion } from 'framer-motion';
import CrisisSimulationDashboard from '@/components/shared/ui/CrisisSimulationDashboard';
import { AlertTriangle, Shield, Brain } from 'lucide-react';
import { theme } from '@/lib/theme';

export default function CrisisSimulationPage() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`min-h-screen ${theme.backgrounds.primary} p-6`}
    >
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-amber-500 to-blue-500 rounded-full mb-6"
          >
            <AlertTriangle className="w-10 h-10 text-white" />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className={`${theme.typography.heading1} md:text-5xl ${theme.textColors.primary} mb-4`}
          >
            Crisis Simulation Training
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className={`${theme.typography.heading4} ${theme.textColors.secondary} max-w-3xl mx-auto mb-8`}
          >
            Practice handling financial emergencies in a safe environment. Build confidence and learn proven strategies
            for navigating life&apos;s unexpected financial challenges.
          </motion.p>

          {/* Key Benefits */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-12"
          >
            <div className={`${theme.backgrounds.card} border ${theme.borderColors.primary} rounded-lg ${theme.spacing.md}`}>
              <Shield className={`w-8 h-8 ${theme.textColors.primary} mx-auto mb-3`} />
              <h3 className={`font-bold ${theme.textColors.primary} mb-2`}>Safe Practice</h3>
              <p className={`${theme.typography.caption} ${theme.textColors.secondary}`}>
                Learn from mistakes without real financial consequences
              </p>
            </div>

            <div className={`${theme.backgrounds.card} border ${theme.borderColors.primary} rounded-lg ${theme.spacing.md}`}>
              <Brain className="w-8 h-8 text-blue-400 mx-auto mb-3" />
              <h3 className={`font-bold ${theme.textColors.primary} mb-2`}>Build Confidence</h3>
              <p className={`${theme.typography.caption} ${theme.textColors.secondary}`}>
                Develop decision-making skills for high-pressure situations
              </p>
            </div>

            <div className={`${theme.backgrounds.card} border ${theme.borderColors.primary} rounded-lg ${theme.spacing.md}`}>
              <AlertTriangle className={`w-8 h-8 ${theme.textColors.muted} mx-auto mb-3`} />
              <h3 className={`font-bold ${theme.textColors.primary} mb-2`}>Real Scenarios</h3>
              <p className={`${theme.typography.caption} ${theme.textColors.secondary}`}>
                Practice with realistic crisis situations you might face
              </p>
            </div>
          </motion.div>
        </div>

        {/* Main Dashboard */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <CrisisSimulationDashboard />
        </motion.div>
      </div>
    </motion.div>
  );
}
