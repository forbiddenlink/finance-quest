import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useProgressStore } from '@/lib/store/progressStore';

// Type definitions for better type safety
interface CalculatorInputs {
  [key: string]: string | number | boolean;
}

interface CalculatorResults {
  [key: string]: string | number | boolean | CalculatorResults;
}

// Enhanced financial calculation utilities
export const financialUtils = {
  // Common financial calculation helpers
  calculateCompoundInterest: (principal: number, rate: number, time: number, compoundingFrequency = 12) => {
    return principal * Math.pow(1 + rate / compoundingFrequency, compoundingFrequency * time);
  },
  
  calculatePMT: (rate: number, nper: number, pv: number, fv = 0, type = 0) => {
    if (rate === 0) return -(pv + fv) / nper;
    const pvif = Math.pow(1 + rate, nper);
    return -rate * (pv * pvif + fv) / (pvif - 1) * (1 + rate * type);
  },
  
  calculateFutureValue: (rate: number, nper: number, pmt: number, pv = 0, type = 0) => {
    if (rate === 0) return -(pv + pmt * nper);
    const pvif = Math.pow(1 + rate, nper);
    return -(pv * pvif + pmt * (pvif - 1) / rate * (1 + rate * type));
  },
  
  calculatePresentValue: (rate: number, nper: number, pmt: number, fv = 0, type = 0) => {
    if (rate === 0) return -(fv + pmt * nper);
    const pvif = Math.pow(1 + rate, nper);
    return -(fv / pvif + pmt * (1 - 1 / pvif) / rate * (1 + rate * type));
  },
  
  formatCurrency: (value: number, locale = 'en-US', currency = 'USD') => {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  },
  
  formatPercentage: (value: number, decimals = 2) => {
    return `${(value * 100).toFixed(decimals)}%`;
  },
  
  parseNumericInput: (value: string): number => {
    const cleaned = value.replace(/[^0-9.-]/g, '');
    const parsed = parseFloat(cleaned);
    return isNaN(parsed) ? 0 : parsed;
  },
  
  validateNumericRange: (value: number, min?: number, max?: number): boolean => {
    if (min !== undefined && value < min) return false;
    if (max !== undefined && value > max) return false;
    return true;
  },
};

// Hook for calculator state management
export function useCalculatorState(calculatorId: string, initialInputs: CalculatorInputs) {
  const recordCalculatorUsage = useProgressStore((state) => state.recordCalculatorUsage);
  const [inputs, setInputs] = useState(initialInputs);
  const [results, setResults] = useState<CalculatorResults | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    recordCalculatorUsage(calculatorId);
  }, [recordCalculatorUsage, calculatorId]);

  const updateInput = useCallback((key: string, value: string | number | boolean) => {
    setInputs(prev => ({ ...prev, [key]: value }));
    setError(null);
  }, []);

  const updateMultipleInputs = useCallback((updates: CalculatorInputs) => {
    setInputs(prev => ({ ...prev, ...updates }));
    setError(null);
  }, []);

  const resetInputs = useCallback(() => {
    setInputs(initialInputs);
    setResults(null);
    setError(null);
  }, [initialInputs]);

  const calculate = useCallback(async (calculationFn: (inputs: CalculatorInputs) => Promise<CalculatorResults> | CalculatorResults) => {
    setIsCalculating(true);
    setError(null);
    
    try {
      const result = await calculationFn(inputs);
      setResults(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Calculation failed');
    } finally {
      setIsCalculating(false);
    }
  }, [inputs]);

  return {
    inputs,
    results,
    isCalculating,
    error,
    updateInput,
    updateMultipleInputs,
    resetInputs,
    calculate
  };
}

// Hook for form validation
export function useFormValidation<T extends Record<string, unknown>>(initialValues: T, validationRules: Record<keyof T, (value: unknown) => string | null>) {
  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<Partial<Record<keyof T, string>>>({});
  const [touched, setTouchedState] = useState<Partial<Record<keyof T, boolean>>>({});

  const validateField = useCallback((field: keyof T, value: unknown): string | null => {
    const rule = validationRules[field];
    return rule ? rule(value) : null;
  }, [validationRules]);

  const validateAll = useCallback((): boolean => {
    const newErrors: Partial<Record<keyof T, string>> = {};
    let isValid = true;

    Object.keys(validationRules).forEach((field) => {
      const fieldKey = field as keyof T;
      const error = validateField(fieldKey, values[fieldKey]);
      if (error) {
        newErrors[fieldKey] = error;
        isValid = false;
      }
    });

    setErrors(newErrors);
    return isValid;
  }, [values, validateField, validationRules]);

  const setValue = useCallback((field: keyof T, value: unknown) => {
    setValues(prev => ({ ...prev, [field]: value }));
    
    // Validate field if it's been touched
    if (touched[field]) {
      const error = validateField(field, value);
      setErrors(prev => ({ ...prev, [field]: error || undefined }));
    }
  }, [touched, validateField]);

  const setTouched = useCallback((field: keyof T) => {
    setTouchedState(prev => ({ ...prev, [field]: true }));
    
    // Validate on touch
    const error = validateField(field, values[field]);
    setErrors(prev => ({ ...prev, [field]: error || undefined }));
  }, [values, validateField]);

  const reset = useCallback(() => {
    setValues(initialValues);
    setErrors({});
    setTouchedState({});
  }, [initialValues]);

  return {
    values,
    errors,
    touched,
    setValue,
    setTouched,
    validateAll,
    reset,
    isValid: Object.keys(errors).length === 0
  };
}

// Quiz question interface
interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation?: string;
  difficulty?: 'easy' | 'medium' | 'hard';
}

// Hook for quiz state management
export function useQuizState(questions: QuizQuestion[], passingScore: number) {
  const recordQuizScore = useProgressStore((state) => state.recordQuizScore);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<number[]>(new Array(questions.length).fill(-1));
  const [showExplanation, setShowExplanation] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [timeSpent, setTimeSpent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeSpent(prev => prev + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const selectAnswer = useCallback((answerIndex: number) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = answerIndex;
    setAnswers(newAnswers);
    setShowExplanation(false);
  }, [answers, currentQuestion]);

  const nextQuestion = useCallback(() => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setShowExplanation(false);
    } else {
      setIsComplete(true);
    }
  }, [currentQuestion, questions.length]);

  const prevQuestion = useCallback(() => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
      setShowExplanation(false);
    }
  }, [currentQuestion]);

  const calculateScore = useCallback(() => {
    return answers.reduce((correct, answer, index) => {
      return answer === questions[index]?.correctAnswer ? correct + 1 : correct;
    }, 0);
  }, [answers, questions]);

  const getScorePercentage = useCallback(() => {
    return Math.round((calculateScore() / questions.length) * 100);
  }, [calculateScore, questions.length]);

  const isPassing = useCallback(() => {
    return getScorePercentage() >= passingScore;
  }, [getScorePercentage, passingScore]);

  const submitQuiz = useCallback((quizId: string) => {
    const score = calculateScore();
    recordQuizScore(quizId, score, questions.length);
    return { score, percentage: getScorePercentage(), passed: isPassing() };
  }, [calculateScore, getScorePercentage, isPassing, questions.length, recordQuizScore]);

  const reset = useCallback(() => {
    setCurrentQuestion(0);
    setAnswers(new Array(questions.length).fill(-1));
    setShowExplanation(false);
    setIsComplete(false);
    setTimeSpent(0);
  }, [questions.length]);

  return {
    currentQuestion,
    answers,
    showExplanation,
    isComplete,
    timeSpent,
    selectAnswer,
    nextQuestion,
    prevQuestion,
    calculateScore,
    getScorePercentage,
    isPassing,
    submitQuiz,
    reset,
    setShowExplanation
  };
}

// Hook for lesson progress
export function useLessonProgress(lessonId: string, totalSections: number) {
  const { completeLesson, userProgress } = useProgressStore();
  const [currentSection, setCurrentSection] = useState(0);
  const [completedSections, setCompletedSections] = useState<boolean[]>(
    new Array(totalSections).fill(false)
  );
  const [startTime] = useState(Date.now());

  const isLessonCompleted = userProgress.completedLessons.includes(lessonId);

  const markSectionComplete = useCallback((sectionIndex: number) => {
    setCompletedSections(prev => {
      const newState = [...prev];
      newState[sectionIndex] = true;
      return newState;
    });
  }, []);

  const goToSection = useCallback((sectionIndex: number) => {
    if (sectionIndex >= 0 && sectionIndex < totalSections) {
      setCurrentSection(sectionIndex);
    }
  }, [totalSections]);

  const getProgress = useCallback(() => {
    const completed = completedSections.filter(Boolean).length;
    return Math.round((completed / totalSections) * 100);
  }, [completedSections, totalSections]);

  const completeEntireLesson = useCallback(() => {
    const timeSpent = Math.round((Date.now() - startTime) / 1000 / 60); // minutes
    completeLesson(lessonId, timeSpent);
  }, [completeLesson, lessonId, startTime]);

  const canAdvance = useCallback(() => {
    return completedSections[currentSection] || currentSection === 0;
  }, [completedSections, currentSection]);

  return {
    currentSection,
    completedSections,
    isLessonCompleted,
    markSectionComplete,
    goToSection,
    getProgress,
    completeEntireLesson,
    canAdvance,
    setCurrentSection
  };
}

// Hook for data fetching with loading states
export function useAsyncData<T>(
  fetchFn: () => Promise<T>,
  dependencies: React.DependencyList = []
) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await fetchFn();
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error'));
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetchFn, ...dependencies]);

  useEffect(() => {
    fetch();
  }, [fetch]);

  const refetch = useCallback(() => {
    fetch();
  }, [fetch]);

  return { data, loading, error, refetch };
}

// Enhanced hook for input validation with debouncing
export function useInputValidation(
  initialValue: string,
  validationRules: {
    required?: boolean;
    min?: number;
    max?: number;
    type?: 'number' | 'email' | 'text';
    pattern?: RegExp;
    custom?: (value: string) => string | null;
  },
  debounceMs = 300
) {
  const [value, setValue] = useState(initialValue);
  const [error, setError] = useState<string | null>(null);
  const [isValidating, setIsValidating] = useState(false);
  const [hasBeenTouched, setHasBeenTouched] = useState(false);

  const validateValue = useCallback((val: string): string | null => {
    if (validationRules.required && (!val || val.trim() === '')) {
      return 'This field is required';
    }

    if (val && validationRules.type === 'number') {
      const numVal = parseFloat(val);
      if (isNaN(numVal)) return 'Must be a valid number';
      if (validationRules.min !== undefined && numVal < validationRules.min) {
        return `Must be at least ${validationRules.min}`;
      }
      if (validationRules.max !== undefined && numVal > validationRules.max) {
        return `Must be no more than ${validationRules.max}`;
      }
    }

    if (val && validationRules.type === 'email') {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(val)) return 'Must be a valid email address';
    }

    if (val && validationRules.pattern && !validationRules.pattern.test(val)) {
      return 'Invalid format';
    }

    if (val && validationRules.custom) {
      const customError = validationRules.custom(val);
      if (customError) return customError;
    }

    return null;
  }, [validationRules]);

  // Debounced validation
  useEffect(() => {
    if (!hasBeenTouched) return;

    setIsValidating(true);
    const timeoutId = setTimeout(() => {
      const validationError = validateValue(value);
      setError(validationError);
      setIsValidating(false);
    }, debounceMs);

    return () => clearTimeout(timeoutId);
  }, [value, validateValue, debounceMs, hasBeenTouched]);

  const handleChange = useCallback((newValue: string) => {
    setValue(newValue);
    if (!hasBeenTouched) setHasBeenTouched(true);
  }, [hasBeenTouched]);

  const handleBlur = useCallback(() => {
    if (!hasBeenTouched) setHasBeenTouched(true);
    const validationError = validateValue(value);
    setError(validationError);
  }, [validateValue, value, hasBeenTouched]);

  const reset = useCallback(() => {
    setValue(initialValue);
    setError(null);
    setHasBeenTouched(false);
    setIsValidating(false);
  }, [initialValue]);

  const isValid = useMemo(() => {
    return hasBeenTouched ? error === null : true;
  }, [error, hasBeenTouched]);

  return {
    value,
    error,
    isValid,
    isValidating,
    hasBeenTouched,
    onChange: handleChange,
    onBlur: handleBlur,
    reset,
  };
}

// Hook for managing calculator insights and recommendations
export function useCalculatorInsights<T extends CalculatorInputs>(
  inputs: T,
  calculations: CalculatorResults | null
) {
  const insights = useMemo(() => {
    if (!calculations) return [];

    const insights: Array<{
      type: 'success' | 'warning' | 'error' | 'info';
      title: string;
      message: string;
    }> = [];

    // Add insights based on common financial patterns
    // This can be overridden by specific calculator implementations
    
    return insights;
  }, [calculations]);

  return insights;
}
