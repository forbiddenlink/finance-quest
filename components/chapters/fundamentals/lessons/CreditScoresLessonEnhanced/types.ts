export interface CreditScoreFactor {
  name: string;
  weight: number;
  description: string;
  bestPractices: string[];
  commonMistakes: string[];
  timeToImpact: string;
  recoveryTime: string;
}

export interface CreditBureau {
  name: string;
  website: string;
  reportFrequency: string;
  uniqueFeatures: string[];
  scoringModel: string;
  scoreRange: {
    min: number;
    max: number;
  };
}

export interface DisputeProcess {
  step: number;
  name: string;
  description: string;
  timeframe: string;
  requirements: string[];
  tips: string[];
}

export interface CreditMilestone {
  score: number;
  benefits: string[];
  requirements: string[];
  nextSteps: string[];
}

export interface CreditProtectionTip {
  category: string;
  description: string;
  implementation: string[];
  frequency: string;
  importance: 'high' | 'medium' | 'low';
}

export interface CreditScoreContent {
  introduction: {
    title: string;
    description: string;
    keyPoints: string[];
  };
  creditScoreFactors: CreditScoreFactor[];
  creditBureaus: CreditBureau[];
  disputeProcess: DisputeProcess[];
  creditMilestones: CreditMilestone[];
  protectionTips: CreditProtectionTip[];
  conclusion: {
    summary: string[];
    actionItems: string[];
    resources: {
      name: string;
      url: string;
      description: string;
    }[];
  };
}
