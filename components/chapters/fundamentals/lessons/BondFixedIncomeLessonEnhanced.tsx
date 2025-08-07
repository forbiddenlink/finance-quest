'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { 
  Shield, 
  TrendingUp, 
  Target, 
  AlertTriangle, 
  DollarSign, 
  BarChart3,
  CheckCircle,
  ArrowRight,
  Info,
  Lightbulb
} from 'lucide-react';
import { theme } from '@/lib/theme';
import { useProgressStore } from '@/lib/store/progressStore';

interface BondFixedIncomeLessonEnhancedProps {
  onComplete?: () => void;
}

export default function BondFixedIncomeLessonEnhanced({ onComplete }: BondFixedIncomeLessonEnhancedProps) {
  const [currentLesson, setCurrentLesson] = useState(0);
  const [completedLessons, setCompletedLessons] = useState<boolean[]>(new Array(6).fill(false));
  
  // Progress store integration
  const { completeLesson, recordCalculatorUsage } = useProgressStore();

  // Record calculator usage on mount
  useEffect(() => {
    recordCalculatorUsage('bond-fixed-income-lesson');
  }, [recordCalculatorUsage]);

  const lessons = [
    {
      id: 1,
      title: "Understanding Bonds & Fixed Income Fundamentals",
      icon: Shield,
      content: (
        <div className="space-y-6">
          <div className={`${theme.status.info.bg}/10 border ${theme.status.info.border} p-6 rounded-lg`}>
            <h4 className={`font-semibold ${theme.textColors.primary} mb-3 flex items-center`}>
              <Info className={`w-5 h-5 ${theme.status.info.text} mr-2`} />
              What Are Bonds?
            </h4>
            <p className={`${theme.textColors.secondary} mb-4`}>
              Bonds are essentially IOUs - when you buy a bond, you&apos;re lending money to a government, 
              municipality, or corporation. In return, they promise to pay you back the principal 
              (face value) plus regular interest payments (coupons).
            </p>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <h5 className={`font-medium ${theme.textColors.primary}`}>Key Components:</h5>
                <ul className={`space-y-2 text-sm ${theme.textColors.secondary}`}>
                  <li>• <span className="font-medium">Face Value:</span> Amount paid at maturity ($1,000 typical)</li>
                  <li>• <span className="font-medium">Coupon Rate:</span> Annual interest rate (e.g., 5%)</li>
                  <li>• <span className="font-medium">Maturity:</span> When principal is repaid</li>
                  <li>• <span className="font-medium">Credit Rating:</span> Risk assessment (AAA to D)</li>
                </ul>
              </div>
              <div className="space-y-3">
                <h5 className={`font-medium ${theme.textColors.primary}`}>Example:</h5>
                <div className={`p-3 ${theme.backgrounds.card} rounded border`}>
                  <p className={`text-sm ${theme.textColors.secondary}`}>
                    $1,000 bond, 5% coupon, 10-year maturity<br/>
                    Annual payment: $50<br/>
                    Total received: $1,500 over 10 years
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className={`p-4 ${theme.status.success.bg}/10 border ${theme.status.success.border} rounded-lg`}>
              <h5 className={`font-medium ${theme.status.success.text} mb-2`}>Advantages</h5>
              <ul className={`space-y-1 text-sm ${theme.status.success.text}/80`}>
                <li>• Predictable income stream</li>
                <li>• Principal protection (if held to maturity)</li>
                <li>• Portfolio diversification</li>
                <li>• Lower volatility than stocks</li>
              </ul>
            </div>
            <div className={`p-4 ${theme.status.warning.bg}/10 border ${theme.status.warning.border} rounded-lg`}>
              <h5 className={`font-medium ${theme.status.warning.text} mb-2`}>Considerations</h5>
              <ul className={`space-y-1 text-sm ${theme.status.warning.text}/80`}>
                <li>• Interest rate risk</li>
                <li>• Inflation risk</li>
                <li>• Credit risk</li>
                <li>• Lower long-term returns vs stocks</li>
              </ul>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 2,
      title: "Types of Bonds & Their Characteristics",
      icon: BarChart3,
      content: (
        <div className="space-y-6">
          <div className="grid md:grid-cols-2 gap-4">
            <div className={`p-4 border ${theme.borderColors.primary} rounded-lg`}>
              <h5 className={`font-medium ${theme.textColors.primary} mb-3 flex items-center`}>
                <Shield className={`w-4 h-4 ${theme.status.success.text} mr-2`} />
                Government Bonds (Treasuries)
              </h5>
              <ul className={`space-y-2 text-sm ${theme.textColors.secondary}`}>
                <li>• <span className="font-medium">T-Bills:</span> 1 year or less</li>
                <li>• <span className="font-medium">T-Notes:</span> 2-10 years</li>
                <li>• <span className="font-medium">T-Bonds:</span> 20-30 years</li>
                <li>• <span className="font-medium">TIPS:</span> Inflation-protected</li>
              </ul>
              <div className={`mt-3 p-2 ${theme.status.success.bg}/10 rounded text-xs ${theme.status.success.text}`}>
                Safest option - backed by U.S. government
              </div>
            </div>

            <div className={`p-4 border ${theme.borderColors.primary} rounded-lg`}>
              <h5 className={`font-medium ${theme.textColors.primary} mb-3 flex items-center`}>
                <Target className={`w-4 h-4 ${theme.status.info.text} mr-2`} />
                Corporate Bonds
              </h5>
              <ul className={`space-y-2 text-sm ${theme.textColors.secondary}`}>
                <li>• <span className="font-medium">Investment Grade:</span> BBB+ and above</li>
                <li>• <span className="font-medium">High Yield:</span> BB+ and below (junk)</li>
                <li>• <span className="font-medium">Convertible:</span> Can convert to stock</li>
                <li>• <span className="font-medium">Callable:</span> Can be redeemed early</li>
              </ul>
              <div className={`mt-3 p-2 ${theme.status.warning.bg}/10 rounded text-xs ${theme.status.warning.text}`}>
                Higher yields but more credit risk
              </div>
            </div>

            <div className={`p-4 border ${theme.borderColors.primary} rounded-lg`}>
              <h5 className={`font-medium ${theme.textColors.primary} mb-3 flex items-center`}>
                <DollarSign className={`w-4 h-4 ${theme.status.info.text} mr-2`} />
                Municipal Bonds
              </h5>
              <ul className={`space-y-2 text-sm ${theme.textColors.secondary}`}>
                <li>• <span className="font-medium">General Obligation:</span> Backed by taxes</li>
                <li>• <span className="font-medium">Revenue:</span> Backed by project income</li>
                <li>• <span className="font-medium">Tax-Free:</span> Federal, sometimes state</li>
                <li>• <span className="font-medium">Taxable Equivalent:</span> Higher effective yield</li>
              </ul>
              <div className={`mt-3 p-2 ${theme.status.success.bg}/10 rounded text-xs ${theme.status.success.text}`}>
                Tax advantages for high earners
              </div>
            </div>

            <div className={`p-4 border ${theme.borderColors.primary} rounded-lg`}>
              <h5 className={`font-medium ${theme.textColors.primary} mb-3 flex items-center`}>
                <TrendingUp className={`w-4 h-4 ${theme.status.warning.text} mr-2`} />
                International Bonds
              </h5>
              <ul className={`space-y-2 text-sm ${theme.textColors.secondary}`}>
                <li>• <span className="font-medium">Foreign Government:</span> Sovereign debt</li>
                <li>• <span className="font-medium">Emerging Markets:</span> Higher risk/return</li>
                <li>• <span className="font-medium">Currency Risk:</span> Exchange rate impact</li>
                <li>• <span className="font-medium">Diversification:</span> Global exposure</li>
              </ul>
              <div className={`mt-3 p-2 ${theme.status.warning.bg}/10 rounded text-xs ${theme.status.warning.text}`}>
                Currency and political risks
              </div>
            </div>
          </div>

          <div className={`${theme.status.info.bg}/10 border ${theme.status.info.border} p-4 rounded-lg`}>
            <h5 className={`font-medium ${theme.textColors.primary} mb-2`}>Real Money Example:</h5>
            <p className={`text-sm ${theme.textColors.secondary}`}>
              Sarah, a high earner in California (39.6% federal + 13.3% state = 52.9% marginal tax rate), 
              compares a 4% municipal bond vs 6% corporate bond:<br/>
              • Corporate bond after-tax yield: 6% × (1 - 0.529) = 2.83%<br/>
              • Municipal bond yield: 4% (tax-free) = 4%<br/>
              The &quot;lower&quot; yielding muni bond actually provides 42% more after-tax income!
            </p>
          </div>
        </div>
      )
    },
    {
      id: 3,
      title: "Interest Rate Risk & Duration Analysis",
      icon: TrendingUp,
      content: (
        <div className="space-y-6">
          <div className={`${theme.status.warning.bg}/10 border ${theme.status.warning.border} p-6 rounded-lg`}>
            <h4 className={`font-semibold ${theme.textColors.primary} mb-3 flex items-center`}>
              <AlertTriangle className={`w-5 h-5 ${theme.status.warning.text} mr-2`} />
              The Inverse Relationship
            </h4>
            <p className={`${theme.textColors.secondary} mb-4`}>
              When interest rates rise, bond prices fall. When rates fall, bond prices rise. 
              This fundamental relationship affects all fixed-income investments and determines 
              the volatility of your bond portfolio.
            </p>
            <div className="grid md:grid-cols-2 gap-4">
              <div className={`p-4 ${theme.status.error.bg}/10 border ${theme.status.error.border} rounded-lg`}>
                <h5 className={`font-medium ${theme.status.error.text} mb-2`}>Rising Rates Impact</h5>
                <p className={`text-sm ${theme.status.error.text}/80 mb-2`}>
                  Your 3% bond becomes less attractive when new bonds offer 5%. 
                  To sell early, you&apos;d need to offer a discount.
                </p>
                <div className={`text-xs ${theme.status.error.text} font-mono`}>
                  Example: $1,000 bond @ 3% → Market rate 5% → Bond value ~$840
                </div>
              </div>
              <div className={`p-4 ${theme.status.success.bg}/10 border ${theme.status.success.border} rounded-lg`}>
                <h5 className={`font-medium ${theme.status.success.text} mb-2`}>Falling Rates Impact</h5>
                <p className={`text-sm ${theme.status.success.text}/80 mb-2`}>
                  Your 5% bond becomes very attractive when new bonds only offer 3%. 
                  You could sell at a premium.
                </p>
                <div className={`text-xs ${theme.status.success.text} font-mono`}>
                  Example: $1,000 bond @ 5% → Market rate 3% → Bond value ~$1,170
                </div>
              </div>
            </div>
          </div>

          <div>
            <h4 className={`font-semibold ${theme.textColors.primary} mb-4`}>Understanding Duration</h4>
            <div className="space-y-4">
              <div className={`p-4 border ${theme.borderColors.primary} rounded-lg`}>
                <h5 className={`font-medium ${theme.textColors.primary} mb-2`}>What is Duration?</h5>
                <p className={`text-sm ${theme.textColors.secondary} mb-3`}>
                  Duration measures a bond&apos;s price sensitivity to interest rate changes. 
                  It&apos;s expressed in years and tells you approximately how much the bond&apos;s 
                  price will change for each 1% move in interest rates.
                </p>
                <div className="grid md:grid-cols-3 gap-3">
                  <div className={`p-3 ${theme.backgrounds.card} rounded border text-center`}>
                    <div className={`text-lg font-bold ${theme.status.success.text}`}>2-3 Years</div>
                    <div className={`text-xs ${theme.textColors.secondary}`}>Short Duration<br/>Low Sensitivity</div>
                  </div>
                  <div className={`p-3 ${theme.backgrounds.card} rounded border text-center`}>
                    <div className={`text-lg font-bold ${theme.status.warning.text}`}>5-7 Years</div>
                    <div className={`text-xs ${theme.textColors.secondary}`}>Medium Duration<br/>Moderate Sensitivity</div>
                  </div>
                  <div className={`p-3 ${theme.backgrounds.card} rounded border text-center`}>
                    <div className={`text-lg font-bold ${theme.status.error.text}`}>10+ Years</div>
                    <div className={`text-xs ${theme.textColors.secondary}`}>Long Duration<br/>High Sensitivity</div>
                  </div>
                </div>
              </div>

              <div className={`${theme.status.info.bg}/10 border ${theme.status.info.border} p-4 rounded-lg`}>
                <h5 className={`font-medium ${theme.textColors.primary} mb-2`}>Duration in Action:</h5>
                <p className={`text-sm ${theme.textColors.secondary}`}>
                  A bond with 5-year duration will lose approximately 5% of its value if interest rates rise by 1%. 
                  Conversely, it will gain 5% if rates fall by 1%. This helps you predict and manage interest rate risk.
                </p>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 4,
      title: "Bond Valuation & Yield Calculations",
      icon: DollarSign,
      content: (
        <div className="space-y-6">
          <div>
            <h4 className={`font-semibold ${theme.textColors.primary} mb-4`}>Key Yield Metrics</h4>
            <div className="grid md:grid-cols-2 gap-4">
              <div className={`p-4 border ${theme.borderColors.primary} rounded-lg`}>
                <h5 className={`font-medium ${theme.textColors.primary} mb-3`}>Current Yield</h5>
                <p className={`text-sm ${theme.textColors.secondary} mb-2`}>
                  Annual coupon payment divided by current market price.
                </p>
                <div className={`p-3 ${theme.backgrounds.card} rounded border font-mono text-sm`}>
                  Current Yield = Annual Coupon ÷ Market Price<br/>
                  Example: $50 ÷ $950 = 5.26%
                </div>
              </div>

              <div className={`p-4 border ${theme.borderColors.primary} rounded-lg`}>
                <h5 className={`font-medium ${theme.textColors.primary} mb-3`}>Yield to Maturity (YTM)</h5>
                <p className={`text-sm ${theme.textColors.secondary} mb-2`}>
                  Total return if held to maturity, considering current price and all future payments.
                </p>
                <div className={`p-3 ${theme.backgrounds.card} rounded border text-sm`}>
                  Most important metric for bond comparison<br/>
                  Accounts for capital gains/losses
                </div>
              </div>

              <div className={`p-4 border ${theme.borderColors.primary} rounded-lg`}>
                <h5 className={`font-medium ${theme.textColors.primary} mb-3`}>Yield to Call (YTC)</h5>
                <p className={`text-sm ${theme.textColors.secondary} mb-2`}>
                  Return if bond is called (redeemed early) by issuer.
                </p>
                <div className={`p-3 ${theme.backgrounds.card} rounded border text-sm`}>
                  Important for callable bonds<br/>
                  Usually called when rates fall
                </div>
              </div>

              <div className={`p-4 border ${theme.borderColors.primary} rounded-lg`}>
                <h5 className={`font-medium ${theme.textColors.primary} mb-3`}>Tax-Equivalent Yield</h5>
                <p className={`text-sm ${theme.textColors.secondary} mb-2`}>
                  What a taxable bond would need to yield to equal a tax-free bond.
                </p>
                <div className={`p-3 ${theme.backgrounds.card} rounded border font-mono text-sm`}>
                  TEY = Tax-Free Yield ÷ (1 - Tax Rate)<br/>
                  Example: 4% ÷ (1 - 0.32) = 5.88%
                </div>
              </div>
            </div>
          </div>

          <div className={`${theme.status.info.bg}/10 border ${theme.status.info.border} p-6 rounded-lg`}>
            <h4 className={`font-semibold ${theme.textColors.primary} mb-3`}>Bond Pricing Fundamentals</h4>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="text-center">
                <div className={`w-16 h-16 ${theme.status.success.bg} rounded-full flex items-center justify-center mx-auto mb-2`}>
                  <CheckCircle className={`w-8 h-8 ${theme.status.success.text}`} />
                </div>
                <h5 className={`font-medium ${theme.textColors.primary} mb-1`}>Par (100)</h5>
                <p className={`text-sm ${theme.textColors.secondary}`}>
                  Bond trades at face value when coupon rate equals market rate
                </p>
              </div>
              <div className="text-center">
                <div className={`w-16 h-16 ${theme.status.warning.bg} rounded-full flex items-center justify-center mx-auto mb-2`}>
                  <TrendingUp className={`w-8 h-8 ${theme.status.warning.text}`} />
                </div>
                <h5 className={`font-medium ${theme.textColors.primary} mb-1`}>Premium (&gt;100)</h5>
                <p className={`text-sm ${theme.textColors.secondary}`}>
                  Bond&apos;s coupon rate higher than market rate
                </p>
              </div>
              <div className="text-center">
                <div className={`w-16 h-16 ${theme.status.error.bg} rounded-full flex items-center justify-center mx-auto mb-2`}>
                  <TrendingUp className={`w-8 h-8 ${theme.status.error.text} transform rotate-180`} />
                </div>
                <h5 className={`font-medium ${theme.textColors.primary} mb-1`}>Discount (&lt;100)</h5>
                <p className={`text-sm ${theme.textColors.secondary}`}>
                  Bond&apos;s coupon rate lower than market rate
                </p>
              </div>
            </div>
          </div>

          <div className={`${theme.status.success.bg}/10 border ${theme.status.success.border} p-4 rounded-lg`}>
            <h5 className={`font-medium ${theme.textColors.primary} mb-2 flex items-center`}>
              <Lightbulb className={`w-4 h-4 ${theme.status.success.text} mr-2`} />
              Real Investment Strategy:
            </h5>
            <p className={`text-sm ${theme.textColors.secondary}`}>
              Build a bond ladder: Buy bonds with staggered maturities (1, 2, 3, 4, 5 years). 
              When each bond matures, reinvest in a new 5-year bond. This provides steady income 
              while reducing interest rate risk through diversification across time periods.
            </p>
          </div>
        </div>
      )
    },
    {
      id: 5,
      title: "Portfolio Integration & Strategic Allocation",
      icon: Target,
      content: (
        <div className="space-y-6">
          <div>
            <h4 className={`font-semibold ${theme.textColors.primary} mb-4`}>Bonds in Your Portfolio</h4>
            <div className="grid md:grid-cols-3 gap-4">
              <div className={`p-4 ${theme.status.info.bg}/10 border ${theme.status.info.border} rounded-lg text-center`}>
                <Shield className={`w-8 h-8 ${theme.status.info.text} mx-auto mb-3`} />
                <h5 className={`font-medium ${theme.textColors.primary} mb-2`}>Stability Provider</h5>
                <p className={`text-sm ${theme.textColors.secondary}`}>
                  Bonds provide steady income and reduce overall portfolio volatility, 
                  especially during stock market downturns.
                </p>
              </div>
              <div className={`p-4 ${theme.status.success.bg}/10 border ${theme.status.success.border} rounded-lg text-center`}>
                <Target className={`w-8 h-8 ${theme.status.success.text} mx-auto mb-3`} />
                <h5 className={`font-medium ${theme.textColors.primary} mb-2`}>Diversification Tool</h5>
                <p className={`text-sm ${theme.textColors.secondary}`}>
                  Often move inversely to stocks, providing balance and reducing 
                  correlation in your investment mix.
                </p>
              </div>
              <div className={`p-4 ${theme.status.warning.bg}/10 border ${theme.status.warning.border} rounded-lg text-center`}>
                <DollarSign className={`w-8 h-8 ${theme.status.warning.text} mx-auto mb-3`} />
                <h5 className={`font-medium ${theme.textColors.primary} mb-2`}>Income Generator</h5>
                <p className={`text-sm ${theme.textColors.secondary}`}>
                  Regular interest payments ideal for retirees or 
                  income-focused investment strategies.
                </p>
              </div>
            </div>
          </div>

          <div>
            <h4 className={`font-semibold ${theme.textColors.primary} mb-4`}>Age-Based Bond Allocation</h4>
            <div className="grid md:grid-cols-4 gap-3">
              <div className={`p-3 border ${theme.borderColors.primary} rounded-lg text-center`}>
                <div className={`text-2xl font-bold ${theme.status.success.text} mb-1`}>20-30</div>
                <div className={`text-sm ${theme.textColors.secondary} mb-2`}>Young Investor</div>
                <div className={`text-lg font-bold ${theme.textColors.primary}`}>10-20%</div>
                <div className={`text-xs ${theme.textColors.secondary}`}>Bonds</div>
              </div>
              <div className={`p-3 border ${theme.borderColors.primary} rounded-lg text-center`}>
                <div className={`text-2xl font-bold ${theme.status.info.text} mb-1`}>30-50</div>
                <div className={`text-sm ${theme.textColors.secondary} mb-2`}>Mid-Career</div>
                <div className={`text-lg font-bold ${theme.textColors.primary}`}>20-40%</div>
                <div className={`text-xs ${theme.textColors.secondary}`}>Bonds</div>
              </div>
              <div className={`p-3 border ${theme.borderColors.primary} rounded-lg text-center`}>
                <div className={`text-2xl font-bold ${theme.status.warning.text} mb-1`}>50-65</div>
                <div className={`text-sm ${theme.textColors.secondary} mb-2`}>Pre-Retirement</div>
                <div className={`text-lg font-bold ${theme.textColors.primary}`}>40-60%</div>
                <div className={`text-xs ${theme.textColors.secondary}`}>Bonds</div>
              </div>
              <div className={`p-3 border ${theme.borderColors.primary} rounded-lg text-center`}>
                <div className={`text-2xl font-bold ${theme.status.error.text} mb-1`}>65+</div>
                <div className={`text-sm ${theme.textColors.secondary} mb-2`}>Retirement</div>
                <div className={`text-lg font-bold ${theme.textColors.primary}`}>50-70%</div>
                <div className={`text-xs ${theme.textColors.secondary}`}>Bonds</div>
              </div>
            </div>
            <div className={`mt-4 p-3 ${theme.status.info.bg}/10 border ${theme.status.info.border} rounded text-sm ${theme.textColors.secondary}`}>
              Note: Traditional &quot;age in bonds&quot; rule may be too conservative in today&apos;s low-rate environment. 
              Consider your risk tolerance, time horizon, and income needs.
            </div>
          </div>

          <div className={`${theme.status.warning.bg}/10 border ${theme.status.warning.border} p-6 rounded-lg`}>
            <h4 className={`font-semibold ${theme.textColors.primary} mb-3`}>Modern Bond Challenges</h4>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <h5 className={`font-medium ${theme.textColors.primary} mb-2`}>Current Environment Issues:</h5>
                <ul className={`space-y-1 text-sm ${theme.textColors.secondary}`}>
                  <li>• Low real yields after inflation</li>
                  <li>• Interest rate uncertainty</li>
                  <li>• Credit quality concerns</li>
                  <li>• Duration risk in rate cycles</li>
                </ul>
              </div>
              <div>
                <h5 className={`font-medium ${theme.textColors.primary} mb-2`}>Strategic Adaptations:</h5>
                <ul className={`space-y-1 text-sm ${theme.textColors.secondary}`}>
                  <li>• Shorter duration focus</li>
                  <li>• Inflation-protected securities (TIPS)</li>
                  <li>• High-quality corporate bonds</li>
                  <li>• International diversification</li>
                </ul>
              </div>
            </div>
          </div>

          <div className={`${theme.status.success.bg}/10 border ${theme.status.success.border} p-4 rounded-lg`}>
            <h5 className={`font-medium ${theme.textColors.primary} mb-2 flex items-center`}>
              <CheckCircle className={`w-4 h-4 ${theme.status.success.text} mr-2`} />
              Action Steps for Bond Investing:
            </h5>
            <ol className={`space-y-1 text-sm ${theme.textColors.secondary} list-decimal list-inside`}>
              <li>Determine appropriate allocation based on age and risk tolerance</li>
              <li>Start with broad market bond index funds for diversification</li>
              <li>Consider tax-free municipals if in higher tax brackets</li>
              <li>Add TIPS for inflation protection (5-10% of bond allocation)</li>
              <li>Review and rebalance annually as interest rates change</li>
            </ol>
          </div>
        </div>
      )
    },
    {
      id: 6,
      title: "Advanced Strategies & Risk Management",
      icon: BarChart3,
      content: (
        <div className="space-y-6">
          <div>
            <h4 className={`font-semibold ${theme.textColors.primary} mb-4`}>Professional Bond Strategies</h4>
            <div className="space-y-4">
              <div className={`p-4 border ${theme.borderColors.primary} rounded-lg`}>
                <h5 className={`font-medium ${theme.textColors.primary} mb-3 flex items-center`}>
                  <TrendingUp className={`w-4 h-4 ${theme.status.info.text} mr-2`} />
                  Bond Laddering Strategy
                </h5>
                <p className={`text-sm ${theme.textColors.secondary} mb-3`}>
                  Purchase bonds with staggered maturity dates to reduce interest rate risk 
                  and provide regular reinvestment opportunities.
                </p>
                <div className="grid grid-cols-5 gap-2 text-center text-xs">
                  <div className={`p-2 ${theme.status.success.bg}/20 rounded`}>Year 1<br/>$10k</div>
                  <div className={`p-2 ${theme.status.info.bg}/20 rounded`}>Year 2<br/>$10k</div>
                  <div className={`p-2 ${theme.status.warning.bg}/20 rounded`}>Year 3<br/>$10k</div>
                  <div className={`p-2 ${theme.status.error.bg}/20 rounded`}>Year 4<br/>$10k</div>
                  <div className={`p-2 ${theme.backgrounds.card} border rounded`}>Year 5<br/>$10k</div>
                </div>
                <p className={`text-xs ${theme.textColors.secondary} mt-2`}>
                  When Year 1 matures, reinvest in new Year 5 bond
                </p>
              </div>

              <div className={`p-4 border ${theme.borderColors.primary} rounded-lg`}>
                <h5 className={`font-medium ${theme.textColors.primary} mb-3 flex items-center`}>
                  <Target className={`w-4 h-4 ${theme.status.warning.text} mr-2`} />
                  Barbell Strategy
                </h5>
                <p className={`text-sm ${theme.textColors.secondary} mb-3`}>
                  Combine short-term and long-term bonds while avoiding intermediate terms. 
                  Provides liquidity and higher yields.
                </p>
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div className={`p-3 ${theme.status.success.bg}/20 rounded`}>
                    <div className="font-bold">50%</div>
                    <div className="text-xs">1-3 Year Bonds</div>
                  </div>
                  <div className={`p-3 ${theme.backgrounds.cardDisabled} rounded opacity-50`}>
                    <div className="font-bold">0%</div>
                    <div className="text-xs">5-7 Year Bonds</div>
                  </div>
                  <div className={`p-3 ${theme.status.error.bg}/20 rounded`}>
                    <div className="font-bold">50%</div>
                    <div className="text-xs">10+ Year Bonds</div>
                  </div>
                </div>
              </div>

              <div className={`p-4 border ${theme.borderColors.primary} rounded-lg`}>
                <h5 className={`font-medium ${theme.textColors.primary} mb-3 flex items-center`}>
                  <Shield className={`w-4 h-4 ${theme.status.info.text} mr-2`} />
                  Duration Matching
                </h5>
                <p className={`text-sm ${theme.textColors.secondary} mb-3`}>
                  Match bond portfolio duration to your investment timeline. 
                  Reduces reinvestment risk for specific financial goals.
                </p>
                <div className="grid md:grid-cols-2 gap-3">
                  <div className={`p-3 ${theme.backgrounds.card} rounded border`}>
                    <div className="font-medium text-sm">5-Year Goal</div>
                    <div className="text-xs text-gray-600">→ 5-Year Duration Portfolio</div>
                  </div>
                  <div className={`p-3 ${theme.backgrounds.card} rounded border`}>
                    <div className="font-medium text-sm">10-Year Goal</div>
                    <div className="text-xs text-gray-600">→ 10-Year Duration Portfolio</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div>
            <h4 className={`font-semibold ${theme.textColors.primary} mb-4`}>Risk Management Techniques</h4>
            <div className="grid md:grid-cols-2 gap-4">
              <div className={`p-4 ${theme.status.warning.bg}/10 border ${theme.status.warning.border} rounded-lg`}>
                <h5 className={`font-medium ${theme.status.warning.text} mb-2`}>Key Risks to Monitor</h5>
                <ul className={`space-y-2 text-sm ${theme.status.warning.text}/80`}>
                  <li>• <span className="font-medium">Interest Rate Risk:</span> Duration management</li>
                  <li>• <span className="font-medium">Credit Risk:</span> Diversification and rating analysis</li>
                  <li>• <span className="font-medium">Inflation Risk:</span> TIPS and real yields</li>
                  <li>• <span className="font-medium">Liquidity Risk:</span> Market access and spreads</li>
                  <li>• <span className="font-medium">Call Risk:</span> Reinvestment at lower rates</li>
                </ul>
              </div>
              <div className={`p-4 ${theme.status.success.bg}/10 border ${theme.status.success.border} rounded-lg`}>
                <h5 className={`font-medium ${theme.status.success.text} mb-2`}>Mitigation Strategies</h5>
                <ul className={`space-y-2 text-sm ${theme.status.success.text}/80`}>
                  <li>• <span className="font-medium">Diversify Maturities:</span> Bond ladders and barbells</li>
                  <li>• <span className="font-medium">Quality Focus:</span> Investment grade minimum</li>
                  <li>• <span className="font-medium">Inflation Protection:</span> 10-20% in TIPS</li>
                  <li>• <span className="font-medium">Liquidity Buffer:</span> Treasury and large corporate issues</li>
                  <li>• <span className="font-medium">Non-Callable Preference:</span> Avoid call risk when possible</li>
                </ul>
              </div>
            </div>
          </div>

          <div className={`${theme.status.info.bg}/10 border ${theme.status.info.border} p-6 rounded-lg`}>
            <h4 className={`font-semibold ${theme.textColors.primary} mb-3`}>ETF vs Individual Bonds</h4>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <h5 className={`font-medium ${theme.textColors.primary} mb-2`}>Bond ETFs (AGG, BND, TLT)</h5>
                <div className="space-y-1 text-sm">
                  <div className={`${theme.status.success.text} flex items-center`}>
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Instant diversification
                  </div>
                  <div className={`${theme.status.success.text} flex items-center`}>
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Professional management
                  </div>
                  <div className={`${theme.status.success.text} flex items-center`}>
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Daily liquidity
                  </div>
                  <div className={`${theme.status.error.text} flex items-center`}>
                    <AlertTriangle className="w-3 h-3 mr-1" />
                    No maturity date
                  </div>
                  <div className={`${theme.status.error.text} flex items-center`}>
                    <AlertTriangle className="w-3 h-3 mr-1" />
                    Interest rate volatility
                  </div>
                </div>
              </div>
              <div>
                <h5 className={`font-medium ${theme.textColors.primary} mb-2`}>Individual Bonds</h5>
                <div className="space-y-1 text-sm">
                  <div className={`${theme.status.success.text} flex items-center`}>
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Predictable maturity
                  </div>
                  <div className={`${theme.status.success.text} flex items-center`}>
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Hold to maturity option
                  </div>
                  <div className={`${theme.status.success.text} flex items-center`}>
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Customizable ladders
                  </div>
                  <div className={`${theme.status.error.text} flex items-center`}>
                    <AlertTriangle className="w-3 h-3 mr-1" />
                    Higher minimums ($1,000+)
                  </div>
                  <div className={`${theme.status.error.text} flex items-center`}>
                    <AlertTriangle className="w-3 h-3 mr-1" />
                    Limited diversification
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className={`${theme.status.success.bg}/10 border ${theme.status.success.border} p-4 rounded-lg`}>
            <h5 className={`font-medium ${theme.textColors.primary} mb-2 flex items-center`}>
              <CheckCircle className={`w-4 h-4 ${theme.status.success.text} mr-2`} />
              Master-Level Implementation Plan:
            </h5>
            <ol className={`space-y-1 text-sm ${theme.textColors.secondary} list-decimal list-inside`}>
              <li>Start with 80% broad market bond ETF (BND or AGG) for instant diversification</li>
              <li>Add 10% TIPS ETF (SCHP) for inflation protection</li>
              <li>Include 10% high-yield or international bonds for enhanced returns</li>
              <li>As portfolio grows ($100k+), consider individual bond ladders</li>
              <li>Rebalance quarterly and adjust duration based on rate environment</li>
              <li>Monitor credit quality and avoid reaching for yield in risky bonds</li>
            </ol>
          </div>
        </div>
      )
    }
  ];

  const handleLessonComplete = (lessonIndex: number) => {
    const newCompleted = [...completedLessons];
    newCompleted[lessonIndex] = true;
    setCompletedLessons(newCompleted);

    // Record lesson completion in progress store
    completeLesson(`chapter14-lesson-${lessonIndex + 1}`, 0);

    if (lessonIndex === lessons.length - 1 && onComplete) {
      onComplete();
    }
  };

  const progressPercentage = (completedLessons.filter(Boolean).length / lessons.length) * 100;

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className={`${theme.typography.heading1} ${theme.textColors.primary}`}>
            Bond & Fixed Income Mastery
          </h1>
          <p className={`${theme.typography.body} ${theme.textColors.secondary} max-w-2xl mx-auto`}>
            Master conservative investing strategies, understand bond mechanics, and build stable income-generating portfolios
          </p>
        </motion.div>

        <div className="space-y-2">
          <div className="flex justify-between text-sm text-gray-600">
            <span>Progress</span>
            <span>{Math.round(progressPercentage)}% Complete</span>
          </div>
          <Progress value={progressPercentage} className="w-full" />
        </div>
      </div>

      {/* Lesson Navigation */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {lessons.map((lesson, index) => {
          const IconComponent = lesson.icon;
          const isCompleted = completedLessons[index];
          const isActive = currentLesson === index;
          
          return (
            <motion.div
              key={lesson.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <Card 
                className={`cursor-pointer transition-all duration-200 hover:shadow-lg ${
                  isActive ? `ring-2 ring-blue-500 ${theme.backgrounds.card}` : ''
                } ${isCompleted ? 'border-green-200 bg-green-50' : ''}`}
                onClick={() => setCurrentLesson(index)}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      isCompleted 
                        ? `${theme.status.success.bg} ${theme.status.success.text}` 
                        : isActive 
                          ? 'bg-blue-100 text-blue-600' 
                          : `${theme.backgrounds.card} ${theme.textColors.secondary}`
                    }`}>
                      {isCompleted ? (
                        <CheckCircle className="w-5 h-5" />
                      ) : (
                        <IconComponent className="w-5 h-5" />
                      )}
                    </div>
                    <Badge variant={isCompleted ? "default" : "secondary"} className="text-xs">
                      {isCompleted ? "Complete" : `${index + 1}/${lessons.length}`}
                    </Badge>
                  </div>
                  <CardTitle className={`text-sm font-medium ${theme.textColors.primary} leading-tight`}>
                    {lesson.title}
                  </CardTitle>
                </CardHeader>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Current Lesson Content */}
      <motion.div
        key={currentLesson}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.4 }}
      >
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className={`w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center`}>
                  {React.createElement(lessons[currentLesson].icon, { 
                    className: "w-6 h-6 text-blue-600" 
                  })}
                </div>
                <div>
                  <CardTitle className={theme.textColors.primary}>
                    {lessons[currentLesson].title}
                  </CardTitle>
                  <CardDescription>
                    Lesson {currentLesson + 1} of {lessons.length}
                  </CardDescription>
                </div>
              </div>
              <Badge variant="outline">
                {Math.round(((currentLesson + 1) / lessons.length) * 100)}% Progress
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {lessons[currentLesson].content}
            
            <Separator />
            
            <div className="flex justify-between items-center pt-4">
              <Button
                variant="outline"
                onClick={() => setCurrentLesson(Math.max(0, currentLesson - 1))}
                disabled={currentLesson === 0}
              >
                Previous
              </Button>
              
              <div className="flex space-x-3">
                {!completedLessons[currentLesson] && (
                  <Button
                    onClick={() => handleLessonComplete(currentLesson)}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Complete Lesson
                  </Button>
                )}
                
                <Button
                  variant="outline"
                  onClick={() => setCurrentLesson(Math.min(lessons.length - 1, currentLesson + 1))}
                  disabled={currentLesson === lessons.length - 1}
                >
                  Next
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Completion Message */}
      {completedLessons.every(Boolean) && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Card className={`${theme.status.success.bg}/10 border-2 ${theme.status.success.border}`}>
            <CardContent className="text-center py-8">
              <CheckCircle className={`w-16 h-16 ${theme.status.success.text} mx-auto mb-4`} />
              <h3 className={`text-xl font-semibold ${theme.textColors.primary} mb-2`}>
                Congratulations! 🎉
              </h3>
              <p className={`${theme.textColors.secondary} max-w-md mx-auto`}>
                You&apos;ve mastered bond and fixed income investing. You now understand how to build 
                stable, income-generating portfolios and manage interest rate risk effectively.
              </p>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  );
}
