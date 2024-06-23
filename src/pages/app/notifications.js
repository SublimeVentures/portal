import React, { useReducer, useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from "next/router";
import { keepPreviousData, dehydrate, useQuery, useInfiniteQuery } from "@tanstack/react-query";
import { format } from "date-fns";

import { fetchNotificationList } from "@/fetchers/notifications.fetcher";
import { queryClient } from "@/lib/queryCache";
import { AppLayout } from "@/v2/components/Layout";
import { Button } from "@/v2/components/ui/button";
import { DatePicker } from "@/v2/components/ui/date-picker";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/v2/components/ui/select";
import TimelineItem from "@/v2/components/Timeline/TimelineItem";
import { processServerSideData } from "@/lib/serverSideHelpers";
import { NotificationTypeNames } from "@/v2/enum/notifications";
import routes from "@/routes";

const mergeNestedArr = (arr) => arr.reduce((acc, curr) => acc.concat(curr), []);

const NotificationList = ({ data, isFetching }) => {
    return (
        <>
            <ol>
                {data.map(notification => (
                    <li key={notification.id} className="group">
                        <TimelineItem item={notification} />
                    </li>
                ))}
            </ol>
            
            <div>{isFetching ? 'Loading older...' : null}</div>
        </>
    )
};

export default function AppNotifications() {
    const router = useRouter();
    const { query } = router;
    const { startDate = '', endDate = null, type = '' } = query;

    const { data, error, hasNextPage, isFetching, isFetchingNextPage, status, fetchNextPage } = useInfiniteQuery({
        queryKey: ['notificationList', startDate, endDate, type],
        queryFn: ({ pageParam }) => fetchNotificationList({ page: pageParam, startDate, endDate, type }),
        initialPageParam: 0,
        getNextPageParam: (lastPage, _allPages, lastPageParam) => {
            if (lastPage.length === 0) {
              return undefined
            }

            return lastPageParam + 1
          },
          getPreviousPageParam: (_firstPage, _allPages, firstPageParam) => {
            if (firstPageParam <= 1) {
              return undefined
            }

            return firstPageParam - 1
          },
    })

    const handleInputChange = (name, value) => {
        router.push({
            pathname: router.pathname,
            query: { ...query, [name]: value },
        });
    };

    const handleApply = () => console.log('Filters:', filters);

    if (status === "pending") {
        return <div>Loading...</div>
    }

    if (status === "error") {
        return <div>{error}</div>
    }

    return (
        <div className="p-2 h-full md:p-16">
            <div className="mb-8 flex items-center gap-4">
                <div className="flex items-baseline text-foreground">
                    <h3 className="text-nowrap text-2xl">Notifications</h3>
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
    
                    <Select value={type} onValueChange={(value) => handleInputChange('type', value)}>
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
                </div>
            </div>
            
            <NotificationList
                data={mergeNestedArr(data.pages)}
                onEndReached={() => !isFetching && fetchNextPage()}
                isFetching={isFetching && !isFetchingNextPage}
            />
        </div>
    )
}

export const getServerSideProps = async ({ req, res }) => {
    return await processServerSideData(req, res, routes.Notifications);
};


AppNotifications.getLayout = function (page) {
    return <AppLayout title="Notifications">{page}</AppLayout>;
};
