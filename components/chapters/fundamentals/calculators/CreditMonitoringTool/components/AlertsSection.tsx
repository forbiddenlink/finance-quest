'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, Bell, Eye, CheckCircle2 } from 'lucide-react';
import { CreditAlert } from '../types';
import { ALERT_TYPE_INFO, STYLE_CONFIG } from '../constants';
import { formatDate } from '../utils';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface AlertsSectionProps {
  alerts: CreditAlert[];
  onUpdateStatus: (id: string, status: CreditAlert['status']) => void;
  onResolveAlert: (id: string, resolution: CreditAlert['resolution']) => void;
}

export default function AlertsSection({
  alerts,
  onUpdateStatus,
  onResolveAlert
}: AlertsSectionProps) {
  const activeAlerts = alerts.filter(alert => alert.status !== 'resolved');
  const resolvedAlerts = alerts.filter(alert => alert.status === 'resolved');

  return (
    <section className="space-y-8">
      {/* Active Alerts */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold">Active Alerts</h3>
        <div className="space-y-4">
          {activeAlerts.map((alert, index) => (
            <motion.div
              key={alert.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className={STYLE_CONFIG[alert.severity].background}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center space-x-2">
                      <AlertTriangle className={STYLE_CONFIG[alert.severity].text} />
                      <span>{ALERT_TYPE_INFO[alert.type].name}</span>
                      <span className={`text-sm px-2 py-1 rounded ${STYLE_CONFIG[alert.severity].background}`}>
                        {alert.severity.toUpperCase()}
                      </span>
                    </CardTitle>
                    {alert.status === 'new' && (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onUpdateStatus(alert.id, 'viewed')}
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                  <CardDescription>
                    {formatDate(alert.date)}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <p>{alert.description}</p>

                    {alert.affectedAccounts && alert.affectedAccounts.length > 0 && (
                      <div>
                        <div className="text-sm font-medium">Affected Accounts:</div>
                        <ul className="mt-1 space-y-1">
                          {alert.affectedAccounts.map((account, i) => (
                            <li key={i} className="text-sm">• {account}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    <div>
                      <div className="text-sm font-medium">Recommended Actions:</div>
                      <ul className="mt-1 space-y-1">
                        {alert.recommendedActions.map((action, i) => (
                          <li key={i} className="text-sm">• {action}</li>
                        ))}
                      </ul>
                    </div>

                    {alert.status !== 'resolved' && (
                      <Button
                        onClick={() => onResolveAlert(alert.id, {
                          date: new Date(),
                          action: 'Reviewed and addressed alert',
                          outcome: 'Alert resolved'
                        })}
                      >
                        Mark as Resolved
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}

          {activeAlerts.length === 0 && (
            <Card className="bg-green-50 border-green-200">
              <CardContent className="pt-6">
                <div className="flex items-center space-x-2 text-green-600">
                  <Bell className="w-5 h-5" />
                  <span>No active alerts at this time</span>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Resolved Alerts */}
      {resolvedAlerts.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-xl font-semibold">Resolved Alerts</h3>
          <div className="space-y-4">
            {resolvedAlerts.map((alert, index) => (
              <motion.div
                key={alert.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="bg-gray-50">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <CheckCircle2 className="w-5 h-5 text-green-500" />
                      <span>{ALERT_TYPE_INFO[alert.type].name}</span>
                    </CardTitle>
                    <CardDescription>
                      Resolved on: {alert.resolution ? formatDate(alert.resolution.date) : 'Unknown'}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <p className="text-sm">{alert.description}</p>
                      {alert.resolution && (
                        <>
                          <div className="text-sm">
                            <span className="font-medium">Action taken:</span> {alert.resolution.action}
                          </div>
                          <div className="text-sm">
                            <span className="font-medium">Outcome:</span> {alert.resolution.outcome}
                          </div>
                        </>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
