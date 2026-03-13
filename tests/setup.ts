import '@testing-library/jest-dom/vitest';

class ResizeObserverMock {
  observe() {}
  unobserve() {}
  disconnect() {}
}

// Recharts relies on browser APIs unavailable in jsdom by default.
vi.stubGlobal('ResizeObserver', ResizeObserverMock);

Object.defineProperty(window, 'scrollTo', {
  value: vi.fn(),
  writable: true,
});
