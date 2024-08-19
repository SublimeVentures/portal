import moment from "moment";
import { useEnvironmentContext } from "@/lib/context/EnvironmentContext";

export default function useInvestmentsData(details) {
    const { cdn } = useEnvironmentContext();
    return {
        title: details?.offer?.name,
        coin: details?.offer?.ticker,
        invested: details.invested || 0,
        vested: details.claimed || 0,
        progress: details.vested || 0,
        logo: `${cdn}/research/${details?.offer?.slug}/icon.jpg`,
        isManaged: details?.offer?.isManaged,
        performance: details.performance * 100,
        participatedDate: moment(details.createdAt).utc().local().format("YYYY-MM-DD"),
        isClaimSoon: details.nextClaimDate !== null,
        canClaim: details.canClaim,
        ath: details.ath || 0,
        tgeGain: details.tge_gain || 0,
        nextPayout: details.nextPayout,
        currentPayout: details.currentPayout,
        offer: details.offer,
    };
}
