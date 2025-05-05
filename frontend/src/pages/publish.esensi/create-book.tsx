import { Protected } from "@/components/app/protected";
import { AppLogo } from "@/components/app/logo";
import { AppLoading } from "@/components/app/loading";
import { Button } from "@/components/ui/button";
import { navigate } from "@/lib/router";
import { betterAuth } from "@/lib/better-auth";
import { useLocal } from "@/lib/hooks/use-local";
import { api } from "@/lib/gen/publish.esensi";

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
import { FormEvent } from "react";

export default () => {
  const logout = () => betterAuth.signOut().finally(() => navigate("/"));

  const local = useLocal({
    activeTab: "info",
    loading: true,
    saving: false,
    bookData: {
      title: "",
      description: "",
      categories: [],
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
      
      const formData = new FormData();
      
      // Add basic book data
      formData.append("title", local.bookData.title);
      formData.append("description", local.bookData.description);
      formData.append("price", local.bookData.price.replace(/[^\d]/g, ""));
      
      // Add categories
      local.bookData.categories.forEach((category, index) => {
        formData.append(`categories[${index}]`, category.value);
      });
      
      // Add files
      if (local.bookData.coverImage) {
        formData.append("cover", local.bookData.coverImage);
      }
      
      if (local.bookData.contentFile) {
        formData.append("content", local.bookData.contentFile);
      }
      
      formData.append("useAI", local.bookData.isUsingAI ? "true" : "false");
      
      // Call API to save book
      const result = await api.products({
        user: session.data.user,
        action: "create",
        formData
      });
      
      if (result.success) {
        local.success = "Buku berhasil disimpan";
        
        // Redirect to dashboard after successful save
        setTimeout(() => {
          navigate("/publish.esensi/dashboard");
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
          <div className="flex min-h-svh flex-col">
            {/* Header */}
            <header className="border-b">
              <div className="flex h-16 items-center justify-between px-4 md:px-6">
                <div className="flex items-center">
                  <AppLogo />
                  <span className="mx-2">/</span>
                  <span className="font-medium">Terbitkan Buku</span>
                </div>
                <div className="flex items-center gap-4">
                  <Button variant="ghost" onClick={() => navigate("/publish.esensi/dashboard")}>
                    Kembali ke Dashboard
                  </Button>
                  <Button variant="outline" onClick={logout}>Keluar</Button>
                </div>
              </div>
            </header>

            {/* Main Content */}
            <div className="flex-1 container py-6 md:py-10">
              <Card>
                <CardHeader>
                  <CardTitle>Terbitkan Buku Baru</CardTitle>
                  <CardDescription>
                    Lengkapi informasi dan unggah file buku untuk menerbitkannya di platform kami.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Tabs value={local.activeTab} onValueChange={(value) => {
                    local.activeTab = value;
                    local.render();
                  }} className="w-full">
                    <TabsList className="grid grid-cols-3 mb-8">
                      <TabsTrigger value="info">Informasi Buku</TabsTrigger>
                      <TabsTrigger value="content">Konten Buku</TabsTrigger>
                      <TabsTrigger value="preview">Tinjau & Terbitkan</TabsTrigger>
                    </TabsList>
                    <TabsContent value="info">
                      <BookForm 
                        onSubmit={handleInfoSubmit}
                        initialData={local.bookData}
                      />
                    </TabsContent>
                    <TabsContent value="content">
                      <BookContent 
                        onSubmit={handleContentSubmit}
                        initialData={local.bookData}
                        onBack={() => {
                          local.activeTab = "info";
                          local.render();
                        }}
                      />
                    </TabsContent>
                    <TabsContent value="preview">
                      <BookPreview 
                        bookData={local.bookData}
                        onBack={() => {
                          local.activeTab = "content";
                          local.render();
                        }}
                      />
                      
                      <div className="mt-8">
                        {local.error && (
                          <div className="bg-red-50 text-red-700 p-3 rounded-md mb-4">
                            {local.error}
                          </div>
                        )}
                        
                        {local.success && (
                          <div className="bg-green-50 text-green-700 p-3 rounded-md mb-4">
                            {local.success}
                          </div>
                        )}
                        
                        <div className="flex justify-between">
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
                    </TabsContent>
                  </Tabs>
                </CardContent>
                <CardFooter className="border-t bg-muted/50 flex justify-between">
                  <div className="text-sm text-muted-foreground">
                    * Pastikan semua informasi sudah lengkap sebelum menerbitkan buku
                  </div>
                </CardFooter>
              </Card>
            </div>
          </div>
        );
      }}
    </Protected>
  );
};
