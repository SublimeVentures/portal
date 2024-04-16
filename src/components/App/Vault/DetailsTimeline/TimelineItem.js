import PropTypes from "prop-types";
import { IoAlertCircleOutline } from "react-icons/io5";
import moment from "moment";
import Link from "next/link";
import { cn } from "@/lib/cn";
import InlineCopyButton from "@/components/Button/InlineCopyButton";

export default function TimelineItem({ item, first = false, last = false }) {
    return (
        <div className="flex text-sm">
            <div className="flex flex-col justify-between items-center gap-2">
                <div className={cn("w-0 h-full min-h-2", { "border border-white": !first })}></div>
                <div>
                    <IoAlertCircleOutline className="text-2xl" />
                </div>
                <div className={cn("w-0 h-full min-h-2", { "border border-white": !last })}></div>
            </div>
            <div className="flex-1 p-2">
                <div className="w-full h-full rounded-md p-2 bg-white bg-opacity-10">
                    <div className="flex justify-between">
                        <p className="font-bold">{item.notificationType.name}</p>
                        <p className="italic text-gray">
                            {moment(item.onchain.createdAt).format("yyyy/MM/DD HH:mm:ss")}
                        </p>
                    </div>
                    <div className="flex justify-start items-center gap-2">
                        <div>
                            <div className="text-gray">txID</div>
                            <div>
                                <Transaction transaction={item.onchain.txID} />
                            </div>
                        </div>
                        <div>
                            <div className="text-gray">TX Info</div>
                            <div>
                                <Link
                                    href={`https://api.tenderly.co/api/v1/public-contract/${item.onchain.chainId}/tx/${item.onchain.txID}`}
                                >
                                    click
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function Transaction({ transaction }) {
    const shortened = `${transaction.slice(0, 5)}...${transaction.slice(-4)}`;
    return (
        <p className="flex gap-2 items-center">
            <Link className="hover:underline font-mono" target="_blank" href={`https://etherscan.io/tx/${transaction}`}>
                {shortened}
            </Link>
            <InlineCopyButton copiable={transaction} />
        </p>
    );
}

TimelineItem.propTypes = {
    item: PropTypes.shape({
        id: PropTypes.number,
        userId: PropTypes.number,
        typeId: PropTypes.number,
        onchainId: PropTypes.number,
        offerId: PropTypes.number,
        tenantId: PropTypes.number,
        data: PropTypes.shape({
            amount: PropTypes.number,
        }),
        createdAt: PropTypes.string,
        updatedAt: PropTypes.string,
        notificationType: PropTypes.shape({
            name: PropTypes.string,
        }),
        onchain: PropTypes.shape({
            id: PropTypes.number,
            txID: PropTypes.string,
            from: PropTypes.string,
            to: PropTypes.string,
            typeId: PropTypes.number,
            chainId: PropTypes.number,
            tenant: PropTypes.number,
            userId: PropTypes.number,
            data: PropTypes.shape({
                amount: PropTypes.number,
                offerId: PropTypes.number,
                hash: PropTypes.string,
                rpc: PropTypes.number,
            }),
            isConfirmed: PropTypes.bool,
            isReverted: PropTypes.bool,
            isRegistered: PropTypes.bool,
            blockRegistered: PropTypes.string,
            blockConfirmed: PropTypes.string,
            blockReverted: PropTypes.string,
            createdAt: PropTypes.string,
            updatedAt: PropTypes.string,
            onchainType: PropTypes.shape({
                name: PropTypes.string,
            }),
        }),
    }),
    first: PropTypes.bool,
    last: PropTypes.bool,
};
