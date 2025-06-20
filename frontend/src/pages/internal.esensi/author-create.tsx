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
      loading: false,
      uploading: false,
      error: "",
      success: false,
    },
    async () => {
      // Initialize form
    }
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!local.form.name.trim()) {
      local.error = "Nama penulis wajib diisi";
      local.render();
      return;
    }

    try {
      local.loading = true;
      local.error = "";
      local.render();

      const result = await api.author_create({
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
          navigate("/manage-author");
        }, 1500);
      }
    } catch (error: any) {
      console.error("Error creating author:", error);
      local.error = error.message || "Terjadi kesalahan saat membuat penulis";
    } finally {
      local.loading = false;
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

  const updateConfigValue = (key: string, value: string) => {
    local.form.cfg[key] = value;
    local.render();
  };

  if (local.success) {
    return (
      <Protected role={Role.INTERNAL}>
        <div className="flex flex-col min-h-screen bg-background">
          <MenuBarInternal />
          <div className="flex-1 flex items-center justify-center">
            <Card className="w-full max-w-md">
              <CardContent className="text-center py-8">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg
                    className="w-8 h-8 text-green-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold mb-2">
                  Penulis Berhasil Dibuat!
                </h3>
                <p className="text-muted-foreground">
                  Anda akan diarahkan ke halaman kelola penulis...
                </p>
              </CardContent>
            </Card>
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
          <div className="max-w-2xl mx-auto">
            <div className="mb-8">
              <Button
                variant="ghost"
                onClick={() => navigate("/manage-author")}
                className="mb-4"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Kembali ke Kelola Penulis
              </Button>

              <h1 className="text-3xl font-bold">Tambah Penulis Baru</h1>
              <p className="text-muted-foreground mt-2">
                Isi formulir di bawah untuk menambahkan penulis baru ke sistem
              </p>
            </div>

            {local.error && <Error msg={local.error} loading={false} />}

            <form onSubmit={handleSubmit}>
              <Card>
                <CardHeader>
                  <CardTitle>Informasi Penulis</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Avatar Upload */}
                  <div className="space-y-2">
                    <Label>Foto Profil</Label>
                    <div className="flex items-center gap-4">
                      <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center overflow-hidden">
                        {local.form.avatar ? (
                          <img
                            src={local.form.avatar}
                            alt="Avatar"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <UserIcon className="h-8 w-8 text-muted-foreground" />
                        )}
                      </div>
                      <div className="flex-1">
                        <Input
                          type="file"
                          accept="image/*"
                          onChange={handleAvatarUpload}
                          disabled={local.uploading}
                          className="hidden"
                          id="avatar-upload"
                        />
                        <Label
                          htmlFor="avatar-upload"
                          className="cursor-pointer"
                        >
                          <Button
                            type="button"
                            variant="outline"
                            disabled={local.uploading}
                            className="w-full"
                            asChild
                          >
                            <span>
                              <Upload className="h-4 w-4 mr-2" />
                              {local.uploading
                                ? "Mengupload..."
                                : "Upload Foto"}
                            </span>
                          </Button>
                        </Label>
                        <p className="text-xs text-muted-foreground mt-1">
                          Format: JPG, PNG. Maksimal 2MB.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Name */}
                  <div className="space-y-2">
                    <Label htmlFor="name">Nama Penulis *</Label>
                    <Input
                      id="name"
                      value={local.form.name}
                      onChange={(e) => {
                        local.form.name = e.target.value;
                        local.render();
                      }}
                      placeholder="Masukkan nama lengkap penulis"
                      required
                    />
                  </div>

                  {/* Biography */}
                  <div className="space-y-2">
                    <Label htmlFor="biography">Biografi</Label>
                    <Textarea
                      id="biography"
                      value={local.form.biography}
                      onChange={(e) => {
                        local.form.biography = e.target.value;
                        local.render();
                      }}
                      placeholder="Ceritakan tentang penulis, latar belakang, pengalaman, dll."
                      rows={4}
                    />
                  </div>

                  {/* Social Media */}
                  <div className="space-y-2">
                    <Label htmlFor="social_media">Media Sosial</Label>
                    <Input
                      id="social_media"
                      value={local.form.social_media}
                      onChange={(e) => {
                        local.form.social_media = e.target.value;
                        local.render();
                      }}
                      placeholder="Link Instagram, Twitter, website personal, dll."
                    />
                  </div>

                  {/* Account ID */}
                  <div className="space-y-2">
                    <Label htmlFor="id_account">ID Akun (Opsional)</Label>
                    <Input
                      id="id_account"
                      value={local.form.id_account}
                      onChange={(e) => {
                        local.form.id_account = e.target.value;
                        local.render();
                      }}
                      placeholder="ID akun yang terkait dengan penulis"
                    />
                    <p className="text-xs text-muted-foreground">
                      Jika penulis sudah memiliki akun di sistem
                    </p>
                  </div>

                  {/* User ID */}
                  <div className="space-y-2">
                    <Label htmlFor="id_user">ID User (Opsional)</Label>
                    <Input
                      id="id_user"
                      value={local.form.id_user}
                      onChange={(e) => {
                        local.form.id_user = e.target.value;
                        local.render();
                      }}
                      placeholder="ID user yang terkait dengan penulis"
                    />
                    <p className="text-xs text-muted-foreground">
                      Jika penulis sudah terdaftar sebagai user
                    </p>
                  </div>

                  {/* Configuration */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label>Konfigurasi Tambahan</Label>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={addConfigField}
                      >
                        Tambah Konfigurasi
                      </Button>
                    </div>
                    {Object.keys(local.form.cfg).length > 0 && (
                      <div className="space-y-3 p-4 border rounded-lg bg-muted/50">
                        {Object.entries(local.form.cfg).map(([key, value]) => (
                          <div key={key} className="flex items-center gap-2">
                            <Input value={key} disabled className="w-32" />
                            <Input
                              value={value as string}
                              onChange={(e) =>
                                updateConfigValue(key, e.target.value)
                              }
                              placeholder="Nilai konfigurasi"
                            />
                            <Button
                              type="button"
                              variant="destructive"
                              size="sm"
                              onClick={() => removeConfigField(key)}
                            >
                              Hapus
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                    <p className="text-xs text-muted-foreground">
                      Konfigurasi khusus untuk penulis ini
                    </p>
                  </div>

                  <div className="flex gap-4 pt-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => navigate("/manage-author")}
                      className="flex-1"
                    >
                      Batal
                    </Button>
                    <Button
                      type="submit"
                      disabled={local.loading || !local.form.name.trim()}
                      className="flex-1"
                    >
                      {local.loading ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                          Menyimpan...
                        </>
                      ) : (
                        <>
                          <Save className="h-4 w-4 mr-2" />
                          Simpan Penulis
                        </>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </form>
          </div>
        </div>
      </div>
    </Protected>
  );
};
