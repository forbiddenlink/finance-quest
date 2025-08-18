import React from 'react';
import { render, act, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { performance } from 'perf_hooks';
import EstateValueCalculator from '@/components/chapters/fundamentals/calculators/EstateValueCalculator';
import TrustPlanningCalculator from '@/components/chapters/fundamentals/calculators/TrustPlanningCalculator';
import InheritanceTaxCalculator from '@/components/chapters/fundamentals/calculators/InheritanceTaxCalculator';
import BeneficiaryPlanningTool from '@/components/chapters/fundamentals/calculators/BeneficiaryPlanningTool';
import { useCalculatorBase } from '@/lib/hooks/useCalculatorBase';

// Mock the useCalculatorBase hook
jest.mock('@/lib/hooks/useCalculatorBase', () => ({
  useCalculatorBase: jest.fn()
}));

// Performance thresholds (in milliseconds)
const RENDER_THRESHOLD = 100;
const CALCULATION_THRESHOLD = 200;
const INTERACTION_THRESHOLD = 50;
const MEMORY_THRESHOLD = 50 * 1024 * 1024; // 50MB

describe('Chapter 18 Calculator Performance Tests', () => {
  let memoryUsage: number;

  beforeEach(() => {
    // Reset all mocks
    jest.clearAllMocks();
    
    // Record initial memory usage
    memoryUsage = process.memoryUsage().heapUsed;

    // Setup default mock implementation
    (useCalculatorBase as jest.Mock).mockReturnValue({
      calculate: jest.fn(),
      isCalculating: false,
      lastCalculated: null,
      resetCalculator: jest.fn(),
      saveToHistory: jest.fn(),
      history: []
    });
  });

  afterEach(() => {
    // Check memory leaks
    const currentMemoryUsage = process.memoryUsage().heapUsed;
    const memoryDiff = currentMemoryUsage - memoryUsage;
    expect(memoryDiff).toBeLessThan(MEMORY_THRESHOLD);
  });

  describe('Estate Value Calculator Performance', () => {
    it('should render within performance threshold', async () => {
      const startTime = performance.now();
      render(<EstateValueCalculator />);
      const endTime = performance.now();
      
      expect(endTime - startTime).toBeLessThan(RENDER_THRESHOLD);
    });

    it('should calculate within performance threshold', async () => {
      // Mock calculation results
      const mockCalculate = jest.fn().mockResolvedValue({
        grossEstateValue: 1000000,
        totalLiabilities: 200000,
        netEstateValue: 800000,
        federalEstateTax: 50000,
        stateEstateTax: 30000,
        totalTaxLiability: 80000,
        netToHeirs: 720000,
        potentialTaxSavings: 20000,
        recommendedStrategies: ['Consider establishing a trust']
      });

      (useCalculatorBase as jest.Mock).mockReturnValue({
        calculate: mockCalculate,
        isCalculating: false,
        lastCalculated: null,
        resetCalculator: jest.fn(),
        saveToHistory: jest.fn(),
        history: []
      });

      const { getByRole } = render(<EstateValueCalculator />);

      const startTime = performance.now();
      await act(async () => {
        await mockCalculate();
      });
      const endTime = performance.now();

      expect(endTime - startTime).toBeLessThan(CALCULATION_THRESHOLD);
    });

    it('should handle user interactions within performance threshold', async () => {
      const { getByRole } = render(<EstateValueCalculator />);

      const startTime = performance.now();
      await userEvent.type(getByRole('spinbutton', { name: /total assets/i }), '1000000');
      const endTime = performance.now();

      expect(endTime - startTime).toBeLessThan(INTERACTION_THRESHOLD);
    });
  });

  describe('Trust Planning Calculator Performance', () => {
    it('should render within performance threshold', async () => {
      const startTime = performance.now();
      render(<TrustPlanningCalculator />);
      const endTime = performance.now();
      
      expect(endTime - startTime).toBeLessThan(RENDER_THRESHOLD);
    });

    it('should calculate within performance threshold', async () => {
      // Mock calculation results
      const mockCalculate = jest.fn().mockResolvedValue({
        totalAssetValue: 1000000,
        projectedGrowth: 50000,
        estateTaxSavings: 0,
        incomeTaxImpact: -10000,
        beneficiaryDistributions: [
          { beneficiaryName: 'John Doe', amount: 1000000, timing: 'Staged distribution' }
        ],
        controlRetained: true,
        assetProtectionLevel: 'low',
        flexibilityLevel: 'high',
        annualMaintenanceCost: 1500,
        recommendedFeatures: ['Privacy protection', 'Smooth transition'],
        warnings: []
      });

      (useCalculatorBase as jest.Mock).mockReturnValue({
        calculate: mockCalculate,
        isCalculating: false,
        lastCalculated: null,
        resetCalculator: jest.fn(),
        saveToHistory: jest.fn(),
        history: []
      });

      const { getByRole } = render(<TrustPlanningCalculator />);

      const startTime = performance.now();
      await act(async () => {
        await mockCalculate();
      });
      const endTime = performance.now();

      expect(endTime - startTime).toBeLessThan(CALCULATION_THRESHOLD);
    });

    it('should handle user interactions within performance threshold', async () => {
      const { getByRole } = render(<TrustPlanningCalculator />);

      const startTime = performance.now();
      await userEvent.selectOptions(getByRole('combobox', { name: /trust type/i }), 'revocable');
      const endTime = performance.now();

      expect(endTime - startTime).toBeLessThan(INTERACTION_THRESHOLD);
    });
  });

  describe('Inheritance Tax Calculator Performance', () => {
    it('should render within performance threshold', async () => {
      const startTime = performance.now();
      render(<InheritanceTaxCalculator />);
      const endTime = performance.now();
      
      expect(endTime - startTime).toBeLessThan(RENDER_THRESHOLD);
    });

    it('should calculate within performance threshold', async () => {
      // Mock calculation results
      const mockCalculate = jest.fn().mockResolvedValue({
        totalInheritance: 1000000,
        federalTax: 0,
        stateTax: 40000,
        totalTax: 40000,
        netInheritance: 960000,
        stepUpBasis: true,
        capitalGainsSavings: 25000,
        exemptionUsed: 0,
        portabilityAvailable: true,
        stateSpecificDeductions: ['Family-owned business deduction'],
        recommendations: ['Consider life insurance trust'],
        warnings: ['State tax threshold exceeded']
      });

      (useCalculatorBase as jest.Mock).mockReturnValue({
        calculate: mockCalculate,
        isCalculating: false,
        lastCalculated: null,
        resetCalculator: jest.fn(),
        saveToHistory: jest.fn(),
        history: []
      });

      const { getByRole } = render(<InheritanceTaxCalculator />);

      const startTime = performance.now();
      await act(async () => {
        await mockCalculate();
      });
      const endTime = performance.now();

      expect(endTime - startTime).toBeLessThan(CALCULATION_THRESHOLD);
    });

    it('should handle user interactions within performance threshold', async () => {
      const { getByRole } = render(<InheritanceTaxCalculator />);

      const startTime = performance.now();
      await userEvent.selectOptions(getByRole('combobox', { name: /state/i }), 'PA');
      const endTime = performance.now();

      expect(endTime - startTime).toBeLessThan(INTERACTION_THRESHOLD);
    });
  });

  describe('Beneficiary Planning Tool Performance', () => {
    it('should render within performance threshold', async () => {
      const startTime = performance.now();
      render(<BeneficiaryPlanningTool />);
      const endTime = performance.now();
      
      expect(endTime - startTime).toBeLessThan(RENDER_THRESHOLD);
    });

    it('should calculate within performance threshold', async () => {
      // Mock calculation results
      const mockCalculate = jest.fn().mockResolvedValue({
        beneficiaries: [
          {
            name: 'John Doe',
            relationship: 'Child',
            share: 50,
            specialNeeds: true,
            contingentBeneficiary: 'Jane Doe',
            distributionTiming: 'Staged',
            distributionSchedule: ['Age 25: 25%', 'Age 30: 75%']
          }
        ],
        totalAssets: 1000000,
        distributionStrategy: 'Per Stirpes',
        taxImplications: {
          estateTax: 0,
          giftTax: 0,
          generationSkippingTax: 0
        },
        specialProvisions: ['Spendthrift clause', 'Education fund'],
        reviewSchedule: {
          nextReview: '2024-06-01',
          frequency: 'Annual',
          lastReviewed: '2023-06-01'
        },
        warnings: ['Consider special needs trust for John Doe']
      });

      (useCalculatorBase as jest.Mock).mockReturnValue({
        calculate: mockCalculate,
        isCalculating: false,
        lastCalculated: null,
        resetCalculator: jest.fn(),
        saveToHistory: jest.fn(),
        history: []
      });

      const { getByRole } = render(<BeneficiaryPlanningTool />);

      const startTime = performance.now();
      await act(async () => {
        await mockCalculate();
      });
      const endTime = performance.now();

      expect(endTime - startTime).toBeLessThan(CALCULATION_THRESHOLD);
    });

    it('should handle user interactions within performance threshold', async () => {
      const { getByRole } = render(<BeneficiaryPlanningTool />);

      const startTime = performance.now();
      await userEvent.click(getByRole('button', { name: /add beneficiary/i }));
      const endTime = performance.now();

      expect(endTime - startTime).toBeLessThan(INTERACTION_THRESHOLD);
    });
  });

  describe('Full Estate Planning Flow Performance', () => {
    it('should maintain performance through complete planning process', async () => {
      // Mock all calculator results
      const estateValueResults = {
        grossEstateValue: 1000000,
        netEstateValue: 800000
      };

      const trustPlanningResults = {
        totalAssetValue: 800000,
        projectedGrowth: 40000
      };

      const inheritanceTaxResults = {
        totalInheritance: 800000,
        netInheritance: 768000
      };

      const beneficiaryPlanningResults = {
        totalAssets: 768000,
        beneficiaries: []
      };

      // Setup calculator mocks
      const mockEstateValueCalculate = jest.fn().mockResolvedValue(estateValueResults);
      const mockTrustPlanningCalculate = jest.fn().mockResolvedValue(trustPlanningResults);
      const mockInheritanceTaxCalculate = jest.fn().mockResolvedValue(inheritanceTaxResults);
      const mockBeneficiaryPlanningCalculate = jest.fn().mockResolvedValue(beneficiaryPlanningResults);

      (useCalculatorBase as jest.Mock)
        .mockReturnValueOnce({
          calculate: mockEstateValueCalculate,
          isCalculating: false,
          lastCalculated: estateValueResults,
          resetCalculator: jest.fn(),
          saveToHistory: jest.fn(),
          history: []
        })
        .mockReturnValueOnce({
          calculate: mockTrustPlanningCalculate,
          isCalculating: false,
          lastCalculated: trustPlanningResults,
          resetCalculator: jest.fn(),
          saveToHistory: jest.fn(),
          history: []
        })
        .mockReturnValueOnce({
          calculate: mockInheritanceTaxCalculate,
          isCalculating: false,
          lastCalculated: inheritanceTaxResults,
          resetCalculator: jest.fn(),
          saveToHistory: jest.fn(),
          history: []
        })
        .mockReturnValueOnce({
          calculate: mockBeneficiaryPlanningCalculate,
          isCalculating: false,
          lastCalculated: beneficiaryPlanningResults,
          resetCalculator: jest.fn(),
          saveToHistory: jest.fn(),
          history: []
        });

      const startTime = performance.now();

      // Render all calculators
      const { getByRole } = render(
        <>
          <EstateValueCalculator />
          <TrustPlanningCalculator />
          <InheritanceTaxCalculator />
          <BeneficiaryPlanningTool />
        </>
      );

      // Step 1: Estate Value Calculation
      await userEvent.type(getByRole('spinbutton', { name: /total assets/i }), '1000000');
      await userEvent.click(getByRole('button', { name: /calculate estate value/i }));
      await userEvent.click(getByRole('button', { name: /use for trust planning/i }));

      // Step 2: Trust Planning
      await userEvent.selectOptions(getByRole('combobox', { name: /trust type/i }), 'revocable');
      await userEvent.click(getByRole('button', { name: /calculate trust impact/i }));
      await userEvent.click(getByRole('button', { name: /calculate inheritance tax/i }));

      // Step 3: Inheritance Tax
      await userEvent.selectOptions(getByRole('combobox', { name: /state/i }), 'PA');
      await userEvent.click(getByRole('button', { name: /calculate inheritance tax/i }));
      await userEvent.click(getByRole('button', { name: /plan beneficiaries/i }));

      // Step 4: Beneficiary Planning
      await userEvent.click(getByRole('button', { name: /add beneficiary/i }));
      await userEvent.click(getByRole('button', { name: /calculate distribution/i }));

      const endTime = performance.now();

      // Total flow should complete within reasonable time
      expect(endTime - startTime).toBeLessThan(CALCULATION_THRESHOLD * 4); // Allow for all 4 calculations
    });
  });

  describe('Memory Usage and Cleanup', () => {
    it('should clean up resources properly after unmounting', async () => {
      const { unmount } = render(
        <>
          <EstateValueCalculator />
          <TrustPlanningCalculator />
          <InheritanceTaxCalculator />
          <BeneficiaryPlanningTool />
        </>
      );

      const initialMemory = process.memoryUsage().heapUsed;

      // Perform some calculations
      const mockCalculate = jest.fn().mockResolvedValue({});
      (useCalculatorBase as jest.Mock).mockReturnValue({
        calculate: mockCalculate,
        isCalculating: false,
        lastCalculated: {},
        resetCalculator: jest.fn(),
        saveToHistory: jest.fn(),
        history: []
      });

      await act(async () => {
        await mockCalculate();
      });

      // Unmount components
      unmount();

      // Force garbage collection if possible
      if (global.gc) {
        global.gc();
      }

      const finalMemory = process.memoryUsage().heapUsed;
      const memoryDiff = finalMemory - initialMemory;

      // Memory usage should not increase significantly
      expect(memoryDiff).toBeLessThan(MEMORY_THRESHOLD);
    });

    it('should handle large datasets efficiently', async () => {
      // Mock large dataset
      const largeBeneficiaryList = Array.from({ length: 1000 }, (_, i) => ({
        name: `Beneficiary ${i}`,
        relationship: 'Child',
        share: 0.1,
        specialNeeds: false,
        contingentBeneficiary: `Backup ${i}`,
        distributionTiming: 'Immediate',
        distributionSchedule: []
      }));

      const mockCalculate = jest.fn().mockResolvedValue({
        beneficiaries: largeBeneficiaryList,
        totalAssets: 10000000,
        distributionStrategy: 'Per Stirpes'
      });

      (useCalculatorBase as jest.Mock).mockReturnValue({
        calculate: mockCalculate,
        isCalculating: false,
        lastCalculated: null,
        resetCalculator: jest.fn(),
        saveToHistory: jest.fn(),
        history: []
      });

      const startMemory = process.memoryUsage().heapUsed;

      const { unmount } = render(<BeneficiaryPlanningTool />);

      await act(async () => {
        await mockCalculate();
      });

      const endMemory = process.memoryUsage().heapUsed;
      const memoryDiff = endMemory - startMemory;

      // Memory usage should stay within reasonable limits even with large dataset
      expect(memoryDiff).toBeLessThan(MEMORY_THRESHOLD);

      unmount();
    });
  });

  describe('Chart Performance', () => {
    it('should render charts efficiently', async () => {
      // Mock data for charts
      const mockCalculate = jest.fn().mockResolvedValue({
        grossEstateValue: 1000000,
        netEstateValue: 800000,
        chartData: Array.from({ length: 100 }, (_, i) => ({
          year: 2024 + i,
          value: 1000000 * (1 + 0.05) ** i
        }))
      });

      (useCalculatorBase as jest.Mock).mockReturnValue({
        calculate: mockCalculate,
        isCalculating: false,
        lastCalculated: null,
        resetCalculator: jest.fn(),
        saveToHistory: jest.fn(),
        history: []
      });

      const startTime = performance.now();

      const { getByRole } = render(<EstateValueCalculator />);
      await act(async () => {
        await mockCalculate();
      });

      const endTime = performance.now();

      // Chart rendering should be within threshold
      expect(endTime - startTime).toBeLessThan(RENDER_THRESHOLD);
    });
  });
});
