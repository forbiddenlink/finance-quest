import { renderHook, act } from '@testing-library/react';
import { useCreditScore } from '@/lib/hooks/calculators/useCreditScore';
import { runCommonCalculatorTests } from '@/lib/utils/calculatorTestUtils';

// Mock progressStore
jest.mock('@/lib/store/progressStore', () => ({
  useProgressStore: () => (calculatorId: string) => {}
}));

describe('useCreditScore', () => {
  // Run common calculator tests
  runCommonCalculatorTests({
    hook: useCreditScore,
    validInputs: {
      current: {
        paymentHistory: 85,
        creditUtilization: 30,
        creditAge: 5,
        creditMix: 3,
        newCredit: 2
      },
      target: {
        paymentHistory: 100,
        creditUtilization: 10,
        creditAge: 8,
        creditMix: 4,
        newCredit: 1
      }
    },
    invalidInputs: {
      current: {
        paymentHistory: -10,
        creditUtilization: 150,
        creditAge: -1,
        creditMix: 10,
        newCredit: 20
      },
      target: {
        paymentHistory: -10,
        creditUtilization: 150,
        creditAge: -1,
        creditMix: 10,
        newCredit: 20
      }
    },
    expectedResults: {
      currentScore: 650,
      targetScore: 750,
      scoreChange: 100
    },
    fieldValidations: {
      'current.paymentHistory': [
        { value: 85, error: null },
        { value: -10, error: 'Value must be between 0 and 100' },
        { value: 150, error: 'Value must be between 0 and 100' }
      ],
      'current.creditUtilization': [
        { value: 30, error: null },
        { value: -10, error: 'Value must be between 0 and 100' },
        { value: 150, error: 'Value must be between 0 and 100' }
      ],
      'current.creditAge': [
        { value: 5, error: null },
        { value: -1, error: 'Value must be between 0 and 50' },
        { value: 60, error: 'Value must be between 0 and 50' }
      ]
    }
  });

  describe('Score Calculation', () => {
    it('should calculate credit score correctly', () => {
      const { result } = renderHook(() => useCreditScore());
      
      act(() => {
        result.current[1].setValues({
          current: {
            paymentHistory: 100,
            creditUtilization: 10,
            creditAge: 10,
            creditMix: 5,
            newCredit: 0
          },
          target: result.current[0].values.target
        });
      });

      expect(result.current[0].result?.currentScore).toBeGreaterThanOrEqual(750);
      expect(result.current[0].result?.currentGrade).toBe('Very Good');
    });

    it('should calculate score grades correctly', () => {
      const { result } = renderHook(() => useCreditScore());
      
      const testCases = [
        { score: 850, grade: 'Exceptional' },
        { score: 780, grade: 'Very Good' },
        { score: 700, grade: 'Good' },
        { score: 600, grade: 'Fair' },
        { score: 550, grade: 'Poor' }
      ];

      for (const { score, grade } of testCases) {
        // Set values that would result in the target score
        act(() => {
          result.current[1].setValues({
            current: {
              paymentHistory: score === 850 ? 100 : 85,
              creditUtilization: score === 850 ? 0 : 30,
              creditAge: score === 850 ? 20 : 5,
              creditMix: score === 850 ? 5 : 3,
              newCredit: score === 850 ? 0 : 2
            },
            target: result.current[0].values.target
          });
        });

        const calculatedGrade = result.current[0].result?.currentGrade;
        expect(calculatedGrade).toBe(grade);
      }
    });
  });

  describe('Factor Analysis', () => {
    it('should identify high priority factors correctly', () => {
      const { result } = renderHook(() => useCreditScore());
      
      act(() => {
        result.current[1].setValues({
          current: {
            paymentHistory: 70,
            creditUtilization: 80,
            creditAge: 5,
            creditMix: 3,
            newCredit: 2
          },
          target: result.current[0].values.target
        });
      });

      const highPriorityFactors = result.current[0].result?.factorAnalysis
        .filter(f => f.priority === 'high');

      expect(highPriorityFactors).toHaveLength(2);
      expect(highPriorityFactors?.map(f => f.name)).toContain('Payment History');
      expect(highPriorityFactors?.map(f => f.name)).toContain('Credit Utilization');
    });

    it('should calculate factor impacts correctly', () => {
      const { result } = renderHook(() => useCreditScore());
      
      act(() => {
        result.current[1].setValues({
          current: {
            paymentHistory: 80,
            creditUtilization: 50,
            creditAge: 5,
            creditMix: 3,
            newCredit: 2
          },
          target: {
            paymentHistory: 100,
            creditUtilization: 10,
            creditAge: 8,
            creditMix: 4,
            newCredit: 1
          }
        });
      });

      const factorAnalysis = result.current[0].result?.factorAnalysis;
      expect(factorAnalysis).toBeDefined();

      // Payment history impact (20 point improvement * 0.35 weight)
      const paymentFactor = factorAnalysis?.find(f => f.name === 'Payment History');
      expect(paymentFactor?.impact).toBeCloseTo(7, 1);

      // Utilization impact (40 point improvement * 0.30 weight)
      const utilizationFactor = factorAnalysis?.find(f => f.name === 'Credit Utilization');
      expect(utilizationFactor?.impact).toBeCloseTo(12, 1);
    });
  });

  describe('Timeline Projections', () => {
    it('should generate realistic timeline projections', () => {
      const { result } = renderHook(() => useCreditScore());
      
      const projections = result.current[0].result?.timelineProjections;
      expect(projections).toBeDefined();
      expect(projections?.length).toBeGreaterThan(0);

      // Verify increasing scores
      for (let i = 1; i < (projections?.length || 0); i++) {
        expect(projections?.[i].score).toBeGreaterThanOrEqual(projections?.[i-1].score || 0);
      }

      // Verify final score matches or approaches target
      const finalScore = projections?.[projections.length - 1].score;
      const targetScore = result.current[0].result?.targetScore;
      expect(finalScore).toBeLessThanOrEqual(targetScore || 0);
    });

    it('should include relevant improvements in projections', () => {
      const { result } = renderHook(() => useCreditScore());
      
      act(() => {
        result.current[1].setValues({
          current: {
            paymentHistory: 80,
            creditUtilization: 50,
            creditAge: 2,
            creditMix: 2,
            newCredit: 3
          },
          target: {
            paymentHistory: 100,
            creditUtilization: 10,
            creditAge: 5,
            creditMix: 4,
            newCredit: 1
          }
        });
      });

      const projections = result.current[0].result?.timelineProjections;
      
      // Early improvements should focus on utilization
      expect(projections?.[1].improvements).toContain('Reduced credit utilization');

      // Later improvements should include payment history and credit mix
      const laterProjections = projections?.slice(-2).flatMap(p => p.improvements);
      expect(laterProjections).toContain('Improved payment history');
      expect(laterProjections).toContain('Diversified credit mix');
    });
  });

  describe('Insights Generation', () => {
    it('should generate appropriate insights for poor credit', () => {
      const { result } = renderHook(() => useCreditScore());
      
      act(() => {
        result.current[1].setValues({
          current: {
            paymentHistory: 60,
            creditUtilization: 80,
            creditAge: 1,
            creditMix: 1,
            newCredit: 5
          },
          target: result.current[0].values.target
        });
      });

      const insights = result.current[0].result?.insights;
      expect(insights).toContainEqual(
        expect.objectContaining({
          type: 'warning',
          message: expect.stringContaining('significant credit challenges')
        })
      );
    });

    it('should generate appropriate insights for good credit', () => {
      const { result } = renderHook(() => useCreditScore());
      
      act(() => {
        result.current[1].setValues({
          current: {
            paymentHistory: 98,
            creditUtilization: 5,
            creditAge: 10,
            creditMix: 4,
            newCredit: 0
          },
          target: result.current[0].values.target
        });
      });

      const insights = result.current[0].result?.insights;
      expect(insights).toContainEqual(
        expect.objectContaining({
          type: 'success',
          message: expect.stringContaining('excellent rates')
        })
      );
    });

    it('should identify quick-win opportunities', () => {
      const { result } = renderHook(() => useCreditScore());
      
      act(() => {
        result.current[1].setValues({
          current: {
            paymentHistory: 90,
            creditUtilization: 60,
            creditAge: 5,
            creditMix: 3,
            newCredit: 2
          },
          target: result.current[0].values.target
        });
      });

      const insights = result.current[0].result?.insights;
      expect(insights).toContainEqual(
        expect.objectContaining({
          type: 'info',
          message: expect.stringContaining('quick score improvements')
        })
      );
    });
  });
});

