'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useProgressStore } from '@/lib/store/progressStore';
import { theme } from '@/lib/theme';
import {
    Bell,
    Clock,
    Target,
    TrendingUp,
    AlertTriangle,
    CheckCircle,
    X,
    Settings,
    Calendar,
    Zap,
    Award
} from 'lucide-react';

interface SmartNotification {
    id: string;
    type: 'reminder' | 'achievement' | 'streak_risk' | 'goal_progress' | 'recommendation' | 'milestone';
    priority: 'low' | 'medium' | 'high' | 'urgent';
    title: string;
    message: string;
    actionText?: string;
    actionUrl?: string;
    createdAt: Date;
    expiresAt?: Date;
    dismissed?: boolean;
    persistent?: boolean;
    data?: any;
}

interface NotificationConfig {
    studyReminders: boolean;
    achievementAlerts: boolean;
    streakWarnings: boolean;
    goalUpdates: boolean;
    weeklyReports: boolean;
    preferredTime: 'morning' | 'afternoon' | 'evening';
    quietHours: { start: string; end: string };
}

class SmartNotificationSystem {
    private static instance: SmartNotificationSystem;
    private notifications: SmartNotification[] = [];
    private config: NotificationConfig;
    private listeners: Array<(notifications: SmartNotification[]) => void> = [];

    constructor() {
        this.config = this.loadConfig();
        this.initializeTimers();
    }

    static getInstance(): SmartNotificationSystem {
        if (!SmartNotificationSystem.instance) {
            SmartNotificationSystem.instance = new SmartNotificationSystem();
        }
        return SmartNotificationSystem.instance;
    }

    private loadConfig(): NotificationConfig {
        const stored = localStorage.getItem('notification-config');
        return stored ? JSON.parse(stored) : {
            studyReminders: true,
            achievementAlerts: true,
            streakWarnings: true,
            goalUpdates: true,
            weeklyReports: true,
            preferredTime: 'evening',
            quietHours: { start: '22:00', end: '07:00' }
        };
    }

    private saveConfig(): void {
        localStorage.setItem('notification-config', JSON.stringify(this.config));
    }

    private initializeTimers(): void {
        // Check for notifications every hour
        setInterval(() => {
            this.checkAndGenerateNotifications();
        }, 60 * 60 * 1000);

        // Initial check
        setTimeout(() => {
            this.checkAndGenerateNotifications();
        }, 5000);
    }

    private isQuietTime(): boolean {
        const now = new Date();
        const currentTime = now.getHours() * 100 + now.getMinutes();
        const start = parseInt(this.config.quietHours.start.replace(':', ''));
        const end = parseInt(this.config.quietHours.end.replace(':', ''));

        if (start > end) { // Crosses midnight
            return currentTime >= start || currentTime <= end;
        }
        return currentTime >= start && currentTime <= end;
    }

    checkAndGenerateNotifications(): void {
        if (this.isQuietTime()) return;

        const userProgress = useProgressStore.getState().userProgress;
        const newNotifications: SmartNotification[] = [];

        // Streak risk warning
        if (this.config.streakWarnings && userProgress.streakDays > 0) {
            const lastActive = new Date(userProgress.lastActiveDate);
            const hoursSinceActive = (Date.now() - lastActive.getTime()) / (1000 * 60 * 60);

            if (hoursSinceActive >= 20 && hoursSinceActive < 24) {
                newNotifications.push({
                    id: `streak-risk-${Date.now()}`,
                    type: 'streak_risk',
                    priority: 'high',
                    title: '🔥 Streak at Risk!',
                    message: `Your ${userProgress.streakDays}-day streak expires in ${24 - Math.floor(hoursSinceActive)} hours!`,
                    actionText: 'Save My Streak',
                    actionUrl: '/chapter1',
                    createdAt: new Date(),
                    expiresAt: new Date(Date.now() + 4 * 60 * 60 * 1000) // 4 hours
                });
            }
        }

        // Study reminder
        if (this.config.studyReminders) {
            const now = new Date();
            const preferredHour = this.config.preferredTime === 'morning' ? 9 :
                this.config.preferredTime === 'afternoon' ? 14 : 19;

            if (now.getHours() === preferredHour && now.getMinutes() < 15) {
                const recommendation = useProgressStore.getState().getStudyRecommendation();
                if (recommendation.priority !== 'low') {
                    newNotifications.push({
                        id: `study-reminder-${Date.now()}`,
                        type: 'reminder',
                        priority: 'medium',
                        title: '📚 Time to Learn!',
                        message: recommendation.message,
                        actionText: 'Start Learning',
                        actionUrl: '/chapter1',
                        createdAt: new Date(),
                        expiresAt: new Date(Date.now() + 2 * 60 * 60 * 1000)
                    });
                }
            }
        }

        // Goal progress updates
        if (this.config.goalUpdates) {
            const weeklyProgress = userProgress.weeklyProgress;
            const weeklyGoal = userProgress.weeklyGoal;
            const progressPercent = (weeklyProgress / weeklyGoal) * 100;
            const now = new Date();

            // Friday reminder if behind on weekly goal
            if (now.getDay() === 5 && progressPercent < 80) {
                newNotifications.push({
                    id: `weekly-goal-reminder-${Date.now()}`,
                    type: 'goal_progress',
                    priority: 'medium',
                    title: '🎯 Weekend Goal Push',
                    message: `You're ${weeklyGoal - weeklyProgress} lessons away from your weekly goal!`,
                    actionText: 'Catch Up',
                    actionUrl: '/calculators',
                    createdAt: new Date(),
                    expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000)
                });
            }
        }

        // Achievement celebrations
        if (this.config.achievementAlerts) {
            const totalLessons = userProgress.completedLessons.length;
            const milestones = [5, 10, 25, 50, 100];

            milestones.forEach(milestone => {
                if (totalLessons === milestone) {
                    newNotifications.push({
                        id: `milestone-${milestone}-${Date.now()}`,
                        type: 'achievement',
                        priority: 'high',
                        title: '🏆 Amazing Milestone!',
                        message: `You've completed ${milestone} lessons! You're in the top ${100 - milestone}% of learners!`,
                        actionText: 'View Progress',
                        actionUrl: '/progress',
                        createdAt: new Date(),
                        persistent: true
                    });
                }
            });
        }

        // Add new notifications
        newNotifications.forEach(notification => {
            this.addNotification(notification);
        });
    }

    addNotification(notification: SmartNotification): void {
        // Check for duplicates
        const exists = this.notifications.some(n =>
            n.type === notification.type &&
            n.title === notification.title &&
            !n.dismissed
        );

        if (!exists) {
            this.notifications.unshift(notification);
            this.notifications = this.notifications.slice(0, 20); // Keep only last 20
            this.notifyListeners();
        }
    }

    dismissNotification(id: string): void {
        this.notifications = this.notifications.map(n =>
            n.id === id ? { ...n, dismissed: true } : n
        );
        this.notifyListeners();
    }

    getActiveNotifications(): SmartNotification[] {
        const now = new Date();
        return this.notifications.filter(n =>
            !n.dismissed &&
            (!n.expiresAt || n.expiresAt > now)
        ).sort((a, b) => {
            const priorityOrder = { urgent: 4, high: 3, medium: 2, low: 1 };
            return priorityOrder[b.priority] - priorityOrder[a.priority];
        });
    }

    subscribe(listener: (notifications: SmartNotification[]) => void): void {
        this.listeners.push(listener);
        listener(this.getActiveNotifications());
    }

    unsubscribe(listener: (notifications: SmartNotification[]) => void): void {
        this.listeners = this.listeners.filter(l => l !== listener);
    }

    private notifyListeners(): void {
        const activeNotifications = this.getActiveNotifications();
        this.listeners.forEach(listener => listener(activeNotifications));
    }

    updateConfig(config: Partial<NotificationConfig>): void {
        this.config = { ...this.config, ...config };
        this.saveConfig();
    }

    getConfig(): NotificationConfig {
        return { ...this.config };
    }
}

// React hook for using the notification system
export const useSmartNotifications = () => {
    const [notifications, setNotifications] = useState<SmartNotification[]>([]);
    const [showSettings, setShowSettings] = useState(false);
    const system = SmartNotificationSystem.getInstance();

    useEffect(() => {
        const handleNotifications = (notifs: SmartNotification[]) => {
            setNotifications(notifs);
        };

        system.subscribe(handleNotifications);
        return () => system.unsubscribe(handleNotifications);
    }, [system]);

    return {
        notifications,
        showSettings,
        setShowSettings,
        dismiss: (id: string) => system.dismissNotification(id),
        updateConfig: (config: Partial<NotificationConfig>) => system.updateConfig(config),
        getConfig: () => system.getConfig(),
        hasUrgent: notifications.some(n => n.priority === 'urgent'),
        hasHigh: notifications.some(n => n.priority === 'high'),
        unreadCount: notifications.length
    };
};

// Notification Bell Component
export const NotificationBell: React.FC<{ className?: string }> = ({ className = '' }) => {
    const { notifications, dismiss, hasUrgent, hasHigh, unreadCount } = useSmartNotifications();
    const [showPanel, setShowPanel] = useState(false);

    const getIcon = (type: SmartNotification['type']) => {
        switch (type) {
            case 'achievement': return Award;
            case 'streak_risk': return AlertTriangle;
            case 'goal_progress': return Target;
            case 'recommendation': return TrendingUp;
            case 'reminder': return Clock;
            case 'milestone': return CheckCircle;
            default: return Bell;
        }
    };

    const getPriorityColor = (priority: SmartNotification['priority']) => {
        switch (priority) {
            case 'urgent': return 'text-red-400 bg-red-500/20 border-red-500/40';
            case 'high': return 'text-amber-400 bg-amber-500/20 border-amber-500/40';
            case 'medium': return 'text-blue-400 bg-blue-500/20 border-blue-500/40';
            case 'low': return 'text-slate-400 bg-slate-500/20 border-slate-500/40';
        }
    };

    return (
        <div className={`relative ${className}`}>
            <motion.button
                onClick={() => setShowPanel(!showPanel)}
                className={`relative p-2 ${theme.backgrounds.glass}/20 border ${theme.borderColors.primary} rounded-lg hover:${theme.backgrounds.glass}/30 transition-all duration-200`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
            >
                <Bell className={`w-5 h-5 ${theme.textColors.primary}`} />

                {unreadCount > 0 && (
                    <motion.div
                        className={`absolute -top-1 -right-1 w-5 h-5 ${hasUrgent ? 'bg-red-500' : hasHigh ? 'bg-amber-500' : 'bg-blue-500'
                            } rounded-full flex items-center justify-center`}
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 300 }}
                    >
                        <span className="text-xs font-bold text-white">
                            {unreadCount > 9 ? '9+' : unreadCount}
                        </span>
                    </motion.div>
                )}
            </motion.button>

            <AnimatePresence>
                {showPanel && (
                    <motion.div
                        className={`absolute top-full right-0 mt-2 w-80 ${theme.backgrounds.modal} border ${theme.borderColors.primary} rounded-xl shadow-2xl z-50 max-h-96 overflow-hidden`}
                        initial={{ opacity: 0, y: -10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                    >
                        {/* Header */}
                        <div className={`${theme.backgrounds.cardHover} border-b ${theme.borderColors.primary} p-4 flex items-center justify-between`}>
                            <h3 className={`font-semibold ${theme.textColors.primary}`}>Notifications</h3>
                            <button
                                onClick={() => setShowPanel(false)}
                                className={`p-1 hover:${theme.backgrounds.card} rounded transition-colors`}
                            >
                                <X className={`w-4 h-4 ${theme.textColors.muted}`} />
                            </button>
                        </div>

                        {/* Notifications List */}
                        <div className="max-h-80 overflow-y-auto">
                            {notifications.length === 0 ? (
                                <div className="p-6 text-center">
                                    <Bell className={`w-8 h-8 ${theme.textColors.muted} mx-auto mb-2`} />
                                    <p className={`text-sm ${theme.textColors.muted}`}>No new notifications</p>
                                </div>
                            ) : (
                                <div className="space-y-1 p-2">
                                    {notifications.map((notification) => {
                                        const IconComponent = getIcon(notification.type);
                                        const priorityColor = getPriorityColor(notification.priority);

                                        return (
                                            <motion.div
                                                key={notification.id}
                                                className={`p-3 ${theme.backgrounds.glass}/10 border ${priorityColor.split(' ')[2]} rounded-lg hover:${theme.backgrounds.glass}/20 transition-colors group`}
                                                initial={{ opacity: 0, x: -20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                exit={{ opacity: 0, x: 20 }}
                                            >
                                                <div className="flex items-start space-x-3">
                                                    <div className={`p-1.5 ${priorityColor} rounded-lg flex-shrink-0`}>
                                                        <IconComponent className="w-4 h-4" />
                                                    </div>

                                                    <div className="flex-1 min-w-0">
                                                        <p className={`text-sm font-medium ${theme.textColors.primary}`}>
                                                            {notification.title}
                                                        </p>
                                                        <p className={`text-xs ${theme.textColors.secondary} mt-1`}>
                                                            {notification.message}
                                                        </p>

                                                        {notification.actionText && (
                                                            <button
                                                                onClick={() => {
                                                                    if (notification.actionUrl) {
                                                                        window.location.href = notification.actionUrl;
                                                                    }
                                                                    dismiss(notification.id);
                                                                    setShowPanel(false);
                                                                }}
                                                                className={`mt-2 text-xs ${theme.textColors.accent} hover:${theme.textColors.primary} transition-colors`}
                                                            >
                                                                {notification.actionText} →
                                                            </button>
                                                        )}
                                                    </div>

                                                    <button
                                                        onClick={() => dismiss(notification.id)}
                                                        className={`p-1 hover:${theme.backgrounds.card} rounded opacity-0 group-hover:opacity-100 transition-opacity`}
                                                    >
                                                        <X className={`w-3 h-3 ${theme.textColors.muted}`} />
                                                    </button>
                                                </div>
                                            </motion.div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default SmartNotificationSystem;
