'use client';

import {
  DollarSign,
  TrendingUp,
  PiggyBank,
  CreditCard,
  Home,
  Calculator,
  BarChart3,
  PieChart,
  Target,
  Shield,
  Briefcase,
  Lightbulb
} from 'lucide-react';
import { theme } from '@/lib/theme';

const floatingIcons = [
  { icon: DollarSign, delay: 0, x: '10%', y: '20%' },
  { icon: TrendingUp, delay: 1, x: '80%', y: '15%' },
  { icon: PiggyBank, delay: 2, x: '15%', y: '70%' },
  { icon: CreditCard, delay: 0.5, x: '85%', y: '60%' },
  { icon: Home, delay: 1.5, x: '50%', y: '80%' },
  { icon: Calculator, delay: 2.5, x: '70%', y: '30%' },
  { icon: BarChart3, delay: 3, x: '25%', y: '45%' },
  { icon: PieChart, delay: 1.8, x: '90%', y: '35%' },
  { icon: Target, delay: 0.8, x: '5%', y: '60%' },
  { icon: Shield, delay: 2.2, x: '75%', y: '70%' },
  { icon: Briefcase, delay: 1.2, x: '40%', y: '25%' },
  { icon: Lightbulb, delay: 2.8, x: '60%', y: '85%' },
];

export default function FloatingBackground() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden opacity-5">
      {floatingIcons.map((item, index) => {
        const IconComponent = item.icon;
        return (
          <div
            key={index}
            className="absolute animate-float money-float"
            style={{
              left: item.x,
              top: item.y,
              animationDelay: `${item.delay}s`,
            }}
          >
            <IconComponent size={48} className={`${theme.textColors.primary}`} />
          </div>
        );
      })}
    </div>
  );
}
