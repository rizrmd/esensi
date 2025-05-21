import { Protected } from "@/components/app/protected";
import { SideForm } from "@/components/ext/side-form";
import { Button } from "@/components/ui/button";
import { baseUrl } from "@/lib/gen/base-url";
import { useLocal } from "@/lib/hooks/use-local";
import { navigate } from "@/lib/router";

export default () => {
  useLocal({}, () => {});

  const content = (
    <SideForm sideImage={"/img/side-bg.jpg"}>
      <div className="space-y-6 w-full">
        <div className="text-center">
          <h1 className="text-2xl font-semibold">Internal Esensi Online</h1>
          <p className="text-muted-foreground mt-2">
            Layanan Publikasi Buku Digital Dari Penulis dan Penerbit Secara
            Online
          </p>
        </div>
        <div className="space-y-4">
          <div className="space-y-2">
            <Button className="w-full" asChild>
              <a
                href={`${baseUrl.auth_esensi}/login?callbackURL=${encodeURIComponent(
                  baseUrl.internal_esensi + "/dashboard"
                )}`}
              >
                Login ke Esensi
              </a>
            </Button>
          </div>
        </div>
      </div>
    </SideForm>
  );

  return (
    <>
      <Protected
        role={["internal"]}
        onLoad={({ user }) => {
          if (user) navigate("/dashboard");
        }}
        fallback={() => content}
      >
        {content}
      </Protected>
    </>
  );
};
