'use client';

import { useEffect, useState } from 'react';

/**
 * Subscribe to a CSS media query and reactively return whether it matches.
 *
 * @param query - A valid CSS media query string (e.g. `'(min-width: 768px)'`).
 * @returns `true` when the viewport matches the query, `false` otherwise.
 *
 * @example
 * const isDesktop = useMediaQuery('(min-width: 1024px)');
 */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const mql = window.matchMedia(query);
    setMatches(mql.matches);

    const handler = (event: MediaQueryListEvent) => {
      setMatches(event.matches);
    };

    mql.addEventListener('change', handler);
    return () => mql.removeEventListener('change', handler);
  }, [query]);

  return matches;
}
