import basedVC from "@/v2/tenants/1.js";
import NeoTokyo from "@/v2/tenants/6.js";
import CyberKongz from "@/v2/tenants/14.js";
import BAYC from "@/v2/tenants/19.js";

export const TENANT = Object.freeze({
    basedVC: 1,
    NeoTokyo: 6,
    CyberKongz: 14,
    BAYC: 19,
})
  
export const tenantConfigs = Object.freeze({
    [TENANT.basedVC]: basedVC,
    [TENANT.NeoTokyo]: NeoTokyo,
    [TENANT.CyberKongz]: CyberKongz,
    [TENANT.BAYC]: BAYC,
});

export const useTenantSpecificData = () => {
    const currentTenant = Number(process.env.NEXT_PUBLIC_TENANT);
    return tenantConfigs[currentTenant];
}
