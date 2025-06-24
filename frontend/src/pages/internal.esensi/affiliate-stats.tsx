import { AppLoading } from "@/components/app/loading";
import { Protected } from "@/components/app/protected";
import { Error } from "@/components/ext/error";
import { MenuBarInternal } from "@/components/ext/menu-bar/internal";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { api } from "@/lib/gen/internal.esensi";
import { useLocal } from "@/lib/hooks/use-local";
import { navigate } from "@/lib/router";
import { Role } from "backend/src/lib/types";
import { ArrowLeft, BarChart3, DollarSign, TrendingUp, Users } from "lucide-react";
import type { Affiliate } from "backend/src/lib/types";

export default () => {
  const local = useLocal(
    {
      loading: true,
      error: "",
      affiliate: null as Affiliate | null,
      stats: null as any,
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

      await loadData(id);
    }
  );

  const loadData = async (id: string) => {
    try {
      const [affiliateRes, statsRes] = await Promise.all([
        api.affiliate_get({ id }),
        api.affiliate_stats({ id }),
      ]);

      if (affiliateRes.success && affiliateRes.data) {
        local.affiliate = affiliateRes.data;
      } else {
        local.error = "Affiliate tidak ditemukan.";
        local.loading = false;
        local.render();
        return;
      }

      if (statsRes.success && statsRes.data) {
        local.stats = statsRes.data;
      }
    } catch (error) {
      local.error = "Terjadi kesalahan saat memuat data.";
    } finally {
      local.loading = false;
      local.render();
    }
  };

  if (local.loading) return <AppLoading />;

  if (!local.affiliate) {
    return (
      <Protected role={[Role.INTERNAL]}>
        <div className="flex min-h-svh flex-col bg-gray-50">
          <MenuBarInternal />
          <main className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <h2 className="text-xl font-semibold mb-2">Affiliate Tidak Ditemukan</h2>
              <Button onClick={() => navigate("/manage-affiliate")}>
                Kembali ke Daftar Affiliate
              </Button>
            </div>
          </main>
        </div>
      </Protected>
    );
  }

  return (
    <Protected role={[Role.INTERNAL]}>
      <div className="flex min-h-svh flex-col bg-gray-50">
        <MenuBarInternal />

        <main className="flex-1">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
            <div className="mb-6">
              <Button
                variant="ghost"
                onClick={() => navigate("/manage-affiliate")}
                className="mb-4"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Kembali ke Daftar Affiliate
              </Button>
              <div className="flex items-center gap-4">
                <BarChart3 className="h-8 w-8 text-blue-600" />
                <div>
                  <h1 className="text-2xl font-bold">Statistik Affiliate</h1>
                  <p className="text-gray-600">{local.affiliate.name}</p>
                </div>
              </div>
            </div>

            <Error msg={local.error} />

            {local.stats ? (
              <div className="space-y-6">
                {/* Overview Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <Card className="shadow-sm border border-gray-200">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-gray-500">Total Referrals</p>
                          <p className="text-2xl font-bold text-blue-600">
                            {local.stats.totalReferrals || 0}
                          </p>
                        </div>
                        <Users className="h-8 w-8 text-blue-600" />
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="shadow-sm border border-gray-200">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-gray-500">Total Komisi</p>
                          <p className="text-2xl font-bold text-green-600">
                            Rp {(local.stats.totalCommission || 0).toLocaleString('id-ID')}
                          </p>
                        </div>
                        <DollarSign className="h-8 w-8 text-green-600" />
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="shadow-sm border border-gray-200">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-gray-500">Penjualan Bulan Ini</p>
                          <p className="text-2xl font-bold text-purple-600">
                            {local.stats.monthlyReferrals || 0}
                          </p>
                        </div>
                        <TrendingUp className="h-8 w-8 text-purple-600" />
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="shadow-sm border border-gray-200">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-gray-500">Konversi Rate</p>
                          <p className="text-2xl font-bold text-orange-600">
                            {local.stats.conversionRate ? `${local.stats.conversionRate.toFixed(1)}%` : '0%'}
                          </p>
                        </div>
                        <BarChart3 className="h-8 w-8 text-orange-600" />
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Detailed Stats */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card className="shadow-sm border border-gray-200">
                    <CardHeader>
                      <CardTitle>Performa Bulanan</CardTitle>
                    </CardHeader>
                    <CardContent>
                      {local.stats.monthlyPerformance ? (
                        <div className="space-y-4">
                          {local.stats.monthlyPerformance.map((month: any, index: number) => (
                            <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                              <span className="font-medium">{month.month}</span>
                              <div className="text-right">
                                <p className="font-semibold">{month.referrals} referrals</p>
                                <p className="text-sm text-gray-500">
                                  Rp {month.commission.toLocaleString('id-ID')}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-gray-500 text-center py-8">
                          Data performa bulanan tidak tersedia
                        </p>
                      )}
                    </CardContent>
                  </Card>

                  <Card className="shadow-sm border border-gray-200">
                    <CardHeader>
                      <CardTitle>Top Produk</CardTitle>
                    </CardHeader>
                    <CardContent>
                      {local.stats.topProducts ? (
                        <div className="space-y-4">
                          {local.stats.topProducts.map((product: any, index: number) => (
                            <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                              <div>
                                <p className="font-medium">{product.name}</p>
                                <p className="text-sm text-gray-500">{product.sales} penjualan</p>
                              </div>
                              <div className="text-right">
                                <p className="font-semibold text-green-600">
                                  Rp {product.commission.toLocaleString('id-ID')}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-gray-500 text-center py-8">
                          Data produk tidak tersedia
                        </p>
                      )}
                    </CardContent>
                  </Card>
                </div>

                {/* Recent Activities */}
                <Card className="shadow-sm border border-gray-200">
                  <CardHeader>
                    <CardTitle>Aktivitas Terbaru</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {local.stats.recentActivities ? (
                      <div className="space-y-4">
                        {local.stats.recentActivities.map((activity: any, index: number) => (
                          <div key={index} className="flex justify-between items-center p-4 border-l-4 border-blue-500 bg-blue-50">
                            <div>
                              <p className="font-medium">{activity.type}</p>
                              <p className="text-sm text-gray-600">{activity.description}</p>
                              <p className="text-xs text-gray-500">{activity.date}</p>
                            </div>
                            {activity.amount && (
                              <div className="text-right">
                                <p className="font-semibold text-green-600">
                                  +Rp {activity.amount.toLocaleString('id-ID')}
                                </p>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-500 text-center py-8">
                        Belum ada aktivitas
                      </p>
                    )}
                  </CardContent>
                </Card>
              </div>
            ) : (
              <Card className="shadow-sm border border-gray-200">
                <CardContent className="text-center py-12">
                  <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Statistik Tidak Tersedia</h3>
                  <p className="text-gray-500">
                    Belum ada data statistik untuk affiliate ini.
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </main>
      </div>
    </Protected>
  );
};
