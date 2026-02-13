'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { FileText, Plus, Trash2 } from 'lucide-react';
import { PublicRecord } from '../types';
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

interface PublicRecordsSectionProps {
  records: PublicRecord[];
  onAddRecord: (record: PublicRecord) => void;
  onRemoveRecord: (id: string) => void;
  onUpdateRecord: (id: string, updates: Partial<PublicRecord>) => void;
}

export default function PublicRecordsSection({
  records,
  onAddRecord,
  onRemoveRecord,
  onUpdateRecord
}: PublicRecordsSectionProps) {
  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold">Public Records</h3>
        <Button
          onClick={() => {
            onAddRecord({
              id: '',
              bureau: 'equifax',
              type: 'bankruptcy',
              date: new Date(),
              amount: 0,
              status: 'filed'
            });
          }}
          className="flex items-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>Add Record</span>
        </Button>
      </div>

      <div className="space-y-4">
        {records.map((record, index) => (
          <motion.div
            key={record.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center space-x-2">
                    <FileText className="w-5 h-5 text-blue-500" />
                    <span>{record.type.replace('_', ' ').toUpperCase()}</span>
                  </CardTitle>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onRemoveRecord(record.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
                <CardDescription>
                  {formatDate(record.date)} - {record.status.toUpperCase()}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Type</Label>
                      <Select
                        value={record.type}
                        onValueChange={(value: any) => onUpdateRecord(record.id, {
                          type: value
                        })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="bankruptcy">Bankruptcy</SelectItem>
                          <SelectItem value="tax_lien">Tax Lien</SelectItem>
                          <SelectItem value="civil_judgment">Civil Judgment</SelectItem>
                          <SelectItem value="collection">Collection</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Status</Label>
                      <Select
                        value={record.status}
                        onValueChange={(value: any) => onUpdateRecord(record.id, {
                          status: value
                        })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="filed">Filed</SelectItem>
                          <SelectItem value="discharged">Discharged</SelectItem>
                          <SelectItem value="satisfied">Satisfied</SelectItem>
                          <SelectItem value="pending">Pending</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Amount</Label>
                      <Input
                        type="number"
                        value={record.amount}
                        onChange={(e) => onUpdateRecord(record.id, {
                          amount: parseFloat(e.target.value)
                        })}
                      />
                    </div>
                    <div>
                      <Label>Bureau</Label>
                      <Select
                        value={record.bureau}
                        onValueChange={(value: any) => onUpdateRecord(record.id, {
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

                  {record.courtInfo && (
                    <div className="space-y-4">
                      <Label>Court Information</Label>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label>Court Name</Label>
                          <Input
                            value={record.courtInfo.name}
                            onChange={(e) => onUpdateRecord(record.id, {
                              courtInfo: {
                                name: e.target.value,
                                caseNumber: record.courtInfo?.caseNumber || '',
                                jurisdiction: record.courtInfo?.jurisdiction || ''
                              }
                            })}
                          />
                        </div>
                        <div>
                          <Label>Case Number</Label>
                          <Input
                            value={record.courtInfo.caseNumber}
                            onChange={(e) => onUpdateRecord(record.id, {
                              courtInfo: {
                                name: record.courtInfo?.name || '',
                                caseNumber: e.target.value,
                                jurisdiction: record.courtInfo?.jurisdiction || ''
                              }
                            })}
                          />
                        </div>
                        <div>
                          <Label>Jurisdiction</Label>
                          <Input
                            value={record.courtInfo.jurisdiction}
                            onChange={(e) => onUpdateRecord(record.id, {
                              courtInfo: {
                                name: record.courtInfo?.name || '',
                                caseNumber: record.courtInfo?.caseNumber || '',
                                jurisdiction: e.target.value
                              }
                            })}
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {!record.courtInfo && (
                    <Button
                      variant="outline"
                      onClick={() => onUpdateRecord(record.id, {
                        courtInfo: {
                          name: '',
                          caseNumber: '',
                          jurisdiction: ''
                        }
                      })}
                    >
                      Add Court Information
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
