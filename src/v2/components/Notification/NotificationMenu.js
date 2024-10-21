import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/v2/components/ui/dropdown-menu";
import { IconButton } from "@/v2/components/ui/icon-button";
import bellIcon from "@/v2/assets/svg/bell.svg";
import { layoutStyles } from "@/v2/components/Layout/AppLayout";
import { routes } from "@/v2/routes";
import { notificationKeys } from "@/v2/constants";
import { fetchNotificationList } from "@/fetchers/notifications.fetcher";
import TimelineItem from "@/v2/components/Timeline/TimelineItem";

// @TODO - Backend logic for new notifications
const NotificationMenu = ({ isBlockedAlert }) => {
    const { data } = useQuery({
        queryKey: [notificationKeys.lastNotifications],
        queryFn: () => fetchNotificationList({ limit: 8, offset: 0 }),
        refetchOnMount: false,
        refetchOnWindowFocus: false,
        cacheTime: 5 * 60 * 1000,
        staleTime: 1 * 30 * 1000,
    });

    const newCount = 0;

    const [open, setOpen] = useState(false);

    return (
        <DropdownMenu open={open} onOpenChange={(value) => setOpen(value)}>
            <DropdownMenuTrigger asChild>
                <IconButton
                    icon={bellIcon}
                    variant="transparent"
                    shape="circle"
                    className="p-3 outline-none"
                    aria-label="Notifications"
                />
            </DropdownMenuTrigger>

            <DropdownMenuContent
                style={{ ...layoutStyles, "--alertHeight": isBlockedAlert ? layoutStyles["--alertHeight"] : "0px" }}
                className="w-screen !z-50 h-[calc(100vh_-_var(--navbarHeight)_-_var(--headerHeight)_-_var(--alertHeight))] flex flex-col rounded-b-lg overflow-auto sm:rounded-b sm:mr-12 sm:max-w-96 sm:h-auto border-base pb-0 max-h-[var(--radix-dropdown-menu-content-available-height)]"
            >
                <div className="mb-4 px-8 flex items-baseline justify-between text-white text-base leading-none">
                    <div>
                        <h3 className="inline text-white text-xl leading-none">Notifications</h3>
                        {/* <p className="ml-2 inline">
                            New <span className="font-light">(2)</span>
                        </p> */}
                    </div>

                    <Link
                        href={routes.Notifications}
                        onClick={() => setOpen(false)}
                        className="text-secondary font-light leading-none hover:underline"
                    >
                        Show All
                    </Link>
                </div>

                {data?.rows?.length ? (
                    <DropdownMenuGroup className="overflow-y-auto overflow-x-hidden grow">
                        {data?.rows.map((notification) => (
                            <DropdownMenuItem key={notification.id}>
                                <TimelineItem className="bg-transparent" showTimeline={false} item={notification} />
                            </DropdownMenuItem>
                        ))}
                    </DropdownMenuGroup>
                ) : (
                    <div className="my-10">
                        <h3 className="text-white text-sm text-center mb-1.5">No new notifications</h3>
                        <p className="text-white/75 text-xs text-center">
                            Check{" "}
                            <Link
                                href={routes.Notifications}
                                className="text-secondary hover:underline"
                                onClick={() => setOpen(false)}
                            >
                                this page
                            </Link>{" "}
                            to view your full history.
                        </p>
                    </div>
                )}
            </DropdownMenuContent>
        </DropdownMenu>
    );
};

export default NotificationMenu;
