import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useLocal } from "@/lib/hooks/use-local";
import type { FormEvent } from "react";
import { useEffect } from "react";

// Import these from a proper component library or create custom ones
import { MultiSelect } from "./MultiSelect";

interface BookFormProps {
  onSubmit: (data: any) => void;
  initialData?: any;
}

export const BookForm = ({ onSubmit, initialData }: BookFormProps) => {
  const local = useLocal({
    title: initialData?.title || "",
    description: initialData?.description || "",
    categories: initialData?.categories || [],
    coverImage: initialData?.coverImage || null,
    coverImagePreview: initialData?.coverImagePreview || "",
    price: initialData?.price || "",
    error: "",
  }, async () => {
    // No initialization needed
  });

  // Update local state if initialData changes
  useEffect(() => {
    if (initialData) {
      local.title = initialData.title ?? local.title;
      local.description = initialData.description ?? local.description;
      local.categories = initialData.categories ?? local.categories;
      local.coverImage = initialData.coverImage ?? local.coverImage;
      local.coverImagePreview = initialData.coverImagePreview ?? local.coverImagePreview;
      local.price = initialData.price ?? local.price;
      local.render();
    }
  }, [initialData]);

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
    
    // Validate form
    if (!local.title.trim()) {
      local.error = "Judul buku harus diisi";
      local.render();
      return;
    }
    
    if (!local.description.trim()) {
      local.error = "Deskripsi buku harus diisi";
      local.render();
      return;
    }
    
    if (local.categories.length === 0) {
      local.error = "Pilih minimal satu kategori";
      local.render();
      return;
    }
    
    if (!local.price) {
      local.error = "Harga buku harus diisi";
      local.render();
      return;
    }
    
    // Pass data to parent component
    onSubmit({
      title: local.title,
      description: local.description,
      categories: local.categories,
      coverImage: local.coverImage,
      coverImagePreview: local.coverImagePreview,
      price: local.price
    });
  };

  const handleCoverUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Validate file type
    if (!file.type.startsWith("image/")) {
      local.error = "File harus berupa gambar (JPG, PNG, etc.)";
      local.render();
      return;
    }
    
    // Validate file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      local.error = "Ukuran gambar tidak boleh melebihi 2MB";
      local.render();
      return;
    }
    
    // Create a preview URL
    const reader = new FileReader();
    reader.onload = () => {
      local.coverImagePreview = reader.result as string;
      local.coverImage = file;
      local.render();
    };
    reader.readAsDataURL(file);
  };

  // Available categories
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
      {local.error && (
        <div className="bg-red-50 text-red-700 p-3 rounded-md">
          {local.error}
        </div>
      )}
      
      <div className="grid md:grid-cols-[2fr_1fr] gap-6">
        <div className="space-y-4">
          <div>
            <Label htmlFor="title">Judul Buku</Label>
            <Input
              id="title"
              value={local.title}
              onChange={e => {
                local.title = e.target.value;
                local.error = "";
                local.render();
              }}
              placeholder="Masukkan judul buku"
              className="mt-1"
            />
          </div>
          
          <div>
            <Label htmlFor="description">Deskripsi</Label>
            <Textarea
              id="description"
              value={local.description}
              onChange={e => {
                local.description = e.target.value;
                local.error = "";
                local.render();
              }}
              placeholder="Masukkan deskripsi singkat tentang buku"
              className="mt-1 min-h-[120px]"
            />
          </div>
          
          <div>
            <Label htmlFor="categories">Kategori</Label>
            <MultiSelect
              options={categoryOptions}
              selected={local.categories}
              
              onChange={selected => {
                local.categories = selected;
                local.error = "";
                local.render();
              }}
              className="mt-1"
              placeholder="Pilih kategori"
            />
          </div>
          
          <div>
            <Label htmlFor="price">Harga</Label>
            <Input
              id="price"
              value={local.price}
              onChange={e => {
                // Only allow numbers and format as currency
                const value = e.target.value.replace(/[^\d]/g, "");
                if (value) {
                  local.price = formatCurrency(parseInt(value));
                } else {
                  local.price = "";
                }
                local.error = "";
                local.render();
              }}
              placeholder="Rp 0"
              className="mt-1"
            />
          </div>
        </div>
        
        <div>
          <Label htmlFor="cover">Cover Buku</Label>
          <div className="mt-1 border rounded-lg overflow-hidden bg-muted/50 aspect-[3/4] flex items-center justify-center relative">
            {local.coverImagePreview ? (
              <>
                <img 
                  src={local.coverImagePreview} 
                  alt="Cover Preview" 
                  className="w-full h-full object-cover"
                />
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  className="absolute top-2 right-2"
                  onClick={() => {
                    local.coverImage = null;
                    local.coverImagePreview = "";
                    local.render();
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
                  <span className="bg-primary text-primary-foreground px-3 py-2 rounded-md text-sm">
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
          Lanjutkan
        </Button>
      </div>
    </form>
  );
};