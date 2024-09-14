import { useEnvironmentContext } from "@/lib/context/EnvironmentContext";

const useResearchAssets = () => {
    const { cdn } = useEnvironmentContext();
    const getSrc = (src) => `${cdn}${src}`;
    const getResearchSrc = (slug, asset) => {
        return getSrc(`/research/${slug}/${asset}`);
    };
    const getResearchReportSrc = (slug) => getResearchSrc(slug, "ResearchReport.pdf");
    const getResearchReportMeta = (slug) => getResearchSrc(slug, "meta.json");
    const getResearchReportPages = (slug) => (page) => getResearchSrc(slug, `ResearchReport_page-${page}.jpg`);
    return {
        getSrc,
        getResearchSrc,
        getResearchReportSrc,
        getResearchReportMeta,
        getResearchReportPages,
    };
};

export default useResearchAssets;
