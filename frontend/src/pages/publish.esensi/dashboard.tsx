import { Protected } from "@/components/app/protected";
import { Button } from "@/components/ui/button";
import { betterAuth } from "@/lib/better-auth";
import { navigate } from "@/lib/router";
import { AppLogo } from "@/components/app/logo";
import { baseUrl } from "@/lib/gen/base-url";

export default () => {
  const logout = () => betterAuth.signOut().finally(() => navigate("/"));
  const content = (
    <div className="grid min-h-svh">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex justify-center gap-2 md:justify-start">
          <AppLogo />
        </div>
        <div className="flex flex-col items-center rounded-lg bg-accent p-8 text-center md:rounded-xl lg:p-16">
          <h3 className="mb-3 max-w-3xl text-2xl font-semibold md:mb-4 md:text-4xl lg:mb-6">
            Dashboard Publish Esensi Online
          </h3>
          <p className="text-center">
            This is a protected page. You must be authenticated first if you
            want to open this page{" "}
          </p>
          <div className="text-center mt-6">
            <Button onClick={logout}>Logout</Button>
          </div>
        </div>
      </div>
    </div>
  );
  return (
    <Protected role={["publisher", "author"]} redirecURLtIfNotLoggedIn={"/"}>
      {({ user }) => <>{content}</>}
    </Protected>
  );
};
