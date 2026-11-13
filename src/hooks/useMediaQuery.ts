'use client';

import { useSyncExternalStore } from 'react';

/**
 * Subscribe to a CSS media query and reactively return whether it matches.
 *
 * @param query - A valid CSS media query string (e.g. `'(min-width: 768px)'`).
 * @returns `true` when the viewport matches the query, `false` otherwise.
 */
export function useMediaQuery(query: string): boolean {
  return useSyncExternalStore(
    (onStoreChange) => {
      if (typeof window === 'undefined') return () => {};
      const mql = window.matchMedia(query);
      mql.addEventListener('change', onStoreChange);
      return () => mql.removeEventListener('change', onStoreChange);
    },
    () => (typeof window !== 'undefined' ? window.matchMedia(query).matches : false),
    () => false
  );
}
