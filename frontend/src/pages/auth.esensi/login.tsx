import { EForm } from "@/components/ext/eform/EForm";
import { SideForm } from "@/components/ext/side-form";
import { Button } from "@/components/ui/button";
import { Alert } from "@/components/ui/global-alert";
import { betterAuth } from "@/lib/better-auth";
import { navigate } from "@/lib/router";

export default () => {
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
              write.loading = true;

              const res = await betterAuth.signIn({
                username: read.username,
                password: read.password,
              });

              if (!res.error) {
                const user = res.data?.user;
                if (user) {
                  navigate(betterAuth.homeUrl(user));
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
                <Field name="username" disabled={read.loading} />
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
