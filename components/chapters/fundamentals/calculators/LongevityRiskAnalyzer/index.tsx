import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { RefreshCw, Calculator } from 'lucide-react';
import { useLongevityRisk } from '@/lib/hooks/calculators/useLongevityRisk';

import { PersonalInfoInputs } from './PersonalInfoInputs';
import { FinancialInfoInputs } from './FinancialInfoInputs';
import { HealthcareInputs } from './HealthcareInputs';
import { LifeExpectancyResults } from './LifeExpectancyResults';
import { FinancialProjectionsResults } from './FinancialProjectionsResults';
import { RiskAnalysisResults } from './RiskAnalysisResults';
import { HealthcareProjectionsResults } from './HealthcareProjectionsResults';
import { RecommendationsResults } from './RecommendationsResults';
import { StressTestResults } from './StressTestResults';

export default function LongevityRiskAnalyzer() {
  const [state, actions] = useLongevityRisk();
  const { values, errors, result, isValid } = state;
  const { setValues, reset } = actions;

  const handleInputChange = (field: string, value: string | number | boolean) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setValues({
        [parent]: {
          ...values[parent as keyof typeof values],
          [child]: value
        }
      });
    } else {
      setValues({ [field]: value });
    }
  };

  const getFieldError = (field: string) => {
    return errors.find(error => error.field === field)?.message;
  };

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calculator className="h-5 w-5" />
            Longevity Risk Analyzer
          </CardTitle>
          <CardDescription>
            Analyze longevity risk and plan for a secure retirement
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="personal">
            <TabsList>
              <TabsTrigger value="personal">Personal Info</TabsTrigger>
              <TabsTrigger value="financial">Financial Info</TabsTrigger>
              <TabsTrigger value="healthcare">Healthcare</TabsTrigger>
              <TabsTrigger value="analysis" disabled={!result}>Analysis</TabsTrigger>
              <TabsTrigger value="projections" disabled={!result}>Projections</TabsTrigger>
              <TabsTrigger value="recommendations" disabled={!result}>Recommendations</TabsTrigger>
            </TabsList>

            <TabsContent value="personal">
              <PersonalInfoInputs
                values={values}
                onChange={handleInputChange}
                getFieldError={getFieldError}
              />
            </TabsContent>

            <TabsContent value="financial">
              <FinancialInfoInputs
                values={values}
                onChange={handleInputChange}
                getFieldError={getFieldError}
              />
            </TabsContent>

            <TabsContent value="healthcare">
              <HealthcareInputs
                values={values}
                onChange={handleInputChange}
                getFieldError={getFieldError}
              />
            </TabsContent>

            {result && (
              <>
                <TabsContent value="analysis" className="space-y-6">
                  <LifeExpectancyResults analysis={result.lifeExpectancy} />
                  <RiskAnalysisResults analysis={result.riskAnalysis} />
                </TabsContent>

                <TabsContent value="projections" className="space-y-6">
                  <FinancialProjectionsResults
                    projections={result.financialProjections}
                    currentAge={values.currentAge}
                  />
                  <HealthcareProjectionsResults
                    projections={result.healthcareProjections}
                    currentAge={values.currentAge}
                  />
                </TabsContent>

                <TabsContent value="recommendations" className="space-y-6">
                  <RecommendationsResults
                    recommendations={result.recommendations}
                    monthlyIncome={values.monthlyIncome}
                  />
                  <StressTestResults
                    stressTests={result.stressTests}
                    currentSavings={values.currentSavings}
                  />
                </TabsContent>
              </>
            )}
          </Tabs>

          <div className="mt-6 flex justify-end gap-2">
            <Button variant="outline" onClick={reset}>
              <RefreshCw className="mr-2 h-4 w-4" />
              Reset
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

