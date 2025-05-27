import { AppLoading } from "@/components/app/loading";
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
import { betterAuth, type User } from "@/lib/better-auth";
import { api as authApi } from "@/lib/gen/auth.esensi";
import { baseUrl } from "@/lib/gen/base-url";
import { api as publishApi } from "@/lib/gen/publish.esensi";
import { useLocal } from "@/lib/hooks/use-local";
import { navigate } from "@/lib/router";
import { getMimeType } from "@/lib/utils";
import { Role } from "backend/api/types";
import type { UploadAPIResponse } from "backend/api/upload";
import { ChevronRight } from "lucide-react";

export const current = {
  user: undefined as User | undefined,
};

export default () => {
  const local = useLocal(
    {
      loading: true,
      error: "",
      success: "",
      isSubmitting: false,
      files: [] as File[],
    },
    async () => {
      const res = await betterAuth.getSession();
      current.user = res.data?.user;
      await loadData();
    }
  );

  async function loadData() {
    if (current.user?.image) {
      try {
        local.loading = true;
        local.render();

        const imageUrl = `${baseUrl.auth_esensi}/${current.user.image}`;
        const response = await fetch(imageUrl);
        const blob = await response.blob();

        const fileName = current.user.image.split("/").pop() || "profile.jpg";
        const extension = fileName.split(".").pop()?.toLowerCase();
        const mimeType = getMimeType(extension);

        const file = new File([blob], fileName, {
          type: mimeType,
          lastModified: new Date().getTime(),
        });
        local.files = [file];
      } catch (error) {
        console.error("Error fetching profile image:", error);
      } finally {
        local.loading = false;
        local.render();
      }
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    local.isSubmitting = true;
    local.error = "";
    local.success = "";
    local.render();

    try {
      if (!current.user?.id) {
        local.error = "ID pengguna tidak ditemukan";
        local.isSubmitting = false;
        local.render();
        return;
      }

      if (local.files.length > 0) {
        const file = local.files[0];
        const formData = new FormData();
        formData.append("file", file);
        const res = await fetch(`${baseUrl.auth_esensi}/api/upload`, {
          method: "POST",
          body: formData,
        });
        const uploaded: UploadAPIResponse = await res.json();
        if (uploaded.name) current.user.image = uploaded.name;
      }

      const res = await authApi.user_update({
        id: current.user.id,
        data: current.user,
      });

      if (res.success && res.data) {
        local.success = "Profil berhasil diperbarui!";
        setTimeout(() => {
          local.success = "";
          local.render();
        }, 3000);
      } else {
        local.error = res.message || "Gagal memperbarui profil.";
      }
    } catch (err) {
      local.error = "Terjadi kesalahan saat menghubungi server.";
      console.error(err);
    } finally {
      local.isSubmitting = false;
      local.render();
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    current.user = {
      ...current.user!,
      [name]: value.trim() === "" && name === "username" ? null : value!,
    };
    local.render();
  };

  if (local.loading) return <AppLoading />;

  return (
    <Protected
      role={[Role.AUTHOR, Role.PUBLISHER]}
      onLoad={async ({ user }) => {
        if (user && !user.idAuthor) await publishApi.register_user({ user });
      }}
      // fallback={({ missing_role }) => {
      //   if (
      //     missing_role.some((x) => x === Role.AUTHOR || x === Role.PUBLISHER)
      //   ) {
      //     navigate("/onboarding");
      //     return <AppLoading />;
      //   }
      //   return null;
      // }}
    >
      <div className="flex min-h-svh flex-col bg-gray-50">
        <PublishMenuBar title="Profil" />

        <main className="flex-1">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
            {local.error ? (
              <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg mb-8 shadow-sm">
                {local.error}
              </div>
            ) : null}

            {local.success ? (
              <div className="bg-green-50 border border-green-200 text-green-700 p-4 rounded-lg mb-8 shadow-sm">
                {local.success}
              </div>
            ) : null}

            <Card className="shadow-md border border-gray-200">
              <CardHeader>
                {/* Breadcrumb Navigation */}
                <nav className="flex items-center text-sm text-gray-600 mb-4">
                  <button
                    onClick={() => navigate("/dashboard")}
                    className="hover:text-blue-600 transition-colors font-medium cursor-pointer"
                  >
                    Beranda
                  </button>
                  <ChevronRight className="h-4 w-4 mx-2 text-gray-400" />
                  <span className="text-gray-800 font-medium">Profil</span>
                </nav>

                {/* Divider line */}
                <div className="border-b border-gray-200 mb-6"></div>

                <CardTitle className="text-xl font-bold">
                  Perbarui Profil
                </CardTitle>
                <CardDescription>
                  Silahkan edit formulir di bawah untuk memperbarui profil Anda.
                </CardDescription>
              </CardHeader>
              <form onSubmit={handleSubmit}>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="name">Nama Lengkap</Label>
                        <Input
                          id="name"
                          name="name"
                          value={current.user?.name || ""}
                          onChange={handleChange}
                          placeholder="Nama lengkap Anda"
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          name="email"
                          value={current.user?.email || ""}
                          onChange={handleChange}
                          placeholder="Email Anda"
                          className="mt-1"
                          disabled
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="username">Username</Label>
                      <Input
                        id="username"
                        name="username"
                        value={current.user?.username || ""}
                        onChange={handleChange}
                        placeholder="Username Anda"
                        className="mt-1"
                      />
                    </div>

                    <div>
                      <Label>Foto Profil</Label>
                      <div className="mt-2 flex items-center gap-4">
                        {current.user?.image || local.files.length > 0 ? (
                          <div className="relative w-20 h-20 rounded-full overflow-hidden border bg-gray-100">
                            <img
                              src={
                                local.files.length > 0
                                  ? URL.createObjectURL(local.files[0])
                                  : `${baseUrl.auth_esensi}/${current.user?.image}`
                              }
                              alt="Foto Profil"
                              className="w-full h-full object-cover"
                            />
                          </div>
                        ) : (
                          <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center">
                            <span className="text-gray-500 text-xs">
                              Tidak ada foto
                            </span>
                          </div>
                        )}
                        <div>
                          <Input
                            id="profile-image"
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                              if (e.target.files && e.target.files.length > 0) {
                                local.files = [e.target.files[0]];
                                local.render();
                              }
                            }}
                            className="max-w-sm"
                          />
                          <p className="text-xs text-gray-500 mt-1">
                            Upload gambar berformat JPG, PNG, atau GIF.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-end space-x-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => navigate("/dashboard")}
                  >
                    Batal
                  </Button>
                  <Button type="submit" disabled={local.isSubmitting}>
                    {local.isSubmitting ? "Menyimpan..." : "Simpan Perubahan"}
                  </Button>
                </CardFooter>
              </form>
            </Card>
          </div>
        </main>
      </div>
    </Protected>
  );
};
