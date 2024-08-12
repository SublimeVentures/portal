import { useRef } from "react";

import { useIntersectionObserver } from "@/v2/hooks";
import { Card } from "@/v2/components/ui/card";
import TimelineItem from "@/v2/components/Timeline/TimelineItem";
import TimelineSkeleton from "@/v2/components/Timeline/TimelineSkeleton";

export default function NotificationList({ data = [], isFetching, hasNextPage, fetchNextPage }) {
    const ref = useRef();

    useIntersectionObserver(ref, (isIntersecting) => {
        if (isIntersecting && !isFetching && hasNextPage) fetchNextPage();
    });

    return (
        <Card variant="none" className="px-4 flex flex-col h-full overflow-hidden bg-settings-gradient">
            <div className="py-4 flex flex-col h-full block-scrollbar overflow-y-auto">
                <ol className="flex flex-col grow gap-4 overflow-y-auto block-scrollbar overflow-x-hidden">
                    {data.map((notification, idx) => {
                        if (idx + 1 === data.length && hasNextPage) {
                            return (
                                <li ref={ref} key={notification.id} className="group">
                                    <TimelineItem item={notification} />
                                </li>
                            )
                        }
                        
                        return (
                            <li key={notification.id} className="group">
                                <TimelineItem item={notification} />
                            </li>
                        )
                    })}

                    {isFetching && <TimelineSkeleton />}
                </ol>
            </div>
        </Card>
    );
};
