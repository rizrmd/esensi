import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { bookProcessState, bookProcessWrite } from "@/lib/states/book-state";
import type { FormEvent } from "react";
import { useEffect } from "react";
import { useSnapshot } from "valtio";
import { UploadCloud, FileText, XCircle } from "lucide-react";

interface BookContentProps {
  onSubmit: () => void;
  onBack: () => void;
}

export const BookContent = ({ onSubmit, onBack }: BookContentProps) => {
  const read = useSnapshot(bookProcessWrite);

  useEffect(() => {
    bookProcessState.clearFormError();
  }, [read.contentFile, read.isUsingAI]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.type !== "application/pdf" && file.type !== "application/epub+zip") {
        bookProcessState.setFormError("Format file tidak didukung. Harap unggah PDF atau EPUB.");
        return;
      }
      if (file.size > 50 * 1024 * 1024) {
        bookProcessState.setFormError("Ukuran file tidak boleh melebihi 50MB.");
        return;
      }
      bookProcessWrite.contentFile = file;
      bookProcessWrite.contentFileName = file.name;
      bookProcessState.clearFormError();
    }
  };

  const removeFile = () => {
    bookProcessWrite.contentFile = null;
    bookProcessWrite.contentFileName = "";
    bookProcessState.clearFormError();
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    bookProcessState.clearFormError();

    if (!read.contentFile) {
      bookProcessState.setFormError("Harap unggah file konten buku.");
      return;
    }
    onSubmit();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {read.formError && (
        <div className="bg-red-50 text-red-700 p-3 rounded-md border border-red-200">
          {read.formError}
        </div>
      )}

      <div>
        <Label htmlFor="bookContentFile" className="text-lg font-medium mb-2 block">Unggah Konten Buku</Label>
        <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed rounded-md 
                        border-gray-300 hover:border-primary transition-colors duration-200 ease-in-out">
          <div className="space-y-1 text-center w-full">
            {!read.contentFile ? (
              <>
                <UploadCloud className="mx-auto h-12 w-12 text-gray-400" />
                <div className="flex text-sm text-gray-600 justify-center">
                  <Label
                    htmlFor="bookContentFile-upload"
                    className="relative cursor-pointer rounded-md font-medium text-primary hover:text-primary/80 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-primary"
                  >
                    <span>Unggah file</span>
                    <Input id="bookContentFile-upload" name="bookContentFile-upload" type="file" className="sr-only" onChange={handleFileChange} accept=".pdf,.epub" />
                  </Label>
                  <p className="pl-1">atau seret dan lepas</p>
                </div>
                <p className="text-xs text-gray-500">PDF, EPUB (Maks. 50MB)</p>
              </>
            ) : (
              <div className="py-4">
                <FileText className="mx-auto h-10 w-10 text-green-500" />
                <p className="mt-2 text-sm font-medium text-gray-700 truncate max-w-xs mx-auto">{read.contentFileName}</p>
                <Button type="button" variant="link" size="sm" className="text-red-600 hover:text-red-800 mt-1" onClick={removeFile}>
                  <XCircle className="mr-1 h-4 w-4" /> Hapus File
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="flex items-center space-x-3 p-4 border rounded-lg bg-muted/30">
        <Switch
          id="aiGenerated"
          checked={read.isUsingAI}
          onCheckedChange={(checked) => {
            bookProcessWrite.isUsingAI = checked;
          }}
        />
        <div>
            <Label htmlFor="aiGenerated" className="font-medium">Konten Dibuat/Dibantu AI</Label>
            <p className="text-sm text-muted-foreground">
                Centang jika Anda menggunakan AI untuk menghasilkan atau membantu menulis konten buku ini.
            </p>
        </div>
      </div>

      <div className="flex justify-between mt-10">
        <Button type="button" variant="outline" onClick={onBack}>
          Kembali ke Informasi Buku
        </Button>
        <Button type="submit">
          Lanjutkan ke Tinjauan
        </Button>
      </div>
    </form>
  );
};