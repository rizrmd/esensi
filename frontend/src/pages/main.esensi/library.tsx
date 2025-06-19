import { BookCardLibrary } from "@/components/esensi/book-card-library";
import { MainEsensiLayout } from "@/components/esensi/layout";
import type { BooksCardType } from "@/components/esensi/layout-book-list";
import { PaginationNumber } from "@/components/esensi/pagination";
import { useLocal } from "@/lib/hooks/use-local";

export default () => {
  const header_config = {
    enable: true,
    logo: false,
    back: true,
    search: true,
    title: "Koleksi",
  };

  const local = useLocal(
    {
      loading: true as boolean,
      list: [
        {
          last_page: 5,
          percent: 13,
          name: "Porsi Asuh Anak: Bagaimana Peran Pengasuh Membentuk Anak",
          cover:
            "_file/upload/2024-9/21/1729517886894-a403e518-08cc-413a-ad7f-6b02ba140840.webp",
          slug: "porsi-asuh-anak-bagaimana-peran-pengasuh-membentuk-anak",
        },
        {
          last_page: 5,
          percent: 16,
          name: "Break Free: 10 Power Moves untuk Menumbangkan Depresi",
          cover:
            "_file/upload/2024-11/13/1734131887278-de8bb918-9b05-497c-97d4-f7c0ae62f952.jpg",
          slug: "break-free-10-power-moves-untuk-menumbangkan-depresi",
        },
        {
          last_page: 5,
          percent: 34,
          name: "Relationship NLP: Alat Keren Untuk Pahami Pasangan Lebih Baik",
          cover:
            "_file/upload/2024-11/17/1734422523006-relationship nlp alat keren untuk pahami pasangan lebih baik revisi (1).jpg",
          slug: "relationship-nlp-alat-keren-untuk-pahami-pasangan-lebih-baik",
        },
        {
          last_page: 5,
          percent: 53,
          name: "Super Solid Family: 30 Aktivitas yang Bikin Keluarga Makin Kompak",
          cover:
            "_file/upload/2024-11/16/1734321981778-super solid family 30 aktivitas yang bikin keluarga makin kompak2.jpg",
          slug: "super-solid-family-30-aktivitas-yang-bikin-keluarga-makin-kompak",
        },
        {
          last_page: 5,
          percent: 69,
          name: "NLP Parenting Hacks: Trik Jitu Bikin Anak Lebih Paham dan Patuh",
          cover:
            "_file/upload/2024-11/17/1734423706479-nlp parenting hacks trik jitu bikin anak lebih paham dan patuh (1).jpg",
          slug: "nlp-parenting-hacks-trik-jitu-bikin-anak-lebih-paham-dan-patuh",
        },
        {
          last_page: 5,
          percent: 11,
          name: "Happy Family, Bukan Mimpi! 28 Hari Merawat Kesehatan Mental Keluarga",
          cover:
            "_file/upload/2024-11/16/1734322615988-happy family, bukan mimpi! 28 hari merawat kesehatan mental keluarga4-min.jpg",
          slug: "happy-family-bukan-mimpi-28-hari-merawat-kesehatan-mental-keluarga",
        },
        {
          last_page: 5,
          percent: 84,
          name: "NLP Remaja: Senjata Rahasia Orang Tua Biar Anak Gak Cuma Dengar, Tapi Ngerti!",
          cover:
            "_file/upload/2024-11/17/1734423242694-nlp remaja senjata rahasia orang tua biar anak gak cuma dengar, tapi ngerti! (1)-min.jpg",
          slug: "nlp-remaja-senjata-rahasia-orang-tua-biar-anak-gak-cuma-dengar-tapi-ngerti",
        },
        {
          last_page: 5,
          percent: 61,
          name: "Menyemai Akhlak Mulia: Rahasia Menanamkan Nilai Moral dan Agama Sejak Dini",
          cover:
            "_file/upload/2025-1/10/1739167765542-2025 - cover ebook ramadhan-02.jpg",
          slug: "menyemai-akhlak-mulia-rahasia-menanamkan-nilai-moral-dan-agama-sejak-dini",
        },
        {
          last_page: 5,
          percent: 54,
          name: "Parenting dalam Islam: Mengasuh Anak dengan Cinta dan Doa",
          cover:
            "_file/upload/2025-1/10/1739163634883-2025 - cover ebook ramadhan-07.jpg",
          slug: "6-parenting-dalam-islam-mengasuh-anak-dengan-cinta-dan-doa",
        },
        {
          last_page: 5,
          percent: 45,
          name: "Fun and Faith: Cara Menyenangkan Kenalkan Ibadah pada Anak",
          cover:
            "_file/upload/2025-1/10/1739165691713-2025 - cover ebook ramadhan-11.jpg",
          slug: "fun-and-faith-cara-menyenangkan-kenalkan-ibadah-pada-anak",
        },
        {
          last_page: 5,
          percent: 6,
          name: "Rumahku, Surgaku: Bangun Pondasi Keluarga Bahagia Dunia dan Akhirat",
          cover:
            "_file/upload/2025-1/10/1739164234972-2025 - cover ebook ramadhan-01.jpg",
          slug: "rumahku-surgaku-bangun-pondasi-keluarga-bahagia-dunia-dan-akhirat",
        },
        {
          last_page: 5,
          percent: 39,
          name: "20 Langkah Bikin Anak Tangguh: Rahasia Orang Tua Membangun Mental Baja",
          cover:
            "_file/upload/2024-11/16/1734323970040-20 langkah bikin anak tangguh rahasia orang tua membangun mental baja4.jpg",
          slug: "20-langkah-bikin-anak-tangguh-rahasia-orang-tua-membangun-mental-baja",
        },
        {
          last_page: 5,
          percent: 72,
          name: "Cinta dalam Islam: Seni Merawat Fitrah Cinta dalam Keluarga",
          cover:
            "_file/upload/2025-1/10/1739166332740-2025 - cover ebook ramadhan-04.jpg",
          slug: "cinta-dalam-islam-seni-merawat-fitrah-cinta-dalam-keluarga",
        },
        {
          last_page: 5,
          percent: 9,
          name: "Dongeng Anak Islami: Kumpulan Kisah Berkarakter Penuh Hikmah",
          cover:
            "_file/upload/2025-1/10/1739166601865-2025 - cover ebook ramadhan-09.jpg",
          slug: "dongeng-anak-islami-kumpulan-kisah-berkarakter-penuh-hikmah",
        },
        {
          last_page: 5,
          percent: 68,
          name: "Ngobrol Asyik dengan Anak: Kunci Membangun Komunikasi yang Efektif",
          cover:
            "_file/upload/2025-1/10/1739166124875-2025 - cover ebook ramadhan-12.jpg",
          slug: "ngobrol-asyik-dengan-anak-kunci-membangun-komunikasi-yang-efektif",
        },
        {
          last_page: 5,
          percent: 21,
          name: "Happy Holy Family: Tips Menghidupkan Nilai Islami dalam Keluarga",
          cover:
            "_file/upload/2025-1/10/1739164926773-2025 - cover ebook ramadhan-14.jpg",
          slug: "happy-holy-family-tips-menghidupkan-nilai-islami-dalam-keluarga",
        },
        {
          last_page: 5,
          percent: 30,
          name: "Anak Hebat, Iman Kuat: Panduan Praktis Stimulasi Anak berdasarkan Nilai Keislaman",
          cover:
            "_file/upload/2025-1/10/1739165466259-2025 - cover ebook ramadhan-03.jpg",
          slug: "anak-hebat-iman-kuat-panduan-praktis-stimulasi-anak-berdasarkan-nilai-keislaman",
        },
        {
          last_page: 5,
          percent: 52,
          name: "Keajaiban Jalur Langit: Kumpulan Doa dan Amalan untuk Keluarga",
          cover:
            "_file/upload/2025-1/10/1739164601017-2025 - cover ebook ramadhan-08.jpg",
          slug: "keajaiban-jalur-langit-kumpulan-doa-dan-amalan-untuk-keluarga",
        },
        {
          last_page: 5,
          percent: 78,
          name: "Bundling Kiat Marah",
          cover:
            "_file/upload/2025-2/6/1741247025059-kiat marah +sosio emosional (5).png",
          slug: "bundling-kiat-marah",
        },
      ] as any[],
      page: 1 as number,
      total_pages: 1 as number,
    },
    async () => {
      local.loading = false;
      local.render();
    }
  );

  const renderLoading = <></>;

  const renderList = local.list.map((item, idx) => {
    return (
      <BookCardLibrary
        data={item}
        key={`esensi_readbook_${idx}`}
      ></BookCardLibrary>
    );
  });
  const renderContent = <div className="flex w-full flex-col gap-6">{renderList}</div>;
  const renderPagination = (
    <div className="flex w-full justify-center items-center mt-6 lg:mt-12">
      <PaginationNumber items_per_page={5} current={3} total_pages={13} url={"/library"} />
    </div>
  );
  const renderRecommendation = <></>;
  return (
    <MainEsensiLayout header_config={header_config} mobile_menu={true}>
      <div className="flex justify-center p-6 lg:py-10 lg:px-0">
        <div className="flex flex-col gap-6 w-full h-full max-w-[1200px] h-auto">
          {local.loading ? renderLoading : renderContent}
          {local.loading ? renderLoading : renderPagination}
          {local.loading ? renderLoading : renderRecommendation}
        </div>
      </div>
    </MainEsensiLayout>
  );
};
