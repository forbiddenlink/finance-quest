'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle } from 'lucide-react';
import { useCreditReportAnalyzer } from './useCreditReportAnalyzer';
import PersonalInfoSection from './components/PersonalInfoSection';
import AccountsSection from './components/AccountsSection';
import InquiriesSection from './components/InquiriesSection';
import PublicRecordsSection from './components/PublicRecordsSection';
import AlertsSection from './components/AlertsSection';
import AnalysisSection from './components/AnalysisSection';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function CreditReportAnalyzer() {
  const [state, actions] = useCreditReportAnalyzer();

  return (
    <div className="space-y-8">
      {/* Personal Information */}
      <PersonalInfoSection
        info={state.personalInfo}
        onUpdate={actions.updatePersonalInfo}
      />

      {/* Credit Accounts */}
      <AccountsSection
        accounts={state.accounts}
        onAddAccount={actions.addAccount}
        onRemoveAccount={actions.removeAccount}
        onUpdateAccount={actions.updateAccount}
        onAddDispute={actions.addDispute}
      />

      {/* Credit Inquiries */}
      <InquiriesSection
        inquiries={state.inquiries}
        onAddInquiry={actions.addInquiry}
        onRemoveInquiry={actions.removeInquiry}
      />

      {/* Public Records */}
      <PublicRecordsSection
        records={state.publicRecords}
        onAddRecord={actions.addPublicRecord}
        onRemoveRecord={actions.removePublicRecord}
        onUpdateRecord={actions.updatePublicRecord}
      />

      {/* Active Alerts */}
      <AlertsSection
        alerts={state.alerts}
        onUpdateAlertStatus={actions.updateAlertStatus}
      />

      {/* Analysis */}
      {state.analysis && (
        <AnalysisSection
          analysis={state.analysis}
          discrepancies={state.discrepancies}
        />
      )}

      {/* Validation Errors */}
      {state.errors.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="border-red-300 bg-red-50">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-red-600">
                <AlertTriangle className="w-5 h-5" />
                <span>Validation Errors</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {state.errors.map((error, index) => (
                  <li key={index} className="text-red-600">
                    • {error.message}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Advanced Options */}
      <div className="flex justify-end">
        <Button
          variant="outline"
          onClick={() => actions.setShowAdvancedOptions(!state.showAdvancedOptions)}
        >
          {state.showAdvancedOptions ? 'Hide' : 'Show'} Advanced Options
        </Button>
      </div>
    </div>
  );
}
