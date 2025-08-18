'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle } from 'lucide-react';
import { useCreditMonitoringTool } from './useCreditMonitoringTool';
import ScoreSection from './components/ScoreSection';
import AlertsSection from './components/AlertsSection';
import PreferencesSection from './components/PreferencesSection';
import InsightsSection from './components/InsightsSection';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function CreditMonitoringTool() {
  const [state, actions] = useCreditMonitoringTool();

  return (
    <div className="space-y-8">
      {/* Credit Scores */}
      <ScoreSection
        scores={state.currentScores}
        onUpdateScore={actions.updateScore}
      />

      {/* Credit Alerts */}
      <AlertsSection
        alerts={state.activeAlerts}
        onUpdateStatus={actions.updateAlertStatus}
        onResolveAlert={actions.resolveAlert}
      />

      {/* Score Insights */}
      <InsightsSection
        insights={state.insights}
      />

      {/* Monitoring Preferences */}
      <PreferencesSection
        preferences={state.preferences}
        onUpdatePreferences={actions.updatePreferences}
      />

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
