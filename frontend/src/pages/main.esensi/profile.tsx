import { MainEsensiLayout } from "@/components/esensi/layout";
import { ProfileButton } from "@/components/esensi/profile-button";
import { ProfileLinks } from "@/components/esensi/profile-links";
import type { api } from "@/lib/gen/main.esensi";
import { useLocal } from "@/lib/hooks/use-local";
import {
  BadgeInfo,
  CircleUser,
  DoorOpen,
  FileText,
  LibraryBig,
  MessageCircleMore,
  Search,
  ShoppingBag,
} from "lucide-react";

export default (data: Awaited<ReturnType<typeof api.profile>>["data"]) => {
  const header_config = {
    enable: true,
    logo: false,
    back: true,
    search: false,
    title: "Profile",
    cart: true,
    profile: false,
  };

  const local = useLocal(
    {
      loading: true as boolean,
      logged_in: false as boolean,
      avatar:
        "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEg_K_rW_RE87Adt3mgjiLqSPiwTI5LLc8LkhAQ3Qi5xqtudHTuoutzVcloCjiptWUROIM0EWM_eyrfzV6uAx6lhU0ZJRbmbt_JfnZVG9yfRjgnOj3jEUqnQ71piFlOwKbxAibSqthY1Hvv0HyYc1nZb2Yj1Yluqla-_nSZwqzj0zpJLf4PXw9t_3Dd7mj4i/s1600/nouser.png" as string,
      user: {
        name: "" as string,
        email: "" as string,
      } as any,
      points: {
        id: "" as string,
        value: 0 as number,
      },
    },
    async () => {
      local.logged_in = true;
      local.user.name = "Nama Pengguna";
      local.user.email = "user@esensi.online";
      local.points.id = "EO808VX";
      local.points.value = 23;
      local.loading = false;
      local.render();
    }
  );

  const sectionProfilePicture = (
    <div className="flex w-full flex-col items-center justify-start text-[#3B2C93]">
      <img
        src={local.avatar}
        alt="user"
        className="w-1/4 h-auto aspect-1/1 rounded-full object-center object-cover"
      />
      <strong className="font-bold mt-3">{local.user.name}</strong>
      <span className="text-xs">{local.user.email}</span>
    </div>
  );

  const sectionButtonUser = (
    <>
    <ProfileButton label={`${local.points.value} point`} sublabel={local.points.id} url="#"></ProfileButton>
    </>
  );
  const sectionUserMenu = (
    <div className="flex flex-col">
      <ProfileLinks
        label="Transaksi"
        url="/history"
        newtab={false}
        icon={<FileText />}
      ></ProfileLinks>
      <ProfileLinks
        label="Koleksi"
        url="/library"
        newtab={false}
        icon={<LibraryBig />}
      ></ProfileLinks>
      <ProfileLinks
        label="Edit Profil"
        url="#"
        newtab={false}
        icon={<CircleUser />}
      ></ProfileLinks>
    </div>
  );
  const sectionSiteLinks = (
    <div className="flex flex-col gap-4">
      <hr className="border-t border-t-[#E1E5EF]" />
      <div className="flex flex-col">
        <ProfileLinks
          label="Customer Support"
          url="#"
          newtab={true}
          icon={<MessageCircleMore />}
        ></ProfileLinks>
        <ProfileLinks
          label="Tentang Esensi"
          url="/about"
          newtab={true}
          icon={<BadgeInfo />}
        ></ProfileLinks>
      </div>
    </div>
  );
  const sectionLogout = (
    <div className="flex flex-col gap-4">
      <hr className="border-t border-t-[#E1E5EF]" />
      <ProfileLinks
        label="Keluar Akun"
        url="/logout"
        newtab={false}
        icon={<DoorOpen />}
      ></ProfileLinks>
    </div>
  );

  const renderLoading = <>Masih loading</>;
  const renderGuest = (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col">
        <ProfileButton label="Daftar/Masuk" url="/login"></ProfileButton>
      </div>
      <div className="flex flex-col">
        <ProfileLinks
          label="Belanja"
          url="/"
          newtab={false}
          icon={<ShoppingBag />}
        ></ProfileLinks>
        <ProfileLinks
          label="Cari Buku"
          url="/search"
          newtab={false}
          icon={<Search />}
        ></ProfileLinks>
      </div>
    </div>
  );
  const renderUser = (
    <>
      {sectionProfilePicture}
      {sectionButtonUser}
      {sectionUserMenu}
    </>
  );

  const renderPage = local.logged_in ? renderUser : renderGuest;

  return (
    <MainEsensiLayout header_config={header_config} mobile_menu={true}>
      <div className="flex justify-center p-6 lg:bg-[#E1E5EF] lg:py-10 lg:px-0">
        <div className="flex flex-col w-full h-full max-w-[1200px] h-auto">
          <div className="flex flex-col gap-4 w-full h-auto lg:w-[350px] lg:bg-white lg:py-6 lg:px-8">
          {local.loading ? renderLoading : renderPage}
          {!local.loading && sectionSiteLinks}
          {!local.loading && local.logged_in && sectionLogout}
          </div>
        </div>
      </div>
    </MainEsensiLayout>
  );
};
