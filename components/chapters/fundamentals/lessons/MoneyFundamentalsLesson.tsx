'use client';

import { useState, useEffect } from 'react';
import { useProgress, useProgressActions } from '@/lib/context/ProgressContext';
import GradientCard from '@/components/shared/ui/GradientCard';
import ProgressRing from '@/components/shared/ui/ProgressRing';
import { CheckCircle, Star, DollarSign, TrendingUp, BookOpen, ChevronRight, ChevronLeft, Lightbulb, Brain, Target, Heart } from 'lucide-react';
import toast from 'react-hot-toast';

interface LessonContent {
  title: string;
  content: string;
  keyPoints: string[];
}

const lessons: LessonContent[] = [
  {
    title: "Your Money Story: Understanding Your Financial Past",
    content: "Your relationship with money was shaped before you even earned your first dollar. The messages you received about money in childhood create beliefs that drive your financial decisions today. By understanding your money story, you can identify limiting beliefs and transform them into empowering ones.",
    keyPoints: [
      "Money messages from childhood shape adult financial behavior",
      "Common limiting beliefs: 'Money is the root of all evil', 'Rich people are greedy'",
      "Emotional triggers around money often stem from past experiences",
      "Awareness is the first step to changing destructive money patterns"
    ]
  },
  {
    title: "Scarcity vs Abundance: Rewiring Your Money Mindset",
    content: "Your brain is wired to focus on scarcity - it's a survival mechanism. But in modern finances, scarcity thinking often creates the very problems it tries to avoid. An abundance mindset doesn't mean being reckless; it means making decisions from a place of possibility rather than fear.",
    keyPoints: [
      "Scarcity mindset: 'There's never enough money' - leads to hoarding or panic spending",
      "Abundance mindset: 'There are always opportunities to create value' - leads to strategic thinking",
      "Growth mindset applied to money: Skills and income can be developed over time",
      "Shifting from 'I can't afford it' to 'How can I afford it?' opens new possibilities"
    ]
  },
  {
    title: "Cognitive Biases: The Hidden Forces Affecting Your Money Decisions",
    content: "Your brain uses mental shortcuts (biases) to make quick decisions, but these can sabotage your financial success. Understanding these biases helps you recognize when they're influencing your choices and make more rational financial decisions.",
    keyPoints: [
      "Loss aversion: We feel losses twice as strongly as gains - leads to avoiding good investments",
      "Anchoring bias: Over-relying on first information - affects salary negotiations and purchases",
      "Confirmation bias: Seeking info that confirms existing beliefs - prevents learning",
      "Present bias: Overvaluing immediate rewards - makes saving and investing difficult"
    ]
  },
  {
    title: "Goal Setting Psychology: Turning Dreams into Financial Reality",
    content: "Most financial goals fail not because of lack of money, but because of how they're set. Psychology research shows that the way you frame and structure your goals dramatically impacts your success rate. Learn the science-based approach to financial goal achievement.",
    keyPoints: [
      "SMART goals vs PACT goals: Process and context matter more than just outcomes",
      "Intrinsic motivation (personal values) creates lasting change vs extrinsic (external rewards)",
      "Implementation intentions: 'If X happens, then I will do Y' doubles success rates",
      "Social accountability and progress tracking increase achievement by 65%"
    ]
  }
];

export default function MoneyFundamentalsLesson() {
  const { state } = useProgress();
  const { completeLesson } = useProgressActions();
  const [currentLesson, setCurrentLesson] = useState(0);
  const [completedLessons, setCompletedLessons] = useState<boolean[]>(new Array(lessons.length).fill(false));

  // Load completed lessons from global state
  useEffect(() => {
    const newCompleted = lessons.map((lesson, index) =>
      state.userProgress.completedLessons.includes(`money-fundamentals-${index}`)
    );
    setCompletedLessons(newCompleted);
  }, [state.userProgress.completedLessons]);

  const markComplete = () => {
    const lessonId = `money-fundamentals-${currentLesson}`;
    completeLesson(lessonId);

    const newCompleted = [...completedLessons];
    newCompleted[currentLesson] = true;
    setCompletedLessons(newCompleted);

    // Show success toast
    toast.success(`"${lesson.title}" completed!`, {
      duration: 3000,
      position: 'top-center',
    });
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
          color="#3B82F6"
          className="animate-bounce-in"
        />
      </div>

      <GradientCard variant="glass" gradient="blue" className="p-8">
        {/* Header with Icons */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="bg-purple-100 p-2 rounded-lg animate-float">
                <Brain className="w-6 h-6 text-purple-600" />
              </div>
              <span className="text-sm font-medium text-purple-600 animate-fade-in-up">
                Lesson {currentLesson + 1} of {lessons.length}
              </span>
            </div>
            <span className="text-sm text-gray-500 animate-fade-in-up stagger-1">
              Chapter 1: Money Psychology & Mindset
            </span>
          </div>

          <h1 className="text-3xl font-bold text-gray-900 mb-4 animate-fade-in-up stagger-2 gradient-text-purple">
            {lesson.title}
          </h1>
        </div>

        {/* Content with Enhanced Styling */}
        <div className="mb-8">
          <p className="text-lg text-gray-700 leading-relaxed mb-6 animate-fade-in-up stagger-3">
            {lesson.content}
          </p>

          {/* Enhanced Key Points */}
          <GradientCard variant="glass" gradient="green" className="p-6 animate-fade-in-up stagger-4">
            <div className="flex items-center mb-4">
              <div className="bg-green-100 p-2 rounded-lg mr-3 animate-wiggle">
                <Star className="w-5 h-5 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-green-900">Key Points</h3>
            </div>
            <ul className="space-y-3">
              {lesson.keyPoints.map((point, index) => (
                <li key={index} className={`flex items-start animate-slide-in-right stagger-${(index % 4) + 1}`}>
                  <div className="flex-shrink-0 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center mt-1 mr-3 animate-glow-pulse">
                    <CheckCircle className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-green-800 font-medium">{point}</span>
                </li>
              ))}
            </ul>
          </GradientCard>
        </div>

        {/* Interactive Exercises for Better Retention */}
        {currentLesson === 0 && (
          <div className="mb-8 p-6 bg-purple-50 rounded-lg border-l-4 border-purple-500">
            <h3 className="text-lg font-semibold text-purple-900 mb-3 flex items-center gap-2">
              <Lightbulb className="w-5 h-5" />
              Reflect on Your Money Story
            </h3>
            <div className="text-purple-800 space-y-3">
              <p className="font-medium">Think about these questions (no need to answer out loud):</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>What did your family say about money when you were growing up?</li>
                <li>What was your first memory involving money?</li>
                <li>Do you tend to spend when stressed or save when stressed?</li>
                <li>What financial decision are you most proud of? Most regretful of?</li>
              </ul>
              <p className="mt-4 font-medium text-purple-900">
                💡 <strong>Key Insight:</strong> Most of our money patterns were set by age 7. Recognizing them is the first step to changing them!
              </p>
            </div>
          </div>
        )}

        {currentLesson === 1 && (
          <div className="mb-8 p-6 bg-green-50 rounded-lg border-l-4 border-green-500">
            <h3 className="text-lg font-semibold text-green-900 mb-3 flex items-center gap-2">
              <Lightbulb className="w-5 h-5" />
              Mindset Reframe Exercise
            </h3>
            <div className="text-green-800 space-y-4">
              <div className="bg-white p-4 rounded-lg">
                <p className="font-medium text-red-700 mb-2">❌ Scarcity Thinking:</p>
                <p className="italic">&quot;I can&apos;t afford that $50 course because I need to save money.&quot;</p>
              </div>
              <div className="bg-white p-4 rounded-lg">
                <p className="font-medium text-green-700 mb-2">✅ Abundance Thinking:</p>
                <p className="italic">&quot;How can I create an extra $50 this month to invest in learning a skill that could increase my income?&quot;</p>
              </div>
              <p className="mt-4 font-medium text-green-900">
                💡 <strong>Try This:</strong> For one week, catch yourself saying &quot;I can&apos;t afford it&quot; and reframe it to &quot;How can I afford this if it&apos;s truly important?&quot;
              </p>
            </div>
          </div>
        )}

        {currentLesson === 2 && (
          <div className="mb-8 p-6 bg-orange-50 rounded-lg border-l-4 border-orange-500">
            <h3 className="text-lg font-semibold text-orange-900 mb-3 flex items-center gap-2">
              <Lightbulb className="w-5 h-5" />
              Bias Detection Challenge
            </h3>
            <div className="text-orange-800 space-y-4">
              <p className="font-medium">Scenario: You&apos;re considering buying a $200 jacket that&apos;s &quot;50% off&quot; from $400.</p>
              <div className="bg-white p-4 rounded-lg">
                <p className="font-medium mb-2">Which biases might be at play?</p>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li><strong>Anchoring:</strong> The $400 &quot;original price&quot; makes $200 seem like a deal</li>
                  <li><strong>Loss aversion:</strong> Fear of missing the &quot;50% off&quot; creates urgency</li>
                  <li><strong>Present bias:</strong> Immediate gratification vs long-term savings goals</li>
                </ul>
              </div>
              <p className="mt-4 font-medium text-orange-900">
                💡 <strong>Better Question:</strong> &quot;Would I buy this jacket at $200 if it was never marked higher?&quot;
              </p>
            </div>
          </div>
        )}

        {currentLesson === 3 && (
          <div className="mb-8 p-6 bg-blue-50 rounded-lg border-l-4 border-blue-500">
            <h3 className="text-lg font-semibold text-blue-900 mb-3 flex items-center gap-2">
              <Lightbulb className="w-5 h-5" />
              Goal Setting Practice
            </h3>
            <div className="text-blue-800 space-y-4">
              <div className="bg-white p-4 rounded-lg">
                <p className="font-medium text-red-700 mb-2">❌ Weak Goal:</p>
                <p className="italic">&quot;I want to save more money next year.&quot;</p>
              </div>
              <div className="bg-white p-4 rounded-lg">
                <p className="font-medium text-green-700 mb-2">✅ PACT Goal:</p>
                <p className="italic">&quot;I will automatically transfer $100 to savings every Friday after I get paid, so I can build a $5,000 emergency fund by December. If I&apos;m tempted to skip it, I&apos;ll remember that financial security reduces my stress and lets me sleep better.&quot;</p>
              </div>
              <p className="mt-4 font-medium text-blue-900">
                💡 <strong>PACT Framework:</strong> Purposeful, Actionable, Continuous, Trackable
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
              className="group flex items-center px-6 py-3 text-gray-600 border-2 border-gray-300 rounded-xl hover:border-blue-400 hover:text-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all morph-button"
            >
              <ChevronLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
              Previous
            </button>
            <button
              onClick={nextLesson}
              disabled={currentLesson === lessons.length - 1}
              className="group flex items-center px-6 py-3 text-gray-600 border-2 border-gray-300 rounded-xl hover:border-blue-400 hover:text-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all morph-button"
            >
              Next
              <ChevronRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          <div className="flex items-center space-x-3">
            {!completedLessons[currentLesson] && (
              <button
                onClick={markComplete}
                className="group flex items-center px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl hover:from-green-600 hover:to-emerald-700 transition-all shadow-lg hover-lift morph-button animate-glow-pulse"
              >
                <CheckCircle className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
                Mark Complete
              </button>
            )}
            {completedLessons[currentLesson] && (
              <div className="flex items-center px-6 py-3 bg-green-100 text-green-800 rounded-xl font-medium animate-bounce-in">
                <CheckCircle className="w-5 h-5 mr-2 animate-wiggle" />
                Completed
              </div>
            )}
          </div>
        </div>

        {/* Completion Status */}
        <div className="mt-6 pt-6 border-t border-gray-200">
          <div className="flex items-center justify-between text-sm text-gray-600">
            <span>Progress: {completedLessons.filter(Boolean).length} of {lessons.length} lessons completed</span>
            <span>{progress.toFixed(0)}% Complete</span>
          </div>
        </div>
      </GradientCard>
    </div>
  );
}
