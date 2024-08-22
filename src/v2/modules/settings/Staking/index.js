import Image from "next/image";

import { useEnvironmentContext } from "@/lib/context/EnvironmentContext";
import { Card, CardTitle } from "@/v2/components/ui/card";
import { Badge } from "@/v2/components/ui/badge";
import DefinitionItem from "@/v2/components/Definition/DefinitionItem";
import { useTenantSpecificData, TENANT } from "@/v2/helpers/tenant";
import useStaking from "./useStaking";
import StakingDetails from "./StakingDetails";
import StakingActions from "./StakingActions";

const TENANTS_STAKIMG = {
    [TENANT.basedVC]: {
        fields: [
            { term: "Nft ID:", value: (session) => `#${session.accountId}` },
        ],
    },
    [TENANT.NeoTokyo]: {
        fields: [
            { term: "Nft ID:", value: (session) => `#${session.accountId}` },
            { term: (session) => `${session.isS1 ? "BAYC" : "MAYC"} ID`, value: (session) => `#${session.tokenId}` },
            { term: "Season:", value: (session) => session.isS1 ? "BAYC" : "MAYC" },
        ],
    },
    [TENANT.CyberKongz]: {
        fields: [
            { term: "Nft ID:", value: (session) => `#${session.accountId}` },
            { term: "Kong ID:", value: (session) => `#${session.tokenId}` },
            { term: "Season:", value: (session) => session.isS1 ? "Genesis" : "Baby" },
        ],
    },
    [TENANT.BAYC]: {
        fields: [
            { term: "Nft ID:", value: (session) => `#${session.accountId}` },
            { term: "Citizen ID:", value: (session) => `#${session.tokenId}` },
            { term: "Season:", value: (session) => session.isElite ? "Season 1 - Elite" : session.isS1 ? "Season 1" : "Season 2" },
        ],
    },
};

// @TODO: When should we show "new" badge?
const isNew = true;

export default function Staking({ session }) {
    const { currencyStaking, account } = useEnvironmentContext();
    const stakingEnabled = currencyStaking?.length > 0 && session.stakingEnabled;

    const { id: tenantId } = useTenantSpecificData();
    const currentTenant = TENANTS_STAKIMG[tenantId] || {};
    
    const staking = useStaking({ tenantId, session, account });
    
    return (
        <Card variant="none" className="py-6 px-12 h-full flex flex-col w-full bg-settings-gradient md:flex-row">
            <div className="h-full flex flex-col gap-8 w-full md:flex-row md:h-max">
                <Image src={session.img ?? session.img_fallback} alt="" width={240} height={240} className="hidden shrink-0 rounded md:block" />

                <div className="flex flex-col justify-center w-full gap-4">
                    <div className="flex items-center gap-4 md:hidden">
                        <CardTitle className="text-base font-normal md:text-lg md:font-medium text-foreground leading-10">
                            Staking
                        </CardTitle>
                        {isNew ? <Badge variant="warning">New</Badge> : null}
                    </div>

                    <div className="flex items-center gap-4">
                        <Image src={session.img ?? session.img_fallback} alt="" width={87} height={87} className="shrink-0 rounded md:hidden" />

                        <div>
                            <div className="hidden items-center gap-4 md:flex">
                                <CardTitle className="my-1 text-2xl font-medium text-foreground">Staking</CardTitle>
                                {isNew ? <Badge variant="warning">New</Badge> : null}
                            </div>

                            <div className="flex flex-col flex-wrap gap-x-4 gap-y-2 md:flex-row">
                                {currentTenant.fields?.map((field, index) => (
                                    <dl key={index} className="flex gap-2">
                                        <DefinitionItem className="font-bold" term={typeof field.term === "function" ? field.term(session) : field.term}>
                                            <span className="font-light">{typeof field.value === "function" ? field.value(session) : field.value}</span>
                                        </DefinitionItem>
                                    </dl>
                                ))}
                            </div>
                        </div>

                        <div className="hidden ml-auto md:block">
                            {stakingEnabled && <StakingActions session={session} staking={staking} />}
                        </div>
                    </div>

                    {stakingEnabled ? (
                        <StakingDetails session={session} staking={staking} />
                    ) : (
                        <div className="mb-2 mt-4 py-4 px-8 flex flex-col gap-6 text-foreground font-medium bg-foreground/[.02] text-center rounded">
                            Staking available soon
                        </div>
                    )}

                    <div className="md:hidden">
                        {stakingEnabled && <StakingActions session={session} staking={staking} />}
                    </div>
                </div>
            </div>
        </Card>
    );
};
