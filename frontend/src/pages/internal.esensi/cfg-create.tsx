import { Protected } from "@/components/app/protected";
import { Breadcrumb } from "@/components/ext/cfg/breadcrumb/create";
import { Error } from "@/components/ext/error";
import { MenuBarInternal } from "@/components/ext/menu-bar/internal";
import { Success } from "@/components/ext/success";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { betterAuth } from "@/lib/better-auth";
import { api } from "@/lib/gen/internal.esensi";
import { useLocal } from "@/lib/hooks/use-local";
import { navigate } from "@/lib/router";
import type { User } from "backend/lib/better-auth";
import { Role } from "backend/lib/types";
import { ArrowLeft, Save } from "lucide-react";

export const current = {
  user: undefined as User | undefined,
};

export default function CfgCreatePage() {
  const local = useLocal(
    {
      form: {
        key: "",
        value: "",
      },
      loading: false,
      error: "",
      success: "",
      isSubmitting: false,
    },
    async () => {
      const res = await betterAuth.getSession();
      current.user = res.data?.user;
    }
  );

  async function handleSubmit() {
    // Validation
    if (!local.form.key.trim()) {
      local.error = "Key konfigurasi harus diisi.";
      local.render();
      return;
    }

    if (!local.form.value.trim()) {
      local.error = "Value konfigurasi harus diisi.";
      local.render();
      return;
    }

    local.isSubmitting = true;
    local.error = "";
    local.success = "";
    local.render();

    try {
      await api.cfg_create({
        key: local.form.key.trim(),
        value: local.form.value.trim(),
      });

      local.success = "Konfigurasi berhasil dibuat.";
      local.render();

      // Navigate back to list after successful creation
      setTimeout(() => {
        navigate("/manage-cfg");
      }, 1500);
    } catch (error: any) {
      local.error =
        error.message || "Terjadi kesalahan saat membuat konfigurasi.";
      console.error(error);
    } finally {
      local.isSubmitting = false;
      local.render();
    }
  }

  return (
    <Protected role={[Role.INTERNAL]} fallback={() => <div>Akses ditolak</div>}>
      <div className="flex min-h-svh flex-col bg-gray-50">
        <MenuBarInternal />
        <main className="flex-1">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
            <Error msg={local.error} />
            <Success msg={local.success} />

            {/* Header */}
            <div className="mb-8">
              <Breadcrumb />
              <Button
                variant="ghost"
                onClick={() => navigate("/manage-cfg")}
                className="mb-4 flex items-center gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Kembali ke Daftar Konfigurasi
              </Button>
              <h1 className="text-2xl font-bold">Tambah Konfigurasi Baru</h1>
              <p className="text-gray-600 mt-2">
                Buat konfigurasi baru dengan mengisi key dan value di bawah ini.
              </p>
            </div>

            {/* Form */}
            <Card>
              <CardHeader>
                <CardTitle>Form Konfigurasi</CardTitle>
                <CardDescription>
                  Pastikan key yang digunakan unik dan mudah dipahami.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="key">Key Konfigurasi *</Label>
                  <Input
                    id="key"
                    placeholder="Contoh: app_name, max_upload_size, etc."
                    value={local.form.key}
                    onChange={(e) => {
                      local.form.key = e.target.value;
                      local.render();
                    }}
                    disabled={local.isSubmitting}
                  />
                  <p className="text-sm text-gray-500">
                    Key harus unik dan akan digunakan untuk mengidentifikasi
                    konfigurasi ini.
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="value">Value Konfigurasi *</Label>
                  <Textarea
                    id="value"
                    placeholder="Masukkan value untuk konfigurasi..."
                    value={local.form.value}
                    onChange={(e) => {
                      local.form.value = e.target.value;
                      local.render();
                    }}
                    rows={6}
                    disabled={local.isSubmitting}
                  />
                  <p className="text-sm text-gray-500">
                    Value dapat berupa teks, angka, JSON, atau format lainnya
                    sesuai kebutuhan.
                  </p>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button
                  variant="outline"
                  onClick={() => navigate("/manage-cfg")}
                  disabled={local.isSubmitting}
                >
                  Batal
                </Button>
                <Button
                  onClick={handleSubmit}
                  disabled={local.isSubmitting}
                  className="flex items-center gap-2"
                >
                  {local.isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Menyimpan...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4" />
                      Simpan Konfigurasi
                    </>
                  )}
                </Button>
              </CardFooter>
            </Card>

            {/* Preview */}
            {(local.form.key || local.form.value) && (
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle className="text-lg">Preview</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4">
                    <div>
                      <Label className="text-sm font-medium text-gray-600">
                        Key:
                      </Label>
                      <div className="mt-1 p-2 bg-gray-50 rounded border">
                        <code className="text-sm">
                          {local.form.key || "(kosong)"}
                        </code>
                      </div>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-600">
                        Value:
                      </Label>
                      <div className="mt-1 p-2 bg-gray-50 rounded border">
                        <pre className="text-sm whitespace-pre-wrap">
                          {local.form.value || "(kosong)"}
                        </pre>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </main>
      </div>
    </Protected>
  );
}
