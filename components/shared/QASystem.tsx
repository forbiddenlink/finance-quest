'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Send, HelpCircle, Sparkles, Mic } from 'lucide-react';
import { useProgressStore } from '@/lib/store/progressStore';
import { theme } from '@/lib/theme';
import LoadingSpinner from './ui/LoadingSpinner';
import VoiceQA from './ui/VoiceQA';

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
  const [activeTab, setActiveTab] = useState<'text' | 'voice'>('text');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const userProgress = useProgressStore((state) => state.userProgress);

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
            userProgress: userProgress,
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
      <div className={`${theme.status.warning.bg} border ${theme.status.warning.border} rounded-lg p-4 ${className}`}>
        <div className={`flex items-center gap-2 ${theme.status.warning.text}`}>
          <HelpCircle className="w-5 h-5" />
          <span className="text-sm font-medium">
            Q&A System is disabled during quizzes to maintain assessment integrity.
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className={`${theme.backgrounds.card} border ${theme.borderColors.primary} rounded-lg shadow-sm ${className}`}>
      {/* Header */}
      <div
        className={`flex items-center justify-between p-4 border-b ${theme.borderColors.primary} cursor-pointer`}
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-2">
          <div className={`${theme.status.warning.bg} p-1 rounded-full`}>
            <Sparkles className={`w-4 h-4 ${theme.textColors.accent}`} />
          </div>
          <h3 className={`font-semibold ${theme.textColors.primary}`}>AI Financial Q&A Assistant</h3>
        </div>
        <button className={`text-sm ${theme.textColors.accent} hover:${theme.textColors.accentSecondary}`}>
          {isExpanded ? 'Minimize' : 'Expand'}
        </button>
      </div>

      {isExpanded && (
        <>
          {/* Tab Navigation */}
          <div className={`flex border-b ${theme.borderColors.primary}`}>
            <button
              onClick={() => setActiveTab('text')}
              className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 text-sm font-medium transition-colors ${activeTab === 'text'
                ? `${theme.status.info.bg} ${theme.status.info.text} border-b-2 ${theme.status.info.border}`
                : `${theme.textColors.secondary} hover:${theme.textColors.accent}`
                }`}
            >
              <Sparkles className="w-4 h-4" />
              Text Chat
            </button>
            <button
              onClick={() => setActiveTab('voice')}
              className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 text-sm font-medium transition-colors ${activeTab === 'voice'
                ? `${theme.status.info.bg} ${theme.status.info.text} border-b-2 ${theme.status.info.border}`
                : `${theme.textColors.secondary} hover:${theme.textColors.accent}`
                }`}
            >
              <Mic className="w-4 h-4" />
              Voice Q&A
            </button>
          </div>

          {activeTab === 'voice' ? (
            <div className="p-4">
              <VoiceQA isQuizMode={isQuizMode} />
            </div>
          ) : (
            <>
              {/* Messages Area */}
              <div className="h-64 overflow-y-auto p-4 space-y-4">
                {messages.length === 0 ? (
                  <div className={`text-center ${theme.textColors.muted} py-8`}>
                    <HelpCircle className={`w-12 h-12 mx-auto mb-4 ${theme.textColors.muted}`} />
                    <p className={`text-sm ${theme.textColors.secondary}`}>Ask me anything about personal finance!</p>
                    <p className={`text-xs mt-1 ${theme.textColors.muted}`}>I know about everything you&apos;re learning in Finance Quest.</p>
                  </div>
                ) : (
                  messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${message.type === 'user'
                          ? `${theme.buttons.primary}`
                          : `${theme.backgrounds.card} ${theme.textColors.primary} border ${theme.borderColors.primary}`
                          }`}
                      >
                        <p className={`text-sm ${message.type === 'user' ? theme.textColors.primary : theme.textColors.primary}`}>{message.content}</p>
                        <p className={`text-xs mt-1 ${message.type === 'user' ? theme.textColors.muted : theme.textColors.muted
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
                    <div className={`${theme.backgrounds.card} ${theme.textColors.primary} px-4 py-3 rounded-lg border ${theme.borderColors.accent}`}>
                      <LoadingSpinner
                        size="sm"
                        text="AI is thinking..."
                        className={theme.textColors.accent}
                      />
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Suggested Questions */}
              {messages.length === 0 && (
                <div className={`px-4 py-2 border-t ${theme.borderColors.primary}`}>
                  <p className={`text-xs ${theme.textColors.secondary} mb-2`}>Try asking:</p>
                  <div className="flex flex-wrap gap-2">
                    {suggestedQuestions.slice(0, 3).map((question, index) => (
                      <button
                        key={index}
                        onClick={() => setInputValue(question)}
                        className={`text-xs ${theme.backgrounds.card} hover:${theme.backgrounds.cardHover} ${theme.textColors.secondary} px-2 py-1 rounded transition-colors border ${theme.borderColors.primary}`}
                      >
                        {question}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Input Form */}
              <form onSubmit={handleSubmit} className={`p-4 border-t ${theme.borderColors.primary}`}>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder="Ask about budgeting, investing, credit scores..."
                    className={`flex-1 px-3 py-2 border ${theme.borderColors.muted} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm ${theme.backgrounds.card} ${theme.textColors.primary}`}
                    disabled={isLoading}
                  />
                  <button
                    type="submit"
                    disabled={!inputValue.trim() || isLoading}
                    className={`px-4 py-2 ${theme.buttons.primary} rounded-md disabled:opacity-50 disabled:cursor-not-allowed transition-colors`}
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </div>
              </form>
            </>
          )}
        </>
      )}
    </div>
  );
}
