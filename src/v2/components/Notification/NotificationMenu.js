import Link from "next/link";
import { useQuery } from "@tanstack/react-query";

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

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <IconButton icon={bellIcon} variant="transparent" shape="circle" className="p-3 outline-none" />
            </DropdownMenuTrigger>

            <DropdownMenuContent
                style={{ ...layoutStyles, "--alertHeight": isBlockedAlert ? layoutStyles["--alertHeight"] : "0px" }}
                className="w-screen h-[calc(100vh_-_var(--navbarHeight)_-_var(--headerHeight)_-_var(--alertHeight))] rounded-b-lg overflow-auto sm:rounded-b sm:mr-12 sm:max-w-96 sm:h-auto"
            >
                <div className="mb-4 px-8 flex items-baseline justify-between text-foreground text-base leading-none">
                    <div>
                        <h3 className="inline text-foreground text-xl leading-none">Notifications</h3>
                        <p className="ml-2 inline">
                            New <span className="font-light">(2)</span>
                        </p>
                    </div>

                    <Link href={routes.Notifications} className="text-accent font-light leading-none hover:underline">
                        Show all
                    </Link>
                </div>

                <DropdownMenuGroup>
                    {data?.rows.length
                        ? data?.rows.map((notification) => (
                              <DropdownMenuItem key={notification.id}>
                                  <TimelineItem
                                      className="px-8 bg-transparent"
                                      showTimeline={false}
                                      item={notification}
                                  />
                              </DropdownMenuItem>
                          ))
                        : null}
                </DropdownMenuGroup>
            </DropdownMenuContent>
        </DropdownMenu>
    );
};

export default NotificationMenu;
