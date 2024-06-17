import React, { useReducer, useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from "next/router";
import { format } from "date-fns";

import { AppLayout } from "@/v2/components/Layout";
import { Button } from "@/v2/components/ui/button";
import { DatePicker } from "@/v2/components/ui/date-picker";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/v2/components/ui/select";
import TimelineItem from "@/v2/components/Timeline/TimelineItem";
import { processServerSideData } from "@/lib/serverSideHelpers";
import { NotificationTypeNames } from "@/v2/enum/notifications";
import routes from "@/routes";

const mockedNotification = {
    createdAt: "2024-01-17T04:14:22.429Z",
    data: { amount: 1, item: 1 },
    notificationType: { name: "OTC_MADE" },
    onchainId: 24473,
    offerId: 37,
    onchain: {
      blockConfirmed: "52417528",
      blockRegistered: "52417786",
      blockReverted: null,
      chainId: 137,
      createdAt: "2023-12-22T16:08:44.622Z",
      data: { amount: 1, item: 1 },
      from: "0x678DF4F67507e86B059BD7540521E7b55c55c7a",
      id: 24473,
      isConfirmed: true,
      isRegistered: false,
      isReverted: false,
      network: {
        chainId: 137,
        name: "Polygon",
        isDev: false,
        createdAt: "2023-05-24T16:54:04.169Z",
        updatedAt: "2023-05-24T16:54:04.850Z"
      },
      onchainType: { name: "OtcBuy" },
      tenant: 1,
      to: "0x60dc62Fa12e7df85e94b2a967f61ac0688EF",
      txID: "0xb061cf4cfda42e819c3d0891524b170e0e063f1fb10242ac99a181569a",
      typeId: 4,
      updatedAt: "2024-01-17T04:14:23.893Z",
      userId: null,
    },
    onchainId: 24473,
    tenantId: 1,
    typeId: 4,
    updatedAt: "2024-01-17T04:14:23.893Z",
    userId: 11302
}

const mockedNotificatiosnCount = 5;

const generateRandomItem = (idx) => ({ ...mockedNotification, id: idx });

const NotificationList = () => {
    const [items, setItems] = useState([]);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const observer = useRef();

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);

            try {
                await new Promise((resolve) => setTimeout(resolve, 2000));
                const newItems = Array.from({ length: 10 }, (_, index) => generateRandomItem((page - 1) * 10 + index));

                setItems(prevItems => [...prevItems, ...newItems]);
                setHasMore(newItems.length > 0);
            } catch (error) {
                console.error('error', error);
            } finally {
              setIsLoading(false);
            }
        };

        fetchData();
    }, [page]);

    const lastItemRef = useCallback(node => {
        if (observer.current) observer.current.disconnect();

        observer.current = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting && hasMore) {
                setPage(prevPage => prevPage + 1);
            }
        });

        if (node) observer.current.observe(node);
    }, [hasMore]);

    return (
        <div>
            {items.length > 0 ? (
                <ol>
                    {items.map((item, index) => {
                        if (items.length === index + 1) {
                            return (
                                <li ref={lastItemRef} key={item.id}>
                                    <TimelineItem item={item} last={true} />
                                </li>
                            )
                        } else {
                            return (
                                <li key={item.id}>
                                    <TimelineItem item={item} first={index === 0} last={false} />
                                </li>
                            )
                        }
                    })}
                </ol>
            ) : (
                <div className="h-32 w-full flex items-center justify-center">
                    <p className="text-foreground">No items available</p>
                </div>
            )}

            {!hasMore && items.length > 0 && (
                <div className="h-32 w-full flex items-center justify-center">
                    <p className="text-foreground">No more items to load</p>
                </div>
            )}

            {isLoading && (
                <div className="h-32 w-full flex items-center justify-center">
                    <p className="text-foreground">Loading...</p>
                </div>
            )}
        </div>
    )
};

export default function AppOtc() {
    const router = useRouter();
    const { query } = router;
    const { startDate = '', endDate = null, event = '' } = query;
    
    const handleInputChange = (name, value) => {
        router.push({
            pathname: router.pathname,
            query: { ...query, [name]: value },
        });
    };

    const handleApply = () => console.log('Filters:', filters);
    
    return (
        <div className="p-2 h-full md:p-16">
            <div className="mb-8 flex items-center gap-4">
                <div className="flex items-baseline text-foreground">
                    <h3 className="text-nowrap text-2xl">Notifications</h3>
                    <p className="ml-4 text-lg whitespace-nowrap">New ({mockedNotificatiosnCount})</p>
                </div>

                <div className="flex flex-col items-center gap-4 md:flex-row">
                    <DatePicker
                        className="w-full md:w-auto"
                        date={startDate}
                        setDate={(value) => handleInputChange("startDate", format(value, "yyyy-MM-dd"))}
                        toDate={endDate && new Date()}
                    />
                    <span className="hidden text-white md:block">-</span>
                    <DatePicker
                        className="w-full md:w-auto"
                        date={endDate}
                        setDate={(value) => handleInputChange("endDate", format(value, "yyyy-MM-dd"))}
                        fromDate={startDate ? new Date(startDate) : null}
                        toDate={new Date()}
                    />


                    <Select value={event} onValueChange={(value) => handleInputChange('event', value)}>
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Select event type" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem key={0} value={null}>All</SelectItem>
                            {Object.entries(NotificationTypeNames).map(([key, value]) => (
                                <SelectItem key={key} value={key}>{value}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <Button variant="accent" className="w-full md:w-auto" onClick={handleApply}>Apply filters</Button>
                </div>
            </div>

            <NotificationList />
        </div>
    );
};

export const getServerSideProps = async ({ req, res }) => {
    return await processServerSideData(req, res, routes.Notifications);
};

AppOtc.getLayout = function (page) {
    return <AppLayout title="Notifications">{page}</AppLayout>;
};
