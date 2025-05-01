import { Protected } from "@/components/app/protected";
import { Button } from "@/components/ui/button";
import { betterAuth } from "@/lib/better-auth";
import { navigate } from "@/lib/router";
import { useLocal } from "@/lib/hooks/use-local";
import { SideForm } from "@/components/ext/side-form";

const feature = [
  {
    title: "Penulis",
    description:
      "Seorang penulis bisa langsung menerbitkan buku atas nama diri sendiri.",
    icon: <img src="/img/author.svg" />,
    role: "author",
  },
  {
    title: "Penerbit",
    description:
      "Seorang penerbit bisa menerbitkan buku untuk penerbit-penerbit yang bekerjasama.",
    icon: <img src="/img/publisher.svg" />,
    role: "publisher",
  },
];

export default () => {
  const logout = () => betterAuth.signOut().finally(() => navigate("/"));
  let local = useLocal(
    {
      role: null as null | "author" | "publisher",
    },
    async () => {}
  );

  return (
    <Protected role={["publisher", "author"]} redirecURLtIfNotLoggedIn={"/"}>
      {({ user }) => (
        <SideForm sideImage={"/img/side-bg.jpg"}>
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-semibold mb-4 text-center">
                Mendaftar sebagai apa?
              </h1>

              {!local.role && (
                <div>
                  <div className="flex flex-col items-center mb-6">
                    <p className="text-muted-foreground text-sm text-center">
                      Silakan pilih peran yang sesuai dengan anda.
                    </p>
                  </div>

                  <div className="space-y-4 mt-6">
                    {feature.map((feature, idx) => (
                      <div
                        className="flex flex-col rounded-lg border bg-card p-4 shadow-sm transition-all hover:bg-accent cursor-pointer"
                        key={idx}
                        onClick={() => {
                          local.role = feature.role as "author" | "publisher";
                          local.render();
                        }}
                      >
                        <div className="flex items-center">
                          <span className="flex size-10 items-center justify-center rounded-full bg-background mr-3">
                            {feature.icon}
                          </span>
                          <div>
                            <h3 className="font-medium">{feature.title}</h3>
                            <p className="text-sm text-muted-foreground mt-1">
                              {feature.description}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {local.role === "author" && (
                <div className="space-y-4">
                  <h2 className="text-xl font-semibold text-center">
                    Mendaftar sebagai Penulis
                  </h2>
                  <p className="text-center text-sm text-muted-foreground">
                    Silahkan isi form pendaftaran penulis di bawah ini.
                  </p>

                  {/* Form fields for author will go here */}
                </div>
              )}

              {local.role === "publisher" && (
                <div className="space-y-4">
                  <h2 className="text-xl font-semibold text-center">
                    Mendaftar sebagai Penerbit
                  </h2>
                  <p className="text-center text-sm text-muted-foreground">
                    Silahkan isi form pendaftaran penerbit di bawah ini.
                  </p>

                  {/* Form fields for publisher will go here */}
                </div>
              )}

              <div className="text-center mt-8">
                {local.role && (
                  <Button
                    variant="outline"
                    className="mr-2"
                    onClick={() => {
                      local.role = null;
                      local.render();
                    }}
                  >
                    Kembali
                  </Button>
                )}
                <Button onClick={logout}>Keluar</Button>
              </div>
            </div>
          </div>
        </SideForm>
      )}
    </Protected>
  );
};
