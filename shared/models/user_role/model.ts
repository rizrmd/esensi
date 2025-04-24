import type { ModelDefinition } from "rlib/server";

export default {
  table: "user_role",
  columns: {
    id: {
      type: "text",
    },
    name: {
      type: "text",
    },
    email: {
      type: "text",
    },
    email_verified: {
      type: "boolean",
    },
    image: {
      type: "text",
    },
    created_at: {
      type: "datetime",
    },
    updated_at: {
      type: "datetime",
    },
    username: {
      type: "text",
    },
    display_username: {
      type: "text",
    },
    two_factor_enabled: {
      type: "boolean",
    },
    id_customer: {
      type: "text",
    },
    id_author: {
      type: "text",
    },
    id_affiliate: {
      type: "text",
    },
    id_management: {
      type: "text",
    },
    id_publisher: {
      type: "text",
    },
    id_sales_and_marketing: {
      type: "text",
    },
    id_support: {
      type: "text",
    }
  },
  relations: {
    affiliate: {
      type: "belongs_to",
      from: "id_affiliate",
      to: {
        model: "affiliate",
        column: "id",
      },
    },
    author: {
      type: "belongs_to",
      from: "id_author",
      to: {
        model: "author",
        column: "id",
      },
    },
    customer: {
      type: "belongs_to",
      from: "id_customer",
      to: {
        model: "customer",
        column: "id",
      },
    },
    management: {
      type: "belongs_to",
      from: "id_management",
      to: {
        model: "management",
        column: "id",
      },
    },
    publisher: {
      type: "belongs_to",
      from: "id_publisher",
      to: {
        model: "publisher",
        column: "id",
      },
    },
    sales_and_marketing: {
      type: "belongs_to",
      from: "id_sales_and_marketing",
      to: {
        model: "sales_and_marketing",
        column: "id",
      },
    },
    support: {
      type: "belongs_to",
      from: "id_support",
      to: {
        model: "support",
        column: "id",
      },
    },
    sessions: {
      type: "has_many",
      from: "id",
      to: {
        model: "session",
        column: "id_user_role",
      },
    },
    two_factors: {
      type: "has_many",
      from: "id",
      to: {
        model: "two_factor",
        column: "id_user_info",
      },
    },
    users: {
      type: "has_many",
      from: "id",
      to: {
        model: "user",
        column: "id_user_role",
      },
    }
  },
} as const satisfies ModelDefinition<"user_role">;