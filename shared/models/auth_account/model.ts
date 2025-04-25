import type { ModelDefinition } from "rlib/server";

export default {
  table: "auth_account",
  columns: {
    id: {
      type: "text",
    },
    password: {
      type: "text",
    },
    role: {
      type: "text",
    },
    id_provider: {
      type: "text",
    },
    access_token: {
      type: "text",
    },
    refresh_token: {
      type: "text",
    },
    id_token: {
      type: "text",
    },
    access_token_expires_at: {
      type: "datetime",
    },
    refresh_token_expires_at: {
      type: "datetime",
    },
    scope: {
      type: "text",
    },
    created_at: {
      type: "datetime",
    },
    updated_at: {
      type: "datetime",
    },
    id_user: {
      type: "text",
    },
    id_account: {
      type: "text",
    }
  },
  relations: {
    auth_user: {
      type: "belongs_to",
      from: "id_user",
      to: {
        model: "auth_user",
        column: "id",
      },
    },
    affiliates: {
      type: "has_many",
      from: "id",
      to: {
        model: "affiliate",
        column: "id_user",
      },
    },
    authors: {
      type: "has_many",
      from: "id",
      to: {
        model: "author",
        column: "id_account",
      },
    },
    customers: {
      type: "has_many",
      from: "id",
      to: {
        model: "customer",
        column: "id_user",
      },
    },
    managements: {
      type: "has_many",
      from: "id",
      to: {
        model: "management",
        column: "id_user",
      },
    },
    publishers: {
      type: "has_many",
      from: "id",
      to: {
        model: "publisher",
        column: "id_user",
      },
    },
    sales_and_marketings: {
      type: "has_many",
      from: "id",
      to: {
        model: "sales_and_marketing",
        column: "id_user",
      },
    },
    supports: {
      type: "has_many",
      from: "id",
      to: {
        model: "support",
        column: "id_user",
      },
    }
  },
} as const satisfies ModelDefinition<"auth_account">;