import CSS from "csstype";
export const LoginBanner = ({
  img = null as string | null,
  title = null as string | null,
  subtitle = null as string | null,
}) => {
    const esensi_logo_url = `data:image/png;base64,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`;
  const esensi_logo = (<>
  <img src={esensi_logo_url} alt="Esensi Online" className="w-[120px] h-auto object-contain" />
  </>);
    if (img == "" || img == null) {
    img = `https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEgU1yo1WjoGn3ORo8MQjhX5pIzlnkk_8a55xGT0b9Ap3rX2osccVQQIyMRnqIE6bXw7PZEUkjFK4Rq9UmZr2547ratdgsWKljHWk0cxo36IXpU59FaL-HsWTIyrBrAhA82yIfN-GlRZPguxeuuQjtIWn5E59tQ1y6Y7aJ_hRSwj4WkudbMFyaJSDiQY_aw/s1600/header-banner.png`;
  }
  const bannerCSS: CSS.Properties = {
          backgroundImage: `url(${img})`,
      };
  if (title == null || title == "") {
    title = `Dunia Baru Dimulai dari Satu Halaman`;
  }
  if (subtitle == null || subtitle == "") {
    subtitle = `Lorem ipsum dolor sit amet consectetur.`;
  }

  return <div className="flex w-full h-full p-20 gap-10 flex-col justify-between items-start bg-cover bg-no-repeat bg-top-left" style={bannerCSS}>
    <div className="flex grow-1 justify-start items-start">{esensi_logo}</div>
    <h2 className="flex text-7xl text-white font-semibold">{title}</h2>
    <p className="flex text-white">{subtitle}</p>
    
  </div>;
};
