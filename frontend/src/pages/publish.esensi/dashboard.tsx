import { Protected } from "@/components/app/protected";
import { AppLoading } from "@/components/app/loading";
import { navigate } from "@/lib/router";
import { betterAuth } from "@/lib/better-auth";
import { useLocal } from "@/lib/hooks/use-local";
import { api } from "@/lib/gen/publish.esensi";
import {
  OverviewTab,
  ProductsTab,
  AuthorsTab,
  FinanceTab,
} from "@/components/publish/dashboard";
import { PublishMenuBar } from "@/components/publish/menu-bar";
import type { DashboardData } from "@/components/publish/dashboard";
import type { User } from "better-auth/types";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Extend the User type to include role property
interface ExtendedUser extends User {
  role?: string;
}

export default () => {
  const logout = () => betterAuth.signOut().finally(() => navigate("/"));

  const local = useLocal(
    {
      loading: true,
      activeTab: "overview",
      dashboardData: null as DashboardData | null,
      error: "",
    },
    async () => {
      // Initialize data
      try {
        const session = await betterAuth.getSession();
        if (!session.data?.user) {
          navigate("/");
          return;
        }
        await api.register_user({ user: session.data!.user });

        // Fetch dashboard data
        const userInfo = session.data.user as ExtendedUser;
        // Check for publisher role (assuming role info is available in the user object)
        const isPublisher = userInfo.role === "publisher";

        // Fetch products
        const productsRes = await api.products({
          user: userInfo,
          action: "list",
          page: 1,
          limit: 10,
        });

        let authors: any[] = [];
        let transactions: any = null;
        let publisherData: any = null;
        let authorData: any = null;

        // Fetch publisher specific data
        if (isPublisher) {
          // Fetch authors
          const authorsRes = await api.publisher_authors({
            user: userInfo,
            action: "list",
          });

          if (authorsRes.success && authorsRes.data) {
            authors = authorsRes.data;
          }

          // Fetch transactions
          const transactionsRes = await api.transactions({
            user: userInfo,
          });

          if (transactionsRes.success && transactionsRes.data) {
            transactions = transactionsRes.data;
          }

          // Fetch publisher profile
          const publisherProfileRes = await api.publisher_profile({
            user: userInfo,
          });

          if (publisherProfileRes.success && publisherProfileRes.publisher) {
            publisherData = publisherProfileRes.publisher;
          }
        } else {
          // Fetch author profile
          const authorProfileRes = await api.author_profile({
            user: userInfo,
          });

          if (authorProfileRes.success && authorProfileRes.author) {
            authorData = authorProfileRes.author;
          }
        }

        // Set dashboard data
        local.dashboardData = {
          products:
            productsRes.success && productsRes.data ? productsRes.data : [],
          authors,
          transactions,
          publisherData,
          authorData,
        };

        local.loading = false;
        local.render();
      } catch (error) {
        console.error("Error loading dashboard:", error);
        local.error = "Terjadi kesalahan saat memuat dashboard";
        local.loading = false;
        local.render();
      }
    }
  );

  const handleTabChange = (value: string) => {
    local.activeTab = value;
    local.render();
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
        // Cast user to ExtendedUser to access the role property
        const extendedUser = user as ExtendedUser;
        const isPublisher = extendedUser?.role === "publisher";

        return (
          <div className="flex min-h-svh flex-col bg-gray-50">
            <PublishMenuBar title="Dasbor" />
            {/* Main Content */}
            <main className="flex-1">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
                {local.error ? (
                  <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg mb-8 shadow-sm">
                    {local.error}
                  </div>
                ) : null}

                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                  <div className="p-6">
                    <Tabs
                      value={local.activeTab}
                      onValueChange={handleTabChange}
                      className="w-full"
                    >
                      <TabsList className="mb-6 bg-gray-100 p-1 w-full max-w-md">
                        <TabsTrigger
                          value="overview"
                          className="flex-1 font-medium data-[state=active]:bg-white data-[state=active]:shadow-sm"
                        >
                          Ikhtisar
                        </TabsTrigger>
                        <TabsTrigger
                          value="products"
                          className="flex-1 font-medium data-[state=active]:bg-white data-[state=active]:shadow-sm"
                        >
                          Produk
                        </TabsTrigger>
                        {isPublisher && (
                          <TabsTrigger
                            value="authors"
                            className="flex-1 font-medium data-[state=active]:bg-white data-[state=active]:shadow-sm"
                          >
                            Penulis
                          </TabsTrigger>
                        )}
                        {isPublisher && (
                          <TabsTrigger
                            value="finance"
                            className="flex-1 font-medium data-[state=active]:bg-white data-[state=active]:shadow-sm"
                          >
                            Keuangan
                          </TabsTrigger>
                        )}
                      </TabsList>

                      <div className="mt-6">
                        <TabsContent value="overview" className="p-0 mt-0">
                          {local.dashboardData && (
                            <OverviewTab
                              data={local.dashboardData}
                              isPublisher={isPublisher}
                            />
                          )}
                        </TabsContent>

                        <TabsContent value="products" className="p-0 mt-0">
                          {local.dashboardData && (
                            <ProductsTab data={local.dashboardData} />
                          )}
                        </TabsContent>

                        {isPublisher && (
                          <TabsContent value="authors" className="p-0 mt-0">
                            {local.dashboardData && (
                              <AuthorsTab data={local.dashboardData} />
                            )}
                          </TabsContent>
                        )}

                        {isPublisher && (
                          <TabsContent value="finance" className="p-0 mt-0">
                            {local.dashboardData && (
                              <FinanceTab data={local.dashboardData} />
                            )}
                          </TabsContent>
                        )}
                      </div>
                    </Tabs>
                  </div>
                </div>
              </div>
            </main>
          </div>
        );
      }}
    </Protected>
  );
};
