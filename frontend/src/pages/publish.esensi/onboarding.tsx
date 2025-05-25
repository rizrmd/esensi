import { Protected } from "@/components/app/protected";
import { PublishMenuBar } from "@/components/publish/menu-bar";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { betterAuth, type User } from "@/lib/better-auth";
import { api } from "@/lib/gen/publish.esensi";
import { useLocal } from "@/lib/hooks/use-local";
import { navigate } from "@/lib/router";
import type { FormEvent } from "react";

export const current = {
  user: undefined as User | undefined,
};

export default () => {
  const local = useLocal(
    {
      submitting: false,
      role: "author", // Default to author
      formData: {
        publisher: {
          name: "",
          description: "",
          website: "",
          address: "",
          logo: null as File | null,
          logoPreview: "",
        },
        author: {
          name: "",
          bio: "",
          socmed: "",
          avatar: null as File | null,
          avatarPreview: "",
        },
      },
      error: "",
      success: "",
    },
    async () => {
      const res = await betterAuth.getSession();
      current.user = res.data?.user;
    }
  );

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (local.submitting) return;

    local.submitting = true;
    local.error = "";
    local.success = "";
    local.render();

    try {
      if (local.role === "publisher") {
        const publisherData = local.formData.publisher;

        if (!publisherData.name) {
          local.error = "Nama penerbit harus diisi";
          local.submitting = false;
          local.render();
          return;
        }

        // First save the basic profile information
        const result = await api.onboarding({
          role: "publisher",
          user: current.user!,
        });

        if (result.success) {
          // If we need to handle file uploads, we'd need to create another API endpoint
          // for handling file uploads specifically

          local.success = "Profil penerbit berhasil dibuat";
          // Redirect to dashboard after successful onboarding
          setTimeout(() => {
            navigate("/dashboard");
          }, 2000);
        } else {
          local.error = result.message || "Gagal membuat profil penerbit";
        }
      } else {
        const authorData = local.formData.author;

        if (!authorData.name) {
          local.error = "Nama penulis harus diisi";
          local.submitting = false;
          local.render();
          return;
        }

        // Call API to save author profile
        const result = await api.onboarding({
          role: "author",
          user: current.user!,
        });

        if (result.success) {
          // If we need to handle file uploads, we'd need to create another API endpoint

          local.success = "Profil penulis berhasil dibuat";
          // Redirect to dashboard after successful onboarding
          setTimeout(() => {
            navigate("/dashboard");
          }, 2000);
        } else {
          local.error = result.message || "Gagal membuat profil penulis";
        }
      }
    } catch (error) {
      console.error("Error in onboarding:", error);
      local.error = "Terjadi kesalahan saat menyimpan profil";
    } finally {
      local.submitting = false;
      local.render();
    }
  };

  const handleImageUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    type: "logo" | "avatar"
  ) => {
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
      if (type === "logo") {
        local.formData.publisher.logo = file;
        local.formData.publisher.logoPreview = reader.result as string;
      } else {
        local.formData.author.avatar = file;
        local.formData.author.avatarPreview = reader.result as string;
      }
      local.render();
    };
    reader.readAsDataURL(file);
  };

  return (
    <Protected
      onLoad={({ user }) => {
        if (user) {
          if (user?.idAuthor || user?.idPublisher) {
            navigate("/dashboard");
            return;
          }
        }
      }}
    >
      <div className="flex min-h-svh flex-col">
        <PublishMenuBar />

        <div className="flex-1 container py-6 md:py-10">
          <div className="max-w-3xl mx-auto">
            <Card>
              <CardHeader>
                <CardTitle>Selamat Datang di Platform Penerbitan</CardTitle>
                <CardDescription>
                  Lengkapi profil Anda untuk mulai menerbitkan dan mengelola
                  buku.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs
                  value={local.role}
                  onValueChange={(value) => {
                    local.role = value;
                    local.render();
                  }}
                  className="w-full"
                >
                  <TabsList className="grid grid-cols-2 mb-8">
                    <TabsTrigger value="publisher">Saya Penerbit</TabsTrigger>
                    <TabsTrigger value="author">Saya Penulis</TabsTrigger>
                  </TabsList>

                  {local.error && (
                    <div className="bg-red-50 text-red-700 p-3 rounded-md mb-6">
                      {local.error}
                    </div>
                  )}

                  {local.success && (
                    <div className="bg-green-50 text-green-700 p-3 rounded-md mb-6">
                      {local.success}
                    </div>
                  )}

                  <TabsContent value="publisher">
                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div className="grid md:grid-cols-[1fr_auto] gap-6">
                        <div className="space-y-4">
                          <div>
                            <Label htmlFor="publisher-name">
                              Nama Penerbit
                            </Label>
                            <Input
                              id="publisher-name"
                              value={local.formData.publisher.name}
                              onChange={(e) => {
                                local.formData.publisher.name = e.target.value;
                                local.render();
                              }}
                              placeholder="Masukkan nama penerbit"
                              className="mt-1"
                              required
                            />
                          </div>

                          <div>
                            <Label htmlFor="publisher-desc">Deskripsi</Label>
                            <textarea
                              id="publisher-desc"
                              value={local.formData.publisher.description}
                              onChange={(e) => {
                                local.formData.publisher.description =
                                  e.target.value;
                                local.render();
                              }}
                              placeholder="Sekilas tentang penerbit Anda"
                              className="mt-1 flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                            />
                          </div>

                          <div>
                            <Label htmlFor="publisher-website">Website</Label>
                            <Input
                              id="publisher-website"
                              value={local.formData.publisher.website}
                              onChange={(e) => {
                                local.formData.publisher.website =
                                  e.target.value;
                                local.render();
                              }}
                              placeholder="https://website-penerbit.com"
                              className="mt-1"
                            />
                          </div>

                          <div>
                            <Label htmlFor="publisher-address">Alamat</Label>
                            <textarea
                              id="publisher-address"
                              value={local.formData.publisher.address}
                              onChange={(e) => {
                                local.formData.publisher.address =
                                  e.target.value;
                                local.render();
                              }}
                              placeholder="Alamat lengkap kantor penerbit"
                              className="mt-1 flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                            />
                          </div>
                        </div>

                        <div>
                          <Label htmlFor="publisher-logo">Logo Penerbit</Label>
                          <div className="mt-1 border rounded-lg overflow-hidden bg-muted/50 w-40 h-40 flex items-center justify-center relative">
                            {local.formData.publisher.logoPreview ? (
                              <>
                                <img
                                  src={local.formData.publisher.logoPreview}
                                  alt="Logo Preview"
                                  className="w-full h-full object-contain"
                                />
                                <Button
                                  type="button"
                                  variant="destructive"
                                  size="sm"
                                  className="absolute top-2 right-2"
                                  onClick={() => {
                                    local.formData.publisher.logo = null;
                                    local.formData.publisher.logoPreview = "";
                                    local.render();
                                  }}
                                >
                                  Hapus
                                </Button>
                              </>
                            ) : (
                              <div className="text-center p-4">
                                <div className="text-3xl mb-2">🏢</div>
                                <p className="text-muted-foreground text-sm mb-4">
                                  Unggah logo
                                </p>
                                <Label
                                  htmlFor="logoUpload"
                                  className="cursor-pointer"
                                >
                                  <span className="bg-primary text-primary-foreground px-3 py-2 rounded-md text-sm">
                                    Pilih Gambar
                                  </span>
                                  <Input
                                    id="logoUpload"
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={(e) =>
                                      handleImageUpload(e, "logo")
                                    }
                                  />
                                </Label>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      <Button
                        type="submit"
                        className="w-full"
                        disabled={local.submitting}
                      >
                        {local.submitting
                          ? "Memproses..."
                          : "Daftar Sebagai Penerbit"}
                      </Button>
                    </form>
                  </TabsContent>

                  <TabsContent value="author">
                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div className="grid md:grid-cols-[1fr_auto] gap-6">
                        <div className="space-y-4">
                          <div>
                            <Label htmlFor="author-name">Nama Penulis</Label>
                            <Input
                              id="author-name"
                              value={local.formData.author.name}
                              onChange={(e) => {
                                local.formData.author.name = e.target.value;
                                local.render();
                              }}
                              placeholder="Masukkan nama penulis"
                              className="mt-1"
                              required
                            />
                          </div>

                          <div>
                            <Label htmlFor="author-bio">Biografi</Label>
                            <textarea
                              id="author-bio"
                              value={local.formData.author.bio}
                              onChange={(e) => {
                                local.formData.author.bio = e.target.value;
                                local.render();
                              }}
                              placeholder="Ceritakan tentang diri Anda sebagai penulis"
                              rows={4}
                              className="mt-1 flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                            />
                          </div>

                          <div>
                            <Label htmlFor="author-socmed">Media Sosial</Label>
                            <Input
                              id="author-socmed"
                              value={local.formData.author.socmed}
                              onChange={(e) => {
                                local.formData.author.socmed = e.target.value;
                                local.render();
                              }}
                              placeholder="Instagram, Twitter, atau website pribadi"
                              className="mt-1"
                            />
                          </div>
                        </div>

                        <div>
                          <Label htmlFor="author-avatar">Foto Profil</Label>
                          <div className="mt-1 border rounded-lg overflow-hidden bg-muted/50 w-40 h-40 flex items-center justify-center relative">
                            {local.formData.author.avatarPreview ? (
                              <>
                                <img
                                  src={local.formData.author.avatarPreview}
                                  alt="Avatar Preview"
                                  className="w-full h-full object-cover"
                                />
                                <Button
                                  type="button"
                                  variant="destructive"
                                  size="sm"
                                  className="absolute top-2 right-2"
                                  onClick={() => {
                                    local.formData.author.avatar = null;
                                    local.formData.author.avatarPreview = "";
                                    local.render();
                                  }}
                                >
                                  Hapus
                                </Button>
                              </>
                            ) : (
                              <div className="text-center p-4">
                                <div className="text-3xl mb-2">👤</div>
                                <p className="text-muted-foreground text-sm mb-4">
                                  Unggah foto
                                </p>
                                <Label
                                  htmlFor="avatarUpload"
                                  className="cursor-pointer"
                                >
                                  <span className="bg-primary text-primary-foreground px-3 py-2 rounded-md text-sm">
                                    Pilih Gambar
                                  </span>
                                  <Input
                                    id="avatarUpload"
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={(e) =>
                                      handleImageUpload(e, "avatar")
                                    }
                                  />
                                </Label>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      <Button
                        type="submit"
                        className="w-full"
                        disabled={local.submitting}
                      >
                        {local.submitting
                          ? "Memproses..."
                          : "Daftar Sebagai Penulis"}
                      </Button>
                    </form>
                  </TabsContent>
                </Tabs>
              </CardContent>
              <CardFooter className="border-t bg-muted/50 flex justify-between">
                <div className="text-sm text-muted-foreground">
                  * Anda bisa mengubah informasi ini nanti di halaman profil
                </div>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </Protected>
  );
};
