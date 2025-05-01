import { Protected } from "@/components/app/protected";
import { Button } from "@/components/ui/button";
import { betterAuth } from "@/lib/better-auth";
import { navigate } from "@/lib/router";
import { useLocal } from "@/lib/hooks/use-local";
import { SideForm } from "@/components/ext/side-form";
import { toast } from "sonner";
import { Alert } from "@/components/ui/global-alert";
import { api as publishEsensiApi } from "@/lib/gen/publish.esensi";

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
      isRegistering: false,
      registrationSuccess: false,
      message: "",
      user: null as any,
    },
    async () => {
      // Get user session on component initialization
      const { data } = await betterAuth.getSession();
      if (data && data.user) {
        local.user = data.user;
        local.render();
      }
    }
  );

  const registerRole = async () => {
    if (!local.role || !local.user) return;

    try {
      local.isRegistering = true;
      local.render();

      // Call the API to register the user role
      const res = await publishEsensiApi.onboarding({
        role: local.role,
        user: local.user,
      });

      if (res.success) {
        local.registrationSuccess = true;
        local.message = res.message;

        // Show success toast
        toast.success(res.message);

        // Redirect to dashboard after a short delay
        setTimeout(() => {
          navigate("/publish.esensi/dashboard");
        }, 2000);
      } else {
        // Show error message
        Alert.info(res.message || "Terjadi kesalahan saat mendaftarkan peran");
      }
    } catch (error) {
      console.error("Error registering role:", error);
      Alert.info("Terjadi kesalahan saat mendaftarkan peran");
    } finally {
      local.isRegistering = false;
      local.render();
    }
  };

  return (
    <Protected role={["publisher", "author"]} redirecURLtIfNotLoggedIn={"/"}>
      {({ user }) => (
        <SideForm sideImage={"/img/side-bg.jpg"}>
          <div className="space-y-6">
            <div className="flex items-center justify-start mb-6">
              <div className="flex h-9 w-9 items-center justify-center">
                <img
                  src="/img/logo.webp"
                  alt="Esensi Online"
                  className="h-8 w-8"
                />
              </div>
              <span className="ml-2 font-medium">Esensi Online</span>
            </div>

            <div>
              <h1 className="text-2xl font-semibold mb-4 text-center">
                Onboarding Publish Esensi Online
              </h1>

              {!local.role && !local.registrationSuccess && (
                <div>
                  <div className="flex flex-col items-center mb-6">
                    <h2 className="text-xl font-medium mb-2">
                      Mendaftar sebagai apa?
                    </h2>
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

              {local.role === "author" && !local.registrationSuccess && (
                <div className="space-y-4">
                  <h2 className="text-xl font-semibold text-center">
                    Mendaftar sebagai Penulis
                  </h2>
                  <p className="text-center text-sm text-muted-foreground">
                    Anda akan terdaftar sebagai penulis dengan nama "
                    {local.user?.name}".
                  </p>
                  <p className="text-center text-sm">
                    Silakan konfirmasi untuk melanjutkan.
                  </p>

                  <div className="flex justify-center mt-4">
                    <Button
                      variant="outline"
                      className="mr-2"
                      onClick={() => {
                        local.role = null;
                        local.render();
                      }}
                      disabled={local.isRegistering}
                    >
                      Kembali
                    </Button>
                    <Button
                      onClick={registerRole}
                      disabled={local.isRegistering}
                    >
                      {local.isRegistering ? "Mendaftarkan..." : "Konfirmasi"}
                    </Button>
                  </div>
                </div>
              )}

              {local.role === "publisher" && !local.registrationSuccess && (
                <div className="space-y-4">
                  <h2 className="text-xl font-semibold text-center">
                    Mendaftar sebagai Penerbit
                  </h2>
                  <p className="text-center text-sm text-muted-foreground">
                    Anda akan terdaftar sebagai penerbit dengan nama "
                    {local.user?.name}".
                  </p>
                  <p className="text-center text-sm">
                    Silakan konfirmasi untuk melanjutkan.
                  </p>

                  <div className="flex justify-center mt-4">
                    <Button
                      variant="outline"
                      className="mr-2"
                      onClick={() => {
                        local.role = null;
                        local.render();
                      }}
                      disabled={local.isRegistering}
                    >
                      Kembali
                    </Button>
                    <Button
                      onClick={registerRole}
                      disabled={local.isRegistering}
                    >
                      {local.isRegistering ? "Mendaftarkan..." : "Konfirmasi"}
                    </Button>
                  </div>
                </div>
              )}

              {local.registrationSuccess && (
                <div className="space-y-4 py-4">
                  <div className="text-center flex flex-col items-center">
                    <div className="mb-4 size-16 flex items-center justify-center rounded-full bg-green-100">
                      <svg
                        width="32"
                        height="32"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M20 6L9 17L4 12"
                          stroke="green"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div>
                    <h2 className="text-xl font-semibold">
                      Pendaftaran Berhasil!
                    </h2>
                    <p className="text-muted-foreground mt-2">
                      {local.message}
                    </p>
                    <p className="text-muted-foreground mt-1">
                      Anda akan dialihkan ke dashboard...
                    </p>
                  </div>
                </div>
              )}

              {!local.registrationSuccess && (
                <div className="text-center mt-8">
                  <Button
                    variant="outline"
                    onClick={logout}
                    disabled={local.isRegistering}
                  >
                    Keluar
                  </Button>
                </div>
              )}
            </div>
          </div>
        </SideForm>
      )}
    </Protected>
  );
};
