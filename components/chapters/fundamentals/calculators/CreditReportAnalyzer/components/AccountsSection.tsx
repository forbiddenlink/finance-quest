'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { CreditCard, Plus, Trash2, AlertTriangle } from 'lucide-react';
import { CreditAccount } from '../types';
import { ACCOUNT_TYPE_INFO, BUREAU_INFO } from '../constants';
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
  onAddDispute: (accountId: string, dispute: CreditAccount['disputes'][0]) => void;
}

export default function AccountsSection({
  accounts,
  onAddAccount,
  onRemoveAccount,
  onUpdateAccount,
  onAddDispute
}: AccountsSectionProps) {
  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold">Credit Accounts</h3>
        <Button
          onClick={() => {
            onAddAccount({
              id: '',
              bureau: 'equifax',
              type: 'credit_card',
              name: '',
              accountNumber: '',
              openDate: new Date(),
              status: 'open',
              balance: 0,
              creditLimit: 0,
              highestBalance: 0,
              monthlyPayment: 0,
              paymentHistory: [],
              disputes: []
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
                    <span>{ACCOUNT_TYPE_INFO[account.type].name}</span>
                    <span className="text-sm text-gray-500">
                      ({BUREAU_INFO[account.bureau].name})
                    </span>
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
                <div className="space-y-6">
                  {/* Basic Info */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Account Name</Label>
                      <Input
                        value={account.name}
                        onChange={(e) => onUpdateAccount(account.id, {
                          name: e.target.value
                        })}
                        placeholder="Account name"
                      />
                    </div>
                    <div>
                      <Label>Account Number</Label>
                      <Input
                        value={account.accountNumber}
                        onChange={(e) => onUpdateAccount(account.id, {
                          accountNumber: e.target.value
                        })}
                        placeholder="Account number"
                      />
                    </div>
                  </div>

                  {/* Financial Info */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Current Balance</Label>
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
                      <Label>Highest Balance</Label>
                      <Input
                        type="number"
                        value={account.highestBalance}
                        onChange={(e) => onUpdateAccount(account.id, {
                          highestBalance: parseFloat(e.target.value)
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
                  </div>

                  {/* Status */}
                  <div className="grid grid-cols-2 gap-4">
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
                      <Label>Credit Bureau</Label>
                      <Select
                        value={account.bureau}
                        onValueChange={(value: any) => onUpdateAccount(account.id, {
                          bureau: value
                        })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="equifax">Equifax</SelectItem>
                          <SelectItem value="experian">Experian</SelectItem>
                          <SelectItem value="transunion">TransUnion</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Disputes */}
                  {account.disputes.length > 0 && (
                    <div className="space-y-2">
                      <Label>Active Disputes</Label>
                      {account.disputes.map((dispute, i) => (
                        <Card key={dispute.id} className="bg-yellow-50">
                          <CardContent className="pt-4">
                            <div className="flex items-start space-x-2">
                              <AlertTriangle className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-1" />
                              <div className="flex-grow">
                                <p className="font-medium">{dispute.reason}</p>
                                <p className="text-sm text-gray-600">
                                  Filed: {formatDate(dispute.date)}
                                </p>
                                <p className="text-sm text-gray-600">
                                  Status: {dispute.status}
                                </p>
                                {dispute.resolution && (
                                  <p className="text-sm text-gray-600">
                                    Resolution: {dispute.resolution}
                                  </p>
                                )}
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}

                  <Button
                    variant="outline"
                    onClick={() => onAddDispute(account.id, {
                      id: '',
                      date: new Date(),
                      reason: '',
                      status: 'in_progress'
                    })}
                  >
                    File New Dispute
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
