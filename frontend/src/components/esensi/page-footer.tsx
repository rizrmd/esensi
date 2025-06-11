import { useLocal } from "@/lib/hooks/use-local";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Link } from "@/lib/router";
import { Instagram, Linkedin, Youtube, MessageCircleCode } from "lucide-react";

export const PageFooter = () => {
  const local = useLocal({ userEmail: "" }, async () => {
    // async init function
  });

  const esensiLogo =
    "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEhOUKb6M5yGcRNhuM1NHSBaAvbNYSFAibMX-1xCI8gI8jl-h566LB-SNs4PW7s2hyphenhyphenj9WNdyhCtn8LFqX9V2j-ABFZoN-nw34q0l4Hf3a13EMffqv6edTQAzK7O-8RXpOIA69rTg6g60hv0eME6yDgJpUZEFIastMfEW-6Pjpq6LFXoGdKExm7L-Hu9PYy8/s1600/esensi-online-logo.png";

  const socialIcons = {
    instagram: <Instagram size={28} />,
    youtube: <Youtube size={34} />,
    linkedin: <Linkedin size={28} />,
    whatsapp: <MessageCircleCode size={28} />,
  };

  const menu_links = [
    {
      label: "Beranda",
      url: "",
    },
    {
      label: "Tentang Kami",
      url: "",
    },
    {
      label: "Promo",
      url: "",
    },
    {
      label: "Hubungi Kami",
      url: "",
    },
  ];

  const help_links = [
    {
      label: "Cara Beli",
      url: "",
    },
    {
      label: "Syarat & Ketentuan",
      url: "",
    },
    {
      label: "Kebijakan Privasi",
      url: "",
    },
    {
      label: "FAQ",
      url: "",
    },
  ];

  const socials = [
    {
      label: "instagram",
      url: "https://www.instagram.com/esensi.online.official",
    },
    {
      label: "linkedin",
      url: "https://www.linkedin.com/company/pt-meraih-ilmu-semesta/",
    },
    {
      label: "whatsapp",
      url: "https://wa.me/",
    },
  ];

  const createLinks = (list) => {
    const items = list.map((item, idx) => {
      return (
        <li
          className="flex justify-start items-center"
          key={`esensi_menu_footer_${idx}`}
        >
          <Link href={item.url}>{item.label}</Link>
        </li>
      );
    });
    return items;
  };

  const renderSocials = socials.map((i, idx) => {
    return (
      <a href={i.url} target="_blank" key={`esensi_footer_socials_${idx}`}>
        {socialIcons[i.label]}
      </a>
    );
  });

  return (
    <footer className="hidden lg:flex justify-center">
      <div className="flex flex-col w-full gap-5 py-5 px-6 mt-10 max-w-[1200px]">
        <div className="flex w-full gap-10">
          <div className="flex flex-col justify-between flex-1 gap-10">
            <img
              src={esensiLogo}
              alt="Esensi Online"
              className="w-[200px] h-auto"
            />
            <h5 className="text-lg font-bold text-[#3B2C93]">
              Baca, Belajar,
              <br />
              dan Bertumbuh
            </h5>
          </div>
          <div className="flex w-auto min-w-xs gap-10 justify-end [&_h4]:font-bold [&_ul]:text-md [&_ul]:flex [&_ul]:flex-col [&_ul]:gap-1 [&>div]:flex [&>div]:flex-col [&>div]:gap-3">
            <div>
              <h4>Quick Links</h4>
              <ul>{createLinks(menu_links)}</ul>
            </div>
            <div>
              <h4>Bantuan</h4>
              <ul>{createLinks(help_links)}</ul>
            </div>
          </div>
          <div className="flex flex-col flex-1 gap-6">
            <h4 className="text-2xl text-[#3B2C93] font-semibold">
              Dapatkan update buku terbaru & promo langsung ke email kamu!
            </h4>
            <div className="relative flex w-full h-10 items-stretch justify-between gap-0 bg-[#F6F6F6] rounded-full text-sm border-none focus:border-none focus:ring-0">
              <Input
                type="text"
                placeholder="Cari buku..."
                className="flex items-center justify-center h-full bg-transparent h-stretch border-none shadow-none outline-none focus:outline-none focus:ring-0 focus-visible:ring-0 px-5 [&::placeholder]:text-[#3B2C93]"
                value={local.userEmail}
                onChange={(e) => {
                  local.userEmail = e.target.value;
                  local.render();
                }}
              />
              <Button
                onClick={(e) => {
                  e.preventDefault();
                }}
                className="flex items-center justify-center h-full bg-[#3B2C93] text-white rounded-full font-normal px-6"
              >
                Berlangganan
              </Button>
            </div>
          </div>
        </div>
        <div className="flex w-full items-center">
          <div className="flex w-auto grow-1">&nbsp;</div>
          <div className="flex w-auto text-sm text-[#3B2C93] font-semibold">
            © 2025 Esensi Online. All rights reserved.
          </div>
          <div className="flex justify-end w-auto grow-1">
            <ul className="flex items-center justify-end gap-3 [&_svg]:h-full [&_svg]:w-auto text-[#3B2C93]">
              {renderSocials}
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
};
