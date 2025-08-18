import { LucideIcon } from 'lucide-react';

export interface EstatePlanningLessonProps {
  onComplete?: () => void;
}

export interface LessonContent {
  title: string;
  content: string;
  keyPoints: string[];
  practicalAction: string;
  moneyExample: string;
  warningTip?: string;
  icon: LucideIcon;
}
