'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { User, MapPin, Briefcase, Phone } from 'lucide-react';
import { PersonalInfo } from '../types';
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

interface PersonalInfoSectionProps {
  info: PersonalInfo;
  onUpdate: (info: Partial<PersonalInfo>) => void;
}

export default function PersonalInfoSection({ info, onUpdate }: PersonalInfoSectionProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <User className="w-5 h-5 text-blue-500" />
            <span>Personal Information</span>
          </CardTitle>
          <CardDescription>
            Review and update your personal information
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Name Section */}
            <div className="space-y-4">
              <div>
                <Label>Current Name</Label>
                <Input
                  value={info.name.current}
                  onChange={(e) => onUpdate({
                    name: { ...info.name, current: e.target.value }
                  })}
                  placeholder="Full legal name"
                />
              </div>
              <div>
                <Label>Previous Names</Label>
                <div className="space-y-2">
                  {info.name.previous.map((name, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <Input
                        value={name}
                        onChange={(e) => {
                          const newPrevious = [...info.name.previous];
                          newPrevious[index] = e.target.value;
                          onUpdate({
                            name: { ...info.name, previous: newPrevious }
                          });
                        }}
                      />
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          const newPrevious = info.name.previous.filter((_, i) => i !== index);
                          onUpdate({
                            name: { ...info.name, previous: newPrevious }
                          });
                        }}
                      >
                        ×
                      </Button>
                    </div>
                  ))}
                  <Button
                    variant="outline"
                    onClick={() => onUpdate({
                      name: {
                        ...info.name,
                        previous: [...info.name.previous, '']
                      }
                    })}
                  >
                    Add Previous Name
                  </Button>
                </div>
              </div>
            </div>

            {/* Address Section */}
            <div className="space-y-4">
              <div>
                <Label>Current Address</Label>
                <div className="flex items-center space-x-2">
                  <MapPin className="w-5 h-5 text-gray-400" />
                  <Input
                    value={info.addresses.current}
                    onChange={(e) => onUpdate({
                      addresses: { ...info.addresses, current: e.target.value }
                    })}
                    placeholder="Street address, City, State, ZIP"
                  />
                </div>
              </div>
              <div>
                <Label>Previous Addresses</Label>
                <div className="space-y-2">
                  {info.addresses.previous.map((address, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <Input
                        value={address}
                        onChange={(e) => {
                          const newPrevious = [...info.addresses.previous];
                          newPrevious[index] = e.target.value;
                          onUpdate({
                            addresses: { ...info.addresses, previous: newPrevious }
                          });
                        }}
                      />
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          const newPrevious = info.addresses.previous.filter((_, i) => i !== index);
                          onUpdate({
                            addresses: { ...info.addresses, previous: newPrevious }
                          });
                        }}
                      >
                        ×
                      </Button>
                    </div>
                  ))}
                  <Button
                    variant="outline"
                    onClick={() => onUpdate({
                      addresses: {
                        ...info.addresses,
                        previous: [...info.addresses.previous, '']
                      }
                    })}
                  >
                    Add Previous Address
                  </Button>
                </div>
              </div>
            </div>

            {/* Employment Section */}
            <div className="space-y-4">
              <div>
                <Label>Current Employer</Label>
                <div className="flex items-center space-x-2">
                  <Briefcase className="w-5 h-5 text-gray-400" />
                  <Input
                    value={info.employers.current}
                    onChange={(e) => onUpdate({
                      employers: { ...info.employers, current: e.target.value }
                    })}
                    placeholder="Employer name"
                  />
                </div>
              </div>
              <div>
                <Label>Previous Employers</Label>
                <div className="space-y-2">
                  {info.employers.previous.map((employer, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <Input
                        value={employer}
                        onChange={(e) => {
                          const newPrevious = [...info.employers.previous];
                          newPrevious[index] = e.target.value;
                          onUpdate({
                            employers: { ...info.employers, previous: newPrevious }
                          });
                        }}
                      />
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          const newPrevious = info.employers.previous.filter((_, i) => i !== index);
                          onUpdate({
                            employers: { ...info.employers, previous: newPrevious }
                          });
                        }}
                      >
                        ×
                      </Button>
                    </div>
                  ))}
                  <Button
                    variant="outline"
                    onClick={() => onUpdate({
                      employers: {
                        ...info.employers,
                        previous: [...info.employers.previous, '']
                      }
                    })}
                  >
                    Add Previous Employer
                  </Button>
                </div>
              </div>
            </div>

            {/* Phone Numbers Section */}
            <div className="space-y-4">
              <Label>Phone Numbers</Label>
              <div className="space-y-2">
                {info.phoneNumbers.map((phone, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <Phone className="w-5 h-5 text-gray-400" />
                    <Input
                      value={phone}
                      onChange={(e) => {
                        const newPhones = [...info.phoneNumbers];
                        newPhones[index] = e.target.value;
                        onUpdate({ phoneNumbers: newPhones });
                      }}
                      placeholder="Phone number"
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        const newPhones = info.phoneNumbers.filter((_, i) => i !== index);
                        onUpdate({ phoneNumbers: newPhones });
                      }}
                    >
                      ×
                    </Button>
                  </div>
                ))}
                <Button
                  variant="outline"
                  onClick={() => onUpdate({
                    phoneNumbers: [...info.phoneNumbers, '']
                  })}
                >
                  Add Phone Number
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
