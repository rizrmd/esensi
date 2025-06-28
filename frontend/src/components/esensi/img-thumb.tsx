export const ImgThumb = ({
  src = null as string | null,
  width = null as number | null,
  height = null as number | null,
  alt = "EO Img" as string,
  className = "" as string,
}) => {
  const img = src !== null ? src.replace("_file/", "_img/") : ``;

  const w = width !== null ? width : "auto";
  const h = height !== null ? height : "auto";
  const newAlt = alt.replace(`"`, ``).replace(`'`, ``);
  const newUrl = `https://esensi.online/${img}${
    w !== "auto" ? `?w=${w}` : ""
  }`;

  const renderImg = img !== null && (
    <>
      <img
        src={newUrl}
        alt={newAlt}
        width={w}
        height={h}
        loading="lazy"
        className={className}
      />
    </>
  );
  return <>{renderImg}</>;
};
