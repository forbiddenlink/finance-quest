export type CreditBureau = 'equifax' | 'experian' | 'transunion';
export type AccountType = 'credit_card' | 'personal_loan' | 'auto_loan' | 'mortgage' | 'student_loan' | 'retail_card';
export type AccountStatus = 'open' | 'closed' | 'delinquent' | 'collection' | 'charge_off';
export type PaymentStatus = 'current' | 'late_30' | 'late_60' | 'late_90' | 'collection' | 'charge_off';
export type InquiryType = 'hard' | 'soft';
export type DisputeStatus = 'not_disputed' | 'in_progress' | 'resolved_in_favor' | 'resolved_against';
export type AlertType = 'identity_theft' | 'new_account' | 'balance_change' | 'payment_status' | 'inquiry' | 'public_record';

export interface CreditAccount {
  id: string;
  bureau: CreditBureau;
  type: AccountType;
  name: string;
  accountNumber: string;
  openDate: Date;
  status: AccountStatus;
  balance: number;
  creditLimit?: number;
  highestBalance: number;
  monthlyPayment?: number;
  paymentHistory: {
    date: Date;
    status: PaymentStatus;
    amount: number;
  }[];
  disputes: {
    id: string;
    date: Date;
    reason: string;
    status: DisputeStatus;
    resolution?: string;
  }[];
}

export interface CreditInquiry {
  id: string;
  bureau: CreditBureau;
  type: InquiryType;
  date: Date;
  lender: string;
  purpose: string;
}

export interface PublicRecord {
  id: string;
  bureau: CreditBureau;
  type: 'bankruptcy' | 'tax_lien' | 'civil_judgment' | 'collection';
  date: Date;
  amount: number;
  status: 'filed' | 'discharged' | 'satisfied' | 'pending';
  courtInfo?: {
    name: string;
    caseNumber: string;
    jurisdiction: string;
  };
}

export interface PersonalInfo {
  name: {
    current: string;
    previous: string[];
  };
  addresses: {
    current: string;
    previous: string[];
  };
  employers: {
    current: string;
    previous: string[];
  };
  phoneNumbers: string[];
}

export interface CreditAlert {
  id: string;
  type: AlertType;
  date: Date;
  description: string;
  severity: 'low' | 'medium' | 'high';
  status: 'new' | 'viewed' | 'resolved';
  details: Record<string, any>;
}

export interface Discrepancy {
  id: string;
  type: 'account_info' | 'balance' | 'payment_history' | 'personal_info';
  bureau1: CreditBureau;
  bureau2: CreditBureau;
  field: string;
  value1: any;
  value2: any;
  impact: 'none' | 'low' | 'medium' | 'high';
  recommendation: string;
}

export interface ReportAnalysis {
  accounts: {
    total: number;
    byType: Record<AccountType, number>;
    byStatus: Record<AccountStatus, number>;
    averageAge: number;
    totalBalances: number;
    totalLimits: number;
    utilization: number;
  };
  paymentHistory: {
    totalPayments: number;
    latePayments: {
      last30Days: number;
      last60Days: number;
      last90Days: number;
      lastYear: number;
    };
    onTimePercentage: number;
  };
  inquiries: {
    total: number;
    hardInquiries: number;
    recentInquiries: number;
    impactLevel: 'none' | 'low' | 'medium' | 'high';
  };
  publicRecords: {
    total: number;
    bankruptcies: number;
    taxLiens: number;
    civilJudgments: number;
    collections: number;
  };
  alerts: {
    total: number;
    byType: Record<AlertType, number>;
    bySeverity: {
      low: number;
      medium: number;
      high: number;
    };
  };
  discrepancies: {
    total: number;
    byType: Record<string, number>;
    byImpact: {
      none: number;
      low: number;
      medium: number;
      high: number;
    };
  };
}

export interface ValidationError {
  field: string;
  message: string;
}

export interface CreditReportState {
  personalInfo: PersonalInfo;
  accounts: CreditAccount[];
  inquiries: CreditInquiry[];
  publicRecords: PublicRecord[];
  alerts: CreditAlert[];
  discrepancies: Discrepancy[];
  analysis: ReportAnalysis | null;
  errors: ValidationError[];
  showAdvancedOptions: boolean;
}

export interface CreditReportActions {
  updatePersonalInfo: (info: Partial<PersonalInfo>) => void;
  addAccount: (account: CreditAccount) => void;
  removeAccount: (id: string) => void;
  updateAccount: (id: string, updates: Partial<CreditAccount>) => void;
  addDispute: (accountId: string, dispute: CreditAccount['disputes'][0]) => void;
  updateDispute: (accountId: string, disputeId: string, updates: Partial<CreditAccount['disputes'][0]>) => void;
  addInquiry: (inquiry: CreditInquiry) => void;
  removeInquiry: (id: string) => void;
  addPublicRecord: (record: PublicRecord) => void;
  removePublicRecord: (id: string) => void;
  updatePublicRecord: (id: string, updates: Partial<PublicRecord>) => void;
  addAlert: (alert: CreditAlert) => void;
  updateAlertStatus: (id: string, status: CreditAlert['status']) => void;
  analyzeReport: () => void;
  setShowAdvancedOptions: (show: boolean) => void;
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

export type UseCreditReportAnalyzer = () => [CreditReportState, CreditReportActions];
