import { BookMarked, BookOpenText, Languages } from "lucide-react";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { formatMoney } from "./format-money";
import { ImgThumb } from "./img-thumb";

export const BookDetail = ({ loading, data }) => {
    let book, info, pricing, description;
    if (loading) {
        book = <div>Loading...</div>
    } else {
        book = (
            <div className="flex flex-col md:flex-row gap-8">
                <div className="w-full md:w-[300px] flex-shrink-0">
                    <ImgThumb src={data.cover} alt={data?.name} className="w-full h-auto rounded-lg shadow-lg"/>
                </div>
                <div className="flex flex-col gap-4 flex-grow">
                    <div>
                        <Badge variant="secondary" className="mb-2">{data.category || 'Umum'}</Badge>
                        <h1 className="text-3xl font-semibold mb-2">{data.name}</h1>
                        <p className="text-lg text-muted-foreground">Oleh: {data.author}</p>
                    </div>

                    <div className="grid grid-cols-3 gap-4 py-4 border-y">
                        <div className="text-center">
                            <p className="text-sm text-muted-foreground mb-1">Format</p>
                            <p className="font-medium">E-Book</p>
                        </div>
                        <div className="text-center">
                            <p className="text-sm text-muted-foreground mb-1">Halaman</p>
                            <p className="font-medium">{data.pages || '-'}</p>
                        </div>
                        <div className="text-center">
                            <p className="text-sm text-muted-foreground mb-1">Bahasa</p>
                            <p className="font-medium">{data.language || 'Indonesia'}</p>
                        </div>
                    </div>


                </div>
            </div>
        );

        info = (
            <div className="flex flex-nowrap justify-between gap-4 py-6 my-6 border-y">
                <div className="flex flex-col items-center gap-2">
                    <BookOpenText className="w-6 h-6 text-muted-foreground" />
                    <span className="text-sm text-center">Format Digital</span>
                </div>
                <div className="flex flex-col items-center gap-2">
                    <BookMarked className="w-6 h-6 text-muted-foreground" />
                    <span className="text-sm text-center">Akses Selamanya</span>
                </div>
                <div className="flex flex-col items-center gap-2">
                    <Languages className="w-6 h-6 text-muted-foreground" />
                    <span className="text-sm text-center">Bahasa Indonesia</span>
                </div>
            </div>
        );


        pricing = (
            <div className="mt-4">
                <div className="flex items-center justify-between items-center mb-4">
                    <div className="flex flex-col justify-start items-center gap-2">
                        {data.strike_price && (
                            <p className="flex justify-between w-full">
                                <span className="text-sm text-muted-foreground line-through">{`${formatMoney(data.strike_price, data.currency)}`}</span>
                                <span>{`${Math.round(
        ((data.strike_price - data.real_price) / data.strike_price) * 100,
      )}%`}</span>
                            </p>
                        )}
                        <p className="text-lg font-bold text-[30px] text-[#d0011b]">
                            {`${formatMoney(data.real_price, data.currency)}`}
                        </p>

                    </div>
                    <Button size="lg" className="px-8 bg-[#d0011b] hover:bg-[#d0011b]">
                        Beli Sekarang
                    </Button>
                </div>
            </div>
        );
        description = (
            <div className="prose max-w-none">
                <h2 className="text-2xl font-semibold mb-4">Tentang Buku</h2>
                <div className="text-muted-foreground"
                    dangerouslySetInnerHTML={{ __html: data.description || 'Tidak ada deskripsi' }}>
                </div>
            </div>
        );
    }

    return (
        <div className="container max-w-screen-xl mx-auto py-8">
            <div className="bg-white rounded-lg shadow-sm p-6">
                {book}
                {info}
                {pricing}
                {description}
            </div>
        </div>
    );
}