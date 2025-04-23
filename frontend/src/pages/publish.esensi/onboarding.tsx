import { Button } from "@/components/ui/button";
import { useState } from "react";

export default () => {
  let [role, setRole] = useState<null | "author" | "publisher">(null);
  return (
    <>
      {!role && (
        <>
          <h1 className="text-center text-2xl font-semibold mt-4 mb-8">
            Mendaftar Sebagai Apa?
          </h1>
          <div className="flex gap-4 items-center self-center">
            <div className="text-center">
              <Button onClick={() => setRole("author")}>Penulis</Button>
              <p className="mt-4">
                Seorang penulis bisa langsung menerbitkan buku atas nama diri
                sendiri.
              </p>
            </div>
            <div className="text-center">
              <Button onClick={() => setRole("publisher")}>Penerbit</Button>
              <p className="mt-4">
                Seorang penerbit bisa menerbitkan buku untuk penerbit-penerbit
                yang bekerjasama.
              </p>
            </div>
          </div>
        </>
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
    </>
  );
};
