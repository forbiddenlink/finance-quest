import { useState, useCallback, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import {
  CreditMonitoringState,
  CreditMonitoringActions,
  CreditBureau,
  AlertStatus,
  CreditAlert,
  UseCreditMonitoringTool
} from './types';
import {
  DEFAULT_THRESHOLDS
} from './constants';
import {
  validatePreferences,
  analyzeScoreChanges,
  generateAlerts,
  analyzeScoreHistory
} from './utils';

const initialState: CreditMonitoringState = {
  currentScores: [],
  activeAlerts: [],
  preferences: {
    frequency: 'weekly',
    notificationTypes: ['email'],
    alertThresholds: DEFAULT_THRESHOLDS,
    monitoredBureaus: ['equifax', 'experian', 'transunion'],
    alertTypes: ['identity_theft', 'new_account', 'balance_change', 'payment_status', 'inquiry', 'public_record']
  },
  scoreHistory: [],
  insights: [],
  errors: [],
  showAdvancedOptions: false
};

export const useCreditMonitoringTool: UseCreditMonitoringTool = () => {
  const [state, setState] = useState<CreditMonitoringState>(initialState);

  useEffect(() => {
    const errors = validatePreferences(state.preferences);
    setState(prev => ({
      ...prev,
      errors
    }));
  }, [state.preferences]);

  useEffect(() => {
    const insights = analyzeScoreChanges(state.currentScores, state.scoreHistory);
    const newAlerts = generateAlerts(state.currentScores, state.scoreHistory, state.preferences);

    setState(prev => ({
      ...prev,
      insights,
      activeAlerts: [...prev.activeAlerts, ...newAlerts.map(alert => ({
        ...alert,
        id: uuidv4()
      }))]
    }));
  }, [state.currentScores, state.scoreHistory]);

  const updateScore = useCallback((bureau: CreditBureau, score: number) => {
    setState(prev => {
      const currentScores = [...prev.currentScores];
      const existingIndex = currentScores.findIndex(s => s.bureau === bureau);

      if (existingIndex >= 0) {
        currentScores[existingIndex] = {
          ...currentScores[existingIndex],
          previousScore: currentScores[existingIndex].score,
          score,
          date: new Date()
        };
      } else {
        currentScores.push({
          bureau,
          score,
          date: new Date()
        });
      }

      // Update score history
      const scoreHistory = [...prev.scoreHistory];
      const historyIndex = scoreHistory.findIndex(h => h.bureau === bureau);

      if (historyIndex >= 0) {
        scoreHistory[historyIndex] = {
          ...scoreHistory[historyIndex],
          history: [
            ...scoreHistory[historyIndex].history,
            {
              date: new Date(),
              score,
              change: existingIndex >= 0 ? score - currentScores[existingIndex].score : 0,
              factors: []
            }
          ]
        };
      } else {
        scoreHistory.push({
          bureau,
          history: [{
            date: new Date(),
            score,
            change: 0,
            factors: []
          }],
          trends: {
            shortTerm: 'no_change',
            longTerm: 'no_change',
            averageMonthlyChange: 0
          }
        });
      }

      // Update trends
      const { trends } = analyzeScoreHistory(scoreHistory);
      scoreHistory.forEach(history => {
        history.trends = trends[history.bureau];
      });

      return {
        ...prev,
        currentScores,
        scoreHistory
      };
    });
  }, []);

  const addAlert = useCallback((alert: CreditAlert) => {
    setState(prev => ({
      ...prev,
      activeAlerts: [...prev.activeAlerts, { ...alert, id: uuidv4() }]
    }));
  }, []);

  const updateAlertStatus = useCallback((id: string, status: AlertStatus) => {
    setState(prev => ({
      ...prev,
      activeAlerts: prev.activeAlerts.map(alert =>
        alert.id === id ? { ...alert, status } : alert
      )
    }));
  }, []);

  const resolveAlert = useCallback((id: string, resolution: CreditAlert['resolution']) => {
    setState(prev => ({
      ...prev,
      activeAlerts: prev.activeAlerts.map(alert =>
        alert.id === id ? {
          ...alert,
          status: 'resolved',
          resolution
        } : alert
      )
    }));
  }, []);

  const updatePreferences = useCallback((prefs: Partial<CreditMonitoringState['preferences']>) => {
    setState(prev => ({
      ...prev,
      preferences: {
        ...prev.preferences,
        ...prefs
      }
    }));
  }, []);

  const generateInsights = useCallback(() => {
    setState(prev => {
      const insights = analyzeScoreChanges(prev.currentScores, prev.scoreHistory);
      return {
        ...prev,
        insights
      };
    });
  }, []);

  const setShowAdvancedOptions = useCallback((show: boolean) => {
    setState(prev => ({
      ...prev,
      showAdvancedOptions: show
    }));
  }, []);

  const reset = useCallback(() => {
    setState(initialState);
  }, []);

  const actions: CreditMonitoringActions = {
    updateScore,
    addAlert,
    updateAlertStatus,
    resolveAlert,
    updatePreferences,
    generateInsights,
    setShowAdvancedOptions,
    reset
  };

  return [state, actions];
};
