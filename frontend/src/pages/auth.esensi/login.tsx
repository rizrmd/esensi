import { baseUrl } from "@/lib/gen/base-url";
import { EForm } from "@/components/ext/eform/EForm";
import { SideForm } from "@/components/ext/side-form";
import { Button } from "@/components/ui/button";
import { Alert } from "@/components/ui/global-alert";
import { betterAuth } from "@/lib/better-auth";
import { navigate } from "@/lib/router";

export default () => {
  const u = baseUrl;
  const params = new URLSearchParams(location.search);
  const callbackURL = params.get("callbackURL") as string | undefined;
  if (!callbackURL) navigate("/");
  return (
    <SideForm sideImage={"/img/side-bg.jpg"}>
      <div className="space-y-6">
        <div className="text-center">
          <h1 className="text-2xl font-semibold">Login</h1>
        </div>
        <EForm
          data={{ username: "", password: "", loading: false }}
          onSubmit={async ({ write, read }) => {
            if (!read.loading) {
              if (!read.username || !read.password) {
                Alert.info("Isi semua kolom");
                return;
              }
              write.loading = true;

              const res = await betterAuth.signIn({
                username: read.username,
                password: read.password,
                callbackURL,
              });

              if (!res.error) {
                if (!callbackURL) window.location.replace(u.main_esensi);
                else window.location.replace(callbackURL!);
                return;
              }
              if (res.error) {
                Alert.info(res.error.message);
                if (!callbackURL) window.location.replace(u.main_esensi);
                else {
                  navigate(
                    "/email-verification?callbackURL=" +
                      callbackURL +
                      "&username=" +
                      read.username
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
                  name="username"
                  disabled={read.loading}
                  label="Email or username"
                />
                <Field
                  name="password"
                  disabled={read.loading}
                  input={{ type: "password" }}
                />

                <Button
                  type="submit"
                  className="w-full"
                  disabled={read.loading}
                >
                  {read.loading ? "Logging in..." : "Login"}
                </Button>
              </>
            );
          }}
        </EForm>
      </div>
    </SideForm>
  );
};
