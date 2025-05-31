import { Protected } from "@/components/app/protected";
import { Error } from "@/components/ext/error";
import { MenuBarPublish } from "@/components/ext/menu-bar/publish";
import { PublishFallback } from "@/components/ext/publish-fallback";
import { useLocal } from "@/lib/hooks/use-local";
import { Role } from "backend/api/types";

export default () => {
  const local = useLocal({
    error: "",
  });

  return (
    <Protected role={[Role.AUTHOR, Role.PUBLISHER]} fallback={PublishFallback}>
      <div className="flex min-h-svh flex-col bg-gray-50">
        <MenuBarPublish />
        <main className="flex-1">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
            <Error msg={local.error} />
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-6"></div>
            </div>
          </div>
        </main>
      </div>
    </Protected>
  );
};
