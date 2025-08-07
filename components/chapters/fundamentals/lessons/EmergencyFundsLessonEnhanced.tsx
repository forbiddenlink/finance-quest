'use client';

import { useState, useEffect } from 'react';
import { useProgressStore } from '@/lib/store/progressStore';
import { theme } from '@/lib/theme';
import GradientCard from '@/components/shared/ui/GradientCard';
import ProgressRing from '@/components/shared/ui/ProgressRing';
// Import the new interactive components
import EmergencyFundPersonalityAssessment from './EmergencyFundPersonalityAssessment';
import EmergencyScenarioSimulator from './EmergencyScenarioSimulator';
import RiskToleranceVisualizer from './RiskToleranceVisualizer';
import {
  Shield,
  Target,
  DollarSign,
  TrendingUp,
  CheckCircle,
  AlertCircle,
  Calculator,
  ChevronLeft,
  ChevronRight,
  Star,
  Award,
  Zap,
  Users,
  Gamepad2,
  BarChart3
} from 'lucide-react';
import toast from 'react-hot-toast';

interface EmergencyFundsLessonProps {
  onComplete?: () => void;
}

interface LessonContent {
  title: string;
  content: string;
  keyPoints: string[];
  practicalAction: string;
  moneyExample: string;
  warningTip?: string;
}

const enhancedLessons: LessonContent[] = [
  {
    title: "Emergency Funds: Your Financial Fortress Against Crisis",
    content: "40% of Americans can't cover a $400 emergency, leading to debt cycles that trap families for decades. Emergency funds aren't just savings—they're peace of mind, freedom from financial stress, and the foundation that allows every other financial goal to succeed. Without this safety net, one crisis destroys years of progress.",
    keyPoints: [
      "Emergency funds break the debt cycle by preventing credit card reliance during crises",
      "Financial stress reduces productivity, health, and decision-making quality by 30-50%",
      "Safety nets provide negotiating power: leave bad jobs, wait for better opportunities",
      "Peace of mind allows smart risk-taking in career and investments that build wealth",
      "People with emergency funds earn 20%+ more over lifetimes due to better decision-making"
    ],
    practicalAction: "Calculate how much you've paid in overdraft, late fees, and emergency credit card interest this year",
    moneyExample: "Sarah had no emergency fund. Car repair $800 → credit card at 22% interest. Took 18 months to pay off, total cost: $1,200+ vs $800 if she had an emergency fund",
    warningTip: "Without emergency funds, financial setbacks become financial disasters that compound over years"
  },
  {
    title: "Right-Sizing Your Emergency Fund: Beyond the 3-6 Month Rule",
    content: "The standard '3-6 months' advice is dangerously oversimplified. Your optimal emergency fund depends on job security, health, dependents, and income stability. A gig worker needs 12 months, while a tenured professor needs 3. Calculate your personalized target for maximum security without over-saving.",
    keyPoints: [
      "High job security (teacher, government, tech) = 3-4 months of essential expenses",
      "Variable income (sales, freelance, business owner) = 8-12 months for income stability",
      "Single parents or sole income earners need 6-9 months for family protection",
      "Health issues or family medical needs require additional 3-6 month buffer",
      "Essential expenses only: housing, food, utilities, minimum debt payments, insurance"
    ],
    practicalAction: "List your essential monthly expenses and multiply by your risk factor this week",
    moneyExample: "Tech worker Mike: $4,000 essential expenses × 4 months = $16,000 target. Freelancer Lisa: $3,500 expenses × 10 months = $35,000 target due to income variability",
    warningTip: "Don't use your full budget for calculations - emergency mode spending is 30-40% less than normal"
  },
  {
    title: "The $1,000 Starter Emergency Fund: Your First Line of Defense", 
    content: "Before building your full emergency fund, establish a $1,000 starter fund immediately. This covers 80% of small emergencies (car repairs, medical bills, appliance replacements) while you build bigger reserves. Small emergency funds prevent most debt disasters and buy time to handle larger crises strategically.",
    keyPoints: [
      "$1,000 covers most common emergencies: car repairs, medical copays, home repairs",
      "Starter fund prevents emergency from becoming debt crisis while building full fund",
      "Psychological benefit: knowing you can handle small setbacks reduces financial anxiety",
      "Build starter fund first before aggressive debt payoff or investing strategies",
      "Keep starter fund in checking account for instant access, then move to high-yield savings"
    ],
    practicalAction: "Open a separate high-yield savings account specifically for your emergency fund this week",
    moneyExample: "Tom's $900 car repair would have gone on credit card (22% interest, $200+ in interest costs). His $1,000 starter fund saved him from debt and interest charges",
    warningTip: "Don't skip the starter fund to build a larger fund faster - you're vulnerable to debt during the building phase"
  },
  {
    title: "Emergency Fund Placement: Growth, Access, and Safety Balance",
    content: "Your emergency fund should earn money while staying accessible for true emergencies. Traditional savings accounts earning 0.01% lose money to inflation (wealth destruction). High-yield savings, money market accounts, and strategic placement can earn 4-5% while keeping funds available within 24-48 hours.",
    keyPoints: [
      "High-yield online savings accounts: 4-5% APY with instant online transfer access",
      "Money market accounts offer higher rates plus limited check-writing for true emergencies",
      "Keep 1 month expenses in checking for immediate access, rest in high-yield savings",
      "Avoid investing emergency funds in stocks or bonds - volatility defeats the purpose",
      "FDIC insurance protects up to $250,000 per account, per bank for complete safety"
    ],
    practicalAction: "Research and open a high-yield savings account with 4%+ APY this week",
    moneyExample: "$15,000 emergency fund: Traditional savings (0.01%) = $1.50/year. High-yield savings (4.5%) = $675/year. Difference: $673 in free money!",
    warningTip: "Don't chase highest rates at unknown banks - stick with FDIC-insured institutions with good customer service"
  },
  {
    title: "Building Your Emergency Fund: Automation and Acceleration",
    content: "Most people fail to build emergency funds because they rely on willpower instead of systems. Automation removes decision fatigue and ensures consistent progress. Use the 'pay yourself first' principle, capture windfalls strategically, and celebrate milestones to maintain motivation during the building phase.",
    keyPoints: [
      "Automate transfers on payday before spending temptation hits your checking account", 
      "Start with sustainable amount ($50-200/month) and increase with raises or bonuses",
      "Capture windfalls: tax refunds, bonuses, gifts, freelance income go directly to emergency fund",
      "Celebrate milestones: $1k, $5k, $10k achievements maintain motivation over months",
      "Track progress visually with apps or charts - seeing growth maintains momentum"
    ],
    practicalAction: "Set up automatic transfer of at least $100/month to your emergency fund starting this payday",
    moneyExample: "Auto-transfer $150/month = $1,800/year. Add $2,000 tax refund + $500 bonus = $4,300 emergency fund progress in year one",
    warningTip: "Start with smaller automatic amounts you won't miss - consistency beats large sporadic contributions"
  },
  {
    title: "Emergency Fund Protection: When and How to Use It",
    content: "Having an emergency fund is only half the battle—using it correctly is crucial. True emergencies are unexpected, necessary, and urgent. Job loss, medical bills, and major repairs qualify. Vacations, sales, and lifestyle wants don't. Protect your fund with clear rules and rapid replenishment strategies.",
    keyPoints: [
      "True emergencies: job loss, medical bills, major car/home repairs, family crisis",
      "Not emergencies: vacations, sales, lifestyle upgrades, predictable annual expenses",
      "Sleep on large withdrawals (48-hour rule) unless immediate danger exists",
      "Replenish immediately after use - emergency funds aren't one-time savings",
      "Keep detailed records of emergency fund usage to identify spending patterns"
    ],
    practicalAction: "Write down your personal emergency fund rules and share them with your family this week",
    moneyExample: "Emergency fund rules: $2,000+ = sleep on it 48 hours. Job loss = use monthly, look for work aggressively. Car repair over $500 = get second opinion first",
    warningTip: "Emergency fund 'creep' destroys financial security - resist using it for non-emergencies no matter how 'good' the reason seems"
  }
];

export default function EmergencyFundsLessonEnhanced({ onComplete }: EmergencyFundsLessonProps) {
  const { userProgress, completeLesson } = useProgressStore();
  const [currentLesson, setCurrentLesson] = useState(0);
  const [completedLessons, setCompletedLessons] = useState<boolean[]>(new Array(enhancedLessons.length).fill(false));

  // Load completed lessons from global state
  useEffect(() => {
    const newCompleted = enhancedLessons.map((lesson, index) =>
      userProgress.completedLessons.includes(`emergency-funds-enhanced-${index}`)
    );
    setCompletedLessons(newCompleted);
  }, [userProgress.completedLessons]);

  const markComplete = () => {
    const lessonId = `emergency-funds-enhanced-${currentLesson}`;
    completeLesson(lessonId, 18);

    const newCompleted = [...completedLessons];
    newCompleted[currentLesson] = true;
    setCompletedLessons(newCompleted);

    toast.success(`"${lesson.title}" completed! 🛡️`, {
      duration: 3000,
      position: 'top-center',
    });

    // Call parent completion callback when all lessons are done
    if (currentLesson === enhancedLessons.length - 1) {
      onComplete?.();
    }
  };

  const nextLesson = () => {
    if (currentLesson < enhancedLessons.length - 1) {
      setCurrentLesson(currentLesson + 1);
    }
  };

  const prevLesson = () => {
    if (currentLesson > 0) {
      setCurrentLesson(currentLesson - 1);
    }
  };

  const lesson = enhancedLessons[currentLesson];
  const progress = ((currentLesson + 1) / enhancedLessons.length) * 100;

  return (
    <div className="max-w-4xl mx-auto">
      {/* Progress Ring */}
      <div className="flex justify-center mb-6">
        <ProgressRing
          progress={progress}
          size={120}
          color="#EF4444"
          className="animate-bounce-in"
        />
      </div>

      <GradientCard variant="glass" gradient="red" className="p-8">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className={`${theme.status.error.bg} p-2 rounded-lg animate-float`}>
                <Shield className={`w-6 h-6 ${theme.status.error.text}`} />
              </div>
              <span className={`text-sm font-medium ${theme.status.error.text}`}>
                Lesson {currentLesson + 1} of {enhancedLessons.length}
              </span>
            </div>
            <span className={`text-sm ${theme.textColors.muted}`}>
              Chapter 4: Emergency Funds & Financial Safety
            </span>
          </div>

          <h1 className={`text-3xl font-bold ${theme.textColors.primary} mb-4 gradient-text-red`}>
            {lesson.title}
          </h1>
        </div>

        {/* Content */}
        <div className="mb-8">
          <p className={`text-lg ${theme.textColors.secondary} leading-relaxed mb-6`}>
            {lesson.content}
          </p>

          {/* Key Points */}
          <GradientCard variant="glass" gradient="blue" className="p-6 mb-6">
            <div className="flex items-center mb-4">
              <div className={`${theme.status.info.bg} p-2 rounded-lg mr-3`}>
                <Star className={`w-5 h-5 ${theme.status.info.text}`} />
              </div>
              <h3 className={`text-lg font-semibold ${theme.textColors.primary}`}>Key Strategies</h3>
            </div>
            <ul className="space-y-3">
              {lesson.keyPoints.map((point, index) => (
                <li key={index} className="flex items-start">
                  <div className={`flex-shrink-0 w-6 h-6 ${theme.status.info.bg} rounded-full flex items-center justify-center mt-1 mr-3`}>
                    <CheckCircle className={`w-4 h-4 ${theme.status.info.text}`} />
                  </div>
                  <span className={`${theme.textColors.secondary} font-medium`}>{point}</span>
                </li>
              ))}
            </ul>
          </GradientCard>

          {/* Warning Tip */}
          {lesson.warningTip && (
            <div className={`mb-6 p-4 ${theme.status.error.bg} border-l-4 ${theme.status.error.border} rounded-lg`}>
              <h3 className={`text-lg font-semibold ${theme.status.error.text} mb-2 flex items-center gap-2`}>
                <AlertCircle className="w-5 h-5" />
                Critical Insight
              </h3>
              <p className={`${theme.textColors.secondary} font-medium`}>
                {lesson.warningTip}
              </p>
            </div>
          )}

          {/* Practical Action */}
          <div className={`mb-6 p-6 ${theme.status.warning.bg} border-l-4 ${theme.status.warning.border} rounded-lg`}>
            <h3 className={`text-lg font-semibold ${theme.status.warning.text} mb-3 flex items-center gap-2`}>
              <Target className="w-5 h-5" />
              Action Step This Week
            </h3>
            <p className={`${theme.textColors.secondary} font-medium mb-3`}>
              {lesson.practicalAction}
            </p>
          </div>

          {/* Money Example */}
          <div className={`mb-6 p-6 ${theme.status.success.bg} border-l-4 ${theme.status.success.border} rounded-lg`}>
            <h3 className={`text-lg font-semibold ${theme.status.success.text} mb-3 flex items-center gap-2`}>
              <DollarSign className="w-5 h-5" />
              Real Money Example
            </h3>
            <p className={`${theme.textColors.secondary} font-medium italic`}>
              {lesson.moneyExample}
            </p>
          </div>

          {/* Interactive Content */}
          {currentLesson === 0 && (
            <div className={`mb-8 p-6 ${theme.backgrounds.card} border ${theme.borderColors.primary} rounded-lg`}>
              <h3 className={`text-lg font-semibold ${theme.textColors.primary} mb-4 flex items-center gap-2`}>
                <Users className="w-5 h-5" />
                Discover Your Emergency Fund Personality
              </h3>
              <p className={`${theme.textColors.secondary} mb-4`}>
                Take our comprehensive assessment to determine your ideal emergency fund strategy based on your unique risk factors and life situation.
              </p>
              <EmergencyFundPersonalityAssessment 
                onComplete={(profile) => {
                  toast.success(`Assessment complete! Your strategy: ${profile.emergencyFundMonths} emergency fund.`, {
                    duration: 4000,
                    position: 'top-center',
                  });
                }}
              />
            </div>
          )}

          {currentLesson === 1 && (
            <div className={`mb-8 p-6 ${theme.backgrounds.card} border ${theme.borderColors.primary} rounded-lg`}>
              <h3 className={`text-lg font-semibold ${theme.textColors.primary} mb-4 flex items-center gap-2`}>
                <BarChart3 className="w-5 h-5" />
                Interactive Risk Tolerance Visualizer
              </h3>
              <p className={`${theme.textColors.secondary} mb-4`}>
                Visualize how different emergency fund sizes protect you from financial risk. See the impact of 1, 3, 6, and 12-month emergency funds on your financial security.
              </p>
              <RiskToleranceVisualizer 
                onComplete={(scenario) => {
                  toast.success(`Perfect! ${scenario.months}-month fund selected for ${scenario.protection}% protection.`, {
                    duration: 4000,
                    position: 'top-center',
                  });
                }}
              />
            </div>
          )}

          {currentLesson === 5 && (
            <div className={`mb-8 p-6 ${theme.backgrounds.card} border ${theme.borderColors.primary} rounded-lg`}>
              <h3 className={`text-lg font-semibold ${theme.textColors.primary} mb-4 flex items-center gap-2`}>
                <Gamepad2 className="w-5 h-5" />
                Emergency Scenario Simulator
              </h3>
              <p className={`${theme.textColors.secondary} mb-4`}>
                Experience real emergency scenarios and see firsthand how emergency funds protect you from debt and financial stress. 
                Learn from mistakes without real-world consequences.
              </p>
              <EmergencyScenarioSimulator 
                onComplete={(results) => {
                  const successCount = results.filter(r => r.outcome === 'success').length;
                  toast.success(`Simulation complete! Successfully handled ${successCount} out of ${results.length} emergencies.`, {
                    duration: 4000,
                    position: 'top-center',
                  });
                }}
              />
            </div>
          )}

          {currentLesson === 2 && (
            <div className={`mb-8 p-6 ${theme.backgrounds.card} border ${theme.borderColors.primary} rounded-lg`}>
              <h3 className={`text-lg font-semibold ${theme.textColors.primary} mb-4 flex items-center gap-2`}>
                <Calculator className="w-5 h-5" />
                Emergency Fund Calculator by Risk Level
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className={`p-4 ${theme.status.success.bg} rounded-lg text-center`}>
                  <h4 className={`font-bold ${theme.status.success.text} mb-2`}>Stable Job</h4>
                  <p className={`text-2xl font-bold ${theme.status.success.text}`}>3-4 Months</p>
                  <p className={`${theme.textColors.secondary} text-sm`}>Government, education, tech</p>
                </div>
                <div className={`p-4 ${theme.status.warning.bg} rounded-lg text-center`}>
                  <h4 className={`font-bold ${theme.status.warning.text} mb-2`}>Medium Risk</h4>
                  <p className={`text-2xl font-bold ${theme.status.warning.text}`}>6-8 Months</p>
                  <p className={`${theme.textColors.secondary} text-sm`}>Sales, corporate, healthcare</p>
                </div>
                <div className={`p-4 ${theme.status.error.bg} rounded-lg text-center`}>
                  <h4 className={`font-bold ${theme.status.error.text} mb-2`}>Variable Income</h4>
                  <p className={`text-2xl font-bold ${theme.status.error.text}`}>10-12 Months</p>
                  <p className={`${theme.textColors.secondary} text-sm`}>Freelance, business, commission</p>
                </div>
              </div>
              <p className={`mt-4 text-center font-bold ${theme.textColors.primary}`}>
                💡 Multiply your essential monthly expenses by your risk factor
              </p>
              <div className={`mt-6 p-4 ${theme.backgrounds.glass} border ${theme.borderColors.primary} rounded-lg`}>
                <p className={`text-sm ${theme.textColors.secondary} text-center`}>
                  📊 <strong>Use the Calculator tab</strong> to run your personal scenario analysis and build a custom timeline based on your unique risk factors and financial situation.
                </p>
              </div>
            </div>
          )}

          {currentLesson === 3 && (
            <div className={`mb-8 p-6 ${theme.backgrounds.card} border ${theme.borderColors.primary} rounded-lg`}>
              <h3 className={`text-lg font-semibold ${theme.textColors.primary} mb-4 flex items-center gap-2`}>
                <TrendingUp className="w-5 h-5" />
                High-Yield Savings Impact
              </h3>
              <div className="space-y-4">
                <div className={`p-4 ${theme.status.error.bg} rounded-lg`}>
                  <h4 className={`font-bold ${theme.status.error.text} mb-2`}>❌ Traditional Savings (0.01%)</h4>
                  <p className={`${theme.textColors.secondary} text-sm`}>$15,000 emergency fund earns $1.50/year - loses money to inflation</p>
                </div>
                <div className={`p-4 ${theme.status.success.bg} rounded-lg`}>
                  <h4 className={`font-bold ${theme.status.success.text} mb-2`}>✅ High-Yield Savings (4.5%)</h4>
                  <p className={`${theme.textColors.secondary} text-sm`}>$15,000 emergency fund earns $675/year - beats inflation, grows purchasing power</p>
                </div>
              </div>
              <p className={`mt-4 text-center font-bold ${theme.textColors.primary}`}>
                🎯 Difference: $673 in free money annually!
              </p>
            </div>
          )}

          {currentLesson === 4 && (
            <div className={`mb-8 p-6 ${theme.backgrounds.card} border ${theme.borderColors.primary} rounded-lg`}>
              <h3 className={`text-lg font-semibold ${theme.textColors.primary} mb-4 flex items-center gap-2`}>
                <Zap className="w-5 h-5" />
                Emergency Fund Building Timeline
              </h3>
              <div className="space-y-4">
                <div className={`p-4 ${theme.status.info.bg} rounded-lg`}>
                  <h4 className={`font-bold ${theme.status.info.text} mb-2`}>Month 1-3: Starter Fund</h4>
                  <p className={`${theme.textColors.secondary} text-sm`}>Build $1,000 emergency fund for immediate protection</p>
                </div>
                <div className={`p-4 ${theme.status.warning.bg} rounded-lg`}>
                  <h4 className={`font-bold ${theme.status.warning.text} mb-2`}>Month 4-12: Full Fund</h4>
                  <p className={`${theme.textColors.secondary} text-sm`}>Systematic building to 3-12 month target based on risk level</p>
                </div>
                <div className={`p-4 ${theme.status.success.bg} rounded-lg`}>
                  <h4 className={`font-bold ${theme.status.success.text} mb-2`}>Ongoing: Maintain & Optimize</h4>
                  <p className={`${theme.textColors.secondary} text-sm`}>High-yield accounts, replenish after use, adjust for life changes</p>
                </div>
              </div>
              <div className={`mt-6 p-4 ${theme.backgrounds.glass} border ${theme.borderColors.primary} rounded-lg`}>
                <p className={`text-sm ${theme.textColors.secondary} text-center`}>
                  📅 <strong>Use the Calculator tab&apos;s &quot;Building Plan&quot;</strong> to create your personalized emergency fund timeline with realistic monthly savings targets and milestone tracking.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between">
          <div className="flex space-x-3">
            <button
              onClick={prevLesson}
              disabled={currentLesson === 0}
              className={`group flex items-center px-6 py-3 ${theme.textColors.secondary} border-2 ${theme.borderColors.muted} rounded-xl hover:${theme.borderColors.primary} hover:${theme.textColors.primary} disabled:opacity-50 disabled:cursor-not-allowed transition-all`}
            >
              <ChevronLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
              Previous
            </button>
            <button
              onClick={nextLesson}
              disabled={currentLesson === enhancedLessons.length - 1}
              className={`group flex items-center px-6 py-3 ${theme.textColors.secondary} border-2 ${theme.borderColors.muted} rounded-xl hover:${theme.borderColors.primary} hover:${theme.textColors.primary} disabled:opacity-50 disabled:cursor-not-allowed transition-all`}
            >
              Next
              <ChevronRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          <div className="flex items-center space-x-3">
            {!completedLessons[currentLesson] && (
              <button
                onClick={markComplete}
                className={`group flex items-center px-6 py-3 ${theme.buttons.primary} rounded-xl transition-all shadow-lg hover-lift`}
              >
                <CheckCircle className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
                Mark Complete
              </button>
            )}
            {completedLessons[currentLesson] && (
              <div className={`flex items-center px-6 py-3 ${theme.status.success.bg} ${theme.status.success.text} rounded-xl font-medium`}>
                <CheckCircle className="w-5 h-5 mr-2" />
                Completed
              </div>
            )}
          </div>
        </div>

        {/* Progress Summary */}
        <div className={`mt-6 pt-6 border-t ${theme.borderColors.primary}`}>
          <div className={`flex items-center justify-between text-sm ${theme.textColors.secondary}`}>
            <span>Progress: {completedLessons.filter(Boolean).length} of {enhancedLessons.length} lessons completed</span>
            <span>{progress.toFixed(0)}% Complete</span>
          </div>
          
          {completedLessons.filter(Boolean).length === enhancedLessons.length && (
            <div className={`mt-4 p-4 ${theme.status.success.bg} border ${theme.status.success.border} rounded-lg text-center`}>
              <p className={`font-bold ${theme.status.success.text} flex items-center justify-center gap-2`}>
                <Award className="w-5 h-5" />
                Emergency Fund Mastery Complete! Ready for the calculator and quiz.
              </p>
            </div>
          )}
        </div>
      </GradientCard>
    </div>
  );
}
