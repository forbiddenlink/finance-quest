'use client';

import React from 'react';
import { motion } from 'framer-motion';
import {
  LineChart,
  CreditCard,
  Calendar,
  Search,
  FileText,
  AlertTriangle,
  ArrowRight
} from 'lucide-react';
import { ReportAnalysis, Discrepancy } from '../types';
import { REPORT_SECTIONS } from '../constants';
import { formatCurrency, formatPercentage } from '../utils';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';

interface AnalysisSectionProps {
  analysis: ReportAnalysis;
  discrepancies: Discrepancy[];
}

export default function AnalysisSection({
  analysis,
  discrepancies
}: AnalysisSectionProps) {
  return (
    <section className="space-y-8">
      {/* Accounts Analysis */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <CreditCard className="w-5 h-5 text-blue-500" />
              <span>Account Summary</span>
            </CardTitle>
            <CardDescription>Overview of all credit accounts</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Total Accounts</h4>
                  <p className="text-2xl font-bold">{analysis.accounts.total}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Total Balance</h4>
                  <p className="text-2xl font-bold">{formatCurrency(analysis.accounts.totalBalances)}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Credit Utilization</h4>
                  <p className="text-2xl font-bold">{formatPercentage(analysis.accounts.utilization)}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Average Age</h4>
                  <p className="text-2xl font-bold">{Math.round(analysis.accounts.averageAge)} months</p>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium text-gray-500 mb-2">Account Types</h4>
                <div className="grid grid-cols-2 gap-2">
                  {Object.entries(analysis.accounts.byType).map(([type, count]) => (
                    <div key={type} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                      <span>{type.replace('_', ' ').toUpperCase()}</span>
                      <span className="font-medium">{count}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium text-gray-500 mb-2">Account Status</h4>
                <div className="grid grid-cols-2 gap-2">
                  {Object.entries(analysis.accounts.byStatus).map(([status, count]) => (
                    <div key={status} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                      <span>{status.replace('_', ' ').toUpperCase()}</span>
                      <span className="font-medium">{count}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Payment History Analysis */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Calendar className="w-5 h-5 text-blue-500" />
              <span>Payment History</span>
            </CardTitle>
            <CardDescription>Analysis of payment patterns</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Total Payments</h4>
                  <p className="text-2xl font-bold">{analysis.paymentHistory.totalPayments}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500">On-Time Percentage</h4>
                  <p className="text-2xl font-bold">{formatPercentage(analysis.paymentHistory.onTimePercentage)}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Recent Late (30d)</h4>
                  <p className="text-2xl font-bold">{analysis.paymentHistory.latePayments.last30Days}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Late Past Year</h4>
                  <p className="text-2xl font-bold">{analysis.paymentHistory.latePayments.lastYear}</p>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium text-gray-500 mb-2">Late Payment Breakdown</h4>
                <div className="grid grid-cols-3 gap-2">
                  <div className="p-2 bg-gray-50 rounded">
                    <div className="text-sm text-gray-500">30 Days</div>
                    <div className="font-medium">{analysis.paymentHistory.latePayments.last30Days}</div>
                  </div>
                  <div className="p-2 bg-gray-50 rounded">
                    <div className="text-sm text-gray-500">60 Days</div>
                    <div className="font-medium">{analysis.paymentHistory.latePayments.last60Days}</div>
                  </div>
                  <div className="p-2 bg-gray-50 rounded">
                    <div className="text-sm text-gray-500">90 Days</div>
                    <div className="font-medium">{analysis.paymentHistory.latePayments.last90Days}</div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Inquiries Analysis */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Search className="w-5 h-5 text-blue-500" />
              <span>Credit Inquiries</span>
            </CardTitle>
            <CardDescription>Recent applications for credit</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Total Inquiries</h4>
                  <p className="text-2xl font-bold">{analysis.inquiries.total}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Hard Inquiries</h4>
                  <p className="text-2xl font-bold">{analysis.inquiries.hardInquiries}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Recent (12mo)</h4>
                  <p className="text-2xl font-bold">{analysis.inquiries.recentInquiries}</p>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium">Impact Level:</span>
                <span className={`px-2 py-1 rounded text-sm ${
                  analysis.inquiries.impactLevel === 'high' ? 'bg-red-100 text-red-800' :
                  analysis.inquiries.impactLevel === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-green-100 text-green-800'
                }`}>
                  {analysis.inquiries.impactLevel.toUpperCase()}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Public Records Analysis */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <FileText className="w-5 h-5 text-blue-500" />
              <span>Public Records</span>
            </CardTitle>
            <CardDescription>Legal items affecting credit</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Total Records</h4>
                  <p className="text-2xl font-bold">{analysis.publicRecords.total}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Bankruptcies</h4>
                  <p className="text-2xl font-bold">{analysis.publicRecords.bankruptcies}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Tax Liens</h4>
                  <p className="text-2xl font-bold">{analysis.publicRecords.taxLiens}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Collections</h4>
                  <p className="text-2xl font-bold">{analysis.publicRecords.collections}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Discrepancies Analysis */}
      {discrepancies.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <AlertTriangle className="w-5 h-5 text-yellow-500" />
                <span>Report Discrepancies</span>
              </CardTitle>
              <CardDescription>Differences between credit bureau reports</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {discrepancies.map((discrepancy, index) => (
                  <div
                    key={discrepancy.id}
                    className={`p-4 rounded ${
                      discrepancy.impact === 'high' ? 'bg-red-50' :
                      discrepancy.impact === 'medium' ? 'bg-yellow-50' :
                      'bg-blue-50'
                    }`}
                  >
                    <div className="flex items-start space-x-4">
                      <div className="flex-grow">
                        <div className="flex items-center space-x-2">
                          <span className="font-medium">
                            {discrepancy.type.replace('_', ' ').toUpperCase()}
                          </span>
                          <ArrowRight className="w-4 h-4" />
                          <span>{discrepancy.field}</span>
                        </div>
                        <div className="mt-2 grid grid-cols-2 gap-4">
                          <div>
                            <div className="text-sm text-gray-500">{discrepancy.bureau1}</div>
                            <div>{discrepancy.value1}</div>
                          </div>
                          <div>
                            <div className="text-sm text-gray-500">{discrepancy.bureau2}</div>
                            <div>{discrepancy.value2}</div>
                          </div>
                        </div>
                        <div className="mt-2 text-sm">
                          <span className="font-medium">Recommendation:</span>{' '}
                          {discrepancy.recommendation}
                        </div>
                      </div>
                      <div className={`px-2 py-1 rounded text-sm ${
                        discrepancy.impact === 'high' ? 'bg-red-100 text-red-800' :
                        discrepancy.impact === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-blue-100 text-blue-800'
                      }`}>
                        {discrepancy.impact.toUpperCase()}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </section>
  );
}
