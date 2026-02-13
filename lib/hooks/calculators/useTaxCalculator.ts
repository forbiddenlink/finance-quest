'use client';

import { useCalculatorBase, commonValidations } from '../useCalculatorBase';
import {
  formatCurrency,
  formatPercentage,
  financialRatios
} from '@/lib/utils/financialCalculations';
import { Decimal } from 'decimal.js';

interface TaxCalculatorValues {
  income: number;
  filingStatus: 'single' | 'married' | 'headOfHousehold';
  age: number;
  dependents: number;
  itemizedDeductions: number;
  retirement401k: number;
  traditionalIRA: number;
  rothIRA: number;
  hsa: number;
  stateTaxRate: number;
  selfEmployed: boolean;
  capitalGains: number;
  dividendIncome: number;
  rentalIncome: number;
  otherIncome: number;
}

interface TaxBracket {
  rate: number;
  min: number;
  max: number;
  tax: number;
}

interface TaxCalculatorResult {
  effectiveTaxRate: number;
  marginalTaxRate: number;
  federalTax: number;
  stateTax: number;
  selfEmploymentTax: number;
  totalTax: number;
  takeHomePay: number;
  taxableIncome: number;
  deductions: {
    standard: number;
    itemized: number;
    retirement: number;
    hsa: number;
    total: number;
  };
  brackets: TaxBracket[];
  taxSavings: number;
  insights: Array<{
    type: 'success' | 'warning' | 'info';
    message: string;
  }>;
}

// 2024 Tax Brackets (example - should be updated annually)
const TAX_BRACKETS = {
  single: [
    { rate: 10, min: 0, max: 11600 },
    { rate: 12, min: 11600, max: 47150 },
    { rate: 22, min: 47150, max: 100525 },
    { rate: 24, min: 100525, max: 191950 },
    { rate: 32, min: 191950, max: 243725 },
    { rate: 35, min: 243725, max: 609350 },
    { rate: 37, min: 609350, max: Infinity }
  ],
  married: [
    { rate: 10, min: 0, max: 23200 },
    { rate: 12, min: 23200, max: 94300 },
    { rate: 22, min: 94300, max: 201050 },
    { rate: 24, min: 201050, max: 383900 },
    { rate: 32, min: 383900, max: 487450 },
    { rate: 35, min: 487450, max: 731200 },
    { rate: 37, min: 731200, max: Infinity }
  ],
  headOfHousehold: [
    { rate: 10, min: 0, max: 16550 },
    { rate: 12, min: 16550, max: 63100 },
    { rate: 22, min: 63100, max: 100500 },
    { rate: 24, min: 100500, max: 191950 },
    { rate: 32, min: 191950, max: 243700 },
    { rate: 35, min: 243700, max: 609350 },
    { rate: 37, min: 609350, max: Infinity }
  ]
};

const STANDARD_DEDUCTION = {
  single: 14600,
  married: 29200,
  headOfHousehold: 21900
};

const RETIREMENT_LIMITS = {
  '401k': 23000,
  ira: 7000,
  hsa: {
    single: 4150,
    family: 8300
  }
};

export function useTaxCalculator() {
  return useCalculatorBase<TaxCalculatorValues, TaxCalculatorResult>({
    id: 'tax-calculator',
    initialValues: {
      income: 75000,
      filingStatus: 'single',
      age: 30,
      dependents: 0,
      itemizedDeductions: 0,
      retirement401k: 0,
      traditionalIRA: 0,
      rothIRA: 0,
      hsa: 0,
      stateTaxRate: 5,
      selfEmployed: false,
      capitalGains: 0,
      dividendIncome: 0,
      rentalIncome: 0,
      otherIncome: 0
    },
    validation: {
      income: [
        commonValidations.required(),
        commonValidations.min(0)
      ],
      age: [
        commonValidations.required(),
        commonValidations.min(0),
        commonValidations.max(120)
      ],
      dependents: [
        commonValidations.required(),
        commonValidations.min(0),
        commonValidations.max(20)
      ],
      itemizedDeductions: [
        commonValidations.required(),
        commonValidations.min(0)
      ],
      retirement401k: [
        commonValidations.required(),
        commonValidations.min(0),
        {
          validate: (value) => value <= RETIREMENT_LIMITS['401k'],
          message: `401k contributions cannot exceed $${RETIREMENT_LIMITS['401k']}`
        }
      ],
      traditionalIRA: [
        commonValidations.required(),
        commonValidations.min(0),
        {
          validate: (value, allValues) => {
            const totalIRA = (value || 0) + (allValues?.rothIRA || 0);
            return totalIRA <= RETIREMENT_LIMITS.ira;
          },
          message: `Total IRA contributions cannot exceed $${RETIREMENT_LIMITS.ira}`
        }
      ],
      rothIRA: [
        commonValidations.required(),
        commonValidations.min(0),
        {
          validate: (value, allValues) => {
            const totalIRA = (value || 0) + (allValues?.traditionalIRA || 0);
            return totalIRA <= RETIREMENT_LIMITS.ira;
          },
          message: `Total IRA contributions cannot exceed $${RETIREMENT_LIMITS.ira}`
        }
      ],
      hsa: [
        commonValidations.required(),
        commonValidations.min(0),
        {
          validate: (value: number, allValues?: TaxCalculatorValues) => {
            const limit = allValues?.dependents ? RETIREMENT_LIMITS.hsa.family : RETIREMENT_LIMITS.hsa.single;
            return value <= limit;
          },
          message: `HSA contributions cannot exceed limit (${RETIREMENT_LIMITS.hsa.single} single / ${RETIREMENT_LIMITS.hsa.family} family)`
        }
      ],
      stateTaxRate: [
        commonValidations.required(),
        commonValidations.percentage(),
        commonValidations.min(0),
        commonValidations.max(15)
      ],
      capitalGains: [
        commonValidations.required(),
        commonValidations.min(0)
      ],
      dividendIncome: [
        commonValidations.required(),
        commonValidations.min(0)
      ],
      rentalIncome: [
        commonValidations.required(),
        commonValidations.min(0)
      ],
      otherIncome: [
        commonValidations.required(),
        commonValidations.min(0)
      ]
    },
    compute: (values): TaxCalculatorResult => {
      // Calculate total income
      const totalIncome = new Decimal(values.income)
        .plus(values.capitalGains)
        .plus(values.dividendIncome)
        .plus(values.rentalIncome)
        .plus(values.otherIncome);

      // Calculate deductions
      const standardDeduction = STANDARD_DEDUCTION[values.filingStatus];
      const itemizedDeduction = values.itemizedDeductions;
      const retirementDeduction = new Decimal(values.retirement401k)
        .plus(values.traditionalIRA)
        .toNumber();
      const hsaDeduction = values.hsa;

      const totalDeductions = Math.max(standardDeduction, itemizedDeduction) +
        retirementDeduction + hsaDeduction;

      // Calculate taxable income
      const taxableIncome = Math.max(0, totalIncome.minus(totalDeductions).toNumber());

      // Calculate federal tax using brackets
      const brackets = TAX_BRACKETS[values.filingStatus].map(bracket => {
        const income = Math.min(
          Math.max(0, taxableIncome - bracket.min),
          bracket.max - bracket.min
        );
        const tax = (income * bracket.rate) / 100;
        return { ...bracket, tax };
      });

      const federalTax = brackets.reduce((sum, bracket) => sum + bracket.tax, 0);

      // Calculate state tax
      const stateTax = (taxableIncome * values.stateTaxRate) / 100;

      // Calculate self-employment tax if applicable
      const selfEmploymentTax = values.selfEmployed
        ? (values.income * 15.3) / 100 // 12.4% Social Security + 2.9% Medicare
        : 0;

      // Calculate total tax and take-home pay
      const totalTax = new Decimal(federalTax)
        .plus(stateTax)
        .plus(selfEmploymentTax)
        .toNumber();

      const takeHomePay = totalIncome.minus(totalTax).toNumber();

      // Calculate effective and marginal tax rates
      const effectiveTaxRate = (totalTax / totalIncome.toNumber()) * 100;
      const marginalTaxRate = brackets.findLast(b => b.tax > 0)?.rate || 0;

      // Calculate tax savings from deductions
      const taxSavings = (totalDeductions * marginalTaxRate) / 100;

      // Generate insights
      const insights: Array<{
        type: 'success' | 'warning' | 'info';
        message: string;
      }> = [];

      // Retirement contribution insights
      const maxRetirement = RETIREMENT_LIMITS['401k'] + RETIREMENT_LIMITS.ira;
      const totalRetirement = values.retirement401k +
        values.traditionalIRA +
        values.rothIRA;

      if (totalRetirement < (values.income * 0.15)) {
        insights.push({
          type: 'info',
          message: 'Consider increasing retirement contributions to reduce taxable income.'
        });
      }

      // HSA insights
      const hsaLimit = values.dependents > 0
        ? RETIREMENT_LIMITS.hsa.family
        : RETIREMENT_LIMITS.hsa.single;

      if (values.hsa < hsaLimit) {
        insights.push({
          type: 'info',
          message: `You can contribute up to $${hsaLimit} to your HSA for additional tax savings.`
        });
      }

      // Deduction insights
      if (values.itemizedDeductions > 0 &&
          values.itemizedDeductions < standardDeduction) {
        insights.push({
          type: 'info',
          message: 'Standard deduction provides more tax savings than itemizing.'
        });
      }

      // Tax bracket insights
      const nextBracket = brackets.find(b => b.min > taxableIncome);
      if (nextBracket) {
        const toNext = nextBracket.min - taxableIncome;
        insights.push({
          type: 'info',
          message: `$${toNext.toFixed(0)} until next tax bracket (${nextBracket.rate}%).`
        });
      }

      // Self-employment insights
      if (values.selfEmployed) {
        insights.push({
          type: 'warning',
          message: 'Consider making quarterly estimated tax payments to avoid penalties.'
        });
      }

      return {
        effectiveTaxRate,
        marginalTaxRate,
        federalTax,
        stateTax,
        selfEmploymentTax,
        totalTax,
        takeHomePay,
        taxableIncome,
        deductions: {
          standard: standardDeduction,
          itemized: itemizedDeduction,
          retirement: retirementDeduction,
          hsa: hsaDeduction,
          total: totalDeductions
        },
        brackets,
        taxSavings,
        insights
      };
    },
    formatters: {
      income: formatCurrency,
      itemizedDeductions: formatCurrency,
      retirement401k: formatCurrency,
      traditionalIRA: formatCurrency,
      rothIRA: formatCurrency,
      hsa: formatCurrency,
      stateTaxRate: (value) => formatPercentage(value, 1),
      capitalGains: formatCurrency,
      dividendIncome: formatCurrency,
      rentalIncome: formatCurrency,
      otherIncome: formatCurrency
    }
  });
}
