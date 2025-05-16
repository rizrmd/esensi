import { Button } from "@/components/ui/button";
import {
  FileUpload,
  FileUploadDropzone,
  FileUploadItem,
  FileUploadItemDelete,
  FileUploadItemPreview,
  FileUploadList,
  FileUploadTrigger,
} from "@/components/ui/file-upload";
import { useLocal } from "@/lib/hooks/use-local";
import { Upload, X } from "lucide-react";

type MyFileUploadProps = {
  title: string;
  onImageChange?: (files: File[]) => void;
  maxSize?: number;
};

export const MyFileUpload = ({
  title,
  onImageChange,
  maxSize = 1 * 1024 * 1024, // default to 1MB
}: MyFileUploadProps) => {
  const local = useLocal(
    {
      files: [] as File[],
    },
    () => {}
  );

  return (
    <FileUpload
      maxFiles={1}
      maxSize={maxSize}
      className="w-full max-w-md"
      value={local.files}
      onValueChange={(files) => {
        local.files = files;
        if (onImageChange) {
          onImageChange(files);
        }
        local.render();
      }}
      accept="image/*"
    >
      <span className="font-medium text-sm">{title}</span>
      {local.files.length === 0 && (
        <FileUploadDropzone>
          <div className="flex flex-col items-center gap-1 text-center">
            <div className="flex items-center justify-center rounded-full border p-2.5">
              <Upload className="size-6 text-muted-foreground" />
            </div>
            <p className="font-medium text-sm">Seret & taruh file di sini</p>
            <p className="text-muted-foreground text-xs">
              Atau klik untuk mencari (ukuran maks {maxSize / (1024 * 1024)}MB)
            </p>
          </div>
          <FileUploadTrigger asChild>
            <Button variant="outline" size="sm" className="mt-2 w-fit">
              Cari file
            </Button>
          </FileUploadTrigger>
        </FileUploadDropzone>
      )}
      <FileUploadList>
        {local.files.map((file, index) => (
          <FileUploadItem key={index} value={file}>
            <FileUploadItemPreview
              style={{ width: 100, height: 100, borderRadius: 100 }}
            />
            <FileUploadItemDelete asChild>
              <Button variant="ghost" size="icon" className="size-7">
                <X />
              </Button>
            </FileUploadItemDelete>
          </FileUploadItem>
        ))}
      </FileUploadList>
    </FileUpload>
  );
};
