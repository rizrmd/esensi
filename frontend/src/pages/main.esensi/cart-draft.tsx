import { formatMoney } from "@/components/esensi/format-money";
import { MainEsensiLayout } from "@/components/esensi/layout";
import {
  LayoutBookList,
  type BooksCardType,
} from "@/components/esensi/layout-book-list";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/gen/main.esensi";
import { useLocal } from "@/lib/hooks/use-local";
import { navigate } from "@/lib/router";
import { Trash2 } from "lucide-react";

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
    },
    async () => {
      local.loading = false;
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
  };

  const handleCheckAll = (event: any) => {
    const isChecked = event.target.checked;
    if (isChecked) {
      local.checked = local.list.map((item, idx) => item.id);
    } else {
      local.checked = [];
    }
    local.render();
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
    }
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
    <div className="flex justify-between items-stretch w-full gap-3 h-12 px-2 w-8 bg-white">
      <div className="flex w-auto py-1 justify-center items-center shrink-0">
        <label className="flex items-center gap-4 px-1.5">
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
    <div className="flex flex-col justify-center items-center aspect-4/3 w-full bg-white p-4">
      <div className="flex flex-col text-[#3B2C93] justify-center items-center text-center leading-[1.3] gap-2 grow-1">
        <h2 className="flex font-bold">Keranjang Kamu Kosong</h2>
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
        className={`flex justify-between items-start w-full gap-3 py-4 px-2 ${
          local.checked.includes(ci.id) ? "bg-[#f5f8ff]" : ""
        }`}
        key={`esensi_cart_item_${idx}`}
      >
        <div className="flex w-8 py-1 justify-center items-start shrink-0">
          <input
            type="checkbox"
            className=""
            onChange={(e) => {
              handleCheck(e, ci.id);
            }}
            checked={local.checked.includes(ci.id)}
          />
        </div>
        <div className="flex w-1/4 shrink-0">
          <img
            src={`https://esensi.online/${ci.cover.replace(
              "_file/",
              "_img/"
            )}?w=320`}
            alt={ci!.name.replace("'", "").replace('"', "")}
            className="w-full h-full aspect-3/4 object-center object-cover"
          />
        </div>
        <div className="flex flex-col w-auto grow-1 gap-3">
          <h5 className="text-[#3B2C93] leading-[1.2] font-bold">{ci.name}</h5>
          <div className="flex flex-col grow-1 justify-end">
            <span className="line-through text-[#a9a9a9] text-xs h-4">
              {striked}
            </span>
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
        <div className="flex w-auto items-end self-stretch shrink-0">
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
      <div className="flex flex-col w-full h-auto gap-1 bg-white">
        {cartItemsList}
      </div>
    </>
  );
  const renderCart = local.list.length > 0 ? cartItems : cartEmpty;

  const renderBreakdown = <></>;

  const renderLoading = (
    <div className="flex justify-center items-center w-full h-64">
      <span className="text-gray-500">Loading...</span>
    </div>
  );

  return (
    <MainEsensiLayout header_config={header_config}>
      <div className="flex flex-col w-full h-auto gap-4 bg-[#E1E5EF]">
        <div className="flex flex-col w-full h-auto gap-4 [&_input[type=checkbox]]:w-5 [&_input[type=checkbox]]:h-5 [&_input[type=checkbox]]:border-0.5 [&_input[type=checkbox]]:border-[#3B2C93] [&_input[type=checkbox]]:rounded-xs">
          {local.loading ? renderLoading : renderCart}
        </div>
        <div className="flex flex-col w-full h-auto bg-white p-6 bg-white">
          Recommendation
        </div>
      </div>
    </MainEsensiLayout>
  );
};
