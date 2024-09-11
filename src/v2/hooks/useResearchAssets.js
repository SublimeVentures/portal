import { useEnvironmentContext } from "@/lib/context/EnvironmentContext";

const useResearchAssets = () => {
    const { cdn } = useEnvironmentContext();
    const getSrc = (src) => `${cdn}${src}`;
    const getResearchSrc = (slug, asset) => getSrc(`/research/${slug}/${asset}`);
    const getResearchReportSrc = (slug) => getResearchSrc(slug, "ResearchReport.pdf");
    return {
        getSrc,
        getResearchSrc,
        getResearchReportSrc,
    };
};

export default useResearchAssets;
