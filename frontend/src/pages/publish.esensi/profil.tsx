import { AppLoading } from "@/components/app/loading";
import { Protected } from "@/components/app/protected";
import { PublishMenuBar } from "@/components/publish/menu-bar";
import {
  betterAuth,
  type AuthClientGetSessionAPIResponse,
  type User,
} from "@/lib/better-auth";
import { api } from "@/lib/gen/publish.esensi";
import { useLocal } from "@/lib/hooks/use-local";
import { navigate } from "@/lib/router";

export default () => {
  const local = useLocal(
    {
      user: null as Partial<User> | null,
      loading: true,
      error: "",
    },
    async () => {
      try {
        const session: AuthClientGetSessionAPIResponse =
          await betterAuth.getSession();
        if (!session.data?.user) {
          navigate("/");
          return;
        }
        local.user = session.data.user;
        await api.register_user({ user: session.data!.user });

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
                  <div className="mx-8 py-8">
                    <div className="flex justify-between items-start mb-8 gap-4">
                      <div className="flex items-center gap-4">
                        <h1 className="text-2xl font-bold text-gray-800">
                          Profil
                        </h1>
                      </div>
                    </div>
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
