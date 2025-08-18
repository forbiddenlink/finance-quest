export interface CreditCardType {
  name: string;
  description: string;
  benefits: string[];
  drawbacks: string[];
  bestFor: string[];
  typicalFeatures: {
    annualFee: string;
    rewardsRate: string;
    introAPR: string;
    creditScoreNeeded: string;
  };
}

export interface RewardProgram {
  name: string;
  description: string;
  pointValue: string;
  redemptionOptions: {
    option: string;
    value: string;
    details: string;
  }[];
  transferPartners?: {
    name: string;
    ratio: string;
    value: string;
  }[];
}

export interface CreditCardStrategy {
  name: string;
  description: string;
  steps: string[];
  benefits: string[];
  considerations: string[];
  requiredScore: string;
  timeline: string;
}

export interface CommonMistake {
  mistake: string;
  impact: string;
  solution: string;
  preventionTips: string[];
}

export interface SecurityTip {
  category: 'online' | 'physical' | 'monitoring' | 'travel';
  tip: string;
  importance: 'high' | 'medium' | 'low';
  implementation: string[];
  additionalNotes?: string;
}

export interface LessonSection {
  title: string;
  content: string;
  keyPoints: string[];
  examples?: string[];
  tips?: string[];
  warnings?: string[];
}

export interface LessonContent {
  introduction: LessonSection;
  creditCardTypes: {
    section: LessonSection;
    types: CreditCardType[];
  };
  rewardPrograms: {
    section: LessonSection;
    programs: RewardProgram[];
  };
  applicationStrategies: {
    section: LessonSection;
    strategies: CreditCardStrategy[];
  };
  commonMistakes: {
    section: LessonSection;
    mistakes: CommonMistake[];
  };
  securityBestPractices: {
    section: LessonSection;
    tips: SecurityTip[];
  };
  conclusion: LessonSection;
}
