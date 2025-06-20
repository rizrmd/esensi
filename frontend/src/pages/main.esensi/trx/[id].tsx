import { formatMoney } from "@/components/esensi/format-money";
import { MainEsensiLayout } from "@/components/esensi/layout";
import { LinkItem } from "@/components/esensi/link-item";
import { Button } from "@/components/ui/button";
import type { api } from "@/lib/gen/main.esensi";
import { useLocal } from "@/lib/hooks/use-local";
import { Link } from "@/lib/router";
import {
  ChevronDown,
  ChevronRight,
  ChevronUp,
  CircleHelp,
  MessageCircleMore,
  SquareArrowLeft,
} from "lucide-react";

export default (data: Awaited<ReturnType<typeof api.trx>>["data"]) => {
  const header_config = {
    enable: true,
    logo: false,
    back: true,
    search: false,
    title: "Rincian Pembelian",
    cart: false,
    profile: false,
  };

  const trxStatusMsg = {
    success: "Pesanan Selesai",
    pending: "Menunggu Pembayaran",
    failed: "Pesanan Gagal",
    expired: "Pesanan Kadaluarsa",
    cancelled: "Pesanan Dibatalkan",
    fraud: "Terdeteksi Fraud",
  };

  const paymentMethodsString = (method: string) => {
    switch (method) {
      case "bank_transfer":
        return "Transfer Bank";
      case "bri":
        return "BRI";
      case "bni":
        return "BNI";
      case "bca":
        return "BCA";
      case "mandiri":
        return "Mandiri";
      case "cimb":
        return "CIMB Niaga";
      case "permata":
        return "Permata Bank";
      case "cstore":
        return "Kedai Retail";
      case "echannel":
        return "E-Channel";
      case "gopay":
        return "Gopay";
      case "shopeepay":
        return "ShopeePay";
      case "qris":
        return "QRIS";
      case "credit_card":
        return "Kartu Kredit";
      case "indomaret":
        return "Indomaret";
      case "alfamart":
        return "Alfamart";
      case "akulaku":
        return "Akulaku";
      case "kredivo":
        return "Kredivo";
      case "bri_epay":
        return "BRI E-Pay";
      case "bni_va":
        return "BNI Virtual Account";
      case "bca_va":
        return "BCA Virtual Account";
      case "permata_va":
        return "Permata Virtual Account";
      case "mandiri_va":
        return "Mandiri Virtual Account";
        break;
      case "danamon_va":
        return "Danamon Virtual Account";
      case "bsi_va":
        return "BSI Virtual Account";
      default:
        return method;
    }
  };

  const local = useLocal(
    {
      loading: true as boolean,
      trx: {} as any,
      list: [] as any[],
      payment: {
        method: null as string | null,
        bank: null as string | null,
        va_number: null as string | null,
        time: null as string | null,
        status: null as string | null,
      } as any,
      help_links: [] as any[],
      breakdown: {
        show: false as boolean,
        subtotal: 0 as number,
        discount: 0 as number,
      } as any,
    },
    async () => {
      local.trx = data.trx;
      local.list = data.trx.info.cart;

      let subtotal = 0;
      let discount = 0;
      local.list.map((item) => {
        subtotal += parseFloat(item.real_price);
        if (
          item.strike_price !== null &&
          item.strike_price !== "" &&
          item.strike_price > item.real_price
        ) {
          discount +=
            parseFloat(item.strike_price) - parseFloat(item.real_price);
        }
      });
      local.breakdown.subtotal = subtotal;
      local.breakdown.discount = discount;

      const trx_data =
        data.trx.midtrans_success !== null
          ? data.trx.midtrans_success
          : data.trx.midtrans_pending !== null
          ? data.trx.midtrans_pending
          : data.trx.midtrans_failed !== null
          ? data.trx.midtrans_failed
          : null;
      if (trx_data !== null) {
        local.payment.method = paymentMethodsString(trx_data.payment_type);
        if (trx_data.payment_type === "bank_transfer") {
          local.payment.bank = trx_data?.va_numbers?.bank
            ? trx_data.va_numbers.bank
            : null;
          local.payment.va_number = trx_data?.va_numbers?.va_number
            ? trx_data.va_numbers.va_number
            : null;
        }
        local.payment.time = trx_data.transaction_time;
        local.payment.status = trx_data.transaction_status;
      }
      local.loading = false;
      local.help_links = [
        {
          label: "Ajukan Pengembalian",
          url: "#",
          newtab: true,
          icon: (
            <>
              <SquareArrowLeft />
            </>
          ),
        },
        {
          label: "Hubungi Tim Esensi",
          url: "#",
          newtab: true,
          icon: (
            <>
              <MessageCircleMore />
            </>
          ),
        },
        {
          label: "Pusat Bantuan",
          url: "#",
          newtab: true,
          icon: (
            <>
              <CircleHelp />
            </>
          ),
        },
      ];

      local.render();
    }
  );

  const handleBreakdown = (e: any) => {
    e.preventDefault();
    local.breakdown.show = !local.breakdown.show;
    local.render();
  };

  const renderItems = local.list.map((item) => {
    const striked =
      item.strike_price !== null &&
      item.strike_price !== "" &&
      item.strike_price > item.real_price ? (
        formatMoney(item.strike_price, item.currency)
      ) : (
        <></>
      );
    return (
      <div className="flex w-full gap-4">
        <img
          src={`https://esensi.online/${item.cover.replace(
            "_file/",
            "_img/"
          )}?w=320`}
          alt={item!.name.replace("'", "").replace('"', "")}
          className="max-w-1/4 w-full h-auto object-cover object-left rounded-lg lg:max-w-[80px]"
        />
        <div className="flex flex-col justify-between grow-1 lg:py-4">
          <h4 className="text-[#3B2C93] font-semibold leading-[1.3]">
            {item.name}
          </h4>
          <div className="flex flex-col text-sm text-[#3B2C93]">
            <span className="line-through text-[#a9a9a9] text-xs h-4">
              {striked}
            </span>
            <strong
              className={`${
                item.strike_price !== null &&
                item.strike_price !== "" &&
                item.strike_price > item.real_price
                  ? "text-[#C6011B]"
                  : "text-black"
              }`}
            >
              {formatMoney(item.real_price, item.currency)}
            </strong>
          </div>
        </div>
      </div>
    );
  });

  const renderBreakdownList = () => {
    return <></>;
  };

  const renderItemsWrapper = !local.loading && (
    <div className="gap-4 lg:flex-1">
      <h3>
        {local.trx.status == "paid"
          ? trxStatusMsg.success
          : local.trx.status == "pending"
          ? trxStatusMsg.pending
          : local.trx.status == "cancelled"
          ? trxStatusMsg.cancelled
          : local.trx.status.fraud
          ? trxStatusMsg.fraud
          : ""}
      </h3>
      <hr className="border-t border-[#E1E5EF]" />
      <div className="flex flex-col gap-6">{renderItems}</div>
      <hr className="border-t border-[#E1E5EF] lg:hidden" />
    </div>
  );
  const renderTotal = (
    <div className="flex w-full flex-col items-end justify-start -mt-6 lg:mt-0">
      <div
        className={`flex flex-col w-full transition-all duration-600 overflow-hidden ${
          local.breakdown.show ? "h-[80px]" : "h-0"
        }  [&>div]:flex [&>div]:justify-between [&>div]:justify-items-center [&>div]:gap-1.5 [&>div>span:last-child]:text-right`}
      >
        <div>
          <span>Subtotal produk</span>
          <span>
            {formatMoney(local.breakdown.subtotal, local.trx.currency)}
          </span>
        </div>
        <div>
          <span>Diskon</span>
          <span className="text-[#C6011B]">
            – {formatMoney(local.breakdown.discount, local.trx.currency)}
          </span>
        </div>
      </div>
      <Button
        variant={"link"}
        className="flex items-center gap-3 text-[#383D64] font-bold text-lg decoration-none"
        onClick={handleBreakdown}
      >
        <span>
          Total pesanan {formatMoney(local.trx.total, local.trx.currency)}
        </span>
        {local.breakdown.show ? <ChevronUp /> : <ChevronDown />}
      </Button>
    </div>
  );
  const renderBreakdown = (
    <div>
      <div className="flex flex-col text-[#3B2C93] text-sm [&>div]:flex [&>div]:justify-between [&>div]:justify-items-center [&>div]:gap-1.5 [&>div>span:last-child]:text-right [&>div:nth-child(1),&>div:nth-child(2)]:mb-4">
        <div>
          <span className="font-bold">No. Pesanan</span>
          <span className="text-md">{local.trx.midtrans_order_id}</span>
        </div>
        <div>
          <span>Metode Pembayaran</span> <span>{local.payment.method}</span>
        </div>
        <div>
          <span>Waktu Pemesanan</span> <span>{local.trx.created_at}</span>
        </div>
        <div>
          <span>Waktu Pembayaran</span> <span>{local.payment.time}</span>
        </div>
        <div>
          <span>Waktu Pesanan Selesai</span> <span>{local.trx.updated_at}</span>
        </div>
      </div>
    </div>
  );

  const renderHelpLinks = local.help_links.map((link) => {
    return (
      <LinkItem label={link.label} url={link.url} icon={link.icon}></LinkItem>
    );
  });

  return (
    <MainEsensiLayout header_config={header_config}>
      <div className="flex flex-col justify-center items-start bg-[#E1E5EF] lg:items-center lg:py-10">
        <div className="flex flex-col w-full gap-4 max-w-[1200px] lg:flex-1 lg:flex-row lg:gap-10 lg:flex-wrap lg:justify-center [&>div>div]:flex [&>div>div]:flex-col [&>div>div]:bg-white [&>div>div]:p-6 [&_h3]:font-bold [&_h3]:text-[#3B2C93]">
          <div className="flex flex-col gap-4 w-full lg:w-auto lg:flex-1">
            {!local.loading && renderItemsWrapper}
          </div>
          <div className="flex flex-col gap-4 w-full lg:w-1/3">
            {!local.loading && renderTotal}
            {!local.loading && renderBreakdown}
            <div className="gap-4 lg:w-full">
              <h3>Butuh bantuan?</h3>
              <div className="flex w-full flex-col gap-2 text-sm text-[#3B2C93] ">
                {renderHelpLinks}
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainEsensiLayout>
  );
};
