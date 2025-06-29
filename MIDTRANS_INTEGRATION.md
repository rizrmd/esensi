# Midtrans Payment Integration for Main.Esensi

This document explains how to set up and use the Midtrans payment gateway integration in the main.esensi module.

## 🚀 Features

- ✅ **Complete Payment Flow**: Cart → Checkout → Payment → Status Tracking
- ✅ **Midtrans SNAP Integration**: Modern payment popup interface
- ✅ **Multiple Payment Methods**: Credit Card, Bank Transfer (VA), E-Wallet, QRIS
- ✅ **Real-time Status Updates**: Webhook notifications and status checking
- ✅ **User-friendly Interface**: Indonesian language, responsive design
- ✅ **Secure Transactions**: Signature verification and error handling

## 📋 Prerequisites

1. **Midtrans Account**: Sign up at [Midtrans Dashboard](https://dashboard.midtrans.com/)
2. **Server & Client Keys**: Get your keys from Midtrans Dashboard
3. **Environment Variables**: Configure your keys properly

## ⚙️ Setup Instructions

### 1. Environment Variables

Add these environment variables to your backend:

```bash
# Development (Sandbox)
MIDTRANS_SERVER_KEY=SB-Mid-server-xxxxxxxxxx
MIDTRANS_CLIENT_KEY=SB-Mid-client-xxxxxxxxxx

# Production
MIDTRANS_SERVER_KEY=Mid-server-xxxxxxxxxx
MIDTRANS_CLIENT_KEY=Mid-client-xxxxxxxxxx
```

### 2. Frontend Configuration

Update the client key in `/frontend/src/lib/midtrans.ts`:

```typescript
export const MIDTRANS_CONFIG = {
  clientKey:
    process.env.NODE_ENV === "production"
      ? "Mid-client-YOUR_PRODUCTION_CLIENT_KEY" // Replace with actual key
      : "SB-Mid-client-YOUR_SANDBOX_CLIENT_KEY", // Replace with actual key
};
```

### 3. Webhook Configuration

In your Midtrans Dashboard, set the notification URL to:

```
https://yourdomain.com/api/midtrans/notification
```

## 🔄 Payment Flow

### 1. **Cart Page** (`/cart`)

- Users add items to cart
- View cart summary with discounts
- Click "Checkout" button

### 2. **Checkout Process**

- Customer details form appears
- User fills: Name, Email, Phone
- System creates transaction record
- Midtrans SNAP token generated

### 3. **Payment Page**

- Midtrans SNAP popup opens
- User selects payment method
- Complete payment process

### 4. **Status Pages**

- **Success** (`/payment/success`): Payment completed
- **Pending** (`/payment/pending`): Awaiting payment (bank transfer)
- **Error** (`/payment/error`): Payment failed

### 5. **Webhook Processing**

- Midtrans sends notifications
- System updates transaction status
- User access granted for purchased items

## 🛠️ API Endpoints

### Backend APIs

| Endpoint                     | Method | Description                  |
| ---------------------------- | ------ | ---------------------------- |
| `/checkout`                  | POST   | Create payment transaction   |
| `/api/midtrans/notification` | POST   | Handle payment notifications |
| `/api/payment/status`        | POST   | Check payment status         |

### Usage Example

```typescript
// Checkout API
const result = await api.checkout({
  cart_items: [
    { id: "product-id", type: "product" },
    { id: "bundle-id", type: "bundle" },
  ],
  customer_details: {
    first_name: "John",
    last_name: "Doe",
    email: "john@example.com",
    phone: "081234567890",
  },
});

// Check status API
const status = await api.check_payment_status({
  order_id: "ESENSI-1234567890-123",
});
```

## 💾 Database Schema

The integration uses these database tables:

### `t_sales` (Transactions)

```sql
- id: String (Primary Key)
- id_customer: String (Foreign Key)
- status: String (pending, success, failed, cancelled)
- total: Decimal
- currency: String
- midtrans_order_id: String
- midtrans_success: Json
- midtrans_pending: Json
- midtrans_error: Json
- info: Json (cart data, customer details)
```

### `t_sales_download` (User Access)

```sql
- id: String (Primary Key)
- id_customer: String (Foreign Key)
- id_product: String (Foreign Key)
- download_key: String
- downloaded_at: DateTime
```

## 🔐 Security Features

### 1. **Signature Verification**

All webhook notifications are verified using SHA512 signature:

```typescript
const isValid = midtrans.verifyNotificationSignature(notification);
```

### 2. **Transaction Validation**

- Order ID uniqueness
- Amount validation
- User authentication
- Customer verification

### 3. **Error Handling**

- Graceful error messages
- Transaction rollback on failure
- Comprehensive logging

## 🧪 Testing

### 1. **Sandbox Testing**

Use Midtrans sandbox environment with test cards:

- **Success**: `4811 1111 1111 1114`
- **Failure**: `4911 1111 1111 1113`
- **Challenge**: `4411 1111 1111 1118`

### 2. **Payment Methods Testing**

- **Credit Card**: Use test card numbers
- **Bank Transfer**: Use test VA numbers
- **E-Wallet**: Use test phone numbers

### 3. **Webhook Testing**

Use tools like ngrok for local webhook testing:

```bash
ngrok http 3000
# Use ngrok URL in Midtrans Dashboard
```

## 📱 User Experience

### Cart Features

- ✅ Real-time price calculations
- ✅ Bulk item selection/deletion
- ✅ Responsive design (mobile/desktop)
- ✅ Empty cart handling

### Checkout Features

- ✅ Customer data validation
- ✅ Payment method selection
- ✅ Loading states
- ✅ Error messaging

### Payment Status

- ✅ Real-time status updates
- ✅ Copy payment details
- ✅ Clear instructions
- ✅ Help links

## 🚨 Troubleshooting

### Common Issues

1. **"Invalid signature" error**

   - Check server key configuration
   - Verify webhook URL
   - Ensure proper request body parsing

2. **"Snap token not generated"**

   - Verify client/server keys
   - Check transaction amount > 0
   - Validate item details

3. **Payment popup not opening**

   - Check client key in frontend
   - Verify SNAP script loading
   - Check browser console for errors

4. **Webhook not received**
   - Verify notification URL in Midtrans Dashboard
   - Check server accessibility
   - Ensure HTTPS in production

### Debug Steps

1. **Check Logs**

   ```bash
   # Backend logs
   tail -f backend/logs/app.log

   # Frontend console
   # Open browser dev tools
   ```

2. **Midtrans Dashboard**

   - Check transaction history
   - View notification logs
   - Test webhook manually

3. **Database Queries**

   ```sql
   -- Check transaction status
   SELECT * FROM t_sales WHERE midtrans_order_id = 'ORDER-123';

   -- Check user access
   SELECT * FROM t_sales_download WHERE id_customer = 'customer-id';
   ```

## 🔄 Production Deployment

### 1. **Environment Setup**

- Use production Midtrans keys
- Set NODE_ENV=production
- Configure HTTPS
- Set up proper domain

### 2. **Security Checklist**

- ✅ HTTPS enabled
- ✅ Environment variables secured
- ✅ Database access restricted
- ✅ Error logging enabled

### 3. **Monitoring**

- Set up payment success/failure alerts
- Monitor webhook response times
- Track transaction volumes
- Monitor error rates

## 📞 Support

### Resources

- **Midtrans Documentation**: https://docs.midtrans.com/
- **SNAP Integration**: https://docs.midtrans.com/docs/snap
- **Webhook Guide**: https://docs.midtrans.com/docs/http-notification

### Contact

- **Technical Issues**: Check Midtrans documentation
- **Integration Help**: Review code comments and examples
- **Production Issues**: Contact Midtrans support

## 🎯 Next Steps

### Potential Enhancements

1. **Payment Analytics Dashboard**
2. **Subscription Payments**
3. **Refund Management**
4. **Multi-currency Support**
5. **Advanced Fraud Detection**

### Performance Optimization

1. **Caching payment status**
2. **Async webhook processing**
3. **Database indexing**
4. **CDN for static assets**

---

**Note**: Always test thoroughly in sandbox environment before going live. Keep your API keys secure and never commit them to version control.
