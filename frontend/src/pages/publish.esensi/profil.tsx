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
import {
  betterAuth,
  type AuthClientGetSessionAPIResponse,
  type User,
} from "@/lib/better-auth";
import { api as authApi } from "@/lib/gen/auth.esensi";
import { baseUrl } from "@/lib/gen/base-url";
import { api as publishApi } from "@/lib/gen/publish.esensi";
import { useLocal } from "@/lib/hooks/use-local";
import { navigate } from "@/lib/router";
import type { UploadAPIResponse } from "backend/api/upload";
import type { auth_user } from "shared/models";

export default () => {
  const local = useLocal(
    {
      user: null as Partial<User> | null,
      userData: {} as Partial<auth_user>,
      loading: true,
      error: "",
      success: "",
      isSubmitting: false,
      files: [] as File[],
    },
    async () => {
      try {
        const session: AuthClientGetSessionAPIResponse =
          await betterAuth.getSession();
        if (!session.data?.user) {
          navigate("/");
          return;
        }
        local.user = session.data.user;
        await publishApi.register_user({ user: session.data!.user });

        // Fetch user data
        if (session.data.user.id) {
          const userResponse = await authApi.auth_user({
            username: session.data.user.email || "",
          });

          if (userResponse) {
            local.userData = userResponse;

            // Create a File object from the profile image URL if available
            if (userResponse.image) {
              try {
                const imageUrl = `${baseUrl.auth_esensi}/${userResponse.image}`;
                const response = await fetch(imageUrl);
                const blob = await response.blob();
                const fileName =
                  userResponse.image.split("/").pop() || "profile.jpg";

                // Create a File object from the Blob
                const file = new File([blob], fileName, {
                  type: blob.type,
                  lastModified: new Date().getTime(),
                });

                local.files = [file];
              } catch (error) {
                console.error("Error fetching profile image:", error);
              }
            }
          } else {
            local.error = "Gagal memuat data pengguna";
          }
        }

        local.loading = false;
        local.render();
      } catch (error) {
        console.error("Error loading profile:", error);
        local.error = "Terjadi kesalahan saat memuat profil";
        local.loading = false;
        local.render();
      }
    }
  );

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    local.isSubmitting = true;
    local.error = "";
    local.success = "";
    local.render();

    try {
      if (!local.user?.id) {
        local.error = "ID pengguna tidak ditemukan";
        local.isSubmitting = false;
        local.render();
        return;
      }

      // Upload profile image if available
      if (local.files.length > 0) {
        const file = local.files[0];
        const formData = new FormData();
        formData.append("file", file);
        const res = await fetch(`${baseUrl.auth_esensi}/api/upload`, {
          method: "POST",
          body: formData,
        });
        const uploaded: UploadAPIResponse = await res.json();
        if (uploaded.name) local.userData.image = uploaded.name;
      }

      const res = await authApi.user_update({
        id: local.user.id,
        data: local.userData as auth_user,
      });

      if (res.success && res.data) {
        local.success = "Profil berhasil diperbarui!";
        // Update session data if necessary
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
    local.userData = {
      ...local.userData,
      [name]: value.trim() === "" && name === "username" ? null : value,
    };
    local.render();
  };

  if (local.loading) {
    return <AppLoading />;
  }

  return (
    <Protected
      role={["publisher", "author"]}
      fallback={({ missing_role }) => {
        if (
          missing_role.includes("publisher") ||
          missing_role.includes("author")
        ) {
          navigate("/onboarding");
          return <AppLoading />;
        }
      }}
    >
      {({ user }) => (
        <div className="flex min-h-svh flex-col bg-gray-50">
          <PublishMenuBar title="Profil" />
          {/* Main Content */}
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
                  <CardTitle className="text-xl font-bold">
                    Edit Profil
                  </CardTitle>
                  <CardDescription>
                    Silahkan edit formulir di bawah untuk memperbarui profil
                    Anda.
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
                            value={local.userData.name || ""}
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
                            value={local.userData.email || ""}
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
                          value={local.userData.username || ""}
                          onChange={handleChange}
                          placeholder="Username Anda"
                          className="mt-1"
                        />
                      </div>

                      <div>
                        <Label>Foto Profil</Label>
                        <div className="mt-2 flex items-center gap-4">
                          {local.userData.image || local.files.length > 0 ? (
                            <div className="relative w-20 h-20 rounded-full overflow-hidden border bg-gray-100">
                              <img
                                src={
                                  local.files.length > 0
                                    ? URL.createObjectURL(local.files[0])
                                    : `${baseUrl.auth_esensi}/${local.userData.image}`
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
                                if (
                                  e.target.files &&
                                  e.target.files.length > 0
                                ) {
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
      )}
    </Protected>
  );
};
