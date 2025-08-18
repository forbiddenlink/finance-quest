'use client';

import React from 'react';
import { FileText, Download, Share2, Link2 } from 'lucide-react';
import { theme } from '@/lib/theme';
import toast from 'react-hot-toast';
import { SavingsResults } from '../types';

interface ExportSectionProps {
  results: SavingsResults;
  exportToPDF: () => void;
  exportToCSV: () => void;
  shareToSocial: () => void;
  initialDeposit: string;
  monthlyDeposit: string;
  timeYears: string;
  interestRate: string;
}

export const ExportSection: React.FC<ExportSectionProps> = ({
  results,
  exportToPDF,
  exportToCSV,
  shareToSocial,
  initialDeposit,
  monthlyDeposit,
  timeYears,
  interestRate
}) => {
  if (!results) return null;

  return (
    <div className={`${theme.backgrounds.glass} border ${theme.borderColors.primary} rounded-lg p-6`}>
      <h4 className={`${theme.typography.heading5} ${theme.textColors.primary} mb-4`}>
        Export & Share Results
      </h4>
      
      <div className="flex flex-wrap gap-3">
        <button
          onClick={exportToPDF}
          className={`${theme.buttons.secondary} flex items-center space-x-2 px-4 py-2 rounded-lg transition-all hover:bg-slate-700`}
        >
          <FileText className="w-4 h-4" />
          <span>Export PDF Report</span>
        </button>
        
        <button
          onClick={exportToCSV}
          className={`${theme.buttons.secondary} flex items-center space-x-2 px-4 py-2 rounded-lg transition-all hover:bg-slate-700`}
        >
          <Download className="w-4 h-4" />
          <span>Download CSV</span>
        </button>
        
        <button
          onClick={shareToSocial}
          className={`${theme.buttons.secondary} flex items-center space-x-2 px-4 py-2 rounded-lg transition-all hover:bg-slate-700`}
        >
          <Share2 className="w-4 h-4" />
          <span>Share Results</span>
        </button>
        
        <button
          onClick={() => {
            const link = `${window.location.origin}/calculators/savings?initial=${initialDeposit}&monthly=${monthlyDeposit}&years=${timeYears}&rate=${interestRate}`;
            navigator.clipboard.writeText(link);
            toast.success('Calculator link copied to clipboard!');
          }}
          className={`${theme.buttons.secondary} flex items-center space-x-2 px-4 py-2 rounded-lg transition-all hover:bg-slate-700`}
        >
          <Link2 className="w-4 h-4" />
          <span>Copy Link</span>
        </button>
      </div>
      
      <div className="mt-4 pt-4 border-t border-slate-700">
        <p className={`text-sm ${theme.textColors.secondary}`}>
          Share your savings plan with friends or save for future reference
        </p>
      </div>
    </div>
  );
};

