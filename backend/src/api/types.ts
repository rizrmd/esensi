import type {
  affiliate,
  auth_account,
  auth_user,
  author,
  book,
  book_approval,
  bundle,
  category,
  customer,
  internal,
  product,
  promo_code,
  publisher,
  publisher_author,
  transaction,
  withdrawal,
} from "shared/models";
import type { Decimal } from "shared/models/runtime/library";

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
};

export type Book = book & {
  author: author | null;
  book_approval: book_approval[];
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
  APPROVED = "approved",
  REJECTED = "rejected",
}

export enum Currency {
  IDR = "IDR",
  USD = "USD",
  EUR = "EUR",
  JPY = "JPY",
  GBP = "GBP",
}
