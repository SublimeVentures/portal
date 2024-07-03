import PropTypes from "prop-types";

import TimelineTransaction from "./TimelineTransaction";
import TimelineItemDescription from "./TimelineItemDescription";
import TimelineSVG from "@/v2/assets/svg/timeline.svg";
import { getFormattedDate } from "@/v2/lib/helpers";
import { getNotificationTitle } from "@/v2/helpers/notifications";
import { cn } from "@/lib/cn";

export default function TimelineItem({ item, showTimeline = true }) {
    return (
        <div className="flex text-sm">
            {showTimeline ? (
                <div className={cn("mx-4 flex flex-col justify-between items-center gap-2 before:w-0 before:border-foreground/[.2] before:border before:h-full after:w-0 after:border after:border-foreground/[.2] after:h-full group-first:before:border-none group-last:after:border-none")}>
                    <div>
                        <TimelineSVG /> 
                    </div>
                </div>
            ) : null}

            <div className="my-2 py-4 px-8 w-full flex flex-col gap-2 bg-foreground/[.1] rounded">
                <dl className="flex justify-between items-center">
                    <dt className="text-md font-light text-foreground">{getNotificationTitle(item.typeId)}</dt>
                    {/* <dd className="text-lg font-medium text-foreground">{getFormattedDate(item.onchain.createdAt)}</dd> */}
                    <dd className="text-lg font-medium text-foreground">?</dd>
                </dl>

                <TimelineItemDescription type={item.typeId} />
                {item.onchain?.txID ? <TimelineTransaction type={item.typeId} tx={item.onchain.txID} chainId={item.onchain.chainId} /> : null}
            </div>
        </div>
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
                rpc: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
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
    showTimeline: PropTypes.bool,
};
