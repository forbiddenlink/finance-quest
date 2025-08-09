'use client';

import { useState, useCallback } from 'react';
import { DndContext, DragEndEvent, DragOverlay, DragStartEvent, closestCenter, useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { motion, AnimatePresence } from 'framer-motion';
import { theme } from '@/lib/theme';
import { DollarSign, Home, Car, Utensils, Gamepad, HeartHandshake, PiggyBank, RefreshCw, Trophy, Target } from 'lucide-react';
import toast from 'react-hot-toast';

interface BudgetCategory {
  id: string;
  name: string;
  icon: React.ComponentType<{ className?: string }>;
  recommendedPercentage: number;
  currentPercentage: number;
  color: string;
  description: string;
}

interface DraggableItemProps {
  id: string;
  amount: number;
  color: string;
}

interface DroppableZoneProps {
  category: BudgetCategory;
}

const MONTHLY_INCOME = 5000;
const ALLOCATION_AMOUNTS = [250, 500, 750, 1000, 1250];

// Draggable money amount component
function DraggableItem({ id, amount, color }: DraggableItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <motion.div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`
        p-2.5 sm:p-4 rounded-lg border-2 border-dashed ${color} 
        ${isDragging ? 'opacity-50 scale-105' : 'opacity-100'} 
        cursor-grab active:cursor-grabbing touch-none
        ${theme.backgrounds.cardHover} 
        transition-all duration-200
      `}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <div className="flex items-center justify-center gap-1.5 sm:gap-2">
        <DollarSign className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-400" />
        <span className={`font-bold ${theme.textColors.primary} text-sm sm:text-base`}>
          ${amount.toLocaleString()}
        </span>
      </div>
      <p className={`text-[10px] sm:text-xs ${theme.textColors.muted} text-center mt-1`}>
        Drag to allocate
      </p>
    </motion.div>
  );
}

// Droppable category zone
function DroppableZone({ category }: DroppableZoneProps) {
  const { isOver, setNodeRef } = useDroppable({
    id: category.id,
  });

  const IconComponent = category.icon;
  const isOverAllocated = category.currentPercentage > category.recommendedPercentage * 1.2;
  const isUnderAllocated = category.currentPercentage < category.recommendedPercentage * 0.8;
  const isWellAllocated = !isOverAllocated && !isUnderAllocated;

  return (
    <motion.div
      ref={setNodeRef}
      layoutId={category.id}
      className={`
        p-6 rounded-xl border-2 border-dashed 
        ${isOver ? 'border-blue-400 bg-blue-400/20 scale-105' : ''}
        ${isOverAllocated ? 'border-red-500 bg-red-500/10' : 
          isUnderAllocated ? 'border-amber-500 bg-amber-500/10' : 
          'border-emerald-500 bg-emerald-500/10'}
        ${theme.backgrounds.card} 
        transition-all duration-300 min-h-[200px]
      `}
      whileHover={{ scale: 1.02 }}
    >
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <div className={`p-2 rounded-lg ${category.color}`}>
          <IconComponent className="w-6 h-6 text-white" />
        </div>
        <div>
          <h3 className={`font-bold ${theme.textColors.primary}`}>{category.name}</h3>
          <p className={`text-xs ${theme.textColors.muted}`}>{category.description}</p>
        </div>
      </div>

      {/* Current allocation */}
      <div className="mb-4">
        <div className="flex justify-between items-center mb-2">
          <span className={`text-sm ${theme.textColors.secondary}`}>Current:</span>
          <span className={`font-bold ${
            isOverAllocated ? 'text-red-400' : 
            isUnderAllocated ? 'text-amber-400' : 
            'text-emerald-400'
          }`}>
            ${(MONTHLY_INCOME * category.currentPercentage / 100).toLocaleString()} 
            ({category.currentPercentage.toFixed(1)}%)
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className={`text-sm ${theme.textColors.secondary}`}>Recommended:</span>
          <span className={`text-sm ${theme.textColors.muted}`}>
            ${(MONTHLY_INCOME * category.recommendedPercentage / 100).toLocaleString()} 
            ({category.recommendedPercentage}%)
          </span>
        </div>
      </div>

      {/* Progress bar */}
      <div className={`w-full bg-slate-700 rounded-full h-3 mb-4`}>
        <motion.div
          className={`h-3 rounded-full ${
            isOverAllocated ? 'bg-red-500' : 
            isUnderAllocated ? 'bg-amber-500' : 
            'bg-emerald-500'
          }`}
          style={{ width: `${Math.min(category.currentPercentage, 100)}%` }}
          initial={{ width: 0 }}
          animate={{ width: `${Math.min(category.currentPercentage, 100)}%` }}
          transition={{ duration: 0.5 }}
        />
      </div>

      {/* Feedback */}
      <div className="text-center">
        {isWellAllocated && category.currentPercentage > 0 && (
          <div className="flex items-center justify-center gap-2 text-emerald-400">
            <Trophy className="w-4 h-4" />
            <span className="text-sm font-medium">Great allocation!</span>
          </div>
        )}
        {isOverAllocated && (
          <div className="flex items-center justify-center gap-2 text-red-400">
            <Target className="w-4 h-4" />
            <span className="text-sm font-medium">Consider reducing</span>
          </div>
        )}
        {isUnderAllocated && category.currentPercentage === 0 && (
          <div className="flex items-center justify-center gap-2 text-amber-400">
            <Target className="w-4 h-4" />
            <span className="text-sm font-medium">Drag money here</span>
          </div>
        )}
      </div>
    </motion.div>
  );
}

export default function InteractiveBudgetAllocation() {
  const [categories, setCategories] = useState<BudgetCategory[]>([
    {
      id: 'housing',
      name: 'Housing & Utilities',
      icon: Home,
      recommendedPercentage: 30,
      currentPercentage: 0,
      color: 'bg-blue-500',
      description: 'Rent, mortgage, utilities, repairs'
    },
    {
      id: 'transportation',
      name: 'Transportation',
      icon: Car,
      recommendedPercentage: 15,
      currentPercentage: 0,
      color: 'bg-purple-500',
      description: 'Car payment, gas, insurance, maintenance'
    },
    {
      id: 'food',
      name: 'Food & Dining',
      icon: Utensils,
      recommendedPercentage: 12,
      currentPercentage: 0,
      color: 'bg-orange-500',
      description: 'Groceries, restaurants, meal prep'
    },
    {
      id: 'entertainment',
      name: 'Entertainment & Fun',
      icon: Gamepad,
      recommendedPercentage: 8,
      currentPercentage: 0,
      color: 'bg-pink-500',
      description: 'Movies, hobbies, subscriptions, fun'
    },
    {
      id: 'healthcare',
      name: 'Healthcare & Insurance',
      icon: HeartHandshake,
      recommendedPercentage: 10,
      currentPercentage: 0,
      color: 'bg-red-500',
      description: 'Health insurance, medical expenses'
    },
    {
      id: 'savings',
      name: 'Savings & Investments',
      icon: PiggyBank,
      recommendedPercentage: 25,
      currentPercentage: 0,
      color: 'bg-emerald-500',
      description: 'Emergency fund, retirement, investments'
    }
  ]);

  const [availableAmounts, setAvailableAmounts] = useState(ALLOCATION_AMOUNTS);
  const [activeId, setActiveId] = useState<string | null>(null);

  const totalAllocated = categories.reduce((sum, cat) => sum + cat.currentPercentage, 0);
  const remainingBudget = 100 - totalAllocated;

  const handleDragStart = useCallback((event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  }, []);

  const handleDragEnd = useCallback((event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);

    if (!over) return;

    const draggedAmount = parseInt(active.id as string);
    const categoryId = over.id as string;
    const percentageToAdd = (draggedAmount / MONTHLY_INCOME) * 100;

    // Check if we have enough budget remaining
    if (percentageToAdd > remainingBudget + 0.1) { // Small tolerance for rounding
      toast.error(`Not enough budget remaining! You have ${remainingBudget.toFixed(1)}% left.`, {
        duration: 3000,
        position: 'top-center',
      });
      return;
    }

    // Update category allocation
    setCategories(prev => prev.map(cat => 
      cat.id === categoryId 
        ? { ...cat, currentPercentage: cat.currentPercentage + percentageToAdd }
        : cat
    ));

    // Remove amount from available amounts
    setAvailableAmounts(prev => {
      const index = prev.indexOf(draggedAmount);
      if (index > -1) {
        const newAmounts = [...prev];
        newAmounts.splice(index, 1);
        return newAmounts;
      }
      return prev;
    });

    // Provide feedback
    const category = categories.find(cat => cat.id === categoryId);
    if (category) {
      toast.success(`Added $${draggedAmount.toLocaleString()} to ${category.name}!`, {
        duration: 2000,
        position: 'top-center',
      });
    }
  }, [categories, remainingBudget]);

  const resetBudget = () => {
    setCategories(prev => prev.map(cat => ({ ...cat, currentPercentage: 0 })));
    setAvailableAmounts(ALLOCATION_AMOUNTS);
    toast.success('Budget reset! Try allocating again.', {
      duration: 2000,
      position: 'top-center',
    });
  };

  const getOverallScore = () => {
    const scores = categories.map(cat => {
      if (cat.currentPercentage === 0) return 0;
      const diff = Math.abs(cat.currentPercentage - cat.recommendedPercentage);
      const tolerance = cat.recommendedPercentage * 0.2; // 20% tolerance
      return Math.max(0, 100 - (diff / tolerance) * 100);
    });
    return Math.round(scores.reduce((sum, score) => sum + score, 0) / categories.length);
  };

  const overallScore = getOverallScore();

  return (
    <div className={`${theme.backgrounds.card} rounded-xl border ${theme.borderColors.primary} p-6 lg:p-8`}>
      {/* Header */}
      <div className="mb-6">
        <h3 className={`${theme.typography.heading3} ${theme.textColors.primary} mb-2 flex items-center gap-2`}>
          <Target className="w-6 h-6 text-blue-400" />
          Interactive Budget Allocation Game
        </h3>
        <p className={`${theme.textColors.secondary} text-sm mb-4`}>
          Drag money amounts to different budget categories. Try to match the recommended percentages!
        </p>
        
        {/* Budget Summary */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4 p-3 sm:p-4 bg-slate-800/50 rounded-lg">
          <div className="text-center">
            <div className={`text-lg sm:text-xl md:text-2xl font-bold ${theme.textColors.primary}`}>
              ${MONTHLY_INCOME.toLocaleString()}
            </div>
            <p className={`text-[10px] sm:text-xs ${theme.textColors.muted}`}>Monthly Income</p>
          </div>
          <div className="text-center">
            <div className={`text-lg sm:text-xl md:text-2xl font-bold ${
              remainingBudget < 0 ? 'text-red-400' : 
              remainingBudget < 10 ? 'text-amber-400' : 
              'text-emerald-400'
            }`}>
              {remainingBudget.toFixed(1)}%
            </div>
            <p className={`text-[10px] sm:text-xs ${theme.textColors.muted}`}>Budget Remaining</p>
          </div>
          <div className="text-center col-span-2 sm:col-span-1">
            <div className={`text-lg sm:text-xl md:text-2xl font-bold ${
              overallScore >= 80 ? 'text-emerald-400' : 
              overallScore >= 60 ? 'text-amber-400' : 
              'text-red-400'
            }`}>
              {overallScore}%
            </div>
            <p className={`text-[10px] sm:text-xs ${theme.textColors.muted}`}>Allocation Score</p>
          </div>
        </div>
      </div>

      <DndContext
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        {/* Available Money to Allocate */}
        <div className="mb-8">
          <h4 className={`font-semibold ${theme.textColors.primary} mb-4 flex items-center gap-2`}>
            <DollarSign className="w-5 h-5 text-emerald-400" />
            Available Money to Allocate
          </h4>
          
          {availableAmounts.length > 0 ? (
            <SortableContext items={availableAmounts.map(String)} strategy={verticalListSortingStrategy}>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2 sm:gap-3">
                <AnimatePresence>
                  {availableAmounts.map(amount => (
                    <motion.div
                      key={amount}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      transition={{ duration: 0.2 }}
                    >
                      <DraggableItem 
                        id={String(amount)} 
                        amount={amount} 
                        color="border-emerald-500"
                      />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </SortableContext>
          ) : (
            <div className={`text-center py-6 sm:py-8 ${theme.backgrounds.cardHover} rounded-lg border ${theme.borderColors.primary}`}>
              <p className={`${theme.textColors.secondary} text-sm sm:text-base mb-2 sm:mb-3`}>All money allocated!</p>
              <button
                onClick={resetBudget}
                className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 ${theme.buttons.ghost} rounded-lg font-medium transition-all mx-auto text-sm sm:text-base`}
              >
                <RefreshCw className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                Try Again
              </button>
            </div>
          )}
        </div>

        {/* Budget Categories */}
        <div className="mb-6">
          <h4 className={`font-semibold ${theme.textColors.primary} mb-4`}>
            Budget Categories (Drop money here)
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {categories.map(category => (
              <DroppableZone
                key={category.id}
                category={category}
              />
            ))}
          </div>
        </div>

        {/* Score and Feedback */}
        {totalAllocated > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`p-6 rounded-lg ${
              overallScore >= 80 ? theme.status.success.bg : 
              overallScore >= 60 ? theme.status.warning.bg : 
              theme.status.error.bg
            } border ${
              overallScore >= 80 ? theme.status.success.border : 
              overallScore >= 60 ? theme.status.warning.border : 
              theme.status.error.border
            }`}
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-4 mb-3 sm:mb-4">
              <h4 className={`font-bold text-sm sm:text-base ${
                overallScore >= 80 ? theme.status.success.text : 
                overallScore >= 60 ? theme.status.warning.text : 
                theme.status.error.text
              }`}>
                Budget Allocation Results
              </h4>
              <div className="flex items-center gap-1.5 sm:gap-2">
                <Trophy className={`w-4 h-4 sm:w-5 sm:h-5 ${
                  overallScore >= 80 ? theme.status.success.text : 
                  overallScore >= 60 ? theme.status.warning.text : 
                  theme.status.error.text
                }`} />
                <span className={`font-bold text-sm sm:text-base ${
                  overallScore >= 80 ? theme.status.success.text : 
                  overallScore >= 60 ? theme.status.warning.text : 
                  theme.status.error.text
                }`}>
                  {overallScore}% Score
                </span>
              </div>
            </div>
            
            <div className="text-sm space-y-2">
              {overallScore >= 80 && (
                <p className={`${theme.textColors.secondary}`}>
                  🎉 <strong>Excellent!</strong> Your budget allocation closely follows financial best practices. 
                  You&apos;re setting yourself up for financial success!
                </p>
              )}
              {overallScore >= 60 && overallScore < 80 && (
                <p className={`${theme.textColors.secondary}`}>
                  👍 <strong>Good job!</strong> Your budget is on the right track. Consider fine-tuning 
                  a few categories to match recommendations more closely.
                </p>
              )}
              {overallScore < 60 && (
                <p className={`${theme.textColors.secondary}`}>
                  📚 <strong>Learning opportunity!</strong> Try to balance your categories according to 
                  the recommended percentages. Focus on housing (~30%) and savings (~25%) first.
                </p>
              )}
              
              {remainingBudget > 10 && (
                <p className={`${theme.textColors.secondary} mt-2`}>
                  💡 <strong>Tip:</strong> You still have {remainingBudget.toFixed(1)}% unallocated. 
                  Consider adding more to savings or paying down debt.
                </p>
              )}
            </div>
          </motion.div>
        )}

        {/* Reset Button */}
        <div className="flex justify-center mt-6">
          <button
            onClick={resetBudget}
            className={`flex items-center gap-2 px-6 py-3 ${theme.buttons.ghost} rounded-lg font-medium transition-all`}
          >
            <RefreshCw className="w-5 h-5" />
            Reset & Try Again
          </button>
        </div>

        <DragOverlay>
          {activeId ? (
            <DraggableItem 
              id={activeId} 
              amount={parseInt(activeId)} 
              color="border-blue-500"
            />
          ) : null}
        </DragOverlay>
      </DndContext>
    </div>
  );
}
