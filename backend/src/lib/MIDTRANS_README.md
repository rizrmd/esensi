# Midtrans SNAP Integration Library

Utility library untuk integrasi pembayaran Midtrans menggunakan SNAP interface. Library ini menyediakan fungsi-fungsi lengkap untuk mengelola transaksi pembayaran dengan Midtrans.

## Installation

Library ini sudah menggunakan `midtrans-client` yang sudah diinstall di project.

## Setup

### 1. Konfigurasi Environment

Tambahkan environment variables berikut:

```bash
# Sandbox (Development)
MIDTRANS_SERVER_KEY=SB-Mid-server-xxxxx
MIDTRANS_CLIENT_KEY=SB-Mid-client-xxxxx

# Production
MIDTRANS_SERVER_KEY=Mid-server-xxxxx
MIDTRANS_CLIENT_KEY=Mid-client-xxxxx
```

### 2. Inisialisasi Service

```typescript
import { createMidtransService, MIDTRANS_SANDBOX_CONFIG } from '@/lib/midtrans';

const midtrans = createMidtransService({
  ...MIDTRANS_SANDBOX_CONFIG, // atau MIDTRANS_PRODUCTION_CONFIG untuk production
  serverKey: process.env.MIDTRANS_SERVER_KEY!,
  clientKey: process.env.MIDTRANS_CLIENT_KEY!,
});
```

## Penggunaan

### 1. Membuat Token Transaksi

```typescript
import { MidtransService, createQuickPaymentRequest } from '@/lib/midtrans';

// Cara sederhana
const paymentRequest = createQuickPaymentRequest(
  MidtransService.generateOrderId('PRODUCT'),
  100000, // Rp 100.000
  {
    first_name: 'John',
    last_name: 'Doe',
    email: 'john@example.com',
    phone: MidtransService.formatPhoneNumber('081234567890'),
  }
);

const { token, redirect_url } = await midtrans.createTransaction(paymentRequest);

// Cara lengkap dengan item details
const fullPaymentRequest = {
  transaction_details: {
    order_id: MidtransService.generateOrderId('ORDER'),
    gross_amount: 150000,
  },
  item_details: [
    {
      id: 'item1',
      price: 100000,
      quantity: 1,
      name: 'Produk A',
      category: 'Elektronik',
    },
    {
      id: 'item2', 
      price: 50000,
      quantity: 1,
      name: 'Produk B',
      category: 'Fashion',
    }
  ],
  customer_details: {
    first_name: 'Jane',
    last_name: 'Smith',
    email: 'jane@example.com',
    phone: '+6281234567890',
    billing_address: {
      first_name: 'Jane',
      last_name: 'Smith',
      address: 'Jl. Sudirman No. 123',
      city: 'Jakarta',
      postal_code: '12345',
      country_code: 'IDN',
    }
  },
  enabled_payments: ['credit_card', 'bca_va', 'bni_va', 'gopay'],
  credit_card: {
    secure: true,
    bank: 'bca',
    installment: {
      required: false,
      terms: {
        bni: [3, 6, 12],
        mandiri: [3, 6, 12],
        cimb: [3],
        bca: [3, 6, 12],
        maybank: [3, 6, 12],
      }
    }
  },
  callbacks: {
    finish: 'https://yoursite.com/finish',
    unfinish: 'https://yoursite.com/unfinish',
    error: 'https://yoursite.com/error',
  },
  expiry: {
    start_time: new Date().toISOString(),
    unit: 'minute',
    duration: 60,
  }
};

const response = await midtrans.createTransaction(fullPaymentRequest);
```

### 2. Membuat API Backend untuk Token

```typescript
// Backend API untuk membuat payment token
import { defineAPI } from "rlib/server";
import { createMidtransService, createQuickPaymentRequest, MidtransService, MIDTRANS_SANDBOX_CONFIG } from '@/lib/midtrans';
import type { CustomerDetails, ItemDetails } from '@/lib/midtrans';

// Initialize Midtrans service
const midtrans = createMidtransService({
  ...MIDTRANS_SANDBOX_CONFIG, // ganti dengan MIDTRANS_PRODUCTION_CONFIG untuk production
  serverKey: process.env.MIDTRANS_SERVER_KEY!,
  clientKey: process.env.MIDTRANS_CLIENT_KEY!,
});

export default defineAPI({
  name: "create_payment_token",
  url: "/api/payment/create-token",
  async handler(arg: {
    amount: number;
    customer_name: string;
    customer_email: string;
    customer_phone?: string;
    items?: ItemDetails[];
    order_prefix?: string;
  }) {
    try {
      // Validasi input
      if (!arg.amount || arg.amount <= 0) {
        throw new Error('Amount harus lebih besar dari 0');
      }
      
      if (!arg.customer_email || !arg.customer_name) {
        throw new Error('Customer name dan email wajib diisi');
      }

      // Generate order ID
      const orderId = MidtransService.generateOrderId(arg.order_prefix || 'ORDER');
      
      // Prepare customer details
      const customerDetails: CustomerDetails = {
        first_name: arg.customer_name.split(' ')[0],
        last_name: arg.customer_name.split(' ').slice(1).join(' '),
        email: arg.customer_email,
        phone: arg.customer_phone ? MidtransService.formatPhoneNumber(arg.customer_phone) : undefined,
      };

      // Create payment request
      const paymentRequest = createQuickPaymentRequest(
        orderId,
        arg.amount,
        customerDetails,
        arg.items
      );

      // Validasi request
      const validationErrors = MidtransService.validateTransactionRequest(paymentRequest);
      if (validationErrors.length > 0) {
        throw new Error(`Validation error: ${validationErrors.join(', ')}`);
      }

      // Create transaction
      const response = await midtrans.createTransaction(paymentRequest);
      
      // Simpan ke database (opsional)
      await db.payment_transaction.create({
        data: {
          order_id: orderId,
          amount: arg.amount,
          customer_email: arg.customer_email,
          customer_name: arg.customer_name,
          status: 'pending',
          snap_token: response.token,
          created_at: new Date(),
        }
      });

      return {
        token: response.token,
        redirect_url: response.redirect_url,
        order_id: orderId,
        client_key: process.env.MIDTRANS_CLIENT_KEY,
        snap_url: midtrans.getSnapConfig().snapJs,
      };
    } catch (error) {
      console.error('Error creating payment token:', error);
      throw new Error(`Gagal membuat token pembayaran: ${error.message}`);
    }
  },
});
```

### 3. Handle Notifikasi Webhook

```typescript
// API endpoint untuk menerima notifikasi dari Midtrans
import { defineAPI } from "rlib/server";
import { createMidtransService, MIDTRANS_SANDBOX_CONFIG } from '@/lib/midtrans';
import type { NotificationPayload, TransactionStatusResponse } from '@/lib/midtrans';

// Initialize Midtrans service untuk webhook
const midtrans = createMidtransService({
  ...MIDTRANS_SANDBOX_CONFIG,
  serverKey: process.env.MIDTRANS_SERVER_KEY!,
  clientKey: process.env.MIDTRANS_CLIENT_KEY!,
});

export default defineAPI({
  name: "midtrans_webhook",
  url: "/api/payment/webhook",
  async handler(notification: NotificationPayload) {
    // Verifikasi signature
    const isValid = midtrans.verifyNotificationSignature(notification);
    
    if (!isValid) {
      throw new Error('Invalid signature');
    }

    // Dapatkan status transaksi terbaru
    const status = await midtrans.getTransactionStatus(notification.order_id);
    
    // Proses berdasarkan status
    switch (status.transaction_status) {
      case 'capture':
        if (status.fraud_status === 'accept') {
          // Pembayaran berhasil untuk kartu kredit
          await handleSuccessfulPayment(status);
        } else if (status.fraud_status === 'challenge') {
          // Perlu review manual
          await handleChallengePayment(status);
        }
        break;
        
      case 'settlement':
        // Pembayaran berhasil untuk semua metode pembayaran
        await handleSuccessfulPayment(status);
        break;
        
      case 'pending':
        // Menunggu pembayaran (VA, bank transfer, etc)
        await handlePendingPayment(status);
        break;
        
      case 'deny':
        // Pembayaran ditolak
        await handleFailedPayment(status);
        break;
        
      case 'cancel':
      case 'expire':
        // Pembayaran dibatalkan atau expired
        await handleCancelledPayment(status);
        break;
        
      case 'failure':
        // Pembayaran gagal
        await handleFailedPayment(status);
        break;
    }

    return { success: true };
  },
});

async function handleSuccessfulPayment(status: TransactionStatusResponse) {
  // Update database, kirim email konfirmasi, dll
  await db.payment_transaction.update({
    where: { order_id: status.order_id },
    data: { 
      status: 'success',
      payment_type: status.payment_type,
      transaction_id: status.transaction_id,
      updated_at: new Date(),
    }
  });
  
  console.log('Payment successful:', status.order_id);
}

async function handlePendingPayment(status: TransactionStatusResponse) {
  // Update status ke pending, kirim instruksi pembayaran
  await db.payment_transaction.update({
    where: { order_id: status.order_id },
    data: { 
      status: 'pending',
      payment_type: status.payment_type,
      transaction_id: status.transaction_id,
      updated_at: new Date(),
    }
  });
  
  console.log('Payment pending:', status.order_id);
}

async function handleChallengePayment(status: TransactionStatusResponse) {
  // Lakukan review manual atau approve otomatis
  await db.payment_transaction.update({
    where: { order_id: status.order_id },
    data: { 
      status: 'challenge',
      payment_type: status.payment_type,
      transaction_id: status.transaction_id,
      updated_at: new Date(),
    }
  });
  
  console.log('Payment challenge:', status.order_id);
  
  // Contoh auto-approve (sesuaikan dengan business logic)
  // await midtrans.approveTransaction(status.order_id);
}

async function handleFailedPayment(status: TransactionStatusResponse) {
  // Update status ke failed
  await db.payment_transaction.update({
    where: { order_id: status.order_id },
    data: { 
      status: 'failed',
      payment_type: status.payment_type,
      transaction_id: status.transaction_id,
      updated_at: new Date(),
    }
  });
  
  console.log('Payment failed:', status.order_id);
}

async function handleCancelledPayment(status: TransactionStatusResponse) {
  // Update status ke cancelled
  await db.payment_transaction.update({
    where: { order_id: status.order_id },
    data: { 
      status: 'cancelled',
      payment_type: status.payment_type,
      transaction_id: status.transaction_id,
      updated_at: new Date(),
    }
  });
  
  console.log('Payment cancelled:', status.order_id);
}
```

### 4. Frontend Integration

```typescript
// Frontend component untuk menampilkan Snap
import { useLocal } from "@/lib/hooks/use-local";
import { api } from "@/lib/gen/your-api";

export default function PaymentComponent() {
  const local = useLocal({
    isLoading: false,
    paymentInProgress: false,
  });

  const handlePayment = async () => {
    if (local.paymentInProgress) return;
    
    local.paymentInProgress = true;
    local.render();

    try {
      // Request token dari backend
      const response = await api.create_payment_token({
        amount: 100000,
        customer_name: 'John Doe',
        customer_email: 'john@example.com',
      });

      // Load Snap.js jika belum ada
      if (!(window as any).snap) {
        await new Promise((resolve, reject) => {
          const script = document.createElement('script');
          script.src = response.snap_url;
          script.setAttribute('data-client-key', response.client_key);
          script.onload = resolve;
          script.onerror = reject;
          document.head.appendChild(script);
        });
      }

      // Tampilkan Snap popup
      (window as any).snap.pay(response.token, {
        onSuccess: (result: any) => {
          console.log('Payment success:', result);
          alert('Pembayaran berhasil!');
          // Redirect ke halaman sukses
          window.location.href = '/payment/success';
        },
        onPending: (result: any) => {
          console.log('Payment pending:', result);
          alert('Pembayaran menunggu konfirmasi');
          // Tampilkan instruksi pembayaran
          window.location.href = '/payment/pending';
        },
        onError: (result: any) => {
          console.log('Payment error:', result);
          alert('Pembayaran gagal, silakan coba lagi');
        },
        onClose: () => {
          console.log('Payment popup closed');
          alert('Pembayaran dibatalkan');
        }
      });
    } catch (error) {
      console.error('Error creating payment:', error);
      alert('Gagal membuat pembayaran');
    } finally {
      local.paymentInProgress = false;
      local.render();
    }
  };

  return (
    <button 
      onClick={handlePayment}
      disabled={local.paymentInProgress}
      className={`px-6 py-3 rounded-lg font-medium ${
        local.paymentInProgress 
          ? 'bg-gray-400 cursor-not-allowed' 
          : 'bg-blue-500 hover:bg-blue-600'
      } text-white transition-colors`}
    >
      {local.paymentInProgress ? 'Memproses...' : 'Bayar Sekarang'}
    </button>
  );
}
```

### 5. Validasi Request

```typescript
import { MidtransService } from '@/lib/midtrans';

const errors = MidtransService.validateTransactionRequest(paymentRequest);
if (errors.length > 0) {
  throw new Error(`Validation errors: ${errors.join(', ')}`);
}
```

### 6. Database Schema untuk Payment Tracking

```typescript
// Prisma schema untuk tracking pembayaran
model payment_transaction {
  id             String   @id @default(cuid())
  order_id       String   @unique
  amount         Float
  customer_name  String
  customer_email String
  customer_phone String?
  status         String   @default("pending") // pending, success, failed, cancelled, challenge
  payment_type   String?  // credit_card, bca_va, gopay, etc
  transaction_id String?
  snap_token     String?
  created_at     DateTime @default(now())
  updated_at     DateTime @default(now()) @updatedAt
  
  @@map("payment_transactions")
}
```

### 7. Membuat API untuk Cek Status Payment

```typescript
// API untuk mengecek status pembayaran
import { defineAPI } from "rlib/server";
import { createMidtransService, MIDTRANS_SANDBOX_CONFIG } from '@/lib/midtrans';

const midtrans = createMidtransService({
  ...MIDTRANS_SANDBOX_CONFIG,
  serverKey: process.env.MIDTRANS_SERVER_KEY!,
  clientKey: process.env.MIDTRANS_CLIENT_KEY!,
});

export default defineAPI({
  name: "check_payment_status",
  url: "/api/payment/status",
  async handler(arg: { order_id: string }) {
    try {
      // Cek dari database dulu
      const dbPayment = await db.payment_transaction.findUnique({
        where: { order_id: arg.order_id }
      });

      if (!dbPayment) {
        throw new Error('Transaction not found');
      }

      // Jika status masih pending, cek ke Midtrans
      if (dbPayment.status === 'pending') {
        const midtransStatus = await midtrans.getTransactionStatus(arg.order_id);
        
        // Update database dengan status terbaru
        if (midtransStatus.transaction_status !== 'pending') {
          await db.payment_transaction.update({
            where: { order_id: arg.order_id },
            data: {
              status: midtransStatus.transaction_status,
              payment_type: midtransStatus.payment_type,
              transaction_id: midtransStatus.transaction_id,
              updated_at: new Date(),
            }
          });
        }

        return {
          order_id: arg.order_id,
          status: midtransStatus.transaction_status,
          payment_type: midtransStatus.payment_type,
          transaction_id: midtransStatus.transaction_id,
          amount: dbPayment.amount,
        };
      }

      return {
        order_id: dbPayment.order_id,
        status: dbPayment.status,
        payment_type: dbPayment.payment_type,
        transaction_id: dbPayment.transaction_id,
        amount: dbPayment.amount,
      };
    } catch (error) {
      console.error('Error checking payment status:', error);
      throw new Error(`Gagal mengecek status pembayaran: ${error.message}`);
    }
  },
});
```

## Payment Methods

Metode pembayaran yang tersedia di Indonesia:

- `credit_card` - Kartu Kredit/Debit
- `bca_va` - BCA Virtual Account
- `bni_va` - BNI Virtual Account  
- `bri_va` - BRI Virtual Account
- `permata_va` - Permata Virtual Account
- `echannel` - Mandiri Bill Payment
- `other_va` - VA Bank Lain (CIMB, Danamon, etc)
- `gopay` - GoPay
- `shopeepay` - ShopeePay
- `qris` - QRIS
- `cstore` - Convenience Store (Indomaret/Alfamart)
- `danamon_online` - Danamon Online Banking
- `akulaku` - Akulaku PayLater
- `kredivo` - Kredivo PayLater

## Testing

Untuk testing di sandbox, gunakan test credentials:

### Kartu Kredit
- Card Number: `4811 1111 1111 1114`
- CVV: `123`
- Exp Month: `02` (atau bulan lain dalam format MM)
- Exp Year: `2025` (atau tahun depan)
- OTP/3DS: `112233`

### Virtual Account
- Gunakan VA number yang digenerate oleh Midtrans
- Simulasi pembayaran di Midtrans Simulator

### E-Wallet
- Gunakan nomor test yang disediakan Midtrans

## Error Handling

```typescript
try {
  const result = await midtrans.createTransaction(request);
  return result;
} catch (error) {
  console.error('Midtrans error:', error);
  
  if (error.message.includes('400')) {
    // Bad request - check your parameters
    throw new Error('Parameter tidak valid');
  } else if (error.message.includes('401')) {
    // Unauthorized - check your server key
    throw new Error('Server key tidak valid');
  } else if (error.message.includes('500')) {
    // Server error - retry later
    throw new Error('Server Midtrans sedang bermasalah, coba lagi nanti');
  } else {
    throw new Error('Terjadi kesalahan saat memproses pembayaran');
  }
}
```

## Best Practices

1. **Security**: Jangan pernah expose Server Key di frontend
2. **Validation**: Selalu validasi signature pada webhook notification
3. **Idempotency**: Gunakan order_id yang unik untuk setiap transaksi
4. **Error Handling**: Handle semua kemungkinan status dan error
5. **Logging**: Log semua transaksi untuk audit trail
6. **Retry Logic**: Implement retry untuk network failures
7. **Database**: Simpan transaction log di database untuk tracking

## Environment Variables

```bash
# Required
MIDTRANS_SERVER_KEY=your-server-key
MIDTRANS_CLIENT_KEY=your-client-key

# Optional
MIDTRANS_ENVIRONMENT=sandbox # atau production
MIDTRANS_NOTIFICATION_URL=https://yoursite.com/api/payment/webhook
```

Dokumentasi lengkap Midtrans: https://docs.midtrans.com/docs/snap-snap-integration-guide

## Troubleshooting

### Common Issues

#### 1. Signature Verification Failed
```typescript
// Pastikan server key benar dan webhook payload tidak dimodifikasi
const isValid = midtrans.verifyNotificationSignature(notification);
if (!isValid) {
  console.error('Notification details:', {
    order_id: notification.order_id,
    status_code: notification.status_code,
    gross_amount: notification.gross_amount,
    signature_key: notification.signature_key
  });
}
```

#### 2. Payment Status Not Updated
```typescript
// Implementasi retry mechanism untuk webhook
export default defineAPI({
  name: "midtrans_webhook_retry",
  url: "/api/payment/webhook-retry",
  async handler(arg: { order_id: string }) {
    const maxRetries = 3;
    let retryCount = 0;
    
    while (retryCount < maxRetries) {
      try {
        const status = await midtrans.getTransactionStatus(arg.order_id);
        await updatePaymentStatus(status);
        return { success: true };
      } catch (error) {
        retryCount++;
        if (retryCount >= maxRetries) throw error;
        await new Promise(resolve => setTimeout(resolve, 1000 * retryCount));
      }
    }
  },
});
```

#### 3. Frontend Snap Not Loading
```typescript
// Debugging Snap.js loading
const loadSnapScript = () => {
  return new Promise((resolve, reject) => {
    // Remove existing script jika ada
    const existingScript = document.querySelector('script[src*="snap.js"]');
    if (existingScript) existingScript.remove();
    
    const script = document.createElement('script');
    script.src = 'https://app.sandbox.midtrans.com/snap/snap.js';
    script.setAttribute('data-client-key', clientKey);
    
    script.onload = () => {
      console.log('Snap.js loaded successfully');
      resolve(true);
    };
    
    script.onerror = (error) => {
      console.error('Failed to load Snap.js:', error);
      reject(error);
    };
    
    document.head.appendChild(script);
  });
};
```

## Production Checklist

### Sebelum Go Live

- [ ] Ganti ke production credentials
- [ ] Update environment variables:
  ```bash
  MIDTRANS_SERVER_KEY=Mid-server-xxxxx
  MIDTRANS_CLIENT_KEY=Mid-client-xxxxx
  ```
- [ ] Ganti configuration ke production:
  ```typescript
  const midtrans = createMidtransService({
    ...MIDTRANS_PRODUCTION_CONFIG,
    serverKey: process.env.MIDTRANS_SERVER_KEY!,
    clientKey: process.env.MIDTRANS_CLIENT_KEY!,
  });
  ```
- [ ] Update Snap.js URL ke production:
  ```typescript
  script.src = 'https://app.midtrans.com/snap/snap.js';
  ```
- [ ] Set webhook notification URL di Midtrans Dashboard
- [ ] Test semua payment methods di production
- [ ] Setup monitoring dan alerting
- [ ] Backup payment transaction logs
- [ ] Implement proper error handling dan user feedback

### Security Checklist

- [ ] Server key tidak pernah di-expose ke frontend
- [ ] Webhook signature selalu diverifikasi
- [ ] Database payment records ter-encrypt
- [ ] API endpoints menggunakan authentication
- [ ] Rate limiting pada payment endpoints
- [ ] Input validation pada semua payment data
- [ ] Secure logging (jangan log sensitive data)

## Advanced Features

### Custom Payment Flow dengan Valtio

```typescript
// State management untuk payment flow
import { proxy } from "valtio";

export const paymentState = proxy({
  write: {
    currentStep: 'cart', // cart, payment, processing, success, error
    orderData: null as any,
    snapToken: null as string | null,
    paymentResult: null as any,
    loading: false,
    error: null as string | null,
  },
  
  async createPayment(orderData: any) {
    this.write.loading = true;
    this.write.error = null;
    
    try {
      const response = await api.create_payment_token(orderData);
      this.write.snapToken = response.token;
      this.write.orderData = orderData;
      this.write.currentStep = 'payment';
    } catch (error) {
      this.write.error = error.message;
      this.write.currentStep = 'error';
    } finally {
      this.write.loading = false;
    }
  },
  
  async checkPaymentStatus(orderId: string) {
    try {
      const status = await api.check_payment_status({ order_id: orderId });
      if (status.status === 'settlement' || status.status === 'capture') {
        this.write.currentStep = 'success';
        this.write.paymentResult = status;
      }
    } catch (error) {
      console.error('Error checking payment status:', error);
    }
  },
  
  reset() {
    this.write.currentStep = 'cart';
    this.write.orderData = null;
    this.write.snapToken = null;
    this.write.paymentResult = null;
    this.write.loading = false;
    this.write.error = null;
  }
});
```

### Recurring Payment dengan Midtrans

```typescript
// Untuk subscription/recurring payment
export default defineAPI({
  name: "create_subscription",
  url: "/api/payment/subscription",
  async handler(arg: {
    customer_id: string;
    plan_id: string;
    amount: number;
    interval: 'monthly' | 'yearly';
  }) {
    // Implementasi subscription logic
    // Midtrans belum support native subscription, 
    // tapi bisa dihandle dengan saved card + scheduled charging
    
    const orderId = MidtransService.generateOrderId('SUBS');
    
    const paymentRequest = {
      transaction_details: {
        order_id: orderId,
        gross_amount: arg.amount,
      },
      credit_card: {
        secure: true,
        save_card: true, // Save card untuk charging berikutnya
      },
      custom_field1: arg.customer_id,
      custom_field2: arg.plan_id,
      custom_field3: arg.interval,
    };
    
    const response = await midtrans.createTransaction(paymentRequest);
    
    // Simpan subscription data
    await db.subscription.create({
      data: {
        customer_id: arg.customer_id,
        plan_id: arg.plan_id,
        amount: arg.amount,
        interval: arg.interval,
        status: 'pending',
        order_id: orderId,
        next_billing_date: new Date(Date.now() + (arg.interval === 'monthly' ? 30 : 365) * 24 * 60 * 60 * 1000),
      }
    });
    
    return response;
  },
});
```
