import PropTypes from "prop-types";
import { IoAlertCircleOutline } from "react-icons/io5";
import moment from "moment";
import { useState } from "react";
import { NotificationTypes } from "../../../../../server/enum/NotificationTypes";
import { cn } from "@/lib/cn";
import TimelineTransaction from "@/components/App/Vault/DetailsTimeline/TimelineTransaction";
import TimelineItemExtension from "@/components/App/Vault/DetailsTimeline/TimelineItemExtension";

export default function TimelineItem({ item, first = false, last = false }) {
    const [expanded, setExpanded] = useState(false);

    function toggleExpansion() {
        setExpanded((prev) => !prev);
    }

    /**
     * @param {import("server/enum/NotificationTypes").NotificationTypes[
     *     keyof import("server/enum/NotificationTypes").NotificationTypes
     * ]} type
     */
    function getNotificationTitle(type) {
        switch (type) {
            case NotificationTypes.INVESTMENT:
                return "INVESTMENT";
            case NotificationTypes.CLAIM:
                return "CLAIM";
            case NotificationTypes.REFUND:
                return "REFUND";
            case NotificationTypes.OTC_MADE:
                return "OTC MADE";
            case NotificationTypes.OTC_TAKE:
                return "OTC TAKEN";
            case NotificationTypes.OTC_CANCEL:
                return "OTC CANCELLED";
            case NotificationTypes.MYSTERY_BUY:
                return "PURCHASED MYSTERY BOX";
            case NotificationTypes.UPGRADE_BUY:
                return "PURCHASED UPGRADE";
        }
    }

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
                        <p className="font-bold">{getNotificationTitle(item.typeId)}</p>
                        <p className="italic text-gray">
                            {moment(item.onchain.createdAt).format("yyyy/MM/DD HH:mm:ss")}
                        </p>
                    </div>
                    {item.onchain?.txID && (
                        <div className="flex justify-stretch items-center gap-2 w-full">
                            <div>
                                <div className="text-gray">txID</div>
                                <div>
                                    <TimelineTransaction tx={item.onchain.txID} chainId={item.onchain.chainId} />
                                </div>
                            </div>
                        </div>
                    )}
                    {expanded && (
                        <div
                            className={cn(
                                {
                                    "hidden h-0": !expanded,
                                    "flex h-auto": expanded,
                                },
                                "justify-stretch items-stretch w-full",
                            )}
                        >
                            <TimelineItemExtension id={expanded ? item.id : null} />
                        </div>
                    )}
                    <div>
                        <hr className="text-gray my-1" />
                        <button onClick={toggleExpansion} className="hover:font-bold">
                            {expanded ? "See less" : "See more"}
                        </button>
                    </div>
                </div>
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
};
