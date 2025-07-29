'use client';

import { useState } from 'react';

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
  const [currentLesson, setCurrentLesson] = useState(0);
  const [completedLessons, setCompletedLessons] = useState<boolean[]>(new Array(lessons.length).fill(false));

  const markComplete = () => {
    const newCompleted = [...completedLessons];
    newCompleted[currentLesson] = true;
    setCompletedLessons(newCompleted);
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
    <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg">
      {/* Progress Bar */}
      <div className="bg-gray-200 rounded-t-lg">
        <div 
          className="bg-blue-500 h-2 rounded-t-lg transition-all duration-300"
          style={{ width: `${progress}%` }}
        ></div>
      </div>

      <div className="p-8">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-blue-600">
              Lesson {currentLesson + 1} of {lessons.length}
            </span>
            <span className="text-sm text-gray-500">
              Chapter 1: Money Fundamentals
            </span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900">{lesson.title}</h1>
        </div>

        {/* Content */}
        <div className="mb-8">
          <p className="text-lg text-gray-700 leading-relaxed mb-6">
            {lesson.content}
          </p>

          {/* Key Points */}
          <div className="bg-blue-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-blue-900 mb-4">🎯 Key Points</h3>
            <ul className="space-y-3">
              {lesson.keyPoints.map((point, index) => (
                <li key={index} className="flex items-start">
                  <span className="flex-shrink-0 w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3"></span>
                  <span className="text-blue-800">{point}</span>
                </li>
              ))}
            </ul>
          </div>
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

        {/* Navigation */}
        <div className="flex items-center justify-between">
          <div className="flex space-x-3">
            <button
              onClick={prevLesson}
              disabled={currentLesson === 0}
              className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              ← Previous
            </button>
            <button
              onClick={nextLesson}
              disabled={currentLesson === lessons.length - 1}
              className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next →
            </button>
          </div>

          <div className="flex items-center space-x-3">
            {!completedLessons[currentLesson] && (
              <button
                onClick={markComplete}
                className="px-6 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors"
              >
                Mark Complete ✓
              </button>
            )}
            {completedLessons[currentLesson] && (
              <span className="px-4 py-2 bg-green-100 text-green-800 rounded-md font-medium">
                ✓ Completed
              </span>
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
      </div>
    </div>
  );
}
