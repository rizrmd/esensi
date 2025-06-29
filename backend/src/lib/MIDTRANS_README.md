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

### 2. Handle Notifikasi Webhook

```typescript
// API endpoint untuk menerima notifikasi dari Midtrans
import { defineAPI } from "rlib/server";
import type { NotificationPayload } from '@/lib/midtrans';

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
  console.log('Payment successful:', status.order_id);
}

async function handlePendingPayment(status: TransactionStatusResponse) {
  // Update status ke pending, kirim instruksi pembayaran
  console.log('Payment pending:', status.order_id);
}

async function handleChallengePayment(status: TransactionStatusResponse) {
  // Lakukan review manual atau approve otomatis
  console.log('Payment challenge:', status.order_id);
  
  // Contoh auto-approve (sesuaikan dengan business logic)
  // await midtrans.approveTransaction(status.order_id);
}

async function handleFailedPayment(status: TransactionStatusResponse) {
  // Update status ke failed
  console.log('Payment failed:', status.order_id);
}

async function handleCancelledPayment(status: TransactionStatusResponse) {
  // Update status ke cancelled
  console.log('Payment cancelled:', status.order_id);
}
```

### 3. Frontend Integration

```typescript
// Frontend component untuk menampilkan Snap
import { api } from "@/lib/gen/your-api";

export default function PaymentComponent() {
  const handlePayment = async () => {
    try {
      // Request token dari backend
      const response = await api.create_payment_token({
        amount: 100000,
        customer_name: 'John Doe',
        customer_email: 'john@example.com',
      });

      // Load Snap.js
      const script = document.createElement('script');
      script.src = 'https://app.sandbox.midtrans.com/snap/snap.js';
      script.setAttribute('data-client-key', 'your-client-key');
      document.head.appendChild(script);

      script.onload = () => {
        // Tampilkan Snap popup
        (window as any).snap.pay(response.token, {
          onSuccess: (result: any) => {
            console.log('Payment success:', result);
            // Redirect ke halaman sukses
            window.location.href = '/payment/success';
          },
          onPending: (result: any) => {
            console.log('Payment pending:', result);
            // Tampilkan instruksi pembayaran
            window.location.href = '/payment/pending';
          },
          onError: (result: any) => {
            console.log('Payment error:', result);
            // Tampilkan pesan error
            alert('Pembayaran gagal, silakan coba lagi');
          },
          onClose: () => {
            console.log('Payment popup closed');
            // Customer menutup popup tanpa bayar
            alert('Pembayaran dibatalkan');
          }
        });
      };
    } catch (error) {
      console.error('Error creating payment:', error);
      alert('Gagal membuat pembayaran');
    }
  };

  return (
    <button 
      onClick={handlePayment}
      className="bg-blue-500 text-white px-4 py-2 rounded"
    >
      Bayar Sekarang
    </button>
  );
}
```

### 4. Management Transaksi

```typescript
// Melihat status transaksi
const status = await midtrans.getTransactionStatus('ORDER-123456');

// Approve transaksi yang challenge
await midtrans.approveTransaction('ORDER-123456');

// Deny transaksi yang challenge  
await midtrans.denyTransaction('ORDER-123456');

// Cancel transaksi (hanya untuk status tertentu)
await midtrans.cancelTransaction('ORDER-123456');

// Expire transaksi
await midtrans.expireTransaction('ORDER-123456');

// Refund transaksi (hanya kartu kredit)
await midtrans.refundTransaction('ORDER-123456', 50000, 'Customer request');
```

### 5. Validasi Request

```typescript
import { MidtransService } from '@/lib/midtrans';

const errors = MidtransService.validateTransactionRequest(paymentRequest);
if (errors.length > 0) {
  throw new Error(`Validation errors: ${errors.join(', ')}`);
}
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
