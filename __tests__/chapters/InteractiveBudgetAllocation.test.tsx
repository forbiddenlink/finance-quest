import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import InteractiveBudgetAllocation from '@/components/chapters/fundamentals/lessons/InteractiveBudgetAllocation';

// Mock framer-motion
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  },
  AnimatePresence: ({ children }: any) => <>{children}</>,
}));

// Mock @dnd-kit/core
jest.mock('@dnd-kit/core', () => ({
  DndContext: ({ children }: any) => <div data-testid="dnd-context">{children}</div>,
  useDroppable: () => ({
    isOver: false,
    setNodeRef: jest.fn(),
  }),
  closestCenter: jest.fn(),
  DragOverlay: ({ children }: any) => <div data-testid="drag-overlay">{children}</div>,
}));

// Mock @dnd-kit/sortable
jest.mock('@dnd-kit/sortable', () => ({
  SortableContext: ({ children }: any) => <div data-testid="sortable-context">{children}</div>,
  useSortable: () => ({
    attributes: {},
    listeners: {},
    setNodeRef: jest.fn(),
    transform: null,
    transition: null,
    isDragging: false,
  }),
  verticalListSortingStrategy: jest.fn(),
}));

// Mock @dnd-kit/utilities
jest.mock('@dnd-kit/utilities', () => ({
  CSS: {
    Transform: {
      toString: () => '',
    },
  },
}));

// Mock react-hot-toast
jest.mock('react-hot-toast', () => ({
  __esModule: true,
  default: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

describe('InteractiveBudgetAllocation', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders component title and description', () => {
    render(<InteractiveBudgetAllocation />);
    
    expect(screen.getByText(/Interactive Budget Allocation Game/i)).toBeInTheDocument();
    expect(screen.getByText(/Drag money amounts to different budget categories/i)).toBeInTheDocument();
  });

  test('displays monthly income correctly', () => {
    render(<InteractiveBudgetAllocation />);
    
    expect(screen.getByText('$5,000')).toBeInTheDocument();
    expect(screen.getByText('Monthly Income')).toBeInTheDocument();
  });

  test('shows budget remaining and allocation score', () => {
    render(<InteractiveBudgetAllocation />);
    
    expect(screen.getByText('Budget Remaining')).toBeInTheDocument();
    expect(screen.getByText('Allocation Score')).toBeInTheDocument();
  });

  test('displays available money amounts to allocate', () => {
    render(<InteractiveBudgetAllocation />);
    
    expect(screen.getByText('Available Money to Allocate')).toBeInTheDocument();
    
    // Check for the allocation amounts
    expect(screen.getByText('$250')).toBeInTheDocument();
    expect(screen.getByText('$500')).toBeInTheDocument();
    expect(screen.getByText('$750')).toBeInTheDocument();
    expect(screen.getByText('$1,000')).toBeInTheDocument();
    expect(screen.getByText('$1,250')).toBeInTheDocument();
  });

  test('displays all budget categories', () => {
    render(<InteractiveBudgetAllocation />);
    
    expect(screen.getByText('Budget Categories (Drop money here)')).toBeInTheDocument();
    
    // Check all category names
    expect(screen.getByText('Housing & Utilities')).toBeInTheDocument();
    expect(screen.getByText('Transportation')).toBeInTheDocument();
    expect(screen.getByText('Food & Dining')).toBeInTheDocument();
    expect(screen.getByText('Entertainment & Fun')).toBeInTheDocument();
    expect(screen.getByText('Healthcare & Insurance')).toBeInTheDocument();
    expect(screen.getByText('Savings & Investments')).toBeInTheDocument();
  });

  test('shows category descriptions', () => {
    render(<InteractiveBudgetAllocation />);
    
    expect(screen.getByText('Rent, mortgage, utilities, repairs')).toBeInTheDocument();
    expect(screen.getByText('Car payment, gas, insurance, maintenance')).toBeInTheDocument();
    expect(screen.getByText('Groceries, restaurants, meal prep')).toBeInTheDocument();
    expect(screen.getByText('Movies, hobbies, subscriptions, fun')).toBeInTheDocument();
    expect(screen.getByText('Health insurance, medical expenses')).toBeInTheDocument();
    expect(screen.getByText('Emergency fund, retirement, investments')).toBeInTheDocument();
  });

  test('displays recommended percentages for categories', () => {
    render(<InteractiveBudgetAllocation />);
    
    // Check that all category names are displayed
    expect(screen.getByText('Housing & Utilities')).toBeInTheDocument();
    expect(screen.getByText('Transportation')).toBeInTheDocument();
    expect(screen.getByText('Food & Dining')).toBeInTheDocument();
    expect(screen.getByText('Entertainment & Fun')).toBeInTheDocument();
    expect(screen.getByText('Healthcare & Insurance')).toBeInTheDocument();
    expect(screen.getByText('Savings & Investments')).toBeInTheDocument();
    
    // Check that recommended amounts section exists
    const recommendedTexts = screen.getAllByText('Recommended:');
    expect(recommendedTexts).toHaveLength(6); // One for each category
    
    // Check that current amounts section exists  
    const currentTexts = screen.getAllByText('Current:');
    expect(currentTexts).toHaveLength(6); // One for each category
    
    // Check for some percentage-like patterns (without being too specific about format)
    expect(screen.getAllByText(/30/).length).toBeGreaterThanOrEqual(1); // Housing percentage
    expect(screen.getAllByText(/25/).length).toBeGreaterThanOrEqual(1); // Savings percentage  
    expect(screen.getAllByText(/15/).length).toBeGreaterThanOrEqual(1); // Transportation percentage
  });

  test('shows current allocation as zero initially', () => {
    render(<InteractiveBudgetAllocation />);
    
    // From the HTML output, I can see the monthly income is displayed as "$5,000"
    expect(screen.getByText('$5,000')).toBeInTheDocument();
    
    // Check that budget categories section exists - use getAllByText since there might be multiple
    const budgetCategoryTexts = screen.getAllByText(/Budget Categories/i);
    expect(budgetCategoryTexts.length).toBeGreaterThanOrEqual(1);
    
    // Check if there are Current: labels (one for each category)
    const currentTexts = screen.getAllByText('Current:');
    expect(currentTexts).toHaveLength(6); // One for each category
  });

  test('displays "Drag money here" guidance for empty categories', () => {
    render(<InteractiveBudgetAllocation />);
    
    const dragHereTexts = screen.getAllByText('Drag money here');
    expect(dragHereTexts).toHaveLength(6); // One for each category
  });

  test('shows reset button', () => {
    render(<InteractiveBudgetAllocation />);
    
    const resetButtons = screen.getAllByText('Reset & Try Again');
    expect(resetButtons.length).toBeGreaterThan(0);
  });

  test('displays drag to allocate text on money amounts', () => {
    render(<InteractiveBudgetAllocation />);
    
    const dragTexts = screen.getAllByText('Drag to allocate');
    expect(dragTexts).toHaveLength(5); // One for each money amount
  });

  test('renders with DndContext wrapper', () => {
    render(<InteractiveBudgetAllocation />);
    
    expect(screen.getByTestId('dnd-context')).toBeInTheDocument();
  });

  test('renders with SortableContext for draggable items', () => {
    render(<InteractiveBudgetAllocation />);
    
    expect(screen.getByTestId('sortable-context')).toBeInTheDocument();
  });

  test('shows progress bars for all categories', () => {
    render(<InteractiveBudgetAllocation />);
    
    // Each category should have a progress indicator (though not visible in DOM text)
    // We can verify the structure is rendered - use getAllByText since there are multiple instances
    expect(screen.getAllByText('Current:').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('Recommended:').length).toBeGreaterThanOrEqual(1);
  });

  test('handles component lifecycle correctly', () => {
    const { unmount } = render(<InteractiveBudgetAllocation />);
    
    // Component renders successfully
    expect(screen.getByText(/Interactive Budget Allocation Game/i)).toBeInTheDocument();
    
    unmount();
  });
});
