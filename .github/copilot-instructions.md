# Finance Quest: AI Development Guide

## Project Vision
A comprehensive financial literacy game that teaches users from zero knowledge to advanced financial concepts through interactive storytelling, hands-on simulations, and immediate feedback loops.

## Hackathon Context & Timeline

### Competition Details
- **Track**: Hack the Economy (financial literacy focus)
- **Submission Deadline**: September 12th, 2025 
- **Development Window**: ~6 weeks from July 29th, 2025
- **Judging Criteria**: Impact, Creativity, Usability, Technical Quality

### MVP Development Strategy
Given the hackathon timeline, focus on building a **demonstrable MVP** that showcases:
1. **Chapter 1 (Money Fundamentals)** - Complete with 2-3 interactive lessons ✅
2. **One Signature Calculator** - Compound interest visualizer with real-time feedback ✅
3. **Assessment System** - Working quiz with mastery tracking ✅
4. **AI Teaching Assistant** - Real OpenAI GPT-4 integration with contextual responses ✅
5. **Demo-Ready Metrics** - Global progress tracking with localStorage persistence ✅

### Judging-Focused Features
- **Impact**: Addresses the 64% financial illiteracy problem with measurable learning ✅
- **Creativity**: Real AI-powered personalized learning paths and interactive visualizations ✅
- **Usability**: Zero-knowledge-assumed design with immediate feedback loops ✅
- **Technical Quality**: React/Next.js with real OpenAI API integration and persistent state management ✅

## Architecture Overview

### Current System Architecture ✅

#### Core Infrastructure
- **Next.js 15.4.4** with App Router and TypeScript
- **Real AI Integration**: OpenAI GPT-4o-mini API with contextual financial coaching
- **Global State Management**: React Context with localStorage persistence  
- **Progress Tracking**: Comprehensive user journey analytics and achievement system
- **Interactive Visualizations**: Recharts library for financial data display

#### API Routes & Services
- `/api/ai-chat` - OpenAI integration with user progress context and fallback responses
- Environment variables secured in `.env.local` with proper error handling

#### State Management System
- `lib/context/ProgressContext.tsx` - Centralized progress tracking with:
  - Learning module completion tracking
  - Time spent analytics  
  - Struggling topics identification
  - Achievement and milestone unlocking
  - Persistent storage with automatic sync

#### Component Integration Status ✅
All educational components now integrated with global progress tracking:
- `MoneyFundamentalsLesson` - Tracks lesson progression and completion
- `MoneyFundamentalsQuiz` - Records quiz attempts, scores, and struggling topics  
- `PaycheckCalculator` - Monitors calculator usage and comprehension

### Core Educational Philosophy
- **Zero-to-Hero Learning Path**: Progressive curriculum from basic budgeting to advanced investment strategies
- **Mastery-Based Progression**: 80%+ quiz scores required to unlock next chapters
- **Immediate Application**: Each concept learned through interactive calculators and real-world scenarios
- **AI-Powered Personalization**: Adaptive difficulty and personalized coaching based on comprehension

### Chapter Structure (5 Core Modules)
1. **Money Fundamentals**: Income, banking, paycheck basics
2. **Budgeting Mastery**: 50/30/20 rule, expense tracking, emergency funds
3. **Debt and Credit**: Credit scores, good vs bad debt, loan strategies
4. **Investment Fundamentals**: Compound interest, stocks/bonds, 401k matching
5. **Advanced Planning**: Tax optimization, real estate, insurance

### Key Component Types

#### Interactive Calculators
- Compound interest visualizer with real-time sliders
- Budget builder with immediate feedback validation
- Loan payment calculator with amortization tables
- Investment return simulator with scenario modeling
- Paycheck calculator (gross vs net with deductions)

#### Assessment System
- 3-5 quiz questions per lesson
- Detailed explanations for wrong answers
- Cross-chapter concept reinforcement
- Progress tracking with mastery indicators

#### Scenario Engine
- Story-driven learning experiences
- Decision trees showing long-term consequences
- "What-if" financial planning simulations
- Real-world application challenges

## Development Patterns

### Educational Content Structure
```
components/
├── chapters/
│   ├── fundamentals/
│   │   ├── lessons/         # Interactive lesson components
│   │   ├── calculators/     # Financial calculation tools
│   │   ├── assessments/     # Quiz and mastery checks
│   │   └── scenarios/       # Real-world application stories
│   └── [other-chapters]/
├── shared/
│   ├── ui/                  # Reusable UI components
│   ├── calculators/         # Base calculator components
│   └── ai-assistant/        # AI teaching assistant
```

### Component Naming Conventions
- `Calculator*`: Interactive financial tools (e.g., `CompoundInterestCalculator`)
- `Lesson*`: Educational content components (e.g., `BudgetingLesson`)
- `Quiz*`: Assessment components (e.g., `CreditScoreQuiz`)
- `Scenario*`: Story-driven simulations (e.g., `FirstJobScenario`)

### State Management Patterns
- User progress tracking across chapters
- Mastery status for each concept
- Personalized AI coaching recommendations
- Calculator input persistence between sessions

### AI Teaching Assistant Integration ✅
- **Real OpenAI GPT-4o-mini Integration**: Contextual financial coaching with user progress awareness
- **Personalized Explanations**: Dynamic responses based on user's learning history and struggling topics
- **Progress-Aware Coaching**: AI knows completed lessons, quiz scores, and areas needing reinforcement  
- **Fallback Response System**: Graceful handling when API is unavailable with educational prompts
- **Usage Analytics**: Token tracking and conversation history for optimization

## Key Technical Considerations

### Educational Effectiveness
- Implement spaced repetition for concept reinforcement
- Visual learning through interactive charts and graphs
- Immediate feedback loops for all user interactions
- Progress visualization to maintain engagement

### Accessibility & Inclusivity
- Assume zero prior financial knowledge
- Multiple learning modalities (visual, interactive, text)
- Clear, jargon-free explanations with definitions
- Mobile-responsive design for accessibility

### Demo-Ready Features
- Clear before/after learning progression metrics
- Immediate visual feedback on financial calculations
- Engaging story narratives that demonstrate real-world impact
- Measurable knowledge assessment results

### Git Workflow & Commit Strategy
- **Commit frequently**: After completing each component, calculator, or lesson
- **Meaningful messages**: Use format "feat: add compound interest calculator" or "fix: quiz scoring logic"
- **Keep messages short**: Single line, under 50 characters when possible
- **Commit triggers**: After each working feature, before major refactors, end of each work session
- **PowerShell commands**: Use `;` not `&&` for command chaining (e.g., `git add . ; git commit -m "message"`)
- **Example messages**: 
  - `feat: add PaycheckCalculator`
  - `feat: Chapter1 banking lesson`
  - `fix: quiz progression bug`
  - `style: mobile calculator layout`

## Development Priorities

### Phase 1: MVP Foundation (Weeks 1-2) ✅ COMPLETED
1. **Chapter 1 (Money Fundamentals)** - Core foundation with complete interactive lesson ✅
2. **Interactive Calculator Framework** - PaycheckCalculator with real-time calculations ✅  
3. **User Progress Tracking** - Full React Context system with localStorage persistence ✅

### Phase 2: Core Features (Weeks 3-4) ✅ COMPLETED
1. **Assessment System** - Complete quiz framework with immediate feedback and explanations ✅
2. **Real AI Assistant** - OpenAI GPT-4o-mini integration with contextual user progress awareness ✅
3. **Global State Management** - Comprehensive ProgressContext system tracking all user interactions ✅

### Phase 3: Demo Enhancement (Current Focus - Weeks 5-6)
1. **Additional Calculators** - Compound interest and budget builders
2. **Scenario Engine** - Story-driven learning experiences with decision trees
3. **Progress Dashboard** - Visual metrics display for judges and user engagement
4. **Mobile Responsiveness** - Ensure accessibility across all devices

## Success Metrics

### Current Competitive Advantages ✅
- **Real AI Integration**: Unlike simulated responses, we use actual OpenAI GPT-4o-mini for personalized coaching
- **Persistent Progress Tracking**: Global state management with localStorage ensures seamless user experience
- **Contextual AI Responses**: AI assistant knows user's learning history, quiz scores, and struggling topics
- **Interactive Learning**: Hands-on calculators with immediate feedback loops
- **Zero-Knowledge Design**: Assumes no prior financial literacy, making it truly accessible

### Hackathon Demo Points
- User comprehension scores (target: 80%+ mastery rate)
- Real-time AI coaching based on individual progress
- Engagement time per chapter with persistent tracking
- Practical tool usage (calculators, assessments) with analytics
- Knowledge retention across sessions via localStorage
- **Demo Impact**: Clear before/after assessment scores with AI-powered personalized learning paths

When building components, prioritize educational effectiveness and **demo readiness** over visual polish. Each feature should teach a specific financial concept, provide immediate actionable value, and demonstrate measurable learning impact to judges.

**Remember**: Commit your work regularly with meaningful messages. Every completed component, calculator, or lesson should be committed to preserve progress and enable easy rollbacks if needed.
