import { renderHook, act } from '@testing-library/react';
import { useEmergencyFund } from '@/lib/hooks/calculators/useEmergencyFund';
import { runCommonCalculatorTests } from '@/lib/utils/calculatorTestUtils';

// Mock progressStore
jest.mock('@/lib/store/progressStore', () => ({
  useProgressStore: () => (calculatorId: string) => {}
}));

describe('useEmergencyFund', () => {
  // Run common calculator tests
  runCommonCalculatorTests({
    hook: useEmergencyFund,
    validInputs: {
      monthlyExpenses: 4000,
      monthlyIncome: 6000,
      currentSavings: 5000,
      monthlySavingsTarget: 1000,
      jobStability: 'stable',
      incomeType: 'salary',
      healthStatus: 'good',
      dependents: 0,
      housingType: 'rent',
      debtLevel: 'low',
      insuranceCoverage: 'basic',
      industryStability: 'stable',
      savingsStrategy: 'moderate',
      useHighYieldSavings: true,
      includeInflation: true
    },
    invalidInputs: {
      monthlyExpenses: -4000,
      monthlyIncome: -6000,
      currentSavings: -5000,
      monthlySavingsTarget: -1000,
      dependents: -1
    },
    expectedResults: {
      recommendedMonths: 4,
      minimumFund: 12000,
      recommendedFund: 16000,
      riskScore: 4.5
    },
    fieldValidations: {
      monthlyExpenses: [
        { value: 4000, error: null },
        { value: 50, error: 'Value must be at least 100' },
        { value: 150000, error: 'Value must be no more than 100000' }
      ],
      monthlyIncome: [
        { value: 6000, error: null },
        { value: 50, error: 'Value must be at least 100' },
        { value: 1500000, error: 'Value must be no more than 1000000' }
      ],
      dependents: [
        { value: 2, error: null },
        { value: -1, error: 'Value must be at least 0' },
        { value: 25, error: 'Value must be no more than 20' }
      ]
    }
  });

  describe('Risk Score Calculation', () => {
    it('should calculate higher risk score for unstable situations', () => {
      const { result } = renderHook(() => useEmergencyFund());
      
      act(() => {
        result.current[1].setValues({
          jobStability: 'unstable',
          incomeType: 'self-employed',
          healthStatus: 'poor',
          dependents: 3,
          housingType: 'rent',
          debtLevel: 'high',
          insuranceCoverage: 'none',
          industryStability: 'declining'
        });
      });

      expect(result.current[0].result?.riskScore).toBeGreaterThan(10);
      expect(result.current[0].result?.recommendedMonths).toBeGreaterThan(6);
    });

    it('should calculate lower risk score for stable situations', () => {
      const { result } = renderHook(() => useEmergencyFund());
      
      act(() => {
        result.current[1].setValues({
          jobStability: 'stable',
          incomeType: 'salary',
          healthStatus: 'excellent',
          dependents: 0,
          housingType: 'own',
          debtLevel: 'none',
          insuranceCoverage: 'comprehensive',
          industryStability: 'growing'
        });
      });

      expect(result.current[0].result?.riskScore).toBeLessThan(3);
      expect(result.current[0].result?.recommendedMonths).toBeLessThanOrEqual(4);
    });

    it('should identify and prioritize major risk factors', () => {
      const { result } = renderHook(() => useEmergencyFund());
      
      act(() => {
        result.current[1].setValues({
          jobStability: 'unstable',
          incomeType: 'commission',
          healthStatus: 'good',
          dependents: 1,
          housingType: 'rent',
          debtLevel: 'moderate',
          insuranceCoverage: 'basic',
          industryStability: 'stable'
        });
      });

      const riskFactors = result.current[0].result?.riskFactors;
      expect(riskFactors).toBeDefined();
      expect(riskFactors?.[0].factor).toBe('Job Stability');
      expect(riskFactors?.[0].level).toBe('high');
    });
  });

  describe('Building Timeline', () => {
    it('should calculate accurate timeline based on savings rate', () => {
      const { result } = renderHook(() => useEmergencyFund());
      
      act(() => {
        result.current[1].setValues({
          monthlyExpenses: 4000,
          currentSavings: 5000,
          monthlySavingsTarget: 1000
        });
      });

      const timeline = result.current[0].result;
      expect(timeline?.monthsToMinimum).toBeDefined();
      expect(timeline?.monthsToRecommended).toBeGreaterThan(timeline?.monthsToMinimum || 0);
      expect(timeline?.monthsToOptimal).toBeGreaterThan(timeline?.monthsToRecommended || 0);
    });

    it('should generate correct savings milestones', () => {
      const { result } = renderHook(() => useEmergencyFund());
      
      act(() => {
        result.current[1].setValues({
          monthlyExpenses: 4000,
          currentSavings: 0,
          monthlySavingsTarget: 1000
        });
      });

      const projections = result.current[0].result?.projectedSavings;
      expect(projections).toBeDefined();

      const minimumMilestone = projections?.find(p => p.milestone === 'Minimum Fund');
      const recommendedMilestone = projections?.find(p => p.milestone === 'Recommended Fund');
      const optimalMilestone = projections?.find(p => p.milestone === 'Optimal Fund');

      expect(minimumMilestone?.month).toBeLessThan(recommendedMilestone?.month || Infinity);
      expect(recommendedMilestone?.month).toBeLessThan(optimalMilestone?.month || Infinity);
    });
  });

  describe('Building Phases', () => {
    it('should generate appropriate building phases', () => {
      const { result } = renderHook(() => useEmergencyFund());
      
      const phases = result.current[0].result?.buildingPhases;
      expect(phases).toHaveLength(3);
      expect(phases?.[0].priority).toBe('critical');
      expect(phases?.[1].priority).toBe('important');
      expect(phases?.[2].priority).toBe('optimal');
    });

    it('should adjust phase targets based on expenses', () => {
      const { result } = renderHook(() => useEmergencyFund());
      
      act(() => {
        result.current[1].setValues({
          monthlyExpenses: 5000
        });
      });

      const phases = result.current[0].result?.buildingPhases;
      expect(phases?.[1].targetAmount).toBe(15000); // 3 months
      expect(phases?.[2].targetAmount).toBeGreaterThan(15000); // Recommended months
    });
  });

  describe('Insights Generation', () => {
    it('should generate warnings for insufficient fund', () => {
      const { result } = renderHook(() => useEmergencyFund());
      
      act(() => {
        result.current[1].setValues({
          monthlyExpenses: 4000,
          currentSavings: 5000 // Less than 3 months
        });
      });

      const insights = result.current[0].result?.insights;
      expect(insights).toContainEqual(
        expect.objectContaining({
          type: 'warning',
          message: expect.stringContaining('below minimum')
        })
      );
    });

    it('should provide positive feedback for adequate fund', () => {
      const { result } = renderHook(() => useEmergencyFund());
      
      act(() => {
        result.current[1].setValues({
          monthlyExpenses: 4000,
          currentSavings: 24000 // 6 months
        });
      });

      const insights = result.current[0].result?.insights;
      expect(insights).toContainEqual(
        expect.objectContaining({
          type: 'success',
          message: expect.stringContaining('at or above recommended level')
        })
      );
    });

    it('should warn about high risk with insufficient savings', () => {
      const { result } = renderHook(() => useEmergencyFund());
      
      act(() => {
        result.current[1].setValues({
          monthlyExpenses: 4000,
          currentSavings: 5000,
          jobStability: 'unstable',
          debtLevel: 'high'
        });
      });

      const insights = result.current[0].result?.insights;
      expect(insights).toContainEqual(
        expect.objectContaining({
          type: 'warning',
          message: expect.stringContaining('High debt level')
        })
      );
    });
  });
});

