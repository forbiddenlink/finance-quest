'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Bell, Clock, Target } from 'lucide-react';
import { MonitoringPreference } from '../types';
import {
  MONITORING_FREQUENCIES,
  NOTIFICATION_TYPES,
  BUREAU_INFO,
  ALERT_TYPE_INFO
} from '../constants';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface PreferencesSectionProps {
  preferences: MonitoringPreference;
  onUpdatePreferences: (prefs: Partial<MonitoringPreference>) => void;
}

export default function PreferencesSection({
  preferences,
  onUpdatePreferences
}: PreferencesSectionProps) {
  return (
    <section className="space-y-4">
      <h3 className="text-xl font-semibold">Monitoring Preferences</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Monitoring Frequency */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Clock className="w-5 h-5 text-blue-500" />
                <span>Monitoring Frequency</span>
              </CardTitle>
              <CardDescription>How often to check for changes</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Select
                  value={preferences.frequency}
                  onValueChange={(value: any) => onUpdatePreferences({
                    frequency: value
                  })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(MONITORING_FREQUENCIES).map(([key, freq]) => (
                      <SelectItem key={key} value={key}>
                        {freq.label} - {freq.description}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <div className="text-sm">
                  <div className="font-medium">Recommended for:</div>
                  <ul className="mt-1 space-y-1">
                    {MONITORING_FREQUENCIES[preferences.frequency].recommendedFor.map((rec, i) => (
                      <li key={i}>• {rec}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Notification Types */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Bell className="w-5 h-5 text-blue-500" />
                <span>Notification Types</span>
              </CardTitle>
              <CardDescription>How you want to be notified</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Object.entries(NOTIFICATION_TYPES).map(([type, info]) => (
                  <div key={type} className="flex items-start space-x-2">
                    <input
                      type="checkbox"
                      checked={preferences.notificationTypes.includes(type as any)}
                      onChange={(e) => {
                        const types = e.target.checked
                          ? [...preferences.notificationTypes, type]
                          : preferences.notificationTypes.filter(t => t !== type);
                        onUpdatePreferences({ notificationTypes: types as any[] });
                      }}
                      className="mt-1"
                    />
                    <div>
                      <div className="font-medium">{info.label}</div>
                      <div className="text-sm text-gray-600">{info.description}</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Alert Thresholds */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Target className="w-5 h-5 text-blue-500" />
                <span>Alert Thresholds</span>
              </CardTitle>
              <CardDescription>When to trigger alerts</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <Label>Score Change</Label>
                  <div className="flex items-center space-x-2">
                    <Input
                      type="number"
                      value={preferences.alertThresholds.scoreChange}
                      onChange={(e) => onUpdatePreferences({
                        alertThresholds: {
                          ...preferences.alertThresholds,
                          scoreChange: parseInt(e.target.value)
                        }
                      })}
                    />
                    <span>points</span>
                  </div>
                </div>

                <div>
                  <Label>Balance Change</Label>
                  <div className="flex items-center space-x-2">
                    <Input
                      type="number"
                      value={preferences.alertThresholds.balanceChange}
                      onChange={(e) => onUpdatePreferences({
                        alertThresholds: {
                          ...preferences.alertThresholds,
                          balanceChange: parseInt(e.target.value)
                        }
                      })}
                    />
                    <span>dollars</span>
                  </div>
                </div>

                <div>
                  <Label>Utilization Change</Label>
                  <div className="flex items-center space-x-2">
                    <Input
                      type="number"
                      value={preferences.alertThresholds.utilizationChange}
                      onChange={(e) => onUpdatePreferences({
                        alertThresholds: {
                          ...preferences.alertThresholds,
                          utilizationChange: parseInt(e.target.value)
                        }
                      })}
                    />
                    <span>percent</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Monitored Items */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Monitored Items</CardTitle>
              <CardDescription>What to monitor</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <Label>Credit Bureaus</Label>
                  <div className="mt-2 space-y-2">
                    {Object.entries(BUREAU_INFO).map(([bureau, info]) => (
                      <div key={bureau} className="flex items-start space-x-2">
                        <input
                          type="checkbox"
                          checked={preferences.monitoredBureaus.includes(bureau as any)}
                          onChange={(e) => {
                            const bureaus = e.target.checked
                              ? [...preferences.monitoredBureaus, bureau]
                              : preferences.monitoredBureaus.filter(b => b !== bureau);
                            onUpdatePreferences({ monitoredBureaus: bureaus as any[] });
                          }}
                          className="mt-1"
                        />
                        <div>
                          <div className="font-medium">{info.name}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <Label>Alert Types</Label>
                  <div className="mt-2 space-y-2">
                    {Object.entries(ALERT_TYPE_INFO).map(([type, info]) => (
                      <div key={type} className="flex items-start space-x-2">
                        <input
                          type="checkbox"
                          checked={preferences.alertTypes.includes(type as any)}
                          onChange={(e) => {
                            const types = e.target.checked
                              ? [...preferences.alertTypes, type]
                              : preferences.alertTypes.filter(t => t !== type);
                            onUpdatePreferences({ alertTypes: types as any[] });
                          }}
                          className="mt-1"
                        />
                        <div>
                          <div className="font-medium">{info.name}</div>
                          <div className="text-sm text-gray-600">{info.description}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  );
}
