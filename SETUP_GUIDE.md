# Finance Quest - Setup Guide

## Quick Start

1. **Clone and Install**
   ```bash
   git clone <repository-url>
   cd finance-quest
   npm install
   ```

2. **Environment Configuration**
   - Copy `.env.local.example` to `.env.local`
   - Add your API keys (see sections below)

3. **Run Development Server**
   ```bash
   npm run dev
   ```

## API Keys Setup

### OpenAI Integration (Required for AI Features)
1. Visit [OpenAI Platform](https://platform.openai.com/)
2. Create an account and generate an API key
3. Add to `.env.local`:
   ```
   OPENAI_API_KEY=sk-your-openai-key-here
   ```

### IEX Cloud (For Real Market Data)
1. Visit [IEX Cloud](https://iexcloud.io/)
2. Create a free account (100k API calls/month)
3. Get your publishable token
4. Add to `.env.local`:
   ```
   IEX_CLOUD_API_KEY=pk_your-iex-key-here
   ```

### FRED API (For Economic Data)
1. Visit [FRED Economic Data](https://fred.stlouisfed.org/docs/api/api_key.html)
2. Request a free API key
3. Add to `.env.local`:
   ```
   FRED_API_KEY=your-fred-key-here
   ```

## Demo Mode (No API Keys Required)

The application includes comprehensive fallback data, so you can run a full demo without any API keys. All features will work with realistic mock data.

## Contest Demo Features

### 🧠 Phase 2 Implementations (Completed)
- ✅ **Real Market Data Integration** - Live stock quotes and economic indicators
- ✅ **AI Financial Health Score Calculator** - Personalized assessment with recommendations
- ✅ **Voice Q&A Interface** - Speech recognition and synthesis for accessibility
- ✅ **Economic Dashboard** - Interactive charts with Federal Reserve data
- ✅ **Enhanced Progress Tracking** - Development status dashboard with technical achievements

### 🎯 Key Demo Points
1. **Voice Features**: Test speech recognition in supported browsers (Chrome/Edge recommended)
2. **Real Data**: Market ticker shows live data when API keys are configured
3. **AI Integration**: Financial health assessment provides personalized coaching
4. **Progress Views**: Switch between user and developer progress dashboards
5. **Responsive Design**: All components work seamlessly across devices

## Technical Architecture

### Frontend Stack
- **Next.js 15.4.4** - App Router with SSR
- **React 19.1.0** - Latest features with concurrent rendering
- **TypeScript 5** - Full type safety
- **Tailwind CSS 3.5** - Utility-first styling
- **Framer Motion 12.23** - Smooth animations

### AI & Data Integration
- **OpenAI GPT-4o-mini** - Real AI coaching and assessments
- **IEX Cloud API** - Real-time financial market data
- **FRED API** - Federal Reserve economic indicators
- **React Speech Recognition** - Voice interaction capabilities

### Educational Framework
- **Spaced Repetition** - SM-2 algorithm for memory optimization
- **Multi-Modal Learning** - Visual, auditory, kinesthetic, reading/writing
- **Progress Tracking** - Comprehensive analytics and achievement system
- **Accessibility** - Voice interface, screen reader support, keyboard navigation

## Development Commands

```bash
# Development server
npm run dev

# Type checking
npm run type-check

# Linting
npm run lint

# Build for production
npm run build

# Start production server
npm start
```

## Browser Compatibility

### Full Feature Support
- **Chrome 85+** - All features including voice recognition
- **Edge 85+** - All features including voice recognition
- **Safari 14+** - All features except voice recognition
- **Firefox 80+** - All features except voice recognition

### Voice Features
Voice Q&A requires Web Speech API support:
- ✅ Chrome/Chromium browsers
- ✅ Microsoft Edge
- ❌ Safari (speech synthesis only)
- ❌ Firefox (speech synthesis only)

## Troubleshooting

### Common Issues

1. **Voice features not working**
   - Ensure you're using Chrome or Edge
   - Allow microphone permissions
   - Check HTTPS is enabled (required for speech recognition)

2. **API rate limits**
   - IEX Cloud: 100k calls/month on free tier
   - OpenAI: Depends on your plan
   - FRED: 120 requests/minute, no monthly limit

3. **Build errors**
   - Clear `.next` folder: `rm -rf .next`
   - Reinstall dependencies: `rm -rf node_modules && npm install`

### Performance Notes
- Market data refreshes every 30 seconds
- AI responses are cached to reduce API calls
- Images and assets are optimized with Next.js Image component
- Animations use hardware acceleration for smooth performance

## Contributing

This project follows modern React/Next.js best practices:
- Functional components with hooks
- TypeScript for type safety
- Tailwind for consistent styling
- ESLint + Prettier for code quality
- Responsive-first design approach

## License

MIT License - Feel free to use this project as a learning resource or starting point for your own financial education applications.
