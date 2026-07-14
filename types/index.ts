// Tipos globales de Nexo

export type TransactionType = "EXPENSE" | "INCOME" | "TRANSFER";
export type PaymentMethod =
  | "CASH"
  | "DEBIT_CARD"
  | "CREDIT_CARD"
  | "TRANSFER"
  | "DIGITAL_WALLET"
  | "OTHER";
export type AccountType =
  | "CHECKING"
  | "SAVINGS"
  | "CREDIT"
  | "CASH"
  | "INVESTMENT";
export type GoalStatus = "ACTIVE" | "COMPLETED" | "PAUSED" | "CANCELLED";
export type AchievementRarity = "COMMON" | "RARE" | "EPIC" | "LEGENDARY";
export type BudgetPeriod = "WEEKLY" | "MONTHLY" | "YEARLY";

export interface User {
  id: string;
  name: string;
  avatar?: string | null;
  currency: string;
  locale: string;
  timezone: string;
  monthlyIncome?: number | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface Category {
  id: string;
  userId?: string | null;
  name: string;
  emoji: string;
  icon: string;
  color: string;
  description?: string | null;
  parentId?: string | null;
  isSystem: boolean;
  isArchived: boolean;
  sortOrder: number;
  createdAt: Date;
}

export interface Transaction {
  id: string;
  userId: string;
  accountId?: string | null;
  categoryId: string;
  category?: Category;
  amount: number;
  type: TransactionType;
  description: string;
  notes?: string | null;
  date: Date;
  paymentMethod?: PaymentMethod | null;
  location?: string | null;
  receiptUrl?: string | null;
  tags: string[];
  isRecurring: boolean;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date | null;
}

export interface Goal {
  id: string;
  userId: string;
  name: string;
  description?: string | null;
  targetAmount: number;
  currentAmount: number;
  currency: string;
  deadline?: Date | null;
  imageUrl?: string | null;
  color: string;
  emoji: string;
  status: GoalStatus;
  createdAt: Date;
  updatedAt: Date;
}

export interface GamificationProfile {
  id: string;
  userId: string;
  level: number;
  xp: number;
  totalXp: number;
  streak: number;
  longestStreak: number;
  lastActiveAt?: Date | null;
  achievements?: UserAchievement[];
}

export interface Achievement {
  id: string;
  key: string;
  name: string;
  description: string;
  emoji: string;
  xpReward: number;
  rarity: AchievementRarity;
}

export interface UserAchievement {
  id: string;
  profileId: string;
  achievementId: string;
  unlockedAt: Date;
  achievement?: Achievement;
}

// ─── API Response Types ───────────────────────────────────────

export interface ApiResponse<T> {
  data: T;
  message?: string;
}

export interface ApiError {
  error: string;
  code?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}

// ─── Dashboard Types ──────────────────────────────────────────

export interface DashboardStats {
  balance: number;
  totalIncome: number;
  totalExpenses: number;
  savings: number;
  savingsRate: number;
  previousMonthExpenses: number;
  previousMonthIncome: number;
  expenseChange: number;
  incomeChange: number;
}

export interface CategoryBreakdown {
  categoryId: string;
  categoryName: string;
  emoji: string;
  color: string;
  amount: number;
  percentage: number;
  transactionCount: number;
}

export interface DailyExpense {
  date: string;
  amount: number;
  count: number;
}

export interface MonthlyEvolution {
  month: string;
  income: number;
  expenses: number;
  savings: number;
}

// ─── Filter Types ─────────────────────────────────────────────

export interface TransactionFilters {
  search?: string;
  categoryId?: string;
  type?: TransactionType;
  paymentMethod?: PaymentMethod;
  startDate?: Date;
  endDate?: Date;
  minAmount?: number;
  maxAmount?: number;
  page?: number;
  pageSize?: number;
  sortBy?: "date" | "amount" | "description";
  sortOrder?: "asc" | "desc";
}
