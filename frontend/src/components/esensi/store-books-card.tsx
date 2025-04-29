import { Link } from "@/lib/router";
import { Button } from "../ui/button";
import { BookCard } from "./book-card";
import { ArrowRight } from "lucide-react";

export const StoreBooksCard = () => {
  const book_data = [
    {
      "name": "GTM No Worries! : Solusi Jitu Anak Doyan Makan Lagi",
      "real_price": "49000",
      "strike_price": "59000",
      "currency": "Rp.",
      "cover": "_file/upload/2025-3/11/1744361915917-rev cover ebook mpasi-gtm-03.jpg",
      "slug": "gtm-no-worries-solusi-jitu-anak-doyan-makan-lagi"
    },
    {
      "name": "MPASI Anti Drama : Bikin Makanan Pertama Buah Hati Jadi Seru!",
      "real_price": "49000",
      "strike_price": "59000",
      "currency": "Rp.",
      "cover": "_file/upload/2025-3/12/1744462103509-revisi-cover ebook mpasi-01-01-01.jpg",
      "slug": "mpasi-anti-drama-bikin-makanan-pertama-buah-hati-jadi-seru"
    },
    {
      "name": "Bermain sambil Belajar: Rahasia Mendidik Anak dengan Cara yang Seru",
      "real_price": "39000",
      "strike_price": "49000",
      "currency": "Rp.",
      "cover": "_file/upload/2025-1/10/1739167867345-2025 - cover ebook ramadhan-13.jpg",
      "slug": "bermain-sambil-belajar-rahasia-mendidik-anak-dengan-cara-yang-seru"
    },
    {
      "name": "Menyemai Akhlak Mulia: Rahasia Menanamkan Nilai Moral dan Agama Sejak Dini",
      "real_price": "39000",
      "strike_price": "49000",
      "currency": "Rp.",
      "cover": "_file/upload/2025-1/10/1739167765542-2025 - cover ebook ramadhan-02.jpg",
      "slug": "menyemai-akhlak-mulia-rahasia-menanamkan-nilai-moral-dan-agama-sejak-dini"
    },
    {
      "name": "Ramadhan Ceria Bersama Anak: 30 Aktivitas Kreatif Selama Bulan Suci",
      "real_price": "39000",
      "strike_price": "49000",
      "currency": "Rp.",
      "cover": "_file/upload/2025-1/10/1739167536994-2025 - cover ebook ramadhan-10.jpg",
      "slug": "ramadhan-ceria-bersama-anak-30-aktivitas-kreatif-selama-bulan-suci"
    },
    {
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
    {
      "name": "Ngobrol Asyik dengan Anak: Kunci Membangun Komunikasi yang Efektif",
      "real_price": "39000",
      "strike_price": "49000",
      "currency": "Rp.",
      "cover": "_file/upload/2025-1/10/1739166124875-2025 - cover ebook ramadhan-12.jpg",
      "slug": "ngobrol-asyik-dengan-anak-kunci-membangun-komunikasi-yang-efektif"
    },
    {
      "name": "Fun and Faith: Cara Menyenangkan Kenalkan Ibadah pada Anak",
      "real_price": "39000",
      "strike_price": "49000",
      "currency": "Rp.",
      "cover": "_file/upload/2025-1/10/1739165691713-2025 - cover ebook ramadhan-11.jpg",
      "slug": "fun-and-faith-cara-menyenangkan-kenalkan-ibadah-pada-anak"
    },
    {
      "name": "Anak Hebat, Iman Kuat: Panduan Praktis Stimulasi Anak berdasarkan Nilai Keislaman",
      "real_price": "39000",
      "strike_price": "49000",
      "currency": "Rp.",
      "cover": "_file/upload/2025-1/10/1739165466259-2025 - cover ebook ramadhan-03.jpg",
      "slug": "anak-hebat-iman-kuat-panduan-praktis-stimulasi-anak-berdasarkan-nilai-keislaman"
    },
    {
      "name": "Belajar, Bermain, dan Berpahala: Aktivitas Islami untuk Tumbuh Kembang Anak",
      "real_price": "39000",
      "strike_price": "49000",
      "currency": "Rp.",
      "cover": "_file/upload/2025-1/10/1739165216561-2025 - cover ebook ramadhan-05.jpg",
      "slug": "belajar-bermain-dan-berpahala-aktivitas-islami-untuk-tumbuh-kembang-anak"
    }
  ];

  const renderBooks = book_data.map( ( book, idx ) => {
    return <BookCard data={book} key={`store_books_${idx}`} />;
  });
  return (
  <div className="flex flex-col justify-center items-start gap-5">
  <div className="flex flex-row justify-center items-stretch flex-wrap">
    {renderBooks}
  </div>
  <div className="flex justify-center items-center w-full">
    <Button variant="outline" asChild><Link href="/all" className="w-full">Semua e-book <ArrowRight /></Link></Button>
  </div>
  </div>
  );
}
