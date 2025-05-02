import { useState } from "react";
import { Button } from "../ui/button";
import { navigate } from "@/lib/router";
import { ChevronLeft, Search, X } from "lucide-react";

export const PageHeader = ({
  title = "Esensi Online" as string,
  back = true as boolean,
  logo = true as boolean,
  search = true as boolean,
}) => {
  const [isSearching, setIsSearching] = useState(false);
  const [pageTitle, setPageTitle] = useState(title);
  const [showBack, setShowBack] = useState(back);
  const [showLogo, setShowLogo] = useState(logo);
  const [showSearch, setShowSearch] = useState(search);
  const [searchValue, setSearchValue] = useState("");

  const searchInput = (e: any) => {
    if (e.type === "keyup" && e.key === "Enter") {
      e.preventDefault();
      navigate(`/search/${encodeURIComponent(searchValue)}`);
    } else {
      setSearchValue(e.target.value);
    }
  };

  const backButton = showBack ? (
    <Button
      variant="ghost"
      className="flex h-full w-auto aspect-square justify-center items-center cursor-pointer rounded-none border-r-[1px] border-r-[color:#D3d3d3]"
      onClick={() => {
        history.back();
      }}
    >
      <ChevronLeft size={24} strokeWidth={2} />
    </Button>
  ) : (
    ""
  );
  const the_logo = showLogo ? (
    <div className="flex h-full w-auto justify-center items-center px-1.5">
      <img
        src="https://esensi.online/logo.webp"
        alt="Esensi Online"
        className="h-[65%] w-auto object-contain object-center"
      />
    </div>
  ) : (
    ""
  );
  const the_title = (
    <div className="flex flex-1 justify-start items-center font-bold px-4">
      {pageTitle}
    </div>
  );
  const the_search = showSearch ? (
    <Button
      onClick={(e) => {
        e.preventDefault();
        setIsSearching(!isSearching);
      }}
      variant="ghost"
      className="flex h-full w-auto justify-center items-center gap-1 cursor-pointer px-1 rounded-none"
    >
      Cari buku <Search size={20} strokeWidth={1.5} />
    </Button>
  ) : (
    ""
  );

  const mode_normal = (
    <div className="w-full h-full flex flex-1 justify-between items-center">
      {backButton}
      {the_logo}
      {the_title}
      {the_search}
    </div>
  );

  const mode_searching = (
    <div className="w-full h-full flex flex-1 justify-between items-center">
      <div className="flex h-auto items-center font-bold pl-4">Cari:</div>
      <div className="w-full h-[80%] flex flex-1 justify-stretch items-stretch px-5">
        <input
          type="text"
          value={searchValue}
          autoFocus
          onKeyUp={searchInput}
          onChange={searchInput}
          placeholder="Ketik judul bukunya..."
          className="border-0 rounded-none w-full h-full outline-none"
        />
      </div>
      <Button
        onClick={(e) => {
          e.preventDefault();
          setIsSearching(!isSearching);
        }}
        variant="ghost"
        className="flex h-full w-auto aspect-square justify-center items-center cursor-pointer rounded-none"
      >
        <X size={48} strokeWidth={1.5} />
      </Button>
    </div>
  );

  return (
    <div className="w-full h-auto border-b-2 border-b-[color:#D3d3d3]">
      <div className="w-full h-12 flex flex-1 flex-nowrap gap-0 items-stretch">
        {isSearching ? mode_searching : mode_normal}
      </div>
    </div>
  );
};
