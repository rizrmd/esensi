import { BookmarkCheck, BookmarkPlus, BookmarkX, ShoppingBag } from "lucide-react";
import { Button } from "../ui/button";
import { useLocal } from "@/lib/hooks/use-local";

export const ProductBuyButtons = ({
    productId = null as string | null,
    bundleId = null as string | null,
    actionBookmark = null as any | null,
    actionCart = null as any | null,
    isOwned = false as boolean,
    isBookmarked = true as boolean,
    isInCart = false as boolean,
}) => {


    const local =useLocal({
      isBookmarkHover: false as boolean,
    }, async ()=>{


    });

    const buttonBuy = (
      <>
        <Button className="flex grow-1 items-center h-full bg-[#C6011B] hover:bg-[#3B2C93] text-white">
          <ShoppingBag size={20} strokeWidth={1.5} />
          <span>Masukkan Keranjang</span>
        </Button>
      </>
    );

    const handleBookmarkHover = (e:any) =>{
      local.isBookmarkHover = true;
      local.render();
    }
    const handleBookmarkHoverNot = (e:any) =>{
      local.isBookmarkHover = false;
      local.render();
    }
    const buttonBookmark = (<Button variant="link" className={`flex aspect-1/1 items-center h-full w-auto text-lg has-[>svg]:px-0 has-[>svg]:py-0 [&,&>svg]:transition-all ${isBookmarked ? "bg-[#16a085] text-white hover:bg-[#D4D8F7] hover:text-[#C6011B]" :"text-[#3B2C93] bg-[#D4D8F7] hover:text-white hover:bg-[#3B2C93]"}`} onMouseOver={handleBookmarkHover} onMouseLeave={handleBookmarkHoverNot}>
          {isBookmarked ? (local.isBookmarkHover ? <BookmarkX className="size-7" strokeWidth={1.5} /> : <BookmarkCheck className="size-7" strokeWidth={1.5} />) : (<BookmarkPlus className="size-7" strokeWidth={1.5} />)}
        </Button>);
    const buttonDownload = <>Download</>;
    const buttonRead = <>baca</>;

    const buttonOwned = (
        <>
        {buttonRead}
        {buttonDownload}
        </>
    );

    return (
        <div className="flex justify-between items-center gap-3 fixed lg:relative p-3 lg:p-0 lg:order-5 bg-white left-0 bottom-0 lg:left-none lg:bottom-none w-full h-17 lg:h-10 lg:mt-5 z-51">
        {isOwned ? buttonOwned : buttonBuy}
        {!isOwned && buttonBookmark}
      </div>
    );

}