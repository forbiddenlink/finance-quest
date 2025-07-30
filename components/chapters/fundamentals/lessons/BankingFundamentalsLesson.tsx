'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Building2, 
  CreditCard, 
  PiggyBank, 
  Shield, 
  DollarSign,
  ArrowRight,
  CheckCircle,
  AlertCircle,
  TrendingUp
} from 'lucide-react';

interface BankingFundamentalsLessonProps {
  onComplete: () => void;
}

const BankingFundamentalsLesson = ({ onComplete }: BankingFundamentalsLessonProps) => {
  const [currentLesson, setCurrentLesson] = useState(0);
  const [lessonProgress, setLessonProgress] = useState<number[]>([]);

  const lessons = [
    {
      id: 'account-types',
      title: 'Understanding Account Types',
      icon: <Building2 className="w-6 h-6" />,
      content: (
        <motion.div 
          className="space-y-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white p-6 rounded-lg">
            <h3 className="text-2xl font-bold mb-4">Your Banking Foundation</h3>
            <p className="text-lg">
              Understanding different account types is like knowing the different tools in a toolbox - 
              each one serves a specific purpose in your financial life.
            </p>
          </div>

          <div className="grid gap-4">
            {[
              {
                type: 'Checking Account',
                icon: <CreditCard className="w-8 h-8 text-blue-500" />,
                purpose: 'Daily transactions and bill payments',
                features: ['Debit card access', 'Check writing', 'Online banking', 'ATM access'],
                bestFor: 'Everyday spending and money management'
              },
              {
                type: 'Savings Account',
                icon: <PiggyBank className="w-8 h-8 text-green-500" />,
                purpose: 'Growing money with interest',
                features: ['Earns interest', 'FDIC insured', 'Limited transactions', 'Emergency fund storage'],
                bestFor: 'Emergency funds and short-term goals'
              },
              {
                type: 'Money Market Account',
                icon: <TrendingUp className="w-8 h-8 text-purple-500" />,
                purpose: 'Higher interest with more flexibility',
                features: ['Higher interest rates', 'Check writing ability', 'Debit card access', 'Higher minimum balance'],
                bestFor: 'Larger emergency funds and medium-term savings'
              }
            ].map((account, index) => (
              <motion.div
                key={account.type}
                className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    {account.icon}
                  </div>
                  <div className="flex-1">
                    <h4 className="text-xl font-semibold text-gray-800 mb-2">{account.type}</h4>
                    <p className="text-gray-600 mb-3">{account.purpose}</p>
                    <div className="mb-3">
                      <h5 className="font-medium text-gray-700 mb-2">Key Features:</h5>
                      <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                        {account.features.map((feature, idx) => (
                          <li key={idx}>{feature}</li>
                        ))}
                      </ul>
                    </div>
                    <div className="text-sm text-blue-600 font-medium">
                      Best for: {account.bestFor}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
            <div className="flex items-center">
              <AlertCircle className="w-5 h-5 text-yellow-400 mr-2" />
              <h4 className="font-semibold text-yellow-800">Pro Tip</h4>
            </div>
            <p className="text-yellow-700 mt-2">
              Most successful savers use a "banking trifecta": one checking account for daily expenses, 
              one high-yield savings for emergencies, and one money market or CD for longer-term goals.
            </p>
          </div>
        </motion.div>
      )
    },
    {
      id: 'banking-fees',
      title: 'Avoiding Banking Fees',
      icon: <Shield className="w-6 h-6" />,
      content: (
        <motion.div 
          className="space-y-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="bg-gradient-to-r from-red-500 to-pink-600 text-white p-6 rounded-lg">
            <h3 className="text-2xl font-bold mb-4">The Hidden Fee Trap</h3>
            <p className="text-lg">
              Banking fees can cost the average American $329 per year. Learning to avoid them 
              is like giving yourself an instant pay raise!
            </p>
          </div>

          <div className="grid gap-4">
            {[
              {
                fee: 'Monthly Maintenance',
                cost: '$10-15/month',
                howToAvoid: 'Maintain minimum balance or direct deposit',
                impact: '$120-180/year saved'
              },
              {
                fee: 'Overdraft Fees',
                cost: '$35 per incident',
                howToAvoid: 'Set up overdraft protection or alerts',
                impact: 'Average person pays $245/year'
              },
              {
                fee: 'ATM Fees',
                cost: '$3-5 per transaction',
                howToAvoid: 'Use in-network ATMs or get fee reimbursement',
                impact: '$50-100/year saved'
              },
              {
                fee: 'Minimum Balance',
                cost: '$25/month',
                howToAvoid: 'Choose account with low/no minimum',
                impact: '$300/year saved'
              }
            ].map((feeInfo, index) => (
              <motion.div
                key={feeInfo.fee}
                className="bg-white border border-gray-200 rounded-lg p-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-semibold text-gray-800">{feeInfo.fee}</h4>
                  <span className="text-red-600 font-bold">{feeInfo.cost}</span>
                </div>
                <p className="text-gray-600 mb-2">{feeInfo.howToAvoid}</p>
                <div className="text-green-600 font-medium text-sm">
                  💰 {feeInfo.impact}
                </div>
              </motion.div>
            ))}
          </div>

          <div className="bg-green-50 border-l-4 border-green-400 p-4">
            <div className="flex items-center">
              <CheckCircle className="w-5 h-5 text-green-400 mr-2" />
              <h4 className="font-semibold text-green-800">Smart Banking Strategy</h4>
            </div>
            <p className="text-green-700 mt-2">
              Choose online banks or credit unions for higher interest rates and lower fees. 
              Many offer fee-free accounts with better customer service than traditional banks.
            </p>
          </div>
        </motion.div>
      )
    },
    {
      id: 'account-optimization',
      title: 'Optimizing Your Banking Setup',
      icon: <DollarSign className="w-6 h-6" />,
      content: (
        <motion.div 
          className="space-y-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="bg-gradient-to-r from-green-500 to-blue-600 text-white p-6 rounded-lg">
            <h3 className="text-2xl font-bold mb-4">Maximize Your Banking Power</h3>
            <p className="text-lg">
              With the right setup, your bank accounts work harder for you, earning more while 
              costing less. Let's build your optimized banking foundation.
            </p>
          </div>

          <div className="space-y-4">
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h4 className="text-xl font-semibold mb-4 text-gray-800">The Optimal Banking Setup</h4>
              
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-blue-600 font-bold">1</span>
                  </div>
                  <div>
                    <h5 className="font-semibold text-gray-800">Primary Checking (Local Credit Union)</h5>
                    <p className="text-gray-600">For daily expenses, ATM access, and in-person banking needs</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-green-600 font-bold">2</span>
                  </div>
                  <div>
                    <h5 className="font-semibold text-gray-800">High-Yield Savings (Online Bank)</h5>
                    <p className="text-gray-600">For emergency fund - earning 4-5% APY vs 0.01% traditional banks</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-purple-600 font-bold">3</span>
                  </div>
                  <div>
                    <h5 className="font-semibold text-gray-800">Goal-Specific Accounts</h5>
                    <p className="text-gray-600">Separate savings for vacation, car, home down payment, etc.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h4 className="text-xl font-semibold mb-4 text-gray-800">Automation Setup</h4>
              
              <div className="space-y-3">
                {[
                  'Direct deposit: 70% checking, 20% savings, 10% investment',
                  'Automatic emergency fund transfer: $100-500/month',
                  'Bill pay automation for fixed expenses',
                  'Alert systems for low balances and unusual activity'
                ].map((tip, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                    <span className="text-gray-700">{tip}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-blue-50 border-l-4 border-blue-400 p-4">
            <div className="flex items-center">
              <TrendingUp className="w-5 h-5 text-blue-400 mr-2" />
              <h4 className="font-semibold text-blue-800">Real Impact</h4>
            </div>
            <p className="text-blue-700 mt-2">
              Moving a $10,000 emergency fund from a 0.01% traditional savings to a 4.5% high-yield 
              savings account earns you an extra $449 per year - just for making one smart choice!
            </p>
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
      // Mark entire lesson as complete
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
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white p-6">
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
          className="px-4 py-2 text-gray-600 hover:text-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Previous
        </button>

        <div className="flex space-x-2">
          {lessons.map((_, index) => (
            <div
              key={index}
              className={`w-3 h-3 rounded-full transition-colors ${
                index === currentLesson
                  ? 'bg-blue-500'
                  : index < currentLesson
                  ? 'bg-green-500'
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
          className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center"
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

export default BankingFundamentalsLesson;
