import { SeoTemplate } from "backend/components/SeoTemplate";
import { defineAPI } from "rlib/server";

export default defineAPI({
  name: "banner",
  url: "/api/banner",
  async handler(arg: { for: string | null }) {

    const banner_for = arg?.for ? arg.for : "default";

    const getBanner = await db.banner.findFirst({
      select: {
        banner_file: true,
      },
      where: {
        title: `banner-${banner_for}`,
        deleted_at: null,
      },
    });

    const the_files = getBanner !== null ? JSON.parse(getBanner.banner_file as string) : [];
    const multiple_files = the_files.length > 1 ? true : false;
    const banner_file = multiple_files ? the_files : the_files[0];
    

    const data = {
      img: banner_file,
      multiple: multiple_files,
    };

    const seo_data = {};

    return {
      jsx: (
        <>
          <SeoTemplate data={seo_data} />
        </>
      ),
      data: data,
    };
  },
});
