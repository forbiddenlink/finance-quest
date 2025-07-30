'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Briefcase,
  TrendingUp,
  DollarSign,
  Users,
  Target,
  ArrowRight,
  CheckCircle,
  AlertCircle,
  Lightbulb,
  Award,
  FileText,
  Calculator
} from 'lucide-react';

interface IncomeCareerLessonProps {
  onComplete: () => void;
}

const IncomeCareerLesson = ({ onComplete }: IncomeCareerLessonProps) => {
  const [currentLesson, setCurrentLesson] = useState(0);
  const [lessonProgress, setLessonProgress] = useState<number[]>([]);

  const lessons = [
    {
      id: 'understanding-income',
      title: 'Understanding Your Total Compensation',
      icon: <FileText className="w-6 h-6" />,
      content: (
        <motion.div
          className="space-y-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="bg-gradient-to-r from-green-500 to-blue-600 text-white p-6 rounded-lg">
            <h3 className="text-2xl font-bold mb-4">Beyond Your Paycheck</h3>
            <p className="text-lg">
              Your salary is just the beginning. Understanding your total compensation
              package can reveal hidden value worth thousands of dollars annually.
            </p>
          </div>

          <div className="grid gap-4">
            {[
              {
                component: 'Base Salary',
                description: 'Your fixed annual or hourly wage',
                valueExample: '$60,000/year',
                tips: ['Negotiable', 'Forms tax base', 'Core income stream'],
                impact: 'Primary financial foundation'
              },
              {
                component: 'Health Benefits',
                description: 'Medical, dental, vision insurance',
                valueExample: '$8,000-15,000/year value',
                tips: ['Compare premium costs', 'Consider deductibles', 'Family coverage options'],
                impact: 'Major expense protection'
              },
              {
                component: 'Retirement Matching',
                description: 'Employer 401k/403b contributions',
                valueExample: '3-6% salary match = $1,800-3,600',
                tips: ['Always maximize match', 'Free money', 'Compound growth'],
                impact: 'Long-term wealth building'
              },
              {
                component: 'Paid Time Off',
                description: 'Vacation, sick days, holidays',
                valueExample: '15 days = $3,500 value',
                tips: ['Factor into hourly rate', 'Work-life balance', 'Mental health'],
                impact: 'Quality of life enhancement'
              },
              {
                component: 'Bonuses & Incentives',
                description: 'Performance, signing, retention bonuses',
                valueExample: '10-25% of base salary',
                tips: ['Understand criteria', 'Budget conservatively', 'Performance-based'],
                impact: 'Income acceleration opportunity'
              }
            ].map((comp, index) => (
              <motion.div
                key={comp.component}
                className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="flex items-start justify-between mb-3">
                  <h4 className="text-xl font-semibold text-gray-800">{comp.component}</h4>
                  <span className="text-green-600 font-bold text-sm bg-green-100 px-2 py-1 rounded">
                    {comp.valueExample}
                  </span>
                </div>
                <p className="text-gray-600 mb-3">{comp.description}</p>
                <div className="mb-3">
                  <h5 className="font-medium text-gray-700 mb-2">Key Considerations:</h5>
                  <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                    {comp.tips.map((tip, idx) => (
                      <li key={idx}>{tip}</li>
                    ))}
                  </ul>
                </div>
                <div className="text-sm text-blue-600 font-medium">
                  💡 Impact: {comp.impact}
                </div>
              </motion.div>
            ))}
          </div>

          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
            <div className="flex items-center">
              <Calculator className="w-5 h-5 text-yellow-400 mr-2" />
              <h4 className="font-semibold text-yellow-800">Total Compensation Calculator</h4>
            </div>
            <p className="text-yellow-700 mt-2">
              A $60,000 salary with full benefits, 401k match, and PTO can have a total value
              of $75,000-85,000. Always evaluate job offers on total compensation, not just salary!
            </p>
          </div>
        </motion.div>
      )
    },
    {
      id: 'salary-negotiation',
      title: 'Mastering Salary Negotiation',
      icon: <TrendingUp className="w-6 h-6" />,
      content: (
        <motion.div
          className="space-y-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-6 rounded-lg">
            <h3 className="text-2xl font-bold mb-4">The $1 Million Conversation</h3>
            <p className="text-lg">
              A successful salary negotiation can increase your lifetime earnings by over
              $1 million. Yet 68% of people never negotiate their salary. Don&apos;t be one of them.
            </p>
          </div>

          <div className="space-y-4">
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h4 className="text-xl font-semibold mb-4 text-gray-800 flex items-center">
                <Target className="w-5 h-5 mr-2 text-blue-500" />
                The Negotiation Framework
              </h4>

              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-blue-600 font-bold">1</span>
                  </div>
                  <div>
                    <h5 className="font-semibold text-gray-800">Research Market Rates</h5>
                    <p className="text-gray-600 text-sm">Use Glassdoor, PayScale, LinkedIn Salary Insights. Know your worth in your market.</p>
                    <div className="text-xs text-green-600 mt-1">💰 This step alone can justify 5-15% increases</div>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-green-600 font-bold">2</span>
                  </div>
                  <div>
                    <h5 className="font-semibold text-gray-800">Document Your Value</h5>
                    <p className="text-gray-600 text-sm">Quantify achievements: &quot;Increased sales by 23%&quot; not &quot;good at sales&quot;</p>
                    <div className="text-xs text-green-600 mt-1">📈 Specific metrics justify higher compensation</div>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-purple-600 font-bold">3</span>
                  </div>
                  <div>
                    <h5 className="font-semibold text-gray-800">Ask for 10-20% Above Target</h5>
                    <p className="text-gray-600 text-sm">Negotiate down from your high anchor. Leave room for compromise.</p>
                    <div className="text-xs text-green-600 mt-1">🎯 High anchors lead to better final outcomes</div>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-orange-600 font-bold">4</span>
                  </div>
                  <div>
                    <h5 className="font-semibold text-gray-800">Negotiate Total Package</h5>
                    <p className="text-gray-600 text-sm">If salary is fixed, negotiate PTO, flexible work, professional development, title</p>
                    <div className="text-xs text-green-600 mt-1">🔄 Multiple paths to increased value</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h5 className="font-semibold text-green-800 mb-2 flex items-center">
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Do This
                </h5>
                <ul className="text-sm text-green-700 space-y-1">
                  <li>• Practice your pitch out loud</li>
                  <li>• Schedule when boss isn&apos;t stressed</li>
                  <li>• Focus on future value you&apos;ll bring</li>
                  <li>• Be specific about dollar amounts</li>
                  <li>• Express enthusiasm for the role</li>
                </ul>
              </div>

              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <h5 className="font-semibold text-red-800 mb-2 flex items-center">
                  <AlertCircle className="w-4 h-4 mr-2" />
                  Avoid This
                </h5>
                <ul className="text-sm text-red-700 space-y-1">
                  <li>• Comparing yourself to coworkers</li>
                  <li>• Mentioning personal financial needs</li>
                  <li>• Negotiating over email initially</li>
                  <li>• Being demanding or threatening</li>
                  <li>• Accepting the first &quot;no&quot; as final</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 border-l-4 border-blue-400 p-4">
            <div className="flex items-center">
              <Award className="w-5 h-5 text-blue-400 mr-2" />
              <h4 className="font-semibold text-blue-800">Success Story</h4>
            </div>
            <p className="text-blue-700 mt-2">
              &quot;I researched my role and found I was 18% below market rate. I prepared a one-page
              document showing my achievements and asked for a 25% increase during my review.
              I got 20% immediately and a promise for the remaining 5% in six months.&quot; - Sarah, Marketing Manager
            </p>
          </div>
        </motion.div>
      )
    },
    {
      id: 'income-streams',
      title: 'Building Multiple Income Streams',
      icon: <DollarSign className="w-6 h-6" />,
      content: (
        <motion.div
          className="space-y-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="bg-gradient-to-r from-purple-500 to-pink-600 text-white p-6 rounded-lg">
            <h3 className="text-2xl font-bold mb-4">Financial Security Through Diversification</h3>
            <p className="text-lg">
              The average millionaire has 7 income streams. Building multiple income sources
              creates financial security and accelerates wealth building.
            </p>
          </div>

          <div className="space-y-4">
            {[
              {
                type: 'Skill-Based Side Hustle',
                icon: <Lightbulb className="w-8 h-8 text-yellow-500" />,
                timeCommitment: '5-15 hours/week',
                income: '$500-2,000/month',
                examples: ['Freelance writing', 'Graphic design', 'Web development', 'Tutoring', 'Photography'],
                startupCost: 'Low ($0-500)',
                difficulty: 'Medium',
                description: 'Monetize existing skills or develop new ones'
              },
              {
                type: 'Digital Products',
                icon: <Target className="w-8 h-8 text-blue-500" />,
                timeCommitment: '10-20 hours upfront',
                income: '$100-5,000/month',
                examples: ['Online courses', 'Ebooks', 'Templates', 'Stock photos', 'Mobile apps'],
                startupCost: 'Very Low ($0-200)',
                difficulty: 'Medium-High',
                description: 'Create once, sell repeatedly with passive income potential'
              },
              {
                type: 'Investment Income',
                icon: <TrendingUp className="w-8 h-8 text-green-500" />,
                timeCommitment: '1-2 hours/month',
                income: '4-8% annual returns',
                examples: ['Dividend stocks', 'REITs', 'Index funds', 'Bonds', 'Crypto (small %)'],
                startupCost: 'Medium ($1,000+)',
                difficulty: 'Low-Medium',
                description: 'Money working for you while you sleep'
              },
              {
                type: 'Service Business',
                icon: <Users className="w-8 h-8 text-purple-500" />,
                timeCommitment: '10-40 hours/week',
                income: '$1,000-10,000/month',
                examples: ['Consulting', 'Coaching', 'Local services', 'Virtual assistant', 'Bookkeeping'],
                startupCost: 'Low-Medium ($200-2,000)',
                difficulty: 'Medium-High',
                description: 'Leverage expertise to help others solve problems'
              }
            ].map((stream, index) => (
              <motion.div
                key={stream.type}
                className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    {stream.icon}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-xl font-semibold text-gray-800">{stream.type}</h4>
                      <span className="text-green-600 font-bold text-sm">
                        {stream.income}
                      </span>
                    </div>
                    <p className="text-gray-600 mb-3">{stream.description}</p>

                    <div className="grid md:grid-cols-3 gap-4 mb-3">
                      <div>
                        <span className="text-xs font-medium text-gray-500">TIME COMMITMENT</span>
                        <div className="text-sm text-gray-700">{stream.timeCommitment}</div>
                      </div>
                      <div>
                        <span className="text-xs font-medium text-gray-500">STARTUP COST</span>
                        <div className="text-sm text-gray-700">{stream.startupCost}</div>
                      </div>
                      <div>
                        <span className="text-xs font-medium text-gray-500">DIFFICULTY</span>
                        <div className="text-sm text-gray-700">{stream.difficulty}</div>
                      </div>
                    </div>

                    <div>
                      <h5 className="font-medium text-gray-700 mb-2">Popular Examples:</h5>
                      <div className="flex flex-wrap gap-2">
                        {stream.examples.map((example, idx) => (
                          <span key={idx} className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                            {example}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center">
              <Briefcase className="w-5 h-5 text-green-600 mr-2" />
              <h4 className="font-semibold text-green-800">Your Income Diversification Plan</h4>
            </div>
            <div className="mt-3 space-y-2">
              <p className="text-green-700 font-medium">Phase 1 (0-6 months): Master your primary income</p>
              <p className="text-green-700 font-medium">Phase 2 (6-12 months): Start one skill-based side hustle</p>
              <p className="text-green-700 font-medium">Phase 3 (1-2 years): Build investment income foundation</p>
              <p className="text-green-700 font-medium">Phase 4 (2+ years): Scale successful streams, add new ones</p>
            </div>
          </div>
        </motion.div>
      )
    }
  ];

  const handleLessonComplete = (lessonIndex: number) => {
    if (!lessonProgress.includes(lessonIndex)) {
      setLessonProgress([...lessonProgress, lessonIndex]);
    }

    if (lessonIndex === lessons.length - 1) {
      setTimeout(() => onComplete(), 1000);
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

  const currentLessonData = lessons[currentLesson];

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      {/* Progress Header */}
      <div className="bg-gradient-to-r from-green-600 to-blue-700 text-white p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            {currentLessonData.icon}
            <h2 className="text-2xl font-bold">{currentLessonData.title}</h2>
          </div>
          <div className="text-sm bg-white/20 px-3 py-1 rounded-full">
            {currentLesson + 1} of {lessons.length}
          </div>
        </div>

        <div className="w-full bg-white/20 rounded-full h-2">
          <motion.div
            className="bg-white h-2 rounded-full"
            initial={{ width: '0%' }}
            animate={{ width: `${((currentLesson + 1) / lessons.length) * 100}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
      </div>

      {/* Lesson Content */}
      <div className="p-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentLesson}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            {currentLessonData.content}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation */}
      <div className="bg-gray-50 px-6 py-4 flex justify-between items-center">
        <button
          onClick={prevLesson}
          disabled={currentLesson === 0}
          className="px-4 py-2 text-gray-600 hover:text-green-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Previous
        </button>

        <div className="flex space-x-2">
          {lessons.map((_, index) => (
            <div
              key={index}
              className={`w-3 h-3 rounded-full transition-colors ${index === currentLesson
                ? 'bg-green-500'
                : index < currentLesson
                  ? 'bg-blue-500'
                  : 'bg-gray-300'
                }`}
            />
          ))}
        </div>

        <motion.button
          onClick={() => {
            handleLessonComplete(currentLesson);
            if (currentLesson < lessons.length - 1) {
              nextLesson();
            }
          }}
          className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors flex items-center"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {currentLesson === lessons.length - 1 ? 'Complete Lesson' : 'Next'}
          <ArrowRight className="w-4 h-4 ml-2" />
        </motion.button>
      </div>
    </div>
  );
};

export default IncomeCareerLesson;
