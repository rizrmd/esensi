import { Link } from "@/lib/router"
import { Button } from "../ui/button"
import { formatMoney } from "./format-money"

export const FeaturedBooks = () => {

  const featured = [
    {
      "name": "GTM No Worries! : Solusi Jitu Anak Doyan Makan Lagi",
      "real_price": "49000",
      "strike_price": "59000",
      "currency": "Rp.",
      "cover": "_file/upload/2025-3/11/1744361915917-rev cover ebook mpasi-gtm-03.jpg",
      "slug": "gtm-no-worries-solusi-jitu-anak-doyan-makan-lagi",
      "desc": "Penawaran bundling promo dari Bumi dan Anak Indonesia. Parenting Bundling Bumi dan Anak Indonesia, paket hemat ebook parenting dan mengenalkan montessori kepada...",
      "bundle_product": [{
        "name": "Anti Bosan di Bulan Mulia: Ide Aktivitas Ramadhan Bersama Keluarga",
        "real_price": "39000",
        "strike_price": "49000",
        "currency": "Rp.",
        "cover": "_file/upload/2025-1/10/1739167154664-2025 - cover ebook ramadhan-06.jpg",
        "slug": "anti-bosan-di-bulan-mulia-ide-aktivitas-ramadhan-bersama-keluarga"
      },
      {
        "name": "Dongeng Anak Islami: Kumpulan Kisah Berkarakter Penuh Hikmah",
        "real_price": "39000",
        "strike_price": "49000",
        "currency": "Rp.",
        "cover": "_file/upload/2025-1/10/1739166601865-2025 - cover ebook ramadhan-09.jpg",
        "slug": "dongeng-anak-islami-kumpulan-kisah-berkarakter-penuh-hikmah"
      },
      {
        "name": "Cinta dalam Islam: Seni Merawat Fitrah Cinta dalam Keluarga",
        "real_price": "39000",
        "strike_price": "49000",
        "currency": "Rp.",
        "cover": "_file/upload/2025-1/10/1739166332740-2025 - cover ebook ramadhan-04.jpg",
        "slug": "cinta-dalam-islam-seni-merawat-fitrah-cinta-dalam-keluarga"
      },
      ],
    },
    {
      "name": "MPASI Anti Drama : Bikin Makanan Pertama Buah Hati Jadi Seru!",
      "real_price": "49000",
      "strike_price": "59000",
      "currency": "Rp.",
      "cover": "_file/upload/2025-3/12/1744462103509-revisi-cover ebook mpasi-01-01-01.jpg",
      "slug": "mpasi-anti-drama-bikin-makanan-pertama-buah-hati-jadi-seru",
      "desc": "Penawaran bundling promo dari Bumi dan Anak Indonesia. Parenting Bundling Bumi dan Anak Indonesia, paket hemat ebook parenting dan mengenalkan montessori kepada...",
      "bundle_product": [{
        "name": "Anti Bosan di Bulan Mulia: Ide Aktivitas Ramadhan Bersama Keluarga",
        "real_price": "39000",
        "strike_price": "49000",
        "currency": "Rp.",
        "cover": "_file/upload/2025-1/10/1739167154664-2025 - cover ebook ramadhan-06.jpg",
        "slug": "anti-bosan-di-bulan-mulia-ide-aktivitas-ramadhan-bersama-keluarga"
      },
      {
        "name": "Dongeng Anak Islami: Kumpulan Kisah Berkarakter Penuh Hikmah",
        "real_price": "39000",
        "strike_price": "49000",
        "currency": "Rp.",
        "cover": "_file/upload/2025-1/10/1739166601865-2025 - cover ebook ramadhan-09.jpg",
        "slug": "dongeng-anak-islami-kumpulan-kisah-berkarakter-penuh-hikmah"
      },
      {
        "name": "Cinta dalam Islam: Seni Merawat Fitrah Cinta dalam Keluarga",
        "real_price": "39000",
        "strike_price": "49000",
        "currency": "Rp.",
        "cover": "_file/upload/2025-1/10/1739166332740-2025 - cover ebook ramadhan-04.jpg",
        "slug": "cinta-dalam-islam-seni-merawat-fitrah-cinta-dalam-keluarga"
      },
      ],
    },
  ];

  const content_empty = <div>Kosong</div>
  const content = featured.length > 0 ? featured.map((book,idx)=>{
    const bundles_empty = <div></div>
    const bundles = book.bundle_product.length > 0 ? book.bundle_product.map((b, i )=>{
      return (<>
        <img src={`https://esensi.online/${b.cover.replace("_file/", "_img/")}?w=65`} alt={`${b.name.replace("'", "").replace('"', '')}`} className="aspect-[3/4] rounded-sm" />
      </>);
    }) : {bundles_empty}

    let discval:any, disc_text:string, discount:any, strikePrice:any, strikePriceDiv: any;
    if (book.strike_price !== null && book.strike_price !== "" && book.strike_price > book.real_price) {
      discval = Math.round((book.strike_price - book.real_price) / book.strike_price * 100);
      disc_text = "-" + discval + "%";
      discount = <div className="flex justify-center items-center bg-[#feeeea] text-[color:#d0011b] text-[size:12px] leading-0 px-2 py-3 font-bold rounded-[3px] w-auto">{disc_text}</div>
      strikePrice = <div className="w-full line-through text-[12px] text-[#ccc]">{formatMoney(book.strike_price, book.currency)}</div>
      strikePriceDiv = <div className="flex items-center gap-3">{discount} {strikePrice}</div>
    }

    const price_and_bundles = <div className="flex justify-center items-stretch w-full gap-1">
      <div className="flex flex-col justify-center items-start w-auto gap-2 p-3 border-[1px] border-[color:#4d5094] rounded-lg">
        {strikePriceDiv}
        <div className="flex w-full justify-center text-[color:#d0011b] text-xl font-bold">{formatMoney(book.real_price, book.currency)}</div>
      </div>
      <div className="flex lg:flex-1 w-auto items-stretch gap-2">{bundles}</div>
    </div>

    return (
      <div className="flex flex-col justify-stretch items-center gap-5" key={`esensi_featured_${idx}`}>
        <div className="flex flex-row w-full gap-4">
          <div className="flex items-start">
            <img src={`https://esensi.online/${book.cover.replace("_file/","_img/")}?w=200`} alt={`${book.name.replace("'","").replace('"','')}`} className="aspect-3/4 max-w-36 object-cover object-center rounded-[4px]" />
          </div>
          <div className="flex flex-col flex-1 items-start gap-2">
            <h3 className="font-bold">{book.name}</h3>
            <p className="text-sm">{book.desc}</p>
            {window.innerWidth >= 768 ? price_and_bundles:''}
          </div>
        </div>
        {window.innerWidth < 768 ? price_and_bundles:''}
      </div>
    );
  }) : { content_empty }

  return (
    <div className="flex bg-[#4d5094] p-5">
      <div className="flex flex-col justify-start items-center gap-8 bg-white p-5 rounded-lg">
        <div className="text-[14px] text-[color:#4d5094] font-bold">★ PROMO BUNDLING ★</div>
        <div className="flex flex-col gap-9">{content}</div>
        <Button asChild className="bg-[#fada54]">
          <Link href="/bundle">
            Lihat bundle hemat lainnya
        </Link>
        </Button>
      </div>
    </div>
  );
}
