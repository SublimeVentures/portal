import BasedInternalErrorPage from "@/components/ErrorPage/components/InternalServerErrorPage/components/BasedInternalErrorPage";
import { tenantIndex } from "@/lib/utils";
import { TENANT } from "@/lib/tenantHelper";
import NeoTokyoInternalErrorPage from "@/components/ErrorPage/components/InternalServerErrorPage/components/NeoTokyoInternalErrorPage";

const InternalErrorPage = () => {
    switch (tenantIndex) {
        case TENANT.basedVC:
            return <BasedInternalErrorPage />;
        case TENANT.NeoTokyo:
            return <NeoTokyoInternalErrorPage />;
        default:
            return <BasedInternalErrorPage />;
    }
};

export default InternalErrorPage;
