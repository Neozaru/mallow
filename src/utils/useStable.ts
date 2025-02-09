import { replaceEqualDeep } from '@tanstack/react-query';
import { useEffect, useRef } from 'react';

// Used mainly with "useQueries" results because return value changes at each render
function useStable<T>(value: T) {
  const ref = useRef(value);
  const stable = replaceEqualDeep(ref.current, value);
  useEffect(() => {
    ref.current = stable;
  }, [stable]);
  return stable;
}

export default useStable
