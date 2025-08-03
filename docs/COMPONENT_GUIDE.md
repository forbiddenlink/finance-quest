# Finance Quest - Component Guide 🧩

## 🎯 **Development Patterns & Standards**

This guide covers the component development patterns, standards, and best practices used throughout Finance Quest. Follow these patterns for consistency and maintainability.

---

## 📚 **Educational Component Patterns**

### **Chapter Page Structure**
All chapters follow a consistent tab-based navigation pattern:

```typescript
// Standard chapter page structure
const ChapterPage = () => {
  const [currentSection, setCurrentSection] = useState<'lesson' | 'calculator' | 'quiz' | 'coach'>('lesson');
  const [lessonCompleted, setLessonCompleted] = useState(false);
  const [quizCompleted, setQuizCompleted] = useState(false);

  const handleLessonComplete = () => {
    completeLesson('chapter3-lesson', timeSpent);
    setLessonCompleted(true);
  };

  const handleQuizComplete = (score: number) => {
    recordQuizScore('chapter3-quiz', score, totalQuestions);
    if (score >= 80) {
      // Unlock next chapter
    }
  };

  return (
    <div className={theme.backgrounds.primary}>
      {/* Tab Navigation */}
      <TabNavigation currentSection={currentSection} onChange={setCurrentSection} />
      
      {/* Content Sections */}
      {currentSection === 'lesson' && <LessonComponent onComplete={handleLessonComplete} />}
      {currentSection === 'calculator' && <CalculatorComponent />}
      {currentSection === 'quiz' && <QuizComponent onComplete={handleQuizComplete} />}
      {currentSection === 'coach' && <AICoachComponent />}
    </div>
  );
};
```

### **Lesson Component Pattern**
Educational lessons follow standardized props and completion tracking:

```typescript
interface LessonProps {
  onComplete?: () => void;
  className?: string;
}

const LessonComponent = ({ onComplete, className }: LessonProps) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [timeSpent, setTimeSpent] = useState(0);

  useEffect(() => {
    // Track time spent
    const interval = setInterval(() => setTimeSpent(prev => prev + 1), 1000);
    return () => clearInterval(interval);
  }, []);

  const handleComplete = () => {
    if (onComplete) {
      onComplete();
    }
  };

  return (
    <motion.div className={cn(theme.backgrounds.glass, className)}>
      {/* Progress indicator */}
      <ProgressBar current={currentStep} total={totalSteps} />
      
      {/* Lesson content */}
      <LessonContent step={currentStep} />
      
      {/* Navigation */}
      <LessonNavigation 
        onNext={() => setCurrentStep(prev => prev + 1)}
        onComplete={handleComplete}
        canComplete={currentStep === totalSteps - 1}
      />
    </motion.div>
  );
};
```

### **Quiz Component Pattern**
Quizzes require 80% score to unlock next chapter:

```typescript
interface QuizProps {
  onComplete?: (score: number) => void;
  questions: QuizQuestion[];
}

const QuizComponent = ({ onComplete, questions }: QuizProps) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([]);
  const [showResults, setShowResults] = useState(false);

  const calculateScore = () => {
    const correct = selectedAnswers.filter((answer, index) => 
      answer === questions[index].correctAnswer
    ).length;
    return Math.round((correct / questions.length) * 100);
  };

  const handleComplete = () => {
    const score = calculateScore();
    recordQuizScore(quizId, score, questions.length);
    
    if (onComplete) {
      onComplete(score);
    }
    
    setShowResults(true);
  };

  return (
    <div className={theme.backgrounds.card}>
      {!showResults ? (
        <QuestionInterface 
          question={questions[currentQuestion]}
          onAnswer={(answerIndex) => {
            const newAnswers = [...selectedAnswers];
            newAnswers[currentQuestion] = answerIndex;
            setSelectedAnswers(newAnswers);
          }}
        />
      ) : (
        <QuizResults 
          score={calculateScore()}
          passed={calculateScore() >= 80}
          onRetry={() => setShowResults(false)}
        />
      )}
    </div>
  );
};
```

---

## 🧮 **Calculator Component Standards**

### **Calculator Integration Pattern**
All calculators follow this standardized approach:

```typescript
const CalculatorComponent = () => {
  // 1. Track usage for analytics
  const { recordCalculatorUsage } = useProgressStore();
  
  useEffect(() => {
    recordCalculatorUsage('compound-interest-calculator');
  }, []);

  // 2. Use Finance.js for accuracy
  const finance = new Finance();
  
  const calculateResult = useCallback(() => {
    // Professional financial calculations
    const monthlyPayment = finance.PMT(
      rate / 12,      // Monthly interest rate
      years * 12,     // Total payments
      -loanAmount,    // Present value (negative)
      0,              // Future value
      0               // Payment at end of period
    );
    
    return Math.abs(monthlyPayment);
  }, [rate, years, loanAmount]);

  // 3. Provide educational context
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Input Section */}
      <div className={theme.backgrounds.glass + ' p-6'}>
        <CalculatorInputs onInputChange={handleInputChange} />
      </div>
      
      {/* Results Section */}
      <div className={theme.backgrounds.glass + ' p-6'}>
        <CalculatorResults result={result} />
        
        {/* Educational Context */}
        <div className={theme.status.info.bg + ' p-4 rounded-lg mt-4'}>
          <h4 className="font-semibold mb-2">💡 What This Means:</h4>
          <p>Your monthly payment of {formatCurrency(result)} includes...</p>
        </div>
      </div>
    </div>
  );
};
```

### **Calculator Input Components**
Standardized input handling with validation:

```typescript
interface CalculatorInputProps {
  label: string;
  value: string | number;
  onChange: (value: string) => void;
  type?: 'currency' | 'percentage' | 'number';
  min?: number;
  max?: number;
  step?: number;
  helpText?: string;
}

const CalculatorInput = ({ 
  label, 
  value, 
  onChange, 
  type = 'number',
  helpText 
}: CalculatorInputProps) => {
  const formatValue = (val: string) => {
    if (type === 'currency') {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
      }).format(parseFloat(val) || 0);
    }
    return val;
  };

  return (
    <div className="space-y-2">
      <label className={`block text-sm font-medium ${theme.textColors.primary}`}>
        {label}
      </label>
      
      <div className="relative">
        {type === 'currency' && (
          <span className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${theme.textColors.muted}`}>
            $
          </span>
        )}
        
        <input
          type="number"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={`w-full ${type === 'currency' ? 'pl-8' : 'pl-4'} pr-4 py-3 ${theme.backgrounds.glass} border ${theme.borderColors.primary} rounded-md focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 ${theme.textColors.primary} transition-all`}
        />
        
        {type === 'percentage' && (
          <span className={`absolute right-3 top-1/2 transform -translate-y-1/2 ${theme.textColors.muted}`}>
            %
          </span>
        )}
      </div>
      
      {helpText && (
        <p className={`text-xs ${theme.textColors.muted}`}>
          {helpText}
        </p>
      )}
    </div>
  );
};
```

---

## 🎨 **Theme System Usage**

### **Centralized Theme Pattern**
Always use the centralized theme system for consistency:

```typescript
import { theme } from '@/lib/theme';

// Good: Use theme variables
className={`${theme.backgrounds.card} ${theme.textColors.primary} ${theme.borderColors.primary}`}

// Bad: Hardcoded classes
className="bg-slate-800 text-white border-slate-600"
```

### **Common Theme Patterns**

```typescript
// Card containers
const cardClasses = `${theme.backgrounds.card} border ${theme.borderColors.primary} rounded-xl p-6`;

// Interactive buttons
const buttonClasses = theme.buttons.primary; // Pre-configured with hover states

// Status indicators
const successClasses = `${theme.status.success.bg} ${theme.status.success.text} ${theme.status.success.border}`;

// Glass morphism effects
const glassClasses = `${theme.backgrounds.glass} backdrop-blur-xl`;

// Text hierarchy
const headingClasses = `${theme.typography.heading2} ${theme.textColors.primary}`;
const bodyClasses = `${theme.typography.body} ${theme.textColors.secondary}`;
```

---

## 🔄 **State Management Integration**

### **Progress Tracking Pattern**
Every educational interaction must update the progress store:

```typescript
const Component = () => {
  const { 
    completeLesson, 
    recordQuizScore, 
    recordCalculatorUsage,
    userProgress 
  } = useProgressStore();

  // Lesson completion
  const handleLessonComplete = (lessonId: string, timeSpent: number) => {
    completeLesson(lessonId, timeSpent);
  };

  // Quiz completion
  const handleQuizComplete = (quizId: string, score: number, total: number) => {
    recordQuizScore(quizId, score, total);
  };

  // Calculator usage
  useEffect(() => {
    recordCalculatorUsage('calculator-id');
  }, []);

  return (/* component JSX */);
};
```

### **Chapter Unlocking Logic**
Implement chapter progression properly:

```typescript
const ChapterPage = ({ chapterId }: { chapterId: number }) => {
  const { isChapterUnlocked, userProgress } = useProgressStore();
  
  // Check if chapter is available
  const isUnlocked = isChapterUnlocked(chapterId);
  
  if (!isUnlocked) {
    return <ChapterLockedMessage requiredScore={80} />;
  }

  return <ChapterContent />;
};
```

---

## 🎭 **Animation Patterns**

### **Framer Motion Integration**
Use consistent animation patterns throughout:

```typescript
import { motion, AnimatePresence } from 'framer-motion';

// Page transitions
const pageVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 }
};

// Staggered animations for lists
const containerVariants = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  initial: { opacity: 0, x: -20 },
  animate: { opacity: 1, x: 0 }
};

// Usage
<motion.div
  variants={pageVariants}
  initial="initial"
  animate="animate"
  transition={{ duration: 0.6 }}
>
  <motion.ul variants={containerVariants}>
    {items.map((item, index) => (
      <motion.li key={index} variants={itemVariants}>
        {item}
      </motion.li>
    ))}
  </motion.ul>
</motion.div>
```

### **Hover and Interactive Effects**
Consistent hover patterns for better UX:

```typescript
// Interactive cards
<motion.div
  whileHover={{ scale: 1.02, y: -4 }}
  whileTap={{ scale: 0.98 }}
  transition={{ type: "spring", stiffness: 300 }}
  className={theme.backgrounds.card}
>
  Card Content
</motion.div>

// Buttons with feedback
<motion.button
  whileHover={{ scale: 1.05 }}
  whileTap={{ scale: 0.95 }}
  className={theme.buttons.primary}
>
  Click Me
</motion.button>
```

---

## 🔧 **Component Best Practices**

### **TypeScript Interfaces**
Always define proper interfaces for component props:

```typescript
// Component props interface
interface EducationalComponentProps {
  title: string;
  content: string[];
  onComplete?: () => void;
  className?: string;
  isCompleted?: boolean;
  estimatedTime?: number;
}

// API response interfaces
interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  category: string;
}
```

### **Error Handling**
Implement proper error boundaries and fallbacks:

```typescript
const ComponentWithErrorHandling = () => {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData()
      .then(data => {
        // Handle success
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;

  return <ComponentContent />;
};
```

### **Accessibility**
Ensure components are accessible:

```typescript
// Proper ARIA labels
<button
  aria-label="Complete lesson and advance to next section"
  aria-pressed={isCompleted}
  onClick={handleComplete}
>
  Complete Lesson
</button>

// Focus management
<div
  role="tabpanel"
  aria-labelledby={`tab-${activeTab}`}
  tabIndex={0}
>
  Tab content
</div>

// Screen reader announcements
<div aria-live="polite" aria-atomic="true">
  {statusMessage}
</div>
```

---

## 🧪 **Testing Patterns**

### **Component Testing**
Standard testing approach for educational components:

```typescript
import { render, screen, fireEvent } from '@testing-library/react';
import { LessonComponent } from './LessonComponent';

describe('LessonComponent', () => {
  it('calls onComplete when lesson is finished', () => {
    const mockOnComplete = jest.fn();
    
    render(<LessonComponent onComplete={mockOnComplete} />);
    
    // Simulate lesson completion
    fireEvent.click(screen.getByText('Complete Lesson'));
    
    expect(mockOnComplete).toHaveBeenCalled();
  });

  it('tracks progress correctly', () => {
    const { rerender } = render(<LessonComponent currentStep={0} totalSteps={5} />);
    
    expect(screen.getByText('Progress: 0%')).toBeInTheDocument();
    
    rerender(<LessonComponent currentStep={2} totalSteps={5} />);
    
    expect(screen.getByText('Progress: 40%')).toBeInTheDocument();
  });
});
```

---

## 📚 **Next Steps**

### **For New Developers**
1. **Study Examples**: Review existing chapter components for patterns
2. **Practice**: Create a simple lesson component following these patterns
3. **Test**: Ensure your component integrates with the progress system

### **For Advanced Development**
1. **Performance**: Learn about [Performance Guide](PERFORMANCE.md)
2. **State Management**: Deep dive into [State Management Guide](STATE_MANAGEMENT.md)
3. **Design System**: Explore [Design System Guide](DESIGN_SYSTEM.md)

---

**🎯 Follow these patterns for consistent, maintainable, and accessible components throughout Finance Quest.**

*Need help? Check the [Quick Start Guide](QUICK_START.md) or [Architecture Guide](ARCHITECTURE.md) for more context.*
