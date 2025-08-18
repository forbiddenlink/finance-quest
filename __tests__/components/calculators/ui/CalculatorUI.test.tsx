import { render, screen, fireEvent } from '@testing-library/react';
import {
  CalculatorLayout,
  InputGroup,
  ResultsCard,
  ChartCard,
  InsightsCard
} from '@/components/shared/calculators/ui';
import { Calculator, TrendingUp, Info } from 'lucide-react';

describe('Calculator UI Components', () => {
  describe('CalculatorLayout', () => {
    it('renders title and description', () => {
      render(
        <CalculatorLayout
          title="Test Calculator"
          description="Test Description"
          icon={Calculator}
        >
          <div>Content</div>
        </CalculatorLayout>
      );

      expect(screen.getByText('Test Calculator')).toBeInTheDocument();
      expect(screen.getByText('Test Description')).toBeInTheDocument();
      expect(screen.getByText('Content')).toBeInTheDocument();
    });

    it('handles reset button click', () => {
      const onReset = jest.fn();
      render(
        <CalculatorLayout
          title="Test Calculator"
          icon={Calculator}
          onReset={onReset}
        >
          <div>Content</div>
        </CalculatorLayout>
      );

      fireEvent.click(screen.getByText('Reset'));
      expect(onReset).toHaveBeenCalled();
    });
  });

  describe('InputGroup', () => {
    it('renders number input correctly', () => {
      const onChange = jest.fn();
      render(
        <InputGroup
          type="number"
          id="test-input"
          label="Test Input"
          value={100}
          onChange={onChange}
          prefix="$"
          suffix="%"
        />
      );

      expect(screen.getByLabelText('Test Input')).toBeInTheDocument();
      expect(screen.getByText('$')).toBeInTheDocument();
      expect(screen.getByText('%')).toBeInTheDocument();
    });

    it('renders select input correctly', () => {
      const onChange = jest.fn();
      render(
        <InputGroup
          type="select"
          id="test-select"
          label="Test Select"
          value="option1"
          onChange={onChange}
          options={[
            { value: 'option1', label: 'Option 1' },
            { value: 'option2', label: 'Option 2' }
          ]}
        />
      );

      expect(screen.getByLabelText('Test Select')).toBeInTheDocument();
      expect(screen.getByText('Option 1')).toBeInTheDocument();
    });

    it('displays error message', () => {
      render(
        <InputGroup
          type="number"
          id="test-input"
          label="Test Input"
          value={100}
          onChange={() => {}}
          error="Test error"
        />
      );

      expect(screen.getByText('Test error')).toBeInTheDocument();
    });
  });

  describe('ResultsCard', () => {
    it('renders metrics correctly', () => {
      render(
        <ResultsCard
          title="Test Results"
          icon={Calculator}
          metrics={[
            { label: 'Metric 1', value: 100, color: 'text-green-600' },
            { label: 'Metric 2', value: 200, subLabel: 'USD' }
          ]}
        />
      );

      expect(screen.getByText('Test Results')).toBeInTheDocument();
      expect(screen.getByText('Metric 1')).toBeInTheDocument();
      expect(screen.getByText('100')).toBeInTheDocument();
      expect(screen.getByText('200')).toBeInTheDocument();
      expect(screen.getByText('(USD)')).toBeInTheDocument();
    });
  });

  describe('ChartCard', () => {
    it('renders chart with correct data', () => {
      const data = [
        { month: 1, value: 100 },
        { month: 2, value: 200 }
      ];

      render(
        <ChartCard
          title="Test Chart"
          icon={TrendingUp}
          type="line"
          data={data}
          dataKey="value"
          xAxisLabel="Month"
          yAxisLabel="Value"
        />
      );

      expect(screen.getByText('Test Chart')).toBeInTheDocument();
      // Note: Detailed chart testing would require more complex setup
      // due to SVG rendering and ResponsiveContainer requirements
    });
  });

  describe('InsightsCard', () => {
    it('renders insights with correct icons', () => {
      render(
        <InsightsCard
          title="Test Insights"
          icon={Info}
          insights={[
            { type: 'success', message: 'Success message' },
            { type: 'warning', message: 'Warning message' },
            { type: 'info', message: 'Info message' }
          ]}
        />
      );

      expect(screen.getByText('Test Insights')).toBeInTheDocument();
      expect(screen.getByText('Success message')).toBeInTheDocument();
      expect(screen.getByText('Warning message')).toBeInTheDocument();
      expect(screen.getByText('Info message')).toBeInTheDocument();
    });
  });
});

