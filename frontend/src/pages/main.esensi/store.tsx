import { PageHeader } from "@/components/esensi/page-header";
import { PageFooter } from "@/components/esensi/page-footer";
import { StoreCategories } from "@/components/esensi/store-categories";
import { StoreBooksCard } from "@/components/esensi/store-books-card";
import { FeaturedBooks } from "@/components/esensi/featured-books";
import { BooksByCategory } from "@/components/esensi/books-by-category";

export default () => {
  return (
    <div className="flex flex-1 flex-col gap-0 w-screen h-screen fixed p-0 m-0 overflow-hidden text-[color:#020817]">
      <PageHeader back={false} />
      <div className="flex flex-1 min-h-0 justify-center items-start overflow-y-auto relative">
        <div className="max-w-3xl w-full flex flex-col justify-center gap-10">
        <StoreCategories />
        <StoreBooksCard />
        <BooksByCategory category="parenting" title="Parenting" subtitle="Buku tentang parenting"/>
        <FeaturedBooks />
        <BooksByCategory category="parenting" title="Parenting" subtitle="Buku tentang parenting"/>
        <BooksByCategory category="parenting" title="Parenting" subtitle="Buku tentang parenting"/>
        </div>
      </div>
  <PageFooter/>
</div>
  );
};
