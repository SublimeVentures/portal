import React, { forwardRef } from "react";
import Image from "next/image";

import TimelineTransaction from "./TimelineTransaction";
import { getFormattedDate } from "@/v2/lib/helpers";
import { cn } from "@/lib/cn";
import { getNotificationTitle, getDescriptionMessage, getImageSrc } from "@/v2/helpers/notifications";
import TimelineSVG from "@/v2/assets/svg/timeline.svg";
import useImage from "@/v2/hooks/useImage";

const TimelineItem = forwardRef(({ item, showTimeline = true, isRead = true, className }, ref) => {
    const image = useImage();

    return (
        <div ref={ref} className={cn("flex text-sm", className)}>
            {showTimeline ? (
                <div
                    className={cn(
                        "mx-4 flex flex-col justify-between items-center gap-3 before:w-0 before:border-white/20 before:border before:h-[95%] after:w-0 after:border after:border-white/20 after:h-full group-first:before:border-none group-last:after:border-none",
                    )}
                >
                    <div>
                        <TimelineSVG />
                    </div>
                </div>
            ) : null}

            <div
                className={cn(
                    "my-2 py-2 px-6 w-full flex flex-col gap-2 rounded",
                    showTimeline ? (isRead ? "item" : "item-active") : null,
                    className,
                )}
            >
                <div className="flex justify-between items-center select-none">
                    <div className="flex items-center gap-4">
                        <Image
                            src={getImageSrc(item, image)}
                            className="rounded-full pointer-events-none"
                            alt=""
                            width={55}
                            height={55}
                        />

                        <div>
                            <div>
                                <h3 className="inline mr-1 text-md font-semibold text-white">
                                    {getNotificationTitle(item.typeId)}
                                </h3>
                                <p className="inline text-md font-light text-white/80">
                                    {getDescriptionMessage(item.typeId, item)}
                                </p>
                            </div>

                            {item.onchain?.txID ? <TimelineTransaction item={item} /> : null}
                            <dd className="text-md text-white/40">{getFormattedDate(item.createdAt)}</dd>
                        </div>
                    </div>

                    {!isRead ? <div className="w-1.5 h-1.5 bg-secondary rounded-full shadow-secondary" /> : null}
                </div>
            </div>
        </div>
    );
});

TimelineItem.displayName = "TimelineItem";

export default TimelineItem;
