import { Protected } from "@/components/app/protected";
import { Button } from "@/components/ui/button";
import { betterAuth } from "@/lib/better-auth";
import { navigate } from "@/lib/router";
import { AppLogo } from "@/components/app/logo";
import { AppLoading } from "@/components/app/loading";
import { useLocal } from "@/lib/hooks/use-local";
import { api } from "@/lib/gen/publish.esensi";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { FormEvent } from "react";
import { 
  AuthorsTab, 
  type DashboardData, 
  FinanceTab, 
  OverviewTab, 
  ProductsTab 
} from "@/components/publish/dashboard";

// Define types for our local state
type Product = {
  id: string;
  name: string;
  cover: string;
  status: string;
  real_price: number;
  author: { name: string };
};

type Author = {
  id: string;
  name: string;
  auth_user?: { email: string }[];
  productCount?: number;
};

type Transaction = {
  id: string;
  type: string;
  amount: number;
  created_at: string;
};

type Withdrawal = {
  id: string;
  amount: number;
  status: string;
  requested_at: string;
};

type TransactionData = {
  balance: number;
  transactions: Transaction[];
  withdrawals: Withdrawal[];
};

export default () => {
  const logout = () => betterAuth.signOut().finally(() => navigate("/"));

  const local = useLocal({
    loading: true,
    activeTab: "overview",
    publisherData: null as any,
    authorData: null as any,
    products: [] as Product[],
    authors: [] as Author[],
    transactions: null as TransactionData | null,
    searchQuery: "",
    searchResults: [] as Product[],
    isSearching: false,
  }, async () => {
    try {
      // Check user role and fetch appropriate data
      const session = await betterAuth.getSession();
      const userInfo = session.data?.user;
      if (!userInfo) return;

      // Use type assertion to access custom properties
      const userWithRoles = userInfo as typeof userInfo & { 
        id_publisher?: string; 
        id_author?: string;
      };

      if (userWithRoles.id_publisher) {
        try {
          // Fetch publisher data
          const publisherRes = await api.publisher_profile({ user: userInfo });
          if (publisherRes.success && publisherRes.publisher) {
            local.publisherData = publisherRes.publisher;
          }
          
          // Fetch publisher's products using the products API
          const productsRes = await api.products({ user: userInfo });
          if (productsRes.success) {
            local.products = productsRes.data as Product[];
          } else {
            // Fallback to mock data if API fails
            local.products = [
              {
                id: '1',
                name: 'Produk 1',
                cover: '_file/covers/product1.jpg',
                status: 'published',
                real_price: 150000,
                author: { name: 'Penulis A' }
              },
              {
                id: '2',
                name: 'Produk 2',
                cover: '_file/covers/product2.jpg',
                status: 'draft',
                real_price: 200000,
                author: { name: 'Penulis B' }
              }
            ];
          }
          
          // Fetch publisher's authors
          const authorsRes = await api.publisher_authors({ 
            user: userInfo, 
            action: 'list' 
          });
          
          if (authorsRes.success && Array.isArray(authorsRes.data)) {
            local.authors = authorsRes.data as Author[];
          } else {
            // Fallback to mock data if API fails
            local.authors = [
              {
                id: '1',
                name: 'Penulis A',
                auth_user: [{ email: 'penulisa@example.com' }],
                productCount: 3
              },
              {
                id: '2',
                name: 'Penulis B',
                auth_user: [{ email: 'penulisb@example.com' }],
                productCount: 1
              }
            ];
          }

          // Fetch publisher's transactions
          try {
            const transactionsRes = await api.transactions({ user: userInfo });
            if (transactionsRes.success && transactionsRes.data) {
              local.transactions = {
                balance: transactionsRes.data.balance,
                transactions: transactionsRes.data.transactions,
                withdrawals: transactionsRes.data.withdrawals
              } as TransactionData;
            } else {
              // Fallback to mock data if API fails
              local.transactions = {
                balance: 1500000,
                transactions: [
                  {
                    id: '1',
                    type: 'Penjualan',
                    amount: 150000,
                    created_at: '2025-04-30T10:00:00Z'
                  },
                  {
                    id: '2',
                    type: 'Penarikan',
                    amount: -500000,
                    created_at: '2025-04-29T14:30:00Z'
                  }
                ],
                withdrawals: [
                  {
                    id: '1',
                    amount: 500000,
                    status: 'completed',
                    requested_at: '2025-04-29T14:00:00Z'
                  }
                ]
              };
            }
          } catch (error) {
            console.error("Error fetching transactions data:", error);
            // Use fallback data on error
            local.transactions = {
              balance: 1500000,
              transactions: [],
              withdrawals: []
            };
          }
        } catch (error) {
          console.error("Error fetching publisher data:", error);
        }
      } 
      else if (userWithRoles.id_author) {
        try {
          // Fetch author data through author profile API
          const authorRes = await api.author_profile({ user: userInfo });
          if (authorRes.success && authorRes.author) {
            local.authorData = {
              id: authorRes.author.id,
              name: authorRes.author.name || userInfo.name,
              email: userInfo.email
            };
          } else {
            // Fallback to basic user data if API fails
            local.authorData = {
              id: '1',
              name: userInfo.name,
              email: userInfo.email
            };
          }
          
          // Fetch author's products using the products API
          const productsRes = await api.products({ user: userInfo });
          if (productsRes.success) {
            local.products = productsRes.data as Product[];
          } else {
            // Fallback to mock data if API fails
            local.products = [
              {
                id: '3',
                name: 'Produk Author 1',
                cover: '_file/covers/product3.jpg',
                status: 'published',
                real_price: 120000,
                author: { name: userInfo.name || 'Penulis' }
              }
            ];
          }
        } catch (error) {
          console.error("Error fetching author data:", error);
        }
      }

      local.loading = false;
      local.render();
    } catch (error) {
      console.error("Error loading dashboard data:", error);
      local.loading = false;
      local.render();
    }
  });

  // Search handler
  const handleSearch = async (e: FormEvent) => {
    e.preventDefault();
    if (!local.searchQuery.trim()) return;
    
    local.isSearching = true;
    local.render();
    
    try {
      // Mock search functionality
      const filtered = local.products.filter(product => 
        product.name.toLowerCase().includes(local.searchQuery.toLowerCase())
      );
      local.searchResults = filtered;
    } catch (error) {
      console.error("Error searching products:", error);
    } finally {
      local.isSearching = false;
      local.render();
    }
  };

  // Tab change handler
  const handleTabChange = (tab: string) => {
    local.activeTab = tab;
    local.render();
  };

  if (local.loading) {
    return <AppLoading />;
  }

  // Prepare data for components
  const dashboardData: DashboardData = {
    publisherData: local.publisherData,
    authorData: local.authorData,
    products: local.products,
    authors: local.authors,
    transactions: local.transactions
  };

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
        const isPublisher = user?.id_publisher;
        const isAuthor = user?.id_author;
        
        return (
          <div className="flex min-h-svh flex-col">
            {/* Header */}
            <header className="border-b">
              <div className="flex h-16 items-center justify-between px-4 md:px-6">
                <AppLogo />
                <div className="flex items-center gap-4">
                  <div className="font-semibold">{user?.name}</div>
                  <Button variant="outline" onClick={logout}>Keluar</Button>
                </div>
              </div>
            </header>

            {/* Main Content */}
            <div className="grid flex-1 md:grid-cols-[240px_1fr]">
              {/* Sidebar */}
              <div className="border-r bg-muted/40 hidden md:block">
                <div className="flex flex-col gap-2 p-4">
                  <h2 className="font-semibold">
                    {isPublisher ? "Dashboard Penerbit" : "Dashboard Penulis"}
                  </h2>
                  <Button 
                    variant={local.activeTab === "overview" ? "default" : "ghost"} 
                    className="justify-start"
                    onClick={() => handleTabChange("overview")}
                  >
                    Ikhtisar
                  </Button>
                  <Button 
                    variant={local.activeTab === "products" ? "default" : "ghost"} 
                    className="justify-start"
                    onClick={() => handleTabChange("products")}
                  >
                    Produk
                  </Button>
                  {isPublisher && (
                    <>
                      <Button 
                        variant={local.activeTab === "authors" ? "default" : "ghost"} 
                        className="justify-start"
                        onClick={() => handleTabChange("authors")}
                      >
                        Penulis
                      </Button>
                      <Button 
                        variant={local.activeTab === "finance" ? "default" : "ghost"} 
                        className="justify-start"
                        onClick={() => handleTabChange("finance")}
                      >
                        Keuangan
                      </Button>
                    </>
                  )}
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 p-4 md:p-6">
                {/* Mobile Menu */}
                <div className="mb-4 md:hidden">
                  <Tabs 
                    value={local.activeTab}
                    onValueChange={handleTabChange}
                  >
                    <TabsList className="w-full">
                      <TabsTrigger value="overview" className="flex-1">Ikhtisar</TabsTrigger>
                      <TabsTrigger value="products" className="flex-1">Produk</TabsTrigger>
                      {isPublisher && (
                        <>
                          <TabsTrigger value="authors" className="flex-1">Penulis</TabsTrigger>
                          <TabsTrigger value="finance" className="flex-1">Keuangan</TabsTrigger>
                        </>
                      )}
                    </TabsList>
                  </Tabs>
                </div>

                {/* Content for each tab */}
                {local.activeTab === "overview" && (
                  <OverviewTab 
                    data={dashboardData} 
                    isPublisher={!!isPublisher} 
                  />
                )}
                
                {local.activeTab === "products" && (
                  <ProductsTab data={dashboardData} />
                )}
                
                {isPublisher && local.activeTab === "authors" && (
                  <AuthorsTab data={dashboardData} />
                )}
                
                {isPublisher && local.activeTab === "finance" && (
                  <FinanceTab data={dashboardData} />
                )}
              </div>
            </div>
          </div>
        );
      }}
    </Protected>
  );
};
