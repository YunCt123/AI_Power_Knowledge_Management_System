'use client';

import { useState, useRef, useEffect } from 'react';
import { ChevronDown, Shield, Check, Crown, Code2 } from 'lucide-react';
import { useRoleStore, DemoRole } from '@/src/store/role-store';
import { cn } from '@/src/utils/cn';

interface UserProfileProps {
  className?: string;
}

const ROLE_CONFIG: Record<
  DemoRole,
  {
    name: string;
    title: string;
    email: string;
    initials: string;
    badgeColor: string;
    avatarGradient: string;
  }
> = {
  TECH_LEAD: {
    name: 'Nguyễn Văn A',
    title: 'Tech Lead 👑 (Admin)',
    email: 'techlead@repomind.ai',
    initials: 'TL',
    badgeColor: 'text-amber-600 dark:text-amber-400',
    avatarGradient: 'from-amber-500 to-orange-600',
  },
  FRESHER_DEV: {
    name: 'Trần Minh Khôi',
    title: 'Fresher Dev 👶 (Newbie)',
    email: 'fresher@repomind.ai',
    initials: 'FD',
    badgeColor: 'text-emerald-600 dark:text-emerald-400',
    avatarGradient: 'from-emerald-500 to-teal-600',
  },
};

export function UserProfile({ className }: UserProfileProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { role, setRole } = useRoleStore();

  const currentProfile = ROLE_CONFIG[role];

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelectRole = (newRole: DemoRole) => {
    setRole(newRole);
    setIsOpen(false);
  };

  return (
    <div className={cn('relative', className)} ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-haspopup="true"
        title="Bấm để chuyển đổi góc nhìn (RBAC Role Switcher)"
        className={cn(
          'flex items-center gap-2.5 rounded-lg p-1.5 text-left transition-colors duration-150',
          'hover:bg-zinc-100 dark:hover:bg-zinc-800/70',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400 dark:focus-visible:ring-zinc-600',
          isOpen && 'bg-zinc-100 dark:bg-zinc-800/70'
        )}
      >
        {/* Avatar with gradient and initials */}
        <div
          className={cn(
            'relative flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-tr text-xs font-bold text-white shadow-xs transition-all',
            currentProfile.avatarGradient
          )}
        >
          <span>{currentProfile.initials}</span>
          <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-white bg-emerald-500 dark:border-zinc-900" />
        </div>

        {/* User Info (hidden on compact screens) */}
        <div className="hidden flex-col sm:flex">
          <span className="text-xs font-semibold leading-tight text-zinc-900 dark:text-zinc-100">
            {currentProfile.name}
          </span>
          <span className={cn('text-[11px] font-semibold', currentProfile.badgeColor)}>
            {currentProfile.title}
          </span>
        </div>

        <ChevronDown
          size={14}
          className={cn(
            'text-zinc-400 transition-transform duration-200',
            isOpen && 'rotate-180'
          )}
          aria-hidden="true"
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 top-full z-50 mt-1.5 w-64 rounded-xl border border-zinc-200/80 bg-white p-1.5 shadow-lg dark:border-zinc-800 dark:bg-zinc-900 dark:shadow-2xl">
          <div className="border-b border-zinc-100 px-3 py-2 dark:border-zinc-800/80">
            <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-zinc-400">
              <Shield size={11} />
              <span>Chuyển đổi vai trò (RBAC Demo)</span>
            </div>
            <p className="mt-1 text-xs font-semibold text-zinc-900 dark:text-zinc-100">
              {currentProfile.name}
            </p>
            <p className="text-[11px] text-zinc-500 dark:text-zinc-400">
              {currentProfile.email}
            </p>
          </div>

          <div className="py-1 space-y-1">
            <button
              type="button"
              onClick={() => handleSelectRole('TECH_LEAD')}
              className={cn(
                'flex w-full items-center justify-between rounded-lg px-2.5 py-2 text-xs transition-colors',
                role === 'TECH_LEAD'
                  ? 'bg-amber-50 text-amber-900 font-semibold dark:bg-amber-950/40 dark:text-amber-200'
                  : 'text-zinc-700 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800'
              )}
            >
              <div className="flex items-center gap-2.5">
                <Crown size={15} className="text-amber-500 shrink-0" />
                <div className="text-left">
                  <div>View as: Tech Lead 👑</div>
                  <div className="text-[10px] font-normal text-zinc-500 dark:text-zinc-400">
                    Quyền Duyệt & Sửa SOP (HITL)
                  </div>
                </div>
              </div>
              {role === 'TECH_LEAD' && <Check size={14} className="text-amber-600" />}
            </button>

            <button
              type="button"
              onClick={() => handleSelectRole('FRESHER_DEV')}
              className={cn(
                'flex w-full items-center justify-between rounded-lg px-2.5 py-2 text-xs transition-colors',
                role === 'FRESHER_DEV'
                  ? 'bg-emerald-50 text-emerald-900 font-semibold dark:bg-emerald-950/40 dark:text-emerald-200'
                  : 'text-zinc-700 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800'
              )}
            >
              <div className="flex items-center gap-2.5">
                <Code2 size={15} className="text-emerald-500 shrink-0" />
                <div className="text-left">
                  <div>View as: Fresher Dev 👶</div>
                  <div className="text-[10px] font-normal text-zinc-500 dark:text-zinc-400">
                    Read-only & Nhận Cảnh Báo Jira/PR
                  </div>
                </div>
              </div>
              {role === 'FRESHER_DEV' && <Check size={14} className="text-emerald-600" />}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
