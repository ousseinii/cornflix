import { useState, useEffect } from "react";

export function useLocalStorageState(initialState, key) {
  const [value, setValue] = useState(() => {
    const storedValue = localStorage.getItem(key);
    try {
      const parsedValue = storedValue ? JSON.parse(storedValue) : initialState;
      return Array.isArray(parsedValue) ? parsedValue : initialState; // Validation
    } catch (error) {
      console.error("Erreur de parsing du localStorage:", error);
      return initialState;
    }
  });

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [value, key]);

  return [value, setValue];
}
