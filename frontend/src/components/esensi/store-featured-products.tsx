import { BookCardLoading } from "./book-card-loading";
import { BookCard } from "./book-card";
import { CircleArrowLeft, CircleArrowRight } from "lucide-react";

export const StoreFeaturedProducts = ({loading, data, action, offset, animated}) => {

    const renderLoading = Array.from({ length: 5 }, (_, idx) => {
        return <BookCardLoading key={`store_featured_books_loading_${idx}`} />;
      });

    
    const bookslen = data.length;
    const bookdumm = data.concat(data, data);
    const renderBooks = bookdumm.map((book, idx) => {
        return <BookCard data={book} key={`esensi_featured_item_${idx}`}/>
    });

    return (
        <div className="flex justify-between w-full relative">
            <div className="hidden justify-center items-center w-auto">
                <button className="bg-transparent border-none cursor-pointer p-none m-none w-auto h-auto" onClick={(e)=>{
                    e.preventDefault();
                    action(-1);
                }}>
                <CircleArrowLeft size={40} strokeWidth={1.5} />
                </button>
            </div>
            <div className={`flex gap-6 relative overflow-x-auto`}>
                <div className={`w-auto flex [&>a,&>div]:w-[230px] ${animated ? "transition-all" : ""} relative`}>
                    {loading? renderLoading : renderBooks }
                </div>
            </div>
            <div className="hidden justify-center items-center w-auto">
                <button className="bg-transparent border-none cursor-pointer p-none m-none w-auto h-auto" onClick={(e)=>{
                    e.preventDefault();
                    action(1);
                }}>
                <CircleArrowRight size={40} strokeWidth={1.5} />
                </button>
            </div>
            
        </div>
    );
};