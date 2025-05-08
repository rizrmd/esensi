import { baseUrl } from "@/lib/gen/base-url";
import { EForm } from "@/components/ext/eform/EForm";
import { SideForm } from "@/components/ext/side-form";
import { Button } from "@/components/ui/button";
import { Alert } from "@/components/ui/global-alert";
import { betterAuth } from "@/lib/better-auth";
import { navigate } from "@/lib/router";
import { useLocal } from "@/lib/hooks/use-local";
import { translateErrorMessage } from "shared/utils/translate";
import { api } from "@/lib/gen/publish.esensi";

export default () => {
  const local = useLocal(
    {
      callbackURL: undefined as string | undefined,
    },
    async () => {
      const params = new URLSearchParams(location.search);
      local.callbackURL = params.get("callbackURL") as string | undefined;
      if (!local.callbackURL) navigate("/");
      local.render();
    }
  );

  const u = baseUrl;

  return (
    <SideForm sideImage={"/img/side-bg.jpg"}>
      <div className="space-y-6">
        <div className="text-center">
          <h1 className="text-2xl font-semibold">Daftar</h1>
        </div>
        <EForm
          data={{
            name: "",
            email: "",
            password: "",
            password2: "",
            loading: false,
          }}
          onSubmit={async ({ write, read }) => {
            if (!read.loading) {
              if (!read.name || !read.email || !read.password) {
                Alert.info("Isi semua kolom yang wajib");
                return;
              }
              if (read.password !== read.password2) {
                Alert.info("Konfirmasi kata sandi tidak sesuai");
                return;
              }
              if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(read.email)) {
                Alert.info("Email tidak valid");
                return;
              }
              write.loading = true;

              const res = await betterAuth.signUp({
                name: read.name,
                username: read.email,
                password: read.password,
                callbackURL: local.callbackURL,
              });

              if (!res.error) {
                if (res.data) {
                  // Call API to save author profile
                  await api.onboarding({
                    role: "author",
                    user: res.data!.user,
                  });
                }

                Alert.info("Pendaftaran berhasil, silahkan cek email anda");
                if (!local.callbackURL) window.location.replace(u.main_esensi);
                else window.location.replace(local.callbackURL!);
                return;
              }

              // Handle specific error messages in Bahasa Indonesia
              if (res.error) {
                if (res.error.message) {
                  // Map common error messages to user-friendly Bahasa Indonesia messages
                  if (
                    res.error.message.includes("email already exists") ||
                    res.error.message.includes("already in use")
                  ) {
                    Alert.info(
                      "Email ini sudah terdaftar. Silakan gunakan email lain atau coba masuk."
                    );
                  } else if (res.error.message.includes("password")) {
                    Alert.info(
                      "Kata sandi tidak memenuhi persyaratan keamanan. Gunakan minimal 8 karakter dengan kombinasi huruf dan angka."
                    );
                  } else {
                    Alert.info(
                      "Terjadi kesalahan saat mendaftar: " +
                        translateErrorMessage(res.error.message)
                    );
                  }
                } else {
                  Alert.info(
                    "Terjadi kesalahan saat mendaftar. Silakan coba lagi."
                  );
                }
              }

              write.loading = false;
            }
          }}
          className="space-y-4"
        >
          {({ Field, read }) => {
            return (
              <>
                <Field
                  name="name"
                  disabled={read.loading}
                  label="Nama Lengkap"
                />
                <Field name="email" disabled={read.loading} label="Email" />
                <Field
                  name="password"
                  disabled={read.loading}
                  input={{ type: "password" }}
                  label="Kata Sandi"
                />
                <Field
                  name="password2"
                  disabled={read.loading}
                  input={{ type: "password" }}
                  label="Konfirmasi Kata Sandi"
                />

                <Button
                  type="submit"
                  className="w-full"
                  disabled={read.loading}
                >
                  {read.loading ? "Mendaftar..." : "Daftar"}
                </Button>
              </>
            );
          }}
        </EForm>
      </div>
    </SideForm>
  );
};
