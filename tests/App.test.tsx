import { fireEvent, render, screen } from '@testing-library/react';
import App from '../src/App';

vi.mock('../src/components/SIPCalculator', () => ({
  SIPCalculator: ({ onNavigate }: { onNavigate?: (path: string) => void }) => (
    <button onClick={() => onNavigate?.('/about')}>Go About</button>
  ),
}));

vi.mock('../src/components/AboutPage', () => ({
  AboutPage: ({ onNavigate }: { onNavigate?: (path: string) => void }) => (
    <button onClick={() => onNavigate?.('/home')}>Go Home</button>
  ),
}));

describe('App routing', () => {
  it('normalizes root route to /home', () => {
    window.history.pushState({}, '', '/');
    render(<App />);
    expect(window.location.pathname).toBe('/home');
    expect(screen.getByRole('button', { name: /go about/i })).toBeInTheDocument();
  });

  it('renders about route and navigates back to home', () => {
    window.history.pushState({}, '', '/about');
    render(<App />);

    fireEvent.click(screen.getByRole('button', { name: /go home/i }));
    expect(window.location.pathname).toBe('/home');
  });
});
