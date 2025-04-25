import { HeroiconsSolidSpeakerphone } from "@/components/icons/HeroiconsSolidSpeakerphone";
import { SimpleLineIconsPencil } from "@/components/icons/SimpleLineIconsPencil";
import { Button } from "@/components/ui/button";
import { navigate } from "@/lib/router";
import { useLocal } from "@/lib/hooks/use-local";
import { betterAuth } from "@/lib/better-auth";
import { Protected } from "@/components/app/protected";

export default async () => {
  const local = useLocal({
    role: null as null | "author" | "publisher",
  });
  const logout = () => {
    betterAuth.signOut();
    navigate("/");
  };
  return (
    <>
      <Protected role={["publisher", "author"]}>
        {!local.role && (
          <>
            <h1 className="text-center text-2xl font-semibold mt-4 mb-8">
              Mendaftar Sebagai Apa?
            </h1>
            <div className="flex gap-4 items-center self-center">
              <div className="text-center">
                <Button onClick={() => (local.role = "author")}>
                  <SimpleLineIconsPencil />
                  Penulis
                </Button>
                <p className="mt-4">
                  Seorang penulis bisa langsung menerbitkan buku atas nama diri
                  sendiri.
                </p>
              </div>
              <div className="text-center">
                <Button onClick={() => (local.role = "publisher")}>
                  <HeroiconsSolidSpeakerphone />
                  Penerbit
                </Button>
                <p className="mt-4">
                  Seorang penerbit bisa menerbitkan buku untuk penerbit-penerbit
                  yang bekerjasama.
                </p>
              </div>
            </div>
          </>
        )}
        {local.role === "author" && (
          <>
            <h1 className="text-center text-2xl font-semibold mt-4 mb-8">
              Mendaftar sebagai Penulis
            </h1>
            <p className="text-center">
              Silahkan isi form pendaftaran penulis di bawah ini.
            </p>
          </>
        )}
        {local.role === "publisher" && (
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
      </Protected>
    </>
  );
};
