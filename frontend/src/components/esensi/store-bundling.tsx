export const StoreBundling = ({ img, desktopImg, url, list }) => {
    const the_img = img || desktopImg;
    const the_img_desktop = desktopImg ? desktopImg : img;
    const books = list.map(( book, idx)=>{
        return (
            <div>adad</div>
        );
    });
    return (
        <div className="flex flex-roww-full">
            <div className="flex flex-row w-full">


            </div>

            <div className="flex flex-column w-full">

                
            </div>

        </div>
    );
};