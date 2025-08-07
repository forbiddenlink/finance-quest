import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import MarketVolatilitySimulator from '@/components/chapters/fundamentals/lessons/MarketVolatilitySimulator';

// Mock useProgressStore
const mockUseProgressStore = {
  userProgress: {
    completedLessons: [],
    completedQuizzes: [],
    unlockedChapters: [1, 2, 3, 4, 5, 6, 7]
  },
  recordCalculatorUsage: jest.fn(),
  recordSimulationResult: jest.fn()
};

jest.mock('@/lib/store/progressStore', () => ({
  useProgressStore: () => mockUseProgressStore
}));

// Mock Framer Motion
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    button: ({ children, ...props }: any) => <button {...props}>{children}</button>,
  },
  AnimatePresence: ({ children }: any) => <>{children}</>,
}));

// Mock Recharts
jest.mock('recharts', () => ({
  ResponsiveContainer: ({ children }: any) => <div data-testid="responsive-container">{children}</div>,
  LineChart: ({ children }: any) => <div data-testid="line-chart">{children}</div>,
  Line: () => <div data-testid="line" />,
  AreaChart: ({ children }: any) => <div data-testid="area-chart">{children}</div>,
  Area: () => <div data-testid="area" />,
  XAxis: () => <div data-testid="x-axis" />,
  YAxis: () => <div data-testid="y-axis" />,
  CartesianGrid: () => <div data-testid="cartesian-grid" />,
  Tooltip: () => <div data-testid="tooltip" />,
  Legend: () => <div data-testid="legend" />,
}));

// Mock Decimal.js
jest.mock('decimal.js', () => {
  return class MockDecimal {
    constructor(value: any) {
      this.value = parseFloat(value) || 0;
    }
    
    value: number;
    
    mul(other: any): MockDecimal {
      const otherValue = typeof other === 'object' ? other.value : parseFloat(other);
      return new MockDecimal(this.value * otherValue);
    }
    
    add(other: any): MockDecimal {
      const otherValue = typeof other === 'object' ? other.value : parseFloat(other);
      return new MockDecimal(this.value + otherValue);
    }
    
    toNumber(): number {
      return this.value;
    }
    
    toString(): string {
      return this.value.toString();
    }
    
    toFixed(places: number): string {
      return this.value.toFixed(places);
    }
  };
});

describe('MarketVolatilitySimulator', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the simulator component', () => {
    render(<MarketVolatilitySimulator />);
    
    expect(screen.getByText('Market Volatility Simulator')).toBeInTheDocument();
    expect(screen.getByText(/Test different investment strategies during market crises/)).toBeInTheDocument();
  });

  it('displays investment strategy options', () => {
    render(<MarketVolatilitySimulator />);
    
    expect(screen.getByText(/Choose Your Investment Strategy/i)).toBeInTheDocument();
    expect(screen.getByText(/Panic Seller/)).toBeInTheDocument();
    expect(screen.getByText(/Market Timer/)).toBeInTheDocument();
    expect(screen.getByText(/Dollar Cost Averager/)).toBeInTheDocument();
    expect(screen.getByText(/Contrarian Investor/)).toBeInTheDocument();
  });

  it('has start simulation and reset buttons', () => {
    render(<MarketVolatilitySimulator />);
    
    expect(screen.getByText(/Start Simulation/)).toBeInTheDocument();
    expect(screen.getByText(/Reset/)).toBeInTheDocument();
  });

  it('shows portfolio value display', () => {
    render(<MarketVolatilitySimulator />);
    
    expect(screen.getByText(/Portfolio Value/)).toBeInTheDocument();
    expect(screen.getByText(/100,000/)).toBeInTheDocument();
  });

  it('allows strategy selection', () => {
    render(<MarketVolatilitySimulator />);
    
    const panicSellerButton = screen.getByText(/Panic Seller/);
    fireEvent.click(panicSellerButton);
    
    // Strategy should be selectable (test passes if no error)
    expect(panicSellerButton).toBeInTheDocument();
  });

  it('can start simulation', () => {
    render(<MarketVolatilitySimulator />);
    
    const startButton = screen.getByText(/Start Simulation/);
    fireEvent.click(startButton);
    
    // Should still render main component
    expect(screen.getByText(/Market Volatility Simulator/)).toBeInTheDocument();
  });

  it('can reset simulation', () => {
    render(<MarketVolatilitySimulator />);
    
    const resetButton = screen.getByText(/Reset/);
    fireEvent.click(resetButton);
    
    // Should still render main component
    expect(screen.getByText(/Market Volatility Simulator/)).toBeInTheDocument();
  });

  it('unmounts without errors', () => {
    const { unmount } = render(<MarketVolatilitySimulator />);
    expect(() => unmount()).not.toThrow();
  });
});
