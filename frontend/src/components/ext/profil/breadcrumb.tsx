import { navigate } from "@/lib/router";
import { ChevronRight } from "lucide-react";
import type { FC } from "react";

export const Breadcrumb: FC<{ className?: string }> = ({ className }) => (
  <div className="mx-6 mt-6">
    <nav className="flex items-center text-sm text-gray-600 mb-4">
      <button
        onClick={() => navigate("/dashboard")}
        className="hover:text-blue-600 transition-colors font-medium cursor-pointer"
      >
        Beranda
      </button>
      <ChevronRight className="h-4 w-4 mx-2 text-gray-400" />
      <span className="text-gray-800 font-medium">Profil</span>
    </nav>
    <div className="border-b border-gray-200"></div>
  </div>
);
