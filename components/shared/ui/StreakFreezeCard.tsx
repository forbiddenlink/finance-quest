'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Snowflake, Zap, Shield, AlertTriangle, CheckCircle, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useProgressStore } from '@/lib/store/progressStore';
import { theme } from '@/lib/theme';

const FREEZE_COST = 500; // XP cost per freeze
const MAX_FREEZES = 5;

export function StreakFreezeCard() {
  const [showPurchaseSuccess, setShowPurchaseSuccess] = useState(false);
  const [showUseSuccess, setShowUseSuccess] = useState(false);

  const userProgress = useProgressStore((state) => state.userProgress);
  const purchaseStreakFreeze = useProgressStore((state) => state.purchaseStreakFreeze);
  const useStreakFreeze = useProgressStore((state) => state.useStreakFreeze);

  const canPurchase = userProgress.totalXP >= FREEZE_COST && userProgress.streakFreezesAvailable < MAX_FREEZES;
  const isStreakAtRisk = (() => {
    const today = new Date().toDateString();
    const lastActive = new Date(userProgress.lastActiveDate).toDateString();
    const yesterday = new Date(Date.now() - 86400000).toDateString();
    return lastActive !== today && lastActive !== yesterday && userProgress.streakDays > 0;
  })();

  const handlePurchase = () => {
    const success = purchaseStreakFreeze();
    if (success) {
      setShowPurchaseSuccess(true);
      setTimeout(() => setShowPurchaseSuccess(false), 2000);
    }
  };

  const handleUseFreeze = () => {
    const success = useStreakFreeze();
    if (success) {
      setShowUseSuccess(true);
      setTimeout(() => setShowUseSuccess(false), 3000);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`${theme.backgrounds.card} border ${theme.borderColors.primary} rounded-2xl p-6 relative overflow-hidden`}
    >
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-cyan-500/10 to-blue-500/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2" />

      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-cyan-500/25">
            <Snowflake className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className={`text-lg font-bold ${theme.textColors.primary}`}>Streak Freeze</h3>
            <p className={`text-sm ${theme.textColors.secondary}`}>Protect your learning streak</p>
          </div>
        </div>
        <div className={`px-3 py-1 rounded-full ${theme.backgrounds.glass} border ${theme.borderColors.primary}`}>
          <span className={`text-sm font-semibold ${theme.textColors.primary}`}>
            {userProgress.streakFreezesAvailable}/{MAX_FREEZES}
          </span>
        </div>
      </div>

      {/* Streak Status Alert */}
      <AnimatePresence>
        {isStreakAtRisk && userProgress.streakFreezesAvailable > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-4"
          >
            <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className={`text-sm font-medium ${theme.textColors.primary}`}>
                    Your {userProgress.streakDays}-day streak is at risk!
                  </p>
                  <p className={`text-xs ${theme.textColors.secondary} mt-1`}>
                    Use a freeze to protect it, or complete a lesson today.
                  </p>
                  <Button
                    onClick={handleUseFreeze}
                    className="mt-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white text-sm px-4 py-2 h-auto"
                  >
                    <Shield className="w-4 h-4 mr-2" />
                    Use Streak Freeze
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Success Messages */}
      <AnimatePresence>
        {showPurchaseSuccess && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="absolute inset-0 flex items-center justify-center bg-slate-900/90 backdrop-blur-sm rounded-2xl z-10"
          >
            <div className="text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', damping: 10 }}
              >
                <Sparkles className="w-16 h-16 text-cyan-400 mx-auto mb-3" />
              </motion.div>
              <p className={`text-lg font-bold ${theme.textColors.primary}`}>Freeze Purchased!</p>
              <p className={`text-sm ${theme.textColors.secondary}`}>You now have {userProgress.streakFreezesAvailable} freezes</p>
            </div>
          </motion.div>
        )}

        {showUseSuccess && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="absolute inset-0 flex items-center justify-center bg-slate-900/90 backdrop-blur-sm rounded-2xl z-10"
          >
            <div className="text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', damping: 10 }}
              >
                <CheckCircle className="w-16 h-16 text-emerald-400 mx-auto mb-3" />
              </motion.div>
              <p className={`text-lg font-bold ${theme.textColors.primary}`}>Streak Protected!</p>
              <p className={`text-sm ${theme.textColors.secondary}`}>Your {userProgress.streakDays}-day streak is safe</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Freeze Inventory */}
      <div className="mb-4">
        <div className="flex gap-2 justify-center">
          {Array.from({ length: MAX_FREEZES }).map((_, i) => (
            <motion.div
              key={i}
              initial={false}
              animate={{
                scale: i < userProgress.streakFreezesAvailable ? 1 : 0.8,
                opacity: i < userProgress.streakFreezesAvailable ? 1 : 0.3
              }}
              className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                i < userProgress.streakFreezesAvailable
                  ? 'bg-gradient-to-br from-cyan-500 to-blue-600 shadow-lg shadow-cyan-500/25'
                  : `${theme.backgrounds.glass} border ${theme.borderColors.primary}`
              }`}
            >
              <Snowflake className={`w-5 h-5 ${i < userProgress.streakFreezesAvailable ? 'text-white' : theme.textColors.muted}`} />
            </motion.div>
          ))}
        </div>
      </div>

      {/* Purchase Section */}
      <div className={`p-4 rounded-xl ${theme.backgrounds.glass} border ${theme.borderColors.primary}`}>
        <div className="flex items-center justify-between mb-3">
          <div>
            <p className={`text-sm font-medium ${theme.textColors.primary}`}>Purchase Freeze</p>
            <p className={`text-xs ${theme.textColors.secondary}`}>Protect a future streak</p>
          </div>
          <div className="flex items-center gap-1">
            <Zap className={`w-4 h-4 ${theme.textColors.warning}`} />
            <span className={`text-sm font-bold ${theme.textColors.warning}`}>{FREEZE_COST} XP</span>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className={`text-xs ${theme.textColors.secondary}`}>
            Your XP: <span className={`font-semibold ${theme.textColors.primary}`}>{userProgress.totalXP.toLocaleString()}</span>
          </div>
          <Button
            onClick={handlePurchase}
            disabled={!canPurchase}
            className={`${
              canPurchase
                ? 'bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white'
                : 'bg-slate-700 text-slate-400 cursor-not-allowed'
            } text-sm px-4 py-2 h-auto`}
          >
            <Snowflake className="w-4 h-4 mr-2" />
            {userProgress.streakFreezesAvailable >= MAX_FREEZES ? 'Max Reached' : 'Buy Freeze'}
          </Button>
        </div>

        {userProgress.totalXP < FREEZE_COST && (
          <p className={`text-xs ${theme.textColors.muted} mt-2`}>
            Need {FREEZE_COST - userProgress.totalXP} more XP to purchase
          </p>
        )}
      </div>

      {/* Stats */}
      <div className="mt-4 pt-4 border-t border-white/10">
        <div className="flex justify-between text-xs">
          <span className={theme.textColors.secondary}>Freezes used all-time:</span>
          <span className={theme.textColors.primary}>{userProgress.streakFreezesUsed}</span>
        </div>
        <div className="flex justify-between text-xs mt-1">
          <span className={theme.textColors.secondary}>Current streak:</span>
          <span className={`font-semibold ${theme.textColors.warning}`}>{userProgress.streakDays} days</span>
        </div>
        <div className="flex justify-between text-xs mt-1">
          <span className={theme.textColors.secondary}>Longest streak:</span>
          <span className={theme.textColors.primary}>{userProgress.longestStreak} days</span>
        </div>
      </div>
    </motion.div>
  );
}

export default StreakFreezeCard;
