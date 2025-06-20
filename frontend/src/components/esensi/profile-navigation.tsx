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
import { ProfileButton } from "./profile-button";
import { ProfileLinks } from "./profile-links";

export const ProfileNavigation = ({
  user = null as any | null,
  loyality = null as any | null,
  loading = true as boolean,
}) => {
  const the_user = {
    avatar: user !== null && user?.avatar ? user.avatar : ("https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEg_K_rW_RE87Adt3mgjiLqSPiwTI5LLc8LkhAQ3Qi5xqtudHTuoutzVcloCjiptWUROIM0EWM_eyrfzV6uAx6lhU0ZJRbmbt_JfnZVG9yfRjgnOj3jEUqnQ71piFlOwKbxAibSqthY1Hvv0HyYc1nZb2Yj1Yluqla-_nSZwqzj0zpJLf4PXw9t_3Dd7mj4i/s1600/nouser.png" as string),
    fullname: user !== null && user?.fullname ? user.fullname : ("" as string),
    email: user !== null && user?.email ? user.email : ("" as string),
  };
  const the_loyality = {
    id: loyality !== null && loyality?.id ? loyality.id : ("" as string),
    points:
      loyality !== null && loyality?.points ? loyality.points : (0 as number),
  };

  const sectionProfilePicture = (
    <div className="flex w-full flex-col items-center justify-start text-[#3B2C93]">
      <img
        src={the_user.avatar}
        alt="user"
        className="w-1/4 h-auto aspect-1/1 rounded-full object-center object-cover"
      />
      <strong className="font-bold mt-3">{the_user.fullname}</strong>
      <span className="text-xs">{the_user.email}</span>
    </div>
  );

  const sectionButtonUser = (
    <>
      <ProfileButton
        label={`${the_loyality.points} point`}
        sublabel={the_loyality.id}
        url="#"
      ></ProfileButton>
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

  const renderPage = user !== null ? renderUser : renderGuest;

  return (
    <>
      {loading ? renderLoading : renderPage}
      {loading ? renderLoading : sectionSiteLinks}
      {!loading && user !== null && sectionLogout}
    </>
  );
};
