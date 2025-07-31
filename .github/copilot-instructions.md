# Finance Quest: AI Development Guide

## Executive Summary
**Finance Quest** is an AI-powered financial literacy platform addressing the 64% financial illiteracy crisis. Built with Next.js 15.4.4 + OpenAI GPT-4o-mini, it provides personalized learning paths through interactive calculators, real-time progress tracking, and contextual AI coaching. Unlike competitors using simulated chatbots, we deliver genuine AI-powered education with measurable learning outcomes.

**Current Status**: Production-ready with 14+ complete chapters, 13+ professional calculators, real AI integration, advanced Zustand state management, and multi-API market data integration.

## Quick Start for AI Agents

### Essential Development Commands
```bash
# Development server with Turbopack (faster builds)
npm run dev

# Production build validation
npm run build && npm run start

# Linting (required for production)
npm run lint

# PowerShell command chaining (Windows)
git add . ; git commit -m "feat: description" ; git push
```

### Critical Architecture Knowledge

#### Core State Management Pattern
This project uses **Zustand with localStorage persistence** - NOT React Context. All user progress, quiz scores, and analytics flow through:

```typescript
// Primary state store
import { useProgressStore } from '@/lib/store/progressStore';

// Always use these patterns:
const { completeLesson, recordQuizScore, recordCalculatorUsage } = useProgressStore();
const progress = useProgressStore(state => state.userProgress);
const isUnlocked = useProgressStore(state => state.isChapterUnlocked(4));
```

#### Component Architecture Patterns
- **Chapter Pages**: `app/chapter{1-14}/page.tsx` - Tab-based navigation (Lesson → Calculator → Quiz → AI Coach)
- **Educational Components**: Always accept `onComplete` callback to trigger progress updates
- **Calculator Components**: Located in `components/shared/calculators/` with Finance.js integration + `components/chapters/fundamentals/calculators/`
- **Assessment Components**: Require 80%+ scores to unlock next chapter
- **Expanded Calculator Suite**: 13+ professional calculators including Bond Calculator, Stock Analysis, Portfolio Analyzer, Retirement Planner

#### API Routes & External Integrations
- `/api/ai-chat` - OpenAI GPT-4o-mini with contextual user progress
- `/api/market-data` - Multi-API integration: Yahoo Finance (primary), Finnhub (free), Polygon.io, Alpha Vantage + FRED APIs with intelligent fallbacks
- Environment variables: `OPENAI_API_KEY`, `ALPHA_VANTAGE_API_KEY`, `FRED_API_KEY`, `POLYGON_API_KEY` (all optional with fallbacks)

### Essential Component Patterns

#### Education Flow Pattern
Every chapter follows this exact structure:
```tsx
// Chapter page with tab navigation (newer chapters use Radix UI Tabs)
const [currentSection, setCurrentSection] = useState<'lesson' | 'calculator' | 'quiz'>('lesson');

// Lesson completion triggers progress
const handleLessonComplete = () => {
  completeLesson('chapter3-lesson', timeSpent);
  setLessonCompleted(true);
};

// Quiz success unlocks next chapter  
const handleQuizComplete = (score: number) => {
  recordQuizScore('chapter3-quiz', score, totalQuestions);
  if (score >= 80) advanceChapter();
};

// Two chapter patterns exist:
// Pattern 1: Legacy chapters (1-8) use custom tab implementation
// Pattern 2: Advanced chapters (11-14) use Radix UI Tabs component
```

#### Calculator Integration Pattern
All calculators use this standard interface:
```tsx
// Calculator tracking for analytics
useEffect(() => {
  recordCalculatorUsage('compound-interest-calculator');
}, []);

// Finance.js for accurate calculations (financial formulas)
import { Finance } from 'financejs';
const finance = new Finance();
const payment = finance.PMT(rate, periods, present, future, type);

// Alternative: Manual financial calculations with proper formulas
const monthlyPayment = loanAmount * 
  (monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) /
  (Math.pow(1 + monthlyRate, numberOfPayments) - 1);

// Standard calculator layout pattern
<div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
  <div className="inputs-section">{/* Controls */}</div>
  <div className="results-section">{/* Results + Educational context */}</div>
</div>
```

#### Icon System Standards
- **Library**: Lucide React v0.534.0 only
- **Import**: `import { IconName } from 'lucide-react'`
- **Usage**: `<IconName className="w-4 h-4" />` 
- **No Emoji**: Use semantic SVG icons instead

### Visual Design System

#### Animation Patterns
- **Framer Motion**: Used for page transitions and component animations
- **Stagger Animations**: `staggerChildren: 0.1` for list items
- **Hover Effects**: `whileHover={{ scale: 1.02 }}` on interactive elements
- **Page Transitions**: `initial={{ opacity: 0, y: 20 }}` → `animate={{ opacity: 1, y: 0 }}`

#### Responsive Grid Patterns
```tsx
// Standard responsive layout
className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"

// Calculator layouts
className="grid grid-cols-1 lg:grid-cols-2 gap-8" // Input | Results

// Mobile-first breakpoints: sm:640px md:768px lg:1024px xl:1280px
```

### Development Workflows

#### Component Creation Checklist
1. **Progress Integration**: Add Zustand state updates for user actions
2. **Error Handling**: Implement try/catch for API calls with fallbacks  
3. **Accessibility**: Include ARIA labels and keyboard navigation
4. **Responsive Design**: Test on mobile, tablet, desktop
5. **TypeScript**: Define interfaces for all props and state

#### Git Commit Strategy
```bash
# After each working feature
git add . ; git commit -m "feat: add PaycheckCalculator with tax breakdown"

# Bug fixes
git add . ; git commit -m "fix: quiz scoring logic for chapter advancement"

# Styling updates  
git add . ; git commit -m "style: improve mobile calculator layout"

# Use semicolons (;) not && for PowerShell command chaining
```

#### Testing & Validation
- **Development**: Check console for errors, test all interactive elements
- **Production**: Run `npm run build` before major commits
- **AI Integration**: Test with/without API keys for fallback behavior
- **State Persistence**: Clear localStorage to test first-time user experience

### Key Files & Patterns

#### Progress Tracking Integration
Every user action must update Zustand store:
```typescript
// Lesson completion
completeLesson(lessonId: string, timeSpent: number)

// Quiz results  
recordQuizScore(quizId: string, score: number, totalQuestions: number)

// Calculator usage
recordCalculatorUsage(calculatorId: string)

// Simulation results (new feature)
recordSimulationResult(result: SimulationResult)

// Check prerequisites
isChapterUnlocked(chapterId: number): boolean
```

#### AI Assistant Context Pattern
```typescript
// AI requests include user progress context
const context = {
  userProgress: progress,
  type: 'qa_system' // or 'lesson_help'
};

// Fallback responses when API unavailable
function generateFallbackResponse(message: string): string

// Market data service with intelligent fallbacks
try {
  const data = await marketDataService.getStockQuotes();
  // Priority: Yahoo Finance → Finnhub → Polygon → Alpha Vantage → Fallback
} catch {
  return generateFallbackData();
}
```

This architecture ensures consistent user experience, accurate progress tracking, and reliable AI coaching throughout the learning journey.

## Architecture Overview

### Core Infrastructure
- **Next.js 15.4.4** with App Router and TypeScript
- **Zustand ^5.0.6** for state management with localStorage persistence
- **OpenAI GPT-4o-mini** for contextual AI coaching and Q&A system
- **Finance.js ^4.1.0** for accurate financial calculations (PMT, compound interest)
- **Recharts ^3.1.0** for interactive financial data visualization
- **Framer Motion ^12.23.12** for premium animations and transitions
- **Lucide React ^0.534.0** for consistent SVG icon system

### Project Structure
```
app/
├── api/
│   ├── ai-chat/route.ts        # OpenAI GPT-4o-mini integration
│   └── market-data/route.ts    # Multi-API market data with fallbacks
├── chapter[1-14]/page.tsx      # Educational chapters with tab navigation
├── calculators/                # Standalone calculator pages
└── assessment/                 # Learning measurement tools

components/
├── chapters/fundamentals/      # Educational content components
├── shared/
│   ├── calculators/           # Reusable calculator components (13+ tools)
│   ├── ai-assistant/          # AI teaching assistant
│   └── ui/                    # Premium visual components

lib/
├── store/progressStore.ts      # Zustand state management
├── api/marketData.ts          # Multi-source API integrations
└── context/ProgressContext.tsx # Legacy (migrated to Zustand)
```

### State Management Flow
```typescript
// User completes lesson → Update Zustand store → Persist to localStorage
completeLesson('chapter1-lesson', timeSpent) → analytics update → chapter unlock check

// Quiz completion → Progress tracking → Chapter advancement logic
recordQuizScore('chapter1-quiz', score, total) → 80%+ required → next chapter unlocked

// Calculator usage → Analytics → Learning pattern analysis  
recordCalculatorUsage('compound-interest') → engagement metrics → AI coaching context
```

## Key Development Patterns

### Educational Component Integration
All educational components must integrate with progress tracking:
```tsx
interface LessonProps {
  onComplete?: (lessonId: string, timeSpent: number) => void;
}

// In lesson component
const handleCompletion = () => {
  if (onComplete) {
    onComplete('chapter1-basics', timeSpentMinutes);
  }
};
```

### Calculator Component Standards
```tsx
// 1. Record usage for analytics
useEffect(() => {
  recordCalculatorUsage('paycheck-calculator');
}, []);

// 2. Use Finance.js for accuracy
const monthlyPayment = finance.PMT(rate/12, years*12, -loanAmount);

// 3. Provide educational context
<div className="bg-blue-50 p-4 rounded-lg">
  <h4>What This Means:</h4>
  <p>Your {result} shows...</p>
</div>
```

### API Integration Patterns
```typescript
// AI Chat with progress context
const response = await fetch('/api/ai-chat', {
  method: 'POST',
  body: JSON.stringify({
    message: userQuestion,
    context: { userProgress: progress, type: 'qa_system' }
  })
});

// Market data with fallback
try {
  const data = await marketDataService.getStockQuotes();
} catch {
  return generateFallbackData();
}
```

### Critical Business Logic

#### Chapter Unlocking System
- Chapter 1: Always unlocked
- Chapter N: Requires 80%+ on Chapter N-1 quiz
- Quiz access: Requires completing 50%+ of chapter lessons

#### Progress Scoring Algorithm
```typescript
// Financial Literacy Score (0-1000)
// 40% - Quiz performance average
// 30% - Lesson completion rate  
// 20% - Calculator usage diversity
// 10% - Learning consistency/streaks
```

#### AI Coaching Context
The AI assistant receives full user progress context:
- Completed lessons and time spent per chapter
- Quiz scores and struggling topics identified
- Calculator usage patterns and frequency
- Current chapter and recommended next actions

This enables personalized coaching that adapts to individual learning needs and provides targeted help for specific financial concepts.
