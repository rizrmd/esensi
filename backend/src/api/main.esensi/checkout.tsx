import { SeoTemplate } from "backend/components/SeoTemplate";
import { baseUrl } from "backend/gen/base-url";
import {
  createMidtransService,
  MidtransService
} from "backend/lib/midtrans";
import { defineAPI } from "rlib/server";

export default defineAPI({
  name: "checkout",
  url: "/checkout",
  async handler(arg: {
    cart_items: { id: string; type: "product" | "bundle" }[];
    customer_details: {
      first_name: string;
      last_name?: string;
      email: string;
      phone: string;
    };
  }) {
    const req = this.req!;
    const uid = this?.user?.id;

    if (!uid) {
      throw new Error("User tidak terautentikasi");
    }

    // Get customer ID from auth user
    const authUser = await db.auth_user.findFirst({
      where: { id: uid },
      select: { id_customer: true },
    });

    if (!authUser || !authUser.id_customer) {
      throw new Error("Customer tidak ditemukan");
    }

    if (!arg.cart_items || arg.cart_items.length === 0) {
      throw new Error("Keranjang kosong");
    }

    // Initialize Midtrans service
    const midtrans = createMidtransService({
      isProduction: process.env.NODE_ENV === "production",
      serverKey: process.env.MIDTRANS_SERVER_KEY || "",
      clientKey: process.env.MIDTRANS_CLIENT_KEY || "",
    });

    // Calculate cart total and get item details
    let total_amount = 0;
    const item_details = [];
    const cart_data = [];

    for (const cart_item of arg.cart_items) {
      if (cart_item.type === "product") {
        const product = await db.product.findFirst({
          where: { id: cart_item.id },
          select: {
            id: true,
            name: true,
            real_price: true,
            currency: true,
          },
        });

        if (product) {
          const price =
            typeof product.real_price === "object"
              ? product.real_price.toNumber()
              : product.real_price;

          total_amount += price;
          item_details.push({
            id: product.id,
            price: price,
            quantity: 1,
            name: product.name,
            category: "Digital Product",
          });
          cart_data.push({
            id: product.id,
            type: "product",
            name: product.name,
            price: price,
          });
        }
      } else if (cart_item.type === "bundle") {
        const bundle = await db.bundle.findFirst({
          where: { id: cart_item.id },
          select: {
            id: true,
            name: true,
            real_price: true,
            currency: true,
          },
        });

        if (bundle) {
          const price =
            typeof bundle.real_price === "object"
              ? bundle.real_price.toNumber()
              : bundle.real_price;

          total_amount += price;
          item_details.push({
            id: bundle.id,
            price: price,
            quantity: 1,
            name: bundle.name,
            category: "Bundle",
          });
          cart_data.push({
            id: bundle.id,
            type: "bundle",
            name: bundle.name,
            price: price,
          });
        }
      }
    }

    if (total_amount <= 0) {
      throw new Error("Total pembayaran tidak valid");
    }

    // Generate unique order ID
    const order_id = MidtransService.generateOrderId("ESENSI");

    // Create transaction record in database
    const transaction = await db.t_sales.create({
      data: {
        id: order_id,
        id_customer: authUser.id_customer,
        total: total_amount,
        currency: "IDR",
        status: "pending",
        midtrans_order_id: order_id,
        info: {
          cart: cart_data,
          customer: arg.customer_details,
        },
      },
    });

    // Prepare Midtrans transaction request
    const customer_details = {
      first_name: arg.customer_details.first_name,
      last_name: arg.customer_details.last_name || "",
      email: arg.customer_details.email,
      phone: MidtransService.formatPhoneNumber(arg.customer_details.phone),
    };

    const payment_request = {
      transaction_details: {
        order_id: order_id,
        gross_amount: total_amount,
      },
      item_details: item_details,
      customer_details: customer_details,
      enabled_payments: [
        "credit_card",
        "bca_va",
        "bni_va",
        "bri_va",
        "echannel",
        "permata_va",
        "other_va",
        "gopay",
        "shopeepay",
        "qris",
      ],
      credit_card: {
        secure: true,
      },
      callbacks: {
        finish: `${baseUrl.main_esensi}/payment/success?order_id=${order_id}`,
        unfinish: `${baseUrl.main_esensi}/payment/pending?order_id=${order_id}`,
        error: `${baseUrl.main_esensi}/payment/error?order_id=${order_id}`,
      },
      expiry: {
        unit: "hour" as const,
        duration: 24,
      },
    };

    try {
      // Create Midtrans transaction token
      const { token, redirect_url } = await midtrans.createTransaction(
        payment_request
      );

      const data = {
        title: `Lanjutkan pembayaran`,
        transaction_id: transaction.id,
        snap_token: token,
        redirect_url: redirect_url,
        total_amount: total_amount,
        currency: "IDR",
        order_id: order_id,
        items: cart_data,
      };

      const seo_data = {
        slug: `/checkout`,
        meta_title: `Checkout | Selesaikan Pembelian Ebook Digitalmu dengan Aman`,
        meta_description: `Lakukan pembayaran dengan mudah di halaman checkout ini. Selesaikan pembelian eBook Anda dalam beberapa langkah.`,
        image: ``,
        headings: `Checkout | Selesaikan Pembelian Ebook Digitalmu dengan Aman`,
        paragraph: `Lakukan pembayaran dengan mudah di halaman checkout ini. Selesaikan pembelian eBook Anda dalam beberapa langkah.`,
        is_product: false,
      };

      return {
        jsx: (
          <>
            <SeoTemplate data={seo_data} />
          </>
        ),
        data: data,
      };
    } catch (error: any) {
      // Update transaction status to error
      await db.t_sales.update({
        where: { id: transaction.id },
        data: {
          status: "failed",
          midtrans_error: {
            error: error?.message || "Unknown error",
            timestamp: new Date().toISOString(),
          },
        },
      });

      throw new Error(
        `Gagal membuat pembayaran: ${error?.message || "Unknown error"}`
      );
    }
  },
});
