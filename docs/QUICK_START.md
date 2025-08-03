# Finance Quest - Quick Start Guide 🚀

## ⚡ **Get Running in 5 Minutes**

This guide gets you up and running with Finance Quest development quickly. For deeper understanding, see the [Architecture Guide](ARCHITECTURE.md).

---

## 📋 **Prerequisites**

```bash
✅ Node.js 18+ (LTS recommended)
✅ npm or yarn package manager
✅ Git for version control
✅ VS Code (recommended) with extensions:
   - ES7+ React/Redux/React-Native snippets
   - Tailwind CSS IntelliSense
   - TypeScript Importer
```

---

## 🚀 **Installation**

### **1. Clone & Install**
```bash
# Clone the repository
git clone https://github.com/forbiddenlink/finance-quest.git
cd finance-quest

# Install dependencies
npm install
```

### **2. Environment Setup**
Create `.env.local` in the root directory:

```bash
# Required for AI features
OPENAI_API_KEY=sk-your-openai-key-here

# Optional - Enhanced market data (all have free tiers)
FRED_API_KEY=your-fred-key-here
ALPHA_VANTAGE_API_KEY=your-alpha-vantage-key
POLYGON_API_KEY=your-polygon-key-here
FINNHUB_API_KEY=your-finnhub-key
```

> **Note**: The platform works without API keys using fallback data, but AI features require OpenAI API key.

### **3. Start Development Server**
```bash
# Start with Turbopack (faster builds)
npm run dev

# Open in browser
# http://localhost:3001
```

---

## ⚙️ **Essential Commands**

```bash
# Development
npm run dev          # Start dev server with Turbopack
npm run build        # Production build
npm run start        # Start production server
npm run lint         # Run ESLint

# Git workflow (PowerShell compatible)
git add . ; git commit -m "feat: description" ; git push
```

---

## 🧭 **Project Structure Overview**

```
finance-quest/
├── app/                          # Next.js App Router
│   ├── page.tsx                 # Main homepage
│   ├── layout.tsx               # Root layout
│   ├── chapter[1-14]/          # Educational chapters
│   ├── calculators/            # Standalone calculator pages
│   └── api/                    # API routes
│       ├── ai-chat/           # OpenAI integration
│       └── market-data/       # Market data service
├── components/                  # React components
│   ├── shared/                 # Reusable components
│   │   ├── calculators/       # Calculator components
│   │   ├── ai-assistant/      # AI coaching components
│   │   └── ui/                # UI components
│   ├── chapters/              # Chapter-specific components
│   └── ui/                    # Radix UI components
├── lib/                        # Utilities and core logic
│   ├── store/                 # Zustand state management
│   ├── theme/                 # Design system
│   └── api/                   # External API integrations
└── docs/                      # Documentation
```

---

## 🎯 **Key Development Patterns**

### **State Management (Zustand)**
```typescript
// Import the progress store
import { useProgressStore } from '@/lib/store/progressStore';

// Use in components
const { completeLesson, recordQuizScore } = useProgressStore();
const progress = useProgressStore(state => state.userProgress);
```

### **Theme System**
```typescript
// Import centralized theme
import { theme } from '@/lib/theme';

// Use theme classes
className={`${theme.backgrounds.card} ${theme.textColors.primary}`}
```

### **Calculator Pattern**
```typescript
// Track usage for analytics
useEffect(() => {
  recordCalculatorUsage('compound-interest');
}, []);

// Use Finance.js for calculations
import { Finance } from 'financejs';
const finance = new Finance();
const payment = finance.PMT(rate, periods, present, future, type);
```

---

## 🧪 **Testing Your Setup**

### **1. Verify Development Server**
- Navigate to `http://localhost:3001`
- Should see Finance Quest homepage
- No console errors

### **2. Test Core Features**
- **Navigation**: Click through chapters 1-3
- **Calculators**: Try compound interest calculator
- **AI Chat**: Test Q&A system (requires OpenAI key)
- **State Persistence**: Complete a lesson, refresh page, verify progress saved

### **3. Check Console**
```bash
# Should see logs like:
✓ Market data service initialized
✓ Progress store loaded from localStorage
✓ Theme system active
```

---

## 🚨 **Common Issues & Solutions**

### **Port Already in Use**
```bash
# Kill process on port 3001
npx kill-port 3001

# Or use different port
npm run dev -- --port 3002
```

### **Module Not Found Errors**
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

### **AI Features Not Working**
- Verify `OPENAI_API_KEY` in `.env.local`
- Check OpenAI account has available credits
- Review browser console for API errors

### **Market Data Issues**
- Platform works with fallback data
- Check network connectivity
- Verify API keys if using premium features

---

## 🎓 **Next Steps**

### **For New Developers**
1. **Read**: [Architecture Guide](ARCHITECTURE.md) - Understand the technical stack
2. **Explore**: [Component Guide](COMPONENT_GUIDE.md) - Learn development patterns
3. **Build**: Try creating a simple calculator component

### **For Contributing**
1. **Review**: [Contributing Guidelines](../CONTRIBUTING.md)
2. **Setup**: Configure development environment
3. **Pick**: Choose an issue from GitHub Issues

### **For Advanced Development**
1. **Study**: [State Management Guide](STATE_MANAGEMENT.md)
2. **Optimize**: [Performance Guide](PERFORMANCE.md)
3. **Deploy**: [Deployment Guide](../DEPLOYMENT.md)

---

## 📚 **Learning Resources**

### **Finance Quest Specific**
- [Features Overview](FEATURES.md) - What the platform does
- [API Integration](API_INTEGRATION.md) - External service setup
- [Design System](DESIGN_SYSTEM.md) - Visual guidelines

### **Technology Stack**
- [Next.js 15 Documentation](https://nextjs.org/docs)
- [Zustand State Management](https://github.com/pmndrs/zustand)
- [Finance.js Library](https://financejs.readthedocs.io/)
- [Framer Motion](https://www.framer.com/motion/)

---

## 💬 **Getting Help**

### **Quick Questions**
- Check this guide first
- Search existing GitHub Issues
- Review error messages carefully

### **Development Support**
- **GitHub Issues**: Technical problems and bugs
- **GitHub Discussions**: Architecture and design questions
- **Documentation**: Suggest improvements to guides

---

**🎉 You're ready to start developing with Finance Quest!**

*Need more details? Continue to the [Architecture Guide](ARCHITECTURE.md) for deep technical understanding.*
