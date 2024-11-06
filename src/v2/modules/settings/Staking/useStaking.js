import { useState, useCallback } from "react";
import { useRouter } from "next/router";

import { timeUntilNextUnstakeWindow } from "./helpers";
import { useEnvironmentContext } from "@/lib/context/EnvironmentContext";
import useGetStakeRequirements from "@/lib/hooks/useGetStakeRequirements";
import { updateStaking } from "@/fetchers/settings.fetcher";
import { TENANT } from "@/v2/helpers/tenant";

export default function useStaking({ tenantId, session, account }) {
    const router = useRouter();
    const { diamonds } = useEnvironmentContext();

    const [staked, setStaked] = useState(() => session.isStaked ?? false);
    const [stakeReq, setStakeReq] = useState(0);
    const [stakeDate, setStakeDate] = useState(0);

    const uuid = `${session?.tenantId}_${session?.userId}`;
    const chainId = Object.keys(diamonds)[0];
    const diamond = diamonds[chainId];
    const stakeData = useGetStakeRequirements(
        true,
        uuid,
        diamond,
        Number(process.env.NEXT_PUBLIC_TENANT),
        Number(chainId),
    );

    const stakeOnCurrentWallet = session.stakedOn === account.address;
    const unstakeDate = session?.stakeDate ? session.stakeDate : stakeDate;
    const unstakingData = timeUntilNextUnstakeWindow(
        unstakeDate,
        staked,
        stakeData?.stakeLength[0],
        stakeData?.stakeWithdraw[0],
    );

    const refreshSession = useCallback(
        async (force = false) => {
            const result = await updateStaking(account.address);

            if (!result?.ok) {
                const updatedSession = result?.data?.updates ?? {};

                if (updatedSession.isStaked) setStaked(true);
                if (updatedSession.stakeSize) setStakeReq(updatedSession.stakeSize);
                if (updatedSession.stakeDate) setStakeDate(updatedSession.stakeDate);
                if (updatedSession.isStaked) router.reload();
            } else if (force) {
                router.reload();
            }
        },
        [account.address, router],
    );

    const getDataBasedOnTenant = (tenantId) => {
        switch (tenantId) {
            case TENANT.basedVC:
                return {
                    stakeMulti: session.stakeMulti,
                    isStaked: session.isStaked,
                };
            case TENANT.CyberKongz:
                return {
                    isFlexibleStaking: true,
                    stakeMulti: session.stakeMulti,
                    isStaked: session.isStaked,
                };
            case TENANT.NeoTokyo:
                return {};
            case TENANT.BAYC:
                return {
                    stakeMulti: session.stakeMulti,
                    isStaked: session.isStaked,
                };
            default:
                return {};
        }
    };

    return {
        staked,
        stakeReq: session.stakeReq,
        stakeSize: session.stakeSize,
        isElite: session.isElite,
        // isS1: session.isS1,
        stakeOnCurrentWallet,
        unstakingData,
        refreshSession,
        ...getDataBasedOnTenant(tenantId),
    };
}
