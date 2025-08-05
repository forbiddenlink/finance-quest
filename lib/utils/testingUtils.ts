/**
 * Calculator Testing Utilities
 * Validation functions for financial calculations
 */

import Decimal from 'decimal.js';

// Configure Decimal.js for financial precision
Decimal.set({
    precision: 10,
    rounding: Decimal.ROUND_HALF_UP,
    toExpNeg: -7,
    toExpPos: 21
});

/**
 * Test scenarios for PaycheckCalculator validation
 */
export const PaycheckTestScenarios = {
    // Test case 1: Middle-class single filer
    middleClassSingle: {
        grossPay: 5000,
        filingStatus: 'single' as const,
        state: 'CA',
        healthInsurance: 200,
        retirement401k: 5, // 5%
        expectedResults: {
            minNetPay: 3000,
            maxNetPay: 4000,
            minTakeHomeRate: 0.60,
            maxTakeHomeRate: 0.80
        }
    },

    // Test case 2: High earner married in no-tax state
    highEarnerMarried: {
        grossPay: 16667, // $200k/year
        filingStatus: 'married' as const,
        state: 'TX',
        healthInsurance: 400,
        retirement401k: 15, // 15%
        expectedResults: {
            minNetPay: 10000,
            maxNetPay: 14000,
            minTakeHomeRate: 0.65,
            maxTakeHomeRate: 0.85
        }
    },

    // Test case 3: Low income single filer
    lowIncomeSingle: {
        grossPay: 2000,
        filingStatus: 'single' as const,
        state: 'FL',
        healthInsurance: 100,
        retirement401k: 3, // 3%
        expectedResults: {
            minNetPay: 1500,
            maxNetPay: 1800,
            minTakeHomeRate: 0.75,
            maxTakeHomeRate: 0.90
        }
    }
};

/**
 * Validation functions for tax calculations
 */
export const TaxCalculationValidators = {
    /**
     * Validate federal tax brackets for 2025
     */
    validateFederalTaxBrackets() {
        const singleBrackets = [
            { min: 0, max: 11600, rate: 0.10 },
            { min: 11600, max: 46750, rate: 0.12 },
            { min: 46750, max: 100525, rate: 0.22 },
            { min: 100525, max: 191950, rate: 0.24 },
            { min: 191950, max: 243725, rate: 0.32 },
            { min: 243725, max: 609350, rate: 0.35 },
            { min: 609350, max: Infinity, rate: 0.37 }
        ];

        // Validate bracket continuity (no gaps)
        for (let i = 1; i < singleBrackets.length; i++) {
            if (singleBrackets[i].min !== singleBrackets[i - 1].max) {
                throw new Error(`Gap in tax brackets between ${singleBrackets[i - 1].max} and ${singleBrackets[i].min}`);
            }
        }

        // Validate rate progression (should increase)
        for (let i = 1; i < singleBrackets.length; i++) {
            if (singleBrackets[i].rate <= singleBrackets[i - 1].rate) {
                throw new Error(`Tax rate should increase: ${singleBrackets[i - 1].rate} -> ${singleBrackets[i].rate}`);
            }
        }

        return true;
    },

    /**
     * Validate payroll tax rates
     */
    validatePayrollTaxRates() {
        const expectedRates = {
            socialSecurity: 0.062,
            medicare: 0.0145,
            socialSecurityWageBase: 160200 // 2025 wage base
        };

        return expectedRates;
    },

    /**
     * Validate state tax rates
     */
    validateStateTaxRates() {
        const noTaxStates = ['TX', 'FL', 'WA', 'NV', 'TN', 'SD', 'NH', 'AK', 'WY'];
        const highTaxStates = ['CA', 'NY', 'NJ', 'CT', 'HI'];

        return { noTaxStates, highTaxStates };
    }
};

/**
 * Quiz validation scenarios
 */
export const QuizTestScenarios = {
    /**
     * Test question accuracy and comprehensiveness
     */
    validateQuizQuestions() {
        const requiredConcepts = [
            'behavioral-finance-basics',
            'abundance-vs-scarcity',
            'compound-effect-basics',
            'opportunity-cost-calculation',
            'goal-setting-frameworks',
            'cognitive-biases',
            'money-personality-types',
            'daily-improvement-compound',
            'money-beliefs-childhood',
            'abundance-mindset-reframing',
            'fear-based-decisions',
            'time-value-money'
        ];

        const requiredCategories = [
            'psychology',
            'mindset',
            'habits',
            'goals',
            'compound'
        ];

        return { requiredConcepts, requiredCategories };
    },

    /**
     * Validate spaced repetition integration
     */
    validateSpacedRepetition() {
        const requiredFeatures = [
            'SM2 algorithm implementation',
            'Concept difficulty tracking',
            'Review scheduling',
            'Performance analytics',
            'Card creation and updates'
        ];

        return requiredFeatures;
    }
};

/**
 * Performance benchmarks
 */
export const PerformanceBenchmarks = {
    calculatorResponseTime: 300, // milliseconds
    quizLoadTime: 500, // milliseconds
    lessonInteractionTime: 200, // milliseconds
    maxBundleSize: 50, // KB per component
};

/**
 * Accessibility validation
 */
export const AccessibilityChecks = {
    requiredARIALabels: [
        'aria-label',
        'aria-describedby',
        'aria-invalid',
        'role'
    ],
    keyboardNavigation: [
        'Tab navigation',
        'Enter key activation',
        'Escape key functionality',
        'Arrow key navigation'
    ],
    screenReaderSupport: [
        'Semantic HTML elements',
        'Alternative text for images',
        'Form labels',
        'Error announcements'
    ]
};

const testingUtils = {
    PaycheckTestScenarios,
    TaxCalculationValidators,
    QuizTestScenarios,
    PerformanceBenchmarks,
    AccessibilityChecks
};

export default testingUtils;
