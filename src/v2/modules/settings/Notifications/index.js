import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { deleteToken, getToken } from "firebase/messaging";
import { useCookies } from "react-cookie";
import { CONNECTION_TYPE } from "./helpers";
import ConnectionField from "./ConnectionField";
import { Card, CardDescription, CardTitle } from "@/v2/components/ui/card";
import {
    fetchNotificationChannelsWithCategories,
    fetchNotificationPreferences,
    subscribeToPushCategory,
    unsubscribeFromPushCategory,
} from "@/fetchers/notifications.fetcher";
import { fetchUser } from "@/fetchers/auth.fetcher";
import { Accordion, AccordionItem } from "@/v2/components/ui/accordion";
import { useFirebase } from "@/lib/hooks/useFirebase";
import { tenantIndex } from "@/lib/utils";

export default function NotificationsSettings() {
    const [currentTab, setCurrentTab] = useState(/** @type {string} */ null);
    const [forceDisablePush, setForceDisablePush] = useState(false);
    const [cookies, setCookie, removeCookie] = useCookies();

    const { fcm } = useFirebase();

    const {
        data: { user: userData },
    } = useQuery({
        queryKey: ["fetchUser"],
        queryFn: fetchUser,
        gcTime: 60_000,
        staleTime: 60_000,
        initialData: {
            user: {
                phoneNumberE164: "",
                email: "",
            },
        },
    });

    const { data: preferences, refetch: refetchPreferences } = useQuery({
        queryFn: fetchNotificationPreferences,
        queryKey: ["preferences"],
        gcTime: 30_000,
        staleTime: 30_000,
    });

    const requestNotificationPermission = async () => {
        if (Notification.permission !== "granted") {
            return Notification.requestPermission().then((perm) => perm === "granted");
        } else {
            return Notification.permission === "granted";
        }
    };

    const handleBeforePushRequest = async (enabling, categoryId) => {
        const isPushAllowed = await requestNotificationPermission();
        if (enabling && isPushAllowed) {
            if (fcm) {
                return getToken(fcm, {
                    vapidKey: process.env.NEXT_PUBLIC_VAPID_KEY,
                })
                    .then((token) => {
                        return subscribeToPushCategory(categoryId, token)
                            .then((res) => {
                                if (res.ok) {
                                    setCookie(`push_token_${categoryId}_${tenantIndex}`, token);
                                }
                                return res.ok;
                            })
                            .catch((err) => {
                                console.error(err);
                                return false;
                            });
                    })
                    .then((ok) => ok)
                    .catch((err) => {
                        console.error(err);
                        return false;
                    });
            } else {
                console.warn("Firebase Messaging is not initialized!");
                return false;
            }
        } else {
            if (fcm) {
                const token = cookies[`push_token_${categoryId}_${tenantIndex}`];
                unsubscribeFromPushCategory(categoryId, token).then(() => {
                    deleteToken(fcm).then((done) => {
                        console.log("FCM token removal:", done);
                    });
                });
            } else {
                console.warn("Firebase Messaging is not initialized!");
            }
            removeCookie(`push_token_${categoryId}_${tenantIndex}`);
            return true;
        }
    };

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
                {data?.categories.map((cat, _, arr) => {
                    return (
                        <AccordionItem title={cat.name} key={cat.id} value={cat.id}>
                            <div className="flex flex-col gap-8 sm:gap-2 3xl:gap-4">
                                <ConnectionField
                                    name="Push"
                                    id={`${cat.id}|${CONNECTION_TYPE.WEBPUSH}`}
                                    defaultChecked={preferences[cat.id]?.[CONNECTION_TYPE.WEBPUSH]}
                                    onBeforeUpdate={(enabled) => handleBeforePushRequest(enabled, cat.id)}
                                    onUpdate={refetchPreferences}
                                    disabled={forceDisablePush}
                                />
                                {/*<ConnectionField
                                isConnected
                                name="Discord"
                                id={CONNECTION_TYPE.DISCORD}
                                placeholder="Fill in discord username"
                            />*/}
                                <ConnectionField
                                    name="SMS"
                                    fieldKey="phoneNumberE164"
                                    fieldValue={userData.phoneNumberE164}
                                    id={`${cat.id}|${CONNECTION_TYPE.SMS}`}
                                    placeholder="Fill in phone number"
                                    onUpdate={refetchPreferences}
                                />
                                <ConnectionField
                                    name="Email"
                                    fieldKey="email"
                                    fieldValue={userData.email}
                                    id={`${cat.id}|${CONNECTION_TYPE.EMAIL}`}
                                    placeholder="Fill in email address"
                                    onUpdate={refetchPreferences}
                                />
                            </div>
                        </AccordionItem>
                    );
                })}
            </Accordion>
        </Card>
    );
}
