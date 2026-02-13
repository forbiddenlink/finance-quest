import { Decimal } from 'decimal.js';
import {
  CreditScore,
  CreditAlert,
  MonitoringPreference,
  ScoreHistory,
  ScoreInsight,
  ValidationError,
  CreditBureau,
  AlertType,
  ScoreChangeType
} from './types';
import {
  BUREAU_INFO,
  ALERT_TYPE_INFO,
  SCORE_RANGES,
  DEFAULT_THRESHOLDS
} from './constants';

export function validatePreferences(prefs: MonitoringPreference): ValidationError[] {
  const errors: ValidationError[] = [];

  // Validate thresholds
  if (prefs.alertThresholds.scoreChange < 0 || prefs.alertThresholds.scoreChange > 100) {
    errors.push({
      field: 'scoreChange',
      message: 'Score change threshold must be between 0 and 100'
    });
  }

  if (prefs.alertThresholds.balanceChange < 0 || prefs.alertThresholds.balanceChange > 10000) {
    errors.push({
      field: 'balanceChange',
      message: 'Balance change threshold must be between $0 and $10,000'
    });
  }

  if (prefs.alertThresholds.utilizationChange < 0 || prefs.alertThresholds.utilizationChange > 100) {
    errors.push({
      field: 'utilizationChange',
      message: 'Utilization change threshold must be between 0% and 100%'
    });
  }

  // Validate monitoring selections
  if (prefs.monitoredBureaus.length === 0) {
    errors.push({
      field: 'monitoredBureaus',
      message: 'At least one credit bureau must be selected'
    });
  }

  if (prefs.alertTypes.length === 0) {
    errors.push({
      field: 'alertTypes',
      message: 'At least one alert type must be selected'
    });
  }

  if (prefs.notificationTypes.length === 0) {
    errors.push({
      field: 'notificationTypes',
      message: 'At least one notification type must be selected'
    });
  }

  return errors;
}

export function analyzeScoreChanges(
  currentScores: CreditScore[],
  history: ScoreHistory[]
): ScoreInsight[] {
  const insights: ScoreInsight[] = [];

  currentScores.forEach(score => {
    const bureau = score.bureau;
    const bureauHistory = history.find(h => h.bureau === bureau);
    if (!bureauHistory) return;

    // Check for significant changes
    if (score.previousScore !== undefined) {
      const change = score.score - score.previousScore;
      const changePercent = new Decimal(change).div(score.previousScore).times(100).toNumber();

      if (Math.abs(change) >= DEFAULT_THRESHOLDS.scoreChange) {
        insights.push({
          type: change > 0 ? 'achievement' : 'warning',
          title: `Significant Score Change - ${BUREAU_INFO[bureau].name}`,
          description: `Your credit score has ${change > 0 ? 'increased' : 'decreased'} by ${Math.abs(change)} points (${Math.abs(changePercent).toFixed(1)}%)`,
          impact: change,
          timeFrame: 'Last update',
          actions: change < 0 ? [
            'Review recent credit activity',
            'Check for unauthorized changes',
            'Consider disputing errors'
          ] : undefined,
          priority: Math.abs(change) >= 40 ? 1 : 2
        });
      }
    }

    // Analyze trends
    if (bureauHistory.trends.shortTerm !== 'no_change') {
      insights.push({
        type: bureauHistory.trends.shortTerm === 'increase' ? 'achievement' : 'warning',
        title: `Short-term Trend - ${BUREAU_INFO[bureau].name}`,
        description: `Your score is showing a ${bureauHistory.trends.shortTerm} trend over the past 3 months`,
        impact: bureauHistory.trends.averageMonthlyChange,
        timeFrame: '3 months',
        actions: bureauHistory.trends.shortTerm === 'decrease' ? [
          'Review recent changes',
          'Check payment history',
          'Monitor credit utilization'
        ] : undefined,
        priority: Math.abs(bureauHistory.trends.averageMonthlyChange) >= 10 ? 2 : 3
      });
    }
  });

  return insights.sort((a, b) => a.priority - b.priority);
}

export function generateAlerts(
  currentScores: CreditScore[],
  history: ScoreHistory[],
  prefs: MonitoringPreference
): CreditAlert[] {
  const alerts: CreditAlert[] = [];
  const now = new Date();

  // Score change alerts
  currentScores.forEach(score => {
    if (!prefs.monitoredBureaus.includes(score.bureau)) return;
    if (!score.previousScore) return;

    const change = score.score - score.previousScore;
    if (Math.abs(change) >= prefs.alertThresholds.scoreChange) {
      alerts.push({
        id: '',
        type: 'balance_change',
        severity: Math.abs(change) >= 40 ? 'high' : 'medium',
        status: 'new',
        date: now,
        description: `Credit score ${change > 0 ? 'increased' : 'decreased'} by ${Math.abs(change)} points`,
        details: {
          bureau: score.bureau,
          oldScore: score.previousScore,
          newScore: score.score,
          change
        },
        bureau: score.bureau,
        recommendedActions: [
          'Review recent credit activity',
          'Check for unauthorized changes',
          'Monitor credit reports'
        ]
      });
    }
  });

  return alerts;
}

export function analyzeScoreHistory(history: ScoreHistory[]): {
  trends: Record<CreditBureau, {
    shortTerm: ScoreChangeType;
    longTerm: ScoreChangeType;
    averageMonthlyChange: number;
  }>;
  volatility: Record<CreditBureau, number>;
} {
  const trends: Record<CreditBureau, {
    shortTerm: ScoreChangeType;
    longTerm: ScoreChangeType;
    averageMonthlyChange: number;
  }> = {} as any;

  const volatility: Record<CreditBureau, number> = {} as any;

  history.forEach(bureauHistory => {
    const scores = bureauHistory.history.map(h => h.score);
    const changes = scores.slice(1).map((score, i) => score - scores[i]);

    // Calculate trends
    const shortTermScores = scores.slice(-3);
    const longTermScores = scores.slice(-12);

    trends[bureauHistory.bureau] = {
      shortTerm: calculateTrend(shortTermScores),
      longTerm: calculateTrend(longTermScores),
      averageMonthlyChange: changes.length > 0
        ? changes.reduce((sum, change) => sum + change, 0) / changes.length
        : 0
    };

    // Calculate volatility (standard deviation of changes)
    if (changes.length > 0) {
      const mean = changes.reduce((sum, change) => sum + change, 0) / changes.length;
      const squaredDiffs = changes.map(change => Math.pow(change - mean, 2));
      const variance = squaredDiffs.reduce((sum, diff) => sum + diff, 0) / changes.length;
      volatility[bureauHistory.bureau] = Math.sqrt(variance);
    } else {
      volatility[bureauHistory.bureau] = 0;
    }
  });

  return { trends, volatility };
}

function calculateTrend(scores: number[]): ScoreChangeType {
  if (scores.length < 2) return 'no_change';

  const firstScore = scores[0];
  const lastScore = scores[scores.length - 1];
  const change = lastScore - firstScore;

  if (Math.abs(change) < 5) return 'no_change';
  return change > 0 ? 'increase' : 'decrease';
}

export function getScoreRange(score: number): keyof typeof SCORE_RANGES {
  if (score >= SCORE_RANGES.excellent.min) return 'excellent';
  if (score >= SCORE_RANGES.very_good.min) return 'very_good';
  if (score >= SCORE_RANGES.good.min) return 'good';
  if (score >= SCORE_RANGES.fair.min) return 'fair';
  return 'poor';
}

export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(date);
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
}

export function formatPercentage(value: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'percent',
    minimumFractionDigits: 1,
    maximumFractionDigits: 1
  }).format(value / 100);
}
