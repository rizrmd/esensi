import { MainEsensiLayout } from "@/components/esensi/layout";
import {
  LayoutBookList,
  type BooksCardType,
} from "@/components/esensi/layout-book-list";
import { api } from "@/lib/gen/main.esensi";
import { useLocal } from "@/lib/hooks/use-local";

export default (data: Awaited<ReturnType<typeof api.browse>>["data"]) => {
  const header_config = {
    enable: true,
    logo: false,
    back: true,
    search: false,
    title: "Keranjang Belanja",
    cart: false,
    profile: false,
  };

  const local = useLocal({
    loading: true as boolean,
    list: [] as any[],

  }, async () => {});

  const cartCheckAll = (
    <div className="flex w-full items-center gap-2 bg-white py-6">
      <input
        type="checkbox"
        className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
      />
      <span className="text-sm font-medium">Pilih Semua</span>
    </div>
  );

  const cartEmpty = (<>Kosong nih</>);
  const cartItemsList = local.list.map((ci, idx)=>{
    return (
      <div className="flex w-full gap-0">
        <div className="flex w-auto"></div>
        <div className="flex w-1/4">
          <img src={``} alt={``} className="w-full h-auto aspect-3/4 object-center object-cover" />
        </div>
        <div className="flex flex-col w-auto grow-1">
          <h5 className="text-[#3B2C93]"></h5>
          <div className="flex">

          </div>
        </div>
      </div>
    );
  });
  const cartItems = (<>
  {cartCheckAll}
  {cartItemsList} 
  </>);
  const renderCart = local.list.length > 0 ? cartItems : cartItems;
  return (
    <MainEsensiLayout header_config={header_config}>
      <div className="flex flex-col w-full h-auto gap-4 bg-[#E1E5EF]">
        <div className="flex flex-col w-full h-auto gap-4">
          {renderCart}
        </div>
        <div className="flex flex-col w-full h-auto bg-white p-6">Recommendation</div>

      </div>
    </MainEsensiLayout>
  );
};
