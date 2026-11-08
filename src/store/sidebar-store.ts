import { create } from 'zustand';

/** State shape for the sidebar store. */
interface SidebarState {
  /** Whether the sidebar is visible (mobile overlay). */
  isOpen: boolean;
  /** Whether the sidebar is in collapsed (icon-only) mode. */
  isCollapsed: boolean;
  /** Toggle sidebar open/closed. */
  toggle: () => void;
  /** Open the sidebar. */
  open: () => void;
  /** Close the sidebar. */
  close: () => void;
  /** Toggle between expanded and collapsed (icon-only) mode. */
  toggleCollapse: () => void;
}

/**
 * Global sidebar state managed with Zustand.
 *
 * - `isOpen` controls mobile drawer visibility (default: `true`)
 * - `isCollapsed` controls desktop icon-only mode (default: `false`)
 */
export const useSidebarStore = create<SidebarState>((set) => ({
  isOpen: true,
  isCollapsed: false,
  toggle: () => set((state) => ({ isOpen: !state.isOpen })),
  open: () => set({ isOpen: true }),
  close: () => set({ isOpen: false }),
  toggleCollapse: () => set((state) => ({ isCollapsed: !state.isCollapsed })),
}));
