import { EForm } from "@/components/ext/eform/EForm";
import { SideForm } from "@/components/ext/side-form";
import { Button } from "@/components/ui/button";
import { Alert } from "@/components/ui/global-alert";
import { betterAuth } from "@/lib/better-auth";

export default () => {
  return (
    <SideForm sideImage={"/img/side-bg.jpg"}>
      <div className="space-y-6">
        <div className="text-center">
          <h1 className="text-2xl font-semibold">Login</h1>
        </div>
        {/* {error && (
          <div className="bg-red-50 text-red-500 p-3 rounded-md text-sm">
            {error}
          </div>
        )} */}
        <EForm
          data={{ username: "", password: "", loading: false }}
          onSubmit={async ({ write, read }) => {
            if (!read.loading) {
              write.loading = true;

              //todo: do actual login here
              const res = await betterAuth.signIn({
                username: read.username,
                password: read.password,
              });

              Alert.info(res)
              write.loading = false;
            }
          }}
          className="space-y-4"
        >
          {({ Field, read }) => {
            return (
              <>
                <Field name="username" />
                <Field name="password" input={{ type: "password" }} />

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
