import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { RefreshCw, Calculator } from 'lucide-react';
import { useBRRRRStrategy } from '@/lib/hooks/calculators/useBRRRRStrategy';

import { BuyPhaseInputs } from './BuyPhaseInputs';
import { RehabPhaseInputs } from './RehabPhaseInputs';
import { RentPhaseInputs } from './RentPhaseInputs';
import { RefinancePhaseInputs } from './RefinancePhaseInputs';
import { MarketAssumptionsInputs } from './MarketAssumptionsInputs';
import { InitialInvestmentResults } from './InitialInvestmentResults';
import { RehabAnalysisResults } from './RehabAnalysisResults';
import { RentalAnalysisResults } from './RentalAnalysisResults';
import { RefinanceAnalysisResults } from './RefinanceAnalysisResults';
import { ProjectionsResults } from './ProjectionsResults';
import { RiskAnalysisResults } from './RiskAnalysisResults';
import { ViabilityAnalysisResults } from './ViabilityAnalysisResults';

export default function BRRRRStrategyCalculator() {
  const [state, actions] = useBRRRRStrategy();
  const { values, errors, result, isValid } = state;
  const { setValues, reset } = actions;

  const handleInputChange = (field: string, value: string | number) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setValues({
        [parent]: {
          ...values[parent as keyof typeof values],
          [child]: typeof value === 'string' ? Number(value) : value
        }
      });
    } else {
      setValues({ [field]: typeof value === 'string' ? Number(value) : value });
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
            BRRRR Strategy Calculator
          </CardTitle>
          <CardDescription>
            Analyze Buy, Rehab, Rent, Refinance, Repeat investment strategy
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="buy">
            <TabsList>
              <TabsTrigger value="buy">Buy</TabsTrigger>
              <TabsTrigger value="rehab">Rehab</TabsTrigger>
              <TabsTrigger value="rent">Rent</TabsTrigger>
              <TabsTrigger value="refinance">Refinance</TabsTrigger>
              <TabsTrigger value="assumptions">Assumptions</TabsTrigger>
              <TabsTrigger value="analysis" disabled={!result}>Analysis</TabsTrigger>
              <TabsTrigger value="projections" disabled={!result}>Projections</TabsTrigger>
            </TabsList>

            <TabsContent value="buy">
              <BuyPhaseInputs
                values={values}
                onChange={handleInputChange}
                getFieldError={getFieldError}
              />
            </TabsContent>

            <TabsContent value="rehab">
              <RehabPhaseInputs
                values={values}
                onChange={handleInputChange}
                getFieldError={getFieldError}
              />
            </TabsContent>

            <TabsContent value="rent">
              <RentPhaseInputs
                values={values}
                onChange={handleInputChange}
                getFieldError={getFieldError}
              />
            </TabsContent>

            <TabsContent value="refinance">
              <RefinancePhaseInputs
                values={values}
                onChange={handleInputChange}
                getFieldError={getFieldError}
              />
            </TabsContent>

            <TabsContent value="assumptions">
              <MarketAssumptionsInputs
                values={values}
                onChange={handleInputChange}
                getFieldError={getFieldError}
              />
            </TabsContent>

            {result && (
              <>
                <TabsContent value="analysis" className="space-y-6">
                  <InitialInvestmentResults analysis={result.initialInvestment} />
                  <RehabAnalysisResults analysis={result.rehabAnalysis} />
                  <RentalAnalysisResults analysis={result.rentalAnalysis} />
                  <RefinanceAnalysisResults analysis={result.refinanceAnalysis} />
                  <RiskAnalysisResults analysis={result.riskAnalysis} />
                  <ViabilityAnalysisResults analysis={result.viabilityAnalysis} />
                </TabsContent>

                <TabsContent value="projections">
                  <ProjectionsResults
                    projections={result.projections}
                    initialInvestment={result.initialInvestment}
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

