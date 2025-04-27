import { EForm } from "@/components/ext/eform/EForm";
import { SideForm } from "@/components/ext/side-form";
import { Button } from "@/components/ui/button";
import { Alert } from "@/components/ui/global-alert";
import { betterAuth } from "@/lib/better-auth";

export default () => {
  const params = new URLSearchParams(location.search);
  const callbackURL = params.get("callbackURL") as (string | undefined);
  return (
    <SideForm sideImage={"/img/side-bg.jpg"}>
      <div className="space-y-6">
        <div className="text-center">
          <h1 className="text-2xl font-semibold">Register</h1>
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
                Alert.info("Konfirmasi password tidak sesuai");
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
                callbackURL
              });

              if (!res.error) {
                Alert.info("Pendaftaran berhasil, silahkan cek email anda");
                if (callbackURL) {
                  window.location.replace(callbackURL);
                  return;
                }
              }

              await Alert.info(res);
              write.loading = false;
            }
          }}
          className="space-y-4"
        >
          {({ Field, read }) => {
            return (
              <>
                <Field name="name" disabled={read.loading} label="Full Name" />
                <Field name="email" disabled={read.loading} />
                <Field
                  name="password"
                  disabled={read.loading}
                  input={{ type: "password" }}
                />
                <Field
                  name="password2"
                  disabled={read.loading}
                  input={{ type: "password" }}
                  label="Confirm Password"
                />

                <Button
                  type="submit"
                  className="w-full"
                  disabled={read.loading}
                >
                  {read.loading ? "Registering..." : "Register"}
                </Button>
              </>
            );
          }}
        </EForm>
      </div>
    </SideForm>
  );
};
