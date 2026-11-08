/** Sidebar navigation item. */
export interface NavItem {
  /** Lucide icon name (e.g. 'LayoutDashboard', 'Search'). */
  icon: string;
  /** Display label shown in the sidebar. */
  label: string;
  /** Route path this item links to. */
  href: string;
  /** Optional badge text (e.g. notification count, "New"). */
  badge?: string;
}

/** Dashboard statistics card. */
export interface StatsCard {
  /** Card title (e.g. "Total Knowledge Entries"). */
  title: string;
  /** Formatted display value (e.g. "1,284"). */
  value: string;
  /** Percentage change from the previous period. */
  change: number;
  /** Direction of the change. */
  changeType: 'increase' | 'decrease';
  /** Lucide icon name for the card. */
  icon: string;
}

/** Application user profile. */
export interface User {
  /** Unique user identifier. */
  id: string;
  /** Full display name. */
  name: string;
  /** Email address. */
  email: string;
  /** URL to avatar image. */
  avatar: string;
  /** User role within the system. */
  role: 'admin' | 'editor' | 'viewer';
}

/** Breadcrumb trail item. */
export interface BreadcrumbItem {
  /** Display label for this breadcrumb segment. */
  label: string;
  /** Route path (omit for the current/active segment). */
  href?: string;
}

/** A single knowledge base entry. */
export interface KnowledgeEntry {
  /** Unique entry identifier. */
  id: string;
  /** Entry title. */
  title: string;
  /** Full markdown/text content. */
  content: string;
  /** The user who created this entry. */
  author: User;
  /** ISO 8601 creation timestamp. */
  createdAt: string;
  /** Descriptive tags for categorization. */
  tags: string[];
  /** Primary category. */
  category: string;
}

/** A contributor with ranking info. */
export interface Contributor {
  /** Unique user identifier. */
  id: string;
  /** Full display name. */
  name: string;
  /** Email address. */
  email: string;
  /** URL to avatar image. */
  avatar: string;
  /** User role within the system. */
  role: 'admin' | 'editor' | 'viewer';
  /** Total number of contributions. */
  contributionCount: number;
  /** Leaderboard rank (1-based). */
  rank: number;
}
