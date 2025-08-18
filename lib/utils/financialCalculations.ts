import { Decimal } from 'decimal.js';

// Configure Decimal.js for financial calculations
Decimal.set({
  precision: 20,
  rounding: Decimal.ROUND_HALF_UP,
  toExpNeg: -7,
  toExpPos: 21
});

/**
 * Calculates monthly loan payment
 * @param principal - Loan amount
 * @param annualRate - Annual interest rate (as percentage)
 * @param years - Loan term in years
 * @returns Monthly payment amount
 */
export function calculateMonthlyPayment(
  principal: number | string | Decimal,
  annualRate: number | string | Decimal,
  years: number | string | Decimal
): number {
  const P = new Decimal(principal);
  const r = new Decimal(annualRate).div(100).div(12); // Monthly rate
  const n = new Decimal(years).times(12); // Total months

  if (r.equals(0)) {
    return P.div(n).toNumber();
  }

  return P.times(
    r.times(Decimal.pow(r.plus(1), n))
  ).div(
    Decimal.pow(r.plus(1), n).minus(1)
  ).toNumber();
}

/**
 * Generates amortization schedule for a loan
 * @param principal - Loan amount
 * @param annualRate - Annual interest rate (as percentage)
 * @param years - Loan term in years
 * @returns Array of monthly payment details
 */
export function generateAmortizationSchedule(
  principal: number | string | Decimal,
  annualRate: number | string | Decimal,
  years: number | string | Decimal
): Array<{
  month: number;
  payment: number;
  principal: number;
  interest: number;
  balance: number;
  totalInterest: number;
}> {
  const P = new Decimal(principal);
  const monthlyRate = new Decimal(annualRate).div(100).div(12);
  const totalMonths = new Decimal(years).times(12);
  const monthlyPayment = calculateMonthlyPayment(P, annualRate, years);

  const schedule = [];
  let balance = P;
  let totalInterest = new Decimal(0);

  for (let month = 1; month <= totalMonths.toNumber(); month++) {
    const interest = balance.times(monthlyRate);
    const principalPaid = new Decimal(monthlyPayment).minus(interest);
    
    totalInterest = totalInterest.plus(interest);
    balance = balance.minus(principalPaid);

    schedule.push({
      month,
      payment: monthlyPayment,
      principal: principalPaid.toNumber(),
      interest: interest.toNumber(),
      balance: balance.toNumber(),
      totalInterest: totalInterest.toNumber()
    });
  }

  return schedule;
}

/**
 * Calculates future value with compound interest
 * @param principal - Initial investment
 * @param annualRate - Annual interest rate (as percentage)
 * @param years - Investment period in years
 * @param monthlyContribution - Monthly additional contribution
 * @param compoundingFrequency - Number of times interest compounds per year
 * @returns Future value
 */
export function calculateFutureValue(
  principal: number | string | Decimal,
  annualRate: number | string | Decimal,
  years: number | string | Decimal,
  monthlyContribution: number | string | Decimal = 0,
  compoundingFrequency: number = 12
): number {
  const P = new Decimal(principal);
  const r = new Decimal(annualRate).div(100);
  const t = new Decimal(years);
  const PMT = new Decimal(monthlyContribution);
  const n = new Decimal(compoundingFrequency);

  // Calculate future value of initial principal
  const principalFV = P.times(
    Decimal.pow(
      Decimal.add(1, r.div(n)),
      n.times(t)
    )
  );

  // If no monthly contribution, return just the principal FV
  if (PMT.equals(0)) {
    return principalFV.toNumber();
  }

  // Calculate future value of monthly contributions
  const contributionFV = PMT.times(
    Decimal.pow(
      Decimal.add(1, r.div(n)),
      n.times(t)
    ).minus(1)
  ).div(r.div(n));

  return principalFV.plus(contributionFV).toNumber();
}

/**
 * Calculates present value
 * @param futureValue - Target future amount
 * @param annualRate - Annual interest rate (as percentage)
 * @param years - Time period in years
 * @param compoundingFrequency - Number of times interest compounds per year
 * @returns Present value needed
 */
export function calculatePresentValue(
  futureValue: number | string | Decimal,
  annualRate: number | string | Decimal,
  years: number | string | Decimal,
  compoundingFrequency: number = 12
): number {
  const FV = new Decimal(futureValue);
  const r = new Decimal(annualRate).div(100);
  const t = new Decimal(years);
  const n = new Decimal(compoundingFrequency);

  return FV.div(
    Decimal.pow(
      Decimal.add(1, r.div(n)),
      n.times(t)
    )
  ).toNumber();
}

/**
 * Calculates required monthly savings to reach a goal
 * @param goal - Target amount
 * @param annualRate - Annual interest rate (as percentage)
 * @param years - Time period in years
 * @param currentSavings - Current savings amount
 * @returns Required monthly savings amount
 */
export function calculateRequiredMonthlySavings(
  goal: number | string | Decimal,
  annualRate: number | string | Decimal,
  years: number | string | Decimal,
  currentSavings: number | string | Decimal = 0
): number {
  const FV = new Decimal(goal);
  const r = new Decimal(annualRate).div(100);
  const t = new Decimal(years);
  const P = new Decimal(currentSavings);
  const n = new Decimal(12); // Monthly compounding

  // Calculate how much of the goal will be met by current savings
  const currentSavingsFV = P.times(
    Decimal.pow(
      Decimal.add(1, r.div(n)),
      n.times(t)
    )
  );

  // Calculate remaining amount needed
  const remainingNeeded = FV.minus(currentSavingsFV);

  // If no additional savings needed
  if (remainingNeeded.lte(0)) {
    return 0;
  }

  // Calculate required monthly payment
  return remainingNeeded.times(
    r.div(n)
  ).div(
    Decimal.pow(
      Decimal.add(1, r.div(n)),
      n.times(t)
    ).minus(1)
  ).toNumber();
}

/**
 * Calculates internal rate of return (IRR)
 * @param cashflows - Array of cash flows (negative for investments, positive for returns)
 * @param guess - Initial guess for IRR (default 10%)
 * @returns Annual IRR as a percentage
 */
export function calculateIRR(
  cashflows: number[],
  guess: number = 10
): number {
  const maxIterations = 100;
  const tolerance = 0.000001;
  let rate = new Decimal(guess).div(100);

  for (let i = 0; i < maxIterations; i++) {
    let npv = new Decimal(cashflows[0]);
    let derivativeNpv = new Decimal(0);

    // Calculate NPV and its derivative
    for (let t = 1; t < cashflows.length; t++) {
      const discountFactor = Decimal.pow(rate.plus(1), t);
      npv = npv.plus(new Decimal(cashflows[t]).div(discountFactor));
      derivativeNpv = derivativeNpv.minus(
        new Decimal(cashflows[t]).times(t).div(discountFactor.times(rate.plus(1)))
      );
    }

    // Newton-Raphson iteration
    const newRate = rate.minus(npv.div(derivativeNpv));
    
    // Check for convergence
    if (newRate.minus(rate).abs().lt(tolerance)) {
      return newRate.times(100).toNumber(); // Convert to percentage
    }

    rate = newRate;
  }

  throw new Error('IRR calculation did not converge');
}

/**
 * Formats a number as currency
 * @param value - Number to format
 * @param options - Formatting options
 * @returns Formatted currency string
 */
export function formatCurrency(
  value: number | string | Decimal,
  options: Intl.NumberFormatOptions = {}
): string {
  const defaultOptions: Intl.NumberFormatOptions = {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
    ...options
  };

  return new Decimal(value).toNumber().toLocaleString('en-US', defaultOptions);
}

/**
 * Formats a number as a percentage
 * @param value - Number to format
 * @param decimals - Number of decimal places
 * @returns Formatted percentage string
 */
export function formatPercentage(
  value: number | string | Decimal,
  decimals: number = 1
): string {
  return `${new Decimal(value).toFixed(decimals)}%`;
}

/**
 * Common financial ratios and thresholds
 */
export const financialRatios = {
  // Mortgage/Housing
  maxDTI: 43, // Maximum debt-to-income ratio
  maxPTI: 28, // Maximum payment-to-income ratio
  minDownPayment: 3.5, // Minimum down payment percentage (FHA)
  pmiThreshold: 80, // LTV threshold for PMI requirement

  // Retirement
  safeWithdrawalRate: 4, // Safe withdrawal rate percentage
  minSavingsRate: 15, // Minimum recommended savings rate
  replacementRatio: 80, // Recommended income replacement ratio

  // Investment
  conservativeReturn: 6, // Conservative annual return estimate
  moderateReturn: 8, // Moderate annual return estimate
  aggressiveReturn: 10, // Aggressive annual return estimate
  maxExpenseRatio: 1, // Maximum recommended expense ratio

  // Emergency Fund
  minEmergencyFund: 3, // Minimum months of expenses
  idealEmergencyFund: 6, // Ideal months of expenses
} as const;
