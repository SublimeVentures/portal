import Image from "next/image";

import TimelineTransaction from "./TimelineTransaction";
import { useEnvironmentContext } from "@/lib/context/EnvironmentContext";
import { getFormattedDate } from "@/v2/lib/helpers";
import { cn } from "@/lib/cn";
import { getNotificationTitle, getDescriptionMessage } from "@/v2/helpers/notifications";
import TimelineSVG from "@/v2/assets/svg/timeline.svg";

export default function TimelineItem({ item, showTimeline = true, isRead = true, className }) {
    const { cdn } = useEnvironmentContext();

    return (
        <div className="flex text-sm">
            {showTimeline ? (
                <div
                    className={cn(
                        "mx-4 flex flex-col justify-between items-center gap-2 before:w-0 before:border-foreground/[.2] before:border before:h-full after:w-0 after:border after:border-foreground/[.2] after:h-full group-first:before:border-none group-last:after:border-none",
                    )}
                >
                    <div>
                        <TimelineSVG />
                    </div>
                </div>
            ) : null}

            <div
                className={cn(
                    "py-4 px-6 w-full flex flex-col gap-2 rounded",
                    isRead ? "bg-foreground/[0.03]" : " bg-foreground/10",
                    className,
                )}
            >
                <div className="flex justify-between items-center">
                    <div className="flex items-center gap-4">
                        {/* <Image
                            src={`${cdn}/research/1.jpg`}
                            className="rounded-full"
                            alt=""
                            width={55}
                            height={55}
                        /> */}

                        <div>
                            <div>
                                <h3 className="inline mr-1 text-md font-semibold text-foreground">
                                    {getNotificationTitle(item.typeId)}
                                </h3>
                                <p className="inline text-md font-light text-foreground/80">
                                    {getDescriptionMessage(item.typeId, item)}
                                </p>
                            </div>

                            {item.onchain?.txID ? <TimelineTransaction item={item} /> : null}
                            <dd className="text-md text-foreground/40">{getFormattedDate(item.createdAt)}</dd>
                        </div>
                    </div>

                    {!isRead ? <div className="w-1.5 h-1.5 bg-accent rounded-full shadow-accent" /> : null}
                </div>
            </div>
        </div>
    );
}
