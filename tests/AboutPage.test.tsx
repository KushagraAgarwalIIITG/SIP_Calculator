import { fireEvent, render, screen } from '@testing-library/react';
import { AboutPage } from '../src/components/AboutPage';

describe('AboutPage', () => {
  it('renders mission text and linkedin links', () => {
    render(<AboutPage />);

    expect(
      screen.getByText(/financial calculators built for real indian needs/i)
    ).toBeInTheDocument();

    const kushagra = screen.getByRole('link', { name: /kushagra agarwal/i });
    const priya = screen.getByRole('link', { name: /priya pampati/i });

    expect(kushagra).toHaveAttribute(
      'href',
      'https://www.linkedin.com/in/kushagraagggarwal/'
    );
    expect(priya).toHaveAttribute(
      'href',
      'https://www.linkedin.com/in/priyapampati/'
    );
  });

  it('uses onNavigate callback when Home is clicked', () => {
    const onNavigate = vi.fn();
    render(<AboutPage onNavigate={onNavigate} />);

    fireEvent.click(screen.getByRole('button', { name: /home/i }));
    expect(onNavigate).toHaveBeenCalledWith('/home');
  });
});
