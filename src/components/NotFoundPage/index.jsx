import { tenantIndex } from "@/lib/utils";
import { TENANT } from "@/lib/tenantHelper";
import BaseNotFoundPage from "@/components/NotFoundPage/components/BaseNotFoundPage";
import NeoTokyoNotFoundPage from "@/components/NotFoundPage/components/NeoTokyoNotFoundPage";

const NotFoundPage = () => {
    switch (tenantIndex) {
        case TENANT.basedVC:
            return <BaseNotFoundPage />;
        case TENANT.NeoTokyo:
            return <NeoTokyoNotFoundPage />;
        default:
            return <BaseNotFoundPage />;
    }
};

export default NotFoundPage;
