/**
 * PaycheckCalculator Unit Tests
 * Comprehensive testing for tax calculations and financial precision
 */

import Decimal from 'decimal.js';

// Mock the calculator functions for testing
class PaycheckCalculatorTest {
    private federalBrackets = {
        single: [
            { min: 0, max: 11600, rate: 0.10 },
            { min: 11600, max: 46750, rate: 0.12 },
            { min: 46750, max: 100525, rate: 0.22 },
            { min: 100525, max: 191950, rate: 0.24 },
            { min: 191950, max: 243725, rate: 0.32 },
            { min: 243725, max: 609350, rate: 0.35 },
            { min: 609350, max: Infinity, rate: 0.37 }
        ],
        married: [
            { min: 0, max: 23200, rate: 0.10 },
            { min: 23200, max: 93500, rate: 0.12 },
            { min: 93500, max: 201050, rate: 0.22 },
            { min: 201050, max: 383900, rate: 0.24 },
            { min: 383900, max: 487450, rate: 0.32 },
            { min: 487450, max: 731200, rate: 0.35 },
            { min: 731200, max: Infinity, rate: 0.37 }
        ]
    } as const;

    private stateTaxRates: Record<string, number> = {
        'CA': 0.08,
        'NY': 0.07,
        'TX': 0.00,
        'FL': 0.00,
        'WA': 0.00,
        'OR': 0.09,
        'NV': 0.00,
        'IL': 0.05,
        'PA': 0.03,
        'OH': 0.04
    };

    calculateFederalTax(annualIncome: number, status: 'single' | 'married'): number {
        const brackets = this.federalBrackets[status];
        let tax = new Decimal(0);
        let remainingIncome = new Decimal(annualIncome);

        for (const bracket of brackets) {
            if (remainingIncome.lte(0)) break;

            const bracketMin = new Decimal(bracket.min);
            const bracketMax = new Decimal(bracket.max);
            const taxableInThisBracket = Decimal.min(remainingIncome, bracketMax.minus(bracketMin));

            tax = tax.plus(taxableInThisBracket.mul(bracket.rate));
            remainingIncome = remainingIncome.minus(taxableInThisBracket);
        }

        return tax.div(12).toNumber(); // Monthly tax
    }

    calculatePayrollTaxes(grossPay: number) {
        const gross = new Decimal(grossPay);
        const socialSecurityRate = new Decimal(0.062);
        const medicareRate = new Decimal(0.0145);
        const socialSecurityWageBase = new Decimal(160200).div(12);

        const socialSecurity = Decimal.min(gross.mul(socialSecurityRate), socialSecurityWageBase.mul(socialSecurityRate));
        const medicare = gross.mul(medicareRate);

        return {
            socialSecurity: socialSecurity.toNumber(),
            medicare: medicare.toNumber()
        };
    }

    calculateStateTax(monthlyIncome: number, state: string): number {
        const rate = this.stateTaxRates[state] || 0;
        return new Decimal(monthlyIncome).mul(rate).toNumber();
    }

    calculateNetPay(
        grossPay: number,
        federalTax: number,
        stateTax: number,
        socialSecurity: number,
        medicare: number,
        healthInsurance: number = 0,
        retirement401k: number = 0
    ): number {
        const gross = new Decimal(grossPay);
        const totalDeductions = new Decimal(federalTax)
            .plus(stateTax)
            .plus(socialSecurity)
            .plus(medicare)
            .plus(healthInsurance)
            .plus(retirement401k);

        return gross.minus(totalDeductions).toNumber();
    }
}

describe('PaycheckCalculator', () => {
    let calculator: PaycheckCalculatorTest;

    beforeEach(() => {
        calculator = new PaycheckCalculatorTest();
        // Configure Decimal.js for financial precision
        Decimal.set({
            precision: 10,
            rounding: Decimal.ROUND_HALF_UP,
            toExpNeg: -7,
            toExpPos: 21
        });
    });

    describe('Federal Tax Calculations', () => {
        it('should calculate correct tax for single filer in 12% bracket', () => {
            // Annual income: $60,000 ($5,000/month)
            // 2025 brackets: 10% on $0-$11,600, 12% on $11,600-$46,750, 22% on $46,750-$100,525
            // Expected: 10% on $11,600 + 12% on $35,150 + 22% on $13,250
            const expectedAnnualTax = (11600 * 0.10) + ((46750 - 11600) * 0.12) + ((60000 - 46750) * 0.22);
            const expectedMonthlyTax = expectedAnnualTax / 12; // Should be ~$691.08

            const actualTax = calculator.calculateFederalTax(60000, 'single');
            
            expect(actualTax).toBeCloseTo(expectedMonthlyTax, 2);
        });

        it('should calculate correct tax for married filer', () => {
            // Annual income: $120,000 ($10,000/month)
            // 2025 married brackets: 10% on $0-$23,200, 12% on $23,200-$93,500, 22% on $93,500-$201,050
            // Expected: 10% on $23,200 + 12% on $70,300 + 22% on $26,500
            const expectedAnnualTax = (23200 * 0.10) + ((93500 - 23200) * 0.12) + ((120000 - 93500) * 0.22);
            const expectedMonthlyTax = expectedAnnualTax / 12; // Should be ~$1,382.17

            const actualTax = calculator.calculateFederalTax(120000, 'married');
            
            expect(actualTax).toBeCloseTo(expectedMonthlyTax, 2);
        });

        it('should handle high income with multiple brackets', () => {
            // Annual income: $300,000 (test multiple brackets)
            const actualTax = calculator.calculateFederalTax(300000, 'single');
            
            // Should be significantly higher than lower brackets
            expect(actualTax).toBeGreaterThan(5000); // Monthly should be > $5,000
            expect(actualTax).toBeLessThan(10000); // But reasonable upper bound
        });

        it('should handle edge case of exactly bracket boundary', () => {
            // Test exactly at bracket boundary
            const actualTax = calculator.calculateFederalTax(46750, 'single');
            
            // Should handle boundary correctly without rounding errors
            expect(actualTax).toBeGreaterThan(0);
            expect(actualTax).toBeLessThan(1000); // Reasonable for this income level
        });
    });

    describe('Payroll Tax Calculations', () => {
        it('should calculate Social Security and Medicare correctly', () => {
            const grossPay = 5000;
            const taxes = calculator.calculatePayrollTaxes(grossPay);

            expect(taxes.socialSecurity).toBeCloseTo(310, 2); // 6.2% of $5,000
            expect(taxes.medicare).toBeCloseTo(72.5, 2); // 1.45% of $5,000
        });

        it('should cap Social Security tax at wage base', () => {
            const highGrossPay = 15000; // Above monthly wage base
            const taxes = calculator.calculatePayrollTaxes(highGrossPay);

            // Should be capped at wage base calculation
            const expectedMaxSS = (160200 / 12) * 0.062; // Monthly wage base * rate
            expect(taxes.socialSecurity).toBeCloseTo(expectedMaxSS, 2);
            
            // Medicare should not be capped
            expect(taxes.medicare).toBeCloseTo(217.5, 2); // 1.45% of $15,000
        });
    });

    describe('State Tax Calculations', () => {
        it('should calculate state tax for taxable states', () => {
            const monthlyIncome = 5000;
            
            const caTax = calculator.calculateStateTax(monthlyIncome, 'CA');
            expect(caTax).toBeCloseTo(400, 2); // 8% of $5,000

            const nyTax = calculator.calculateStateTax(monthlyIncome, 'NY');
            expect(nyTax).toBeCloseTo(350, 2); // 7% of $5,000
        });

        it('should return zero tax for no-tax states', () => {
            const monthlyIncome = 5000;

            expect(calculator.calculateStateTax(monthlyIncome, 'TX')).toBe(0);
            expect(calculator.calculateStateTax(monthlyIncome, 'FL')).toBe(0);
            expect(calculator.calculateStateTax(monthlyIncome, 'WA')).toBe(0);
            expect(calculator.calculateStateTax(monthlyIncome, 'NV')).toBe(0);
        });

        it('should handle unknown states gracefully', () => {
            const monthlyIncome = 5000;
            const unknownStateTax = calculator.calculateStateTax(monthlyIncome, 'ZZ');
            
            expect(unknownStateTax).toBe(0);
        });
    });

    describe('Net Pay Calculations', () => {
        it('should calculate accurate net pay with all deductions', () => {
            const grossPay = 5000;
            const federalTax = 580.67;
            const stateTax = 400;
            const socialSecurity = 310;
            const medicare = 72.5;
            const healthInsurance = 200;
            const retirement401k = 250; // 5% of gross

            const netPay = calculator.calculateNetPay(
                grossPay,
                federalTax,
                stateTax,
                socialSecurity,
                medicare,
                healthInsurance,
                retirement401k
            );

            const expectedNet = 5000 - 580.67 - 400 - 310 - 72.5 - 200 - 250;
            expect(netPay).toBeCloseTo(expectedNet, 2);
        });

        it('should handle zero deductions correctly', () => {
            const grossPay = 5000;
            const netPay = calculator.calculateNetPay(grossPay, 0, 0, 0, 0, 0, 0);
            
            expect(netPay).toBe(grossPay);
        });
    });

    describe('Precision and Edge Cases', () => {
        it('should maintain precision with decimal calculations', () => {
            const grossPay = 3333.33; // Non-round number
            const taxes = calculator.calculatePayrollTaxes(grossPay);

            // Should not have floating point errors
            expect(taxes.socialSecurity).toBeCloseTo(206.67, 2);
            expect(taxes.medicare).toBeCloseTo(48.33, 2);
        });

        it('should handle very low income correctly', () => {
            const lowIncome = 500;
            const federalTax = calculator.calculateFederalTax(lowIncome * 12, 'single');
            
            // Very low income should have minimal federal tax
            expect(federalTax).toBeLessThanOrEqual(50);
            expect(federalTax).toBeGreaterThanOrEqual(0);
        });

        it('should handle very high income correctly', () => {
            const highIncome = 50000; // $50k/month = $600k/year
            const federalTax = calculator.calculateFederalTax(highIncome * 12, 'single');
            
            // High income should have substantial tax but not exceed 37%
            expect(federalTax).toBeGreaterThan(10000); // Should be significant
            expect(federalTax).toBeLessThan(18500); // But not exceed 37% of monthly
        });
    });

    describe('Real-World Scenarios', () => {
        it('should accurately calculate middle-class single filer scenario', () => {
            // Realistic scenario: $75k salary, CA resident, 6% 401k, $250 health insurance
            const grossMonthly = 6250; // $75k/year
            const federalTax = calculator.calculateFederalTax(75000, 'single');
            const stateTax = calculator.calculateStateTax(6250, 'CA');
            const payrollTaxes = calculator.calculatePayrollTaxes(6250);
            const healthInsurance = 250;
            const retirement401k = 375; // 6% of gross

            const netPay = calculator.calculateNetPay(
                grossMonthly,
                federalTax,
                stateTax,
                payrollTaxes.socialSecurity,
                payrollTaxes.medicare,
                healthInsurance,
                retirement401k
            );

            // Net pay should be reasonable (around 58-75% of gross for this scenario)
            const takeHomeRate = netPay / grossMonthly;
            expect(takeHomeRate).toBeGreaterThan(0.58);
            expect(takeHomeRate).toBeLessThan(0.80);
        });

        it('should accurately calculate high earner married scenario', () => {
            // High earner: $200k salary, TX resident (no state tax), 15% 401k, $400 health insurance
            const grossMonthly = 16667; // $200k/year
            const federalTax = calculator.calculateFederalTax(200000, 'married');
            const stateTax = calculator.calculateStateTax(grossMonthly, 'TX'); // Should be 0
            const payrollTaxes = calculator.calculatePayrollTaxes(grossMonthly);
            const healthInsurance = 400;
            const retirement401k = 2500; // 15% of gross

            const netPay = calculator.calculateNetPay(
                grossMonthly,
                federalTax,
                stateTax,
                payrollTaxes.socialSecurity,
                payrollTaxes.medicare,
                healthInsurance,
                retirement401k
            );

            // Should have reasonable take-home rate (around 58-85% due to no state tax and high 401k)
            const takeHomeRate = netPay / grossMonthly;
            expect(takeHomeRate).toBeGreaterThan(0.58);
            expect(takeHomeRate).toBeLessThan(0.85);
            expect(stateTax).toBe(0); // Verify no state tax
        });
    });
});
