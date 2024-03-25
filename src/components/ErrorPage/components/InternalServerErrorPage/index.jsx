import BaseInternalErrorPage from "src/components/ErrorPage/components/InternalServerErrorPage/components/BasedInternalErrorPage";
import { tenantIndex } from "@/lib/utils";
import { TENANT } from "@/lib/tenantHelper";
import NeoTokyoInternalErrorPage from "@/components/ErrorPage/components/InternalServerErrorPage/components/NeoTokyoInternalErrorPage";

const InternalErrorPage = () => {
    switch (tenantIndex) {
        case TENANT.basedVC:
            return <BaseInternalErrorPage />;
        case TENANT.NeoTokyo:
            return <NeoTokyoInternalErrorPage />;
        default:
            return <BaseInternalErrorPage />;
    }
};

export default InternalErrorPage;
