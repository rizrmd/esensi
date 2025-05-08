import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { bookProcessWrite } from "@/lib/states/book-state"; // Valtio state
import { useSnapshot } from "valtio";
import { CheckCircle, XCircle, AlertTriangle, Info, FileText, Tag, Image as ImageIcon, DollarSign, Edit3 } from "lucide-react"; // Icons

interface BookPreviewProps {
  onBack: () => void;
}

const formatDisplayPrice = (priceString: string) => {
  if (priceString.startsWith("Rp")) return priceString;
  const amount = parseInt(priceString.replace(/[^\\d]/g, ""));
  if (isNaN(amount)) return "Harga tidak valid";
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
};

export const BookPreview = ({ onBack }: BookPreviewProps) => {
  const read = useSnapshot(bookProcessWrite);

  const DetailItem = ({ icon: Icon, label, value, valueClass, helpText }: {
    icon: React.ElementType;
    label: string;
    value: string | React.ReactNode;
    valueClass?: string;
    helpText?: string;
  }) => (
    <div className="flex items-start py-3 border-b border-muted/70 last:border-b-0">
      <Icon className="h-5 w-5 text-muted-foreground mr-4 mt-1 flex-shrink-0" />
      <div className="flex-grow">
        <p className="text-sm text-muted-foreground">{label}</p>
        <div className={`font-medium text-base ${valueClass || 'text-foreground'}`}>{value}</div>
        {helpText && <p className="text-xs text-muted-foreground mt-0.5">{helpText}</p>}
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <Card className="overflow-hidden shadow-md">
        <CardHeader className="bg-muted/50 border-b">
          <CardTitle className="text-xl flex items-center"><Info className="mr-2 h-6 w-6 text-primary"/>Ringkasan Informasi Buku</CardTitle>
          <CardDescription>Pastikan semua detail sudah benar sebelum melanjutkan.</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y divide-muted/70">
            <DetailItem icon={Edit3} label="Judul Buku" value={read.title || "-"} />
            <DetailItem icon={ImageIcon} label="Cover Buku" value={read.coverImagePreview ? 
              <img src={read.coverImagePreview} alt="Cover Buku" className="mt-1 max-h-40 rounded border object-contain" /> : "Tidak ada cover"} />
            <DetailItem icon={Tag} label="Kategori" value={read.categories.length > 0 ? read.categories.map(c => c.label).join(", ") : "-"} />
            <DetailItem icon={DollarSign} label="Harga" value={read.price ? formatDisplayPrice(read.price) : "-"} />
            <DetailItem 
              icon={FileText} 
              label="File Konten Buku" 
              value={read.contentFileName || "Belum diunggah"} 
              valueClass={read.contentFile ? 'text-green-600' : 'text-amber-600'}
              helpText={read.contentFile ? `(${Math.round(read.contentFile.size / 1024)} KB)` : ""}
            />
            <DetailItem 
              icon={read.isUsingAI ? CheckCircle : XCircle} 
              label="Menggunakan Bantuan AI" 
              value={read.isUsingAI ? "Ya" : "Tidak"} 
              valueClass={read.isUsingAI ? 'text-blue-600' : 'text-foreground'}
            />
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-md">
        <CardHeader className="bg-muted/50 border-b">
            <CardTitle className="text-xl flex items-center"><AlertTriangle className="mr-2 h-6 w-6 text-amber-500"/>Pernyataan & Persetujuan</CardTitle>
        </CardHeader>
        <CardContent className="pt-6 text-sm text-muted-foreground space-y-3">
            <p>
                Dengan menekan tombol "Terbitkan Sekarang", Anda menyatakan bahwa:
            </p>
            <ul className="list-disc list-inside space-y-1 pl-2">
                <li>Anda adalah pemilik sah atau memiliki hak penuh untuk menerbitkan konten ini.</li>
                <li>Konten yang Anda terbitkan tidak melanggar hak cipta, merek dagang, atau hak kekayaan intelektual pihak lain.</li>
                <li>Konten tidak mengandung unsur SARA, pornografi, ujaran kebencian, atau hal-hal yang melanggar hukum yang berlaku di Indonesia.</li>
                <li>Informasi yang Anda berikan adalah benar dan akurat.</li>
                {read.isUsingAI && (
                    <li>Anda telah memberitahukan bahwa konten ini dibuat atau dibantu oleh Kecerdasan Buatan (AI).</li>
                )}
            </ul>
            <p className="font-semibold">
                Pelanggaran terhadap salah satu poin di atas dapat mengakibatkan penghapusan konten dan/atau penangguhan akun Anda.
            </p>
        </CardContent>
      </Card>
    </div>
  );
};