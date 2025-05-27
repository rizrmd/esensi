import { AppLoading } from "@/components/app/loading";
import { Protected } from "@/components/app/protected";
import { PublishMenuBar } from "@/components/publish/menu-bar";
import { api } from "@/lib/gen/publish.esensi";
import { useLocal } from "@/lib/hooks/use-local";
import { navigate } from "@/lib/router";

export default () => {
  const local = useLocal({
    error: "",
  });

  return (
    <Protected
      role={["publisher", "author"]}
      onLoad={async ({ user }) => {
        if (user && !user.idAuthor) await api.register_user({ user });
      }}
      // fallback={({ missing_role }) => {
      //   if (
      //     missing_role.includes("publisher") ||
      //     missing_role.includes("author")
      //   ) {
      //     navigate("/onboarding");
      //     return <AppLoading />;
      //   }
      //   return null;
      // }}
    >
      <div className="flex min-h-svh flex-col bg-gray-50">
        <PublishMenuBar />
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
    </Protected>
  );
};
