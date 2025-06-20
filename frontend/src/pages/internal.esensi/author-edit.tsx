import { AppLoading } from "@/components/app/loading";
import { Protected } from "@/components/app/protected";
import { Error } from "@/components/ext/error";
import { MenuBarInternal } from "@/components/ext/menu-bar/internal";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { api } from "@/lib/gen/internal.esensi";
import { useLocal } from "@/lib/hooks/use-local";
import { navigate } from "@/lib/router";
import { Role } from "backend/lib/types";
import { ArrowLeft, Save, Upload, User as UserIcon } from "lucide-react";

interface Author {
  id: string;
  name: string;
  biography: string | null;
  social_media: string | null;
  avatar: string | null;
  id_account: string | null;
  id_user: string | null;
  cfg: any;
}

export default () => {
  const local = useLocal(
    {
      form: {
        name: "",
        biography: "",
        social_media: "",
        avatar: "",
        id_account: "",
        id_user: "",
        cfg: {} as Record<string, any>,
      },
      author: null as Author | null,
      loading: true,
      saving: false,
      uploading: false,
      error: "",
      success: false,
      authorId: "",
    },
    async () => {
      // Get author ID from URL query parameter
      const urlParams = new URLSearchParams(window.location.search);
      const id = urlParams.get("id");
      if (id) {
        local.authorId = id;
        await loadAuthor();
      } else {
        local.error = "ID penulis tidak ditemukan";
        local.loading = false;
        local.render();
      }
    }
  );

  const loadAuthor = async () => {
    try {
      local.loading = true;
      local.error = "";
      local.render();

      const result = await api.author_get({
        id: local.authorId,
        include_user: false,
        include_account: false,
        include_books: false,
        include_products: false,
      });

      if (result) {
        local.author = result;
        // Populate form with existing data
        local.form.name = result.name || "";
        local.form.biography = result.biography || "";
        local.form.social_media = result.social_media || "";
        local.form.avatar = result.avatar || "";
        local.form.id_account = result.id_account || "";
        local.form.id_user = result.id_user || "";
        local.form.cfg = result.cfg || {};
      } else {
        local.error = "Penulis tidak ditemukan";
      }
    } catch (error: any) {
      console.error("Error loading author:", error);
      local.error =
        error.message || "Terjadi kesalahan saat memuat data penulis";
    } finally {
      local.loading = false;
      local.render();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!local.form.name.trim()) {
      local.error = "Nama penulis wajib diisi";
      local.render();
      return;
    }

    try {
      local.saving = true;
      local.error = "";
      local.render();

      const result = await api.author_update({
        id: local.authorId,
        name: local.form.name.trim(),
        biography: local.form.biography.trim() || undefined,
        social_media: local.form.social_media.trim() || undefined,
        avatar: local.form.avatar.trim() || undefined,
        id_account: local.form.id_account.trim() || undefined,
        id_user: local.form.id_user.trim() || undefined,
        cfg:
          Object.keys(local.form.cfg).length > 0 ? local.form.cfg : undefined,
      });

      if (result) {
        local.success = true;
        local.render();

        // Redirect after short delay
        setTimeout(() => {
          navigate(`/author-detail?id=${local.authorId}`);
        }, 1500);
      }
    } catch (error: any) {
      console.error("Error updating author:", error);
      local.error =
        error.message || "Terjadi kesalahan saat memperbarui penulis";
    } finally {
      local.saving = false;
      local.render();
    }
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      local.error = "Ukuran file tidak boleh lebih dari 2MB";
      local.render();
      return;
    }

    // Check file type
    if (!file.type.startsWith("image/")) {
      local.error = "File harus berupa gambar";
      local.render();
      return;
    }

    try {
      local.uploading = true;
      local.error = "";
      local.render();

      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (result.success && result.data?.url) {
        local.form.avatar = result.data.url;
      } else {
        local.error = "Gagal mengupload gambar";
      }
    } catch (error) {
      console.error("Upload error:", error);
      local.error = "Terjadi kesalahan saat mengupload gambar";
    } finally {
      local.uploading = false;
      local.render();
    }
  };

  const addConfigField = () => {
    const key = prompt("Masukkan nama konfigurasi:");
    if (key && key.trim()) {
      local.form.cfg[key.trim()] = "";
      local.render();
    }
  };

  const removeConfigField = (key: string) => {
    delete local.form.cfg[key];
    local.render();
  };

  const updateConfigField = (key: string, value: string) => {
    local.form.cfg[key] = value;
    local.render();
  };

  if (local.loading) {
    return (
      <Protected role={Role.INTERNAL}>
        <div className="flex flex-col min-h-screen bg-background">
          <MenuBarInternal />
          <div className="flex-1 flex items-center justify-center">
            <AppLoading />
          </div>
        </div>
      </Protected>
    );
  }

  if (local.error && !local.author) {
    return (
      <Protected role={Role.INTERNAL}>
        <div className="flex flex-col min-h-screen bg-background">
          <MenuBarInternal />
          <div className="flex-1 container mx-auto px-4 py-8">
            <Button
              variant="ghost"
              onClick={() => navigate("/manage-author")}
              className="mb-4"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Kembali ke Kelola Penulis
            </Button>
            <Error
              msg={local.error || "Penulis tidak ditemukan"}
              loading={false}
            />
          </div>
        </div>
      </Protected>
    );
  }

  return (
    <Protected role={Role.INTERNAL}>
      <div className="flex flex-col min-h-screen bg-background">
        <MenuBarInternal />

        <div className="flex-1 container mx-auto px-4 py-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                onClick={() => navigate(`/author-detail?id=${local.authorId}`)}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Kembali ke Detail
              </Button>
              <div>
                <h1 className="text-2xl font-bold">Edit Penulis</h1>
                <p className="text-muted-foreground">
                  Perbarui informasi penulis
                </p>
              </div>
            </div>
          </div>

          {local.success && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg text-green-800">
              Penulis berhasil diperbarui! Mengalihkan ke halaman detail...
            </div>
          )}

          {local.error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-800">
              {local.error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              {/* Basic Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <UserIcon className="h-5 w-5" />
                    Informasi Dasar
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="name">Nama Penulis *</Label>
                    <Input
                      id="name"
                      type="text"
                      value={local.form.name}
                      onChange={(e) => {
                        local.form.name = e.target.value;
                        local.render();
                      }}
                      placeholder="Masukkan nama penulis"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="biography">Biografi</Label>
                    <Textarea
                      id="biography"
                      value={local.form.biography}
                      onChange={(e) => {
                        local.form.biography = e.target.value;
                        local.render();
                      }}
                      placeholder="Masukkan biografi penulis"
                      rows={4}
                    />
                  </div>

                  <div>
                    <Label htmlFor="social_media">Media Sosial</Label>
                    <Input
                      id="social_media"
                      type="url"
                      value={local.form.social_media}
                      onChange={(e) => {
                        local.form.social_media = e.target.value;
                        local.render();
                      }}
                      placeholder="https://instagram.com/username"
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Avatar & References */}
              <Card>
                <CardHeader>
                  <CardTitle>Avatar & Referensi</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Avatar Upload */}
                  <div>
                    <Label>Avatar</Label>
                    <div className="mt-2">
                      {local.form.avatar && (
                        <div className="mb-4">
                          <img
                            src={local.form.avatar}
                            alt="Avatar"
                            className="w-20 h-20 rounded-full object-cover border"
                          />
                        </div>
                      )}
                      <div className="flex items-center gap-2">
                        <Input
                          type="file"
                          accept="image/*"
                          onChange={handleAvatarUpload}
                          disabled={local.uploading}
                          className="flex-1"
                        />
                        {local.uploading && (
                          <Upload className="h-4 w-4 animate-spin" />
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        Format: JPG, PNG. Maksimal 2MB.
                      </p>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="id_account">ID Account</Label>
                    <Input
                      id="id_account"
                      type="text"
                      value={local.form.id_account}
                      onChange={(e) => {
                        local.form.id_account = e.target.value;
                        local.render();
                      }}
                      placeholder="ID akun terkait"
                    />
                  </div>

                  <div>
                    <Label htmlFor="id_user">ID User</Label>
                    <Input
                      id="id_user"
                      type="text"
                      value={local.form.id_user}
                      onChange={(e) => {
                        local.form.id_user = e.target.value;
                        local.render();
                      }}
                      placeholder="ID user terkait"
                    />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Configuration */}
            <Card>
              <CardHeader>
                <CardTitle>Konfigurasi</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {Object.entries(local.form.cfg).map(([key, value]) => (
                    <div key={key} className="flex items-center gap-2">
                      <Input
                        value={key}
                        disabled
                        className="flex-1"
                        placeholder="Nama konfigurasi"
                      />
                      <Input
                        value={value as string}
                        onChange={(e) => updateConfigField(key, e.target.value)}
                        className="flex-1"
                        placeholder="Nilai konfigurasi"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => removeConfigField(key)}
                      >
                        Hapus
                      </Button>
                    </div>
                  ))}
                  <Button
                    type="button"
                    variant="outline"
                    onClick={addConfigField}
                  >
                    Tambah Konfigurasi
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Actions */}
            <div className="flex items-center justify-end gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate(`/author-detail?id=${local.authorId}`)}
                disabled={local.saving}
              >
                Batal
              </Button>
              <Button type="submit" disabled={local.saving}>
                {local.saving ? (
                  <>
                    <Upload className="h-4 w-4 mr-2 animate-spin" />
                    Menyimpan...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Simpan Perubahan
                  </>
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </Protected>
  );
};
