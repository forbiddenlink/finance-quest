import { useState, useCallback, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import {
  CreditReportState,
  CreditReportActions,
  CreditAccount,
  CreditInquiry,
  PublicRecord,
  CreditAlert,
  PersonalInfo,
  UseCreditReportAnalyzer
} from './types';
import {
  validateReport,
  analyzeReport,
  findDiscrepancies
} from './utils';

const initialState: CreditReportState = {
  personalInfo: {
    name: {
      current: '',
      previous: []
    },
    addresses: {
      current: '',
      previous: []
    },
    employers: {
      current: '',
      previous: []
    },
    phoneNumbers: []
  },
  accounts: [],
  inquiries: [],
  publicRecords: [],
  alerts: [],
  discrepancies: [],
  analysis: null,
  errors: [],
  showAdvancedOptions: false
};

export const useCreditReportAnalyzer: UseCreditReportAnalyzer = () => {
  const [state, setState] = useState<CreditReportState>(initialState);

  useEffect(() => {
    const errors = validateReport(state);
    const analysis = analyzeReport(state);
    const discrepancies = findDiscrepancies(state);

    setState(prev => ({
      ...prev,
      errors,
      analysis,
      discrepancies
    }));
  }, [state.accounts, state.inquiries, state.publicRecords, state.alerts]);

  const updatePersonalInfo = useCallback((info: Partial<PersonalInfo>) => {
    setState(prev => ({
      ...prev,
      personalInfo: {
        ...prev.personalInfo,
        ...info
      }
    }));
  }, []);

  const addAccount = useCallback((account: CreditAccount) => {
    setState(prev => ({
      ...prev,
      accounts: [...prev.accounts, { ...account, id: uuidv4() }]
    }));
  }, []);

  const removeAccount = useCallback((id: string) => {
    setState(prev => ({
      ...prev,
      accounts: prev.accounts.filter(account => account.id !== id)
    }));
  }, []);

  const updateAccount = useCallback((id: string, updates: Partial<CreditAccount>) => {
    setState(prev => ({
      ...prev,
      accounts: prev.accounts.map(account =>
        account.id === id ? { ...account, ...updates } : account
      )
    }));
  }, []);

  const addDispute = useCallback((accountId: string, dispute: CreditAccount['disputes'][0]) => {
    setState(prev => ({
      ...prev,
      accounts: prev.accounts.map(account =>
        account.id === accountId
          ? {
              ...account,
              disputes: [...account.disputes, { ...dispute, id: uuidv4() }]
            }
          : account
      )
    }));
  }, []);

  const updateDispute = useCallback((
    accountId: string,
    disputeId: string,
    updates: Partial<CreditAccount['disputes'][0]>
  ) => {
    setState(prev => ({
      ...prev,
      accounts: prev.accounts.map(account =>
        account.id === accountId
          ? {
              ...account,
              disputes: account.disputes.map(dispute =>
                dispute.id === disputeId
                  ? { ...dispute, ...updates }
                  : dispute
              )
            }
          : account
      )
    }));
  }, []);

  const addInquiry = useCallback((inquiry: CreditInquiry) => {
    setState(prev => ({
      ...prev,
      inquiries: [...prev.inquiries, { ...inquiry, id: uuidv4() }]
    }));
  }, []);

  const removeInquiry = useCallback((id: string) => {
    setState(prev => ({
      ...prev,
      inquiries: prev.inquiries.filter(inquiry => inquiry.id !== id)
    }));
  }, []);

  const addPublicRecord = useCallback((record: PublicRecord) => {
    setState(prev => ({
      ...prev,
      publicRecords: [...prev.publicRecords, { ...record, id: uuidv4() }]
    }));
  }, []);

  const removePublicRecord = useCallback((id: string) => {
    setState(prev => ({
      ...prev,
      publicRecords: prev.publicRecords.filter(record => record.id !== id)
    }));
  }, []);

  const updatePublicRecord = useCallback((id: string, updates: Partial<PublicRecord>) => {
    setState(prev => ({
      ...prev,
      publicRecords: prev.publicRecords.map(record =>
        record.id === id ? { ...record, ...updates } : record
      )
    }));
  }, []);

  const addAlert = useCallback((alert: CreditAlert) => {
    setState(prev => ({
      ...prev,
      alerts: [...prev.alerts, { ...alert, id: uuidv4() }]
    }));
  }, []);

  const updateAlertStatus = useCallback((id: string, status: CreditAlert['status']) => {
    setState(prev => ({
      ...prev,
      alerts: prev.alerts.map(alert =>
        alert.id === id ? { ...alert, status } : alert
      )
    }));
  }, []);

  const analyzeReportData = useCallback(() => {
    const analysis = analyzeReport(state);
    const discrepancies = findDiscrepancies(state);

    setState(prev => ({
      ...prev,
      analysis,
      discrepancies
    }));
  }, [state]);

  const setShowAdvancedOptions = useCallback((show: boolean) => {
    setState(prev => ({
      ...prev,
      showAdvancedOptions: show
    }));
  }, []);

  const actions: CreditReportActions = {
    updatePersonalInfo,
    addAccount,
    removeAccount,
    updateAccount,
    addDispute,
    updateDispute,
    addInquiry,
    removeInquiry,
    addPublicRecord,
    removePublicRecord,
    updatePublicRecord,
    addAlert,
    updateAlertStatus,
    analyzeReport: analyzeReportData,
    setShowAdvancedOptions
  };

  return [state, actions];
};
