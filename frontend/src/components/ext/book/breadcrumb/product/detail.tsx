import { navigate } from "@/lib/router";
import { ChevronRight } from "lucide-react";
import type { FC } from "react";

export const Breadcrumb: FC = () => (
  <>
    <nav className="flex items-center text-sm text-gray-600 mb-4">
      <button
        onClick={() => navigate("/manage-product")}
        className="hover:text-blue-600 transition-colors font-medium cursor-pointer"
      >
        Daftar Produk
      </button>
      <ChevronRight className="h-4 w-4 mx-2 text-gray-400" />
      <span className="text-gray-800 font-medium">Detil Produk</span>
    </nav>
    <div className="border-b border-gray-200 mb-6"></div>
  </>
);
