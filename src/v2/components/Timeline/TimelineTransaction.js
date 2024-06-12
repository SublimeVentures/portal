import Link from "next/link";
import PropTypes from "prop-types";

import { mapChainIdToNameWithScanner } from "@/../server/services/mappers/blockchain.mapper";
import ArrowIcon from "@/v2/assets/svg/arrow.svg";
import { getRedirectMessage } from "@/v2/helpers/notifications";

export default function TimelineTransaction({ type, tx, chainId }) {
    const chainData = mapChainIdToNameWithScanner(chainId);
    const message = getRedirectMessage(type);

    if (!message) return null;

    return (
        <Link className="flex items-center text-xs text-foreground/[.5] cursor-pointer hover:underline" target="_blank" href={`${chainData.scannerUrl}/tx/${tx}`}>
            <span>{message}</span>
            <ArrowIcon className="ml-2" />
        </Link>
    );
}

TimelineTransaction.propTypes = {
    type: PropTypes.string,
    tx: PropTypes.string,
    chainId: PropTypes.number,
};
