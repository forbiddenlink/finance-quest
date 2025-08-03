'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { CheckCircle, Clock, Calculator, Award } from 'lucide-react';
import { useProgressStore } from '@/lib/store/progressStore';
import { theme } from '@/lib/theme';
import BondCalculator from '@/components/shared/calculators/BondCalculator';
import BondFixedIncomeLessonEnhanced from '@/components/chapters/fundamentals/lessons/BondFixedIncomeLessonEnhanced';
import BondFixedIncomeQuizEnhanced from '@/components/chapters/fundamentals/quizzes/BondFixedIncomeQuizEnhanced';

type TabType = 'lesson' | 'calculator' | 'quiz';

export default function Chapter13() {
  const [currentSection, setCurrentSection] = useState<TabType>('lesson');
  const [lessonCompleted, setLessonCompleted] = useState(false);
  
  const { completeLesson, recordQuizScore } = useProgressStore();
  
  const handleLessonComplete = () => {
    completeLesson('chapter13-bonds-enhanced', 45); // 45 minutes estimated reading time
    setLessonCompleted(true);
  };

  const handleQuizComplete = (score: number, maxScore: number) => {
    recordQuizScore('chapter13-bonds-quiz', score, maxScore);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header */}
      <div className={`${theme.backgrounds.glass} border-b ${theme.borderColors.primary}`}>
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                <Shield className={`w-6 h-6 ${theme.textColors.primary}`} />
              </div>
              <div>
                <h1 className={`${theme.typography.heading2} ${theme.textColors.primary}`}>Chapter 13: Bond & Fixed Income</h1>
                <p className={theme.textColors.secondary}>Master conservative investing and income generation</p>
              </div>
            </div>
            <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
              Investment Track
            </Badge>
          </div>
          
          <div className="mt-6">
            <div className={`flex justify-between text-sm ${theme.textColors.secondary} mb-2`}>
              <span>Chapter Progress</span>
              <span>75% Complete</span>
            </div>
            <Progress value={75} className="w-full" />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        <Tabs value={currentSection} onValueChange={(value) => setCurrentSection(value as TabType)} className="space-y-8">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="lesson" className="flex items-center space-x-2">
              <Clock className="w-4 h-4" />
              <span>Learn</span>
              {lessonCompleted && <CheckCircle className="w-4 h-4 text-green-500" />}
            </TabsTrigger>
            <TabsTrigger value="calculator" className="flex items-center space-x-2">
              <Calculator className="w-4 h-4" />
              <span>Practice</span>
            </TabsTrigger>
            <TabsTrigger value="quiz" className="flex items-center space-x-2">
              <Award className="w-4 h-4" />
              <span>Test Knowledge</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="lesson" className="space-y-8">
            <BondFixedIncomeLessonEnhanced onComplete={handleLessonComplete} />
          </TabsContent>

          <TabsContent value="calculator" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Calculator className="w-5 h-5 text-indigo-600" />
                  <span>Bond Analysis Calculator</span>
                </CardTitle>
                <CardDescription>
                  Calculate bond yields, prices, and analyze investment scenarios
                </CardDescription>
              </CardHeader>
              <CardContent>
                <BondCalculator />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="quiz" className="space-y-6">
            <BondFixedIncomeQuizEnhanced onComplete={handleQuizComplete} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
