import { Button } from "@/components/ui/button";
import { Link, navigate } from "@/lib/router";
import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  CircleEllipsis,
  CircleUserRound,
  House,
  LibraryBig,
  Search,
  ShoppingBasket,
  X
} from "lucide-react";
import { useState } from "react";

export const formatMoney = (res: any, curr: any) => {
  if (typeof res === "string" && res.startsWith("BigInt::")) {
    res = res.substring(`BigInt::`.length);
  }
  const formattedAmount = new Intl.NumberFormat("id-ID", {
    minimumFractionDigits: 0,
  }).format(res);
  let prefix = "";
  if (typeof curr === "string" && curr !== "") {
    prefix = curr + " ";
  }
  return prefix + formattedAmount + ",-";
};

function PageHeader({
  title = "Esensi Online" as string,
  back = true as boolean,
  logo = true as boolean,
  search = true as boolean,
}) {
  const [isSearching, setIsSearching] = useState(false);
  const [pageTitle, setPageTitle] = useState(title);
  const [showBack, setShowBack] = useState(back);
  const [showLogo, setShowLogo] = useState(logo);
  const [showSearch, setShowSearch] = useState(search);
  const [searchValue, setSearchValue] = useState("");

  const searchInput = (e: any) => {
    if (e.type === "keyup" && e.key === "Enter") {
      e.preventDefault();
      navigate(`/search/${encodeURIComponent(searchValue)}`);
    } else {
      setSearchValue(e.target.value);
    }
  };

  const backButton = showBack ? (
    <Button
      variant="ghost"
      className="flex h-full w-auto aspect-square justify-center items-center cursor-pointer rounded-none border-r-[1px] border-r-[color:#D3d3d3]"
      onClick={() => {
        history.back();
      }}
    >
      <ChevronLeft size={24} strokeWidth={2} />
    </Button>
  ) : (
    ""
  );
  const the_logo = showLogo ? (
    <div className="flex h-full w-auto aspect-square justify-center items-center">
      <img
        src="https://esensi.online/logo.webp"
        alt="Esensi Online"
        className="h-[65%] w-auto object-contain object-center"
      />
    </div>
  ) : (
    ""
  );
  const the_title = (
    <div className="flex flex-1 justify-start items-center pl-1 pr-1 font-bold">
      {pageTitle}
    </div>
  );
  const the_search = showSearch ? (
    <Button
      onClick={(e) => {
        e.preventDefault();
        setIsSearching(!isSearching);
      }}
      variant="ghost"
      className="flex h-full w-auto justify-center items-center gap-1 cursor-pointer pl-1 pr-1 rounded-none"
    >
      Cari buku <Search size={20} strokeWidth={1.5} />
    </Button>
  ) : (
    ""
  );

  const mode_normal = (
    <div className="w-full h-full flex flex-1 justify-between items-center">
      {backButton}
      {the_logo}
      {the_title}
      {the_search}
    </div>
  );

  const mode_searching = (
    <div className="w-full h-full flex flex-1 justify-between items-center">
      <div className="w-full h-[80%] flex flex-1 justify-stretch items-stretch pr-5 pl-5">
        <input
          type="text"
          value={searchValue}
          autoFocus
          onKeyUp={searchInput}
          onChange={searchInput}
          placeholder="Ketik judul bukunya..."
          className="border-0 rounded-none w-full h-full outline-none"
        />
      </div>
      <Button
        onClick={(e) => {
          e.preventDefault();
          setIsSearching(!isSearching);
        }}
        variant="ghost"
        className="flex h-full w-auto aspect-square justify-center items-center cursor-pointer rounded-none"
      >
        <X size={48} strokeWidth={1.5} />
      </Button>
    </div>
  );

  return (
    <div className="w-full h-auto border-b-2 border-b-[color:#D3d3d3]">
      <div className="w-full h-12 flex flex-1 flex-nowrap gap-0 items-stretch">
        {isSearching ? mode_searching : mode_normal}
      </div>
    </div>
  );
}

function PageFooter() {
  const menus = [
    {
      label: "Home",
      url: "/store",
      icon: <House size={48} strokeWidth={1.5} />,
    },
    {
      label: "My Library",
      url: "/download/_",
      icon: <LibraryBig size={48} strokeWidth={1.5} />,
    },
    {
      label: "Cart",
      url: "/cart",
      icon: <ShoppingBasket size={48} strokeWidth={1.5} />,
    },
    {
      label: "Esensi",
      url: "/esensi",
      icon: <CircleEllipsis size={48} strokeWidth={1.5} />,
    },
    {
      label: "Profile",
      url: "/profile",
      icon: <CircleUserRound size={48} strokeWidth={1.5} />,
    },
  ];

  let menuButtons = menus.map((btn, i) => {
    return (
      <>
        <Link
          key={`footernav_${i}`}
          href={btn.url}
          className="flex flex-col gap-1 justify-center items-center h-full"
        >
          {btn.icon}
          <span
            key={`footernav_label_${i}`}
            className="text-[size:10px] text-[color:#444]"
          >
            {btn.label}
          </span>
        </Link>
      </>
    );
  });
  return (
    <div className="flex flex-row justify-around items-center w-full pt-2 pb-2 h-[50px] border-t-2 border-t-[color:#D3d3d3]">
      {menuButtons}
    </div>
  );
}

function BookCard({ data }) {
  let discount: any, strikePrice: any;
  if (
    data.strike_price !== null &&
    data.strike_price !== "" &&
    data.strike_price > data.real_price
  ) {
    const discval =
      "-" +
      Math.round(
        ((data.strike_price - data.real_price) / data.strike_price) * 100
      ) +
      "%";
    discount = (
      <div className="flex justify-center items-center bg-[#d0011b] text-[color:#fff] text-[size:12px] pl-2 pr-2 rounded-[3px] w-auto absolute top-0 left-0 z-10 transform-[translate(-50% -50%)]">
        {discval}
      </div>
    );
    strikePrice = (
      <div className="w-auto line-through text-[11px] text-[#a9a9a9]">
        {formatMoney(data.strike_price, data.currency)}
      </div>
    );
  }

  return (
    <Link
      href={`/product/${data.slug}`}
      className="max-w-[50%] flex flex-1/2 flex-col justify-center items-center gap-2 relative p-3 cursor-pointer border border-[color:#d4d4d426]"
    >
      <div className="relative w-auto overflow-visible">
        {discount}
        <img
          src={`https://esensi.online/${data.cover.replace(
            "_file/",
            "_img/"
          )}?w=200`}
          alt={data.name.replace("'", "").replace('"', "")}
          className="aspect-3/4 object-cover object-center rounded-[4px]"
        />
      </div>
      <h3 className="flex flex-1 text-[12px] text-center">{data.name}</h3>
      <div className="flex flex-row justify-between items-center w-full gap-3">
        {strikePrice}
        <div className="w-auto text-[color:#d0011b] font-bold">
          {formatMoney(data.real_price, data.currency)}
        </div>
      </div>
    </Link>
  );
}

function StoreBooks() {
  const book_data = [
    {
      name: "GTM No Worries! : Solusi Jitu Anak Doyan Makan Lagi",
      real_price: "49000",
      strike_price: "59000",
      currency: "Rp.",
      cover:
        "_file/upload/2025-3/11/1744361915917-rev cover ebook mpasi-gtm-03.jpg",
      slug: "gtm-no-worries-solusi-jitu-anak-doyan-makan-lagi",
    },
    {
      name: "MPASI Anti Drama : Bikin Makanan Pertama Buah Hati Jadi Seru!",
      real_price: "49000",
      strike_price: "59000",
      currency: "Rp.",
      cover:
        "_file/upload/2025-3/12/1744462103509-revisi-cover ebook mpasi-01-01-01.jpg",
      slug: "mpasi-anti-drama-bikin-makanan-pertama-buah-hati-jadi-seru",
    },
    {
      name: "Bermain sambil Belajar: Rahasia Mendidik Anak dengan Cara yang Seru",
      real_price: "39000",
      strike_price: "49000",
      currency: "Rp.",
      cover:
        "_file/upload/2025-1/10/1739167867345-2025 - cover ebook ramadhan-13.jpg",
      slug: "bermain-sambil-belajar-rahasia-mendidik-anak-dengan-cara-yang-seru",
    },
    {
      name: "Menyemai Akhlak Mulia: Rahasia Menanamkan Nilai Moral dan Agama Sejak Dini",
      real_price: "39000",
      strike_price: "49000",
      currency: "Rp.",
      cover:
        "_file/upload/2025-1/10/1739167765542-2025 - cover ebook ramadhan-02.jpg",
      slug: "menyemai-akhlak-mulia-rahasia-menanamkan-nilai-moral-dan-agama-sejak-dini",
    },
    {
      name: "Ramadhan Ceria Bersama Anak: 30 Aktivitas Kreatif Selama Bulan Suci",
      real_price: "39000",
      strike_price: "49000",
      currency: "Rp.",
      cover:
        "_file/upload/2025-1/10/1739167536994-2025 - cover ebook ramadhan-10.jpg",
      slug: "ramadhan-ceria-bersama-anak-30-aktivitas-kreatif-selama-bulan-suci",
    },
    {
      name: "Anti Bosan di Bulan Mulia: Ide Aktivitas Ramadhan Bersama Keluarga",
      real_price: "39000",
      strike_price: "49000",
      currency: "Rp.",
      cover:
        "_file/upload/2025-1/10/1739167154664-2025 - cover ebook ramadhan-06.jpg",
      slug: "anti-bosan-di-bulan-mulia-ide-aktivitas-ramadhan-bersama-keluarga",
    },
    {
      name: "Dongeng Anak Islami: Kumpulan Kisah Berkarakter Penuh Hikmah",
      real_price: "39000",
      strike_price: "49000",
      currency: "Rp.",
      cover:
        "_file/upload/2025-1/10/1739166601865-2025 - cover ebook ramadhan-09.jpg",
      slug: "dongeng-anak-islami-kumpulan-kisah-berkarakter-penuh-hikmah",
    },
    {
      name: "Cinta dalam Islam: Seni Merawat Fitrah Cinta dalam Keluarga",
      real_price: "39000",
      strike_price: "49000",
      currency: "Rp.",
      cover:
        "_file/upload/2025-1/10/1739166332740-2025 - cover ebook ramadhan-04.jpg",
      slug: "cinta-dalam-islam-seni-merawat-fitrah-cinta-dalam-keluarga",
    },
    {
      name: "Ngobrol Asyik dengan Anak: Kunci Membangun Komunikasi yang Efektif",
      real_price: "39000",
      strike_price: "49000",
      currency: "Rp.",
      cover:
        "_file/upload/2025-1/10/1739166124875-2025 - cover ebook ramadhan-12.jpg",
      slug: "ngobrol-asyik-dengan-anak-kunci-membangun-komunikasi-yang-efektif",
    },
    {
      name: "Fun and Faith: Cara Menyenangkan Kenalkan Ibadah pada Anak",
      real_price: "39000",
      strike_price: "49000",
      currency: "Rp.",
      cover:
        "_file/upload/2025-1/10/1739165691713-2025 - cover ebook ramadhan-11.jpg",
      slug: "fun-and-faith-cara-menyenangkan-kenalkan-ibadah-pada-anak",
    },
    {
      name: "Anak Hebat, Iman Kuat: Panduan Praktis Stimulasi Anak berdasarkan Nilai Keislaman",
      real_price: "39000",
      strike_price: "49000",
      currency: "Rp.",
      cover:
        "_file/upload/2025-1/10/1739165466259-2025 - cover ebook ramadhan-03.jpg",
      slug: "anak-hebat-iman-kuat-panduan-praktis-stimulasi-anak-berdasarkan-nilai-keislaman",
    },
    {
      name: "Belajar, Bermain, dan Berpahala: Aktivitas Islami untuk Tumbuh Kembang Anak",
      real_price: "39000",
      strike_price: "49000",
      currency: "Rp.",
      cover:
        "_file/upload/2025-1/10/1739165216561-2025 - cover ebook ramadhan-05.jpg",
      slug: "belajar-bermain-dan-berpahala-aktivitas-islami-untuk-tumbuh-kembang-anak",
    },
  ];

  const renderBooks = book_data.map((book, idx) => {
    return <BookCard data={book} key={`store_books_${idx}`} />;
  });
  return (
    <div className="flex flex-col justify-center items-start gap-5">
      <div className="flex flex-row justify-center items-stretch flex-wrap">
        {renderBooks}
      </div>
      <div className="flex justify-center items-center w-full">
        <Button variant="outline" asChild>
          <Link href="/all" className="w-full">
            Semua e-book <ArrowRight />
          </Link>
        </Button>
      </div>
    </div>
  );
}

function CategoryBooks({
  category = "",
  title = "",
  subtitle = "",
  max = 10,
  link = true,
}) {
  const [theTitle, setTheTitle] = useState(title);
  const [theSubtitle, setTheSubtitle] = useState(subtitle);
  const [theCategory, setTheCategory] = useState(category);
  const [theMax, setTheMax] = useState(max);
  const [showLink, setShowLink] = useState(link);

  const the_title =
    theTitle !== "" ? (
      <div className="flex flex-1 justify-start text-[14px]">{theTitle}</div>
    ) : (
      ""
    );
  const the_subtitle =
    theSubtitle !== "" ? (
      <div className="flex flex-1 justify-start text-[11px]">{theSubtitle}</div>
    ) : (
      ""
    );

  const link_button = showLink ? (
    <Button asChild variant="ghost">
      <Link
        href={`/category/${theCategory}`}
        className="flex h-full w-auto aspect-square justify-center items-center"
      >
        <ChevronRight size={48} strokeWidth={1.5} />
      </Link>
    </Button>
  ) : (
    ""
  );
  const heading = (
    <div className="flex flex-1 flex-row justify-between w-full h-12">
      <div className="flex flex-1 flex-col w-full h-full items-start justify-between">
        {the_title} {the_subtitle}
      </div>
      {link_button}
    </div>
  );

  const the_content = (
    <>
      isi kontennya buku buku banyak di dalam kategori ini. isi kontennya buku
      buku banyak di dalam kategori ini. isi kontennya buku buku banyak di dalam
      kategori ini. isi kontennya buku buku banyak di dalam kategori ini. isi
      kontennya buku buku banyak di dalam kategori ini. isi kontennya buku buku
      banyak di dalam kategori ini.{" "}
    </>
  );

  return (
    <div className="flex flex-1 flex-col w-full justify-stretch items-start gap-3 ">
      {heading}
      <div className="flex flex-1 flex-row flex-nowrap text-nowrap w-full h-auto justify-start items-start overflow-x-scroll">
        {the_content}
      </div>
    </div>
  );
}

export default () => {
  return (
    <div className="flex flex-1 flex-col gap-0 w-screen h-screen fixed p-0 m-0 overflow-hidden">
      <PageHeader back={false} />

      <div className="flex flex-1 min-h-0 pt-5 pb-5 justify-center items-start overflow-y-auto relative">
        <div className="max-w-3xl flex flex-col justify-center gap-10">
          <StoreBooks />
          <CategoryBooks
            category="parenting"
            title="Parenting"
            subtitle="Buku tentang parenting"
          />
          <CategoryBooks
            category="parenting"
            title="Parenting"
            subtitle="Buku tentang parenting"
          />
          <CategoryBooks
            category="parenting"
            title="Parenting"
            subtitle="Buku tentang parenting"
          />
        </div>
      </div>

      <PageFooter />
    </div>
  );
};
