'use client';

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';
import { LucideIcon } from 'lucide-react';

interface CalculatorLayoutProps {
  title: string;
  description?: string;
  icon: LucideIcon;
  onReset?: () => void;
  children: React.ReactNode;
}

export function CalculatorLayout({
  title,
  description,
  icon: Icon,
  onReset,
  children
}: CalculatorLayoutProps) {
  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Icon className="h-6 w-6" />
            {title}
          </CardTitle>
          {description && (
            <CardDescription>{description}</CardDescription>
          )}
        </CardHeader>
        <CardContent>
          {children}
          {onReset && (
            <div className="mt-6 space-x-2">
              <Button
                onClick={onReset}
                variant="outline"
                className="gap-2"
              >
                <RefreshCw className="h-4 w-4" />
                Reset
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

