import { Protected } from "@/components/app/protected";
import { AppLogo } from "@/components/app/logo";
import { AppLoading } from "@/components/app/loading";
import { Button } from "@/components/ui/button";
import { navigate } from "@/lib/router";
import { betterAuth } from "@/lib/better-auth";
import { api } from "@/lib/gen/publish.esensi";
import { useEffect, type FormEvent } from "react";
import { useSnapshot } from "valtio";
import { bookProcessState, bookProcessWrite } from "@/lib/states/book-state";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";

import { BookForm } from "@/components/publish/book/book-form"; // Updated path
import { BookContent } from "@/components/publish/book/book-content"; // Updated path
import { BookPreview } from "@/components/publish/book/book-preview"; // Updated path
import { PublishMenuBar } from "@/components/publish/menu-bar";

// Helper function to convert File to base64 data URL
const fileToDataUrl = (file: File | Blob): Promise<string> =>
  new Promise((resolve, reject) => {
    if (!file || !(file instanceof Blob)) {
      reject(new TypeError("Argument is not a Blob or File object."));
      return;
    }
    
    try {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
      reader.readAsDataURL(file);
    } catch (error) {
      console.error("Error in fileToDataUrl:", error);
      reject(error);
    }
  });

export default () => {
  const read = useSnapshot(bookProcessWrite);
  const logout = () => betterAuth.signOut().finally(() => navigate("/"));

  useEffect(() => {
    bookProcessState.reset(); // Reset to initial state for a new book
    bookProcessWrite.pageLoading = true;

    const initializePage = async () => {
      try {
        const session = await betterAuth.getSession();
        if (!session.data?.user) {
          navigate("/");
          return;
        }
        bookProcessWrite.pageLoading = false;
      } catch (error) {
        console.error("Error loading create book page:", error);
        bookProcessState.setPageError("Gagal memuat data halaman.");
        bookProcessWrite.pageLoading = false;
      }
    };

    initializePage();

    return () => {
      bookProcessState.reset(); // Clean up state on component unmount
    };
  }, []);

  const handleInfoSubmit = () => {
    bookProcessWrite.activeTab = "content";
  };

  const handleContentSubmit = () => {
    bookProcessWrite.activeTab = "preview";
  };

  const handlePublish = async (e: FormEvent) => {
    e.preventDefault();

    if (read.pageSaving) return;

    bookProcessWrite.pageSaving = true;
    bookProcessState.clearPageError();
    bookProcessState.clearPageSuccessMessage();

    try {
      const session = await betterAuth.getSession();
      if (!session.data?.user) {
        bookProcessState.setPageError("Sesi tidak valid atau telah berakhir. Silakan masuk kembali.");
        bookProcessWrite.pageSaving = false;
        return;
      }

      if (!read.title.trim()) {
        bookProcessState.setPageError("Judul buku harus diisi sebelum menerbitkan.");
        bookProcessWrite.activeTab = "info";
        bookProcessWrite.pageSaving = false;
        return;
      }
      if (!read.description.trim()) {
        bookProcessState.setPageError("Deskripsi buku harus diisi sebelum menerbitkan.");
        bookProcessWrite.activeTab = "info";
        bookProcessWrite.pageSaving = false;
        return;
      }
      if (read.categories.length === 0) {
        bookProcessState.setPageError("Minimal satu kategori harus dipilih.");
        bookProcessWrite.activeTab = "info";
        bookProcessWrite.pageSaving = false;
        return;
      }
      if (!read.price) {
        bookProcessState.setPageError("Harga buku harus diisi.");
        bookProcessWrite.activeTab = "info";
        bookProcessWrite.pageSaving = false;
        return;
      }

      const apiDataPayload: any = {
        title: read.title,
        description: read.description,
        price: read.price.replace(/[^\d]/g, ""), // Ensure only digits for price
        categories: read.categories.map((c) => c.value),
        useAI: read.isUsingAI,
      };

      const currentContentFile = bookProcessWrite.contentFile; // Use the mutable state for the File object

      if (currentContentFile) {
        try {
          const fileDataUrl = await fileToDataUrl(currentContentFile);
          apiDataPayload.contentFileDataUrl = fileDataUrl;
          apiDataPayload.contentFileName = currentContentFile.name;
          apiDataPayload.contentFileType = currentContentFile.type;
        } catch (error) {
          console.error("Error converting file to base64:", error);
          bookProcessState.setPageError("Gagal memproses file buku untuk diunggah.");
          bookProcessWrite.pageSaving = false;
          return;
        }
      } else {
        bookProcessState.setPageError("File konten buku harus diunggah.");
        bookProcessWrite.activeTab = "content";
        bookProcessWrite.pageSaving = false;
        return;
      }

      const result = await api.products({
        user: session.data.user,
        action: "add",
        data: apiDataPayload, // Send payload with base64 data
      });

      if (result.success) {
        bookProcessState.setPageSuccessMessage("Buku berhasil disimpan dan akan segera diterbitkan!");
        setTimeout(() => {
          navigate("/dashboard");
        }, 2500);
      } else {
        bookProcessState.setPageError(result.message || "Gagal menyimpan buku. Silakan coba lagi.");
      }
    } catch (error) {
      console.error("Error publishing book:", error);
      bookProcessState.setPageError("Terjadi kesalahan saat mencoba menerbitkan buku.");
    } finally {
      bookProcessWrite.pageSaving = false;
    }
  };

  if (read.pageLoading) {
    return <AppLoading />;
  }

  return (
    <Protected
      role={["publisher", "author"]}
      fallback={({ missing_role }) => {
        if (
          missing_role.includes("publisher") ||
          missing_role.includes("author")
        ) {
          navigate("/onboarding");
          return <AppLoading />;
        }
        navigate("/");
        return <AppLoading />;
      }}
    >
      {({ user }) => {
        return (
          <div className="flex min-h-svh flex-col bg-muted/50">
            <PublishMenuBar title="Tambah Buku" />
            <main className="flex-1 flex justify-center items-start py-8 md:py-14">
              <Card className="w-full max-w-4xl shadow-lg border-0">
                <CardHeader className="pb-2">
                  <CardTitle className="text-2xl font-bold mb-1">Terbitkan Buku Baru</CardTitle>
                  <CardDescription className="text-base text-muted-foreground">
                    Lengkapi informasi dan unggah berkas buku untuk menerbitkannya di platform kami.
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                  <Tabs 
                    value={read.activeTab} 
                    onValueChange={(value) => {
                      bookProcessWrite.activeTab = value;
                    }} 
                    className="w-full"
                  >
                    <TabsList className="flex justify-center mb-8 bg-muted rounded-lg overflow-hidden gap-0">
                      <TabsTrigger value="info" className="text-base py-3 flex-1 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Informasi Buku</TabsTrigger>
                      <TabsTrigger value="content" className="text-base py-3 flex-1 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Konten Buku</TabsTrigger>
                      <TabsTrigger value="preview" className="text-base py-3 flex-1 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Tinjau & Terbitkan</TabsTrigger>
                    </TabsList>
                    <TabsContent value="info" className="animate-fade-in">
                      <div className="max-w-2xl mx-auto">
                        <BookForm 
                          onSubmit={handleInfoSubmit}
                        />
                      </div>
                    </TabsContent>
                    <TabsContent value="content" className="animate-fade-in">
                      <div className="max-w-2xl mx-auto">
                        <BookContent 
                          onSubmit={handleContentSubmit}
                          onBack={() => {
                            bookProcessWrite.activeTab = "info";
                          }}
                        />
                      </div>
                    </TabsContent>
                    <TabsContent value="preview" className="animate-fade-in">
                      <div className="max-w-2xl mx-auto">
                        {/* BookPreview receives the current state snapshot via useSnapshot directly */}
                        <BookPreview 
                          onBack={() => {
                            bookProcessWrite.activeTab = "content";
                          }}
                        />
                        <div className="mt-8">
                          {read.pageError && (
                            <div className="bg-red-50 text-red-700 p-3 rounded-md mb-4 border border-red-200">
                              {read.pageError}
                            </div>
                          )}
                          {read.pageSuccessMessage && (
                            <div className="bg-green-50 text-green-700 p-3 rounded-md mb-4 border border-green-200">
                              {read.pageSuccessMessage}
                            </div>
                          )}
                          {read.formError && !read.pageError && (
                             <div className="bg-yellow-50 text-yellow-700 p-3 rounded-md mb-4 border border-yellow-200">
                               {read.formError}
                             </div>
                           )}
                          <div className="flex flex-col md:flex-row justify-between gap-4">
                            <Button 
                              variant="outline"
                              onClick={() => {
                                bookProcessWrite.activeTab = "content";
                              }}
                              disabled={read.pageSaving}
                            >
                              Kembali
                            </Button>
                            <div className="flex gap-2">
                              <Button 
                                variant="outline" 
                                onClick={() => {
                                  bookProcessState.setPageSuccessMessage("Konsep berhasil disimpan (fitur belum sepenuhnya terimplementasi).");
                                }}
                                disabled={read.pageSaving}
                              >
                                Simpan Konsep
                              </Button>
                              <Button 
                                onClick={handlePublish}
                                disabled={read.pageSaving || !!read.pageSuccessMessage}
                              >
                                {read.pageSaving ? "Memproses..." : (read.pageSuccessMessage ? "Berhasil Diterbitkan" : "Terbitkan Sekarang")}
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </TabsContent>
                  </Tabs>
                </CardContent>
                <CardFooter className="border-t bg-muted/70 flex flex-col md:flex-row justify-between items-center gap-2 px-6 py-3">
                  <div className="text-sm text-muted-foreground">
                    * Pastikan semua informasi sudah lengkap dan benar sebelum menerbitkan buku.
                  </div>
                </CardFooter>
              </Card>
            </main>
          </div>
        );
      }}
    </Protected>
  );
};
