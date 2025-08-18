'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Bell, AlertTriangle, Shield, Eye } from 'lucide-react';
import { CreditAlert } from '../types';
import { ALERT_TYPE_INFO } from '../constants';
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
  onUpdateAlertStatus: (id: string, status: CreditAlert['status']) => void;
}

export default function AlertsSection({
  alerts,
  onUpdateAlertStatus
}: AlertsSectionProps) {
  const getAlertIcon = (type: CreditAlert['type']) => {
    switch (type) {
      case 'identity_theft':
        return <Shield className="w-5 h-5 text-red-500" />;
      case 'new_account':
        return <Bell className="w-5 h-5 text-yellow-500" />;
      default:
        return <AlertTriangle className="w-5 h-5 text-blue-500" />;
    }
  };

  const getSeverityStyle = (severity: CreditAlert['severity']) => {
    switch (severity) {
      case 'high':
        return 'bg-red-50 border-red-200';
      case 'medium':
        return 'bg-yellow-50 border-yellow-200';
      case 'low':
        return 'bg-blue-50 border-blue-200';
    }
  };

  return (
    <section className="space-y-4">
      <h3 className="text-xl font-semibold">Active Alerts</h3>

      <div className="space-y-4">
        {alerts.map((alert, index) => (
          <motion.div
            key={alert.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <Card className={getSeverityStyle(alert.severity)}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center space-x-2">
                    {getAlertIcon(alert.type)}
                    <span>{ALERT_TYPE_INFO[alert.type].name}</span>
                    <span className={`text-sm px-2 py-1 rounded ${
                      alert.severity === 'high' ? 'bg-red-100 text-red-800' :
                      alert.severity === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-blue-100 text-blue-800'
                    }`}>
                      {alert.severity.toUpperCase()}
                    </span>
                  </CardTitle>
                  {alert.status === 'new' && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onUpdateAlertStatus(alert.id, 'viewed')}
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

                  <div className="space-y-2">
                    <h4 className="font-medium">Recommended Actions:</h4>
                    <ul className="space-y-1">
                      {ALERT_TYPE_INFO[alert.type].actions.map((action, i) => (
                        <li key={i} className="flex items-start space-x-2">
                          <span className="text-blue-500">•</span>
                          <span>{action}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-600">
                      Response Time: {ALERT_TYPE_INFO[alert.type].responseTime}
                    </div>
                    {alert.status !== 'resolved' && (
                      <Button
                        variant="outline"
                        onClick={() => onUpdateAlertStatus(alert.id, 'resolved')}
                      >
                        Mark as Resolved
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {alerts.length === 0 && (
        <Card className="bg-green-50 border-green-200">
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <Shield className="w-5 h-5 text-green-500" />
              <span>No active alerts at this time</span>
            </div>
          </CardContent>
        </Card>
      )}
    </section>
  );
}
