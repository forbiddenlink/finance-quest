import React from 'react';
import { useDebtPayoffCalculator } from './useDebtPayoffCalculator';
import { DEBT_TYPES } from './utils';
import { DebtType, StyleConfig } from './types';
import {
  formatCurrency,
  formatPercentage,
  formatDate
} from './utils';

const styleConfig: StyleConfig = {
  avalanche: {
    background: 'bg-red-100',
    text: 'text-red-800',
    border: 'border-red-300'
  },
  snowball: {
    background: 'bg-blue-100',
    text: 'text-blue-800',
    border: 'border-blue-300'
  },
  custom: {
    background: 'bg-purple-100',
    text: 'text-purple-800',
    border: 'border-purple-300'
  }
} as const;

export default function DebtPayoffCalculator(): JSX.Element {
  const [state, actions] = useDebtPayoffCalculator();
  const {
    debts,
    extraPayment,
    payoffStrategy,
    validationErrors,
    results
  } = state;

  const {
    addDebt,
    removeDebt,
    updateDebt,
    updateExtraPayment,
    updatePayoffStrategy,
    calculatePayoff,
    reset
  } = actions;

  const getFieldError = (field: string): string | undefined => {
    return validationErrors.find(error => error.field === field)?.message;
  };

  return (
    <div className="space-y-8">
      {/* Debt List */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Your Debts</h3>
        
        {debts.map((debt, index) => (
          <div
            key={debt.id}
            className="p-4 border rounded-lg space-y-3"
          >
            <div className="flex justify-between items-center">
              <h4 className="font-medium">Debt {index + 1}</h4>
              {debts.length > 1 && (
                <button
                  onClick={() => removeDebt(debt.id)}
                  className="text-red-600 hover:text-red-800"
                >
                  Remove
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium">Name</label>
                <input
                  type="text"
                  value={debt.name}
                  onChange={(e) => updateDebt(debt.id, 'name', e.target.value)}
                  className="mt-1 w-full px-3 py-2 border rounded-md"
                  placeholder="e.g., Credit Card 1"
                />
                {getFieldError(`debt-${debt.id}-name`) && (
                  <p className="mt-1 text-sm text-red-600">
                    {getFieldError(`debt-${debt.id}-name`)}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium">Type</label>
                <select
                  value={debt.type}
                  onChange={(e) => updateDebt(debt.id, 'type', e.target.value as DebtType)}
                  className="mt-1 w-full px-3 py-2 border rounded-md"
                >
                  {Object.entries(DEBT_TYPES).map(([type, config]) => (
                    <option key={type} value={type}>
                      {config.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium">Balance</label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-gray-500 sm:text-sm">$</span>
                  </div>
                  <input
                    type="number"
                    value={debt.balance || ''}
                    onChange={(e) => updateDebt(debt.id, 'balance', e.target.value)}
                    className="pl-7 w-full px-3 py-2 border rounded-md"
                    min="0"
                    step="0.01"
                  />
                </div>
                {getFieldError(`debt-${debt.id}-balance`) && (
                  <p className="mt-1 text-sm text-red-600">
                    {getFieldError(`debt-${debt.id}-balance`)}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium">Interest Rate (%)</label>
                <input
                  type="number"
                  value={debt.interestRate || ''}
                  onChange={(e) => updateDebt(debt.id, 'interestRate', e.target.value)}
                  className="mt-1 w-full px-3 py-2 border rounded-md"
                  min="0"
                  max="100"
                  step="0.01"
                />
                {getFieldError(`debt-${debt.id}-rate`) && (
                  <p className="mt-1 text-sm text-red-600">
                    {getFieldError(`debt-${debt.id}-rate`)}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium">Minimum Payment</label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-gray-500 sm:text-sm">$</span>
                  </div>
                  <input
                    type="number"
                    value={debt.minimumPayment || ''}
                    onChange={(e) => updateDebt(debt.id, 'minimumPayment', e.target.value)}
                    className="pl-7 w-full px-3 py-2 border rounded-md"
                    min="0"
                    step="0.01"
                  />
                </div>
                {getFieldError(`debt-${debt.id}-minimum`) && (
                  <p className="mt-1 text-sm text-red-600">
                    {getFieldError(`debt-${debt.id}-minimum`)}
                  </p>
                )}
              </div>

              {payoffStrategy === 'custom' && (
                <div>
                  <label className="block text-sm font-medium">Priority (Optional)</label>
                  <input
                    type="number"
                    value={debt.priority || ''}
                    onChange={(e) => updateDebt(debt.id, 'priority', e.target.value)}
                    className="mt-1 w-full px-3 py-2 border rounded-md"
                    min="0"
                    step="1"
                  />
                </div>
              )}
            </div>
          </div>
        ))}

        <button
          onClick={addDebt}
          className="mt-4 px-4 py-2 border border-blue-500 text-blue-500 rounded hover:bg-blue-50"
        >
          Add Another Debt
        </button>
      </div>

      {/* Extra Payment */}
      <div>
        <label className="block text-sm font-medium">Extra Monthly Payment</label>
        <div className="mt-1 relative rounded-md shadow-sm">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <span className="text-gray-500 sm:text-sm">$</span>
          </div>
          <input
            type="number"
            value={extraPayment}
            onChange={(e) => updateExtraPayment(e.target.value)}
            className="pl-7 w-full px-3 py-2 border rounded-md"
            min="0"
            step="0.01"
          />
        </div>
        {getFieldError('extra-payment') && (
          <p className="mt-1 text-sm text-red-600">
            {getFieldError('extra-payment')}
          </p>
        )}
      </div>

      {/* Payoff Strategy */}
      <div>
        <label className="block text-sm font-medium">Payoff Strategy</label>
        <div className="mt-2 space-x-4">
          <button
            onClick={() => updatePayoffStrategy('avalanche')}
            className={`px-4 py-2 rounded ${
              payoffStrategy === 'avalanche'
                ? `${styleConfig.avalanche.background} ${styleConfig.avalanche.text} ${styleConfig.avalanche.border}`
                : 'bg-gray-100 text-gray-700 border-gray-300'
            }`}
          >
            Debt Avalanche
          </button>
          <button
            onClick={() => updatePayoffStrategy('snowball')}
            className={`px-4 py-2 rounded ${
              payoffStrategy === 'snowball'
                ? `${styleConfig.snowball.background} ${styleConfig.snowball.text} ${styleConfig.snowball.border}`
                : 'bg-gray-100 text-gray-700 border-gray-300'
            }`}
          >
            Debt Snowball
          </button>
          <button
            onClick={() => updatePayoffStrategy('custom')}
            className={`px-4 py-2 rounded ${
              payoffStrategy === 'custom'
                ? `${styleConfig.custom.background} ${styleConfig.custom.text} ${styleConfig.custom.border}`
                : 'bg-gray-100 text-gray-700 border-gray-300'
            }`}
          >
            Custom Priority
          </button>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex space-x-4">
        <button
          onClick={calculatePayoff}
          disabled={validationErrors.length > 0}
          className={`px-6 py-2 rounded ${
            validationErrors.length === 0
              ? 'bg-blue-600 text-white hover:bg-blue-700'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          Calculate Payoff Plan
        </button>
        <button
          onClick={reset}
          className="px-6 py-2 rounded border border-gray-300 hover:bg-gray-100"
        >
          Reset
        </button>
      </div>

      {/* Results */}
      {results && (
        <div className="space-y-6">
          <div className="p-6 bg-white rounded-lg border space-y-4">
            <h3 className="text-xl font-semibold">Payoff Summary</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-4 bg-gray-50 rounded">
                <div className="text-sm text-gray-600">Total Payment</div>
                <div className="text-lg font-semibold">{formatCurrency(results.totalPayment)}</div>
              </div>
              
              <div className="p-4 bg-gray-50 rounded">
                <div className="text-sm text-gray-600">Interest Paid</div>
                <div className="text-lg font-semibold">{formatCurrency(results.totalInterestPaid)}</div>
              </div>
              
              <div className="p-4 bg-gray-50 rounded">
                <div className="text-sm text-gray-600">Interest Saved</div>
                <div className="text-lg font-semibold text-green-600">
                  {formatCurrency(results.totalInterestSaved)}
                </div>
              </div>
              
              <div className="p-4 bg-gray-50 rounded">
                <div className="text-sm text-gray-600">Payoff Date</div>
                <div className="text-lg font-semibold">{formatDate(results.payoffDate)}</div>
              </div>
            </div>

            <div>
              <h4 className="font-medium mb-2">Payoff Order</h4>
              <div className="space-y-2">
                {results.debtPayoffOrder.map((debtId, index) => {
                  const debt = debts.find(d => d.id === debtId);
                  return debt ? (
                    <div
                      key={debtId}
                      className="flex items-center space-x-2"
                    >
                      <span className="font-medium">{index + 1}.</span>
                      <span>{debt.name}</span>
                      <span className="text-gray-500">
                        ({formatCurrency(debt.balance)} at {formatPercentage(debt.interestRate)})
                      </span>
                    </div>
                  ) : null;
                })}
              </div>
            </div>
          </div>

          {/* Payment Schedule */}
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Month
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Debt
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Payment
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Principal
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Interest
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Remaining
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {results.paymentSchedule.map((payment, index) => {
                  const debt = debts.find(d => d.id === payment.debtId);
                  return debt ? (
                    <tr key={`${payment.debtId}-${index}`}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {payment.month}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {debt.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatCurrency(payment.payment)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatCurrency(payment.principalPaid)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatCurrency(payment.interestPaid)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatCurrency(payment.endingBalance)}
                      </td>
                    </tr>
                  ) : null;
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
