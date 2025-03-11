import BasedUnexpectedErrorPage from "@/components/ErrorPage/components/UnexpectedErrorPage/components/BasedUnexpectedErrorPage";
import { tenantIndex } from "@/lib/utils";
import { TENANT } from "@/lib/tenantHelper";
import NeoTokyoUnexpectedErrorPage from "@/components/ErrorPage/components/UnexpectedErrorPage/components/NeoTokyoUnexpectedErrorPage";

const UnexpectedErrorPage = () => {
    switch (tenantIndex) {
        case TENANT.basedVC:
            return <BasedUnexpectedErrorPage />;
        case TENANT.NeoTokyo:
            return <NeoTokyoUnexpectedErrorPage />;
        default:
            return <BasedUnexpectedErrorPage />;
    }
};

export default UnexpectedErrorPage;
