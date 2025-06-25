import type {
  affiliate,
  auth_account,
  auth_user,
  author,
  book,
  book_approval,
  book_changes_log,
  bundle,
  category,
  chapter,
  customer,
  customer_reader,
  customer_track,
  internal,
  notif,
  product,
  promo_code,
  publisher,
  publisher_author,
  t_sales,
  t_sales_line,
  transaction,
  withdrawal,
} from "shared/models";
import type { Decimal, JsonValue } from "shared/models/runtime/library";

export type Author = author & {
  auth_user: auth_user[];
  auth_account: auth_account | null;
  publisher_author: (publisher_author & {
    publisher: publisher & {
      transaction: transaction[];
      promo_code: promo_code[];
    };
  })[];
  book: book[];
  product: product[];
  bundle: bundle[];
};

export type BookChangesLog = Omit<book_changes_log, "changes"> & {
  changes:
    | JsonValue
    | null
    | {
        newFields: Record<string, any>;
        oldFields: Record<string, any>;
      };
  hash_value?: string;
};

export type Book = book & {
  author: author | null;
  book_approval: book_approval[];
  book_changes_log: BookChangesLog[];
  product: Partial<Product | null>;
  chapter: chapter[];
};

export type BookApproval = book_approval & {
  book: book & { author: author | null };
  internal: internal | null;
};

export type RoleCheck = {
  affiliate?: boolean;
  author?: boolean;
  customer?: boolean;
  internal?: boolean;
  publisher?: boolean;
};

export type Onboarding = {
  author?: author;
  publisher?: publisher;
};

export type Product = product & {
  author: author | null;
  bundle_product: { bundle: bundle }[];
  product_category: { category: category }[];
};

export type PublisherAuthor = publisher_author & {
  author: author & {
    auth_account: auth_account | null;
    auth_user: auth_user[];
    book: book[];
    product: product[];
  };
};

export type Publisher = publisher & {
  auth_user: auth_user[];
  auth_account: auth_account | null;
  publisher_author: (publisher_author & {
    author: author & {
      book: book[];
      product: product[];
    };
  })[];
  transaction: transaction[];
  promo_code: promo_code[];
};

export type Transactions = {
  transaction: transaction[];
  balance: number | Decimal;
  withdrawal: withdrawal[];
};

export type AuthUser = auth_user & {
  auth_account: auth_account[];
  affiliate: affiliate | null;
  author: author | null;
  customer: customer | null;
  internal: internal | null;
  publisher: publisher | null;
};

export type Withdrawal = {
  withdrawal: withdrawal;
  transaction: transaction;
};

export type Account = auth_account & {
  auth_user: auth_user | null;
};

export enum BookStatus {
  DRAFT = "draft",
  SUBMITTED = "submitted",
  PUBLISHED = "published",
  REJECTED = "rejected",
}

export enum ProductStatus {
  PUBLISHED = "published",
  PAUSED = "paused",
  DISCONTINUED = "DISCONTINUED",
}

export enum Currency {
  IDR = "IDR",
  USD = "USD",
  EUR = "EUR",
  JPY = "JPY",
  GBP = "GBP",
}

export type TSalesLine = t_sales_line & {
  t_sales: t_sales;
  product: product | null;
  bundle: bundle | null;
};

export enum Role {
  AFFILIATE = "affiliate",
  AUTHOR = "author",
  CUSTOMER = "customer",
  INTERNAL = "internal",
  PUBLISHER = "publisher",
}

export enum InternalRole {
  IT = "it",
  MANAGEMENT = "management",
  SALES_AND_MARKETING = "sales_and_marketing",
  SUPPORT = "support",
}

export enum BadgeStatus {
  CART = "cart",
  PENDING = "pending",
  PAID = "paid",
  CANCELED = "canceled",
  EXPIRED = "expired",
  FRAUD = "fraud",
  REFUNDED = "refunded",
}

export enum BookTypeKey {
  UTUH = "utuh",
  CHAPTER = "chapter",
}

export const BookTypes = [
  { label: "Buku Utuh", key: BookTypeKey.UTUH },
  { label: "Buku Chapter", key: BookTypeKey.CHAPTER },
];

export type Chapter = chapter & {
  book: book | null;
  product: product | null;
};

export type Notif = notif & {
  auth_user: auth_user;
};

export type Bundle = bundle & {
  author?: author | null;
  bundle_product: {
    id: string;
    product: product | null;
    qty: number | null;
  }[];
  bundle_category: {
    id: string;
    category: category | null;
  }[];
};

export type Affiliate = affiliate & {
  auth_user: auth_user[];
  auth_account: auth_account | null;
};

export type Customer = customer & {
  auth_user: auth_user[];
  auth_account: auth_account | null;
  t_sales: t_sales[];
  customer_track: customer_track[];
  customer_reader: customer_reader[];
};

export type Internal = internal & {
  auth_user: auth_user | null;
  auth_account: auth_account | null;
};

// List types for API responses - flexible to handle optional includes
export type PublisherListItem = publisher & {
  auth_user?: auth_user[];
  auth_account?: auth_account | null;
  publisher_author?: {
    id: string;
    publisher_id: string;
    author_id: string;
    author?: author;
  }[];
  transaction?: transaction[];
  promo_code?: promo_code[];
  withdrawal?: withdrawal[];
  t_ai_credit?: any[];
};

export type AuthorListItem = author & {
  auth_user?: auth_user[];
  auth_account?: auth_account | null;
  publisher_author?: {
    id: string;
    publisher_id: string;
    author_id: string;
    publisher?: publisher;
  }[];
  book?: book[];
  product?: product[];
  bundle?: bundle[];
};

export type InternalListItem = internal & {
  auth_user?: auth_user[];
  auth_account?: auth_account | null;
  book_approval?: book_approval[];
  _count?: {
    auth_user?: number;
    book_approval?: number;
  };
};

export type CustomerListItem = customer & {
  auth_user?: auth_user[];
  auth_account?: auth_account | null;
  t_sales?: t_sales[];
  customer_track?: customer_track[];
  customer_reader?: customer_reader[];
};

export type AffiliateListItem = affiliate & {
  auth_user?: auth_user[];
  auth_account?: auth_account | null;
};

export type BundleListItem = bundle & {
  author?: author | null;
  bundle_product?: {
    id: string;
    product?: product | null;
    qty?: number | null;
  }[];
  bundle_category?: {
    id: string;
    category?: category | null;
  }[];
};

// Stats response types
export type DashboardStatsData = {
  overview: {
    total_authors?: number;
    total_books?: number;
    total_customers?: number;
    total_products?: number;
    total_sales_count: number;
    total_sales_revenue: number;
    total_quantity_sold?: number;
    period_days: number;
  };
  recent_sales: unknown[];
  top_authors?: unknown[];
  top_books?: unknown[];
  sales_by_month: unknown[];
};

export type InternalStatsData = {
  internal?: {
    id: string;
    name: string;
    roles: {
      sales_and_marketing: boolean;
      support: boolean;
      management: boolean;
      it: boolean;
    };
    user_count: number;
    book_approval_count: number;
  };
  overview?: {
    total_internals: number;
    roles: {
      sales_and_marketing: number;
      support: number;
      management: number;
      it: number;
    };
    internals_with_users: number;
    internals_with_book_approvals: number;
    total_book_approvals: number;
  };
};

// Configuration type
export type ConfigItem = {
  key: string;
  value: string;
};

// Bundle Stats Response Types
export type BundleStatsResponse = {
  bundle: {
    id: string;
    name: string;
    slug: string;
    status: string;
    real_price: Decimal;
    strike_price: Decimal | null;
  };
  product_count: number;
  category_count: number;
  sales_stats: {
    total_sales: number;
    total_revenue: number;
    unique_customers: number;
    average_order_value: number;
  };
};

export type BundleOverallStatsResponse = {
  bundle_counts: {
    total: number;
    active: number;
    draft: number;
    published: number;
    deleted: number;
    with_products: number;
    with_categories: number;
    empty: number;
  };
  sales_stats: {
    total_sales: number;
    total_revenue: number;
    total_orders: number;
    average_order_value: number;
  };
};

// Product List Response Types
export type ProductListItem = product & {
  author?: {
    id: string;
    name: string;
  } | null;
};

export type ProductListResponse = {
  products: ProductListItem[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
};

// Bundle Get with full includes
export type BundleGetResponse = bundle & {
  bundle_product?: {
    id: string;
    product?:
      | (product & {
          author?: author | null;
          product_category?: {
            id: string;
            category: category | null;
          }[];
        })
      | null;
    qty?: number | null;
  }[];
  bundle_category?: {
    id: string;
    category?: category | null;
  }[];
  t_sales_line?: {
    id: string;
    t_sales: {
      id: string;
      created_at: Date;
      customer?: customer | null;
    };
  }[];
};

// Update Response Types
export type CustomerUpdateResponse = customer & {
  auth_user: auth_user[];
  auth_account: auth_account | null;
};

export type PublisherUpdateResponse = publisher & {
  auth_user?: auth_user[];
  auth_account?: auth_account | null;
  publisher_author?: {
    id: string;
    publisher_id: string;
    author_id: string;
    author?: author;
  }[];
};

export type InternalUpdateResponse = internal & {
  auth_user?: auth_user[];
  auth_account?: auth_account | null;
  book_approval?: book_approval[];
};

export type BundleUpdateResponse = {
  id: string;
  name: string;
  slug: string;
  desc: string;
  real_price: Decimal;
  strike_price: Decimal | null;
  currency: string;
  status: string;
  cover: string;
  img_file: string;
  info: JsonValue;
  sku: string;
  bundle_category?: {
    category?: {
      id: string;
      name: string;
    } | null;
  }[];
  bundle_product?: {
    id: string;
    qty?: number | null;
    product?: {
      id: string;
      name: string;
      real_price: Decimal;
      currency: string;
      cover: string;
      author?: {
        id: string;
        name: string;
      } | null;
    } | null;
  }[];
};

// Create Response Types
export type BundleCreateResponse = BundleUpdateResponse;

// Delete Response Types
export type BundleDeleteResponse = bundle;

// Category/Product Management Response Types
export type BundleManagementResponse = {
  id: string;
  name: string;
  bundle_category?: {
    id: string;
    category?: {
      id: string;
      name: string;
      slug: string | null;
      deleted_at: Date | null;
      id_parent: string | null;
      img: string | null;
    } | null;
  }[];
  bundle_product?: {
    id: string;
    product?: {
      id: string;
      name: string;
      real_price: Decimal;
      currency: string;
      cover: string;
    } | null;
    qty?: number | null;
  }[];
} & bundle;

// Search Response Types
export type BundleSearchResponse = {
  bundles: (Bundle & {
    total_products?: number;
    total_quantity?: number;
  })[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  filters: {
    query?: string;
    status?: string[];
    price_range: {
      min?: number;
      max?: number;
    };
    has_products?: boolean;
    has_categories?: boolean;
    category_ids?: string[];
    product_ids?: string[];
  };
  sort: {
    sort_by?: string;
    sort_order?: string;
  };
};
