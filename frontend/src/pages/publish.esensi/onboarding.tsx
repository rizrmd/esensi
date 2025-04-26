import { Protected } from "@/components/app/protected";
import { Button } from "@/components/ui/button";
import { betterAuth } from "@/lib/better-auth";
import { navigate } from "@/lib/router";
import { useState } from "react";

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
  const logout = () => {
    betterAuth.signOut();
    navigate("/");
  };
  let [role, setRole] = useState<null | "author" | "publisher">(null);
  return (
    <>
      <Protected role={["publisher", "author"]}>
        {({ user }) => (
          <>
            <h1 className="text-center text-2xl font-semibold mt-4 mb-8">
              Onboarding Publish Esensi Online {user?.name}
            </h1>
            <div className="py-5">
              {!role && (
                <div className="container">
                  <div className="flex w-full flex-col items-center">
                    <div className="flex flex-col items-center space-y-4 text-center sm:space-y-6 md:max-w-3xl md:text-center">
                      {/* <p className="text-sm text-muted-foreground">ONBOARDING</p> */}
                      <h2 className="text-3xl font-medium md:text-5xl">
                        Mendaftar sebagai apa?
                      </h2>

                      <p className="text-muted-foreground md:max-w-2xl">
                        Silakan pilih peran yang sesuai dengan anda.
                      </p>
                    </div>
                  </div>
                  <div className="mx-auto mt-10 grid max-w-5xl gap-6 md:grid-cols-2">
                    {feature.map((feature, idx) => (
                      <div
                        className="flex flex-col justify-between rounded-lg bg-accent p-6 md:min-h-[200px] md:p-8 cursor-pointer"
                        key={idx}
                        onClick={() =>
                          setRole(feature.role as "author" | "publisher")
                        }
                      >
                        <span className="mb-6 flex size-11 items-center justify-center rounded-full bg-background">
                          {feature.icon}
                        </span>
                        <div>
                          <h3 className="text-lg font-medium md:text-2xl">
                            {feature.title}
                          </h3>
                          <p className="mt-2 text-muted-foreground">
                            {feature.description}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {role === "author" && (
                <>
                  <h1 className="text-center text-2xl font-semibold mt-4 mb-8">
                    Mendaftar sebagai Penulis
                  </h1>
                  <p className="text-center">
                    Silahkan isi form pendaftaran penulis di bawah ini.
                  </p>
                </>
              )}
              {role === "publisher" && (
                <>
                  <h1 className="text-center text-2xl font-semibold mt-4 mb-8">
                    Mendaftar sebagai Penerbit
                  </h1>
                  <p className="text-center">
                    Silahkan isi form pendaftaran penerbit di bawah ini.
                  </p>
                </>
              )}

              <div className="text-center mt-8">
                <Button onClick={logout}>Logout</Button>
              </div>
            </div>
          </>
        )}
      </Protected>
    </>
  );
};
