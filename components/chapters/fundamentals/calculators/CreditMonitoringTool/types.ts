export type CreditBureau = 'equifax' | 'experian' | 'transunion';
export type AlertType = 'identity_theft' | 'new_account' | 'balance_change' | 'payment_status' | 'inquiry' | 'public_record';
export type AlertSeverity = 'low' | 'medium' | 'high';
export type AlertStatus = 'new' | 'viewed' | 'resolved';
export type MonitoringFrequency = 'daily' | 'weekly' | 'monthly';
export type NotificationType = 'email' | 'sms' | 'push';
export type ScoreChangeType = 'increase' | 'decrease' | 'no_change';

export interface CreditScore {
  bureau: CreditBureau;
  score: number;
  date: Date;
  previousScore?: number;
  changeType?: ScoreChangeType;
  changeAmount?: number;
  factors?: {
    name: string;
    impact: 'positive' | 'negative';
    description: string;
  }[];
}

export interface CreditAlert {
  id: string;
  type: AlertType;
  severity: AlertSeverity;
  status: AlertStatus;
  date: Date;
  description: string;
  details: Record<string, any>;
  bureau: CreditBureau;
  affectedAccounts?: string[];
  recommendedActions: string[];
  resolution?: {
    date: Date;
    action: string;
    outcome: string;
  };
}

export interface MonitoringPreference {
  frequency: MonitoringFrequency;
  notificationTypes: NotificationType[];
  alertThresholds: {
    scoreChange: number;
    balanceChange: number;
    utilizationChange: number;
  };
  monitoredBureaus: CreditBureau[];
  alertTypes: AlertType[];
}

export interface ScoreHistory {
  bureau: CreditBureau;
  history: {
    date: Date;
    score: number;
    change: number;
    factors: {
      name: string;
      impact: 'positive' | 'negative';
      description: string;
    }[];
  }[];
  trends: {
    shortTerm: ScoreChangeType;
    longTerm: ScoreChangeType;
    averageMonthlyChange: number;
  };
}

export interface ScoreInsight {
  type: 'achievement' | 'warning' | 'tip';
  title: string;
  description: string;
  impact: number;
  timeFrame: string;
  actions?: string[];
  priority: number;
}

export interface ValidationError {
  field: string;
  message: string;
}

export interface CreditMonitoringState {
  currentScores: CreditScore[];
  activeAlerts: CreditAlert[];
  preferences: MonitoringPreference;
  scoreHistory: ScoreHistory[];
  insights: ScoreInsight[];
  errors: ValidationError[];
  showAdvancedOptions: boolean;
}

export interface CreditMonitoringActions {
  updateScore: (bureau: CreditBureau, score: number) => void;
  addAlert: (alert: CreditAlert) => void;
  updateAlertStatus: (id: string, status: AlertStatus) => void;
  resolveAlert: (id: string, resolution: CreditAlert['resolution']) => void;
  updatePreferences: (prefs: Partial<MonitoringPreference>) => void;
  generateInsights: () => void;
  setShowAdvancedOptions: (show: boolean) => void;
  reset: () => void;
}

export interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor?: string;
    borderColor?: string;
    borderWidth?: number;
    fill?: boolean;
  }[];
}

export interface ChartOptions {
  responsive: boolean;
  maintainAspectRatio: boolean;
  scales: {
    y: {
      beginAtZero: boolean;
      min?: number;
      max?: number;
      ticks: {
        callback: (value: number) => string;
      };
    };
  };
  plugins: {
    tooltip: {
      callbacks: {
        label: (context: { dataset: { label: string }; parsed: { y: number } }) => string;
      };
    };
  };
}

export interface StyleConfig {
  readonly [key: string]: {
    background: string;
    text: string;
    border: string;
  };
}

export type UseCreditMonitoringTool = () => [CreditMonitoringState, CreditMonitoringActions];
