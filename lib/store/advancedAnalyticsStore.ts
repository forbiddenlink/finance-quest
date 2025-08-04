import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

// Enhanced analytics interfaces
export interface LearningSession {
  id: string;
  startTime: Date;
  endTime?: Date;
  activities: LearningActivity[];
  totalTimeSpent: number;
  chaptersVisited: number[];
  calculatorsUsed: string[];
  questionsAnswered: number;
  correctAnswers: number;
}

export interface LearningActivity {
  id: string;
  type: 'lesson' | 'quiz' | 'calculator' | 'ai_chat';
  timestamp: Date;
  duration: number; // seconds
  context: {
    chapterId?: number;
    lessonId?: string;
    calculatorId?: string;
    quizId?: string;
  };
  outcome?: {
    score?: number;
    completed?: boolean;
    timeToComplete?: number;
  };
}

export interface SkillAssessment {
  skillId: string;
  skillName: string;
  currentLevel: number; // 0-100
  trend: 'improving' | 'stable' | 'declining';
  lastAssessed: Date;
  evidencePoints: Array<{
    source: 'quiz' | 'lesson' | 'practical';
    value: number;
    timestamp: Date;
  }>;
}

export interface LearningPath {
  id: string;
  name: string;
  description: string;
  estimatedHours: number;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  prerequisites: string[];
  chapters: number[];
  skills: string[];
  completed: boolean;
  progress: number; // 0-100
}

export interface PersonalizedRecommendation {
  id: string;
  type: 'lesson' | 'calculator' | 'review' | 'practice';
  title: string;
  description: string;
  reasoning: string;
  priority: 'low' | 'medium' | 'high';
  estimatedTime: number; // minutes
  targetSkills: string[];
  createdAt: Date;
  consumed?: Date;
}

export interface AdvancedAnalyticsStore {
  // Current session
  currentSession: LearningSession | null;
  sessions: LearningSession[];
  
  // Skill tracking
  skills: SkillAssessment[];
  learningPaths: LearningPath[];
  recommendations: PersonalizedRecommendation[];
  
  // Advanced metrics
  learningVelocity: number; // concepts per hour
  retentionRate: number; // percentage
  optimalStudyTime: string; // time of day
  learningStyle: 'visual' | 'auditory' | 'kinesthetic' | 'reading';
  
  // Actions
  startSession: () => string;
  endSession: () => void;
  recordActivity: (activity: Omit<LearningActivity, 'id' | 'timestamp'>) => void;
  updateSkillLevel: (skillId: string, evidence: { score: number; source: 'quiz' | 'lesson' | 'practical' }) => void;
  generateRecommendations: () => PersonalizedRecommendation[];
  consumeRecommendation: (recommendationId: string) => void;
  calculateLearningVelocity: () => number;
  getPersonalizedInsights: () => {
    strengths: string[];
    weaknesses: string[];
    nextSteps: string[];
    studyTips: string[];
  };
}

const skillsMap = {
  'financial-psychology': 'Financial Psychology',
  'budgeting': 'Budgeting & Cash Flow',
  'investing': 'Investment Knowledge',
  'debt-management': 'Debt Management',
  'retirement-planning': 'Retirement Planning',
  'tax-optimization': 'Tax Strategy',
  'risk-management': 'Risk Assessment',
  'real-estate': 'Real Estate Investment',
  'business-finance': 'Business Finance',
  'advanced-investing': 'Advanced Investment Strategies'
};

export const useAdvancedAnalytics = create<AdvancedAnalyticsStore>()(
  persist(
    (set, get) => ({
      currentSession: null,
      sessions: [],
      skills: Object.entries(skillsMap).map(([id, name]) => ({
        skillId: id,
        skillName: name,
        currentLevel: 0,
        trend: 'stable' as const,
        lastAssessed: new Date(),
        evidencePoints: []
      })),
      learningPaths: [
        {
          id: 'foundation',
          name: 'Financial Foundation',
          description: 'Master the basics of personal finance',
          estimatedHours: 12,
          difficulty: 'beginner',
          prerequisites: [],
          chapters: [1, 2, 3, 4],
          skills: ['financial-psychology', 'budgeting'],
          completed: false,
          progress: 0
        },
        {
          id: 'investment-mastery',
          name: 'Investment Mastery',
          description: 'Build wealth through strategic investing',
          estimatedHours: 20,
          difficulty: 'intermediate',
          prerequisites: ['foundation'],
          chapters: [7, 8, 12, 13, 14],
          skills: ['investing', 'advanced-investing', 'risk-management'],
          completed: false,
          progress: 0
        }
      ],
      recommendations: [],
      learningVelocity: 0,
      retentionRate: 0,
      optimalStudyTime: 'morning',
      learningStyle: 'visual',

      startSession: () => {
        const sessionId = `session_${Date.now()}`;
        const newSession: LearningSession = {
          id: sessionId,
          startTime: new Date(),
          activities: [],
          totalTimeSpent: 0,
          chaptersVisited: [],
          calculatorsUsed: [],
          questionsAnswered: 0,
          correctAnswers: 0
        };

        set(state => ({
          currentSession: newSession,
          sessions: [...state.sessions, newSession]
        }));

        return sessionId;
      },

      endSession: () => {
        set(state => {
          if (!state.currentSession) return state;

          const endedSession = {
            ...state.currentSession,
            endTime: new Date(),
            totalTimeSpent: state.currentSession.activities.reduce(
              (total, activity) => total + activity.duration, 0
            )
          };

          return {
            currentSession: null,
            sessions: state.sessions.map(s => 
              s.id === endedSession.id ? endedSession : s
            )
          };
        });
      },

      recordActivity: (activityData) => {
        const activity: LearningActivity = {
          ...activityData,
          id: `activity_${Date.now()}`,
          timestamp: new Date()
        };

        set(state => {
          if (!state.currentSession) return state;

          const updatedSession = {
            ...state.currentSession,
            activities: [...state.currentSession.activities, activity]
          };

          // Update session stats
          if (activity.context.chapterId && !updatedSession.chaptersVisited.includes(activity.context.chapterId)) {
            updatedSession.chaptersVisited.push(activity.context.chapterId);
          }

          if (activity.context.calculatorId && !updatedSession.calculatorsUsed.includes(activity.context.calculatorId)) {
            updatedSession.calculatorsUsed.push(activity.context.calculatorId);
          }

          if (activity.type === 'quiz' && activity.outcome) {
            updatedSession.questionsAnswered += 1;
            if (activity.outcome.score && activity.outcome.score > 0) {
              updatedSession.correctAnswers += activity.outcome.score;
            }
          }

          return {
            currentSession: updatedSession,
            sessions: state.sessions.map(s => 
              s.id === updatedSession.id ? updatedSession : s
            )
          };
        });
      },

      updateSkillLevel: (skillId, evidence) => {
        set(state => ({
          skills: state.skills.map(skill => {
            if (skill.skillId !== skillId) return skill;

            const newEvidence = {
              ...evidence,
              value: evidence.score,
              timestamp: new Date()
            };

            const updatedEvidencePoints = [...skill.evidencePoints, newEvidence];
            
            // Calculate new level based on evidence
            const recentEvidence = updatedEvidencePoints
              .filter(e => Date.now() - e.timestamp.getTime() < 30 * 24 * 60 * 60 * 1000) // Last 30 days
              .slice(-10); // Last 10 pieces of evidence

            const averageScore = recentEvidence.length > 0
              ? recentEvidence.reduce((sum, e) => sum + e.value, 0) / recentEvidence.length
              : 0;

            // Determine trend
            const oldEvidence = updatedEvidencePoints.slice(-20, -10);
            const newEvidenceAvg = recentEvidence.reduce((sum, e) => sum + e.value, 0) / Math.max(recentEvidence.length, 1);
            const oldEvidenceAvg = oldEvidence.reduce((sum, e) => sum + e.value, 0) / Math.max(oldEvidence.length, 1);
            
            let trend: 'improving' | 'stable' | 'declining' = 'stable';
            if (newEvidenceAvg > oldEvidenceAvg + 5) trend = 'improving';
            else if (newEvidenceAvg < oldEvidenceAvg - 5) trend = 'declining';

            return {
              ...skill,
              currentLevel: Math.min(100, Math.max(0, averageScore)),
              trend,
              lastAssessed: new Date(),
              evidencePoints: updatedEvidencePoints
            };
          })
        }));
      },

      generateRecommendations: () => {
        const state = get();
        const recommendations: PersonalizedRecommendation[] = [];

        // Analyze weak skills
        const weakSkills = state.skills
          .filter(s => s.currentLevel < 60)
          .sort((a, b) => a.currentLevel - b.currentLevel);

        weakSkills.slice(0, 3).forEach(skill => {
          recommendations.push({
            id: `rec_${Date.now()}_${skill.skillId}`,
            type: 'review',
            title: `Strengthen ${skill.skillName}`,
            description: `Your ${skill.skillName} score is ${skill.currentLevel}%. Let's improve it!`,
            reasoning: `Based on recent quiz performance, this skill needs attention`,
            priority: skill.currentLevel < 40 ? 'high' : 'medium',
            estimatedTime: 15,
            targetSkills: [skill.skillId],
            createdAt: new Date()
          });
        });

        // Suggest next logical steps
        const completedChapters = state.sessions
          .flatMap(s => s.chaptersVisited)
          .filter((chapter, index, arr) => arr.indexOf(chapter) === index);

        const nextChapter = Math.max(...completedChapters, 0) + 1;
        if (nextChapter <= 17) {
          recommendations.push({
            id: `rec_${Date.now()}_chapter`,
            type: 'lesson',
            title: `Ready for Chapter ${nextChapter}`,
            description: `Continue your learning journey with the next chapter`,
            reasoning: `You've completed the prerequisites`,
            priority: 'medium',
            estimatedTime: 30,
            targetSkills: [],
            createdAt: new Date()
          });
        }

        set({ recommendations });
        return recommendations;
      },

      consumeRecommendation: (recommendationId) => {
        set(state => ({
          recommendations: state.recommendations.map(rec =>
            rec.id === recommendationId
              ? { ...rec, consumed: new Date() }
              : rec
          )
        }));
      },

      calculateLearningVelocity: () => {
        const state = get();
        const recentSessions = state.sessions
          .filter(s => s.endTime && Date.now() - s.startTime.getTime() < 7 * 24 * 60 * 60 * 1000); // Last week

        const totalTime = recentSessions.reduce((sum, s) => sum + s.totalTimeSpent, 0) / 3600; // hours
        const totalConcepts = recentSessions.reduce((sum, s) => sum + s.questionsAnswered, 0);

        const velocity = totalTime > 0 ? totalConcepts / totalTime : 0;
        
        set({ learningVelocity: velocity });
        return velocity;
      },

      getPersonalizedInsights: () => {
        const state = get();
        
        const strengths = state.skills
          .filter(s => s.currentLevel >= 80)
          .map(s => s.skillName);

        const weaknesses = state.skills
          .filter(s => s.currentLevel < 60)
          .map(s => s.skillName);

        const nextSteps = state.recommendations
          .filter(r => !r.consumed && r.priority === 'high')
          .map(r => r.title);

        const studyTips = [
          state.learningVelocity > 10 ? "Great pace! Keep up the momentum." : "Consider shorter, more frequent study sessions.",
          state.retentionRate > 80 ? "Excellent retention! Try tackling more advanced topics." : "Review previous material to strengthen retention.",
          `Your optimal study time appears to be ${state.optimalStudyTime}. Try to schedule learning during this time.`
        ];

        return {
          strengths: strengths.length > 0 ? strengths : ['Building foundational knowledge'],
          weaknesses: weaknesses.length > 0 ? weaknesses : ['Continue progressing through the curriculum'],
          nextSteps: nextSteps.length > 0 ? nextSteps : ['Continue with the next lesson'],
          studyTips
        };
      }
    }),
    {
      name: 'finance-quest-advanced-analytics',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
