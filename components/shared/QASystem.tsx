'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Send, HelpCircle, Sparkles } from 'lucide-react';
import { useProgress } from '@/lib/context/ProgressContext';
import LoadingSpinner from './ui/LoadingSpinner';

interface QAMessage {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
}

interface QASystemProps {
  isQuizMode?: boolean; // Disable during quizzes
  className?: string;
}

export default function QASystem({ isQuizMode = false, className = '' }: QASystemProps) {
  const [messages, setMessages] = useState<QAMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { state } = useProgress();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || isLoading || isQuizMode) return;

    const userMessage: QAMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: inputValue.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/ai-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: inputValue.trim(),
          context: {
            type: 'qa_system',
            userProgress: state,
            isGeneralQuestion: true
          }
        })
      });

      if (!response.ok) throw new Error('Failed to get AI response');

      const data = await response.json();

      const aiMessage: QAMessage = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: data.response,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('Error getting AI response:', error);

      const errorMessage: QAMessage = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: "I'm having trouble connecting right now. Here are some financial fundamentals to consider: Focus on building an emergency fund (3-6 months expenses), understand the difference between needs vs wants, and start learning about compound interest for long-term wealth building.",
        timestamp: new Date()
      };

      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const suggestedQuestions = [
    "How does compound interest work?",
    "What's a good credit score?",
    "How much should I save for emergencies?",
    "Should I invest in stocks or bonds?",
    "What's the 50/30/20 budgeting rule?",
    "How do I start building credit?"
  ];

  if (isQuizMode) {
    return (
      <div className={`bg-yellow-50 border border-yellow-200 rounded-lg p-4 ${className}`}>
        <div className="flex items-center gap-2 text-yellow-800">
          <HelpCircle className="w-5 h-5" />
          <span className="text-sm font-medium">
            Q&A System is disabled during quizzes to maintain assessment integrity.
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white border border-gray-200 rounded-lg shadow-sm ${className}`}>
      {/* Header */}
      <div
        className="flex items-center justify-between p-4 border-b border-gray-200 cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-2">
          <div className="bg-blue-100 p-1 rounded-full">
            <Sparkles className="w-4 h-4 text-blue-600" />
          </div>
          <h3 className="font-semibold text-gray-900">Ask Any Financial Question</h3>
        </div>
        <button className="text-sm text-blue-600 hover:text-blue-700">
          {isExpanded ? 'Minimize' : 'Expand'}
        </button>
      </div>

      {isExpanded && (
        <>
          {/* Messages Area */}
          <div className="h-64 overflow-y-auto p-4 space-y-4">
            {messages.length === 0 ? (
              <div className="text-center text-gray-500 py-8">
                <HelpCircle className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p className="text-sm">Ask me anything about personal finance!</p>
                <p className="text-xs mt-1">I know about everything you&apos;re learning in Finance Quest.</p>
              </div>
            ) : (
              messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${message.type === 'user'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-900'
                      }`}
                  >
                    <p className="text-sm">{message.content}</p>
                    <p className={`text-xs mt-1 ${message.type === 'user' ? 'text-blue-100' : 'text-gray-500'
                      }`}>
                      {message.timestamp.toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                </div>
              ))
            )}

            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-gradient-to-r from-blue-100 to-purple-100 text-gray-900 px-4 py-3 rounded-lg border border-blue-200">
                  <LoadingSpinner
                    size="sm"
                    text="AI is thinking..."
                    className="text-blue-600"
                  />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Suggested Questions */}
          {messages.length === 0 && (
            <div className="px-4 py-2 border-t border-gray-200">
              <p className="text-xs text-gray-600 mb-2">Try asking:</p>
              <div className="flex flex-wrap gap-2">
                {suggestedQuestions.slice(0, 3).map((question, index) => (
                  <button
                    key={index}
                    onClick={() => setInputValue(question)}
                    className="text-xs bg-gray-100 hover:bg-gray-200 px-2 py-1 rounded transition-colors"
                  >
                    {question}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input Form */}
          <form onSubmit={handleSubmit} className="p-4 border-t border-gray-200">
            <div className="flex gap-2">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Ask about budgeting, investing, credit scores..."
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                disabled={isLoading}
              />
              <button
                type="submit"
                disabled={!inputValue.trim() || isLoading}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </form>
        </>
      )}
    </div>
  );
}
