'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Search, Plus, Trash2 } from 'lucide-react';
import { CreditInquiry } from '../types';
import { formatDate } from '../utils';
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

interface InquiriesSectionProps {
  inquiries: CreditInquiry[];
  onAddInquiry: (inquiry: CreditInquiry) => void;
  onRemoveInquiry: (id: string) => void;
}

export default function InquiriesSection({
  inquiries,
  onAddInquiry,
  onRemoveInquiry
}: InquiriesSectionProps) {
  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold">Credit Inquiries</h3>
        <Button
          onClick={() => {
            onAddInquiry({
              id: '',
              bureau: 'equifax',
              type: 'hard',
              date: new Date(),
              lender: '',
              purpose: ''
            });
          }}
          className="flex items-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>Add Inquiry</span>
        </Button>
      </div>

      <div className="space-y-4">
        {inquiries.map((inquiry, index) => (
          <motion.div
            key={inquiry.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center space-x-2">
                    <Search className="w-5 h-5 text-blue-500" />
                    <span>{inquiry.type === 'hard' ? 'Hard' : 'Soft'} Inquiry</span>
                  </CardTitle>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onRemoveInquiry(inquiry.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
                <CardDescription>
                  {formatDate(inquiry.date)}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Lender</Label>
                    <Input
                      value={inquiry.lender}
                      onChange={(e) => onAddInquiry({
                        ...inquiry,
                        lender: e.target.value
                      })}
                      placeholder="Lender name"
                    />
                  </div>
                  <div>
                    <Label>Purpose</Label>
                    <Input
                      value={inquiry.purpose}
                      onChange={(e) => onAddInquiry({
                        ...inquiry,
                        purpose: e.target.value
                      })}
                      placeholder="Inquiry purpose"
                    />
                  </div>
                  <div>
                    <Label>Type</Label>
                    <Select
                      value={inquiry.type}
                      onValueChange={(value: any) => onAddInquiry({
                        ...inquiry,
                        type: value
                      })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="hard">Hard Inquiry</SelectItem>
                        <SelectItem value="soft">Soft Inquiry</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Bureau</Label>
                    <Select
                      value={inquiry.bureau}
                      onValueChange={(value: any) => onAddInquiry({
                        ...inquiry,
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
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
