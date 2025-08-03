'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { theme } from '@/lib/theme';
import { Calendar, TrendingDown, AlertTriangle, CheckCircle, Clock } from 'lucide-react';

interface CashFlowEvent {
  id: string;
  name: string;
  amount: number;
  date: number; // Day of month (1-31)
  type: 'income' | 'expense';
  category: 'paycheck' | 'bill' | 'subscription' | 'other';
}

const defaultEvents: CashFlowEvent[] = [
  { id: '1', name: 'Salary', amount: 3000, date: 15, type: 'income', category: 'paycheck' },
  { id: '2', name: 'Side Hustle', amount: 500, date: 30, type: 'income', category: 'paycheck' },
  { id: '3', name: 'Rent', amount: 1200, date: 1, type: 'expense', category: 'bill' },
  { id: '4', name: 'Car Payment', amount: 350, date: 5, type: 'expense', category: 'bill' },
  { id: '5', name: 'Netflix', amount: 15, date: 10, type: 'expense', category: 'subscription' },
  { id: '6', name: 'Electric Bill', amount: 120, date: 20, type: 'expense', category: 'bill' },
  { id: '7', name: 'Insurance', amount: 200, date: 25, type: 'expense', category: 'bill' }
];

export default function CashFlowTimingTool() {
  const [events, setEvents] = useState<CashFlowEvent[]>(defaultEvents);
  const [newEvent, setNewEvent] = useState<Partial<CashFlowEvent>>({
    name: '',
    amount: 0,
    date: 1,
    type: 'expense',
    category: 'bill'
  });
  const [showAddForm, setShowAddForm] = useState(false);

  const addEvent = () => {
    if (newEvent.name && newEvent.amount && newEvent.date) {
      const event: CashFlowEvent = {
        id: Date.now().toString(),
        name: newEvent.name,
        amount: newEvent.amount,
        date: newEvent.date,
        type: newEvent.type || 'expense',
        category: newEvent.category || 'bill'
      };
      setEvents([...events, event]);
      setNewEvent({ name: '', amount: 0, date: 1, type: 'expense', category: 'bill' });
      setShowAddForm(false);
    }
  };

  const removeEvent = (id: string) => {
    setEvents(events.filter(e => e.id !== id));
  };

  const calculateRunningBalance = () => {
    const sortedEvents = [...events].sort((a, b) => a.date - b.date);
    let runningBalance = 1000; // Starting buffer
    const timeline = [];

    for (const event of sortedEvents) {
      const change = event.type === 'income' ? event.amount : -event.amount;
      runningBalance += change;
      
      timeline.push({
        date: event.date,
        event: event.name,
        change,
        balance: runningBalance,
        type: event.type,
        isNegative: runningBalance < 0
      });
    }

    return timeline;
  };

  const timeline = calculateRunningBalance();
  const hasNegativeBalance = timeline.some(t => t.isNegative);
  const lowestBalance = Math.min(...timeline.map(t => t.balance));

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const renderCalendar = () => {
    const daysInMonth = 31; // Simplified for demo
    const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

    return (
      <div className="grid grid-cols-7 gap-1 mb-6">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} className={`p-2 text-center text-xs font-bold ${theme.textColors.muted}`}>
            {day}
          </div>
        ))}
        {days.map(day => {
          const dayEvents = events.filter(e => e.date === day);
          const dayBalance = timeline.find(t => t.date === day)?.balance;
          const isNegative = dayBalance !== undefined && dayBalance < 0;
          
          return (
            <div
              key={day}
              className={`relative p-2 min-h-[60px] border rounded text-center ${
                dayEvents.length > 0 
                  ? isNegative 
                    ? `${theme.status.error.bg} border-red-300` 
                    : `${theme.status.info.bg} border-blue-300`
                  : `${theme.backgrounds.card} ${theme.borderColors.muted}`
              }`}
            >
              <div className={`text-sm font-medium ${theme.textColors.primary} mb-1`}>{day}</div>
              {dayEvents.map((event, index) => (
                <div
                  key={index}
                  className={`text-xs p-1 rounded mb-1 ${
                    event.type === 'income' 
                      ? `${theme.status.success.bg} ${theme.status.success.text}`
                      : `${theme.status.warning.bg} ${theme.status.warning.text}`
                  }`}
                  title={`${event.name}: ${formatCurrency(event.amount)}`}
                >
                  {event.type === 'income' ? '+' : '-'}{formatCurrency(event.amount)}
                </div>
              ))}
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className={`p-6 ${theme.backgrounds.card} border ${theme.borderColors.primary} rounded-lg`}>
      <h3 className={`text-xl font-bold ${theme.textColors.primary} mb-4 flex items-center gap-2`}>
        <Calendar className="w-6 h-6" />
        Cash Flow Timing Analyzer
      </h3>
      
      <p className={`${theme.textColors.secondary} mb-6`}>
        Visualize when money comes in and goes out to prevent overdrafts and optimize your cash flow timing.
      </p>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className={`p-4 ${hasNegativeBalance ? theme.status.error.bg : theme.status.success.bg} rounded-lg`}>
          <div className="flex items-center justify-between mb-2">
            <span className={`text-sm font-medium ${hasNegativeBalance ? theme.status.error.text : theme.status.success.text}`}>
              Cash Flow Status
            </span>
            {hasNegativeBalance ? (
              <AlertTriangle className={`w-5 h-5 ${theme.status.error.text}`} />
            ) : (
              <CheckCircle className={`w-5 h-5 ${theme.status.success.text}`} />
            )}
          </div>
          <div className={`text-lg font-bold ${hasNegativeBalance ? theme.status.error.text : theme.status.success.text}`}>
            {hasNegativeBalance ? 'Needs Fixing' : 'Healthy'}
          </div>
        </div>

        <div className={`p-4 ${theme.status.info.bg} rounded-lg`}>
          <div className="flex items-center justify-between mb-2">
            <span className={`text-sm font-medium ${theme.status.info.text}`}>Lowest Balance</span>
            <TrendingDown className={`w-5 h-5 ${theme.status.info.text}`} />
          </div>
          <div className={`text-lg font-bold ${lowestBalance < 0 ? theme.status.error.text : theme.status.info.text}`}>
            {formatCurrency(lowestBalance)}
          </div>
        </div>

        <div className={`p-4 ${theme.status.warning.bg} rounded-lg`}>
          <div className="flex items-center justify-between mb-2">
            <span className={`text-sm font-medium ${theme.status.warning.text}`}>Buffer Needed</span>
            <Clock className={`w-5 h-5 ${theme.status.warning.text}`} />
          </div>
          <div className={`text-lg font-bold ${theme.status.warning.text}`}>
            {formatCurrency(Math.max(0, -lowestBalance + 500))}
          </div>
        </div>
      </div>

      {/* Calendar View */}
      <div className="mb-6">
        <h4 className={`font-bold ${theme.textColors.primary} mb-3`}>Monthly Cash Flow Calendar</h4>
        {renderCalendar()}
      </div>

      {/* Timeline */}
      <div className="mb-6">
        <h4 className={`font-bold ${theme.textColors.primary} mb-3`}>Cash Flow Timeline</h4>
        <div className="space-y-2 max-h-60 overflow-y-auto">
          {timeline.map((item, index) => (
            <div
              key={index}
              className={`flex items-center justify-between p-3 rounded-lg ${
                item.isNegative 
                  ? `${theme.status.error.bg} border-l-4 ${theme.status.error.border}`
                  : `${theme.backgrounds.glass} border-l-4 ${theme.status.success.border}`
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`text-sm font-medium ${theme.textColors.primary}`}>
                  Day {item.date}
                </div>
                <div className={`text-sm ${theme.textColors.secondary}`}>
                  {item.event}
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className={`text-sm font-medium ${
                  item.type === 'income' ? theme.status.success.text : theme.status.warning.text
                }`}>
                  {item.type === 'income' ? '+' : ''}{formatCurrency(item.change)}
                </div>
                <div className={`text-sm font-bold ${
                  item.isNegative ? theme.status.error.text : theme.textColors.primary
                }`}>
                  Balance: {formatCurrency(item.balance)}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add Event Form */}
      <div className="border-t pt-4">
        <div className="flex items-center justify-between mb-4">
          <h4 className={`font-bold ${theme.textColors.primary}`}>Manage Events</h4>
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className={`px-4 py-2 ${theme.buttons.primary} rounded-lg text-sm`}
          >
            {showAddForm ? 'Cancel' : 'Add Event'}
          </button>
        </div>

        {showAddForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className={`p-4 ${theme.backgrounds.glass} border ${theme.borderColors.primary} rounded-lg mb-4`}
          >
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <input
                type="text"
                placeholder="Event name"
                value={newEvent.name || ''}
                onChange={(e) => setNewEvent({ ...newEvent, name: e.target.value })}
                className={`px-3 py-2 border ${theme.borderColors.primary} rounded-lg`}
              />
              <input
                type="number"
                placeholder="Amount"
                value={newEvent.amount || ''}
                onChange={(e) => setNewEvent({ ...newEvent, amount: Number(e.target.value) })}
                className={`px-3 py-2 border ${theme.borderColors.primary} rounded-lg`}
              />
              <input
                type="number"
                placeholder="Day (1-31)"
                min="1"
                max="31"
                value={newEvent.date || ''}
                onChange={(e) => setNewEvent({ ...newEvent, date: Number(e.target.value) })}
                className={`px-3 py-2 border ${theme.borderColors.primary} rounded-lg`}
              />
              <select
                value={newEvent.type || 'expense'}
                onChange={(e) => setNewEvent({ ...newEvent, type: e.target.value as 'income' | 'expense' })}
                className={`px-3 py-2 border ${theme.borderColors.primary} rounded-lg`}
              >
                <option value="income">Income</option>
                <option value="expense">Expense</option>
              </select>
            </div>
            <button
              onClick={addEvent}
              className={`mt-3 px-4 py-2 ${theme.buttons.primary} rounded-lg text-sm`}
            >
              Add Event
            </button>
          </motion.div>
        )}

        {/* Event List */}
        <div className="space-y-2">
          {events.map((event) => (
            <div
              key={event.id}
              className={`flex items-center justify-between p-3 ${theme.backgrounds.glass} border ${theme.borderColors.primary} rounded-lg`}
            >
              <div className="flex items-center gap-3">
                <div className={`text-sm font-medium ${theme.textColors.primary}`}>
                  Day {event.date}
                </div>
                <div className={`text-sm ${theme.textColors.secondary}`}>
                  {event.name}
                </div>
                <div className={`text-sm font-medium ${
                  event.type === 'income' ? theme.status.success.text : theme.status.warning.text
                }`}>
                  {event.type === 'income' ? '+' : '-'}{formatCurrency(event.amount)}
                </div>
              </div>
              <button
                onClick={() => removeEvent(event.id)}
                className={`px-3 py-1 ${theme.status.error.bg} ${theme.status.error.text} rounded text-xs`}
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Recommendations */}
      {hasNegativeBalance && (
        <div className={`mt-6 p-4 ${theme.status.warning.bg} border-l-4 ${theme.status.warning.border} rounded-lg`}>
          <h4 className={`font-bold ${theme.status.warning.text} mb-2 flex items-center gap-2`}>
            <AlertTriangle className="w-5 h-5" />
            Cash Flow Optimization Tips
          </h4>
          <ul className={`text-sm ${theme.textColors.secondary} space-y-1`}>
            <li>• Contact creditors to align due dates with your paydays</li>
            <li>• Build a cash flow buffer of {formatCurrency(-lowestBalance + 500)} in checking</li>
            <li>• Consider bi-weekly payments to smooth cash flow</li>
            <li>• Set up automatic transfers on payday to prevent overspending</li>
          </ul>
        </div>
      )}
    </div>
  );
}
