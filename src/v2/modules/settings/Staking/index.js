import Image from "next/image";

import useStaking from "./useStaking";
import StakingDetails from "./StakingDetails";
import StakingActions from "./StakingActions";
import { useEnvironmentContext } from "@/lib/context/EnvironmentContext";
import { Card, CardTitle } from "@/v2/components/ui/card";
import { Badge } from "@/v2/components/ui/badge";
import DefinitionItem from "@/v2/components/Definition/DefinitionItem";
import { useTenantSpecificData, TENANT } from "@/v2/helpers/tenant";

const TENANTS_STAKIMG = {
    [TENANT.basedVC]: {
        fields: [{ term: "Nft ID:", value: (session) => `#${session.accountId}` }],
    },
    [TENANT.NeoTokyo]: {
        fields: [
            { term: "NFT ID:", value: (session) => `#${session.accountId}` },
            { term: (session) => `${session.isS1 ? "BAYC" : "MAYC"} ID`, value: (session) => `#${session.tokenId}` },
            { term: "Season:", value: (session) => (session.isS1 ? "BAYC" : "MAYC") },
        ],
    },
    [TENANT.CyberKongz]: {
        fields: [
            { term: "NFT ID:", value: (session) => `#${session.accountId}` },
            { term: "Kong ID:", value: (session) => `#${session.tokenId}` },
            { term: "Season:", value: (session) => (session.isS1 ? "Genesis" : "Baby") },
        ],
    },
    [TENANT.BAYC]: {
        fields: [
            { term: "NFT ID:", value: (session) => `#${session.accountId}` },
            { term: "Citizen ID:", value: (session) => `#${session.tokenId}` },
            {
                term: "Season:",
                value: (session) => (session.isElite ? "Season 1 - Elite" : session.isS1 ? "Season 1" : "Season 2"),
            },
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
        <Card variant="none" className="w-full flex flex-col bg-settings-gradient select-none cursor-auto 2xl:flex-row">
            <div className="mb-4 flex items-center gap-4 2xl:hidden">
                <CardTitle className="text-base font-normal 2xl:text-lg 2xl:font-medium text-foreground">
                    Staking
                </CardTitle>
                {isNew ? <Badge variant="warning">New</Badge> : null}
            </div>

            <div className="p-4 w-full bg-white/[.02] gap-7 rounded 2xl:flex 2xl:px-9 2xl:py-6">
                <div className="aspect-square hidden shrink-0 2xl:block">
                    <Image
                        src={session.img ?? session.img_fallback}
                        alt=""
                        width={100}
                        height={100}
                        className="rounded w-full h-full pointer-events-none"
                    />
                </div>
                <div className="w-full flex flex-col justify-center">
                    <div className="mb-4 flex items-center gap-4 w-full xl:mb-0">
                        <Image
                            src={session.img ?? session.img_fallback}
                            alt=""
                            width={100}
                            height={100}
                            className="shrink-0 rounded 2xl:hidden pointer-events-none"
                        />

                        <div>
                            <div className="hidden items-center gap-4 2xl:flex mb-4">
                                <CardTitle className="my-1 text-2xl font-medium text-foreground">Staking</CardTitle>
                                {isNew ? <Badge variant="warning">New</Badge> : null}
                            </div>

                            <div className="flex flex-col flex-wrap gap-x-4 gap-y-2 2xl:flex-row 2xl:mb-4 ">
                                {currentTenant.fields?.map((field, index) => (
                                    <dl key={index} className="flex gap-2">
                                        <DefinitionItem
                                            className="font-bold text-sm"
                                            term={typeof field.term === "function" ? field.term(session) : field.term}
                                            ddClassName="text-foreground text-sm font-light"
                                        >
                                            {typeof field.value === "function" ? field.value(session) : field.value}
                                        </DefinitionItem>
                                    </dl>
                                ))}
                            </div>
                        </div>

                        <div className="hidden ml-auto 2xl:block">
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
                </div>
            </div>
            <div className="2xl:hidden">{stakingEnabled && <StakingActions session={session} staking={staking} />}</div>
        </Card>
    );
}
