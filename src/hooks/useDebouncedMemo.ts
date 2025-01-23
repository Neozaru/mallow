import { useState, useEffect } from 'react';

/**
 * A custom hook that delays updates to a memoized value until changes
 * have stopped for a specified delay.
 * @param factory The function to compute the value.
 * @param deps The dependencies to watch for changes.
 * @param delay The debounce delay in milliseconds.
 * @returns The debounced value.
 */
function useDebouncedMemo<T>(factory: () => T, deps: any[], delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState(factory);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(factory());
    }, delay);

    return () => clearTimeout(handler);
  }, [...deps, delay]); // Re-run effect when deps or delay changes

  return debouncedValue;
}

export default useDebouncedMemo
