import { MainEsensiLayout } from "@/components/esensi/layout";
import { useLocal } from "@/lib/hooks/use-local";
import { api } from "@/lib/gen/main.esensi";
import { Link } from "@/lib/router";
import { formatMoney } from "@/components/esensi/format-money";

export default () => {
  const header_config = {
    enable: true,
    logo: false,
    back: true,
    search: false,
    title: "Detail buku",
    cart: true,
    profile: true,
  };
  const local = useLocal(
    {
      loading: true as boolean,
      product: {
        name: "" as string,
        slug: "" as string,
        strike_price: null as number | null,
        real_price: null as number | null,
        desc: "" as string,
        info: {} as any,
        currency: "" as string,
        cover: "" as string,
      },
      author: null as string | null,
      categories: [] as any[],
      desc_open: false as boolean,
    },
    async () => {
      const res = await api.product();
      local.product = res.data.dummy;
      local.categories = res.data.dummycat;
      local.loading = false;
      local.render();
    },
  );
  const bookCover = local.loading ? (
    <></>
  ) : (
    <img
      src={`https://esensi.online/${local.product.cover.replace("_file/", "_img/")}?w=320`}
      alt={`${local.product?.name.replace(`'`, ``).replace(`"`, ``)}`}
      className="flex max-w-1/2 aspect-3/4 object-center object-cover rounded-xs"
    />
  );

  const bookTitle = local.loading ? (
    <></>
  ) : (
    <h2 className="flex text-[#3B2C93] text-lg font-semibold">
      {local.product.name}
    </h2>
  );
  const bookAuthor = local.loading ? (
    <></>
  ) : local.author !== "" && local.author !== null ? (
    <Link href={`#`} className="flex">
      Author
    </Link>
  ) : (
    <></>
  );

  const bookCats = local.categories.map((c, idx) => {
    return (
      <Link href={c.slug} key={`esensi_product_cats_${c.slug}`}>
        {c.name}
      </Link>
    );
  });

  return (
    <MainEsensiLayout header_config={header_config}>
      <div className="flex flex-col items-center justify-start">
        <div className="flex flex-col container items-center justify-start gap-5 px-6">
          <div className="flex justify-center">{bookCover}</div>
          <div className="flex w-full justify-between items-center gap-5">
            <div className="flex flex-col flex-1 gap-2 justify-between">
              {bookTitle} {bookAuthor}
            </div>
            <div className="flex w-auto">bookmark</div>
          </div>
          <div className="w-full flex flex-wrap justify-start items-center gap-2 [&>a]:bg-[#E1E5EF] [&>a]:text-[#383D64] [&>a]:rounded-full [&>a]:px-2 [&>a]:text-[11px]">
            {bookCats}
          </div>
          <div className="flex items-start flex-col">
            <span className="flex justify-start w-auto text-[#C6011B] font-extrabold text-5xl">
              {formatMoney(local.product.real_price, local.product.currency)}
            </span>
          </div>
          <div className="flex">info</div>
          <div
            className="flex flex-col items-start justify-start w-full gap-4"
            dangerouslySetInnerHTML={{ __html: local.product.desc }}
          ></div>
        </div>
        <div className="flex">related</div>
      </div>
    </MainEsensiLayout>
  );
};
