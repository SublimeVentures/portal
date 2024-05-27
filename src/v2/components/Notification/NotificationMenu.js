import { Button } from "@/v2/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/v2/components/ui/dropdown-menu";

import { IconButton } from "@/v2/components/ui/icon-button";
import SingleNotification from "@/v2/components/Notification/SingleNotification";
import bellIcon from "@/v2/assets/svg/bell.svg";

import { layoutStyles } from "@/v2/components/Layout/AppLayout";

const NotificationMenu = ({ isBlockedAlert }) => {
  const notifications = mockedNotifications;
  const newCount = notifications.filter(notification => !notification.seen).length;

  return (
    <DropdownMenu>
        <DropdownMenuTrigger asChild>
            <IconButton icon={bellIcon} variant="transparent" shape="circle" className="outline-none" />
        </DropdownMenuTrigger>
        
        <DropdownMenuContent
          style={{ ...layoutStyles, "--alertHeight": isBlockedAlert ? layoutStyles["--alertHeight"] : "0px" }}
          className="rounded-b-lg w-screen h-[calc(100vh_-_var(--navbarHeight)_-_var(--headerHeight)_-_var(--alertHeight))] overflow-auto sm:max-w-[315px] sm:h-auto sm:rounded-b"
        >
            <div className="px-8 flex justify-between sm:flex-col">
                <DropdownMenuLabel>Notifications</DropdownMenuLabel>

                <div className="flex items-center">
                    <h3 className="mr-2 text-lg font-medium text-foreground">
                        New {" "}
                        <span className="font-light">({newCount})</span>
                    </h3>
                    <Button variant="link">Show All</Button>
                </div>
            </div>

            <DropdownMenuGroup>
                {mockedNotifications.map(item => (
                    <DropdownMenuItem key={item.id}>
                        <SingleNotification {...item} />
                    </DropdownMenuItem>
                ))}
            </DropdownMenuGroup>
        </DropdownMenuContent>
    </DropdownMenu>
  )
}

const mockedNotifications = [
  {
    date: "12.04.2024",
    avatar: "",
    content: "Limewire payout complete: $20,000.00",
    seen: false,
  },
  {
    date: "11.04.2024",
    avatar: "",
    content: "Based.VC 10 year anniversary!",
    seen: false,
  },
  {
    date: "29.03.2024",
    avatar: "",
    content: "Ethereum new ATH! $10K+",
    seen: true,
  },
  {
    date: "27.03.2024",
    avatar: "",
    content: "Amazon payout complete: $15,600.00",
    seen: true,
  },

]

export default NotificationMenu;

