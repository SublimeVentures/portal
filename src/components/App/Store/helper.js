import { tenantIndex } from "@/lib/utils";
import { TENANT } from "@/lib/tenantHelper";
import { CURRENCY } from "@/constants/enum/currency.enum";

export const getCurrency = (defaultCurrency) => {
    switch (tenantIndex) {
        case TENANT.basedVC: return CURRENCY.USD;
        default: return defaultCurrency
    }
}
