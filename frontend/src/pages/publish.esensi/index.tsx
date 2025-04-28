import { Protected } from "@/components/app/protected";
import { navigate } from "@/lib/router";
import { Button } from "@/components/ui/button";
import { baseUrl } from "@/lib/gen/base-url";
import { AppLogo } from "@/components/app/logo";

export default () => {
  const u = baseUrl;
  const content = (
    <div className="grid min-h-svh">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex justify-center gap-2 md:justify-start">
          <AppLogo />
        </div>
        <div className="flex flex-col items-center rounded-lg bg-accent p-8 text-center md:rounded-xl lg:p-16">
          <h3 className="mb-3 max-w-3xl text-2xl font-semibold md:mb-4 md:text-4xl lg:mb-6">
            Publish Esensi Online
          </h3>
          <p className="mb-8 max-w-3xl text-muted-foreground lg:text-lg">
            Layanan Publikasi Buku Digital Dari Penulis dan Penerbit Secara
            Online
          </p>
          <div className="flex w-full flex-col justify-center gap-2 sm:flex-row">
            <Button className="w-full sm:w-auto" asChild>
              <a
                href={`${u.auth_esensi}/login?callbackURL=${u.publish_esensi}/dashboard`}
              >
                Login
              </a>
            </Button>
            <Button variant="outline" className="w-full sm:w-auto" asChild>
              <a
                href={`${u.auth_esensi}/register?callbackURL=${u.publish_esensi}/onboarding`}
              >
                Register
              </a>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
  return (
    <>
      <Protected
        role={["publisher", "author"]}
        onLoad={({ user }) => {
          if (user) {
            if (user.id_publisher || user.id_author) {
              navigate("/dashboard");
            }
          } else {
          }
        }}
        fallback={() => content}
      >
        {content}
      </Protected>
    </>
  );
};
