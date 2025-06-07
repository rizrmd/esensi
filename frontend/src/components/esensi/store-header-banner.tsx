import { MoveRight } from "lucide-react";
import { Link } from "@/lib/router";
import { Button } from "../ui/button";

export const StoreHeaderBanner = ({
  img,
  title,
  subtitle,
  btnlabel,
  btnurl,
}) => {
  const bannerImage =
    img && img !== ""
      ? img
      : "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEgU1yo1WjoGn3ORo8MQjhX5pIzlnkk_8a55xGT0b9Ap3rX2osccVQQIyMRnqIE6bXw7PZEUkjFK4Rq9UmZr2547ratdgsWKljHWk0cxo36IXpU59FaL-HsWTIyrBrAhA82yIfN-GlRZPguxeuuQjtIWn5E59tQ1y6Y7aJ_hRSwj4WkudbMFyaJSDiQY_aw/s1600/header-banner.png";
  return (
    <div className="w-full h-auto relative">
      <Link href={btnurl} className="w-full h-auto aspect-video flex flex-col lg:hidden">
        <img
          src={bannerImage}
          className="absolute top-0 left-0 w-full h-full object-cover object-center"
        />
        <div className="absolute top-0 left-0 w-full h-full flex flex-col justify-end items-start gap-2 py-8 px-6 text-white">
          <h3 className="text-2xl font-medium max-w-[50%]">{title}</h3>
          <p className="text-lg">{subtitle}</p>
        </div>
      </Link>

      <div className="w-full h-auto aspect-3/1 hidden lg:flex lg:flex-col">
        <img
          src={bannerImage}
          className="absolute top-0 left-0 w-full h-full object-cover object-center"
        />
        <div className="absolute top-0 left-0 w-full max-w-[50%] h-full flex flex-col justify-end items-start gap-6 py-15 px-25 text-white">
          <h3 className="text-5xl font-semibold leading-[1.5]">{title}</h3>
          <p className="text-2xl">{subtitle}</p>
          <Button variant="outline" asChild>
            <Link
              href={btnurl}
              className="flex text-xl justify-center items-center gap-4 px-14 w-auto h-auto text-white bg-transparent border-1 border-white"
            >
              <span>{btnlabel}</span>
              <MoveRight size={32} />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
};
