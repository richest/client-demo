"use client";

import { useEffect, useRef, useState } from "react";

export function useLocalStorage<T>(key: string, initialValue: T) {
  const initialValueRef = useRef(initialValue);
  const [storedValue, setStoredValue] = useState<T>(initialValueRef.current);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const rawValue = window.localStorage.getItem(key);
      if (rawValue) {
        setStoredValue(JSON.parse(rawValue) as T);
      } else {
        setStoredValue(initialValueRef.current);
      }
    } catch {
      setStoredValue(initialValueRef.current);
    } finally {
      setHydrated(true);
    }
  }, [key]);

  const updateValue = (value: T | ((currentValue: T) => T)) => {
    setStoredValue((currentValue) => {
      const nextValue =
        typeof value === "function" ? (value as (currentValue: T) => T)(currentValue) : value;

      window.localStorage.setItem(key, JSON.stringify(nextValue));
      return nextValue;
    });
  };

  return [storedValue, updateValue, hydrated] as const;
}
