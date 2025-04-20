import type { ModelDefinition } from "rlib/server";

export default {
  table: "customer",
  columns: {
    id: {
      type: "text",
    },
    whatsapp: {
      type: "text",
    },
    deleted_at: {
      type: "datetime",
    },
    otp: {
      type: "number",
    },
    id_user: {
      type: "text",
    },
    name: {
      type: "text",
    },
    email: {
      type: "text",
    }
  },
  relations: {
    user: {
      type: "belongs_to",
      from: "id_user",
      to: {
        model: "user",
        column: "id",
      },
    },
    customer_readers: {
      type: "has_many",
      from: "id",
      to: {
        model: "customer_reader",
        column: "id_customer",
      },
    },
    customer_tracks: {
      type: "has_many",
      from: "id",
      to: {
        model: "customer_track",
        column: "id_customer",
      },
    },
    saless: {
      type: "has_many",
      from: "id",
      to: {
        model: "t_sales",
        column: "id_customer",
      },
    },
    sales_downloads: {
      type: "has_many",
      from: "id",
      to: {
        model: "t_sales_download",
        column: "id_customer",
      },
    },
    user_roles: {
      type: "has_many",
      from: "id",
      to: {
        model: "user_role",
        column: "id_customer",
      },
    }
  },
} as const satisfies ModelDefinition<"customer">;