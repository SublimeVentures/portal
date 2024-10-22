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
import { fetchUser, updateUser } from "@/fetchers/auth.fetcher";
import { Accordion, AccordionItem } from "@/v2/components/ui/accordion";
import { useFirebase } from "@/lib/hooks/useFirebase";
import { tenantIndex } from "@/lib/utils";
import { Input } from "@/v2/components/ui/input";
import { IconButton } from "@/v2/components/ui/icon-button";
import ArrowRightIcon from "@/v2/assets/svg/arrow-right.svg";

export default function NotificationsSettings() {
    const [forceDisablePush, setForceDisablePush] = useState(false);
    const [cookies, setCookie, removeCookie] = useCookies();
    const [userForm, setUserForm] = useState({
        email: "",
        phoneNumberE164: "",
    });

    const { fcm } = useFirebase();

    const {
        data: { user: userData },
        status,
    } = useQuery({
        queryKey: ["fetchUser"],
        queryFn: fetchUser,
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
        initialData: {},
    });

    const handleInputChange = (ev) => {
        const { name, value } = ev.target;
        setUserForm((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    useEffect(() => {
        if (status === "success") {
            setUserForm({
                email: userData?.email ?? "",
                phoneNumberE164: userData?.phoneNumberE164 ?? "",
            });
        }
    }, [status, userData]);

    const onUpdate = (key) => () =>
        updateUser({
            [key]: userForm[key],
        });

    const requestNotificationPermission = async () => {
        if (Notification.permission !== "granted") {
            return Notification.requestPermission().then((perm) => perm === "granted");
        } else {
            return Notification.permission === "granted";
        }
    };

    const handlePushSubscribe = async (categoryId) => {
        const token = await getToken(fcm, {
            vapidKey: process.env.NEXT_PUBLIC_VAPID_KEY,
        });
        const subscription = await subscribeToPushCategory(categoryId, token);
        if (subscription.ok) {
            setCookie(`push_token_${categoryId}_${tenantIndex}`, token);
        }
        return subscription.ok;
    };

    const handlePushUnsubscribe = async (categoryId) => {
        const token = cookies[`push_token_${categoryId}_${tenantIndex}`];
        unsubscribeFromPushCategory(categoryId, token).then(() => {
            deleteToken(fcm).then((done) => {
                console.log("FCM token removal:", done);
            });
        });
        removeCookie(`push_token_${categoryId}_${tenantIndex}`);
        return true;
    };

    const handleBeforePushRequest = async (enabling, categoryId) => {
        try {
            const isPushAllowed = await requestNotificationPermission();
            if (!isPushAllowed) {
                setForceDisablePush(true);
            }
            if (fcm) {
                if (enabling && isPushAllowed) {
                    return handlePushSubscribe(categoryId);
                } else {
                    return handlePushUnsubscribe(categoryId);
                }
            } else {
                console.warn("Firebase Messaging is not initialized!");
                return false;
            }
        } catch (err) {
            console.error(err);
            return false;
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

    return (
        <Card
            variant="none"
            className="py-6 px-12 lg:py-3 lg:px-6 3xl:py-6 3xl:px-12 flex flex-col gap-8 lg:gap-4 3xl:gap-8 min-h-full w-full bg-base border-alt"
        >
            <div>
                <CardTitle className="text-base font-medium text-white 3xl:text-lg font-heading">
                    Notifications <span className="hidden md:inline">Settings</span>
                </CardTitle>
                <CardDescription className="hidden lg:block text-xs 3xl:text-sm font-light">
                    View and update your personal preference
                </CardDescription>
            </div>

            <div>
                <label htmlFor="user_email" className="text-app-white">
                    Email address
                </label>
                <div className="relative flex items-center justify-center">
                    <Input
                        id="user_email"
                        type="email"
                        name="email"
                        placeholder="Enter your email address"
                        className="w-full"
                        value={userForm.email}
                        onChange={handleInputChange}
                    />
                    <IconButton
                        variant="primary"
                        name="email_set"
                        icon={ArrowRightIcon}
                        className="p-0 absolute top-3 right-2 w-6 h-6"
                        onClick={onUpdate("email")}
                    />
                </div>
            </div>

            <div>
                <label htmlFor="user_phoneNumberE164" className="text-app-white">
                    Phone number with prefix
                </label>
                <div className="relative flex items-center justify-center">
                    <Input
                        id="user_phoneNumberE164"
                        type="text"
                        name="phoneNumberE164"
                        placeholder="Enter your phone number"
                        className="w-full"
                        pattern="/^\+[0-9]{3,15}$/"
                        value={userForm.phoneNumberE164 ?? userData?.phoneNumberE164}
                        onChange={handleInputChange}
                    />
                    <IconButton
                        variant="primary"
                        name="phone_set"
                        icon={ArrowRightIcon}
                        className="p-0 absolute top-3 right-2 w-6 h-6"
                        onClick={onUpdate("phoneNumberE164")}
                    />
                </div>
            </div>

            <Accordion type="single">
                {data?.categories.map((cat) => {
                    return (
                        <AccordionItem title={cat.name} key={cat.id} value={cat.id}>
                            <div className="flex flex-col gap-2">
                                <ConnectionField
                                    name="Push"
                                    id={`${cat.id}|${CONNECTION_TYPE.WEBPUSH}`}
                                    defaultChecked={preferences[cat.id]?.[CONNECTION_TYPE.WEBPUSH]}
                                    onBeforeUpdate={(enabled) => handleBeforePushRequest(enabled, cat.id)}
                                    onUpdate={refetchPreferences}
                                    disabled={forceDisablePush}
                                />
                                <ConnectionField
                                    disabled={!userData?.phoneNumberE164}
                                    name="SMS"
                                    id={`${cat.id}|${CONNECTION_TYPE.SMS}`}
                                    onUpdate={refetchPreferences}
                                    defaultChecked={preferences[cat.id]?.[CONNECTION_TYPE.SMS]}
                                />
                                <ConnectionField
                                    disabled={!userData?.email}
                                    name="Email"
                                    id={`${cat.id}|${CONNECTION_TYPE.EMAIL}`}
                                    defaultChecked={preferences[cat.id]?.[CONNECTION_TYPE.EMAIL]}
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
