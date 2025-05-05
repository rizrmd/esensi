import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useLocal } from "@/lib/hooks/use-local";
import type { FormEvent } from "react";
import { useEffect } from "react";
import { Switch } from "@/components/ui/switch";
import { Upload, FileText } from "lucide-react";

interface BookContentProps {
  onSubmit: (data: any) => void;
  onBack: () => void;
  initialData?: any;
}

export const BookContent = ({ onSubmit, onBack, initialData }: BookContentProps) => {
  const local = useLocal({
    contentFile: initialData?.contentFile || null,
    contentFileName: initialData?.contentFileName || "",
    isUsingAI: initialData?.isUsingAI || false,
    error: "",
  }, async () => {
    // No initialization needed
  });

  // Update local state if initialData changes
  useEffect(() => {
    if (initialData) {
      local.contentFile = initialData.contentFile || local.contentFile;
      local.contentFileName = initialData.contentFileName || local.contentFileName;
      local.isUsingAI = initialData.isUsingAI || local.isUsingAI;
      local.render();
    }
  }, [initialData]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!local.contentFile && !local.isUsingAI) {
      local.error = "Unggah file konten buku atau gunakan AI";
      local.render();
      return;
    }
    
    // Pass data to parent component
    onSubmit({
      contentFile: local.contentFile,
      contentFileName: local.contentFileName,
      isUsingAI: local.isUsingAI
    });
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Validate file type
    const allowedTypes = [
      "application/pdf", 
      "application/msword", 
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "text/plain"
    ];
    
    if (!allowedTypes.includes(file.type)) {
      local.error = "File harus berupa PDF, Word, atau Text";
      local.render();
      return;
    }
    
    // Validate file size (max 20MB)
    if (file.size > 20 * 1024 * 1024) {
      local.error = "Ukuran file tidak boleh melebihi 20MB";
      local.render();
      return;
    }
    
    local.contentFile = file;
    local.contentFileName = file.name;
    local.render();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {local.error && (
        <div className="bg-red-50 text-red-700 p-3 rounded-md">
          {local.error}
        </div>
      )}
      
      <div className="space-y-8">
        <div>
          <div className="flex justify-between items-start mb-4">
            <div>
              <h2 className="text-lg font-semibold mb-1">Konten Buku</h2>
              <p className="text-muted-foreground">
                Unggah file buku dalam format PDF, Word, atau text.
              </p>
            </div>
          </div>
          
          {local.contentFile ? (
            <div className="border rounded-lg p-4 bg-muted/30 flex items-center gap-4">
              <FileText className="w-8 h-8 text-muted-foreground" />
              <div className="flex-1">
                <div className="font-medium">{local.contentFileName}</div>
                <div className="text-xs text-muted-foreground mt-1">
                  {(local.contentFile.size / (1024 * 1024)).toFixed(2)} MB
                </div>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => {
                  local.contentFile = null;
                  local.contentFileName = "";
                  local.render();
                }}
              >
                Hapus
              </Button>
            </div>
          ) : (
            <div className="border border-dashed rounded-lg p-10 text-center bg-muted/30">
              <Upload className="w-10 h-10 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground mb-4">
                Seret dan jatuhkan file buku Anda disini, atau klik tombol untuk memilih file
              </p>
              <Label htmlFor="contentUpload" className="cursor-pointer">
                <span className="bg-primary text-primary-foreground px-4 py-2 rounded-md">
                  Pilih File
                </span>
                <Input
                  id="contentUpload"
                  type="file"
                  accept=".pdf,.doc,.docx,.txt"
                  className="hidden"
                  onChange={handleFileUpload}
                />
              </Label>
            </div>
          )}
          
          <p className="text-xs text-muted-foreground mt-2">
            Format yang didukung: PDF, Word (doc, docx), dan Text. Ukuran maksimal: 20MB.
          </p>
        </div>
        
        <div className="border-t pt-6">
          <div className="flex items-center space-x-2">
            <Switch
              id="use-ai"
              checked={local.isUsingAI}
              onCheckedChange={(checked) => {
                local.isUsingAI = checked;
                local.render();
              }}
            />
            <Label htmlFor="use-ai" className="font-medium">Gunakan AI untuk optimasi konten</Label>
          </div>
          <p className="text-sm text-muted-foreground mt-1 ml-8">
            AI akan membantu mengoptimalkan konten buku Anda, termasuk koreksi tata bahasa,
            pemformatan, dan menghasilkan caption untuk gambar.
          </p>
        </div>
      </div>
      
      <div className="flex justify-between">
        <Button type="button" variant="outline" onClick={onBack}>
          Kembali
        </Button>
        <Button type="submit">
          Lanjutkan
        </Button>
      </div>
    </form>
  );
};