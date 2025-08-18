'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Target, DollarSign, TrendingDown, TrendingUp } from 'lucide-react';
import { theme } from '@/lib/theme';
import { ResultCard } from '@/components/shared/calculators/ResultComponents';
import { SavingsResults, ViewMode } from '../types';

interface ResultsSectionProps {
  results: SavingsResults;
  viewMode: ViewMode;
}

export const ResultsSection: React.FC<ResultsSectionProps> = ({ results, viewMode }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <motion.div whileHover={{ scale: 1.02 }} transition={{ type: "spring", stiffness: 300 }}>
        <ResultCard
          icon={Target}
          label="Future Value"
          value={results.futureValue}
          format="currency"
          variant="success"
        />
      </motion.div>
      
      <motion.div whileHover={{ scale: 1.02 }} transition={{ type: "spring", stiffness: 300 }}>
        <ResultCard
          icon={DollarSign}
          label="Interest Earned"
          value={results.interestEarned}
          format="currency"
          variant="info"
        />
      </motion.div>
      
      {viewMode === 'advanced' && (
        <motion.div whileHover={{ scale: 1.02 }} transition={{ type: "spring", stiffness: 300 }}>
          <ResultCard
            icon={TrendingDown}
            label="Real Value (Inflation-Adj)"
            value={results.realValue}
            format="currency"
            variant="warning"
          />
        </motion.div>
      )}
      
      <motion.div whileHover={{ scale: 1.02 }} transition={{ type: "spring", stiffness: 300 }}>
        <ResultCard
          icon={TrendingUp}
          label="Growth Multiplier"
          value={results.totalDeposited > 0 ? (results.futureValue / results.totalDeposited) : 1}
          format="number"
          variant="success"
        />
      </motion.div>
    </div>
  );
};

