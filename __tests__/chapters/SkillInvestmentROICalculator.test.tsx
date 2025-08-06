import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import SkillInvestmentROICalculator from '@/components/chapters/fundamentals/calculators/SkillInvestmentROICalculator';

// Mock the progress store
jest.mock('@/lib/store/progressStore', () => ({
  useProgressStore: jest.fn(() => jest.fn()),
}));

describe('SkillInvestmentROICalculator', () => {
  beforeEach(() => {
    // Reset any mocks
    jest.clearAllMocks();
  });

  test('renders component with header and description', () => {
    render(<SkillInvestmentROICalculator />);
    
    expect(screen.getByText(/Skill Investment ROI Calculator/i)).toBeInTheDocument();
    expect(screen.getByText(/Calculate the return on investment for skills/i)).toBeInTheDocument();
  });

  test('shows current salary input with proper accessibility attributes', () => {
    render(<SkillInvestmentROICalculator />);
    
    const salaryInput = screen.getByLabelText(/Current Annual Salary/i);
    expect(salaryInput).toBeInTheDocument();
    expect(salaryInput).toHaveAttribute('id', 'currentSalary');
    expect(salaryInput).toHaveAttribute('aria-describedby');
    expect(salaryInput).toHaveAttribute('aria-invalid', 'false');
    expect(salaryInput).toHaveAttribute('min', '20000');
    expect(salaryInput).toHaveAttribute('max', '1000000');
    expect(salaryInput).toHaveAttribute('step', '1000');
  });

  test('shows help text for current salary input', () => {
    render(<SkillInvestmentROICalculator />);
    
    expect(screen.getByText(/Your current annual salary used to calculate skill investment returns/i)).toBeInTheDocument();
  });

  test('validates current salary and shows error messages', async () => {
    render(<SkillInvestmentROICalculator />);
    
    const salaryInput = screen.getByLabelText(/Current Annual Salary/i);
    
    // Test invalid input (too low)
    fireEvent.change(salaryInput, { target: { value: '10000' } });
    
    await waitFor(() => {
      expect(screen.getByRole('alert')).toBeInTheDocument();
      expect(screen.getByText(/Please enter a valid salary \(minimum: \$20,000\)/i)).toBeInTheDocument();
    });
    
    // Test that aria-invalid is updated
    expect(salaryInput).toHaveAttribute('aria-invalid', 'true');
    expect(salaryInput).toHaveClass('border-red-500');
  });

  test('clears validation errors when valid salary is provided', async () => {
    render(<SkillInvestmentROICalculator />);
    
    const salaryInput = screen.getByLabelText(/Current Annual Salary/i);
    
    // First enter invalid input
    fireEvent.change(salaryInput, { target: { value: '10000' } });
    
    await waitFor(() => {
      expect(screen.getByRole('alert')).toBeInTheDocument();
    });
    
    // Then enter valid input
    fireEvent.change(salaryInput, { target: { value: '75000' } });
    
    await waitFor(() => {
      expect(screen.queryByRole('alert')).not.toBeInTheDocument();
      expect(salaryInput).toHaveAttribute('aria-invalid', 'false');
    });
  });

  test('shows new skill form inputs with proper accessibility attributes', () => {
    render(<SkillInvestmentROICalculator />);
    
    // Check skill name input
    const skillNameInput = screen.getByLabelText(/Skill\/Certification Name/i);
    expect(skillNameInput).toHaveAttribute('id', 'skillName');
    expect(skillNameInput).toHaveAttribute('aria-describedby', 'skillName-help');
    
    // Check cost input
    const costInput = screen.getByLabelText(/Cost \(\$\)/i);
    expect(costInput).toHaveAttribute('id', 'investmentCost');
    expect(costInput).toHaveAttribute('min', '0');
    expect(costInput).toHaveAttribute('max', '500000');
    
    // Check time input
    const timeInput = screen.getByLabelText(/Time \(hours\)/i);
    expect(timeInput).toHaveAttribute('id', 'timeInvested');
    expect(timeInput).toHaveAttribute('min', '0');
    expect(timeInput).toHaveAttribute('max', '5000');
    
    // Check salary increase input
    const salaryIncreaseInput = screen.getByLabelText(/Salary Increase \(%\)/i);
    expect(salaryIncreaseInput).toHaveAttribute('id', 'salaryIncrease');
    expect(salaryIncreaseInput).toHaveAttribute('min', '0');
    expect(salaryIncreaseInput).toHaveAttribute('max', '100');
    
    // Check years of benefit input
    const yearsInput = screen.getByLabelText(/Years of Benefit/i);
    expect(yearsInput).toHaveAttribute('id', 'yearsOfBenefit');
    expect(yearsInput).toHaveAttribute('min', '1');
    expect(yearsInput).toHaveAttribute('max', '40');
  });

  test('shows help text for all form inputs', () => {
    render(<SkillInvestmentROICalculator />);
    
    expect(screen.getByText(/Name of the skill, certification, or education you want to invest in/i)).toBeInTheDocument();
    expect(screen.getByText(/Total monetary cost/i)).toBeInTheDocument();
    expect(screen.getByText(/Hours to complete/i)).toBeInTheDocument();
    expect(screen.getByText(/Expected raise %/i)).toBeInTheDocument();
    expect(screen.getByText(/Career impact duration/i)).toBeInTheDocument();
  });

  test('shows skill category select with proper accessibility', () => {
    render(<SkillInvestmentROICalculator />);
    
    const categorySelect = screen.getByLabelText(/Skill Category/i);
    expect(categorySelect).toHaveAttribute('id', 'skillCategory');
    expect(categorySelect).toHaveAttribute('aria-describedby', 'skillCategory-help');
    
    expect(screen.getByText(/Choose the category that best describes this skill investment/i)).toBeInTheDocument();
  });

  test('add skill button is disabled when required fields are empty', () => {
    render(<SkillInvestmentROICalculator />);
    
    const addButton = screen.getByRole('button', { name: /Add Skill Investment/i });
    expect(addButton).toBeDisabled();
    expect(addButton).toHaveClass('cursor-not-allowed');
  });

  test('add skill button becomes enabled when required fields are filled', () => {
    render(<SkillInvestmentROICalculator />);
    
    const skillNameInput = screen.getByLabelText(/Skill\/Certification Name/i);
    const costInput = screen.getByLabelText(/Cost \(\$\)/i);
    const addButton = screen.getByRole('button', { name: /Add Skill Investment/i });
    
    // Initially disabled
    expect(addButton).toBeDisabled();
    
    // Fill required fields
    fireEvent.change(skillNameInput, { target: { value: 'Test Certification' } });
    fireEvent.change(costInput, { target: { value: '1000' } });
    
    // Should be enabled now
    expect(addButton).not.toBeDisabled();
  });

  test('adds new skill to analysis when form is submitted', () => {
    render(<SkillInvestmentROICalculator />);
    
    // Fill out the form with a unique skill name
    fireEvent.change(screen.getByLabelText(/Skill\/Certification Name/i), { target: { value: 'Python Programming Certification' } });
    fireEvent.change(screen.getByLabelText(/Cost \(\$\)/i), { target: { value: '300' } });
    fireEvent.change(screen.getByLabelText(/Time \(hours\)/i), { target: { value: '100' } });
    fireEvent.change(screen.getByLabelText(/Salary Increase \(%\)/i), { target: { value: '10' } });
    fireEvent.change(screen.getByLabelText(/Years of Benefit/i), { target: { value: '5' } });
    
    // Submit the form
    fireEvent.click(screen.getByRole('button', { name: /Add Skill Investment/i }));
    
    // Check if the skill appears in the analysis - it may appear multiple times
    expect(screen.getAllByText(/Python Programming Certification/i).length).toBeGreaterThan(0);
  });

  test('shows default skill investments with ROI analysis', () => {
    render(<SkillInvestmentROICalculator />);
    
    // Check for ROI analysis elements first
    expect(screen.getByText(/Skill Investment Analysis/i)).toBeInTheDocument();
    expect(screen.getByText(/Best ROI/i)).toBeInTheDocument();
    
    // Check for default skills existence without exact count
    expect(screen.getAllByText(/Cloud Certification/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/MBA or Master's Degree/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Data Science Bootcamp/i).length).toBeGreaterThan(0);
  });

  test('remove button has proper accessibility attributes', () => {
    render(<SkillInvestmentROICalculator />);
    
    // Find the first remove button
    const removeButton = screen.getAllByText(/Remove/i)[0];
    expect(removeButton).toHaveAttribute('aria-label');
    expect(removeButton.getAttribute('aria-label')).toContain('Remove');
  });

  test('updates input values correctly with validation', () => {
    render(<SkillInvestmentROICalculator />);
    
    const salaryInput = screen.getByLabelText(/Current Annual Salary/i);
    const skillNameInput = screen.getByLabelText(/Skill\/Certification Name/i);
    const costInput = screen.getByLabelText(/Cost \(\$\)/i);
    
    fireEvent.change(salaryInput, { target: { value: '85000' } });
    fireEvent.change(skillNameInput, { target: { value: 'Project Management' } });
    fireEvent.change(costInput, { target: { value: '2500' } });
    
    expect(salaryInput).toHaveValue(85000);
    expect(skillNameInput).toHaveValue('Project Management');
    expect(costInput).toHaveValue(2500);
  });

  test('validates input bounds correctly', () => {
    render(<SkillInvestmentROICalculator />);
    
    const costInput = screen.getByLabelText(/Cost \(\$\)/i);
    const timeInput = screen.getByLabelText(/Time \(hours\)/i);
    const salaryIncreaseInput = screen.getByLabelText(/Salary Increase \(%\)/i);
    
    // Test max values are respected
    fireEvent.change(costInput, { target: { value: '600000' } }); // Over max
    fireEvent.change(timeInput, { target: { value: '6000' } }); // Over max
    fireEvent.change(salaryIncreaseInput, { target: { value: '150' } }); // Over max
    
    // Values should be capped at their maximums
    expect(costInput).toHaveValue(500000);
    expect(timeInput).toHaveValue(5000);
    expect(salaryIncreaseInput).toHaveValue(100);
  });

  test('shows summary insights when skills are present', () => {
    render(<SkillInvestmentROICalculator />);
    
    // Should show investment strategy insights
    expect(screen.getByText(/Investment Strategy Insights/i)).toBeInTheDocument();
    expect(screen.getByText(/Best Investment/i)).toBeInTheDocument();
    expect(screen.getByText(/Total Investment/i)).toBeInTheDocument();
    expect(screen.getByText(/Total Lifetime Benefit/i)).toBeInTheDocument();
  });
});
