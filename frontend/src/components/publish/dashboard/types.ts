// Types for the dashboard components

export interface Product {
  id: string;
  name: string;
  cover?: string;
  status: string;
  real_price: number;
  author?: {
    name: string;
  };
}

export interface Author {
  id: string;
  name: string;
  auth_user?: Array<{ email: string }>;
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

export interface TransactionsData {
  balance: number;
  transactions: Transaction[];
  withdrawals: Withdrawal[];
}

export interface AuthorData {
  id: string;
  name: string;
  email: string;
}

export interface DashboardData {
  publisherData: any;
  authorData: AuthorData | null;
  products: Product[];
  authors: Author[];
  transactions: TransactionsData | null;
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