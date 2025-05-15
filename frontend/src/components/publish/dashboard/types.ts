// Type definitions for dashboard components

import type { Decimal } from "shared/models/runtime/library";

export interface Product {
  id: string;
  name: string;
  cover?: string;
  status: string;
  real_price: number | Decimal;
  author?: { name: string };
}

export interface Author {
  id: string;
  name: string;
  auth_user?: { email: string }[];
  productCount?: number;
}

export interface Transaction {
  id: string;
  type: string;
  amount: number;
  created_at: string;
}

export interface Withdrawal {
  id: string;
  amount: number;
  status: string;
  requested_at: string;
}

export interface TransactionData {
  balance: number;
  transactions: Transaction[];
  withdrawals: Withdrawal[];
}

export interface PublisherData {
  id: string;
  name: string;
  description?: string;
  logo?: string;
  website?: string;
  created_at: string;
}

export interface AuthorData {
  id: string;
  name: string;
  email: string;
  bio?: string;
  avatar?: string;
}

export interface DashboardData {
  publisherData: PublisherData | null;
  authorData: AuthorData | null;
  products: Product[];
  authors: Author[];
  transactions: TransactionData | null;
}

// Helper functions
export const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('id-ID', { 
    day: 'numeric', 
    month: 'long', 
    year: 'numeric'
  }).format(date);
};

export const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
};