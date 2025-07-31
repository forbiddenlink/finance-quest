# Contributing to Finance Quest 🤝

## 🎯 **Welcome Contributors!**

Thank you for your interest in contributing to Finance Quest! We're building the future of financial literacy education through AI-powered learning, and we welcome contributions from developers, educators, and financial experts.

---

## 🚀 **Quick Start for Contributors**

### **1. Environment Setup**
```bash
# Fork and clone the repository
git clone https://github.com/yourusername/finance-quest.git
cd finance-quest

# Install dependencies
npm install

# Create environment file
cp .env.example .env.local
# Add your API keys (see API_INTEGRATION.md)

# Start development server
npm run dev
```

### **2. Development Workflow**
```bash
# Create feature branch
git checkout -b feat/your-feature-name

# Make changes following our patterns
# Test thoroughly
npm run build && npm run lint

# Commit using conventional commits
git add . ; git commit -m "feat: add advanced portfolio calculator"

# Push and create pull request
git push origin feat/your-feature-name
```

---

## 📋 **Contribution Guidelines**

### **🎯 Areas We Need Help With**

#### **📚 Educational Content**
- **Chapter Development**: Lessons 7-30 need implementation
- **Quiz Questions**: Create engaging financial assessments
- **Real-World Examples**: Practical scenarios and case studies
- **Content Validation**: Review financial accuracy

#### **🧮 Calculator Development**
- **Advanced Calculators**: Options trading, bond analysis, REIT calculators
- **Visualization Enhancements**: Interactive charts and graphs
- **Mobile Optimization**: Touch-friendly interfaces
- **Educational Context**: Explanatory content for results

#### **🤖 AI & Machine Learning**
- **AI Prompt Engineering**: Improve coaching responses
- **Learning Analytics**: Enhanced progress tracking algorithms
- **Personalization**: Adaptive learning path recommendations
- **Natural Language Processing**: Better question understanding

#### **🎨 Design & UX**
- **Accessibility Improvements**: WCAG 2.1 AA compliance
- **Animation Enhancements**: Smooth, meaningful transitions
- **Mobile Experience**: Touch-optimized interactions
- **Visual Design**: Illustrations and educational graphics

#### **🔧 Technical Infrastructure**
- **Performance Optimization**: Bundle size, loading times
- **Testing**: Unit tests, integration tests, E2E tests
- **API Integrations**: Additional financial data sources
- **Documentation**: Code comments, technical guides

---

## 🏗️ **Development Standards**

### **📁 Project Structure Understanding**
```
app/
├── page.tsx                    # Main homepage (1170+ lines)
├── chapter[1-6]/page.tsx      # Educational chapters
├── api/
│   ├── ai-chat/route.ts       # OpenAI integration
│   └── market-data/route.ts   # Multi-API market data
└── calculators/               # Standalone calculator pages

components/
├── shared/
│   ├── calculators/          # Reusable calculator components
│   ├── ai-assistant/         # AI coaching components
│   └── ui/                   # Shared UI components
└── chapters/                 # Chapter-specific components

lib/
├── store/progressStore.ts    # Zustand state management
├── api/marketData.ts         # External API integrations
└── algorithms/               # Learning optimization algorithms
```

### **🔄 State Management Pattern (CRITICAL)**
```typescript
// ALWAYS use Zustand, NOT React Context
import { useProgressStore } from '@/lib/store/progressStore';

// Standard patterns for all components:
const { completeLesson, recordQuizScore, recordCalculatorUsage } = useProgressStore();
const progress = useProgressStore(state => state.userProgress);
const isUnlocked = useProgressStore(state => state.isChapterUnlocked(4));
```

### **🧩 Component Development Standards**

#### **Educational Components**
```typescript
interface LessonProps {
  onComplete?: (lessonId: string, timeSpent: number) => void;
}

const YourLesson: React.FC<LessonProps> = ({ onComplete }) => {
  const [startTime] = useState(Date.now());
  
  const handleCompletion = () => {
    const timeSpent = Math.round((Date.now() - startTime) / 60000);
    if (onComplete) {
      onComplete('chapter7-advanced-investing', timeSpent);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="lesson-container"
    >
      {/* Lesson content */}
      <button onClick={handleCompletion}>Complete Lesson</button>
    </motion.div>
  );
};
```

#### **Calculator Components**
```typescript
const YourCalculator = () => {
  const { recordCalculatorUsage } = useProgressStore();
  
  // 1. Record usage for analytics
  useEffect(() => {
    recordCalculatorUsage('your-calculator-id');
  }, []);
  
  // 2. Use Finance.js for calculations
  const finance = new Finance();
  const result = finance.PMT(rate/12, years*12, -principal);
  
  // 3. Provide educational context
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div className="inputs-section">
        {/* Calculator inputs */}
      </div>
      
      <div className="results-section">
        {/* Results with educational explanation */}
        <div className="bg-blue-50 p-4 rounded-lg">
          <h4 className="font-semibold">What This Means:</h4>
          <p>Your {result} indicates...</p>
        </div>
      </div>
    </div>
  );
};
```

#### **Chapter Page Structure**
```typescript
const ChapterPage = () => {
  const [currentSection, setCurrentSection] = useState<'lesson' | 'calculator' | 'quiz'>('lesson');
  const [lessonCompleted, setLessonCompleted] = useState(false);
  const { completeLesson, recordQuizScore } = useProgressStore();
  
  return (
    <div className="chapter-container">
      <Tabs value={currentSection} onValueChange={setCurrentSection}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="lesson">📚 Lesson</TabsTrigger>
          <TabsTrigger value="calculator">🧮 Calculator</TabsTrigger>
          <TabsTrigger value="quiz" disabled={!lessonCompleted}>📊 Quiz</TabsTrigger>
        </TabsList>
        
        <TabsContent value="lesson">
          <ChapterLesson onComplete={handleLessonComplete} />
        </TabsContent>
        
        {/* Other sections */}
      </Tabs>
    </div>
  );
};
```

---

## 🎨 **Design Standards**

### **Color System**
```css
/* Primary Navy & Gold Theme */
--navy-900: #0a1628;
--navy-800: #1e3a8a;
--navy-700: #1e40af;
--gold-500: #f59e0b;
--gold-600: #d97706;

/* Usage Examples */
.primary-button {
  @apply bg-navy-800 hover:bg-navy-900 text-white;
}

.accent-text {
  @apply text-gold-600 hover:text-gold-500;
}
```

### **Animation Standards**
```typescript
// Page transitions
const pageVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 }
};

// Stagger animations
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
<motion.div whileHover={{ scale: 1.02 }} className="interactive-card">
```

### **Icon Standards**
```typescript
// ONLY use Lucide React v0.534.0
import { Calculator, TrendingUp, DollarSign, BookOpen } from 'lucide-react';

// Standard sizing
<Calculator className="w-4 h-4" />  // Small UI elements
<Calculator className="w-6 h-6" />  // Medium buttons
<Calculator className="w-8 h-8" />  // Large features

// NO emoji in production code - use semantic SVG icons
```

---

## 🧪 **Testing Requirements**

### **Before Submitting PR**
```bash
# 1. Build verification
npm run build

# 2. Linting check
npm run lint

# 3. Type checking
npx tsc --noEmit

# 4. Manual testing
# - Test on mobile, tablet, desktop
# - Verify state persistence (clear localStorage)
# - Check AI features with/without API keys
# - Validate calculator accuracy
```

### **Component Testing Checklist**
- [ ] **Progress Integration**: State updates work correctly
- [ ] **Responsive Design**: Mobile, tablet, desktop layouts
- [ ] **Accessibility**: ARIA labels, keyboard navigation
- [ ] **Error Handling**: Graceful fallbacks for API failures
- [ ] **TypeScript**: No type errors, proper interfaces
- [ ] **Performance**: No unnecessary re-renders

---

## 📝 **Commit Standards**

### **Conventional Commits**
```bash
# Features
git commit -m "feat: add options trading calculator with Greeks"

# Bug fixes  
git commit -m "fix: resolve quiz scoring edge case for partial answers"

# Styling
git commit -m "style: improve mobile calculator layout spacing"

# Documentation
git commit -m "docs: update API integration guide with new endpoints"

# Performance
git commit -m "perf: optimize market data caching strategy"

# Tests
git commit -m "test: add unit tests for compound interest calculations"
```

### **PowerShell Git Workflow**
```bash
# Use semicolons (;) for command chaining in PowerShell
git add . ; git commit -m "feat: implement advanced bond calculator" ; git push
```

---

## 🔍 **Code Review Process**

### **PR Requirements**
1. **Clear Description**: What does this PR accomplish?
2. **Screenshots**: Visual changes require before/after images
3. **Testing Evidence**: Demonstrate functionality works
4. **Documentation**: Update relevant docs if needed
5. **Performance**: No significant regression

### **Review Criteria**
- **Code Quality**: Follows established patterns
- **Financial Accuracy**: Calculations are mathematically correct
- **User Experience**: Intuitive and accessible design
- **Technical Standards**: TypeScript, performance, error handling
- **Educational Value**: Enhances learning outcomes

---

## 🎓 **Educational Content Guidelines**

### **Content Standards**
- **Accuracy**: All financial information must be factually correct
- **Clarity**: Explain complex concepts in simple terms
- **Practical**: Include real-world examples and applications
- **Progressive**: Build on previous chapter knowledge
- **Interactive**: Engage users with calculations and scenarios

### **Quiz Development**
```typescript
interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  topic: string;
}

// Example question
{
  id: 'compound-interest-basic',
  question: 'What is the primary factor that makes compound interest more powerful than simple interest?',
  options: [
    'Higher interest rates',
    'Earning interest on previously earned interest',
    'Longer time periods',
    'Larger initial investments'
  ],
  correctAnswer: 1,
  explanation: 'Compound interest allows you to earn interest on both your principal AND previously earned interest, creating exponential growth over time.',
  difficulty: 'beginner',
  topic: 'compound-interest'
}
```

---

## 🤖 **AI Integration Guidelines**

### **OpenAI Integration Patterns**
```typescript
// Context-aware AI requests
const aiContext = {
  userProgress: progress,
  currentChapter: progress.currentChapter,
  strugglingTopics: progress.strugglingTopics,
  type: 'lesson_help' | 'qa_system' | 'concept_explanation'
};

// Fallback responses
const fallbackResponses = {
  'compound-interest': 'Compound interest is the addition of interest to the principal sum...',
  'budgeting': 'Creating a budget helps you track income and expenses...'
};
```

### **AI Prompt Engineering**
- **Context-Aware**: Include user progress and learning state
- **Educational Focus**: Prioritize learning over just answering
- **Encouraging Tone**: Supportive and motivational responses
- **Practical Examples**: Real-world applications and scenarios

---

## 🔧 **Technical Contribution Areas**

### **Performance Optimization**
- **Bundle Analysis**: Use `@next/bundle-analyzer`
- **Image Optimization**: Next.js Image component usage
- **Code Splitting**: Dynamic imports for large components
- **Caching Strategies**: API response caching optimization

### **API Integrations**
- **New Data Sources**: Additional financial APIs
- **Rate Limiting**: Intelligent quota management
- **Error Handling**: Graceful degradation patterns
- **Testing**: Mock API responses for development

### **Accessibility Enhancements**
- **Screen Readers**: ARIA labels and descriptions
- **Keyboard Navigation**: Tab order and focus management
- **Color Contrast**: WCAG 2.1 AA compliance
- **Motion Preferences**: Respect reduced-motion settings

---

## 📞 **Getting Help**

### **Resources**
- **Development Guide**: `/docs/DEVELOPMENT_GUIDE.md`
- **API Integration**: `/docs/API_INTEGRATION.md`
- **Feature Overview**: `/docs/FEATURES.md`
- **Copilot Instructions**: `/.github/copilot-instructions.md`

### **Communication**
- **GitHub Issues**: Bug reports and feature requests
- **Discussions**: Design decisions and architectural questions
- **Code Reviews**: Feedback on pull requests

### **Mentorship**
We welcome first-time contributors! Look for issues labeled:
- `good-first-issue`: Perfect for newcomers
- `help-wanted`: Need community assistance
- `documentation`: Improve guides and explanations

---

## 🏆 **Recognition**

Contributors who make significant impacts will be:
- **Featured** in our README and documentation
- **Credited** in release notes and changelogs
- **Invited** to join our core contributor team
- **Recognized** in the Finance Quest community

---

Thank you for helping build the future of financial education! Together, we're making financial literacy accessible to everyone through cutting-edge technology and personalized learning experiences.

**Happy Contributing!** 🚀
