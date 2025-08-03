'use client';

import { useState, useEffect } from 'react';
import { useProgressStore } from '@/lib/store/progressStore';
import { theme } from '@/lib/theme';
import GradientCard from '@/components/shared/ui/GradientCard';
import ProgressRing from '@/components/shared/ui/ProgressRing';
import {
  Briefcase,
  TrendingUp,
  DollarSign,
  Users,
  Target,
  CheckCircle,
  Lightbulb,
  Calculator,
  ChevronLeft,
  ChevronRight,
  Star
} from 'lucide-react';
import toast from 'react-hot-toast';

interface IncomeCareerLessonProps {
  onComplete?: () => void;
}

interface LessonContent {
  title: string;
  content: string;
  keyPoints: string[];
}

const lessons: LessonContent[] = [
  {
    title: "Understanding Your Total Compensation Package",
    content: "Your salary is just the foundation of your financial house. Understanding your complete compensation package can reveal hidden value worth $10,000-25,000+ annually that many employees never fully utilize. Smart professionals evaluate total compensation, not just base salary.",
    keyPoints: [
      "Base salary provides stability but benefits often equal 20-40% additional value",
      "Health insurance saves $8,000-15,000/year vs individual market rates",
      "Employer 401k matching is literally free money - maximize it immediately",
      "Paid time off has monetary value: 15 days = $3,500+ for $60k salary",
      "Total compensation evaluation prevents leaving money on the table"
    ]
  },
  {
    title: "Mastering Salary Negotiation Like a Pro",
    content: "A single successful salary negotiation can increase your lifetime earnings by over $1 million due to compound growth of higher salaries. Yet 68% of people never negotiate. This is the most valuable conversation you'll ever have - here's how to win it.",
    keyPoints: [
      "Research market rates using Glassdoor, PayScale, LinkedIn - knowledge is power",
      "Document quantifiable achievements: '23% sales increase' beats 'good at sales'",
      "Ask for 10-20% above target salary to leave negotiation room",
      "Negotiate total package if salary is fixed: PTO, flexible work, development budget",
      "Practice your pitch out loud - confidence sells better than desperation"
    ]
  },
  {
    title: "Building Multiple Income Streams for Financial Security",
    content: "The average millionaire has 7 income streams. Relying on a single job for 100% of income is like driving without insurance - risky and unnecessary. Building diverse income sources creates security, accelerates wealth building, and provides options during economic uncertainty.",
    keyPoints: [
      "Skill-based side hustles: $500-2,000/month from freelancing existing expertise",
      "Digital products create passive income: create once, sell repeatedly forever",
      "Investment income grows automatically: 4-8% annual returns while you sleep",
      "Service businesses scale earning potential beyond hourly trading",
      "Start with one additional stream, then systematically add more over time"
    ]
  }
];

export default function IncomeCareerLesson({ onComplete }: IncomeCareerLessonProps) {
  const { userProgress, completeLesson } = useProgressStore();
  const [currentLesson, setCurrentLesson] = useState(0);
  const [completedLessons, setCompletedLessons] = useState<boolean[]>(new Array(lessons.length).fill(false));

  // Load completed lessons from global state
  useEffect(() => {
    const newCompleted = lessons.map((lesson, index) =>
      userProgress.completedLessons.includes(`income-career-${index}`)
    );
    setCompletedLessons(newCompleted);
  }, [userProgress.completedLessons]);

  const markComplete = () => {
    const lessonId = `income-career-${currentLesson}`;
    completeLesson(lessonId, 15);

    const newCompleted = [...completedLessons];
    newCompleted[currentLesson] = true;
    setCompletedLessons(newCompleted);

    // Show success toast
    toast.success(`"${lesson.title}" completed!`, {
      duration: 3000,
      position: 'top-center',
    });

    // Call parent completion callback when all lessons are done
    if (currentLesson === lessons.length - 1) {
      onComplete?.();
    }
  };

  const nextLesson = () => {
    if (currentLesson < lessons.length - 1) {
      setCurrentLesson(currentLesson + 1);
    }
  };

  const prevLesson = () => {
    if (currentLesson > 0) {
      setCurrentLesson(currentLesson - 1);
    }
  };

  const lesson = lessons[currentLesson];
  const progress = ((currentLesson + 1) / lessons.length) * 100;

  return (
    <div className="max-w-4xl mx-auto">
      {/* Enhanced Progress Ring */}
      <div className="flex justify-center mb-6">
        <ProgressRing
          progress={progress}
          size={100}
          color="#22c55e"
          className="animate-bounce-in"
        />
      </div>

      <GradientCard variant="glass" gradient="green" className="p-8">
        {/* Header with Icons */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className={`${theme.status.success.bg} p-2 rounded-lg animate-float`}>
                <Briefcase className={`w-6 h-6 ${theme.status.success.text}`} />
              </div>
              <span className={`text-sm font-medium ${theme.status.success.text} animate-fade-in-up`}>
                Lesson {currentLesson + 1} of {lessons.length}
              </span>
            </div>
            <span className={`text-sm ${theme.textColors.muted} animate-fade-in-up stagger-1`}>
              Chapter 3: Income & Career Finance
            </span>
          </div>

          <h1 className={`text-3xl font-bold ${theme.textColors.primary} mb-4 animate-fade-in-up stagger-2 gradient-text-green`}>
            {lesson.title}
          </h1>
        </div>

        {/* Content with Enhanced Styling */}
        <div className="mb-8">
          <p className={`text-lg ${theme.textColors.secondary} leading-relaxed mb-6 animate-fade-in-up stagger-3`}>
            {lesson.content}
          </p>

          {/* Enhanced Key Points */}
          <GradientCard variant="glass" gradient="blue" className="p-6 animate-fade-in-up stagger-4">
            <div className="flex items-center mb-4">
              <div className={`${theme.status.info.bg} p-2 rounded-lg mr-3 animate-wiggle`}>
                <Star className={`w-5 h-5 ${theme.status.info.text}`} />
              </div>
              <h3 className={`text-lg font-semibold ${theme.textColors.primary}`}>Key Points</h3>
            </div>
            <ul className="space-y-3">
              {lesson.keyPoints.map((point, index) => (
                <li key={index} className={`flex items-start animate-slide-in-right stagger-${(index % 4) + 1}`}>
                  <div className={`flex-shrink-0 w-6 h-6 ${theme.status.info.bg} rounded-full flex items-center justify-center mt-1 mr-3 animate-glow-pulse`}>
                    <CheckCircle className={`w-4 h-4 ${theme.status.info.text}`} />
                  </div>
                  <span className={`${theme.textColors.secondary} font-medium`}>{point}</span>
                </li>
              ))}
            </ul>
          </GradientCard>
        </div>

        {/* Interactive Exercises for Better Retention */}
        {currentLesson === 0 && (
          <div className={`mb-8 p-6 ${theme.backgrounds.card} border ${theme.borderColors.primary} rounded-lg`}>
            <h3 className={`text-lg font-semibold ${theme.textColors.primary} mb-3 flex items-center gap-2`}>
              <Calculator className="w-5 h-5" />
              Total Compensation Assessment
            </h3>
            <div className={`${theme.textColors.secondary} space-y-3`}>
              <p className={`font-medium ${theme.textColors.primary}`}>Calculate your true compensation value:</p>
              <ul className={`list-disc list-inside space-y-2 ml-4 ${theme.textColors.secondary}`}>
                <li>Base salary: $______/year</li>
                <li>Health insurance value: $______/year (check marketplace rates)</li>
                <li>401k match: $______/year (employer contribution)</li>
                <li>PTO value: $______/year (days × daily salary)</li>
                <li>Other benefits: $______/year</li>
              </ul>
              <p className={`mt-4 font-medium ${theme.textColors.primary}`}>
                💡 <strong>Total Package Value:</strong> Often 25-40% higher than base salary!
              </p>
            </div>
          </div>
        )}

        {currentLesson === 1 && (
          <div className={`mb-8 p-6 ${theme.status.warning.bg} rounded-lg border-l-4 ${theme.status.warning.border}`}>
            <h3 className={`text-lg font-semibold ${theme.status.warning.text} mb-3 flex items-center gap-2`}>
              <Target className="w-5 h-5" />
              Salary Negotiation Preparation Checklist
            </h3>
            <div className={`${theme.textColors.secondary} space-y-4`}>
              <div className={`${theme.backgrounds.card} border ${theme.borderColors.primary} p-4 rounded-lg`}>
                <p className={`font-medium ${theme.textColors.primary} mb-2`}>Before the Conversation:</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className={`font-medium ${theme.status.success.text} mb-2`}>✅ Research Completed:</p>
                    <ul className={`list-disc list-inside space-y-1 ml-4 ${theme.textColors.secondary} text-sm`}>
                      <li>Market salary range identified</li>
                      <li>Achievement list documented</li>
                      <li>Value proposition written</li>
                      <li>Pitch practiced 3+ times</li>
                    </ul>
                  </div>
                  <div>
                    <p className={`font-medium ${theme.status.info.text} mb-2`}>🎯 Target Numbers:</p>
                    <ul className={`list-disc list-inside space-y-1 ml-4 ${theme.textColors.secondary} text-sm`}>
                      <li>Current salary: $______</li>
                      <li>Market rate: $______</li>
                      <li>Target ask: $______ (+15-20%)</li>
                      <li>Minimum acceptable: $______</li>
                    </ul>
                  </div>
                </div>
              </div>
              <p className={`mt-4 font-medium ${theme.status.warning.text}`}>
                💡 <strong>Remember:</strong> Confidence + preparation = better outcomes!
              </p>
            </div>
          </div>
        )}

        {currentLesson === 2 && (
          <div className={`mb-8 p-6 ${theme.status.info.bg} rounded-lg border-l-4 ${theme.status.info.border}`}>
            <h3 className={`text-lg font-semibold ${theme.status.info.text} mb-3 flex items-center gap-2`}>
              <DollarSign className="w-5 h-5" />
              Income Stream Builder Plan
            </h3>
            <div className={`${theme.textColors.secondary} space-y-4`}>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className={`${theme.backgrounds.card} border ${theme.borderColors.primary} p-4 rounded-lg`}>
                  <h4 className={`font-medium ${theme.textColors.primary} mb-2 flex items-center gap-2`}>
                    <Lightbulb className={`w-4 h-4 ${theme.textColors.primary}`} />
                    Phase 1: Skills
                  </h4>
                  <p className={`text-sm ${theme.textColors.secondary}`}>Freelance your existing expertise for $500-2,000/month</p>
                </div>
                <div className={`${theme.backgrounds.card} border ${theme.borderColors.primary} p-4 rounded-lg`}>
                  <h4 className={`font-medium ${theme.textColors.primary} mb-2 flex items-center gap-2`}>
                    <Target className={`w-4 h-4 ${theme.status.info.text}`} />
                    Phase 2: Digital
                  </h4>
                  <p className={`text-sm ${theme.textColors.secondary}`}>Create digital products for passive income streams</p>
                </div>
                <div className={`${theme.backgrounds.card} border ${theme.borderColors.primary} p-4 rounded-lg`}>
                  <h4 className={`font-medium ${theme.textColors.primary} mb-2 flex items-center gap-2`}>
                    <TrendingUp className={`w-4 h-4 ${theme.status.success.text}`} />
                    Phase 3: Invest
                  </h4>
                  <p className={`text-sm ${theme.textColors.secondary}`}>Build investment portfolio for compound growth</p>
                </div>
                <div className={`${theme.backgrounds.card} border ${theme.borderColors.primary} p-4 rounded-lg`}>
                  <h4 className={`font-medium ${theme.textColors.primary} mb-2 flex items-center gap-2`}>
                    <Users className={`w-4 h-4 ${theme.status.error.text}`} />
                    Phase 4: Scale
                  </h4>
                  <p className={`text-sm ${theme.textColors.secondary}`}>Service business with scalable systems</p>
                </div>
              </div>
              <p className={`mt-4 font-medium ${theme.status.info.text}`}>
                💡 <strong>Start Small:</strong> Focus on one stream until profitable, then systematically add more!
              </p>
            </div>
          </div>
        )}

        {/* Enhanced Navigation */}
        <div className="flex items-center justify-between animate-fade-in-up stagger-4">
          <div className="flex space-x-3">
            <button
              onClick={prevLesson}
              disabled={currentLesson === 0}
              className={`group flex items-center px-6 py-3 ${theme.textColors.secondary} border-2 ${theme.borderColors.muted} rounded-xl hover:${theme.borderColors.primary} hover:${theme.textColors.primary} disabled:opacity-50 disabled:cursor-not-allowed transition-all morph-button`}
            >
              <ChevronLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
              Previous
            </button>
            <button
              onClick={nextLesson}
              disabled={currentLesson === lessons.length - 1}
              className={`group flex items-center px-6 py-3 ${theme.textColors.secondary} border-2 ${theme.borderColors.muted} rounded-xl hover:${theme.borderColors.primary} hover:${theme.textColors.primary} disabled:opacity-50 disabled:cursor-not-allowed transition-all morph-button`}
            >
              Next
              <ChevronRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          <div className="flex items-center space-x-3">
            {!completedLessons[currentLesson] && (
              <button
                onClick={markComplete}
                className={`group flex items-center px-6 py-3 ${theme.buttons.primary} rounded-xl transition-all shadow-lg hover-lift morph-button animate-glow-pulse`}
              >
                <CheckCircle className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
                Mark Complete
              </button>
            )}
            {completedLessons[currentLesson] && (
              <div className={`flex items-center px-6 py-3 ${theme.status.success.bg} ${theme.status.success.text} rounded-xl font-medium animate-bounce-in`}>
                <CheckCircle className="w-5 h-5 mr-2 animate-wiggle" />
                Completed
              </div>
            )}
          </div>
        </div>

        {/* Completion Status */}
        <div className={`mt-6 pt-6 border-t ${theme.borderColors.primary}`}>
          <div className={`flex items-center justify-between text-sm ${theme.textColors.secondary}`}>
            <span>Progress: {completedLessons.filter(Boolean).length} of {lessons.length} lessons completed</span>
            <span>{progress.toFixed(0)}% Complete</span>
          </div>
        </div>
      </GradientCard>
    </div>
  );
}
