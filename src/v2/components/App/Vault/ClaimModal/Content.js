import Image from "next/image";
import { useState, forwardRef } from "react";
import Timeline from "./Timeline";
import Details from "./Details";
import { SheetDescription, SheetHeader, SheetTitle } from "@/v2/components/ui/sheet";
import { cn } from "@/lib/cn";
import { useNotificationInfiniteQuery } from "@/v2/modules/notifications/logic/useNotificationInfiniteLoader";
import { IconButton } from "@/v2/components/ui/icon-button";
import ArrowIcon from "@/v2/assets/svg/arrow.svg";
import ScheduleIcon from "@/v2/assets/svg/schedule.svg";

const ArrowLeftIcon = forwardRef(({ className, ...props }, ref) => (
    <ArrowIcon ref={ref} className={cn("transform rotate-[225deg] p-1.5", className)} {...props} />
));
ArrowLeftIcon.displayName = "ArrowLeftIcon";

export default function Content({ data, openReassignModal }) {
    const { title, coin, logo, offerId } = data;
    const [timeline, setTimeline] = useState(false);
    const { data: notifications } = useNotificationInfiniteQuery({ limit: 1, offerId });
    const hasNotifications = notifications?.pages?.flat().length > 0;
    const handleToggleTimeline = () => setTimeline(!timeline);
    const handleCloseTimeline = () => setTimeline(false);
    const handleOpenTimeline = () => setTimeline(true);
    return (
        <>
            <SheetHeader className="relative">
                <Image
                    src={logo}
                    className="size-20 md:size-30 rounded-full mb-2"
                    alt={title}
                    width={100}
                    height={100}
                />
                <SheetTitle>{title}</SheetTitle>
                <SheetDescription>{coin}</SheetDescription>
                {hasNotifications && (
                    <IconButton
                        name="Timeline"
                        variant="primary"
                        shape="circle"
                        className="absolute top-50 right-6 block md:hidden p-2"
                        icon={!timeline ? ScheduleIcon : ArrowLeftIcon}
                        onClick={handleToggleTimeline}
                    />
                )}
            </SheetHeader>
            {timeline && hasNotifications ? (
                <Timeline data={data} onCloseClick={handleCloseTimeline} />
            ) : (
                <Details
                    data={data}
                    onClick={handleOpenTimeline}
                    items={notifications}
                    openReassignModal={openReassignModal}
                />
            )}
        </>
    );
}
