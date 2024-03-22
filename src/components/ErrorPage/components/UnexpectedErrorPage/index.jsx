import { tenantIndex } from "@/lib/utils";
import { TENANT } from "@/lib/tenantHelper";
import BaseUnexpectedErrorPage from "@/components/ErrorPage/components/UnexpectedErrorPage/components/BaseUnexpectedErrorPage";

const UnexpectedErrorPage = () => {
    switch (tenantIndex) {
        case TENANT.basedVC:
            return <BaseUnexpectedErrorPage />;
        default:
            return <BaseUnexpectedErrorPage />;
    }
};

export default UnexpectedErrorPage;
