import { UserProgress } from '@/lib/store/progressStore';
import { LearningSession, SkillAssessment } from '@/lib/store/advancedAnalyticsStore';

export interface AIContextBuilder {
  userProgress: UserProgress;
  currentSession?: LearningSession;
  skills?: SkillAssessment[];
  strugglingTopics?: string[];
  learningStyle?: 'visual' | 'auditory' | 'kinesthetic' | 'reading';
  previousQuestions?: string[];
}

export function buildEnhancedAIContext(context: AIContextBuilder): string {
  const {
    userProgress,
    currentSession,
    skills = [],
    strugglingTopics = [],
    learningStyle = 'visual',
    previousQuestions = []
  } = context;

  // Calculate user level
  const getUserLevel = (): string => {
    if (userProgress.currentChapter <= 3) return 'beginner';
    if (userProgress.currentChapter <= 8) return 'intermediate';
    if (userProgress.currentChapter <= 14) return 'advanced';
    return 'expert';
  };

  // Identify strong and weak areas
  const strongSkills = skills.filter(s => s.currentLevel >= 75).map(s => s.skillName);
  const weakSkills = skills.filter(s => s.currentLevel < 60).map(s => s.skillName);

  // Session insights
  const sessionInsights = currentSession ? {
    timeSpent: Math.round(currentSession.activities.reduce((sum, a) => sum + a.duration, 0) / 60),
    chaptersVisited: currentSession.chaptersVisited,
    calculatorsUsed: currentSession.calculatorsUsed,
    currentFocus: currentSession.activities.slice(-3).map(a => a.type)
  } : null;

  return `
LEARNER PROFILE:
- Experience Level: ${getUserLevel().toUpperCase()}
- Current Chapter: ${userProgress.currentChapter}/17
- Financial Literacy Score: ${userProgress.financialLiteracyScore}/1000
- Learning Style: ${learningStyle}
- Completed Lessons: ${userProgress.completedLessons.length}
- Average Quiz Score: ${userProgress.learningAnalytics.averageQuizScore.toFixed(1)}%

STRENGTHS:
${strongSkills.length > 0 ? strongSkills.map(skill => `- Excels at ${skill}`).join('\n') : '- Building foundational knowledge'}

AREAS FOR IMPROVEMENT:
${weakSkills.length > 0 ? weakSkills.map(skill => `- Needs work on ${skill}`).join('\n') : '- Continue current progress'}

STRUGGLING WITH:
${strugglingTopics.length > 0 ? strugglingTopics.map(topic => `- ${topic}`).join('\n') : '- No major struggles identified'}

${sessionInsights ? `
CURRENT SESSION INSIGHTS:
- Time spent today: ${sessionInsights.timeSpent} minutes
- Chapters explored: ${sessionInsights.chaptersVisited.join(', ') || 'None'}
- Tools used: ${sessionInsights.calculatorsUsed.join(', ') || 'None'}
- Recent activity: ${sessionInsights.currentFocus.join(' → ')}
` : ''}

CONTEXT ADAPTATION RULES:
1. Adjust complexity to ${getUserLevel()} level
2. Use ${learningStyle} learning approaches (${getLearningStyleGuidance(learningStyle)})
3. Reference their strong areas: ${strongSkills.slice(0, 2).join(', ') || 'foundational concepts'}
4. Address weak areas gently: ${weakSkills.slice(0, 2).join(', ') || 'continue building'}
5. Avoid repeating recent topics: ${previousQuestions.slice(-3).join(', ') || 'None'}

COMMUNICATION STYLE:
- Encouraging and supportive
- Use real-world examples relevant to their level
- Build on their existing knowledge
- Provide actionable next steps
- Connect concepts to their financial goals

Remember: This learner has invested ${Math.round(userProgress.totalTimeSpent / 60)} minutes in their financial education journey. Honor their commitment with thoughtful, personalized guidance.
`;
}

function getLearningStyleGuidance(style: string): string {
  switch (style) {
    case 'visual':
      return 'use charts, graphs, visual examples, and metaphors';
    case 'auditory':
      return 'use explanations, discussions, and verbal examples';
    case 'kinesthetic':
      return 'use hands-on examples, calculators, and interactive scenarios';
    case 'reading':
      return 'use detailed explanations, lists, and step-by-step instructions';
    default:
      return 'use varied approaches with practical examples';
  }
}

// Enhanced prompt templates for different AI contexts
export const AI_PROMPT_TEMPLATES = {
  general_qa: (context: string) => `
You are an expert financial literacy coach for Finance Quest, helping someone master personal finance.

${context}

Provide helpful, encouraging answers that:
- Match their experience level and learning style
- Build on their existing knowledge
- Address their specific challenges
- Include practical action steps
- Reference Finance Quest tools when relevant

Keep responses conversational, supportive, and under 300 words unless they ask for detailed explanations.
`,

  lesson_help: (context: string, lessonTopic: string) => `
You are a personalized tutor helping with the "${lessonTopic}" lesson in Finance Quest.

${context}

The user is currently working on this lesson. Provide:
- Clarification of confusing concepts
- Real-world examples relevant to their level
- Encouragement about their progress
- Suggestions for applying the knowledge
- Connections to other lessons they've completed

Focus on helping them master this specific topic while building confidence.
`,

  calculator_guidance: (context: string, calculatorType: string) => `
You are a financial coach helping someone use the ${calculatorType} calculator in Finance Quest.

${context}

Provide guidance that:
- Explains what the results mean in practical terms
- Suggests how to improve their financial situation
- Connects to broader financial planning concepts
- Encourages experimentation with different scenarios
- References their learning journey and progress

Make the numbers meaningful and actionable.
`,

  quiz_review: (context: string, quizResults: { score: number; total: number; incorrectAnswers?: string[]; incorrectTopics?: string[] }) => `
You are a supportive coach reviewing quiz performance in Finance Quest.

${context}

Quiz Results:
- Score: ${quizResults.score}/${quizResults.total} (${Math.round((quizResults.score/quizResults.total)*100)}%)
- Incorrect topics: ${quizResults.incorrectTopics?.join(', ') || 'None'}

Provide:
- Encouragement regardless of score
- Specific guidance on topics they missed
- Study suggestions based on their learning style
- Confidence-building about their overall progress
- Next steps for improvement

Be supportive and constructive, never critical.
`,

  progress_coaching: (context: string) => `
You are a progress coach in Finance Quest, helping someone reflect on their financial learning journey.

${context}

Provide insights about:
- Their growth and achievements so far
- Areas where they're showing improvement
- Recommended focus areas for continued growth
- How their learning connects to real financial goals
- Motivation to continue their journey

Celebrate their progress and inspire continued learning.
`
};

// Function to select appropriate template and build full prompt
export function buildAIPrompt(
  type: keyof typeof AI_PROMPT_TEMPLATES,
  context: AIContextBuilder,
  additionalData?: Record<string, unknown>
): string {
  const enhancedContext = buildEnhancedAIContext(context);
  
  switch (type) {
    case 'lesson_help':
      return AI_PROMPT_TEMPLATES.lesson_help(enhancedContext, (additionalData?.lessonTopic as string) || 'current lesson');
    case 'calculator_guidance':
      return AI_PROMPT_TEMPLATES.calculator_guidance(enhancedContext, (additionalData?.calculatorType as string) || 'financial calculator');
    case 'quiz_review':
      return AI_PROMPT_TEMPLATES.quiz_review(enhancedContext, (additionalData?.quizResults as { score: number; total: number; incorrectAnswers?: string[]; incorrectTopics?: string[] }) || { score: 0, total: 0 });
    case 'progress_coaching':
      return AI_PROMPT_TEMPLATES.progress_coaching(enhancedContext);
    default:
      return AI_PROMPT_TEMPLATES.general_qa(enhancedContext);
  }
}

// Enhanced fallback responses with context awareness
export function generateContextualFallback(
  userMessage: string,
  context: AIContextBuilder
): string {
  const level = context.userProgress.currentChapter <= 3 ? 'beginner' : 
               context.userProgress.currentChapter <= 8 ? 'intermediate' : 'advanced';
  
  const message = userMessage.toLowerCase();
  
  // Context-aware responses based on user level and history
  if (message.includes('budget') || message.includes('spending')) {
    if (level === 'beginner') {
      return "Great question about budgeting! Since you're building your foundation, start with the 50/30/20 rule: 50% for needs, 30% for wants, 20% for savings. Our Budget Builder calculator can help you see this in action with your real numbers!";
    } else {
      return "For budgeting optimization, consider zero-based budgeting where every dollar has a purpose. Based on your progress, you might also explore envelope budgeting or percentage-based allocation strategies. Check out our advanced budgeting tools!";
    }
  }
  
  if (message.includes('invest') || message.includes('stock')) {
    if (level === 'beginner') {
      return "Investing can seem complex, but you're building the right foundation! Start with understanding compound interest (our calculator shows this beautifully), then explore low-cost index funds. You're on track to learn more advanced strategies as you progress!";
    } else {
      return "Since you've mastered the basics, consider diving deeper into portfolio allocation, tax-advantaged accounts, and dollar-cost averaging. Our Portfolio Analyzer can help you optimize your current strategy!";
    }
  }
  
  if (message.includes('debt') || message.includes('credit')) {
    const hasDebtExperience = context.userProgress.completedLessons.some(l => l.includes('debt') || l.includes('credit'));
    
    if (hasDebtExperience) {
      return "Based on your credit and debt knowledge, focus on optimizing your debt payoff strategy. Consider the avalanche method for high-interest debt, and use our Debt Payoff Calculator to see different scenarios!";
    } else {
      return "Debt management is crucial for financial health! Start by listing all debts, their interest rates, and minimum payments. Our Debt Payoff Calculator can show you how small extra payments create huge savings over time!";
    }
  }
  
  // Default fallback with personal touch
  return `Thanks for your question! I can see you're making great progress in Finance Quest with ${context.userProgress.completedLessons.length} lessons completed. While I'm having trouble connecting right now, I encourage you to explore our interactive calculators and continue building your financial knowledge. Your dedication to learning is commendable! 💪`;
}
