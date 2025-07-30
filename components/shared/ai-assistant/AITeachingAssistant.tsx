'use client';

import { useState } from 'react';
import { useProgress } from '@/lib/context/ProgressContext';
import { Bot, Lightbulb } from 'lucide-react';

interface Message {
  id: number;
  text: string;
  isUser: boolean;
  timestamp: Date;
  isLoading?: boolean;
}

interface QuickHelp {
  question: string;
}

const quickHelpTopics: QuickHelp[] = [
  { question: "What's the difference between gross and net pay?" },
  { question: "How does compound interest work?" },
  { question: "Why should I start investing young?" },
  { question: "What's an emergency fund?" },
  { question: "How do I build credit?" },
  { question: "What's the 50/30/20 rule?" }
];

export default function AITeachingAssistant() {
  const { state } = useProgress();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: "Hi! I'm your AI Financial Coach powered by real AI! I'm here to give you personalized guidance based on your progress in Finance Quest. What would you like to learn about?",
      isUser: false,
      timestamp: new Date()
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const addMessage = (text: string, isUser: boolean, isLoading = false) => {
    const newMessage: Message = {
      id: messages.length + 1,
      text,
      isUser,
      timestamp: new Date(),
      isLoading
    };
    setMessages(prev => [...prev, newMessage]);
    return newMessage.id;
  };

  const updateMessage = (id: number, text: string) => {
    setMessages(prev => prev.map(msg =>
      msg.id === id ? { ...msg, text, isLoading: false } : msg
    ));
  };

  const callAI = async (userInput: string) => {
    try {
      const response = await fetch('/api/ai-chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: userInput,
          userProgress: state.userProgress
        }),
      });

      if (!response.ok) {
        throw new Error('AI request failed');
      }

      const data = await response.json();
      return data.response;
    } catch (error) {
      console.error('AI Error:', error);
      // Fallback response
      return "I'm having trouble connecting right now, but I'm here to help! Try asking about paychecks, compound interest, budgeting, or any other financial topic. You can also explore our interactive lessons and calculators!";
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || isTyping) return;

    const userMessage = inputText.trim();

    // Add user message
    addMessage(userMessage, true);
    setInputText('');
    setIsTyping(true);

    // Add loading message
    const loadingId = addMessage('', false, true);

    // Get AI response
    const aiResponse = await callAI(userMessage);

    // Update loading message with actual response
    updateMessage(loadingId, aiResponse);
    setIsTyping(false);
  };

  const handleQuickHelp = async (help: QuickHelp) => {
    if (isTyping) return;

    addMessage(help.question, true);
    setIsTyping(true);

    // Add loading message
    const loadingId = addMessage('', false, true);

    // Get AI response
    const aiResponse = await callAI(help.question);

    // Update loading message with actual response
    updateMessage(loadingId, aiResponse);
    setIsTyping(false);
  };

  // Get progress summary for display
  const getProgressSummary = () => {
    const progress = state.userProgress;
    const completionPercentage = Math.round((progress.completedLessons.length / 3) * 100);
    const hasQuizScores = Object.keys(progress.quizScores).length > 0;
    const recentQuizScore = hasQuizScores ? Math.max(...Object.values(progress.quizScores)) : 0;

    return { completionPercentage, recentQuizScore, hasQuizScores };
  };

  const progressSummary = getProgressSummary();

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
      {/* Header with Progress Context */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-4">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <Bot className="w-5 h-5" />
          AI Financial Coach
          <span className="ml-2 text-sm opacity-90">Powered by Real AI!</span>
        </h3>
        <div className="text-sm opacity-90 mt-1">
          Your Progress: {progressSummary.completionPercentage}% lessons completed
          {progressSummary.hasQuizScores && ` • Latest Quiz: ${progressSummary.recentQuizScore}%`}
        </div>
      </div>

      {/* Quick Help Topics */}
      <div className="p-4 bg-gray-50 border-b">
        <p className="text-sm text-gray-600 mb-3">Ask me about:</p>
        <div className="flex flex-wrap gap-2">
          {quickHelpTopics.map((help, index) => (
            <button
              key={index}
              onClick={() => handleQuickHelp(help)}
              disabled={isTyping}
              className="text-xs bg-blue-100 text-blue-700 px-3 py-1 rounded-full hover:bg-blue-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {help.question}
            </button>
          ))}
        </div>
      </div>

      {/* Messages */}
      <div className="h-96 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${message.isUser
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 text-gray-800'
                }`}
            >
              {message.isLoading ? (
                <div className="flex items-center space-x-2">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                  <span className="text-sm text-gray-600">AI is thinking...</span>
                </div>
              ) : (
                <>
                  <p className="text-sm whitespace-pre-wrap">{message.text}</p>
                  <p className={`text-xs mt-1 ${message.isUser ? 'text-blue-100' : 'text-gray-500'
                    }`}>
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Input */}
      <form onSubmit={handleSubmit} className="p-4 border-t">
        <div className="flex space-x-2">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Ask me anything about money and finance..."
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            disabled={isTyping}
          />
          <button
            type="submit"
            disabled={!inputText.trim() || isTyping}
            className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isTyping ? '...' : 'Send'}
          </button>
        </div>
        <p className="text-xs text-gray-500 mt-2 flex items-center gap-1">
          <Lightbulb className="w-3 h-3" />
          This AI knows your current progress and can give personalized advice!
        </p>
      </form>
    </div>
  );
}
