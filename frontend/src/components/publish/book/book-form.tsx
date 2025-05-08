import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { bookProcessState, bookProcessWrite } from "@/lib/states/book-state"; // Import Valtio state
import type { FormEvent } from "react";
import { useEffect } from "react";
import { useSnapshot } from "valtio"; // Import useSnapshot

// Import these from a proper component library or create custom ones
import { MultiSelect } from "./MultiSelect"; // Assuming MultiSelect is in the same directory

interface BookFormProps {
  onSubmit: () => void; // No data needed as it's in Valtio
}

export const BookForm = ({ onSubmit }: BookFormProps) => {
  const read = useSnapshot(bookProcessWrite); // Use Valtio snapshot for reading

  // useEffect to clear formError when component mounts or relevant fields change
  useEffect(() => {
    bookProcessState.clearFormError();
  }, [read.title, read.description, read.categories, read.price, read.coverImagePreview]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    bookProcessState.clearFormError(); // Clear previous errors

    // Validate form
    if (!read.title.trim()) {
      bookProcessState.setFormError("Judul buku harus diisi");
      return;
    }
    if (!read.description.trim()) {
      bookProcessState.setFormError("Deskripsi buku harus diisi");
      return;
    }
    if (read.categories.length === 0) {
      bookProcessState.setFormError("Pilih minimal satu kategori");
      return;
    }
    if (!read.price) {
      bookProcessState.setFormError("Harga buku harus diisi");
      return;
    }
    // Cover image is optional at this stage, can be validated at final publish

    onSubmit(); // Call onSubmit to proceed (e.g., change tab)
  };

  const handleCoverUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    bookProcessState.clearFormError();

    if (!file.type.startsWith("image/")) {
      bookProcessState.setFormError("File harus berupa gambar (JPG, PNG, etc.)");
      return;
    }
    if (file.size > 2 * 1024 * 1024) { // Max 2MB
      bookProcessState.setFormError("Ukuran gambar tidak boleh melebihi 2MB");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      bookProcessWrite.coverImagePreview = reader.result as string;
      bookProcessWrite.coverImage = file;
    };
    reader.readAsDataURL(file);
  };

  // Available categories - consider moving to a shared config or fetching if dynamic
  const categoryOptions = [
    { label: "Fiksi", value: "fiction" },
    { label: "Non-Fiksi", value: "non-fiction" },
    { label: "Pendidikan", value: "education" },
    { label: "Teknologi", value: "technology" },
    { label: "Bisnis", value: "business" },
    { label: "Agama", value: "religion" },
    { label: "Seni & Desain", value: "art-design" },
    { label: "Sejarah", value: "history" },
    { label: "Kesehatan", value: "health" },
    { label: "Anak-anak", value: "children" }
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {read.formError && (
        <div className="bg-red-50 text-red-700 p-3 rounded-md border border-red-200">
          {read.formError}
        </div>
      )}
      
      <div className="grid md:grid-cols-[2fr_1fr] gap-6">
        <div className="space-y-4">
          <div>
            <Label htmlFor="title">Judul Buku</Label>
            <Input
              id="title"
              value={read.title}
              onChange={e => {
                bookProcessWrite.title = e.target.value;
                if (read.formError && e.target.value.trim()) bookProcessState.clearFormError();
              }}
              placeholder="Masukkan judul buku"
              className="mt-1"
            />
          </div>
          
          <div>
            <Label htmlFor="description">Deskripsi</Label>
            <Textarea
              id="description"
              value={read.description}
              onChange={e => {
                bookProcessWrite.description = e.target.value;
                if (read.formError && e.target.value.trim()) bookProcessState.clearFormError();
              }}
              placeholder="Masukkan deskripsi singkat tentang buku"
              className="mt-1 min-h-[120px]"
            />
          </div>
          
          <div>
            <Label htmlFor="categories">Kategori</Label>
            <MultiSelect
              options={categoryOptions}
              selected={read.categories as any}
              onChange={selected => {
                bookProcessWrite.categories = selected;
                if (read.formError && selected.length > 0) bookProcessState.clearFormError();
              }}
              className="mt-1"
              placeholder="Pilih kategori"
            />
          </div>
          
          <div>
            <Label htmlFor="price">Harga</Label>
            <Input
              id="price"
              value={read.price} // Display formatted price
              onChange={e => {
                const value = e.target.value.replace(/[^\d]/g, "");
                if (value) {
                  bookProcessWrite.price = formatCurrency(parseInt(value));
                } else {
                  bookProcessWrite.price = "";
                }
                if (read.formError && value) bookProcessState.clearFormError();
              }}
              placeholder="Rp 0"
              className="mt-1"
            />
          </div>
        </div>
        
        <div>
          <Label htmlFor="cover">Cover Buku (Opsional)</Label>
          <div className="mt-1 border rounded-lg overflow-hidden bg-muted/50 aspect-[3/4] flex items-center justify-center relative">
            {read.coverImagePreview ? (
              <>
                <img 
                  src={read.coverImagePreview} 
                  alt="Pratinjau Cover" 
                  className="w-full h-full object-cover"
                />
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  className="absolute top-2 right-2"
                  onClick={() => {
                    bookProcessWrite.coverImage = null;
                    bookProcessWrite.coverImagePreview = "";
                    // No need to clear formError here unless a specific error was related to the image
                  }}
                >
                  Hapus
                </Button>
              </>
            ) : (
              <div className="text-center p-4">
                <div className="text-3xl mb-2">📚</div>
                <p className="text-muted-foreground text-sm mb-4">Unggah cover buku</p>
                <Label htmlFor="coverUpload" className="cursor-pointer">
                  <span className="bg-primary text-primary-foreground px-3 py-2 rounded-md text-sm hover:bg-primary/90">
                    Pilih Gambar
                  </span>
                  <Input
                    id="coverUpload"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleCoverUpload}
                  />
                </Label>
              </div>
            )}
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            Format: JPG atau PNG. Ukuran maksimal: 2MB.
          </p>
        </div>
      </div>
      
      <div className="flex justify-end">
        <Button type="submit">
          Lanjutkan ke Konten Buku
        </Button>
      </div>
    </form>
  );
};