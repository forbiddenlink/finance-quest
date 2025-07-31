# Finance Quest - Development Guide 🚀

## 🎯 **Quick Start for Developers**

### **Essential Commands**
```bash
# Install dependencies
npm install

# Development server with Turbopack (faster builds)
npm run dev

# Production build validation
npm run build && npm run start

# Linting (required for production)
npm run lint

# Git workflow (PowerShell)
git add . ; git commit -m "feat: your description" ; git push
```

### **Environment Setup**
1. **Clone & Install**:
   ```bash
   git clone <repository-url>
   cd finance-quest
   npm install
   ```

2. **Environment Variables** (`.env.local`):
   ```bash
   OPENAI_API_KEY=sk-your-openai-key-here
   FRED_API_KEY=your-fred-key-here
   ALPHA_VANTAGE_API_KEY=your-alpha-vantage-key
   ```

3. **Start Development**:
   ```bash
   npm run dev
   # Open http://localhost:3000
   ```

---

## 🏗️ **Architecture Overview**

### **Core Technology Stack**
- **Next.js 15.4.4** - App Router with TypeScript
- **Zustand ^5.0.6** - State management with localStorage persistence
- **OpenAI GPT-4o-mini** - Real AI integration for coaching
- **Finance.js ^4.1.0** - Professional financial calculations
- **Framer Motion ^12.23.12** - Premium animations
- **Recharts ^3.1.0** - Interactive data visualization
- **Lucide React ^0.534.0** - Consistent SVG icon system

### **Project Structure**
```
app/
├── page.tsx                    # Main homepage (1170+ lines)
├── layout.tsx                  # Root layout with providers
├── api/
│   ├── ai-chat/route.ts       # OpenAI GPT-4o-mini integration
│   └── market-data/route.ts   # Multi-API market data service
├── chapter[1-6]/page.tsx      # Educational chapters
├── calculators/               # Standalone calculator pages
└── assessment/page.tsx        # Learning measurement tools

components/
├── shared/
│   ├── calculators/          # Reusable calculator components
│   ├── ai-assistant/         # AI teaching assistant
│   └── ui/                   # Premium visual components
├── chapters/fundamentals/    # Educational content
└── demo/                     # Contest demo components

lib/
├── store/progressStore.ts    # Zustand state management (300+ lines)
├── api/marketData.ts         # External API integrations
└── algorithms/spacedRepetition.ts  # Learning optimization
```

---

## 🔄 **State Management Pattern**

### **Zustand with localStorage Persistence**
Finance Quest uses **Zustand (NOT React Context)** for all state management:

```typescript
// Primary state store
import { useProgressStore } from '@/lib/store/progressStore';

// Always use these patterns:
const { completeLesson, recordQuizScore, recordCalculatorUsage } = useProgressStore();
const progress = useProgressStore(state => state.userProgress);
const isUnlocked = useProgressStore(state => state.isChapterUnlocked(4));
```

### **Progress Tracking Flow**
```typescript
// Lesson completion → Analytics → Chapter unlock check
completeLesson('chapter1-lesson', timeSpent) 
  → progress update 
  → localStorage persistence 
  → unlock logic evaluation

// Quiz completion → Score recording → Advancement
recordQuizScore('chapter1-quiz', score, total)
  → 80%+ required for advancement
  → next chapter unlock
  → AI coaching context update

// Calculator usage → Engagement tracking
recordCalculatorUsage('compound-interest')
  → usage analytics
  → learning pattern analysis
```

---

## 🧩 **Component Development Patterns**

### **Educational Component Structure**
Every educational component must integrate with progress tracking:

```tsx
interface LessonProps {
  onComplete?: (lessonId: string, timeSpent: number) => void;
}

const ChapterLesson: React.FC<LessonProps> = ({ onComplete }) => {
  const [startTime] = useState(Date.now());
  
  const handleCompletion = () => {
    const timeSpent = Math.round((Date.now() - startTime) / 60000); // minutes
    if (onComplete) {
      onComplete('chapter1-basics', timeSpent);
    }
  };
  
  return (
    <div className="lesson-content">
      {/* Lesson content */}
      <button onClick={handleCompletion}>Mark Complete</button>
    </div>
  );
};
```

### **Chapter Page Architecture**
All chapters follow this exact structure:

```tsx
const ChapterPage = () => {
  const [currentSection, setCurrentSection] = useState<'lesson' | 'calculator' | 'quiz'>('lesson');
  const [lessonCompleted, setLessonCompleted] = useState(false);
  const { completeLesson, recordQuizScore } = useProgressStore();
  
  const handleLessonComplete = (lessonId: string, timeSpent: number) => {
    completeLesson(lessonId, timeSpent);
    setLessonCompleted(true);
  };
  
  const handleQuizComplete = (score: number, total: number) => {
    recordQuizScore('chapter1-quiz', score, total);
    if (score >= 80) {
      // Advance to next chapter
    }
  };
  
  return (
    <div className="chapter-container">
      <Tabs value={currentSection} onValueChange={setCurrentSection}>
        <TabsList>
          <TabsTrigger value="lesson">Lesson</TabsTrigger>
          <TabsTrigger value="calculator">Calculator</TabsTrigger>
          <TabsTrigger value="quiz" disabled={!lessonCompleted}>Quiz</TabsTrigger>
        </TabsList>
        
        <TabsContent value="lesson">
          <ChapterLesson onComplete={handleLessonComplete} />
        </TabsContent>
        
        <TabsContent value="calculator">
          <ChapterCalculator />
        </TabsContent>
        
        <TabsContent value="quiz">
          <ChapterQuiz onComplete={handleQuizComplete} />
        </TabsContent>
      </Tabs>
    </div>
  );
};
```

### **Calculator Component Standards**
All calculators follow this pattern:

```tsx
const CalculatorComponent = () => {
  const { recordCalculatorUsage } = useProgressStore();
  
  // 1. Record usage for analytics
  useEffect(() => {
    recordCalculatorUsage('compound-interest-calculator');
  }, []);
  
  // 2. Use Finance.js for accuracy
  const finance = new Finance();
  const calculateResult = () => {
    const monthlyPayment = finance.PMT(rate/12, years*12, -loanAmount);
    return monthlyPayment;
  };
  
  // 3. Provide educational context
  return (
    <div className="calculator-container">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="inputs-section">
          {/* Calculator inputs */}
        </div>
        
        <div className="results-section">
          {/* Results display */}
          <div className="bg-blue-50 p-4 rounded-lg">
            <h4>What This Means:</h4>
            <p>Your {result} shows...</p>
          </div>
        </div>
      </div>
    </div>
  );
};
```

---

## 🎨 **Design System Standards**

### **Animation Patterns**
```tsx
// Page transitions
const pageTransition = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 }
};

// Stagger animations for lists
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

// Hover effects
<motion.div 
  whileHover={{ scale: 1.02 }}
  className="interactive-card"
>
```

### **Responsive Grid Patterns**
```tsx
// Standard responsive layout
className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"

// Calculator layouts
className="grid grid-cols-1 lg:grid-cols-2 gap-8" // Input | Results

// Chapter navigation
className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
```

### **Icon System**
```tsx
// Always use Lucide React v0.534.0
import { Calculator, TrendingUp, DollarSign } from 'lucide-react';

// Standard sizing
<Calculator className="w-4 h-4" />  // Small
<Calculator className="w-6 h-6" />  // Medium  
<Calculator className="w-8 h-8" />  // Large

// No emoji - use semantic SVG icons
```

### **Color System**
```css
/* Primary navy & gold theme */
--navy-900: #0a1628;
--navy-800: #1e3a8a;
--gold-500: #f59e0b;
--gold-600: #d97706;

/* Usage patterns */
.primary-button {
  @apply bg-navy-800 hover:bg-navy-900 text-white;
}

.accent-element {
  @apply text-gold-600 hover:text-gold-500;
}
```

---

## 📡 **API Integration Patterns**

### **AI Chat Integration**
```typescript
// AI requests include user progress context
const response = await fetch('/api/ai-chat', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    message: userQuestion,
    context: { 
      userProgress: progress, 
      type: 'qa_system' // or 'lesson_help'
    }
  })
});

// Fallback responses when API unavailable
function generateFallbackResponse(message: string): string {
  // Educational fallback logic
}
```

### **Market Data Integration**
```typescript
// Multi-source API with fallbacks
try {
  const data = await fetch('/api/market-data?type=stocks');
  const result = await data.json();
  
  if (result.success) {
    return result.data; // Live data
  }
} catch (error) {
  return generateFallbackData(); // Educational data
}
```

---

## 🧪 **Testing & Development Workflow**

### **Component Creation Checklist**
1. **Progress Integration**: Add Zustand state updates for user actions
2. **Error Handling**: Implement try/catch for API calls with fallbacks
3. **Accessibility**: Include ARIA labels and keyboard navigation
4. **Responsive Design**: Test on mobile, tablet, desktop
5. **TypeScript**: Define interfaces for all props and state

### **Git Workflow (PowerShell)**
```bash
# After each working feature
git add . ; git commit -m "feat: add PaycheckCalculator with tax breakdown"

# Bug fixes
git add . ; git commit -m "fix: quiz scoring logic for chapter advancement"

# Styling updates
git add . ; git commit -m "style: improve mobile calculator layout"

# Use semicolons (;) not && for PowerShell command chaining
```

### **Testing Strategy**
- **Development**: Check console for errors, test all interactive elements
- **Production**: Run `npm run build` before major commits
- **AI Integration**: Test with/without API keys for fallback behavior
- **State Persistence**: Clear localStorage to test first-time user experience

---

## 📚 **Learning System Architecture**

### **Chapter Unlocking Logic**
```typescript
// Progressive unlock system
- Chapter 1: Always unlocked
- Chapter N: Requires 80%+ on Chapter N-1 quiz
- Quiz access: Requires completing 50%+ of chapter lessons

// Implementation
const isChapterUnlocked = (chapterNumber: number): boolean => {
  if (chapterNumber === 1) return true;
  
  const previousChapterQuiz = `chapter${chapterNumber - 1}-quiz`;
  const previousScore = quizScores[previousChapterQuiz];
  
  return previousScore && previousScore >= 80;
};
```

### **Progress Scoring Algorithm**
```typescript
// Financial Literacy Score (0-1000)
const calculateLiteracyScore = () => {
  const quizAverage = calculateQuizAverage() * 0.4;        // 40%
  const completionRate = calculateCompletionRate() * 0.3;  // 30%
  const calculatorUsage = calculateUsageDiversity() * 0.2; // 20%
  const consistency = calculateStreak() * 0.1;             // 10%
  
  return Math.round((quizAverage + completionRate + calculatorUsage + consistency) * 1000);
};
```

---

## 🚀 **Performance Optimization**

### **Build Optimization**
```typescript
// next.config.ts optimizations
const nextConfig = {
  experimental: {
    turbo: {
      rules: {
        '*.svg': {
          loaders: ['@svgr/webpack'],
          as: '*.js',
        },
      },
    },
  },
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
};
```

### **Loading Strategies**
```tsx
// Lazy loading for calculators
const CompoundInterestCalculator = dynamic(
  () => import('@/components/shared/calculators/CompoundInterestCalculator'),
  { loading: () => <CalculatorSkeleton /> }
);

// Image optimization
import Image from 'next/image';
<Image 
  src="/images/feature.jpg" 
  width={600} 
  height={400} 
  alt="Feature description"
  priority={isAboveFold}
/>
```

---

## 🔧 **Debugging & Troubleshooting**

### **Common Issues**

#### **State Not Persisting**
```typescript
// Check localStorage in browser DevTools
localStorage.getItem('finance-quest-progress');

// Reset state for testing
localStorage.removeItem('finance-quest-progress');
```

#### **API Failures**
```typescript
// Check network tab for API calls
// Verify environment variables
console.log('API Keys configured:', {
  openai: !!process.env.OPENAI_API_KEY,
  fred: !!process.env.FRED_API_KEY
});
```

#### **Build Errors**
```bash
# Clear Next.js cache
rm -rf .next

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install

# Check TypeScript errors
npx tsc --noEmit
```

### **Development Tools**
- **React Developer Tools** - Component state inspection
- **Zustand DevTools** - State management debugging
- **Network Tab** - API call monitoring
- **Console** - Error tracking and logging

---

This development guide ensures consistent, high-quality code that follows Finance Quest's established patterns and maintains the platform's professional standards.
