import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useLocal } from "@/lib/hooks/use-local";

interface BookPreviewProps {
  bookData: any;
  onBack: () => void;
}

export const BookPreview = ({ bookData, onBack }: BookPreviewProps) => {
  const local = useLocal({}, async () => {
    // No initialization needed
  });

  const formatCurrency = (value: string) => {
    // If already formatted, return as is
    if (value.includes("Rp")) return value;
    
    // Format as IDR currency
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(parseInt(value.replace(/[^\d]/g, "")));
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h2 className="text-lg font-semibold mb-1">Pratinjau Buku</h2>
          <p className="text-muted-foreground">
            Periksa informasi buku Anda sebelum menerbitkannya.
          </p>
        </div>
      </div>
      
      <div className="grid md:grid-cols-[1fr_2fr] gap-8">
        <div>
          <div className="border rounded-lg overflow-hidden bg-muted/50 aspect-[3/4] flex items-center justify-center relative">
            {bookData.coverImagePreview ? (
              <img 
                src={bookData.coverImagePreview} 
                alt="Cover Preview" 
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="text-center p-4">
                <div className="text-3xl mb-2">📚</div>
                <p className="text-muted-foreground text-sm">Tidak ada cover</p>
              </div>
            )}
          </div>
          
          <div className="mt-4 space-y-2">
            <div className="font-medium">File Konten</div>
            {bookData.contentFileName ? (
              <div className="text-sm border rounded p-3 bg-muted/30">
                <div className="font-medium">{bookData.contentFileName}</div>
                <div className="text-xs text-muted-foreground mt-1">
                  {bookData.contentFile && (bookData.contentFile.size / (1024 * 1024)).toFixed(2)} MB
                </div>
              </div>
            ) : bookData.isUsingAI ? (
              <div className="text-sm border rounded p-3 bg-blue-50 text-blue-700">
                Menggunakan AI untuk optimasi konten
              </div>
            ) : (
              <div className="text-sm border rounded p-3 bg-amber-50 text-amber-700">
                Tidak ada file konten
              </div>
            )}
          </div>
        </div>
        
        <div>
          <Card>
            <CardHeader>
              <CardTitle>{bookData.title || "Judul Buku"}</CardTitle>
              <CardDescription>
                Informasi detail buku
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="text-sm font-medium text-muted-foreground mb-1">
                  Harga
                </div>
                <div className="font-bold text-lg">
                  {bookData.price ? formatCurrency(bookData.price) : "Rp 0"}
                </div>
              </div>
              
              <div>
                <div className="text-sm font-medium text-muted-foreground mb-1">
                  Kategori
                </div>
                <div className="flex flex-wrap gap-1">
                  {bookData.categories && bookData.categories.length > 0 ? (
                    bookData.categories.map((category: any, index: number) => (
                      <span 
                        key={index}
                        className="px-2 py-1 bg-muted rounded-full text-xs"
                      >
                        {category.label}
                      </span>
                    ))
                  ) : (
                    <span className="text-muted-foreground">Tidak ada kategori</span>
                  )}
                </div>
              </div>
              
              <div>
                <div className="text-sm font-medium text-muted-foreground mb-1">
                  Deskripsi
                </div>
                <div className="text-sm">
                  {bookData.description || "Tidak ada deskripsi"}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};