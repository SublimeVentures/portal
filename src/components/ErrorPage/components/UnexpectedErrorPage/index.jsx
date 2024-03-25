import { tenantIndex } from "@/lib/utils";
import { TENANT } from "@/lib/tenantHelper";
import BaseUnexpectedErrorPage from "@/components/ErrorPage/components/UnexpectedErrorPage/components/BaseUnexpectedErrorPage";
import NeoTokyoUnexpectedErrorPage from "@/components/ErrorPage/components/UnexpectedErrorPage/components/NeoTokyoUnexpectedErrorPage";

const UnexpectedErrorPage = () => {
    switch (tenantIndex) {
        case TENANT.basedVC:
            return <BaseUnexpectedErrorPage />;
        case TENANT.NeoTokyo:
            return <NeoTokyoUnexpectedErrorPage/>;
        default:
            return <BaseUnexpectedErrorPage />;
    }
};

export default UnexpectedErrorPage;
