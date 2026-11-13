import { create } from 'zustand';

export type DemoRole = 'TECH_LEAD' | 'FRESHER_DEV';

interface RoleStore {
  role: DemoRole;
  setRole: (role: DemoRole) => void;
  toggleRole: () => void;
}

export const useRoleStore = create<RoleStore>((set) => ({
  role: 'TECH_LEAD',
  setRole: (role) => set({ role }),
  toggleRole: () =>
    set((state) => ({
      role: state.role === 'TECH_LEAD' ? 'FRESHER_DEV' : 'TECH_LEAD',
    })),
}));
