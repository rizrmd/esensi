import { AppLoading } from "@/components/app/loading";
import { Protected } from "@/components/app/protected";
import { PublishMenuBar } from "@/components/publish/menu-bar";
import {
  betterAuth,
  type AuthClientGetSessionAPIResponse,
  type User,
} from "@/lib/better-auth";
import { api as authApi } from "@/lib/gen/auth.esensi";
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
        return null;
      }}
    >
      {({ user }) => {
        return (
          <div className="flex min-h-svh flex-col bg-gray-50">
            <PublishMenuBar />
            {/* Main Content */}
            <main className="flex-1">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
                {local.error ? (
                  <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg mb-8 shadow-sm">
                    {local.error}
                  </div>
                ) : null}

                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                  <div className="p-6"></div>
                </div>
              </div>
            </main>
          </div>
        );
      }}
    </Protected>
  );
};
