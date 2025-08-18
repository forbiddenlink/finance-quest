import React from 'react';
import { render, screen, act, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import EstateValueCalculator from '@/components/chapters/fundamentals/calculators/EstateValueCalculator';
import TrustPlanningCalculator from '@/components/chapters/fundamentals/calculators/TrustPlanningCalculator';
import InheritanceTaxCalculator from '@/components/chapters/fundamentals/calculators/InheritanceTaxCalculator';
import BeneficiaryPlanningTool from '@/components/chapters/fundamentals/calculators/BeneficiaryPlanningTool';
import { useCalculatorBase } from '@/lib/hooks/useCalculatorBase';

// Mock the useCalculatorBase hook
jest.mock('@/lib/hooks/useCalculatorBase', () => ({
  useCalculatorBase: jest.fn()
}));

describe('Chapter 18 Calculator Integration Tests', () => {
  beforeEach(() => {
    // Reset all mocks
    jest.clearAllMocks();

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

  describe('Estate Value to Trust Planning Flow', () => {
    it('should pass estate value results to trust planning calculator', async () => {
      // Mock estate value calculation results
      const estateValueResults = {
        grossEstateValue: 1000000,
        totalLiabilities: 200000,
        netEstateValue: 800000,
        federalEstateTax: 50000,
        stateEstateTax: 30000,
        totalTaxLiability: 80000,
        netToHeirs: 720000,
        potentialTaxSavings: 20000,
        recommendedStrategies: ['Consider establishing a trust']
      };

      // Setup estate value calculator
      const mockEstateValueCalculate = jest.fn().mockResolvedValue(estateValueResults);
      (useCalculatorBase as jest.Mock).mockReturnValueOnce({
        calculate: mockEstateValueCalculate,
        isCalculating: false,
        lastCalculated: estateValueResults,
        resetCalculator: jest.fn(),
        saveToHistory: jest.fn(),
        history: []
      });

      // Setup trust planning calculator
      const mockTrustPlanningCalculate = jest.fn();
      (useCalculatorBase as jest.Mock).mockReturnValueOnce({
        calculate: mockTrustPlanningCalculate,
        isCalculating: false,
        lastCalculated: null,
        resetCalculator: jest.fn(),
        saveToHistory: jest.fn(),
        history: []
      });

      // Render both calculators
      render(
        <>
          <EstateValueCalculator />
          <TrustPlanningCalculator />
        </>
      );

      // Fill out estate value form
      const assetInput = screen.getByRole('spinbutton', { name: /total assets/i });
      await userEvent.type(assetInput, '1000000');

      // Calculate estate value
      const calculateButton = screen.getByRole('button', { name: /calculate estate value/i });
      await userEvent.click(calculateButton);

      // Verify estate value results
      await waitFor(() => {
        expect(screen.getByText('$800,000')).toBeInTheDocument(); // Net estate value
      });

      // Transfer results to trust planning
      const transferButton = screen.getByRole('button', { name: /use for trust planning/i });
      await userEvent.click(transferButton);

      // Verify trust planning calculator received the values
      await waitFor(() => {
        expect(mockTrustPlanningCalculate).toHaveBeenCalledWith(
          expect.objectContaining({
            totalAssetValue: 800000 // Net estate value
          })
        );
      });
    });
  });

  describe('Trust Planning to Inheritance Tax Flow', () => {
    it('should pass trust planning results to inheritance tax calculator', async () => {
      // Mock trust planning calculation results
      const trustPlanningResults = {
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
      };

      // Setup trust planning calculator
      const mockTrustPlanningCalculate = jest.fn().mockResolvedValue(trustPlanningResults);
      (useCalculatorBase as jest.Mock).mockReturnValueOnce({
        calculate: mockTrustPlanningCalculate,
        isCalculating: false,
        lastCalculated: trustPlanningResults,
        resetCalculator: jest.fn(),
        saveToHistory: jest.fn(),
        history: []
      });

      // Setup inheritance tax calculator
      const mockInheritanceTaxCalculate = jest.fn();
      (useCalculatorBase as jest.Mock).mockReturnValueOnce({
        calculate: mockInheritanceTaxCalculate,
        isCalculating: false,
        lastCalculated: null,
        resetCalculator: jest.fn(),
        saveToHistory: jest.fn(),
        history: []
      });

      // Render both calculators
      render(
        <>
          <TrustPlanningCalculator />
          <InheritanceTaxCalculator />
        </>
      );

      // Fill out trust planning form
      const trustTypeSelect = screen.getByRole('combobox', { name: /trust type/i });
      await userEvent.selectOptions(trustTypeSelect, 'revocable');

      // Calculate trust planning
      const calculateButton = screen.getByRole('button', { name: /calculate trust impact/i });
      await userEvent.click(calculateButton);

      // Verify trust planning results
      await waitFor(() => {
        expect(screen.getByText('$1,000,000')).toBeInTheDocument(); // Total asset value
      });

      // Transfer results to inheritance tax
      const transferButton = screen.getByRole('button', { name: /calculate inheritance tax/i });
      await userEvent.click(transferButton);

      // Verify inheritance tax calculator received the values
      await waitFor(() => {
        expect(mockInheritanceTaxCalculate).toHaveBeenCalledWith(
          expect.objectContaining({
            totalInheritance: 1000000,
            trustType: 'revocable'
          })
        );
      });
    });
  });

  describe('Inheritance Tax to Beneficiary Planning Flow', () => {
    it('should pass inheritance tax results to beneficiary planning tool', async () => {
      // Mock inheritance tax calculation results
      const inheritanceTaxResults = {
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
      };

      // Setup inheritance tax calculator
      const mockInheritanceTaxCalculate = jest.fn().mockResolvedValue(inheritanceTaxResults);
      (useCalculatorBase as jest.Mock).mockReturnValueOnce({
        calculate: mockInheritanceTaxCalculate,
        isCalculating: false,
        lastCalculated: inheritanceTaxResults,
        resetCalculator: jest.fn(),
        saveToHistory: jest.fn(),
        history: []
      });

      // Setup beneficiary planning tool
      const mockBeneficiaryPlanningCalculate = jest.fn();
      (useCalculatorBase as jest.Mock).mockReturnValueOnce({
        calculate: mockBeneficiaryPlanningCalculate,
        isCalculating: false,
        lastCalculated: null,
        resetCalculator: jest.fn(),
        saveToHistory: jest.fn(),
        history: []
      });

      // Render both calculators
      render(
        <>
          <InheritanceTaxCalculator />
          <BeneficiaryPlanningTool />
        </>
      );

      // Fill out inheritance tax form
      const stateSelect = screen.getByRole('combobox', { name: /state/i });
      await userEvent.selectOptions(stateSelect, 'PA');

      // Calculate inheritance tax
      const calculateButton = screen.getByRole('button', { name: /calculate inheritance tax/i });
      await userEvent.click(calculateButton);

      // Verify inheritance tax results
      await waitFor(() => {
        expect(screen.getByText('$960,000')).toBeInTheDocument(); // Net inheritance
      });

      // Transfer results to beneficiary planning
      const transferButton = screen.getByRole('button', { name: /plan beneficiaries/i });
      await userEvent.click(transferButton);

      // Verify beneficiary planning tool received the values
      await waitFor(() => {
        expect(mockBeneficiaryPlanningCalculate).toHaveBeenCalledWith(
          expect.objectContaining({
            totalAssets: 960000, // Net inheritance
            taxConsiderations: {
              federalTaxPaid: 0,
              stateTaxPaid: 40000
            }
          })
        );
      });
    });
  });

  describe('Full Estate Planning Flow', () => {
    it('should maintain data consistency through the entire planning process', async () => {
      // Mock all calculator results
      const estateValueResults = {
        grossEstateValue: 1000000,
        totalLiabilities: 200000,
        netEstateValue: 800000,
        federalEstateTax: 50000,
        stateEstateTax: 30000,
        totalTaxLiability: 80000,
        netToHeirs: 720000,
        potentialTaxSavings: 20000,
        recommendedStrategies: ['Consider establishing a trust']
      };

      const trustPlanningResults = {
        totalAssetValue: 800000, // From estate value
        projectedGrowth: 40000,
        estateTaxSavings: 20000,
        incomeTaxImpact: -8000,
        beneficiaryDistributions: [
          { beneficiaryName: 'John Doe', amount: 800000, timing: 'Staged distribution' }
        ],
        controlRetained: true,
        assetProtectionLevel: 'medium',
        flexibilityLevel: 'high',
        annualMaintenanceCost: 1200,
        recommendedFeatures: ['Privacy protection'],
        warnings: []
      };

      const inheritanceTaxResults = {
        totalInheritance: 800000, // From trust planning
        federalTax: 0,
        stateTax: 32000,
        totalTax: 32000,
        netInheritance: 768000,
        stepUpBasis: true,
        capitalGainsSavings: 20000,
        exemptionUsed: 0,
        portabilityAvailable: true,
        stateSpecificDeductions: ['Family-owned business deduction'],
        recommendations: [],
        warnings: []
      };

      const beneficiaryPlanningResults = {
        beneficiaries: [
          {
            name: 'John Doe',
            relationship: 'Child',
            share: 100,
            specialNeeds: false,
            contingentBeneficiary: 'Jane Doe',
            distributionTiming: 'Staged',
            distributionSchedule: ['Age 25: 25%', 'Age 30: 75%']
          }
        ],
        totalAssets: 768000, // From inheritance tax
        distributionStrategy: 'Per Stirpes',
        taxImplications: {
          estateTax: 0,
          giftTax: 0,
          generationSkippingTax: 0
        },
        specialProvisions: ['Education fund'],
        reviewSchedule: {
          nextReview: '2024-06-01',
          frequency: 'Annual',
          lastReviewed: '2023-06-01'
        },
        warnings: []
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

      // Render all calculators
      render(
        <>
          <EstateValueCalculator />
          <TrustPlanningCalculator />
          <InheritanceTaxCalculator />
          <BeneficiaryPlanningTool />
        </>
      );

      // Step 1: Estate Value Calculation
      const assetInput = screen.getByRole('spinbutton', { name: /total assets/i });
      await userEvent.type(assetInput, '1000000');
      await userEvent.click(screen.getByRole('button', { name: /calculate estate value/i }));

      // Verify estate value results and transfer to trust planning
      await waitFor(() => {
        expect(screen.getByText('$800,000')).toBeInTheDocument(); // Net estate value
      });
      await userEvent.click(screen.getByRole('button', { name: /use for trust planning/i }));

      // Step 2: Trust Planning
      await waitFor(() => {
        expect(mockTrustPlanningCalculate).toHaveBeenCalledWith(
          expect.objectContaining({
            totalAssetValue: 800000
          })
        );
      });
      await userEvent.click(screen.getByRole('button', { name: /calculate trust impact/i }));

      // Verify trust planning results and transfer to inheritance tax
      await waitFor(() => {
        expect(screen.getByText('$800,000')).toBeInTheDocument(); // Total asset value
      });
      await userEvent.click(screen.getByRole('button', { name: /calculate inheritance tax/i }));

      // Step 3: Inheritance Tax
      await waitFor(() => {
        expect(mockInheritanceTaxCalculate).toHaveBeenCalledWith(
          expect.objectContaining({
            totalInheritance: 800000
          })
        );
      });
      await userEvent.click(screen.getByRole('button', { name: /calculate inheritance tax/i }));

      // Verify inheritance tax results and transfer to beneficiary planning
      await waitFor(() => {
        expect(screen.getByText('$768,000')).toBeInTheDocument(); // Net inheritance
      });
      await userEvent.click(screen.getByRole('button', { name: /plan beneficiaries/i }));

      // Step 4: Beneficiary Planning
      await waitFor(() => {
        expect(mockBeneficiaryPlanningCalculate).toHaveBeenCalledWith(
          expect.objectContaining({
            totalAssets: 768000
          })
        );
      });

      // Verify final beneficiary planning results
      await waitFor(() => {
        expect(screen.getByText('$768,000')).toBeInTheDocument(); // Total assets
      });

      // Verify data consistency through the entire flow
      expect(mockTrustPlanningCalculate).toHaveBeenCalledWith(
        expect.objectContaining({
          totalAssetValue: estateValueResults.netEstateValue
        })
      );

      expect(mockInheritanceTaxCalculate).toHaveBeenCalledWith(
        expect.objectContaining({
          totalInheritance: trustPlanningResults.totalAssetValue
        })
      );

      expect(mockBeneficiaryPlanningCalculate).toHaveBeenCalledWith(
        expect.objectContaining({
          totalAssets: inheritanceTaxResults.netInheritance
        })
      );
    });
  });

  describe('Error Handling and Edge Cases', () => {
    it('should handle calculation errors gracefully', async () => {
      // Mock estate value calculator with error
      const mockError = new Error('Invalid asset value');
      const mockEstateValueCalculate = jest.fn().mockRejectedValue(mockError);
      (useCalculatorBase as jest.Mock).mockReturnValue({
        calculate: mockEstateValueCalculate,
        isCalculating: false,
        lastCalculated: null,
        resetCalculator: jest.fn(),
        saveToHistory: jest.fn(),
        history: []
      });

      render(<EstateValueCalculator />);

      // Trigger calculation
      const calculateButton = screen.getByRole('button', { name: /calculate estate value/i });
      await userEvent.click(calculateButton);

      // Verify error handling
      await waitFor(() => {
        expect(screen.getByRole('alert')).toHaveTextContent('Invalid asset value');
      });
    });

    it('should handle zero values appropriately', async () => {
      // Mock estate value calculation with zero values
      const zeroValueResults = {
        grossEstateValue: 0,
        totalLiabilities: 0,
        netEstateValue: 0,
        federalEstateTax: 0,
        stateEstateTax: 0,
        totalTaxLiability: 0,
        netToHeirs: 0,
        potentialTaxSavings: 0,
        recommendedStrategies: ['No estate planning needed at this time']
      };

      const mockEstateValueCalculate = jest.fn().mockResolvedValue(zeroValueResults);
      (useCalculatorBase as jest.Mock).mockReturnValue({
        calculate: mockEstateValueCalculate,
        isCalculating: false,
        lastCalculated: zeroValueResults,
        resetCalculator: jest.fn(),
        saveToHistory: jest.fn(),
        history: []
      });

      render(<EstateValueCalculator />);

      // Fill out form with zero
      const assetInput = screen.getByRole('spinbutton', { name: /total assets/i });
      await userEvent.type(assetInput, '0');

      // Calculate
      const calculateButton = screen.getByRole('button', { name: /calculate estate value/i });
      await userEvent.click(calculateButton);

      // Verify appropriate handling of zero values
      await waitFor(() => {
        expect(screen.getByText('No estate planning needed at this time')).toBeInTheDocument();
      });
    });

    it('should validate data consistency between calculators', async () => {
      // Mock estate value results
      const estateValueResults = {
        grossEstateValue: 1000000,
        netEstateValue: 800000
      };

      // Mock trust planning with inconsistent value
      const trustPlanningResults = {
        totalAssetValue: 900000 // Inconsistent with estate value
      };

      const mockEstateValueCalculate = jest.fn().mockResolvedValue(estateValueResults);
      const mockTrustPlanningCalculate = jest.fn().mockResolvedValue(trustPlanningResults);

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
        });

      render(
        <>
          <EstateValueCalculator />
          <TrustPlanningCalculator />
        </>
      );

      // Calculate estate value
      await userEvent.click(screen.getByRole('button', { name: /calculate estate value/i }));

      // Transfer to trust planning
      await userEvent.click(screen.getByRole('button', { name: /use for trust planning/i }));

      // Verify data consistency warning
      await waitFor(() => {
        expect(screen.getByRole('alert')).toHaveTextContent(/data consistency warning/i);
      });
    });
  });
});
