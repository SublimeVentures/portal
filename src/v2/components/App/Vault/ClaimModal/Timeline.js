import { useRef } from "react";
import Title from "./Title";
import { SheetBody } from "@/v2/components/ui/sheet";
import { useNotificationInfiniteQuery } from "@/v2/modules/notifications/logic/useNotificationInfiniteLoader";
import TimelineItem from "@/v2/components/Timeline/TimelineItem";
import TimelineSkeleton from "@/v2/components/Timeline/TimelineSkeleton";
import { useIntersectionObserver } from "@/v2/hooks";

export default function Timeline({ data }) {
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
                <Title text="Timeline"></Title>
            </div>
            <div className="md:flex md:flex-col gap-3 md:gap-4">
                {(notifications?.pages || []).map((notification = [], index, array) => {
                    const lastItem = index === array.length - 1;
                    return (
                        <TimelineItem ref={lastItem ? lastItemRef : null} key={notification.id} item={notification} />
                    );
                })}
                {isFetching && <TimelineSkeleton />}
            </div>
        </SheetBody>
    );
}
