import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { CONNECTION_TYPE } from "./helpers";
import ConnectionField from "./ConnectionField";
import { Card, CardDescription, CardTitle } from "@/v2/components/ui/card";
import {
    fetchNotificationChannelsWithCategories,
    fetchNotificationPreferences,
} from "@/fetchers/notifications.fetcher";
import { fetchUser } from "@/fetchers/auth.fetcher";
import { Accordion, AccordionItem } from "@/v2/components/ui/accordion";

export default function NotificationsSettings() {
    const [currentTab, setCurrentTab] = useState(/** @type {string} */ null);

    const { data: userData } = useQuery({
        queryKey: ["fetchUser"],
        queryFn: fetchUser,
        gcTime: 60_000,
        staleTime: 60_000,
    });

    const { data: preferences } = useQuery({
        queryFn: fetchNotificationPreferences,
        queryKey: ["preferences"],
        gcTime: 30_000,
        staleTime: 30_000,
    });

    const { data } = useQuery({
        queryKey: ["notifChannelsWithCategories"],
        queryFn: fetchNotificationChannelsWithCategories,
        gcTime: 120_000,
        staleTime: 60_000,
        placeholderData: {
            channels: [],
            categories: [],
        },
    });

    useEffect(() => {
        console.log("PREFS", preferences);
    }, [preferences]);

    return (
        <Card
            variant="none"
            className="py-6 px-12 lg:py-3 lg:px-6 3xl:py-6 3xl:px-12 flex flex-col gap-8 lg:gap-4 3xl:gap-8 h-full w-full bg-settings-gradient"
        >
            <div>
                <CardTitle className="text-base font-medium text-white 3xl:text-lg">
                    Notifications <span className="hidden md:inline">Settings</span>
                </CardTitle>
                <CardDescription className="hidden lg:block text-xs 3xl:text-sm font-light">
                    View and update your personal preference
                </CardDescription>
            </div>

            <Accordion type="single" onValueChange={setCurrentTab}>
                {data?.categories.map((cat, _, arr) => (
                    <AccordionItem title={cat.name} key={cat.id} value={cat.id}>
                        <div className="flex flex-col gap-8 sm:gap-2 3xl:gap-4">
                            <ConnectionField
                                isConnected
                                name="Webpush"
                                id={CONNECTION_TYPE.WEBPUSH}
                                placeholder="Fill in username"
                            />
                            <ConnectionField
                                isConnected
                                name="Discord"
                                id={CONNECTION_TYPE.DISCORD}
                                placeholder="Fill in discord username"
                            />
                            <ConnectionField name="SMS" id={CONNECTION_TYPE.SMS} placeholder="Fill in phone number" />
                            <ConnectionField
                                name="Email"
                                id={CONNECTION_TYPE.EMAIL}
                                placeholder="Fill in email address"
                            />
                        </div>
                    </AccordionItem>
                ))}
            </Accordion>
        </Card>
    );
}
