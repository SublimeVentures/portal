import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/router';

import { updateStaking } from "@/fetchers/settings.fetcher";
import { TENANT } from "@/v2/helpers/tenant";
import { timeUntilNextUnstakeWindow } from "./helpers";

export default function useStaking({ tenantId, session, account }) {
    const router = useRouter();

    const [staked, setStaked] = useState(() => session.isStaked ?? false);
    const [_stakeReq, setStakeReq] = useState(() => session.stakeSize ?? 0);
    const [stakeDate, setStakeDate] = useState(() => session.stakeDate ?? 0);

    const unstakeDate = session?.stakeDate ? session.stakeDate : stakeDate;
    const unstakeDetails = timeUntilNextUnstakeWindow(unstakeDate, staked);

    const refreshSession = useCallback(async (force = false) => {
        const result = await updateStaking(account.address);

        if (!result?.ok) {
            const updatedSession = result?.data?.updates ?? {};

            if (updatedSession.isStaked) setStaked(updatedSession.isStaked);
            if (updatedSession.stakeSize) setStakeReq(updatedSession.stakeSize);
            if (updatedSession.stakeDate) setStakeDate(updatedSession.stakeDate);
            if (updatedSession.isStaked) router.reload();
        } else if (force) {
            router.reload();
        };
    }, [account.address, router]);

    useEffect(() => setStaked(session.isStaked), []);

    const getDataBasedOnTenant = (tenantId) => {
        switch (tenantId) {
            case TENANT.basedVC:
                return {}
            case TENANT.CyberKongz:
                return {
                    isFlexibleStaking: true,
                    stakeMulti: session.stakeMulti,
                    isStaked: session.isStaked,
                };
            case TENANT.NeoTokyo:
                return {}
            case TENANT.BAYC:
                return {
                    stakeMulti: session.stakeMulti,
                    isStaked: session.isStaked,
                };
            default:
                return {}
        }
    }

    return {
        staked,
        stakeReq: session.stakeReq,
        stakeSize: session.stakeSize,
        isElite: session.isElite,
        isS1: session.isS1,
        ...unstakeDetails,
        refreshSession,
        ...getDataBasedOnTenant(tenantId)
    }
};
