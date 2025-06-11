import { BookCardLoading } from "./book-card-loading";
import { BookCard } from "./book-card";
import { CircleArrowLeft, CircleArrowRight } from "lucide-react";

export const StoreFeaturedProducts = ({loading, data, action, offset, animated}) => {

    const renderLoading = Array.from({ length: 5 }, (_, idx) => {
        return <BookCardLoading key={`store_featured_books_loading_${idx}`} />;
      });
    const css = {
        lg: {
            wrapper: 1140,
            gap: 20,
            width: 200,
        },
        xl: {
            wrapper: 1140,
            gap: 20,
            width: 200,
        },
    };

    alert(offset);
    
    const bookslen = data.length;
    const bookdumm = data.concat(data, data);
    const renderBooks = bookdumm.map((book, idx) => {
        return <BookCard data={book} key={`esensi_featured_item_${idx}`}/>
    });

    return (
        <div className="flex justify-between w-full relative">
            <div className="flex justify-center items-center w-auto">
                <button className="bg-transparent border-none cursor-pointer p-none m-none w-auto h-auto" onClick={(e)=>{
                    e.preventDefault();
                    action(-1);
                }}>
                <CircleArrowLeft size={40} strokeWidth={1.5} />
                </button>
            </div>
            <div className={`flex gap-6 relative overflow-x-hidden lg:[--featwwidth:${css.lg.wrapper}px] lg:[--featwgap:${css.lg.gap}px] xl:[--featwwidth:${css.xl.wrapper}px] xl:[--featwgap:${css.xl.gap}px] w-(--featwwidth) gap-(--featwgap)`}>
                <div className={`w-auto flex lg:[--featgap:${css.lg.gap}px] lg:[--featw:${css.lg.width}px] xl:[--featgap:${css.xl.gap}px] xl:[--featw:${css.xl.width}px] gap-(--featgap) [&>a,&>div]:w-(--featw) ${animated ? "transition-all" : ""} relative ml-[calc(100px*${offset}*-1)]`}>
                    {loading? renderLoading : renderBooks }
                </div>
            </div>
            <div className="flex justify-center items-center w-auto">
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