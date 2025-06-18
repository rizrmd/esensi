import { Link } from "@/lib/router";

export const ProfileLinks = ({ label, url, newtab = false, icon = null as any | null }) => {
  return (
    <Link href={url} className="flex w-full h-10 justify-start items-center text-[#3B2C93] font-bold gap-2 p-2 rounded-md" target={newtab ? "_blank" : "_self"}>
      {icon !== null && icon}
      <span>{label}</span>
    </Link>
  );
};
