import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { BellIcon } from "@radix-ui/react-icons";
import { IconButton } from "@/components/ui/icon-button";
import SingleNotification from "@/components/V2/Layout/SingleNotification";

const NotificationMenu = () => {
  const notifications = mockedNotifications;
  const newCount = notifications.filter(notification => !notification.seen).length;

  return (
    <DropdownMenu>
        <DropdownMenuTrigger asChild>
            <IconButton icon={BellIcon} variant="transparent" shape="circle" />
        </DropdownMenuTrigger>
        
        <DropdownMenuContent className="w-[315px]">
            <div className="px-8">
                <DropdownMenuLabel>Notifications</DropdownMenuLabel>

                <div className="pb-4 flex items-center">
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
  {
    date: "25.03.2024",
    avatar: "",
    content: "NEW OPPURTUNITY! Blockgames live now.",
    seen: true,
  },
]

export default NotificationMenu;
