import { Link } from "@/lib/router";
import { ChevronRight } from "lucide-react";
import { useState } from "react";
import { Button } from "../ui/button";
import { BookCardAlt } from "./book-card-alt";

export const BooksByCategory = ({
  category = "",
  title = "",
  subtitle = "",
  max = 10,
  link = true,
}) => {
  const [theTitle, setTheTitle] = useState(title);
  const [theSubtitle, setTheSubtitle] = useState(subtitle);
  const [theCategory, setTheCategory] = useState(category);
  const [theMax, setTheMax] = useState(max);
  const [showLink, setShowLink] = useState(link);

  const the_title =
    theTitle !== "" ? (
      <div className="flex flex-1 justify-start text-sm md:text-lg">
        {theTitle}
      </div>
    ) : (
      ""
    );
  const the_subtitle =
    theSubtitle !== "" ? (
      <div className="flex flex-1 justify-start text-[11px] md:text-sm text-[color:#555]">
        {theSubtitle}
      </div>
    ) : (
      ""
    );

  const link_button = showLink ? (
    <Button asChild variant="ghost" className="h-full w-auto aspect-square">
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

  // Fetch book data by slug, misal hasilnya dummy ini
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

  const book_empty = <>Tidak ada buku</>;

  const the_content =
    book_data.length > 0
      ? book_data.map((book, idx) => {
          return (
            <BookCardAlt
              data={book}
              key={`home_categories_books_${theCategory}_${idx}`}
            />
          );
        })
      : book_empty;

  return (
    <div className="flex flex-col w-full justify-stretch items-start gap-3 md:gap-5 px-5">
      {heading}
      <div className="flex w-full overflow-x-auto items-start pb-1 lg:pb-2.5">
        <div className="flex flex-nowrap flex-row items-stretch gap-5 max-w-max h-max text-nowrap">
          {the_content}
        </div>
      </div>
    </div>
  );
};
