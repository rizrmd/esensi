import { Link } from "@/lib/router";
import { Button } from "../ui/button";
import CSS from "csstype";

export const BookCardLibrary = ({ data }) => {
    const progressCSS: CSS.Properties = {
        maxWidth: `${data.percent}%`,
    };
  return (
    <div className="flex w-full h-auto items-start lg:items-stretch gap-4">
      <img
          src={`https://esensi.online/${data.cover.replace(
            "_file/",
            "_img/"
          )}?w=320`}
          alt={data!.name.replace("'", "").replace('"', "")}
          className="w-1/4 lg:w-[100px] grow-0 bg-black h-auto object-cover object-center rounded-[4px]"
        />
      <div className="flex flex-col w-full lg:align-stretch lg:py-6 justify-between gap-2">
        <h3 className="flex text-[#3B2C93] text-sm font-semibold leading-[1.3]">
          {data.name}
        </h3>
        <div className="flex w-full flex-col items-center gap-1">
          <div className="flex w-full gap-3">
            <Button asChild className="rounded-full bg-[#3B2C93]">
              <Link href="#" className="flex w-full justify-center items-center text-md rounded-full">
                {data.percent == 0
                  ? "Mulai baca"
                  : data.percent == 100
                  ? "Baca lagi"
                  : "Lanjut baca"}
              </Link>
            </Button>
            <Button asChild className="rounded-full bg-[#E1E5EF] text-[#3B2C93] hover:text-white">
              <Link href="#" className="flex w-full justify-center items-center text-md rounded-full">
                Download
              </Link>
            </Button>
          </div>
          <div className="flex relative justify-start w-[95%] h-1 bg-[#E1E5EF] relative rounded-full overflow-hidden">
            <div className={`flex relative top-0 left-0 bg-[#3B2C93] z-50 w-full h-full`} style={progressCSS}></div>
          </div>
        </div>
      </div>
    </div>
  );
};
