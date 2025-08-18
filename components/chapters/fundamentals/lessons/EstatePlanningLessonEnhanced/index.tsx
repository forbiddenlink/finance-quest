'use client';

import { useState, useEffect } from 'react';
import { useProgressStore } from '@/lib/store/progressStore';
import GradientCard from '@/components/shared/ui/GradientCard';
import ProgressRing from '@/components/shared/ui/ProgressRing';
import {
  FileText,
  Scale,
  ChevronRight,
  ChevronLeft,
  AlertCircle
} from 'lucide-react';
import toast from 'react-hot-toast';
import { EstatePlanningLessonProps } from './types';
import { enhancedLessons } from './content';

export default function EstatePlanningLessonEnhanced({ onComplete }: EstatePlanningLessonProps) {
  const { userProgress, completeLesson } = useProgressStore();
  const [currentLesson, setCurrentLesson] = useState(0);
  const [completedLessons, setCompletedLessons] = useState<boolean[]>(new Array(enhancedLessons.length).fill(false));
  const [startTime, setStartTime] = useState<Date>();
  const [lessonStartTime, setLessonStartTime] = useState<Date>(new Date());

  // Initialize start time
  useEffect(() => {
    setStartTime(new Date());
    setLessonStartTime(new Date());
  }, []);

  // Reset lesson start time when changing lessons
  useEffect(() => {
    setLessonStartTime(new Date());
  }, [currentLesson]);

  // Load completed lessons from global state
  useEffect(() => {
    const newCompleted = enhancedLessons.map((_, index) =>
      userProgress.completedLessons.includes(`estate-planning-enhanced-${index}`)
    );
    setCompletedLessons(newCompleted);
  }, [userProgress.completedLessons]);

  const handleLessonComplete = () => {
    const lessonId = `estate-planning-enhanced-${currentLesson}`;
    const timeSpent = Math.round((new Date().getTime() - lessonStartTime.getTime()) / 1000 / 60);
    completeLesson(lessonId, timeSpent);

    const newCompleted = [...completedLessons];
    newCompleted[currentLesson] = true;
    setCompletedLessons(newCompleted);

    toast.success(`${lesson.title} completed! 📚`, {
      duration: 3000,
      position: 'top-center',
    });

    // Check if all lessons are completed
    if (newCompleted.every(completed => completed)) {
      handleAllLessonsComplete();
    }
  };

  const handleAllLessonsComplete = () => {
    if (startTime) {
      const totalTime = Math.round((new Date().getTime() - startTime.getTime()) / 1000 / 60);
      completeLesson('estate-planning-enhanced-lesson', totalTime);
    }
    
    onComplete?.();
    toast.success('Estate Planning mastery achieved! Your legacy is secure! 🏆', {
      duration: 4000,
      position: 'top-center',
    });
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
      {/* Progress Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center">
          <ProgressRing
            progress={progress}
            size={60}
            strokeWidth={6}
            textClassName="text-sm font-semibold"
          />
          <div className="ml-4">
            <h2 className="text-xl font-semibold">Estate Planning Mastery</h2>
            <p className="text-gray-600">
              Lesson {currentLesson + 1} of {enhancedLessons.length}
            </p>
          </div>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={prevLesson}
            disabled={currentLesson === 0}
            className={`p-2 rounded-full ${
              currentLesson === 0 ? 'text-gray-400' : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button
            onClick={nextLesson}
            disabled={currentLesson === enhancedLessons.length - 1}
            className={`p-2 rounded-full ${
              currentLesson === enhancedLessons.length - 1
                ? 'text-gray-400'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="space-y-6">
        {/* Title Card */}
        <GradientCard className="p-6">
          <div className="flex items-center mb-4">
            <lesson.icon className="w-8 h-8 mr-3 text-blue-500" />
            <h3 className="text-2xl font-bold">{lesson.title}</h3>
          </div>
          <p className="text-gray-700 leading-relaxed mb-6">{lesson.content}</p>
          
          {/* Key Points */}
          <div className="mb-6">
            <h4 className="font-semibold mb-2">Key Points:</h4>
            <ul className="list-disc list-inside space-y-2">
              {lesson.keyPoints.map((point, index) => (
                <li key={index} className="text-gray-700">{point}</li>
              ))}
            </ul>
          </div>
        </GradientCard>

        {/* Practical Application */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <GradientCard className="p-6">
            <h4 className="font-semibold mb-2 flex items-center">
              <FileText className="w-5 h-5 mr-2 text-green-500" />
              Practical Action
            </h4>
            <p className="text-gray-700">{lesson.practicalAction}</p>
          </GradientCard>

          <GradientCard className="p-6">
            <h4 className="font-semibold mb-2 flex items-center">
              <Scale className="w-5 h-5 mr-2 text-purple-500" />
              Real Money Example
            </h4>
            <p className="text-gray-700">{lesson.moneyExample}</p>
          </GradientCard>
        </div>

        {/* Warning Tip */}
        {lesson.warningTip && (
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <AlertCircle className="h-5 w-5 text-yellow-400" />
              </div>
              <div className="ml-3">
                <p className="text-sm text-yellow-700">{lesson.warningTip}</p>
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex justify-between items-center mt-8">
          <button
            onClick={prevLesson}
            disabled={currentLesson === 0}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
          >
            Previous
          </button>
          
          <button
            onClick={handleLessonComplete}
            className="px-6 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Complete Lesson
          </button>

          <button
            onClick={nextLesson}
            disabled={currentLesson === enhancedLessons.length - 1}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
