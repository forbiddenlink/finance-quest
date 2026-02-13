import { Decimal } from 'decimal.js';
import {
  Account,
  TaxBracket,
  ConversionPlan,
  ConversionAnalysis,
  ValidationError,
  FilingStatus,
  TaxYear,
  RiskLevel,
  ChartData,
  ChartOptions
} from './types';
import {
  TAX_YEAR_CONFIG,
  INVESTMENT_CONFIG,
  RMD_CONFIG,
  ANALYSIS_CONSTANTS
} from './constants';

export function validateInputs(
  filingStatus: FilingStatus,
  taxYear: TaxYear,
  currentAge: number,
  retirementAge: number,
  lifeExpectancy: number,
  accounts: Account[],
  currentIncome: number,
  projectedRetirementIncome: number
): ValidationError[] {
  const errors: ValidationError[] = [];

  // Validate ages
  if (currentAge < ANALYSIS_CONSTANTS.minAge || currentAge > ANALYSIS_CONSTANTS.maxAge) {
    errors.push({
      field: 'currentAge',
      message: `Age must be between ${ANALYSIS_CONSTANTS.minAge} and ${ANALYSIS_CONSTANTS.maxAge}`
    });
  }

  if (retirementAge <= currentAge || retirementAge > ANALYSIS_CONSTANTS.maxAge) {
    errors.push({
      field: 'retirementAge',
      message: `Retirement age must be greater than current age and less than ${ANALYSIS_CONSTANTS.maxAge}`
    });
  }

  if (lifeExpectancy <= retirementAge || lifeExpectancy > ANALYSIS_CONSTANTS.maxAge) {
    errors.push({
      field: 'lifeExpectancy',
      message: `Life expectancy must be greater than retirement age and less than ${ANALYSIS_CONSTANTS.maxAge}`
    });
  }

  // Validate income
  if (currentIncome < ANALYSIS_CONSTANTS.minIncome || 
      currentIncome > ANALYSIS_CONSTANTS.maxIncome) {
    errors.push({
      field: 'currentIncome',
      message: `Current income must be between ${formatCurrency(ANALYSIS_CONSTANTS.minIncome)} and ${formatCurrency(ANALYSIS_CONSTANTS.maxIncome)}`
    });
  }

  if (projectedRetirementIncome < ANALYSIS_CONSTANTS.minIncome || 
      projectedRetirementIncome > ANALYSIS_CONSTANTS.maxIncome) {
    errors.push({
      field: 'projectedRetirementIncome',
      message: `Projected retirement income must be between ${formatCurrency(ANALYSIS_CONSTANTS.minIncome)} and ${formatCurrency(ANALYSIS_CONSTANTS.maxIncome)}`
    });
  }

  // Validate accounts
  accounts.forEach((account, index) => {
    if (account.balance < ANALYSIS_CONSTANTS.minBalance || 
        account.balance > ANALYSIS_CONSTANTS.maxBalance) {
      errors.push({
        field: `account-${index}-balance`,
        message: `Account balance must be between ${formatCurrency(ANALYSIS_CONSTANTS.minBalance)} and ${formatCurrency(ANALYSIS_CONSTANTS.maxBalance)}`
      });
    }

    if (account.basis < 0 || account.basis > account.balance) {
      errors.push({
        field: `account-${index}-basis`,
        message: 'Cost basis cannot be negative or exceed account balance'
      });
    }

    const totalAllocation = account.investments.reduce(
      (sum, investment) => sum.plus(investment.allocation),
      new Decimal(0)
    ).toNumber();

    if (Math.abs(totalAllocation - 100) > 0.01) {
      errors.push({
        field: `account-${index}-investments`,
        message: 'Investment allocations must total 100%'
      });
    }

    account.investments.forEach((investment, invIndex) => {
      if (investment.allocation < ANALYSIS_CONSTANTS.minAllocation || 
          investment.allocation > ANALYSIS_CONSTANTS.maxAllocation) {
        errors.push({
          field: `account-${index}-investment-${invIndex}-allocation`,
          message: `Allocation must be between ${ANALYSIS_CONSTANTS.minAllocation}% and ${ANALYSIS_CONSTANTS.maxAllocation}%`
        });
      }

      if (investment.expectedReturn < ANALYSIS_CONSTANTS.minReturn || 
          investment.expectedReturn > ANALYSIS_CONSTANTS.maxReturn) {
        errors.push({
          field: `account-${index}-investment-${invIndex}-return`,
          message: `Expected return must be between ${ANALYSIS_CONSTANTS.minReturn}% and ${ANALYSIS_CONSTANTS.maxReturn}%`
        });
      }
    });

    account.contributions.forEach((contribution, contIndex) => {
      if (contribution.amount < ANALYSIS_CONSTANTS.minContribution || 
          contribution.amount > ANALYSIS_CONSTANTS.maxContribution) {
        errors.push({
          field: `account-${index}-contribution-${contIndex}-amount`,
          message: `Contribution amount must be between ${formatCurrency(ANALYSIS_CONSTANTS.minContribution)} and ${formatCurrency(ANALYSIS_CONSTANTS.maxContribution)}`
        });
      }
    });
  });

  return errors;
}

export function analyzeConversion(
  filingStatus: FilingStatus,
  taxYear: TaxYear,
  currentAge: number,
  retirementAge: number,
  lifeExpectancy: number,
  accounts: Account[],
  currentIncome: number,
  projectedRetirementIncome: number
): [ConversionAnalysis, ConversionPlan[]] {
  const yearConfig = TAX_YEAR_CONFIG[taxYear as keyof typeof TAX_YEAR_CONFIG];
  const config = yearConfig[filingStatus as keyof typeof yearConfig];
  const conversionPlan: ConversionPlan[] = [];
  let remainingBalance = accounts.reduce(
    (sum, account) => sum.plus(account.type !== 'roth_ira' ? account.balance : 0),
    new Decimal(0)
  );
  let rothBalance = accounts.reduce(
    (sum, account) => sum.plus(account.type === 'roth_ira' ? account.balance : 0),
    new Decimal(0)
  );
  let totalTaxDue = new Decimal(0);

  // Generate conversion plan
  for (let year = 0; remainingBalance.greaterThan(0) && year < 10; year++) {
    const yearIncome = year === 0 ? currentIncome : projectedRetirementIncome;
    const conversionAmount = calculateOptimalConversion(
      yearIncome,
      remainingBalance.toNumber(),
      config.brackets
    );

    const taxDue = calculateTaxDue(conversionAmount, yearIncome, config.brackets);
    totalTaxDue = totalTaxDue.plus(taxDue);

    remainingBalance = remainingBalance.minus(conversionAmount);
    rothBalance = rothBalance.plus(conversionAmount);

    const projectedGrowth = calculateProjectedGrowth(
      rothBalance.toNumber(),
      accounts
    );

    conversionPlan.push({
      year: new Date().getFullYear() + year,
      amount: conversionAmount,
      taxBracket: findMarginalRate(yearIncome + conversionAmount, config.brackets),
      taxDue,
      remainingBalance: remainingBalance.toNumber(),
      rothBalance: rothBalance.toNumber(),
      projectedGrowth
    });
  }

  // Calculate RMDs
  const rmdStartAge = Math.max(RMD_CONFIG.startAge, retirementAge);
  const firstYearRMD = calculateFirstYearRMD(
    remainingBalance.toNumber(),
    rmdStartAge
  );

  const lifetimeRMDs = calculateLifetimeRMDs(
    remainingBalance.toNumber(),
    rmdStartAge,
    lifeExpectancy
  );

  // Calculate wealth transfer impact
  const traditionalValue = calculateFutureValue(
    remainingBalance.toNumber(),
    accounts,
    lifeExpectancy - currentAge
  );

  const rothValue = calculateFutureValue(
    rothBalance.toNumber(),
    accounts,
    lifeExpectancy - currentAge
  );

  // Analyze risks
  const marketRisk = assessMarketRisk(accounts);
  const taxRisk = assessTaxRisk(remainingBalance.toNumber(), projectedRetirementIncome);
  const rmdRisk = assessRMDRisk(firstYearRMD);

  const analysis: ConversionAnalysis = {
    totalTaxDue: totalTaxDue.toNumber(),
    effectiveTaxRate: totalTaxDue.div(remainingBalance.plus(rothBalance)).times(100).toNumber(),
    breakEvenYears: calculateBreakEvenYears(totalTaxDue.toNumber(), accounts),
    lifetimeTaxSavings: calculateLifetimeTaxSavings(
      traditionalValue,
      rothValue,
      projectedRetirementIncome,
      config.brackets
    ),
    rmds: {
      startAge: rmdStartAge,
      firstYearAmount: firstYearRMD,
      lifetimeTotal: lifetimeRMDs
    },
    wealthTransfer: {
      traditionalValue,
      rothValue,
      taxSavings: rothValue - traditionalValue
    },
    riskAnalysis: {
      marketRisk,
      taxRisk,
      rmdRisk,
      overallRisk: calculateOverallRisk(marketRisk, taxRisk, rmdRisk)
    }
  };

  return [analysis, conversionPlan];
}

function calculateOptimalConversion(
  baseIncome: number,
  availableAmount: number,
  brackets: TaxBracket[]
): number {
  let optimalAmount = 0;
  let minTaxRate = Infinity;

  for (const bracket of brackets) {
    if (baseIncome >= (bracket.upperBound || Infinity)) continue;

    const conversionRoom = (bracket.upperBound || Infinity) - baseIncome;
    const possibleAmount = Math.min(availableAmount, conversionRoom);
    const effectiveRate = calculateEffectiveTaxRate(
      possibleAmount,
      baseIncome,
      brackets
    );

    if (effectiveRate < minTaxRate) {
      minTaxRate = effectiveRate;
      optimalAmount = possibleAmount;
    }
  }

  return optimalAmount;
}

function calculateTaxDue(
  amount: number,
  baseIncome: number,
  brackets: TaxBracket[]
): number {
  let tax = new Decimal(0);
  let remainingAmount = new Decimal(amount);
  let currentIncome = new Decimal(baseIncome);

  for (const bracket of brackets) {
    if (remainingAmount.lessThanOrEqualTo(0)) break;

    const bracketStart = new Decimal(bracket.lowerBound);
    const bracketEnd = new Decimal(bracket.upperBound || Infinity);
    const rate = new Decimal(bracket.rate).div(100);

    if (currentIncome.greaterThanOrEqualTo(bracketEnd)) continue;

    const taxableInBracket = Decimal.min(
      remainingAmount,
      bracketEnd.minus(Decimal.max(bracketStart, currentIncome))
    );

    tax = tax.plus(taxableInBracket.times(rate));
    remainingAmount = remainingAmount.minus(taxableInBracket);
    currentIncome = currentIncome.plus(taxableInBracket);
  }

  return tax.toNumber();
}

function calculateEffectiveTaxRate(
  amount: number,
  baseIncome: number,
  brackets: TaxBracket[]
): number {
  const tax = calculateTaxDue(amount, baseIncome, brackets);
  return new Decimal(tax).div(amount).times(100).toNumber();
}

function findMarginalRate(income: number, brackets: TaxBracket[]): number {
  for (let i = brackets.length - 1; i >= 0; i--) {
    if (income >= brackets[i].lowerBound) {
      return brackets[i].rate;
    }
  }
  return brackets[0].rate;
}

function calculateProjectedGrowth(balance: number, accounts: Account[]): number {
  const weightedReturn = accounts.reduce((sum, account) => {
    const accountReturn = account.investments.reduce(
      (accSum, inv) => accSum.plus(
        new Decimal(inv.allocation).times(inv.expectedReturn)
      ),
      new Decimal(0)
    ).div(100);
    return sum.plus(accountReturn);
  }, new Decimal(0)).div(accounts.length);

  return new Decimal(balance).times(weightedReturn.div(100)).toNumber();
}

function calculateFirstYearRMD(balance: number, age: number): number {
  const factor = RMD_CONFIG.factors[age] || RMD_CONFIG.factors[RMD_CONFIG.startAge];
  return new Decimal(balance).div(factor).toNumber();
}

function calculateLifetimeRMDs(
  balance: number,
  startAge: number,
  endAge: number
): number {
  let total = new Decimal(0);
  let remainingBalance = new Decimal(balance);

  for (let age = startAge; age <= endAge; age++) {
    const factor = RMD_CONFIG.factors[age] || RMD_CONFIG.factors[RMD_CONFIG.startAge];
    const rmd = remainingBalance.div(factor);
    total = total.plus(rmd);
    remainingBalance = remainingBalance.minus(rmd);
  }

  return total.toNumber();
}

function calculateFutureValue(
  balance: number,
  accounts: Account[],
  years: number
): number {
  const weightedReturn = accounts.reduce((sum, account) => {
    const accountReturn = account.investments.reduce(
      (accSum, inv) => accSum.plus(
        new Decimal(inv.allocation).times(inv.expectedReturn)
      ),
      new Decimal(0)
    ).div(100);
    return sum.plus(accountReturn);
  }, new Decimal(0)).div(accounts.length);

  return new Decimal(balance)
    .times(new Decimal(1).plus(weightedReturn.div(100)).pow(years))
    .toNumber();
}

function calculateBreakEvenYears(
  taxPaid: number,
  accounts: Account[]
): number {
  const weightedReturn = accounts.reduce((sum, account) => {
    const accountReturn = account.investments.reduce(
      (accSum, inv) => accSum.plus(
        new Decimal(inv.allocation).times(inv.expectedReturn)
      ),
      new Decimal(0)
    ).div(100);
    return sum.plus(accountReturn);
  }, new Decimal(0)).div(accounts.length);

  let years = 0;
  let growth = new Decimal(taxPaid);

  while (growth.lessThan(taxPaid * 2) && years < 50) {
    growth = growth.times(new Decimal(1).plus(weightedReturn.div(100)));
    years++;
  }

  return years;
}

function calculateLifetimeTaxSavings(
  traditionalValue: number,
  rothValue: number,
  retirementIncome: number,
  brackets: TaxBracket[]
): number {
  const traditionalTax = calculateTaxDue(traditionalValue, retirementIncome, brackets);
  return traditionalTax; // Roth withdrawals are tax-free
}

function assessMarketRisk(accounts: Account[]): RiskLevel {
  const weightedRisk = accounts.reduce((sum, account) => {
    const accountRisk = account.investments.reduce(
      (accSum, inv) => accSum.plus(
        new Decimal(inv.allocation).times(INVESTMENT_CONFIG[inv.type].volatility)
      ),
      new Decimal(0)
    ).div(100);
    return sum.plus(accountRisk);
  }, new Decimal(0)).div(accounts.length);

  if (weightedRisk.lessThan(ANALYSIS_CONSTANTS.riskThresholds.market.low)) {
    return 'low';
  }
  if (weightedRisk.greaterThan(ANALYSIS_CONSTANTS.riskThresholds.market.high)) {
    return 'high';
  }
  return 'medium';
}

function assessTaxRisk(balance: number, income: number): RiskLevel {
  const ratio = new Decimal(balance).div(income).times(100);

  if (ratio.lessThan(ANALYSIS_CONSTANTS.riskThresholds.tax.low)) {
    return 'low';
  }
  if (ratio.greaterThan(ANALYSIS_CONSTANTS.riskThresholds.tax.high)) {
    return 'high';
  }
  return 'medium';
}

function assessRMDRisk(firstYearRMD: number): RiskLevel {
  if (firstYearRMD < ANALYSIS_CONSTANTS.riskThresholds.rmd.low) {
    return 'low';
  }
  if (firstYearRMD > ANALYSIS_CONSTANTS.riskThresholds.rmd.high) {
    return 'high';
  }
  return 'medium';
}

function calculateOverallRisk(
  marketRisk: RiskLevel,
  taxRisk: RiskLevel,
  rmdRisk: RiskLevel
): RiskLevel {
  const riskScores = {
    low: 1,
    medium: 2,
    high: 3
  };

  const averageScore = new Decimal(riskScores[marketRisk])
    .plus(riskScores[taxRisk])
    .plus(riskScores[rmdRisk])
    .div(3)
    .toNumber();

  if (averageScore <= 1.5) return 'low';
  if (averageScore >= 2.5) return 'high';
  return 'medium';
}

export function generateChartData(conversionPlan: ConversionPlan[]): ChartData {
  return {
    labels: conversionPlan.map(plan => plan.year.toString()),
    datasets: [
      {
        label: 'Conversion Amount',
        data: conversionPlan.map(plan => plan.amount),
        backgroundColor: 'rgba(54, 162, 235, 0.2)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1
      },
      {
        label: 'Tax Due',
        data: conversionPlan.map(plan => plan.taxDue),
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        borderColor: 'rgba(255, 99, 132, 1)',
        borderWidth: 1
      },
      {
        label: 'Remaining Balance',
        data: conversionPlan.map(plan => plan.remainingBalance),
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1
      }
    ]
  };
}

export function getChartOptions(): ChartOptions {
  return {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: (value: number) => formatCurrency(value)
        }
      }
    },
    plugins: {
      tooltip: {
        callbacks: {
          label: (context) => {
            return `${context.dataset.label}: ${formatCurrency(context.parsed.y)}`;
          }
        }
      }
    }
  };
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

export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(date);
}
