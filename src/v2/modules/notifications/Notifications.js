import { useRef } from "react";
import Link from "next/link";
import PAGE from "@/routes";
import { useIntersectionObserver } from "@/v2/hooks";
import { Card, CardDescription, CardTitle } from "@/v2/components/ui/card";
import TimelineItem from "@/v2/components/Timeline/TimelineItem";
import TimelineSkeleton from "@/v2/components/Timeline/TimelineSkeleton";
import { Button } from "@/v2/components/ui/button";

export default function NotificationList({ data = [], isFetching, hasNextPage, fetchNextPage }) {
    const ref = useRef();

    useIntersectionObserver(ref, (isIntersecting) => {
        if (isIntersecting && !isFetching && hasNextPage) fetchNextPage();
    });

    return (
        <>
            {data.length > 0 || isFetching ? (
                <Card
                    variant="none"
                    className="flex flex-col h-full overflow-hidden bg-settings-gradient lg:mb-6 3xl:mb-12 p-0 cursor-auto"
                >
                    <div className="py-4 flex flex-col h-full overflow-y-auto pr-4">
                        <ol className="px-4 flex flex-col grow overflow-x-hidden py-2">
                            {data.map((notification, idx) => {
                                if (idx + 1 === data.length && hasNextPage) {
                                    return (
                                        <li ref={ref} key={notification.id} className="group">
                                            <TimelineItem item={notification} />
                                        </li>
                                    );
                                }

                                return (
                                    <li key={notification.id} className="group">
                                        <TimelineItem item={notification} />
                                    </li>
                                );
                            })}

                            {isFetching && <TimelineSkeleton />}
                        </ol>
                    </div>
                </Card>
            ) : (
                <Card
                    variant="none"
                    border="none"
                    className="relative h-dvh md:h-full w-full flex flex-col items-center justify-center gap-2 md:gap-4 grow bg-empty-investment-top-pattern bg-cover bg-center bg-no-repeat lg:mb-6 3xl:mb-12 cursor-auto select-none"
                >
                    <CardTitle className="text-sm md:text-base text-center font-normal">
                        No notifications found
                    </CardTitle>
                    <CardDescription className="max-w-2xl text-lg md:text-3xl font-semibold text-center">
                        Explore elite investment avenues curated for the astute investor
                    </CardDescription>
                    <div className="my-5 md:my-8 flex items-center gap-2.5 md:gap-4">
                        <Button className="w-full collap:w-auto" variant="outline" asChild>
                            <Link href={PAGE.OTC}>OTC Market</Link>
                        </Button>
                        <Button className="w-full collap:w-auto">
                            <Link href={PAGE.Opportunities}>Opportunities</Link>
                        </Button>
                    </div>
                </Card>
            )}
        </>
    );
}
