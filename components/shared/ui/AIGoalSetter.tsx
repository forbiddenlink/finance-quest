'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Target,
  Plus,
  Calendar,
  DollarSign,
  TrendingUp,
  Clock,
  Zap,
  Brain,
  Edit3,
  Trash2,
  BookOpen,
  Calculator,
  Trophy,
  AlertCircle,
  Star,
  Sparkles
} from 'lucide-react';
import { theme } from '@/lib/theme';
import { useProgressStore } from '@/lib/store/progressStore';
import InteractiveButton from './InteractiveButton';
import EnhancedProgressBar from './EnhancedProgressBar';
import SuccessAnimation from './SuccessAnimation';

interface FinancialGoal {
  id: string;
  title: string;
  description: string;
  category: 'saving' | 'debt' | 'investment' | 'education' | 'budget';
  targetAmount?: number;
  currentAmount?: number;
  targetDate: Date;
  priority: 'low' | 'medium' | 'high';
  status: 'not_started' | 'in_progress' | 'completed' | 'paused';
  aiSuggestions: string[];
  milestones: Array<{
    id: string;
    title: string;
    targetAmount: number;
    completed: boolean;
    completedDate?: Date;
  }>;
  relatedLessons: string[];
  createdAt: Date;
  updatedAt: Date;
}

interface AIGoalSetterProps {
  className?: string;
}

export default function AIGoalSetter({ className = '' }: AIGoalSetterProps) {
  const { userProgress } = useProgressStore();
  const [goals, setGoals] = useState<FinancialGoal[]>([]);
  const [showCreateGoal, setShowCreateGoal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [showSuccessAnimation, setShowSuccessAnimation] = useState(false);
  const [newGoal, setNewGoal] = useState({
    title: '',
    description: '',
    category: 'saving' as FinancialGoal['category'],
    targetAmount: '',
    targetDate: '',
    priority: 'medium' as FinancialGoal['priority']
  });

  const categories = [
    { id: 'all', label: 'All Goals', icon: Target },
    { id: 'saving', label: 'Savings', icon: DollarSign },
    { id: 'debt', label: 'Debt Payoff', icon: TrendingUp },
    { id: 'investment', label: 'Investment', icon: Sparkles },
    { id: 'education', label: 'Education', icon: BookOpen },
    { id: 'budget', label: 'Budgeting', icon: Calculator },
  ];

  const priorityColors = {
    low: { bg: theme.status.neutral.bg, text: theme.status.neutral.text, border: theme.status.neutral.border },
    medium: { bg: theme.status.warning.bg, text: theme.status.warning.text, border: theme.status.warning.border },
    high: { bg: theme.status.error.bg, text: theme.status.error.text, border: theme.status.error.border },
  };

  const statusColors = {
    not_started: { bg: theme.status.neutral.bg, text: theme.status.neutral.text },
    in_progress: { bg: theme.status.info.bg, text: theme.status.info.text },
    completed: { bg: theme.status.success.bg, text: theme.status.success.text },
    paused: { bg: theme.status.warning.bg, text: theme.status.warning.text },
  };

  // Sample AI suggestions based on user progress
  const generateAISuggestions = (category: FinancialGoal['category']): string[] => {
    const suggestions = {
      saving: [
        "Start with the 50/30/20 rule for optimal budget allocation",
        "Consider a high-yield savings account to maximize returns",
        "Set up automatic transfers to build consistent saving habits",
        "Track your progress weekly to stay motivated"
      ],
      debt: [
        "Use the debt avalanche method to minimize interest payments",
        "Consider debt consolidation if you have multiple high-interest debts",
        "Allocate any extra income toward debt payments",
        "Review and negotiate interest rates with creditors"
      ],
      investment: [
        "Start with low-cost index funds for diversification",
        "Consider dollar-cost averaging for consistent investing",
        "Review your risk tolerance and investment timeline",
        "Take advantage of employer 401(k) matching if available"
      ],
      education: [
        "Complete foundational lessons before advancing to complex topics",
        "Practice with calculators to reinforce theoretical knowledge",
        "Set aside dedicated study time each week",
        "Join study groups or financial literacy communities"
      ],
      budget: [
        "Track expenses for at least one month to understand spending patterns",
        "Use the envelope method for discretionary spending",
        "Review and adjust your budget monthly",
        "Build an emergency fund as your first priority"
      ]
    };
    return suggestions[category] || [];
  };

  // Sample goals for demonstration
  useEffect(() => {
    const sampleGoals: FinancialGoal[] = [
      {
        id: '1',
        title: 'Emergency Fund',
        description: 'Build a 6-month emergency fund for financial security',
        category: 'saving',
        targetAmount: 15000,
        currentAmount: 4500,
        targetDate: new Date('2024-12-31'),
        priority: 'high',
        status: 'in_progress',
        aiSuggestions: generateAISuggestions('saving'),
        milestones: [
          { id: '1a', title: 'First $5,000', targetAmount: 5000, completed: false },
          { id: '1b', title: 'Half Way Point', targetAmount: 7500, completed: false },
          { id: '1c', title: 'Final Goal', targetAmount: 15000, completed: false },
        ],
        relatedLessons: ['chapter1', 'chapter2', 'chapter3'],
        createdAt: new Date('2024-01-15'),
        updatedAt: new Date('2024-08-01'),
      },
      {
        id: '2',
        title: 'Credit Card Debt Payoff',
        description: 'Pay off all credit card debt to improve credit score',
        category: 'debt',
        targetAmount: 8500,
        currentAmount: 2100,
        targetDate: new Date('2024-10-31'),
        priority: 'high',
        status: 'in_progress',
        aiSuggestions: generateAISuggestions('debt'),
        milestones: [
          { id: '2a', title: 'First Card Paid Off', targetAmount: 3000, completed: false },
          { id: '2b', title: 'Second Card Paid Off', targetAmount: 6000, completed: false },
          { id: '2c', title: 'Debt Free!', targetAmount: 8500, completed: false },
        ],
        relatedLessons: ['chapter4', 'chapter5'],
        createdAt: new Date('2024-02-01'),
        updatedAt: new Date('2024-08-01'),
      },
      {
        id: '3',
        title: 'Complete Financial Education',
        description: 'Finish all 17 chapters with 90%+ scores',
        category: 'education',
        priority: 'medium',
        status: 'in_progress',
        targetDate: new Date('2024-11-30'),
        aiSuggestions: generateAISuggestions('education'),
        milestones: [
          { id: '3a', title: 'Basic Concepts (Chapters 1-6)', targetAmount: 6, completed: false },
          { id: '3b', title: 'Intermediate Skills (Chapters 7-12)', targetAmount: 12, completed: false },
          { id: '3c', title: 'Advanced Mastery (Chapters 13-17)', targetAmount: 17, completed: false },
        ],
        relatedLessons: ['chapter1', 'chapter2', 'chapter3', 'chapter4', 'chapter5'],
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-08-01'),
      }
    ];
    setGoals(sampleGoals);
  }, []);

  const handleCreateGoal = () => {
    const goal: FinancialGoal = {
      id: Date.now().toString(),
      title: newGoal.title,
      description: newGoal.description,
      category: newGoal.category,
      targetAmount: newGoal.targetAmount ? parseFloat(newGoal.targetAmount) : undefined,
      currentAmount: 0,
      targetDate: new Date(newGoal.targetDate),
      priority: newGoal.priority,
      status: 'not_started',
      aiSuggestions: generateAISuggestions(newGoal.category),
      milestones: [],
      relatedLessons: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    setGoals(prev => [...prev, goal]);
    setNewGoal({
      title: '',
      description: '',
      category: 'saving',
      targetAmount: '',
      targetDate: '',
      priority: 'medium'
    });
    setShowCreateGoal(false);
    setShowSuccessAnimation(true);
  };

  const getProgress = (goal: FinancialGoal): number => {
    if (goal.category === 'education') {
      // For education goals, calculate based on completed lessons
      const completedLessons = userProgress.completedLessons.length;
      const totalLessons = 17; // Total chapters
      return Math.min((completedLessons / totalLessons) * 100, 100);
    }
    
    if (goal.targetAmount && goal.currentAmount !== undefined) {
      return Math.min((goal.currentAmount / goal.targetAmount) * 100, 100);
    }
    
    return 0;
  };

  const filteredGoals = selectedCategory === 'all' 
    ? goals 
    : goals.filter(goal => goal.category === selectedCategory);

  const GoalCard = ({ goal }: { goal: FinancialGoal }) => {
    const progress = getProgress(goal);
    const isOverdue = new Date() > goal.targetDate && goal.status !== 'completed';
    const daysRemaining = Math.ceil((goal.targetDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));

    return (
      <motion.div
        className={`${theme.utils.glass()} p-3 sm:p-4 lg:p-6 group ${theme.interactive.card}`}
        layout
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        whileHover={{ scale: 1.02 }}
      >
        {/* Header */}
        <div className="flex flex-col gap-2 sm:gap-3 mb-3 sm:mb-4">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1 min-w-0">
              <h3 className={`${theme.textColors.primary} ${theme.typography.heading5} text-base sm:text-lg truncate`}>
                {goal.title}
              </h3>
              <p className={`${theme.textColors.tertiary} ${theme.typography.bodySmall} text-xs mt-0.5 line-clamp-2`}>
                {goal.description}
              </p>
            </div>
            <span className={`flex-shrink-0 px-2 py-0.5 rounded-full text-xs ${priorityColors[goal.priority].bg} ${priorityColors[goal.priority].text}`}>
              {goal.priority.toUpperCase()}
            </span>
          </div>
          
          <div className="flex items-center gap-2">
            <InteractiveButton variant="ghost" size="sm" icon={Edit3} className="text-xs py-1 px-2">Edit</InteractiveButton>
            <InteractiveButton variant="ghost" size="sm" icon={Trash2} className="text-xs py-1 px-2">Delete</InteractiveButton>
          </div>
        </div>

        {/* Progress */}
        <div className="mb-3">
          <div className="flex items-center justify-between mb-1">
            <span className={`${theme.typography.label} ${theme.textColors.secondary} text-xs`}>
              Progress
            </span>
            <span className={`${theme.typography.label} ${theme.textColors.primary} text-xs`}>
              {Math.round(progress)}%
            </span>
          </div>
          <EnhancedProgressBar
            value={progress}
            variant={goal.status === 'completed' ? 'success' : 'default'}
            showPercentage={false}
            animated
          />
        </div>

        {/* Amount Progress (if applicable) */}
        {goal.targetAmount && (
          <div className="mb-3">
            <div className="flex items-center justify-between">
              <span className={`${theme.typography.bodySmall} ${theme.textColors.secondary} text-xs`}>
                ${goal.currentAmount?.toLocaleString()} / ${goal.targetAmount.toLocaleString()}
              </span>
              <span className={`${theme.typography.bodySmall} ${statusColors[goal.status].text} text-xs`}>
                {goal.status.replace('_', ' ').toUpperCase()}
              </span>
            </div>
          </div>
        )}

        {/* Timeline */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-1.5">
            <Calendar className={`w-3.5 h-3.5 ${theme.textColors.muted}`} />
            <span className={`${theme.typography.bodySmall} ${theme.textColors.tertiary} text-xs`}>
              {goal.targetDate.toLocaleDateString()}
            </span>
          </div>
          {daysRemaining > 0 ? (
            <span className={`${theme.typography.bodySmall} ${isOverdue ? theme.status.error.text : theme.textColors.accent} text-xs`}>
              {daysRemaining}d left
            </span>
          ) : (
            <span className={`${theme.typography.bodySmall} ${theme.status.error.text} flex items-center text-xs`}>
              <AlertCircle className="w-3.5 h-3.5 mr-1" />
              Overdue
            </span>
          )}
        </div>

        {/* AI Suggestions */}
        <div className={`${theme.status.info.bg} rounded-lg p-2.5 mb-3`}>
          <div className="flex items-center gap-1.5 mb-1.5">
            <Brain className={`w-3.5 h-3.5 ${theme.status.info.text}`} />
            <span className={`${theme.typography.label} ${theme.status.info.text} text-xs`}>
              AI Recommendations
            </span>
          </div>
          <ul className="space-y-1.5">
            {goal.aiSuggestions.slice(0, 2).map((suggestion, index) => (
              <li key={index} className={`${theme.typography.bodySmall} ${theme.textColors.tertiary} flex items-start text-xs`}>
                <span className="mr-1.5 flex-shrink-0">•</span>
                <span className="flex-1">{suggestion}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-2">
          <InteractiveButton variant="primary" size="sm" fullWidth className="text-xs py-1.5">
            Update Progress
          </InteractiveButton>
          <InteractiveButton variant="ghost" size="sm" icon={BookOpen} fullWidth className="text-xs py-1.5">
            Related Lessons
          </InteractiveButton>
        </div>
      </motion.div>
    );
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 px-4 sm:px-0">
        <div>
          <h2 className={`${theme.textColors.primary} ${theme.typography.heading2} mb-2 flex items-center text-xl sm:text-2xl md:text-3xl`}>
            <Target className="w-6 h-6 sm:w-8 sm:h-8 mr-2 sm:mr-3 text-amber-400" />
            AI-Powered Goal Setting
          </h2>
          <p className={`${theme.textColors.tertiary} text-sm sm:text-base`}>
            Set smart financial goals with AI-powered recommendations and tracking
          </p>
        </div>
        
        <InteractiveButton
          variant="primary"
          icon={Plus}
          onClick={() => setShowCreateGoal(true)}
          withGlow
          className="w-full sm:w-auto"
        >
          Create Goal
        </InteractiveButton>
      </div>

      {/* Goal Statistics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 px-4 sm:px-0">
        <motion.div
          className={`${theme.utils.glass()} p-3 sm:p-4 text-center`}
          whileHover={{ scale: 1.02 }}
        >
          <Trophy className={`w-5 h-5 sm:w-6 sm:h-6 lg:w-8 lg:h-8 ${theme.status.success.text} mx-auto mb-1 sm:mb-2`} />
          <div className={`${theme.typography.heading4} ${theme.textColors.primary} text-base sm:text-lg lg:text-xl`}>
            {goals.filter(g => g.status === 'completed').length}
          </div>
          <div className={`${theme.typography.bodySmall} ${theme.textColors.tertiary} text-xs`}>
            Completed
          </div>
        </motion.div>
        
        <motion.div
          className={`${theme.utils.glass()} p-3 sm:p-4 text-center`}
          whileHover={{ scale: 1.02 }}
        >
          <Zap className={`w-5 h-5 sm:w-6 sm:h-6 lg:w-8 lg:h-8 ${theme.status.info.text} mx-auto mb-1 sm:mb-2`} />
          <div className={`${theme.typography.heading4} ${theme.textColors.primary} text-base sm:text-lg lg:text-xl`}>
            {goals.filter(g => g.status === 'in_progress').length}
          </div>
          <div className={`${theme.typography.bodySmall} ${theme.textColors.tertiary} text-xs`}>
            In Progress
          </div>
        </motion.div>
        
        <motion.div
          className={`${theme.utils.glass()} p-3 sm:p-4 text-center`}
          whileHover={{ scale: 1.02 }}
        >
          <Clock className={`w-5 h-5 sm:w-6 sm:h-6 lg:w-8 lg:h-8 ${theme.status.warning.text} mx-auto mb-1 sm:mb-2`} />
          <div className={`${theme.typography.heading4} ${theme.textColors.primary} text-base sm:text-lg lg:text-xl`}>
            {goals.filter(g => new Date() > g.targetDate && g.status !== 'completed').length}
          </div>
          <div className={`${theme.typography.bodySmall} ${theme.textColors.tertiary} text-xs`}>
            Overdue
          </div>
        </motion.div>
        
        <motion.div
          className={`${theme.utils.glass()} p-3 sm:p-4 text-center`}
          whileHover={{ scale: 1.02 }}
        >
          <Star className={`w-5 h-5 sm:w-6 sm:h-6 lg:w-8 lg:h-8 ${theme.status.warning.text} mx-auto mb-1 sm:mb-2`} />
          <div className={`${theme.typography.heading4} ${theme.textColors.primary} text-base sm:text-lg lg:text-xl`}>
            {Math.round(goals.reduce((acc, goal) => acc + getProgress(goal), 0) / goals.length || 0)}%
          </div>
          <div className={`${theme.typography.bodySmall} ${theme.textColors.tertiary} text-xs`}>
            Avg Progress
          </div>
        </motion.div>
      </div>

      {/* Category Filter */}
      <div className="px-4 sm:px-0 -mx-4 sm:mx-0">
        <div className="flex overflow-x-auto pb-2 sm:pb-0 sm:flex-wrap gap-2 px-4 sm:px-0 hide-scrollbar">
          {categories.map(category => {
            const Icon = category.icon;
            const isActive = selectedCategory === category.id;
            
            return (
              <motion.button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                aria-label={`Select ${category.label} category`}
                aria-pressed={isActive}
                className={`flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-4 py-1.5 sm:py-2 rounded-lg font-medium text-xs sm:text-sm whitespace-nowrap transition-all duration-200 ${
                  isActive
                    ? theme.buttons.accent
                    : theme.buttons.ghost
                }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0" />
                <span>{category.label}</span>
              </motion.button>
            );
          })}
        </div>
      </div>

      <style jsx global>{`
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}</style>

      {/* Goals Grid */}
      <motion.div 
        className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-4 sm:gap-6 px-4 sm:px-0"
        layout
      >
        <AnimatePresence mode="popLayout">
          {filteredGoals.map(goal => (
            <GoalCard key={goal.id} goal={goal} />
          ))}
        </AnimatePresence>
      </motion.div>

      {/* Create Goal Modal */}
      <AnimatePresence>
        {showCreateGoal && (
          <motion.div
            className={`fixed inset-0 ${theme.backgrounds.overlay} flex items-center justify-center p-4 z-50`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowCreateGoal(false)}
          >
            <motion.div
              className={`${theme.backgrounds.modal} rounded-xl max-w-md w-full p-6`}
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className={`${theme.textColors.primary} ${theme.typography.heading3} mb-4`}>
                Create New Goal
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className={`block ${theme.typography.label} ${theme.textColors.secondary} mb-1.5 sm:mb-2 text-xs sm:text-sm`}>
                    Goal Title
                  </label>
                  <input
                    type="text"
                    value={newGoal.title}
                    onChange={(e) => setNewGoal(prev => ({ ...prev, title: e.target.value }))}
                    className={`${theme.utils.input()} text-sm sm:text-base py-1.5 sm:py-2`}
                    placeholder="e.g., Build Emergency Fund"
                  />
                </div>
                
                <div>
                  <label className={`block ${theme.typography.label} ${theme.textColors.secondary} mb-1.5 sm:mb-2 text-xs sm:text-sm`}>
                    Description
                  </label>
                  <textarea
                    value={newGoal.description}
                    onChange={(e) => setNewGoal(prev => ({ ...prev, description: e.target.value }))}
                    className={`${theme.utils.input()} min-h-[60px] sm:min-h-[80px] resize-none text-sm sm:text-base py-1.5 sm:py-2`}
                    placeholder="Describe your goal in detail..."
                  />
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <div>
                    <label className={`block ${theme.typography.label} ${theme.textColors.secondary} mb-1.5 sm:mb-2 text-xs sm:text-sm`}>
                      Category
                    </label>
                    <select
                      value={newGoal.category}
                      onChange={(e) => setNewGoal(prev => ({ ...prev, category: e.target.value as FinancialGoal['category'] }))}
                      className={`${theme.utils.input()} text-sm sm:text-base py-1.5 sm:py-2`}
                    >
                      <option value="saving">Savings</option>
                      <option value="debt">Debt Payoff</option>
                      <option value="investment">Investment</option>
                      <option value="education">Education</option>
                      <option value="budget">Budgeting</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className={`block ${theme.typography.label} ${theme.textColors.secondary} mb-1.5 sm:mb-2 text-xs sm:text-sm`}>
                      Priority
                    </label>
                    <select
                      value={newGoal.priority}
                      onChange={(e) => setNewGoal(prev => ({ ...prev, priority: e.target.value as FinancialGoal['priority'] }))}
                      className={`${theme.utils.input()} text-sm sm:text-base py-1.5 sm:py-2`}
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                    </select>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <div>
                    <label className={`block ${theme.typography.label} ${theme.textColors.secondary} mb-1.5 sm:mb-2 text-xs sm:text-sm`}>
                      Target Amount (optional)
                    </label>
                    <input
                      type="number"
                      value={newGoal.targetAmount}
                      onChange={(e) => setNewGoal(prev => ({ ...prev, targetAmount: e.target.value }))}
                      className={`${theme.utils.input()} text-sm sm:text-base py-1.5 sm:py-2`}
                      placeholder="$10,000"
                    />
                  </div>
                  
                  <div>
                    <label className={`block ${theme.typography.label} ${theme.textColors.secondary} mb-1.5 sm:mb-2 text-xs sm:text-sm`}>
                      Target Date
                    </label>
                    <input
                      type="date"
                      value={newGoal.targetDate}
                      onChange={(e) => setNewGoal(prev => ({ ...prev, targetDate: e.target.value }))}
                      className={`${theme.utils.input()} text-sm sm:text-base py-1.5 sm:py-2`}
                    />
                  </div>
                </div>
              </div>
              
              <div className="flex space-x-3 mt-6">
                <InteractiveButton
                  variant="ghost"
                  onClick={() => setShowCreateGoal(false)}
                  fullWidth
                >
                  Cancel
                </InteractiveButton>
                <InteractiveButton
                  variant="primary"
                  onClick={handleCreateGoal}
                  disabled={!newGoal.title || !newGoal.targetDate}
                  fullWidth
                >
                  Create Goal
                </InteractiveButton>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Success Animation */}
      {showSuccessAnimation && (
        <SuccessAnimation
          isVisible={showSuccessAnimation}
          onComplete={() => setShowSuccessAnimation(false)}
          type="milestone"
          title="Goal Created!"
          description="Your new financial goal has been set up with AI recommendations"
        />
      )}
    </div>
  );
}
