'use client';

import React from 'react';
import { Activity, Target, AlertTriangle, DollarSign } from 'lucide-react';
import { theme } from '@/lib/theme';
import { TechnicalAnalysisToolProps } from './types';
import { useTechnicalAnalysis } from './useTechnicalAnalysis';
import {
  formatCurrency,
  formatPercent,
  getSignalColor,
  getTrendColor,
  getSignalTypeColor,
  getRiskLevelColor
} from './utils';

export default function TechnicalAnalysisTool(props: TechnicalAnalysisToolProps) {
  const {
    symbol,
    setSymbol,
    currentPrice,
    setCurrentPrice,
    timeframe,
    setTimeframe,
    lookbackPeriod,
    setLookbackPeriod,
    rsiPeriod,
    setRsiPeriod,
    macdFast,
    setMacdFast,
    macdSlow,
    setMacdSlow,
    macdSignal,
    setMacdSignal,
    bollingerPeriod,
    setBollingerPeriod,
    bollingerStdDev,
    setBollingerStdDev,
    analysis
  } = useTechnicalAnalysis(props);

  return (
    <div className={`p-6 ${theme.backgrounds.card} border ${theme.borderColors.primary} rounded-lg`}>
      <div className="flex items-center gap-3 mb-6">
        <Activity className="w-6 h-6 text-orange-400" />
        <h2 className={`text-xl font-bold ${theme.textColors.primary}`}>
          Technical Analysis Tool
        </h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Input Section */}
        <div className="space-y-6">
          {/* Symbol and Price */}
          <div>
            <h3 className={`text-lg font-semibold ${theme.textColors.primary} mb-4`}>
              Stock Symbol & Price
            </h3>
            
            <div className="space-y-4">
              <div>
                <label htmlFor="stock-symbol" className={`block text-sm font-medium ${theme.textColors.primary} mb-2`}>
                  Stock Symbol
                </label>
                <input
                  id="stock-symbol"
                  type="text"
                  value={symbol}
                  onChange={(e) => setSymbol(e.target.value.toUpperCase())}
                  className={`w-full px-4 py-2 bg-slate-800 border border-slate-600 rounded-lg ${theme.textColors.primary} focus:border-blue-500 focus:outline-none`}
                  placeholder="AAPL"
                />
              </div>

              <div>
                <label htmlFor="current-price" className={`block text-sm font-medium ${theme.textColors.primary} mb-2`}>
                  Current Price
                </label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    id="current-price"
                    type="number"
                    step="0.01"
                    value={currentPrice}
                    onChange={(e) => setCurrentPrice(Number(e.target.value))}
                    className={`w-full pl-10 pr-4 py-2 bg-slate-800 border border-slate-600 rounded-lg ${theme.textColors.primary} focus:border-blue-500 focus:outline-none`}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label htmlFor="timeframe" className={`block text-sm font-medium ${theme.textColors.primary} mb-2`}>
                    Timeframe
                  </label>
                  <select
                    id="timeframe"
                    value={timeframe}
                    onChange={(e) => setTimeframe(e.target.value as 'daily' | 'weekly' | 'monthly')}
                    className={`w-full px-4 py-2 bg-slate-800 border border-slate-600 rounded-lg ${theme.textColors.primary} focus:border-blue-500 focus:outline-none`}
                  >
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="lookback-days" className={`block text-sm font-medium ${theme.textColors.primary} mb-2`}>
                    Lookback Days
                  </label>
                  <input
                    id="lookback-days"
                    type="number"
                    min="50"
                    max="500"
                    value={lookbackPeriod}
                    onChange={(e) => setLookbackPeriod(Number(e.target.value))}
                    className={`w-full px-4 py-2 bg-slate-800 border border-slate-600 rounded-lg ${theme.textColors.primary} focus:border-blue-500 focus:outline-none`}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Technical Parameters */}
          <div>
            <h3 className={`text-lg font-semibold ${theme.textColors.primary} mb-4`}>
              Technical Parameters
            </h3>
            
            <div className="space-y-4">
              <div>
                <label htmlFor="rsi-period" className={`block text-sm font-medium ${theme.textColors.primary} mb-2`}>
                  RSI Period
                </label>
                <input
                  id="rsi-period"
                  type="number"
                  min="5"
                  max="50"
                  value={rsiPeriod}
                  onChange={(e) => setRsiPeriod(Number(e.target.value))}
                  className={`w-full px-4 py-2 bg-slate-800 border border-slate-600 rounded-lg ${theme.textColors.primary} focus:border-blue-500 focus:outline-none`}
                />
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label htmlFor="macd-fast" className={`block text-xs font-medium ${theme.textColors.primary} mb-1`}>
                    MACD Fast
                  </label>
                  <input
                    id="macd-fast"
                    type="number"
                    min="5"
                    max="20"
                    value={macdFast}
                    onChange={(e) => setMacdFast(Number(e.target.value))}
                    className={`w-full px-2 py-1 bg-slate-800 border border-slate-600 rounded text-xs ${theme.textColors.primary} focus:border-blue-500 focus:outline-none`}
                  />
                </div>

                <div>
                  <label htmlFor="macd-slow" className={`block text-xs font-medium ${theme.textColors.primary} mb-1`}>
                    MACD Slow
                  </label>
                  <input
                    id="macd-slow"
                    type="number"
                    min="20"
                    max="40"
                    value={macdSlow}
                    onChange={(e) => setMacdSlow(Number(e.target.value))}
                    className={`w-full px-2 py-1 bg-slate-800 border border-slate-600 rounded text-xs ${theme.textColors.primary} focus:border-blue-500 focus:outline-none`}
                  />
                </div>

                <div>
                  <label className={`block text-xs font-medium ${theme.textColors.primary} mb-1`}>
                    Signal
                  </label>
                  <input
                    type="number"
                    min="5"
                    max="15"
                    value={macdSignal}
                    onChange={(e) => setMacdSignal(Number(e.target.value))}
                    className={`w-full px-2 py-1 bg-slate-800 border border-slate-600 rounded text-xs ${theme.textColors.primary} focus:border-blue-500 focus:outline-none`}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label 
                    htmlFor="bollinger-period"
                    className={`block text-sm font-medium ${theme.textColors.primary} mb-2`}
                  >
                    Bollinger Period
                  </label>
                  <input
                    id="bollinger-period"
                    type="number"
                    min="10"
                    max="50"
                    value={bollingerPeriod}
                    onChange={(e) => setBollingerPeriod(Number(e.target.value))}
                    className={`w-full px-3 py-2 bg-slate-800 border border-slate-600 rounded-lg ${theme.textColors.primary} focus:border-blue-500 focus:outline-none`}
                  />
                </div>

                <div>
                  <label 
                    htmlFor="bollinger-std-dev"
                    className={`block text-sm font-medium ${theme.textColors.primary} mb-2`}
                  >
                    Std Deviation
                  </label>
                  <input
                    id="bollinger-std-dev"
                    type="number"
                    step="0.1"
                    min="1"
                    max="3"
                    value={bollingerStdDev}
                    onChange={(e) => setBollingerStdDev(Number(e.target.value))}
                    className={`w-full px-3 py-2 bg-slate-800 border border-slate-600 rounded-lg ${theme.textColors.primary} focus:border-blue-500 focus:outline-none`}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Results Section */}
        <div className="lg:col-span-2 space-y-6">
          {analysis && (
            <>
              {/* Overall Analysis */}
              <div className={`p-6 border ${theme.borderColors.primary} rounded-lg bg-slate-800/50`}>
                <div className="flex items-center justify-between mb-4">
                  <h3 className={`text-xl font-semibold ${theme.textColors.primary}`}>
                    {symbol} Technical Analysis
                  </h3>
                  <div className={`px-4 py-2 rounded-lg font-semibold ${getSignalColor(analysis.overallSignal)}`}>
                    {analysis.overallSignal}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <div className={`text-2xl font-bold ${theme.textColors.primary} mb-1`}>
                      {formatCurrency(analysis.currentPrice)}
                    </div>
                    <div className={`text-sm ${theme.textColors.secondary}`}>Current Price</div>
                  </div>

                  <div className="text-center">
                    <div className={`text-xl font-bold ${getTrendColor(analysis.trend)} mb-1`}>
                      {analysis.trend}
                    </div>
                    <div className={`text-sm ${theme.textColors.secondary}`}>Trend</div>
                  </div>

                  <div className="text-center">
                    <div className={`text-xl font-bold ${theme.textColors.primary} mb-1`}>
                      {analysis.signalScore.toFixed(0)}
                    </div>
                    <div className={`text-sm ${theme.textColors.secondary}`}>Signal Score</div>
                  </div>

                  <div className="text-center">
                    <div className={`px-3 py-1 rounded-lg text-sm font-semibold ${getRiskLevelColor(analysis.riskLevel)}`}>
                      {analysis.riskLevel}
                    </div>
                    <div className={`text-sm ${theme.textColors.secondary} mt-1`}>Risk Level</div>
                  </div>
                </div>

                <div className="mt-6 pt-6 border-t border-slate-600">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <span className={`${theme.textColors.secondary}`}>Volatility:</span>
                      <div className={`font-semibold ${theme.textColors.primary}`}>
                        {formatPercent(analysis.volatility)}
                      </div>
                    </div>
                    <div>
                      <span className={`${theme.textColors.secondary}`}>Support:</span>
                      <div className={`font-semibold text-green-400`}>
                        {formatCurrency(analysis.supportResistance.nextSupport)}
                      </div>
                    </div>
                    <div>
                      <span className={`${theme.textColors.secondary}`}>Resistance:</span>
                      <div className={`font-semibold text-red-400`}>
                        {formatCurrency(analysis.supportResistance.nextResistance)}
                      </div>
                    </div>
                    <div>
                      <span className={`${theme.textColors.secondary}`}>Volume Trend:</span>
                      <div className={`font-semibold ${theme.textColors.primary}`}>
                        {analysis.volume.volumeTrend}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Key Indicators */}
              <div className={`border ${theme.borderColors.primary} rounded-lg overflow-hidden`}>
                <div className={`bg-slate-800 px-4 py-3 border-b ${theme.borderColors.primary}`}>
                  <h3 className={`font-semibold ${theme.textColors.primary}`}>
                    Key Technical Indicators
                  </h3>
                </div>
                
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className={`bg-slate-700/50 ${theme.textColors.secondary}`}>
                      <tr>
                        <th scope="col" className="px-4 py-3 text-left">Indicator</th>
                        <th scope="col" className="px-4 py-3 text-left">Value</th>
                        <th scope="col" className="px-4 py-3 text-left">Signal</th>
                        <th scope="col" className="px-4 py-3 text-left">Strength</th>
                        <th scope="col" className="px-4 py-3 text-left">Description</th>
                      </tr>
                    </thead>
                    <tbody>
                      {analysis.indicators.map((indicator, index) => (
                        <tr key={index} className={`border-t ${theme.borderColors.primary}`}>
                          <td className={`px-4 py-3 ${theme.textColors.primary} font-medium`}>
                            {indicator.name}
                          </td>
                          <td className={`px-4 py-3 ${theme.textColors.primary}`}>
                            {indicator.value.toFixed(2)}
                          </td>
                          <td className={`px-4 py-3`}>
                            <span className={`px-2 py-1 rounded text-xs font-semibold ${getSignalColor(indicator.signal)}`}>
                              {indicator.signal}
                            </span>
                          </td>
                          <td className={`px-4 py-3`}>
                            <div className="flex items-center gap-2">
                              <div className="w-16 bg-slate-700 rounded-full h-2">
                                <div 
                                  className="bg-blue-500 h-2 rounded-full"
                                  style={{ width: `${Math.min(indicator.strength, 100)}%` }}
                                />
                              </div>
                              <span className={`text-xs ${theme.textColors.secondary}`}>
                                {indicator.strength.toFixed(0)}%
                              </span>
                            </div>
                          </td>
                          <td className={`px-4 py-3 ${theme.textColors.secondary}`}>
                            {indicator.description}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Moving Averages & MACD */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className={`p-4 border ${theme.borderColors.primary} rounded-lg bg-slate-800/30`}>
                  <h4 className={`font-semibold ${theme.textColors.primary} mb-3`}>
                    Moving Averages
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className={`${theme.textColors.secondary}`}>SMA 20:</span>
                      <span className={`font-semibold ${analysis.currentPrice > analysis.movingAverages.sma20 ? 'text-green-400' : 'text-red-400'}`}>
                        {formatCurrency(analysis.movingAverages.sma20)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className={`${theme.textColors.secondary}`}>SMA 50:</span>
                      <span className={`font-semibold ${analysis.currentPrice > analysis.movingAverages.sma50 ? 'text-green-400' : 'text-red-400'}`}>
                        {formatCurrency(analysis.movingAverages.sma50)}
                      </span>
                    </div>
                    {analysis.movingAverages.sma200 > 0 && (
                      <div className="flex justify-between">
                        <span className={`${theme.textColors.secondary}`}>SMA 200:</span>
                        <span className={`font-semibold ${analysis.currentPrice > analysis.movingAverages.sma200 ? 'text-green-400' : 'text-red-400'}`}>
                          {formatCurrency(analysis.movingAverages.sma200)}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                <div className={`p-4 border ${theme.borderColors.primary} rounded-lg bg-slate-800/30`}>
                  <h4 className={`font-semibold ${theme.textColors.primary} mb-3`}>
                    MACD Analysis
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className={`${theme.textColors.secondary}`}>MACD Line:</span>
                      <span className={`font-semibold ${analysis.movingAverages.macdLine > 0 ? 'text-green-400' : 'text-red-400'}`}>
                        {analysis.movingAverages.macdLine.toFixed(3)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className={`${theme.textColors.secondary}`}>Signal Line:</span>
                      <span className={`font-semibold ${theme.textColors.primary}`}>
                        {analysis.movingAverages.signalLine.toFixed(3)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className={`${theme.textColors.secondary}`}>Histogram:</span>
                      <span className={`font-semibold ${analysis.movingAverages.histogram > 0 ? 'text-green-400' : 'text-red-400'}`}>
                        {analysis.movingAverages.histogram.toFixed(3)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Oscillators */}
              <div className={`p-4 border ${theme.borderColors.primary} rounded-lg bg-slate-800/30`}>
                <h4 className={`font-semibold ${theme.textColors.primary} mb-3`}>
                  Oscillators
                </h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div className="text-center">
                    <div className={`text-lg font-bold ${analysis.oscillators.rsi > 70 ? 'text-red-400' : analysis.oscillators.rsi < 30 ? 'text-green-400' : theme.textColors.primary} mb-1`}>
                      {analysis.oscillators.rsi.toFixed(1)}
                    </div>
                    <div className={`text-xs ${theme.textColors.secondary}`}>RSI ({rsiPeriod})</div>
                  </div>

                  <div className="text-center">
                    <div className={`text-lg font-bold ${analysis.oscillators.stochastic > 80 ? 'text-red-400' : analysis.oscillators.stochastic < 20 ? 'text-green-400' : theme.textColors.primary} mb-1`}>
                      {analysis.oscillators.stochastic.toFixed(1)}
                    </div>
                    <div className={`text-xs ${theme.textColors.secondary}`}>Stochastic</div>
                  </div>

                  <div className="text-center">
                    <div className={`text-lg font-bold ${theme.textColors.primary} mb-1`}>
                      {analysis.oscillators.williamsR.toFixed(1)}
                    </div>
                    <div className={`text-xs ${theme.textColors.secondary}`}>Williams %R</div>
                  </div>

                  <div className="text-center">
                    <div className={`text-lg font-bold ${theme.textColors.primary} mb-1`}>
                      {analysis.oscillators.commodityChannelIndex.toFixed(1)}
                    </div>
                    <div className={`text-xs ${theme.textColors.secondary}`}>CCI</div>
                  </div>
                </div>
              </div>

              {/* Trading Signals */}
              <div className={`border ${theme.borderColors.primary} rounded-lg overflow-hidden`}>
                <div className={`bg-slate-800 px-4 py-3 border-b ${theme.borderColors.primary}`}>
                  <h3 className={`font-semibold ${theme.textColors.primary}`}>
                    Trading Signals
                  </h3>
                </div>
                
                <div className="p-4 space-y-3">
                  {analysis.signals.map((signal, index) => (
                    <div key={index} className={`p-3 border ${theme.borderColors.primary} rounded-lg bg-slate-700/30`}>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className={`font-semibold ${getSignalTypeColor(signal.type)}`}>
                            {signal.signal}
                          </span>
                          <span className={`px-2 py-1 rounded text-xs font-semibold ${getSignalTypeColor(signal.type)} bg-opacity-20`}>
                            {signal.type}
                          </span>
                        </div>
                        <span className={`text-xs ${theme.textColors.secondary} px-2 py-1 bg-slate-600 rounded`}>
                          {signal.strength}
                        </span>
                      </div>
                      <p className={`text-sm ${theme.textColors.secondary}`}>
                        {signal.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recommendations */}
              <div className={`p-4 bg-blue-900/20 border border-blue-500/20 rounded-lg`}>
                <div className="flex items-start gap-3">
                  <Target className="w-5 h-5 text-blue-400 mt-0.5" />
                  <div>
                    <h4 className={`font-semibold text-blue-400 mb-2`}>
                      Trading Recommendations
                    </h4>
                    <ul className={`space-y-1 text-sm ${theme.textColors.secondary}`}>
                      {analysis.recommendations.map((rec, index) => (
                        <li key={index}>• {rec}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              {/* Warnings */}
              {analysis.warnings.length > 0 && (
                <div className={`p-4 bg-yellow-900/20 border border-yellow-500/20 rounded-lg`}>
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 text-yellow-400 mt-0.5" />
                    <div>
                      <h4 className={`font-semibold text-yellow-400 mb-2`}>
                        Risk Warnings
                      </h4>
                      <ul className={`space-y-1 text-sm ${theme.textColors.secondary}`}>
                        {analysis.warnings.map((warning, index) => (
                          <li key={index}>• {warning}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              )}

              {/* Technical Analysis Education */}
              <div className={`p-4 bg-purple-900/20 border border-purple-500/20 rounded-lg`}>
                <h4 className={`font-semibold text-purple-400 mb-2`}>
                  Technical Analysis Concepts
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className={`${theme.textColors.secondary} mb-2`}><strong>Key Indicators:</strong></p>
                    <ul className={`space-y-1 ${theme.textColors.secondary}`}>
                      <li>• <strong>RSI:</strong> Measures overbought (&gt;70) and oversold (&lt;30) conditions</li>
                      <li>• <strong>MACD:</strong> Shows relationship between two moving averages</li>
                      <li>• <strong>Bollinger Bands:</strong> Price volatility and potential reversal levels</li>
                      <li>• <strong>Moving Averages:</strong> Trend direction and support/resistance</li>
                    </ul>
                  </div>
                  <div>
                    <p className={`${theme.textColors.secondary} mb-2`}><strong>Trading Tips:</strong></p>
                    <ul className={`space-y-1 ${theme.textColors.secondary}`}>
                      <li>• <strong>Confirmation:</strong> Use multiple indicators to confirm signals</li>
                      <li>• <strong>Risk Management:</strong> Always set stop-losses and position sizes</li>
                      <li>• <strong>Volume:</strong> High volume confirms price movements</li>
                      <li>• <strong>Trend:</strong> Trade with the trend, not against it</li>
                    </ul>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

