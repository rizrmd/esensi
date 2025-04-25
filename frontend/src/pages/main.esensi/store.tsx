import { Button } from "@/components/ui/button";
import { Link, navigate } from "@/lib/router";
import { ArrowRight, CircleEllipsis, CircleUserRound, Disc, House, LibraryBig, ShoppingBasket } from "lucide-react";



function PageHeader() {
  return (
    <div className="w-full h-auto">
      Header
    </div>
  );
}


function MenuButton({icon, label, url}) {
  return (
    <Button asChild variant="ghost">
      <Link href={url} className="flex flex-col gap-1 justify-center items-center h-full" >
        {icon}
        <span className="text-[size:10px] text-[color:#444]">{label}</span>
      </Link>
    </Button>
  );
}

function PageFooter(){
  const menus = [
    {label: "Home", url: "/store", icon: <House size={48} strokeWidth={1.5} /> },
    {label: "My Library", url: "/download/_", icon: <LibraryBig size={48} strokeWidth={1.5} /> },
    {label: "Cart", url: "/cart", icon: <ShoppingBasket size={48} strokeWidth={1.5} /> },
    {label: "Esensi", url: "/esensi", icon: <CircleEllipsis size={48} strokeWidth={1.5} /> },
    {label: "Profile", url: "/profile", icon: <CircleUserRound size={48} strokeWidth={1.5} /> },
  ];

  let menuButtons = menus.map(( btn, i ) => {
    return <>
      <MenuButton label={btn.label} url={btn.url} icon={btn.icon} key={i} />
    </>
  });
  return (
    <div className="flex flex-row justify-around items-center w-full pt-2 pb-2 h-[50px] border-t-[1px] border-t-[color:#D3d3d3]">
      {menuButtons}
    </div>
  );
}

function BookCard( {data} ){
  const curr = data.currency == "Rp" ? "IDR" : data.currency;
  let discount:any, strikePrice:any;
  if (data.strike_price !== null && data.strike_price !== "") {
    const discval = "-" + Math.round((data.strike_price - data.real_price) / data.strike_price * 100);
    discount = <div className="flex justify-center items-center bg-[#d0011b] text-[color:#fff] text-[size:12px] pl-2 pr-2 rounded-[3px] w-auto absolute top-0 left-0 z-10 transform-[translate(-50% -50%)]">{discval}</div>
    strikePrice = <div className="w-auto line-through text-[11px] text-[#a9a9a9]">{data.strike_price.toLocaleString("id-ID", {style:"currency",currency: curr}).replace(",00",",-")}</div>
  }

	return(
		<Link href={`/product/${data.slug}`} className="max-w-[50%] flex flex-1/2 flex-col justify-center items-center gap-2 relative p-3 cursor-pointer border border-[color:#d4d4d426]">
		<div className="relative w-auto overflow-visible">
		{discount}
		<img src={data.image} alt={data.title} className="aspect-3/4 object-cover object-center rounded-[4px]" />
		</div>
		<h3 className="text-[12px] text-center">{data.title}</h3>
		<div className="flex flex-row justify-between items-center">
			{strikePrice}
			<div className="w-auto text-[color:#d0011b] font-bold">{data.real_price.toLocaleString("id-ID", {style:"currency",currency: curr}).replace(",00",",-")}</div>
		</div>
		</Link>
	);
}

function StoreBooks() {
  return (

  <div className="flex flex-col justify-center items-start gap-5">
  <div className="flex flex-row justify-center items-start flex-wrap">
    <BookCard data={{title:"GTM No Worries! : Solusi Jitu Anak Doyan Makan Lagi",image:"https://esensi.online/_img/upload/2025-3/11/1744361915917-rev%20cover%20ebook%20mpasi-gtm-03.jpg?w=200",currency:"Rp",strike_price:59000,real_price:49000,slug:"gtm-no-worries-solusi-jitu-anak-doyan-makan-lagi"}} />
    <BookCard data={{title:"GTM No Worries! : Solusi Jitu Anak Doyan Makan Lagi",image:"https://esensi.online/_img/upload/2025-3/11/1744361915917-rev%20cover%20ebook%20mpasi-gtm-03.jpg?w=200",currency:"Rp",strike_price:null,real_price:49000,slug:"gtm-no-worries-solusi-jitu-anak-doyan-makan-lagi"}} />
    <BookCard data={{title:"GTM No Worries! : Solusi Jitu Anak Doyan Makan Lagi",image:"https://esensi.online/_img/upload/2025-3/11/1744361915917-rev%20cover%20ebook%20mpasi-gtm-03.jpg?w=200",currency:"Rp",strike_price:59000,real_price:49000,slug:"gtm-no-worries-solusi-jitu-anak-doyan-makan-lagi"}} />
    <BookCard data={{title:"GTM No Worries! : Solusi Jitu Anak Doyan Makan Lagi",image:"https://esensi.online/_img/upload/2025-3/11/1744361915917-rev%20cover%20ebook%20mpasi-gtm-03.jpg?w=200",currency:"Rp",strike_price:null,real_price:49000,slug:"gtm-no-worries-solusi-jitu-anak-doyan-makan-lagi"}} />
    <BookCard data={{title:"GTM No Worries! : Solusi Jitu Anak Doyan Makan Lagi",image:"https://esensi.online/_img/upload/2025-3/11/1744361915917-rev%20cover%20ebook%20mpasi-gtm-03.jpg?w=200",currency:"Rp",strike_price:59000,real_price:49000,slug:"gtm-no-worries-solusi-jitu-anak-doyan-makan-lagi"}} />
    <BookCard data={{title:"GTM No Worries! : Solusi Jitu Anak Doyan Makan Lagi",image:"https://esensi.online/_img/upload/2025-3/11/1744361915917-rev%20cover%20ebook%20mpasi-gtm-03.jpg?w=200",currency:"Rp",strike_price:null,real_price:49000,slug:"gtm-no-worries-solusi-jitu-anak-doyan-makan-lagi"}} />
    <BookCard data={{title:"GTM No Worries! : Solusi Jitu Anak Doyan Makan Lagi",image:"https://esensi.online/_img/upload/2025-3/11/1744361915917-rev%20cover%20ebook%20mpasi-gtm-03.jpg?w=200",currency:"Rp",strike_price:59000,real_price:49000,slug:"gtm-no-worries-solusi-jitu-anak-doyan-makan-lagi"}} />
    <BookCard data={{title:"GTM No Worries! : Solusi Jitu Anak Doyan Makan Lagi",image:"https://esensi.online/_img/upload/2025-3/11/1744361915917-rev%20cover%20ebook%20mpasi-gtm-03.jpg?w=200",currency:"Rp",strike_price:null,real_price:49000,slug:"gtm-no-worries-solusi-jitu-anak-doyan-makan-lagi"}} />
    <BookCard data={{title:"GTM No Worries! : Solusi Jitu Anak Doyan Makan Lagi",image:"https://esensi.online/_img/upload/2025-3/11/1744361915917-rev%20cover%20ebook%20mpasi-gtm-03.jpg?w=200",currency:"Rp",strike_price:59000,real_price:49000,slug:"gtm-no-worries-solusi-jitu-anak-doyan-makan-lagi"}} />
    <BookCard data={{title:"GTM No Worries! : Solusi Jitu Anak Doyan Makan Lagi",image:"https://esensi.online/_img/upload/2025-3/11/1744361915917-rev%20cover%20ebook%20mpasi-gtm-03.jpg?w=200",currency:"Rp",strike_price:null,real_price:49000,slug:"gtm-no-worries-solusi-jitu-anak-doyan-makan-lagi"}} />
    <BookCard data={{title:"GTM No Worries! : Solusi Jitu Anak Doyan Makan Lagi",image:"https://esensi.online/_img/upload/2025-3/11/1744361915917-rev%20cover%20ebook%20mpasi-gtm-03.jpg?w=200",currency:"Rp",strike_price:59000,real_price:49000,slug:"gtm-no-worries-solusi-jitu-anak-doyan-makan-lagi"}} />
    <BookCard data={{title:"GTM No Worries! : Solusi Jitu Anak Doyan Makan Lagi",image:"https://esensi.online/_img/upload/2025-3/11/1744361915917-rev%20cover%20ebook%20mpasi-gtm-03.jpg?w=200",currency:"Rp",strike_price:null,real_price:49000,slug:"gtm-no-worries-solusi-jitu-anak-doyan-makan-lagi"}} />
  </div>
  <div className="flex justify-center items-center w-full">
    <Button variant="outline">Semua e-book <ArrowRight /></Button>
  </div>
  </div>
  );
}

export default () => {
  return (
    <div className="flex flex-1 flex-col gap-0 w-screen h-screen fixed p-0 m-0 overflow-hidden">
      <PageHeader/>

    <div className="flex flex-1 min-h-0 pt-5 pb-5 justify-center items-start overflow-y-auto relative">
      <div className="max-w-3xl flex flex-col justify-center">
      <StoreBooks/>
      </div>
    </div>

  <PageFooter/>
</div>
  );
};
