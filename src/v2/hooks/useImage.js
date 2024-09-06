import { useEnvironmentContext } from "@/lib/context/EnvironmentContext";

const IMG = {
    ICON: "icon.jpg",
    BG: "bg.jpg",
    LOGO: "logo.jpg",
};

const useImage = () => {
    const { cdn } = useEnvironmentContext();
    const getSrc = (src) => `${cdn}${src}`;
    const getResearchSrc = (slug, img) => getSrc(`/research/${slug}/${img}`);
    const getResearchIconSrc = (slug) => getResearchSrc(slug, IMG.ICON);
    const getResearchBgSrc = (slug) => getResearchSrc(slug, IMG.BG);
    const getResearchLogoSrc = (slug) => getResearchSrc(slug, IMG.LOGO);
    const getStoreSrc = (src) => getSrc(`/webapp/store/${src}`);
    return {
        getSrc,
        getResearchSrc,
        getResearchIconSrc,
        getResearchBgSrc,
        getResearchLogoSrc,
        getStoreSrc,
    };
};

export default useImage;
