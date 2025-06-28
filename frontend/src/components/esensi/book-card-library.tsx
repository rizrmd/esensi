import { Link } from "@/lib/router";
import { Button } from "../ui/button";
import CSS from "csstype";
import { ArrowBigDownDash } from "lucide-react";
import { ImgThumb } from "./img-thumb";

export const BookCardLibrary = ({ data }) => {
  const progressCSS: CSS.Properties = {
    maxWidth: `${data.percent}%`,
  };
  
  return (
    <div className="flex w-full h-auto items-stretch gap-4">
      <ImgThumb src={data.cover} alt={data?.name} className="w-1/4 lg:w-[100px] grow-0 bg-black h-auto object-cover object-center rounded-[4px]" width={320}/>
      <div className="flex flex-col w-full h-full lg:py-6 justify-between gap-2">
        <div className="flex justify-between items-start">
          <h3 className="flex text-[#3B2C93] text-sm font-semibold leading-[1.3] grow-1">
            {data.name}
          </h3>
          {data?.percent == 0 && (
            <div className="bg-[#C6011B] text-white leading-[2] text-xs px-2 rounded-full shrink-0">Baru!</div>
          )}
        </div>
        <div className="flex grow-1 justify-start"></div>
        <div className="flex w-full flex-col items-center gap-1.5">
          <div className="flex w-full gap-2">
            <Button asChild className="rounded-md bg-[#3B2C93]">
              <Link
                href="#"
                className="flex w-full justify-center items-center text-md rounded-full"
              >
                {data.percent == 0
                  ? "Mulai baca"
                  : data.percent == 100
                  ? "Baca lagi"
                  : "Lanjut baca"}
              </Link>
            </Button>
            <Button
              asChild
              className="rounded-md bg-[#E1E5EF] text-[#3B2C93] hover:text-white"
            >
              <Link
                href="#"
                className="flex w-auto justify-center items-center text-md rounded-full"
              >
                <ArrowBigDownDash className="size-6" />
              </Link>
            </Button>
          </div>
          <div className="flex relative justify-start w-full h-1 bg-[#E1E5EF] relative rounded-full overflow-hidden">
            <div
              className={`flex relative top-0 left-0 bg-[#3B2C93] z-50 w-full h-full`}
              style={progressCSS}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
};
