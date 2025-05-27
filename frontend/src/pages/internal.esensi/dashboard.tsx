import { Protected } from "@/components/app/protected";
import { InternalMenuBar } from "@/components/internal/menu-bar";
import { useLocal } from "@/lib/hooks/use-local";
import { Role } from "backend/api/types";

export default () => {
  const local = useLocal({
    error: "",
  });

  return (
    <Protected role={[Role.INTERNAL]}>
      <div className="flex min-h-svh flex-col bg-gray-50">
        <InternalMenuBar />
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
