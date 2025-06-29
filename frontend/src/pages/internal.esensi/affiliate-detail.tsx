import { Error } from "@/components/ext/error";
import { Layout } from "@/components/ext/layout/internal.esensi";
import { MenuBarInternal } from "@/components/ext/menu-bar/internal";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api } from "@/lib/gen/internal.esensi";
import { useLocal } from "@/lib/hooks/use-local";
import { navigate } from "@/lib/router";
import type { Affiliate } from "backend/src/lib/types";
import { ArrowLeft, BarChart3, Save, Users } from "lucide-react";

export default () => {
  const local = useLocal(
    {
      loading: true,
      error: "",
      success: "",
      affiliate: null as Affiliate | null,
      form: {
        name: "",
        id_account: "",
        id_user: "",
      },
      submitting: false,
      stats: {
        loading: true,
        data: null as any,
      },
    },
    async () => {
      const params = new URLSearchParams(location.search);
      const id = params.get("id");
      if (!id) {
        local.error = "ID affiliate tidak ditemukan.";
        local.loading = false;
        local.render();
        return;
      }
      await loadAffiliate(id);
      await loadStats(id);
    }
  );

  const loadAffiliate = async (id: string) => {
    try {
      const res = await api.affiliate_get({ id });
      if (res.success && res.data) {
        local.affiliate = res.data;
        local.form = {
          name: res.data.name,
          id_account: res.data.id_account || "",
          id_user: res.data.id_user || "",
        };
      } else local.error = "Affiliate tidak ditemukan.";
    } catch (error) {
      local.error = "Terjadi kesalahan saat memuat data affiliate.";
    } finally {
      local.loading = false;
      local.render();
    }
  };

  const loadStats = async (id: string) => {
    local.stats.loading = true;
    local.render();
    try {
      const res = await api.affiliate_stats({ id });
      if (res.success) local.stats.data = res.data;
    } catch (error) {
      console.error("Failed to load affiliate stats:", error);
    } finally {
      local.stats.loading = false;
      local.render();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!local.form.name.trim()) {
      local.error = "Nama affiliate wajib diisi.";
      local.render();
      return;
    }
    if (!local.affiliate) return;
    local.submitting = true;
    local.error = "";
    local.success = "";
    local.render();

    try {
      const res = await api.affiliate_update({
        id: local.affiliate.id,
        name: local.form.name.trim(),
        id_account: local.form.id_account.trim() || undefined,
        id_user: local.form.id_user.trim() || undefined,
      });

      if (res.success && res.data) {
        local.success = "Affiliate berhasil diperbarui!";
        local.affiliate = res.data;
        local.render();
        setTimeout(() => {
          local.success = "";
          local.render();
        }, 3000);
      } else local.error = "Gagal memperbarui affiliate.";
    } catch (error: any) {
      local.error =
        error.message || "Terjadi kesalahan saat memperbarui affiliate.";
    } finally {
      local.submitting = false;
      local.render();
    }
  };

  if (!local.affiliate) {
    return (
      <Layout loading={local.loading || local.stats.loading}>
        <MenuBarInternal />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-xl font-semibold mb-2">
              Affiliate Tidak Ditemukan
            </h2>
            <Button onClick={() => navigate("/manage-affiliate")}>
              Kembali ke Daftar Affiliate
            </Button>
          </div>
        </main>
      </Layout>
    );
  }

  return (
    <Layout loading={local.loading || local.stats.loading}>
      <MenuBarInternal />
      <main className="flex-1">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
          <div className="mb-6">
            <Button
              variant="ghost"
              onClick={() => navigate("/manage-affiliate")}
              className="mb-4"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Kembali ke Daftar Affiliate
            </Button>
            <h1 className="text-2xl font-bold">Detail Affiliate</h1>
          </div>

          <Error msg={local.error} />
          {local.success && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 text-green-700 rounded-lg">
              {local.success}
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Edit Form */}
            <div className="lg:col-span-2">
              <Card className="shadow-sm border border-gray-200">
                <CardHeader>
                  <CardTitle>Edit Informasi Affiliate</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="name">
                        Nama Affiliate <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="name"
                        type="text"
                        placeholder="Masukkan nama affiliate"
                        value={local.form.name}
                        onChange={(e) => {
                          local.form.name = e.target.value;
                          local.render();
                        }}
                        disabled={local.submitting}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="id_account">ID Account</Label>
                      <Input
                        id="id_account"
                        type="text"
                        placeholder="Masukkan ID account jika ada"
                        value={local.form.id_account}
                        onChange={(e) => {
                          local.form.id_account = e.target.value;
                          local.render();
                        }}
                        disabled={local.submitting}
                      />
                      <p className="text-sm text-gray-500">
                        ID account yang akan dihubungkan dengan affiliate ini.
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="id_user">ID User</Label>
                      <Input
                        id="id_user"
                        type="text"
                        placeholder="Masukkan ID user jika ada"
                        value={local.form.id_user}
                        onChange={(e) => {
                          local.form.id_user = e.target.value;
                          local.render();
                        }}
                        disabled={local.submitting}
                      />
                      <p className="text-sm text-gray-500">
                        ID user yang akan dihubungkan dengan affiliate ini.
                      </p>
                    </div>

                    <div className="flex gap-4 pt-6">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() =>
                          navigate(`/affiliate-stats?id=${local.affiliate?.id}`)
                        }
                        disabled={local.submitting}
                      >
                        <BarChart3 className="h-4 w-4 mr-2" />
                        Lihat Statistik
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => navigate("/manage-affiliate")}
                        disabled={local.submitting}
                      >
                        Batal
                      </Button>
                      <Button
                        type="submit"
                        disabled={local.submitting || !local.form.name.trim()}
                        className="bg-blue-600 hover:bg-blue-700"
                      >
                        {local.submitting ? (
                          <>
                            <div className="animate-spin h-4 w-4 mr-2 border-2 border-white border-t-transparent rounded-full"></div>
                            Menyimpan...
                          </>
                        ) : (
                          <>
                            <Save className="h-4 w-4 mr-2" />
                            Simpan Perubahan
                          </>
                        )}
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </div>

            {/* Stats Sidebar */}
            <div className="space-y-6">
              {/* Basic Info */}
              <Card className="shadow-sm border border-gray-200">
                <CardHeader>
                  <CardTitle className="text-lg">Informasi Dasar</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center">
                    <Users className="h-5 w-5 mr-3 text-gray-500" />
                    <div>
                      <p className="text-sm text-gray-500">
                        Pengguna Terhubung
                      </p>
                      <p className="font-semibold">
                        {local.affiliate.auth_user?.length || 0}
                      </p>
                    </div>
                  </div>

                  {local.affiliate.auth_account && (
                    <div>
                      <p className="text-sm text-gray-500">Account ID</p>
                      <p className="font-mono text-sm bg-gray-100 p-2 rounded">
                        {local.affiliate.auth_account.id}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Statistics */}
              <Card className="shadow-sm border border-gray-200">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center">
                    <BarChart3 className="h-5 w-5 mr-2" />
                    Statistik
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {local.stats.loading ? (
                    <div className="text-center py-4">
                      <div className="animate-spin h-6 w-6 border-2 border-blue-600 border-t-transparent rounded-full mx-auto"></div>
                      <p className="text-sm text-gray-500 mt-2">
                        Memuat statistik...
                      </p>
                    </div>
                  ) : local.stats.data ? (
                    <div className="space-y-4">
                      {/* Display stats data here based on the API response structure */}
                      <div>
                        <p className="text-sm text-gray-500">Total Referrals</p>
                        <p className="text-2xl font-bold text-blue-600">
                          {local.stats.data.totalReferrals || 0}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Total Komisi</p>
                        <p className="text-2xl font-bold text-green-600">
                          Rp{" "}
                          {(
                            local.stats.data.totalCommission || 0
                          ).toLocaleString("id-ID")}
                        </p>
                      </div>
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500">
                      Statistik tidak tersedia
                    </p>
                  )}
                </CardContent>
              </Card>

              {/* Connected Users */}
              {local.affiliate.auth_user &&
                local.affiliate.auth_user.length > 0 && (
                  <Card className="shadow-sm border border-gray-200">
                    <CardHeader>
                      <CardTitle className="text-lg">
                        Pengguna Terhubung
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {local.affiliate.auth_user.map((user) => (
                          <div
                            key={user.id}
                            className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                          >
                            <div>
                              <p className="font-medium">{user.name}</p>
                              <p className="text-sm text-gray-500">
                                {user.email}
                              </p>
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
      </main>
    </Layout>
  );
};
