'use client';

import { useSyncExternalStore } from 'react';

const emptySubscribe = () => () => {};

/**
 * Returns `true` once the component has mounted on the client.
 * Useful for guarding against hydration mismatches when rendering
 * client-only content (e.g. theme-dependent UI, browser APIs).
 */
export function useMounted(): boolean {
  return useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );
}
