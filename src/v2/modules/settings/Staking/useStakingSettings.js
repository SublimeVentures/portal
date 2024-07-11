import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/router';

import { timeUntilNextUnstakeWindow } from "@/components/App/Settings/helper";

export default function useStakingSettings({ session, account }) {
    const router = useRouter();

    const [staked, setStaked] = useState(() => session.isStaked ?? false);
    const [stakeReq, setStakeReq] = useState(() => session.stakeSize ?? 0);
    const [stakeDate, setStakeDate] = useState(() => session.stakeDate ?? 0);
    
    const allocationBonus = session.allocationBonus ?? 0;
    const unstakeDetails = timeUntilNextUnstakeWindow(stakeDate, staked);

    const refreshSession = useCallback(async (force = false) => {
      const result = await updateStaking(account.address);

      if (!result?.ok) {
          const updatedSession = result.data.updates;
          if (updatedSession.isStaked !== undefined) setStaked(updatedSession.isStaked);
          if (updatedSession.stakeSize !== undefined) setStakeReq(updatedSession.stakeSize);
          if (updatedSession.stakeDate !== undefined) setStakeDate(updatedSession.stakeDate);
          if (updatedSession.isStaked) router.reload();
      } else if (force) {
          router.reload();
      }
  }, [account.address, router]);


    useEffect(() => setStaked(session.isStaked), []);

    return {
        ...unstakeDetails,
        staked,
        stakeReq,
        allocationBonus,
        refreshSession,
    };
};
