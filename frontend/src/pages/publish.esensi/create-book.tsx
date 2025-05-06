import { Protected } from "@/components/app/protected";
import { AppLogo } from "@/components/app/logo";
import { AppLoading } from "@/components/app/loading";
import { Button } from "@/components/ui/button";
import { navigate } from "@/lib/router";
import { betterAuth } from "@/lib/better-auth";
import { useLocal } from "@/lib/hooks/use-local";
import { api } from "@/lib/gen/publish.esensi";
import { PublishMenuBar } from "@/components/publish/menu-bar";

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

import { BookForm } from "@/components/publish/book/BookForm";
import { BookContent } from "@/components/publish/book/BookContent";
import { BookPreview } from "@/components/publish/book/BookPreview";
import type { FormEvent } from "react";

export default () => {
  const logout = () => betterAuth.signOut().finally(() => navigate("/"));

  const local = useLocal({
    activeTab: "info",
    loading: true,
    saving: false,
    bookData: {
      title: "",
      description: "",
      categories: [] as { label: string; value: string }[],
      coverImage: null as File | null,
      coverImagePreview: "",
      price: "",
      contentFile: null as File | null,
      contentFileName: "",
      isUsingAI: false
    },
    error: "",
    success: "",
  }, async () => {
    // Initialize
    try {
      const session = await betterAuth.getSession();
      if (!session.data?.user) {
        navigate("/");
        return;
      }
      
      local.loading = false;
      local.render();
    } catch (error) {
      console.error("Error loading create book page:", error);
      local.loading = false;
      local.render();
    }
  });

  const handleInfoSubmit = (formData: any) => {
    // Update book data with form info
    local.bookData = {
      ...local.bookData,
      ...formData
    };
    
    // Move to next tab
    local.activeTab = "content";
    local.render();
  };

  const handleContentSubmit = (contentData: any) => {
    // Update book data with content info
    local.bookData = {
      ...local.bookData,
      ...contentData
    };
    
    // Move to preview tab
    local.activeTab = "preview";
    local.render();
  };

  const handlePublish = async (e: FormEvent) => {
    e.preventDefault();
    
    if (local.saving) return;
    
    local.saving = true;
    local.error = "";
    local.success = "";
    local.render();
    
    try {
      const session = await betterAuth.getSession();
      if (!session.data?.user) throw new Error("Sesi tidak valid");
      
      // Call API to save book
      const result = await api.products({
        user: session.data.user,
        action: "add",
        data: {
          title: local.bookData.title,
          description: local.bookData.description,
          price: local.bookData.price.replace(/[^\d]/g, ""),
          categories: local.bookData.categories.map((c) => c.value),
          // coverImage dan contentFile bisa ditambah jika backend mendukung
          useAI: local.bookData.isUsingAI,
        },
      });
      
      if (result.success) {
        local.success = "Buku berhasil disimpan";
        
        // Redirect to dashboard after successful save
        setTimeout(() => {
          navigate("/dashboard");
        }, 2000);
      } else {
        local.error = result.message || "Gagal menyimpan buku";
      }
    } catch (error) {
      console.error("Error publishing book:", error);
      local.error = "Terjadi kesalahan saat menyimpan buku";
    } finally {
      local.saving = false;
      local.render();
    }
  };

  if (local.loading) {
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
      }}
    >
      {({ user }) => {
        const isPublisher = !!user?.id_publisher;
        return (
          <div className="flex min-h-svh flex-col bg-muted/50">
            <PublishMenuBar />
            {/* Header */}
            <header className="border-b bg-white/80 backdrop-blur-md sticky top-0 z-20 shadow-sm">
              <div className="flex h-16 items-center justify-between px-4 md:px-8 lg:px-16">
                <div className="flex items-center gap-2">
                  <AppLogo />
                  <span className="mx-2 text-muted-foreground">/</span>
                  <span className="font-semibold text-lg">Terbitkan Buku</span>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="ghost" onClick={() => navigate("/dashboard")}
                    className="font-medium">
                    Kembali ke Dashboard
                  </Button>
                  <Button variant="outline" onClick={logout} className="font-medium">Keluar</Button>
                </div>
              </div>
            </header>

            {/* Main Content */}
            <main className="flex-1 flex justify-center items-start py-8 md:py-14">
              <Card className="w-full max-w-4xl shadow-lg border-0">
                <CardHeader className="pb-2">
                  <CardTitle className="text-2xl font-bold mb-1">Terbitkan Buku Baru</CardTitle>
                  <CardDescription className="text-base text-muted-foreground">
                    Lengkapi informasi dan unggah file buku untuk menerbitkannya di platform kami.
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                  <Tabs value={local.activeTab} onValueChange={(value) => {
                    local.activeTab = value;
                    local.render();
                  }} className="w-full">
                    <TabsList className="flex justify-center mb-8 bg-muted rounded-lg overflow-hidden gap-0">
                      <TabsTrigger value="info" className="text-base py-3 flex-1">Informasi Buku</TabsTrigger>
                      <TabsTrigger value="content" className="text-base py-3 flex-1">Konten Buku</TabsTrigger>
                      <TabsTrigger value="preview" className="text-base py-3 flex-1">Tinjau & Terbitkan</TabsTrigger>
                    </TabsList>
                    <TabsContent value="info" className="animate-fade-in">
                      <div className="max-w-2xl mx-auto">
                        <BookForm 
                          onSubmit={handleInfoSubmit}
                          initialData={local.bookData}
                        />
                      </div>
                    </TabsContent>
                    <TabsContent value="content" className="animate-fade-in">
                      <div className="max-w-2xl mx-auto">
                        <BookContent 
                          onSubmit={handleContentSubmit}
                          initialData={local.bookData}
                          onBack={() => {
                            local.activeTab = "info";
                            local.render();
                          }}
                        />
                      </div>
                    </TabsContent>
                    <TabsContent value="preview" className="animate-fade-in">
                      <div className="max-w-2xl mx-auto">
                        <BookPreview 
                          bookData={local.bookData}
                          onBack={() => {
                            local.activeTab = "content";
                            local.render();
                          }}
                        />
                        <div className="mt-8">
                          {local.error && (
                            <div className="bg-red-50 text-red-700 p-3 rounded-md mb-4 border border-red-200">
                              {local.error}
                            </div>
                          )}
                          {local.success && (
                            <div className="bg-green-50 text-green-700 p-3 rounded-md mb-4 border border-green-200">
                              {local.success}
                            </div>
                          )}
                          <div className="flex flex-col md:flex-row justify-between gap-4">
                            <Button 
                              variant="outline"
                              onClick={() => {
                                local.activeTab = "content";
                                local.render();
                              }}
                            >
                              Kembali
                            </Button>
                            <div className="flex gap-2">
                              <Button 
                                variant="outline" 
                                onClick={() => {
                                  // Save as draft logic
                                }}
                              >
                                Simpan Draft
                              </Button>
                              <Button 
                                onClick={handlePublish}
                                disabled={local.saving}
                              >
                                {local.saving ? "Memproses..." : "Terbitkan"}
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
                    * Pastikan semua informasi sudah lengkap sebelum menerbitkan buku
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
