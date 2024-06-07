import Link from "next/link";
import PropTypes from "prop-types";
import { mapChainIdToNameWithScanner } from "../../../../../server/services/mappers/blockchain.mapper";
import InlineCopyButton from "@/components/Button/InlineCopyButton";

export default function TimelineTransaction({ tx, chainId }) {
    const shortened = `${tx.slice(0, 5)}...${tx.slice(-4)}`;
    const chainData = mapChainIdToNameWithScanner(chainId);
    return (
        <p className="flex gap-2 items-center">
            <Link className="hover:underline font-mono" target="_blank" href={`${chainData.scannerUrl}/tx/${tx}`}>
                {shortened} ({chainData.scannerName})
            </Link>
            <InlineCopyButton copiable={tx} />
        </p>
    );
}

TimelineTransaction.propTypes = {
    tx: PropTypes.string,
    chainId: PropTypes.number,
};
