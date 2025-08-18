import { useState, useCallback, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import {
  CreditScoreState,
  CreditScoreActions,
  CreditAccount,
  CreditInquiry,
  UseCreditScoreSimulator
} from './types';
import {
  validateProfile,
  calculateBaseScore,
  analyzeScoreFactors,
  simulateScoreChange
} from './utils';

const initialState: CreditScoreState = {
  profile: {
    accounts: [],
    inquiries: [],
    totalBalances: 0,
    totalCreditLimit: 0,
    oldestAccountAge: 0,
    averageAccountAge: 0,
    recentLatePayments: 0,
    collectionAccounts: 0,
    bankruptcies: 0
  },
  currentScore: 0,
  scoreFactors: [],
  simulations: [],
  errors: [],
  showAdvancedOptions: false
};

export const useCreditScoreSimulator: UseCreditScoreSimulator = () => {
  const [state, setState] = useState<CreditScoreState>(initialState);

  const updateProfile = useCallback(() => {
    const totalBalances = state.profile.accounts.reduce(
      (sum, account) => sum + account.balance,
      0
    );

    const totalCreditLimit = state.profile.accounts.reduce(
      (sum, account) => sum + account.creditLimit,
      0
    );

    const accountAges = state.profile.accounts.map(account =>
      Math.floor((new Date().getTime() - account.openDate.getTime()) / (1000 * 60 * 60 * 24 * 30))
    );

    const oldestAccountAge = Math.max(...(accountAges.length ? accountAges : [0]));
    const averageAccountAge = accountAges.length
      ? accountAges.reduce((sum, age) => sum + age, 0) / accountAges.length
      : 0;

    const recentLatePayments = state.profile.accounts.reduce(
      (count, account) => count + account.paymentHistory
        .filter(payment => 
          payment.status !== 'current' &&
          (new Date().getTime() - payment.date.getTime()) < (1000 * 60 * 60 * 24 * 365)
        ).length,
      0
    );

    const collectionAccounts = state.profile.accounts.filter(
      account => account.status === 'collection'
    ).length;

    setState(prev => ({
      ...prev,
      profile: {
        ...prev.profile,
        totalBalances,
        totalCreditLimit,
        oldestAccountAge,
        averageAccountAge,
        recentLatePayments,
        collectionAccounts
      }
    }));
  }, [state.profile.accounts]);

  useEffect(() => {
    const errors = validateProfile(state.profile);
    const currentScore = calculateBaseScore(state.profile);
    const scoreFactors = analyzeScoreFactors(state.profile);

    setState(prev => ({
      ...prev,
      errors,
      currentScore,
      scoreFactors
    }));
  }, [state.profile]);

  const addAccount = useCallback((account: CreditAccount) => {
    setState(prev => ({
      ...prev,
      profile: {
        ...prev.profile,
        accounts: [...prev.profile.accounts, { ...account, id: uuidv4() }]
      }
    }));
  }, []);

  const removeAccount = useCallback((id: string) => {
    setState(prev => ({
      ...prev,
      profile: {
        ...prev.profile,
        accounts: prev.profile.accounts.filter(account => account.id !== id)
      }
    }));
  }, []);

  const updateAccount = useCallback((id: string, updates: Partial<CreditAccount>) => {
    setState(prev => ({
      ...prev,
      profile: {
        ...prev.profile,
        accounts: prev.profile.accounts.map(account =>
          account.id === id ? { ...account, ...updates } : account
        )
      }
    }));
  }, []);

  const addInquiry = useCallback((inquiry: CreditInquiry) => {
    setState(prev => ({
      ...prev,
      profile: {
        ...prev.profile,
        inquiries: [...prev.profile.inquiries, { ...inquiry, id: uuidv4() }]
      }
    }));
  }, []);

  const removeInquiry = useCallback((id: string) => {
    setState(prev => ({
      ...prev,
      profile: {
        ...prev.profile,
        inquiries: prev.profile.inquiries.filter(inquiry => inquiry.id !== id)
      }
    }));
  }, []);

  const simulateAction = useCallback((action: {
    type: 'pay_down_balance' | 'add_account' | 'close_account' | 'late_payment' | 'collection';
    details: Record<string, any>;
  }) => {
    const simulation = simulateScoreChange(state.profile, action);
    setState(prev => ({
      ...prev,
      simulations: [...prev.simulations, simulation]
    }));
  }, [state.profile]);

  const resetSimulation = useCallback(() => {
    setState(prev => ({
      ...prev,
      simulations: []
    }));
  }, []);

  const setShowAdvancedOptions = useCallback((show: boolean) => {
    setState(prev => ({
      ...prev,
      showAdvancedOptions: show
    }));
  }, []);

  useEffect(() => {
    updateProfile();
  }, [updateProfile]);

  const actions: CreditScoreActions = {
    addAccount,
    removeAccount,
    updateAccount,
    addInquiry,
    removeInquiry,
    simulateAction,
    resetSimulation,
    setShowAdvancedOptions
  };

  return [state, actions];
};
