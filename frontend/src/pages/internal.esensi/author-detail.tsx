import { AppLoading } from "@/components/app/loading";
import { Protected } from "@/components/app/protected";
import { CfgEditor } from "@/components/ext/author/cfg-editor";
import { Error } from "@/components/ext/error";
import { MenuBarInternal } from "@/components/ext/menu-bar/internal";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { betterAuth } from "@/lib/better-auth";
import { api } from "@/lib/gen/internal.esensi";
import { useLocal } from "@/lib/hooks/use-local";
import { navigate } from "@/lib/router";
import type { User } from "backend/lib/better-auth";
import { Role } from "backend/lib/types";
import {
  ArrowLeft,
  Book,
  Calendar,
  ExternalLink,
  Mail,
  Package,
  Settings,
  User as UserIcon,
} from "lucide-react";

interface Author {
  id: string;
  name: string;
  biography: string | null;
  social_media: string | null;
  avatar: string | null;
  id_account: string | null;
  id_user: string | null;
  cfg: any;
  auth_user?: any[];
  auth_account?: any;
  book?: any[];
  product?: any[];
}

export const current = {
  user: undefined as User | undefined,
};

export default () => {
  const local = useLocal(
    {
      author: undefined as Author | undefined,
      loading: true,
      error: "",
      authorId: "",
    },
    async () => {
      // Get user session
      const res = await betterAuth.getSession();
      current.user = res.data?.user;

      // Get author ID from URL query parameter
      const urlParams = new URLSearchParams(window.location.search);
      const id = urlParams.get("id");
      if (id) {
        local.authorId = id;
        await loadAuthor();
      } else {
        local.error = "ID penulis tidak ditemukan";
        local.loading = false;
        local.render();
      }
    }
  );

  const loadAuthor = async () => {
    try {
      local.loading = true;
      local.error = "";
      local.render();

      const result = await api.author_get({ id: local.authorId });
      if (result) local.author = result.data;
    } catch (error: any) {
      console.error("Error loading author:", error);
      local.error =
        error.message || "Terjadi kesalahan saat memuat data penulis";
    } finally {
      local.loading = false;
      local.render();
    }
  };

  const formatDate = (date: Date | string) => {
    return new Date(date).toLocaleDateString("id-ID", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (local.loading) {
    return (
      <Protected role={Role.INTERNAL}>
        <div className="flex flex-col min-h-screen bg-background">
          <MenuBarInternal />
          <div className="flex-1 flex items-center justify-center">
            <AppLoading />
          </div>
        </div>
      </Protected>
    );
  }

  if (local.error || !local.author) {
    return (
      <Protected role={Role.INTERNAL}>
        <div className="flex flex-col min-h-screen bg-background">
          <MenuBarInternal />
          <div className="flex-1 container mx-auto px-4 py-8">
            <Button
              variant="ghost"
              onClick={() => navigate("/manage-author")}
              className="mb-4"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Kembali ke Kelola Penulis
            </Button>
            <Error
              msg={local.error || "Penulis tidak ditemukan"}
              loading={false}
            />
          </div>
        </div>
      </Protected>
    );
  }

  const author = local.author;

  return (
    <Protected role={Role.INTERNAL}>
      <div className="flex flex-col min-h-screen bg-background">
        <MenuBarInternal />

        <div className="flex-1 container mx-auto px-4 py-8">
          <div className="max-w-6xl mx-auto">
            <div className="mb-8">
              <Button
                variant="ghost"
                onClick={() => navigate("/manage-author")}
                className="mb-4"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Kembali ke Kelola Penulis
              </Button>

              <div className="flex items-start justify-between">
                <div>
                  <h1 className="text-3xl font-bold">Detail Penulis</h1>
                  <p className="text-muted-foreground mt-2">
                    Informasi lengkap tentang penulis dan aktivitasnya
                  </p>
                </div>
              </div>
            </div>

            <div className="grid gap-8 lg:grid-cols-3">
              {/* Author Profile */}
              <div className="lg:col-span-1">
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <div className="w-32 h-32 rounded-full bg-muted flex items-center justify-center mx-auto mb-4 overflow-hidden">
                        {author.avatar ? (
                          <img
                            src={author.avatar}
                            alt={author.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <UserIcon className="h-16 w-16 text-muted-foreground" />
                        )}
                      </div>

                      <h2 className="text-2xl font-bold mb-2">{author.name}</h2>

                      <div className="flex items-center justify-center gap-2 mb-4">
                        {author.auth_account && (
                          <Badge variant="secondary">Account Verified</Badge>
                        )}
                        {author.auth_user && author.auth_user.length > 0 && (
                          <Badge variant="default">Active User</Badge>
                        )}
                      </div>

                      {author.social_media && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            author.social_media &&
                            window.open(author.social_media, "_blank")
                          }
                          className="mb-4"
                        >
                          <ExternalLink className="h-3 w-3 mr-2" />
                          Media Sosial
                        </Button>
                      )}
                    </div>

                    {author.biography && (
                      <div className="mt-6">
                        <h3 className="font-semibold mb-2">Biografi</h3>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          {author.biography}
                        </p>
                      </div>
                    )}

                    <Separator className="my-6" />

                    {/* Statistics */}
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <Book className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <p className="text-sm font-medium">Total Buku</p>
                          <p className="text-2xl font-bold">
                            {author.book?.length || 0}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <Package className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <p className="text-sm font-medium">Total Produk</p>
                          <p className="text-2xl font-bold">
                            {author.product?.length || 0}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* System Information */}
                    <Separator className="my-6" />
                    <div className="space-y-3">
                      <h3 className="font-semibold text-sm">
                        Informasi Sistem
                      </h3>

                      {author.id_account && (
                        <div className="flex items-center gap-2 text-xs">
                          <Mail className="h-3 w-3 text-muted-foreground" />
                          <span className="text-muted-foreground">
                            Account ID:
                          </span>
                          <span className="font-mono">{author.id_account}</span>
                        </div>
                      )}

                      {author.id_user && (
                        <div className="flex items-center gap-2 text-xs">
                          <UserIcon className="h-3 w-3 text-muted-foreground" />
                          <span className="text-muted-foreground">
                            User ID:
                          </span>
                          <span className="font-mono">{author.id_user}</span>
                        </div>
                      )}

                      <div className="flex items-center gap-2 text-xs">
                        <Settings className="h-3 w-3 text-muted-foreground" />
                        <span className="text-muted-foreground">
                          Author ID:
                        </span>
                        <span className="font-mono">{author.id}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Content */}
              <div className="lg:col-span-2 space-y-6">
                {/* Configuration Editor */}
                <CfgEditor
                  author={author}
                  canEdit={
                    current.user?.internal?.is_it ||
                    current.user?.internal?.is_management ||
                    false
                  }
                  onSave={(updatedAuthor) => {
                    local.author = updatedAuthor;
                    local.render();
                  }}
                />

                {/* Books */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Book className="h-5 w-5" />
                      Buku ({author.book?.length || 0})
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {author.book && author.book.length > 0 ? (
                      <div className="space-y-4">
                        {author.book.map((book: any) => (
                          <div
                            key={book.id}
                            className="flex items-start gap-4 p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                          >
                            <div className="w-16 h-20 bg-gray-200 rounded flex-shrink-0 overflow-hidden">
                              {book.img_file ? (
                                <img
                                  src={book.img_file}
                                  alt={book.name}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                  <Book className="h-6 w-6 text-gray-400" />
                                </div>
                              )}
                            </div>
                            <div className="flex-1">
                              <h4 className="font-semibold mb-1">
                                {book.name}
                              </h4>
                              <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
                                {book.desc || "Tidak ada deskripsi"}
                              </p>
                              <div className="flex items-center gap-4">
                                <Badge
                                  variant={
                                    book.status === "published"
                                      ? "default"
                                      : "secondary"
                                  }
                                >
                                  {book.status}
                                </Badge>
                                {book.published_date && (
                                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                    <Calendar className="h-3 w-3" />
                                    {formatDate(book.published_date)}
                                  </div>
                                )}
                                {book.submitted_price && (
                                  <span className="text-sm font-medium">
                                    Rp{" "}
                                    {Number(
                                      book.submitted_price
                                    ).toLocaleString("id-ID")}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <Book className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                        <p className="text-muted-foreground">
                          Belum ada buku yang diterbitkan
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Products */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Package className="h-5 w-5" />
                      Produk ({author.product?.length || 0})
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {author.product && author.product.length > 0 ? (
                      <div className="space-y-4">
                        {author.product.map((product: any) => (
                          <div
                            key={product.id}
                            className="flex items-start gap-4 p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                          >
                            <div className="w-16 h-20 bg-gray-200 rounded flex-shrink-0 overflow-hidden">
                              {product.img_file ? (
                                <img
                                  src={product.img_file}
                                  alt={product.name}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                  <Package className="h-6 w-6 text-gray-400" />
                                </div>
                              )}
                            </div>
                            <div className="flex-1">
                              <h4 className="font-semibold mb-1">
                                {product.name}
                              </h4>
                              <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
                                {product.desc || "Tidak ada deskripsi"}
                              </p>
                              <div className="flex items-center gap-4">
                                <Badge
                                  variant={
                                    product.status === "published"
                                      ? "default"
                                      : "secondary"
                                  }
                                >
                                  {product.status}
                                </Badge>
                                {product.published_date && (
                                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                    <Calendar className="h-3 w-3" />
                                    {formatDate(product.published_date)}
                                  </div>
                                )}
                                {product.price && (
                                  <span className="text-sm font-medium">
                                    Rp{" "}
                                    {Number(product.price).toLocaleString(
                                      "id-ID"
                                    )}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <Package className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                        <p className="text-muted-foreground">
                          Belum ada produk yang diterbitkan
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* User Activity */}
                {author.auth_user && author.auth_user.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <UserIcon className="h-5 w-5" />
                        Aktivitas User
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {author.auth_user.map((user: any, index: number) => (
                          <div
                            key={index}
                            className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
                          >
                            <div>
                              <p className="font-medium">
                                {user.name || user.email}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                {user.email}
                              </p>
                            </div>
                            <div className="text-right text-sm text-muted-foreground">
                              <p>Created: {formatDate(user.created_at)}</p>
                              {user.updated_at && (
                                <p>Updated: {formatDate(user.updated_at)}</p>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Protected>
  );
};
