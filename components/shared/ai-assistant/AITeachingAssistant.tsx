'use client';

import { useState } from 'react';

interface Message {
  id: number;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

interface QuickHelp {
  question: string;
  answer: string;
}

const quickHelpTopics: QuickHelp[] = [
  {
    question: "What's the difference between gross and net pay?",
    answer: "Gross pay is your total earnings before any deductions. Net pay is what you actually take home after taxes, Social Security, Medicare, and other deductions are subtracted. Think of gross as 'before' and net as 'after'!"
  },
  {
    question: "How does compound interest work?",
    answer: "Compound interest means you earn interest on both your original money AND the interest you've already earned. It's like a snowball rolling down a hill - it gets bigger and bigger! The key is time - the longer you leave your money invested, the more powerful compound interest becomes."
  },
  {
    question: "Why should I start investing young?",
    answer: "Time is your superpower when investing! Starting at 25 vs 35 can mean hundreds of thousands more dollars by retirement, even with the same monthly contributions. This is because of compound interest - your money has more time to grow and multiply."
  },
  {
    question: "What's an emergency fund?",
    answer: "An emergency fund is money set aside for unexpected expenses like car repairs, medical bills, or job loss. Aim for 3-6 months of living expenses in a savings account. It's your financial safety net that prevents you from going into debt when life happens!"
  }
];

export default function AITeachingAssistant() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: "Hi! I'm your AI Financial Coach. I'm here to help you understand money concepts and answer your questions. What would you like to learn about?",
      isUser: false,
      timestamp: new Date()
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const addMessage = (text: string, isUser: boolean) => {
    const newMessage: Message = {
      id: messages.length + 1,
      text,
      isUser,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, newMessage]);
  };

  const generateResponse = (userInput: string): string => {
    const input = userInput.toLowerCase();
    
    // Check for specific topics
    if (input.includes('gross') || input.includes('net') || input.includes('paycheck')) {
      return "Great question about paychecks! Your gross pay is what you earn before any deductions. Net pay is what you actually get to keep after taxes and other deductions. Try our Paycheck Calculator to see exactly how this works with real numbers!";
    }
    
    if (input.includes('compound') || input.includes('interest') || input.includes('invest')) {
      return "Compound interest is truly magical! It's when you earn interest on your interest, creating exponential growth over time. The earlier you start, the more powerful it becomes. Check out our Compound Interest Calculator to see how your money could grow!";
    }
    
    if (input.includes('budget') || input.includes('spending') || input.includes('save')) {
      return "Budgeting is the foundation of financial success! A good rule of thumb is the 50/30/20 rule: 50% for needs, 30% for wants, and 20% for savings and debt repayment. This helps ensure you're living within your means while building for the future.";
    }
    
    if (input.includes('emergency') || input.includes('fund')) {
      return "An emergency fund is crucial for financial stability! Aim for 3-6 months of living expenses in a high-yield savings account. This protects you from going into debt when unexpected expenses arise. Start small - even $500 makes a huge difference!";
    }
    
    if (input.includes('debt') || input.includes('credit') || input.includes('loan')) {
      return "Understanding debt is key to financial health! There's 'good debt' (like mortgages that build wealth) and 'bad debt' (like high-interest credit cards). Focus on paying off high-interest debt first, and always pay more than the minimum when possible.";
    }
    
    // General encouragement
    const encouragingResponses = [
      "That's a thoughtful question! Financial literacy is a journey, and every question helps you grow. Keep exploring our lessons and calculators to build your knowledge step by step.",
      "I love your curiosity about money! Understanding these concepts puts you ahead of most people. Remember, small consistent actions lead to big financial wins over time.",
      "Great thinking! The fact that you're asking questions shows you're on the right path. Financial education is one of the best investments you can make in yourself."
    ];
    
    return encouragingResponses[Math.floor(Math.random() * encouragingResponses.length)];
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    // Add user message
    addMessage(inputText, true);
    setInputText('');
    setIsTyping(true);

    // Simulate typing delay
    setTimeout(() => {
      const response = generateResponse(inputText);
      addMessage(response, false);
      setIsTyping(false);
    }, 1000);
  };

  const handleQuickHelp = (help: QuickHelp) => {
    addMessage(help.question, true);
    setIsTyping(true);
    
    setTimeout(() => {
      addMessage(help.answer, false);
      setIsTyping(false);
    }, 1000);
  };

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-4">
        <h3 className="text-lg font-semibold flex items-center">
          🤖 AI Financial Coach
          <span className="ml-2 text-sm opacity-90">Always here to help!</span>
        </h3>
      </div>

      {/* Quick Help Topics */}
      <div className="p-4 bg-gray-50 border-b">
        <p className="text-sm text-gray-600 mb-3">Quick help topics:</p>
        <div className="flex flex-wrap gap-2">
          {quickHelpTopics.map((help, index) => (
            <button
              key={index}
              onClick={() => handleQuickHelp(help)}
              className="text-xs bg-blue-100 text-blue-700 px-3 py-1 rounded-full hover:bg-blue-200 transition-colors"
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
              className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                message.isUser
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 text-gray-800'
              }`}
            >
              <p className="text-sm">{message.text}</p>
              <p className={`text-xs mt-1 ${
                message.isUser ? 'text-blue-100' : 'text-gray-500'
              }`}>
                {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
          </div>
        ))}
        
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-gray-200 text-gray-800 max-w-xs lg:max-w-md px-4 py-2 rounded-lg">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
            </div>
          </div>
        )}
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
            Send
          </button>
        </div>
      </form>
    </div>
  );
}
