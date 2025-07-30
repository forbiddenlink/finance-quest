'use client';

import { useState, useEffect } from 'react';
import { useProgress, useProgressActions } from '@/lib/context/ProgressContext';
import GradientCard from '@/components/shared/ui/GradientCard';
import ProgressRing from '@/components/shared/ui/ProgressRing';
import TypingEffect from '@/components/shared/ui/TypingEffect';
import { CheckCircle, Star, DollarSign, TrendingUp, BookOpen, ChevronRight, ChevronLeft } from 'lucide-react';
import toast from 'react-hot-toast';

interface LessonContent {
  title: string;
  content: string;
  keyPoints: string[];
}

const lessons: LessonContent[] = [
  {
    title: "What is Income?",
    content: "Income is the money you receive regularly, usually from work. There are different types of income, and understanding them is crucial for managing your finances effectively.",
    keyPoints: [
      "Gross Income: Total money earned before any deductions",
      "Net Income: Money you actually take home after taxes and deductions",
      "Active Income: Money earned from working (salary, wages, tips)",
      "Passive Income: Money earned without active work (investments, rental property)"
    ]
  },
  {
    title: "Understanding Your Paycheck",
    content: "Your paycheck shows much more than just the money you take home. Learning to read it helps you understand where your money goes and plan better.",
    keyPoints: [
      "Gross Pay: Your total earnings before any deductions",
      "Federal & State Taxes: Money taken for government services",
      "FICA Taxes: Social Security (6.2%) and Medicare (1.45%)",
      "Net Pay: What you actually receive in your bank account"
    ]
  },
  {
    title: "Basic Banking Essentials",
    content: "Banks are essential tools for managing your money safely. Understanding different account types helps you choose what's right for your needs.",
    keyPoints: [
      "Checking Account: For daily expenses and bill payments",
      "Savings Account: For storing money and earning small interest",
      "Interest: Money the bank pays you for keeping funds with them",
      "FDIC Insurance: Government protection for your deposits up to $250,000"
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
    toast.success(`✅ "${lesson.title}" completed!`, {
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
              <div className="bg-blue-100 p-2 rounded-lg animate-float">
                <BookOpen className="w-6 h-6 text-blue-600" />
              </div>
              <span className="text-sm font-medium text-blue-600 animate-fade-in-up">
                Lesson {currentLesson + 1} of {lessons.length}
              </span>
            </div>
            <span className="text-sm text-gray-500 animate-fade-in-up stagger-1">
              Chapter 1: Money Fundamentals
            </span>
          </div>

          <h1 className="text-3xl font-bold text-gray-900 mb-4 animate-fade-in-up stagger-2">
            <TypingEffect
              text={lesson.title}
              speed={50}
              className="gradient-text-blue"
            />
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

        {/* Interactive Example */}
        {currentLesson === 1 && (
          <div className="mb-8 p-6 bg-green-50 rounded-lg">
            <h3 className="text-lg font-semibold text-green-900 mb-3">💡 Try It Yourself</h3>
            <p className="text-green-800 mb-4">
              If you earn $4,000 gross pay per month, approximately how much would your net pay be?
            </p>
            <div className="text-green-700">
              <p><strong>Hint:</strong> Most people take home about 75-80% of their gross pay after taxes and deductions.</p>
              <p className="mt-2"><strong>Answer:</strong> Around $3,000-$3,200 (You can use our Paycheck Calculator to get exact numbers!)</p>
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
