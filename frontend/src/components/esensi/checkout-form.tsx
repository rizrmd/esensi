import { Button } from "@/components/ui/button";
import { api } from "@/lib/gen/main.esensi";
import { useLocal } from "@/lib/hooks/use-local";
import { initMidtransPayment } from "@/lib/midtrans";
import { navigate } from "@/lib/router";

interface CheckoutFormProps {
  cartItems: any[];
  total: number;
  onSuccess?: () => void;
}

export const CheckoutForm = ({
  cartItems,
  total,
  onSuccess,
}: CheckoutFormProps) => {
  const local = useLocal(
    {
      loading: false,
      showForm: false,
      customerData: {
        first_name: "",
        last_name: "",
        email: "",
        phone: "",
      },
    },
    async () => {
      // Load customer data from user profile if available
      local.render();
    }
  );

  const handleInputChange = (field: string, value: string) => {
    local.customerData[field] = value;
    local.render();
  };

  const handleCheckout = async () => {
    if (
      !local.customerData.first_name ||
      !local.customerData.email ||
      !local.customerData.phone
    ) {
      alert("Mohon lengkapi data customer");
      return;
    }

    local.loading = true;
    local.render();

    try {
      // Prepare cart items for checkout
      const cart_items = cartItems.map((item) => ({
        id: item.id,
        type: item.type || "product",
      }));

      // Call checkout API
      const result = await api.checkout({
        cart_items,
        customer_details: local.customerData,
      });

      if (result.data.snap_token) {
        // Use Midtrans helper to initialize payment
        await initMidtransPayment(result.data.snap_token, {
          onSuccess: (result: any) => {
            console.log("Payment success:", result);
            navigate(`/payment/success?order_id=${result.order_id}`);
            if (onSuccess) onSuccess();
          },
          onPending: (result: any) => {
            console.log("Payment pending:", result);
            navigate(`/payment/pending?order_id=${result.order_id}`);
            if (onSuccess) onSuccess();
          },
          onError: (result: any) => {
            console.log("Payment error:", result);
            navigate(`/payment/error?order_id=${result.order_id}`);
          },
          onClose: () => {
            console.log("Payment popup closed");
            local.loading = false;
            local.render();
          },
        });
      } else {
        alert("Gagal memproses pembayaran");
        local.loading = false;
        local.render();
      }
    } catch (error: any) {
      console.error("Checkout error:", error);
      alert(`Terjadi kesalahan: ${error?.message || "Unknown error"}`);
      local.loading = false;
      local.render();
    }
  };

  const toggleForm = () => {
    local.showForm = !local.showForm;
    local.render();
  };

  if (!local.showForm) {
    return (
      <Button
        className="flex items-center justify-center gap-2 bg-[#C6011B] text-white lg:bg-[#D4D8F7] hover:lg:bg-[#D4D8F7] lg:text-[#3B2C93] px-10 h-full rounded-lg"
        onClick={toggleForm}
        disabled={cartItems.length === 0}
      >
        Checkout
      </Button>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h3 className="text-lg font-semibold text-[#3B2C93] mb-4">
          Data Pembeli
        </h3>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nama Depan *
            </label>
            <input
              type="text"
              value={local.customerData.first_name}
              onChange={(e) => handleInputChange("first_name", e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#3B2C93] focus:border-transparent"
              placeholder="Masukkan nama depan"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nama Belakang
            </label>
            <input
              type="text"
              value={local.customerData.last_name}
              onChange={(e) => handleInputChange("last_name", e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#3B2C93] focus:border-transparent"
              placeholder="Masukkan nama belakang"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email *
            </label>
            <input
              type="email"
              value={local.customerData.email}
              onChange={(e) => handleInputChange("email", e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#3B2C93] focus:border-transparent"
              placeholder="Masukkan email"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nomor Telepon *
            </label>
            <input
              type="tel"
              value={local.customerData.phone}
              onChange={(e) => handleInputChange("phone", e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#3B2C93] focus:border-transparent"
              placeholder="Masukkan nomor telepon"
            />
          </div>

          <div className="bg-gray-50 p-3 rounded-md">
            <div className="flex justify-between items-center">
              <span className="font-medium text-gray-700">
                Total Pembayaran:
              </span>
              <span className="font-bold text-lg text-[#3B2C93]">
                Rp {total.toLocaleString("id-ID")}
              </span>
            </div>
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <Button
            variant="outline"
            onClick={toggleForm}
            className="flex-1 border-[#3B2C93] text-[#3B2C93]"
            disabled={local.loading}
          >
            Batal
          </Button>
          <Button
            onClick={handleCheckout}
            className="flex-1 bg-[#C6011B] hover:bg-[#A5010F] text-white"
            disabled={
              local.loading ||
              !local.customerData.first_name ||
              !local.customerData.email ||
              !local.customerData.phone
            }
          >
            {local.loading ? "Memproses..." : "Bayar Sekarang"}
          </Button>
        </div>
      </div>
    </div>
  );
};
