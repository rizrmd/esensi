import { DiscountPercent } from "@/components/esensi/discount-percent";
import { formatMoney } from "@/components/esensi/format-money";
import { MainEsensiLayout } from "@/components/esensi/layout";
import {
  LayoutBookList,
  type BooksCardType,
} from "@/components/esensi/layout-book-list.old";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/gen/main.esensi";
import { useLocal } from "@/lib/hooks/use-local";
import { navigate } from "@/lib/router";
import { ChevronUp, Trash2 } from "lucide-react";

export default (data: Awaited<ReturnType<typeof api.browse>>["data"]) => {
  const header_config = {
    enable: true,
    logo: false,
    back: true,
    search: false,
    title: "Keranjang Belanja",
    cart: false,
    profile: false,
  };

  const local = useLocal(
    {
      loading: true as boolean,
      list: [
        {
          name: "Surabaya Punya Cerita",
          real_price: "39000",
          strike_price: "49000",
          currency: "Rp.",
          cover:
            "_file/upload/2025-3/29/1745906044620-whatsapp image 2025-04-29 at 12.53.51.jpeg",
          slug: "surabaya-punya-cerita",
          id: "buku-1",
        },
        {
          name: "GTM No Worries! : Solusi Jitu Anak Doyan Makan Lagi",
          real_price: "49000",
          strike_price: "59000",
          currency: "Rp.",
          cover:
            "_file/upload/2025-3/11/1744361915917-rev cover ebook mpasi-gtm-03.jpg",
          slug: "gtm-no-worries-solusi-jitu-anak-doyan-makan-lagi",
          id: "buku-2",
        },
        {
          name: "MPASI Anti Drama : Bikin Makanan Pertama Buah Hati Jadi Seru!",
          real_price: "49000",
          strike_price: "59000",
          currency: "Rp.",
          cover:
            "_file/upload/2025-3/12/1744462103509-revisi-cover ebook mpasi-01-01-01.jpg",
          slug: "mpasi-anti-drama-bikin-makanan-pertama-buah-hati-jadi-seru",
          id: "buku-3",
        },
        {
          name: "Bermain sambil Belajar: Rahasia Mendidik Anak dengan Cara yang Seru",
          real_price: "39000",
          strike_price: "49000",
          currency: "Rp.",
          cover:
            "_file/upload/2025-1/10/1739167867345-2025 - cover ebook ramadhan-13.jpg",
          slug: "bermain-sambil-belajar-rahasia-mendidik-anak-dengan-cara-yang-seru",
          id: "buku-4",
        },
        {
          name: "Menyemai Akhlak Mulia: Rahasia Menanamkan Nilai Moral dan Agama Sejak Dini",
          real_price: "39000",
          strike_price: "49000",
          currency: "Rp.",
          cover:
            "_file/upload/2025-1/10/1739167765542-2025 - cover ebook ramadhan-02.jpg",
          slug: "menyemai-akhlak-mulia-rahasia-menanamkan-nilai-moral-dan-agama-sejak-dini",
          id: "buku-5",
        },
        {
          name: "Ramadhan Ceria Bersama Anak: 30 Aktivitas Kreatif Selama Bulan Suci",
          real_price: "39000",
          strike_price: "49000",
          currency: "Rp.",
          cover:
            "_file/upload/2025-1/10/1739167536994-2025 - cover ebook ramadhan-10.jpg",
          slug: "ramadhan-ceria-bersama-anak-30-aktivitas-kreatif-selama-bulan-suci",
          id: "buku-6",
        },
        {
          name: "Anti Bosan di Bulan Mulia: Ide Aktivitas Ramadhan Bersama Keluarga",
          real_price: "39000",
          strike_price: "49000",
          currency: "Rp.",
          cover:
            "_file/upload/2025-1/10/1739167154664-2025 - cover ebook ramadhan-06.jpg",
          slug: "anti-bosan-di-bulan-mulia-ide-aktivitas-ramadhan-bersama-keluarga",
          id: "buku-7",
        },
        {
          name: "Dongeng Anak Islami: Kumpulan Kisah Berkarakter Penuh Hikmah",
          real_price: "39000",
          strike_price: "49000",
          currency: "Rp.",
          cover:
            "_file/upload/2025-1/10/1739166601865-2025 - cover ebook ramadhan-09.jpg",
          slug: "dongeng-anak-islami-kumpulan-kisah-berkarakter-penuh-hikmah",
          id: "buku-8",
        },
        {
          name: "Cinta dalam Islam: Seni Merawat Fitrah Cinta dalam Keluarga",
          real_price: "39000",
          strike_price: "49000",
          currency: "Rp.",
          cover:
            "_file/upload/2025-1/10/1739166332740-2025 - cover ebook ramadhan-04.jpg",
          slug: "cinta-dalam-islam-seni-merawat-fitrah-cinta-dalam-keluarga",
          id: "buku-9",
        },
        {
          name: "Ngobrol Asyik dengan Anak: Kunci Membangun Komunikasi yang Efektif",
          real_price: "39000",
          strike_price: "49000",
          currency: "Rp.",
          cover:
            "_file/upload/2025-1/10/1739166124875-2025 - cover ebook ramadhan-12.jpg",
          slug: "ngobrol-asyik-dengan-anak-kunci-membangun-komunikasi-yang-efektif",
          id: "buku-10",
        },
        {
          name: "Fun and Faith: Cara Menyenangkan Kenalkan Ibadah pada Anak",
          real_price: "39000",
          strike_price: "49000",
          currency: "Rp.",
          cover:
            "_file/upload/2025-1/10/1739165691713-2025 - cover ebook ramadhan-11.jpg",
          slug: "fun-and-faith-cara-menyenangkan-kenalkan-ibadah-pada-anak",
          id: "buku-11",
        },
        {
          name: "Anak Hebat, Iman Kuat: Panduan Praktis Stimulasi Anak berdasarkan Nilai Keislaman",
          real_price: "39000",
          strike_price: "49000",
          currency: "Rp.",
          cover:
            "_file/upload/2025-1/10/1739165466259-2025 - cover ebook ramadhan-03.jpg",
          slug: "anak-hebat-iman-kuat-panduan-praktis-stimulasi-anak-berdasarkan-nilai-keislaman",
          id: "buku-12",
        },
      ] as any[],
      checked: [] as any[],
      subtotal: 0 as number,
      discount: 0 as number,
      total: 0 as number,
      breakdown: false as boolean,
    },
    async () => {
      local.loading = false;
      recountCart();
      local.render();
    }
  );

  const strikedPrice = (strike_price, real_price, currency) => {
    let discount: any, strikePrice: any;
    if (
      strike_price !== null &&
      strike_price !== "" &&
      strike_price > real_price
    ) {
      const discval =
        "-" +
        Math.round(((strike_price - real_price) / strike_price) * 100) +
        "%";
      discount = (
        <div className="flex justify-center items-center bg-[#d0011b] text-[color:#fff] text-[size:13px] leading-0 p-3 font-bold rounded-full w-auto absolute top-0 left-0 z-10 lg:hidden">
          {discval}
        </div>
      );
      strikePrice = formatMoney(strike_price, currency);
    }
  };

  const recountCart = () => {
    let the_subtotal = 0;
    let the_discount = 0;
    let the_total = 0;
    if (local.list.length > 0) {
      local.list.map((item) => {
        the_subtotal += parseFloat(item.real_price);
        the_discount +=
          item.strike_price !== null &&
          item.strike_price !== "" &&
          item.strike_price > item.real_price
            ? parseFloat(item.strike_price) - parseFloat(item.real_price)
            : 0;
        the_total += parseFloat(item.real_price);
      });
      local.breakdown = true;
    } else {
      local.breakdown = false;
    }
    local.subtotal = the_subtotal;
    local.discount = the_discount;
    local.total = the_total;
    local.render();
  };

  const handleCheck = (event: any, id: number) => {
    const isChecked = event.target.checked;
    if (isChecked) {
      if (!local.checked.includes(id)) {
        local.checked.push(id);
      }
    } else {
      local.checked = local.checked.filter((item) => item !== id);
    }
    local.render();
    recountCart();
  };

  const handleCheckAll = (event: any) => {
    const isChecked = event.target.checked;
    if (isChecked) {
      local.checked = local.list.map((item, idx) => item.id);
    } else {
      local.checked = [];
    }
    local.render();
    recountCart();
  };

  const handleDeleteItem = (id: number) => {
    if (
      window.confirm(
        "Apakah Anda yakin ingin menghapus item ini dari keranjang?"
      )
    ) {
      local.list = local.list.filter((item) => item.id !== id);
      local.checked = local.checked.filter((item) => item !== id);
      local.render();
      recountCart();
    }
  };

  const handleDeleteChecked = (event: any) => {
    event.preventDefault();
    if (local.checked.length === 0) {
      alert("Tidak ada item yang dipilih untuk dihapus.");
      return;
    }

    if (
      window.confirm("Apakah Anda yakin ingin menghapus item yang dipilih?")
    ) {
      local.list = local.list.filter(
        (item) => !local.checked.includes(item.id)
      );
      local.checked = [];
      local.render();
      recountCart();
    }
  };

  const handleBreakdown = (event: any) => {
    event.preventDefault();
    local.breakdown = !local.breakdown;
    local.render();
  };

  const handleCheckout = (event: any) => {
    event.preventDefault();
    alert("Lanjutkan proses checkout, edit script-nya");
  };

  const cartDeleteChecked = local.checked.length > 0 && (
    <div className="flex items-center text-[#3B2C93]">
      <Button
        className="flex items-center gap-2"
        variant="ghost"
        onClick={handleDeleteChecked}
      >
        <Trash2 strokeWidth={3} />
        <span className="text-[#3B2C93]">Hapus yang dipilih</span>
      </Button>
    </div>
  );

  const cartCheckAll = (
    <div className="flex justify-between items-stretch w-full gap-3 h-12 px-2 w-8 lg:border bg-white lg:rounded-md">
      <div className="flex w-auto py-1 justify-center items-center shrink-0">
        <label className="flex items-center gap-4 px-1.5 cursor-pointer">
          <input
            type="checkbox"
            onChange={handleCheckAll}
            checked={
              local.checked.length === local.list.length &&
              local.list.length > 0
            }
          />
          <span className="text-sm font-medium text-[#383D64]">
            Pilih Semua
          </span>
        </label>
      </div>
      {cartDeleteChecked}
    </div>
  );

  const cartEmpty = (
    <div className="flex flex-col justify-center items-center aspect-4/3 lg:aspect-[unset] w-full bg-white p-4">
      <div className="flex flex-col text-[#3B2C93] justify-center items-center text-center leading-[1.3] gap-2 grow-1 lg:py-10 lg:gap-3">
        <h2 className="flex font-bold lg:text-xl">Keranjang Kamu Kosong</h2>
        <p>
          Kami punya banyak buku yang siap memberi kamu ilmu baru. Yuk belanja
          sekarang!
        </p>
      </div>
      <div className="flex flex-col py-2">
        <Button
          className="bg-[#3B2C93] text-white px-8 h-12 rounded-2xl w-full"
          onClick={(e) => {
            e.preventDefault();
            navigate("/browse");
          }}
        >
          <span>Mulai Belanja</span>
        </Button>
      </div>
    </div>
  );
  const cartItemsList = local.list.map((ci, idx) => {
    const striked =
      ci.strike_price !== null &&
      ci.strike_price !== "" &&
      ci.strike_price > ci.real_price ? (
        formatMoney(ci.strike_price, ci.currency)
      ) : (
        <></>
      );
    return (
      <div
        className={`flex justify-between items-start w-full gap-3 py-4 px-2 lg:gap-5 ${
          local.checked.includes(ci.id) ? "bg-[#f5f8ff]" : "lg:bg-white"
        }`}
        key={`esensi_cart_item_${idx}`}
      >
        <div className="flex w-8 py-1 justify-center items-start shrink-0 lg:h-full lg:items-center">
          <input
            type="checkbox"
            className=""
            onChange={(e) => {
              handleCheck(e, ci.id);
            }}
            checked={local.checked.includes(ci.id)}
          />
        </div>
        <div className="flex w-1/4 lg:w-20 shrink-0">
          <img
            src={`https://esensi.online/${ci.cover.replace(
              "_file/",
              "_img/"
            )}?w=320`}
            alt={ci!.name.replace("'", "").replace('"', "")}
            className="w-full h-full aspect-3/4 object-center object-cover"
          />
        </div>
        <div className="flex flex-col w-auto grow-1 gap-3 lg:flex-row lg:items-center lg:h-full lg:py-1 lg:gap-4">
          <h5 className="text-[#3B2C93] leading-[1.2] font-semibold">
            {ci.name}
          </h5>
          <div className="flex flex-col grow-1 justify-end lg:flex-row lg:items-center lg:justify-end lg:gap-2 lg:w-auto lg:whitespace-nowrap">
            <DiscountPercent
              real_price={ci?.real_price}
              strike_price={ci?.strike_price}
              currency={ci?.currency}
            />
            <strong
              className={`${
                ci.strike_price !== null &&
                ci.strike_price !== "" &&
                ci.strike_price > ci.real_price
                  ? "text-[#C6011B]"
                  : "text-black"
              }`}
            >
              {formatMoney(ci.real_price, ci.currency)}
            </strong>
          </div>
        </div>
        <div className="flex w-auto items-end self-stretch shrink-0 lg:items-center">
          <Button
            variant={"ghost"}
            className="text-[#3B2C93]"
            onClick={(e) => {
              e.preventDefault;
              handleDeleteItem(ci.id);
            }}
          >
            <Trash2 strokeWidth={3} />
          </Button>
        </div>
      </div>
    );
  });
  const cartItems = (
    <>
      {cartCheckAll}
      <div className="flex flex-col w-full h-auto gap-1 lg:gap-px bg-white lg:border lg:bg-transparent lg:rounded-md lg:overflow-hidden">
        {cartItemsList}
      </div>
    </>
  );
  const renderCart = local.list.length > 0 ? cartItems : cartEmpty;

  const breakdownList = (
    label: string,
    value: any,
    currency: string,
    color: string | null
  ) => {
    currency = currency || "Rp.";
    return (
      <div className="flex justify-between">
        <span>{label}</span>
        <span className="">{formatMoney(value, currency)}</span>
      </div>
    );
  };

  const renderBreakdown = (
    <div
      className={`w-full ${
        local.list.length > 0 ? "flex" : "hidden lg:flex"
      } flex-col lg:rounded-sm lg:overflow-hidden`}
    >
      <div
        className={`flex flex-col w-full h-fit fixed bottom-0 left-0 bg-white pt-2 pb-16 px-4 gap-3 lg:bg-[#3B2C93] lg:text-white lg:relative lg:bottom-none lg:left-none lg:py-6 lg:px-6 lg:pb-0 lg:gap-4 shadow-[0_-4px_30px_1px_rgba(0,0,0,0.15)] transition-transform duration-300 ${
          local.breakdown
            ? "translate-y-0"
            : "translate-y-full lg:translate-y-0"
        } lg:relative lg:bottom-none lg:left-none lg:shadow-none lg:h-auto`}
      >
        <span className="font-bold text-[#3B2C93] lg:text-white">
          Ringkasan keranjang
        </span>
        <div className="flex flex-col w-full lg:gap-2 [&>div]:flex [&>div]:justify-between">
          <div>
            <span>Subtotal harga ({local.list.length} Barang)</span>
            <span>{formatMoney(local.subtotal, "Rp.")}</span>
          </div>
          <div>
            <span>Diskon Belanja</span>
            <strong className="text-[#C6011B] lg:text-[#D4D8F7]">
              – {formatMoney(local.discount, "Rp.")}
            </strong>
          </div>
        </div>
        <hr />
      </div>

      <div
        className={`flex w-full justify-between items-center h-14 py-1 px-4 fixed bottom-0 left-0 bg-white lg:bg-[#3B2C93] lg:relative lg:bottom-none lg:left-none lg:py-6 lg:px-6 lg:h-fit ${
          local.breakdown ? "" : "shadow-[0_-4px_30px_1px_rgba(0,0,0,0.15)]"
        } lg:shadow-none`}
      >
        <div
          className="flex flex-col items-start py-1 cursor-pointer lg:cursor-default lg:py-0"
          onClick={handleBreakdown}
        >
          <span className="text-[#B0B0B0] font-medium text-sm lg:text-md">
            Total
          </span>
          <div className="flex gap-2 items-center text-[#3B2C93] lg:text-white lg:text-yellow lg:[&>svg]:hidden">
            <strong className="font-bold text-lg lg:text-2xl">
              {formatMoney(local.total, "Rp.")}
            </strong>
            <ChevronUp strokeWidth={1.75} />
          </div>
        </div>

        <div
          className={`h-full items-center py-1 ${
            local.list.length > 0 ? "flex" : "hidden"
          }`}
        >
          <Button
            className="flex items-center justify-center gap-2 bg-[#C6011B] text-white lg:bg-[#D4D8F7] hover:lg:bg-[#D4D8F7] lg:text-[#3B2C93] px-10 h-full rounded-lg"
            onClick={handleCheckout}
          >
            Checkout
          </Button>
        </div>
      </div>
    </div>
  );

  const renderLoading = (
    <div className="flex justify-center items-center w-full h-64">
      <span className="text-gray-500">Loading...</span>
    </div>
  );

  return (
    <MainEsensiLayout header_config={header_config} mobile_menu={false}>
      <div className="flex flex-col w-full h-auto gap-4 bg-[#E1E5EF] lg:bg-white items-center lg:py-10 lg:gap-15 lg:py-10">
        {local.list.length > 0 && (
          <h2 className="hidden w-full lg:flex flex-start text-[#3B2C93] max-w-[1200px] text-3xl font-semibold">
            Keranjang
          </h2>
        )}

        <div className="flex flex-col w-full h-auto lg:auto lg:flex-row lg:gap-6 max-w-[1200px]">
          <div className="flex flex-col lg:grow-1 w-full h-auto gap-4 [&_input[type=checkbox]]:w-5 [&_input[type=checkbox]]:h-5 [&_input[type=checkbox]]:border-0.5 [&_input[type=checkbox]]:border-[#3B2C93] [&_input[type=checkbox]]:rounded-xs">
            {local.loading ? renderLoading : renderCart}
          </div>
          <div
            className={`flex w-full lg:w-1/3 shrink-0 ${
              local.list.length == 0 ? "lg:hidden" : ""
            }`}
          >
            {!local.loading && renderBreakdown}
          </div>
        </div>
        <div className="flex flex-col w-full h-auto bg-white p-6 bg-white lg:-mb-10 lg:pb-10">
          <div className="max-w-[1200px]">{/* Recommendation */}</div>
        </div>
      </div>
    </MainEsensiLayout>
  );
};
