'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { CreditCard, Plus, Trash2 } from 'lucide-react';
import { CreditAccount } from '../types';
import { formatCurrency, formatDate } from '../utils';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface AccountsSectionProps {
  accounts: CreditAccount[];
  onAddAccount: (account: CreditAccount) => void;
  onRemoveAccount: (id: string) => void;
  onUpdateAccount: (id: string, updates: Partial<CreditAccount>) => void;
}

export default function AccountsSection({
  accounts,
  onAddAccount,
  onRemoveAccount,
  onUpdateAccount
}: AccountsSectionProps) {
  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold">Credit Accounts</h3>
        <Button
          onClick={() => {
            onAddAccount({
              id: '',
              type: 'credit_card',
              balance: 0,
              creditLimit: 0,
              openDate: new Date(),
              status: 'open',
              paymentStatus: 'current',
              monthlyPayment: 0,
              interestRate: 0
            });
          }}
          className="flex items-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>Add Account</span>
        </Button>
      </div>

      <div className="space-y-4">
        {accounts.map((account, index) => (
          <motion.div
            key={account.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center space-x-2">
                    <CreditCard className="w-5 h-5 text-blue-500" />
                    <span>{account.type.replace('_', ' ').toUpperCase()}</span>
                  </CardTitle>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onRemoveAccount(account.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
                <CardDescription>
                  Opened {formatDate(account.openDate)}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Account Type</Label>
                    <Select
                      value={account.type}
                      onValueChange={(value: any) => onUpdateAccount(account.id, {
                        type: value
                      })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="credit_card">Credit Card</SelectItem>
                        <SelectItem value="personal_loan">Personal Loan</SelectItem>
                        <SelectItem value="auto_loan">Auto Loan</SelectItem>
                        <SelectItem value="mortgage">Mortgage</SelectItem>
                        <SelectItem value="student_loan">Student Loan</SelectItem>
                        <SelectItem value="retail_card">Retail Card</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Account Status</Label>
                    <Select
                      value={account.status}
                      onValueChange={(value: any) => onUpdateAccount(account.id, {
                        status: value
                      })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="open">Open</SelectItem>
                        <SelectItem value="closed">Closed</SelectItem>
                        <SelectItem value="delinquent">Delinquent</SelectItem>
                        <SelectItem value="collection">In Collections</SelectItem>
                        <SelectItem value="charge_off">Charged Off</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Balance</Label>
                    <Input
                      type="number"
                      value={account.balance}
                      onChange={(e) => onUpdateAccount(account.id, {
                        balance: parseFloat(e.target.value)
                      })}
                    />
                  </div>
                  <div>
                    <Label>Credit Limit</Label>
                    <Input
                      type="number"
                      value={account.creditLimit}
                      onChange={(e) => onUpdateAccount(account.id, {
                        creditLimit: parseFloat(e.target.value)
                      })}
                    />
                  </div>
                  <div>
                    <Label>Monthly Payment</Label>
                    <Input
                      type="number"
                      value={account.monthlyPayment}
                      onChange={(e) => onUpdateAccount(account.id, {
                        monthlyPayment: parseFloat(e.target.value)
                      })}
                    />
                  </div>
                  <div>
                    <Label>Interest Rate (%)</Label>
                    <Input
                      type="number"
                      value={account.interestRate}
                      onChange={(e) => onUpdateAccount(account.id, {
                        interestRate: parseFloat(e.target.value)
                      })}
                    />
                  </div>
                  <div>
                    <Label>Payment Status</Label>
                    <Select
                      value={account.paymentStatus}
                      onValueChange={(value: any) => onUpdateAccount(account.id, {
                        paymentStatus: value
                      })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="current">Current</SelectItem>
                        <SelectItem value="late_30">30 Days Late</SelectItem>
                        <SelectItem value="late_60">60 Days Late</SelectItem>
                        <SelectItem value="late_90">90 Days Late</SelectItem>
                        <SelectItem value="collection">In Collections</SelectItem>
                        <SelectItem value="charge_off">Charged Off</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
