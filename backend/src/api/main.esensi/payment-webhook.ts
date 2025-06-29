import { defineAPI } from "rlib/server";
import { 
  createMidtransService, 
  MIDTRANS_SANDBOX_CONFIG,
  PAYMENT_STATUS,
  FRAUD_STATUS,
  type NotificationPayload,
  type TransactionStatusResponse 
} from "../../lib/midtrans";

export default defineAPI({
  name: "payment_webhook",
  url: "/api/payment/webhook",
  async handler(notification: NotificationPayload) {
    try {
      console.log("Received Midtrans notification:", notification);

      // Initialize Midtrans service
      const midtrans = createMidtransService({
        ...MIDTRANS_SANDBOX_CONFIG, // Change to MIDTRANS_PRODUCTION_CONFIG for production
        serverKey: process.env.MIDTRANS_SERVER_KEY!,
        clientKey: process.env.MIDTRANS_CLIENT_KEY!,
      });

      // Verify notification signature
      const isValidSignature = midtrans.verifyNotificationSignature(notification);
      
      if (!isValidSignature) {
        console.error("Invalid signature from Midtrans notification");
        return { success: false, message: "Invalid signature" };
      }

      // Get latest transaction status from Midtrans
      const transactionStatus = await midtrans.getTransactionStatus(notification.order_id);
      
      // Find the sales record
      const salesRecord = await db.t_sales.findFirst({
        where: {
          midtrans_order_id: notification.order_id,
        },
        include: {
          t_sales_line: {
            include: {
              product: true,
              bundle: {
                include: {
                  bundle_product: {
                    include: {
                      product: true,
                    },
                  },
                },
              },
            },
          },
          customer: true,
        },
      });

      if (!salesRecord) {
        console.error("Sales record not found for order_id:", notification.order_id);
        return { success: false, message: "Order not found" };
      }

      // Process payment based on status
      await handlePaymentStatus(transactionStatus, salesRecord, midtrans);

      return { success: true, message: "Notification processed successfully" };

    } catch (error) {
      console.error("Error processing Midtrans notification:", error);
      return { success: false, message: "Internal server error" };
    }
  },
});

async function handlePaymentStatus(
  status: TransactionStatusResponse, 
  salesRecord: any,
  midtrans: any
) {
  const orderId = status.order_id;
  const transactionStatus = status.transaction_status;
  const fraudStatus = status.fraud_status;

  console.log(`Processing payment for order ${orderId}: ${transactionStatus} (fraud: ${fraudStatus})`);

  switch (transactionStatus) {
    case PAYMENT_STATUS.CAPTURE:
      if (fraudStatus === FRAUD_STATUS.ACCEPT) {
        await handleSuccessfulPayment(salesRecord, status);
      } else if (fraudStatus === FRAUD_STATUS.CHALLENGE) {
        await handleChallengePayment(salesRecord, status);
      } else if (fraudStatus === FRAUD_STATUS.DENY) {
        await handleFailedPayment(salesRecord, status);
      }
      break;

    case PAYMENT_STATUS.SETTLEMENT:
      await handleSuccessfulPayment(salesRecord, status);
      break;

    case PAYMENT_STATUS.PENDING:
      await handlePendingPayment(salesRecord, status);
      break;

    case PAYMENT_STATUS.DENY:
    case PAYMENT_STATUS.FAILURE:
      await handleFailedPayment(salesRecord, status);
      break;

    case PAYMENT_STATUS.CANCEL:
    case PAYMENT_STATUS.EXPIRE:
      await handleExpiredPayment(salesRecord, status);
      break;

    default:
      console.warn(`Unknown transaction status: ${transactionStatus}`);
      break;
  }
}

async function handleSuccessfulPayment(salesRecord: any, status: TransactionStatusResponse) {
  console.log(`Processing successful payment for order: ${status.order_id}`);
  
  await db.$transaction(async (tx) => {
    // Update sales status to paid
    await tx.t_sales.update({
      where: { id: salesRecord.id },
      data: {
        status: "paid",
        midtrans_success: status as any,
        updated_at: new Date(),
      },
    });

    // Grant access to purchased products
    for (const salesLine of salesRecord.t_sales_line) {
      if (salesLine.product) {
        // Direct product purchase - grant access
        await grantProductAccess(tx, salesRecord.customer.id, salesLine.product);
      } else if (salesLine.bundle) {
        // Bundle purchase - grant access to all products in bundle
        for (const bundleProduct of salesLine.bundle.bundle_product) {
          await grantProductAccess(tx, salesRecord.customer.id, bundleProduct.product);
        }
      }
    }

    // Create revenue transaction for publisher(s)
    await createRevenueTransactions(tx, salesRecord, status);
  });

  // Send success notification (email, etc.)
  await sendPaymentSuccessNotification(salesRecord, status);
}

async function handlePendingPayment(salesRecord: any, status: TransactionStatusResponse) {
  console.log(`Processing pending payment for order: ${status.order_id}`);
  
  await db.t_sales.update({
    where: { id: salesRecord.id },
    data: {
      status: "pending",
      midtrans_pending: status as any,
      updated_at: new Date(),
    },
  });

  // Send pending payment instructions
  await sendPendingPaymentNotification(salesRecord, status);
}

async function handleFailedPayment(salesRecord: any, status: TransactionStatusResponse) {
  console.log(`Processing failed payment for order: ${status.order_id}`);
  
  await db.t_sales.update({
    where: { id: salesRecord.id },
    data: {
      status: "failed",
      midtrans_error: status as any,
      updated_at: new Date(),
    },
  });

  // Send failure notification
  await sendPaymentFailureNotification(salesRecord, status);
}

async function handleExpiredPayment(salesRecord: any, status: TransactionStatusResponse) {
  console.log(`Processing expired payment for order: ${status.order_id}`);
  
  await db.t_sales.update({
    where: { id: salesRecord.id },
    data: {
      status: "expired",
      midtrans_error: status as any,
      updated_at: new Date(),
    },
  });
}

async function handleChallengePayment(salesRecord: any, status: TransactionStatusResponse) {
  console.log(`Processing challenge payment for order: ${status.order_id}`);
  
  await db.t_sales.update({
    where: { id: salesRecord.id },
    data: {
      status: "challenge",
      midtrans_pending: status as any,
      updated_at: new Date(),
    },
  });

  // You can implement auto-approve logic here based on your business rules
  // For now, we'll leave it for manual review
}

async function grantProductAccess(tx: any, customerId: string, product: any) {
  // Check if customer already has access
  const existingAccess = await tx.customer_reader.findFirst({
    where: {
      id_customer: customerId,
      id_product: product.id,
    },
  });

  if (!existingAccess) {
    // Grant access to the product
    await tx.customer_reader.create({
      data: {
        id_customer: customerId,
        id_product: product.id,
        status: "active",
        granted_at: new Date(),
      },
    });

    console.log(`Granted access to product ${product.name} for customer ${customerId}`);
  }
}

async function createRevenueTransactions(tx: any, salesRecord: any, status: TransactionStatusResponse) {
  // Get unique publishers from the sale
  const publisherRevenues = new Map<string, number>();

  for (const salesLine of salesRecord.t_sales_line) {
    let publisherId: string | null = null;
    let revenue = Number(salesLine.total_price);

    if (salesLine.product?.id_author) {
      // Get publisher from product author
      const author = await tx.author.findUnique({
        where: { id: salesLine.product.id_author },
        select: { id_publisher: true },
      });
      publisherId = author?.id_publisher;
    } else if (salesLine.bundle?.id_author) {
      // Get publisher from bundle author
      const author = await tx.author.findUnique({
        where: { id: salesLine.bundle.id_author },
        select: { id_publisher: true },
      });
      publisherId = author?.id_publisher;
    }

    if (publisherId) {
      const currentRevenue = publisherRevenues.get(publisherId) || 0;
      publisherRevenues.set(publisherId, currentRevenue + revenue);
    }
  }

  // Create transaction records for each publisher
  for (const [publisherId, revenue] of publisherRevenues) {
    await tx.transaction.create({
      data: {
        id_publisher: publisherId,
        type: "sale",
        amount: revenue,
        info: {
          order_id: status.order_id,
          transaction_id: status.transaction_id,
          payment_type: status.payment_type,
          customer_id: salesRecord.customer.id,
        },
      },
    });

    console.log(`Created revenue transaction of ${revenue} for publisher ${publisherId}`);
  }
}

async function sendPaymentSuccessNotification(salesRecord: any, status: TransactionStatusResponse) {
  // TODO: Implement email notification
  console.log(`Payment success notification sent for order: ${status.order_id}`);
}

async function sendPendingPaymentNotification(salesRecord: any, status: TransactionStatusResponse) {
  // TODO: Implement pending payment instructions
  console.log(`Pending payment notification sent for order: ${status.order_id}`);
}

async function sendPaymentFailureNotification(salesRecord: any, status: TransactionStatusResponse) {
  // TODO: Implement failure notification
  console.log(`Payment failure notification sent for order: ${status.order_id}`);
}
