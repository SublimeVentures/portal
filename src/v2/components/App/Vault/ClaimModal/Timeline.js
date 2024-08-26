import { useRef } from "react";
import Title from "./Title";
import { SheetBody } from "@/v2/components/ui/sheet";
import { useNotificationInfiniteQuery } from "@/v2/modules/notifications/logic/useNotificationInfiniteLoader";
import TimelineItem from "@/v2/components/Timeline/TimelineItem";
import TimelineSkeleton from "@/v2/components/Timeline/TimelineSkeleton";
import { Button } from "@/v2/components/ui/button";
import ArrowIcon from "@/v2/assets/svg/arrow.svg";
import { useIntersectionObserver } from "@/v2/hooks";

export default function Timeline({ data, onCloseClick }) {
    const { offerId } = data;
    const {
        data: notifications = [],
        hasNextPage,
        isFetching,
        fetchNextPage,
    } = useNotificationInfiniteQuery({ offerId });
    const lastItemRef = useRef();
    useIntersectionObserver(lastItemRef, (isIntersecting) => {
        if (isIntersecting && !isFetching && hasNextPage) {
            fetchNextPage();
        }
    });
    return (
        <SheetBody className="overflow-x-auto md:flex md:flex-col px-4 md:py-4 md:px-30 py-3 gap-3 md:gap-4">
            <div className="flex items-center justify-between">
                <Title text="Timeline">
                    <Button
                        variant="link"
                        className="leading-1 text-xs md:text-sm py-0 px-8 md:px-0 ml-auto"
                        onClick={onCloseClick}
                    >
                        Back <ArrowIcon className="size-2.5 ml-2" />
                    </Button>
                </Title>
            </div>
            <div className="md:flex md:flex-col gap-3 md:gap-4">
                {(notifications?.pages || []).map((notification = [], index, array) => {
                    const lastItem = index === array.length - 1;
                    return (
                        <TimelineItem
                            ref={lastItem ? lastItemRef : null}
                            key={notification.id}
                            item={notification}
                            className="-ml-13"
                        />
                    );
                })}
                {isFetching && <TimelineSkeleton />}
            </div>
        </SheetBody>
    );
}
