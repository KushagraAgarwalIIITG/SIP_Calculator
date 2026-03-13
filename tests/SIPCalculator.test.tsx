import { fireEvent, render, screen, within } from '@testing-library/react';
import { SIPCalculator } from '../src/components/SIPCalculator';

vi.mock('../src/components/MilestoneChart', () => ({
  MilestoneChart: () => <div data-testid="milestone-chart">Chart</div>,
}));

describe('SIPCalculator', () => {
  beforeEach(() => {
    sessionStorage.clear();
  });

  it('renders key sections and computed numbers', () => {
    render(<SIPCalculator />);

    expect(
      screen.getByRole('heading', { name: /practical step up sip calculator/i })
    ).toBeInTheDocument();
    expect(screen.getByText(/1\. personal salary inputs/i)).toBeInTheDocument();
    expect(screen.getByText(/2\. sip inputs/i)).toBeInTheDocument();
    expect(screen.getByText(/computed numbers/i)).toBeInTheDocument();
    expect(screen.getByTestId('milestone-chart')).toBeInTheDocument();
  });

  it('navigates to about page through callback', () => {
    const onNavigate = vi.fn();
    render(<SIPCalculator onNavigate={onNavigate} />);

    fireEvent.click(screen.getByRole('button', { name: /about/i }));
    expect(onNavigate).toHaveBeenCalledWith('/about');
  });

  it('updates annual step-up helper text when slider value changes', () => {
    render(<SIPCalculator />);

    const label = screen.getByText('Annual SIP Step-Up');
    const section = label.closest('div');
    const slider = section?.parentElement?.querySelector('input[type="range"]');
    expect(slider).toBeTruthy();

    fireEvent.change(slider as HTMLInputElement, { target: { value: '12.5' } });

    expect(
      screen.getByText(/SIP steps up 12\.5% annually until salary reaches this limit/i)
    ).toBeInTheDocument();
  });

  it('opens milestone modal, adds a milestone, and supports deletion from pills', () => {
    render(<SIPCalculator />);

    fireEvent.click(screen.getByRole('button', { name: /add life milestones/i }));
    fireEvent.change(screen.getByPlaceholderText('e.g., Marriage, First Child'), {
      target: { value: 'Retirement' },
    });
    fireEvent.click(screen.getByRole('button', { name: /add milestone/i }));

    expect(screen.getByText(/milestones added: 1/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /delete milestone retirement/i })).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: /delete milestone retirement/i }));
    expect(screen.queryByText(/milestones added: 1/i)).not.toBeInTheDocument();
  });

  it('shows expected columns in age-by-age breakdown', () => {
    render(<SIPCalculator />);
    const table = screen.getByRole('table');
    const scoped = within(table);

    expect(scoped.getByText('Age')).toBeInTheDocument();
    expect(scoped.getByText('Pre-Tax Salary')).toBeInTheDocument();
    expect(scoped.getByText('Post-Tax Salary')).toBeInTheDocument();
    expect(scoped.getByText('Monthly SIP')).toBeInTheDocument();
    expect(scoped.getByText('Nominal Net Worth')).toBeInTheDocument();
    expect(scoped.getByText('Real Net Worth')).toBeInTheDocument();
  });
});
