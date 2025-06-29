import { Breadcrumb } from "@/components/ext/cfg/breadcrumb/update";
import { Error } from "@/components/ext/error";
import { Layout } from "@/components/ext/layout/internal.esensi";
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
import { ChevronRight, Save } from "lucide-react";

export const current = {
  user: undefined as User | undefined,
};

interface CfgItem {
  key: string;
  value: string;
}

export default function CfgEditPage() {
  const local = useLocal(
    {
      key: "",
      originalConfig: undefined as CfgItem | undefined,
      form: {
        key: "",
        value: "",
      },
      loading: true,
      error: "",
      success: "",
      isSubmitting: false,
    },
    async () => {
      const res = await betterAuth.getSession();
      current.user = res.data?.user;
      if (!current.user) return;
      const params = new URLSearchParams(location.search);
      local.key = params.get("key") || "";
      if (!local.key) {
        local.error = "Key konfigurasi tidak ditemukan.";
        local.render();
        return;
      }
      await loadConfig();
    }
  );

  async function loadConfig() {
    try {
      const res = await api.cfg_get({ key: local.key });
      if (res) {
        local.originalConfig = res.data;
        local.form.key = local.originalConfig?.key!;
        local.form.value = local.originalConfig?.value!;
      }
    } catch (error: any) {
      local.error = error.message || "Konfigurasi tidak ditemukan.";
      console.error(error);
    } finally {
      local.loading = false;
      local.render();
    }
  }

  async function handleSubmit() {
    // Validation
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
      await api.cfg_update({
        key: local.form.key,
        value: local.form.value.trim(),
      });

      local.success = "Konfigurasi berhasil diperbarui.";
      local.render();

      // Navigate back to list after successful update
      setTimeout(() => {
        navigate("/manage-cfg");
      }, 1500);
    } catch (error: any) {
      local.error =
        error.message || "Terjadi kesalahan saat memperbarui konfigurasi.";
      console.error(error);
    } finally {
      local.isSubmitting = false;
      local.render();
    }
  }

  if (local.error && !local.originalConfig) {
    return (
      <Layout loading={local.loading}>
        <MenuBarInternal />
        <main className="flex-1">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
            <Breadcrumb id={local.form.key} />
            <nav className="flex items-center text-sm text-gray-600 mb-6">
              <button
                onClick={() => navigate("/manage-cfg")}
                className="hover:text-blue-600 transition-colors font-medium cursor-pointer"
              >
                Kelola Konfigurasi
              </button>
              <ChevronRight className="h-4 w-4 mx-2 text-gray-400" />
              <span className="text-gray-800 font-medium">
                Edit Konfigurasi
              </span>
            </nav>

            <Error msg={local.error} />
          </div>
        </main>
      </Layout>
    );
  }

  return (
    <Layout loading={local.loading}>
      <MenuBarInternal />
      <main className="flex-1">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
          {/* Breadcrumb */}
          <nav className="flex items-center text-sm text-gray-600 mb-6">
            <button
              onClick={() => navigate("/manage-cfg")}
              className="hover:text-blue-600 transition-colors font-medium cursor-pointer"
            >
              Kelola Konfigurasi
            </button>
            <ChevronRight className="h-4 w-4 mx-2 text-gray-400" />
            <span className="text-gray-800 font-medium">Edit Konfigurasi</span>
          </nav>

          <Error msg={local.error} />
          <Success msg={local.success} />

          {/* Header */}
          <div className="mb-8">
            <h1 className="text-2xl font-bold">Edit Konfigurasi</h1>
            <p className="text-gray-600 mt-2">
              Ubah value untuk konfigurasi dengan key:{" "}
              <code className="bg-gray-100 px-2 py-1 rounded text-sm">
                {local.form.key}
              </code>
            </p>
          </div>

          {/* Form */}
          <Card>
            <CardHeader>
              <CardTitle>Form Konfigurasi</CardTitle>
              <CardDescription>
                Key konfigurasi tidak dapat diubah. Hanya value yang dapat
                diperbarui.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="key">Key Konfigurasi</Label>
                <Input
                  id="key"
                  value={local.form.key}
                  disabled={true}
                  className="bg-gray-50"
                />
                <p className="text-sm text-gray-500">
                  Key konfigurasi tidak dapat diubah setelah dibuat.
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
                    Simpan Perubahan
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
        </div>
      </main>
    </Layout>
  );
}
