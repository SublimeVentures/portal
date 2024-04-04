import PAGE from "@/routes";
import Layout from "@/components/Layout/Layout";
import LayoutApp from "@/components/Layout/LayoutApp";

export const getContainerLoaderLayout = (containerUrl, currentPathName) => {
    switch (containerUrl) {
        case PAGE.OTC:
        case PAGE.Launchpad:
        case PAGE.Tokenomics:
        case PAGE.Upgrades:
        case PAGE.Settings:
        case PAGE.Opportunities:
        case PAGE.Notifs:
        case PAGE.Mysterybox:
        case PAGE.Investments:
        case PAGE.App: {
            if (currentPathName === PAGE.Landing) {
                return function (page) {
                    return <Layout>{page}</Layout>;
                };
            }

            return function (page) {
                return <LayoutApp>{page}</LayoutApp>;
            };
        }
        default:
            return function (page) {
                return <Layout>{page}</Layout>;
            };
    }
};
