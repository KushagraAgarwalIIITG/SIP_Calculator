import { act, renderHook } from '@testing-library/react';
import { useSessionStorage } from '../src/hooks/useSessionStorage';

describe('useSessionStorage', () => {
  beforeEach(() => {
    sessionStorage.clear();
  });

  it('returns initial value when sessionStorage is empty', () => {
    const { result } = renderHook(() => useSessionStorage('k1', 42));
    expect(result.current[0]).toBe(42);
  });

  it('reads existing value from sessionStorage', () => {
    sessionStorage.setItem('k2', JSON.stringify(99));
    const { result } = renderHook(() => useSessionStorage('k2', 0));
    expect(result.current[0]).toBe(99);
  });

  it('updates state and sessionStorage when setter is called', () => {
    const { result } = renderHook(() => useSessionStorage('k3', 10));

    act(() => {
      result.current[1](25);
    });

    expect(result.current[0]).toBe(25);
    expect(JSON.parse(sessionStorage.getItem('k3') || 'null')).toBe(25);
  });
});
