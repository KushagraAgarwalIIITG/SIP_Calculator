import { useState} from 'react';

export function useSessionStorage<T>(key: string, initialValue: T): [T, (value: T) => void] {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = typeof window !== 'undefined' ? sessionStorage.getItem(key) : null;
      return item ? JSON.parse(item) : initialValue;
    } catch {
      return initialValue;
    }
  });

  const setValue = (value: T) => {
    try {
      setStoredValue(value);
      if (typeof window !== 'undefined') {
        sessionStorage.setItem(key, JSON.stringify(value));
      }
    } catch {
      console.error(`Error saving to session storage: ${key}`);
    }
  };

  return [storedValue, setValue];
}
