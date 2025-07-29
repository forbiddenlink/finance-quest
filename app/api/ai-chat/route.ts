import OpenAI from 'openai';
import { NextRequest, NextResponse } from 'next/server';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

interface UserProgress {
  currentChapter: number;
  completedLessons: string[];
  quizScores: { [key: string]: number };
  calculatorUsage: string[];
  strugglingTopics: string[];
}

const FINANCIAL_COACH_SYSTEM_PROMPT = `You are an expert financial literacy coach for Finance Quest, an educational platform teaching money management from zero to advanced levels.

CONTEXT: You're helping users learn through:
- Interactive lessons (income, banking, paycheck basics)
- Hands-on calculators (paycheck, compound interest)  
- Mastery-based quizzes (80% required to advance)
- Real-world scenarios

YOUR ROLE:
- Explain financial concepts in simple, jargon-free language
- Provide encouraging, personalized guidance
- Reference specific Finance Quest tools and lessons
- Give actionable advice users can implement immediately
- Celebrate progress and milestones

TONE: Friendly, supportive, knowledgeable but not condescending. Assume zero prior financial knowledge.

KEY TOPICS YOU HELP WITH:
- Gross vs Net Pay and paycheck deductions
- Compound interest and investment growth
- Banking basics and account types
- Emergency funds and budgeting
- Credit scores and debt management
- Career and salary decisions

Always end responses with encouragement or a specific next step they can take in Finance Quest.`;

export async function POST(request: NextRequest) {
  try {
    const { message, context } = await request.json();

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: 'OpenAI API key not configured' },
        { status: 500 }
      );
    }

    // Build context-aware prompt based on request type and user progress
    let contextPrompt = '';
    if (context?.userProgress) {
      const progress = context.userProgress;
      contextPrompt = `
USER CONTEXT:
- Currently on Chapter ${progress.currentChapter || 1}
- Completed lessons: ${progress.completedLessons?.join(', ') || 'None yet'}
- Recent quiz scores: ${Object.entries(progress.quizScores || {}).map(([quiz, score]) => `${quiz}: ${score}%`).join(', ') || 'No quizzes taken'}
- Used calculators: ${progress.calculatorUsage?.join(', ') || 'None yet'}
- Struggling with: ${progress.strugglingTopics?.join(', ') || 'No identified struggles'}

${context.type === 'qa_system' ? 
  'This is a general Q&A question. Provide comprehensive, educational answers that connect to Finance Quest content when relevant.' :
  'Tailor your response to their current progress and learning needs.'}
`;
    }

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini", // More cost-effective for demo
      messages: [
        { role: "system", content: FINANCIAL_COACH_SYSTEM_PROMPT + contextPrompt },
        { role: "user", content: message }
      ],
      max_tokens: 400, // Increased for Q&A responses
      temperature: 0.7,
    });

    const aiResponse = completion.choices[0]?.message?.content;

    if (!aiResponse) {
      throw new Error('No response from AI');
    }

    return NextResponse.json({ 
      response: aiResponse,
      usage: completion.usage 
    });

  } catch (error) {
    console.error('AI Chat Error:', error);
    
    // Fallback to rule-based responses for demo reliability
    const { message: userMessage } = await request.json();
    const fallbackResponse = generateFallbackResponse(userMessage);
    
    return NextResponse.json({ 
      response: fallbackResponse,
      fallback: true 
    });
  }
}

function generateFallbackResponse(message: string): string {
  const lowerMessage = message.toLowerCase();
  
  if (lowerMessage.includes('gross') || lowerMessage.includes('net') || lowerMessage.includes('paycheck')) {
    return "Great question about paychecks! Your gross pay is what you earn before deductions, while net pay is your take-home amount after taxes and other deductions. Try our Paycheck Calculator to see exactly how this works with your numbers!";
  }
  
  if (lowerMessage.includes('compound') || lowerMessage.includes('interest') || lowerMessage.includes('invest')) {
    return "Compound interest is like magic for your money! You earn interest on your interest, creating exponential growth over time. The earlier you start, the more powerful it becomes. Check out our interactive Compound Interest Calculator to see your money grow!";
  }
  
  if (lowerMessage.includes('emergency') || lowerMessage.includes('fund')) {
    return "An emergency fund is your financial safety net! Aim for 3-6 months of living expenses in a high-yield savings account. Start small - even $500 makes a huge difference when unexpected expenses arise!";
  }
  
  return "Thanks for your question! I'm here to help you master money management. Feel free to ask about any financial topic, and don't forget to explore our interactive lessons and calculators to practice what you learn. You're doing great by asking questions - that's how financial literacy grows! 💪";
}
