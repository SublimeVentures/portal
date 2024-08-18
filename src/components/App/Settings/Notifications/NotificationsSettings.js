import { useEffect, useMemo, useState } from "react";
import PropTypes from "prop-types";
import { deleteToken, getToken } from "firebase/messaging";
import { useCookies } from "react-cookie";
import { ButtonTypes, UniButton } from "@/components/Button/UniButton";
import {
    fetchNotificationChannels,
    fetchNotificationPreferences,
    subscribeToPushCategory,
    unsubscribeFromPushCategory,
    updateNotificationPreferences,
} from "@/fetchers/notifications.fetcher";
import NotificationPreferenceRow from "@/components/App/Settings/Notifications/NotificationPreferenceRow";
import GenericModal from "@/components/Modal/GenericModal";
import { updateUser } from "@/fetchers/auth.fetcher";
import { tenantIndex } from "@/lib/utils";
import { useFirebase } from "@/lib/hooks/useFirebase";

/**
 * @typedef {{ [channelId: string]: boolean }} ChannelStatus
 */

/**
 * @typedef {{ [categoryId: string]: ChannelStatus }} NotificationPreferences
 */

/**
 * @typedef {{ channelId: string; categoryId: string; enabled: boolean; }[]} NotificationPreferenceUpdates
 */

export default function NotificationsSettings({ session, onNewSettings }) {
    const [successDialog, setSuccessDialog] = useState(false);
    const [errorDialog, setErrorDialog] = useState(false);
    const [disabledNotificationChannels, setDisabledNotificationChannels] = useState({});
    const [forceDisablePush, setForceDisablePush] = useState(false);
    const [preferenceMap, setPreferenceMap] = useState(/** @type NotificationPreferences */ {});
    const [cookies, setCookie, removeCookie] = useCookies();

    const [notificationOptions, setNotificationOptions] = useState({
        channels: [],
        categories: [],
    });

    const [form, setForm] = useState({
        email: session.email ?? "",
        phoneNumberE164: session.phoneNumberE164 ?? "",
    });

    const { fcm } = useFirebase();

    useEffect(() => {
        setDisabledNotificationChannels((prev) => {
            const updated = { ...prev };
            updated.email = !session.email;
            updated.sms = !session.phoneNumberE164;
            updated.push = forceDisablePush;
            return updated;
        });
        fetchNotificationChannels()
            .then((res) => {
                setNotificationOptions(res);
                return res;
            })
            .then((opts) => {
                return fetchNotificationPreferences().then((prefs) => ({
                    prefs,
                    opts,
                }));
            })
            .then(({ prefs, opts }) => {
                setPreferenceMap(prefs);
                return { opts };
            })
            .then(({ opts }) => {
                setPreferenceMap((prev) => {
                    const updated = { ...prev };
                    for (const categoryId of Object.keys(updated)) {
                        updated[categoryId]["push"] = !!cookies[`push_token_${categoryId}_${tenantIndex}`];
                    }
                    for (const category of opts.categories) {
                        if (!updated[category.id]) {
                            updated[category.id] = {};
                        }
                        updated[category.id]["push"] = !!cookies[`push_token_${category.id}_${tenantIndex}`];
                    }
                    return updated;
                });
            });
    }, [cookies, forceDisablePush, session.email, session.phoneNumberE164]);

    useEffect(() => {
        setForceDisablePush(Notification.permission === "denied");
    }, []);

    const handleChange = (ev) => {
        const { name, value } = ev.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (ev) => {
        ev.preventDefault();
        const prefEntries = Object.entries(preferenceMap);

        /**
         * @type {NotificationPreferenceUpdates}
         */
        const preferenceUpdates = prefEntries.reduce((acc, [categoryId, channels]) => {
            for (const [channelId, enabled] of Object.entries(channels)) {
                acc.push({ categoryId, channelId, enabled });
            }
            return acc;
        }, []);

        updateNotificationPreferences(preferenceUpdates)
            .then(() => updateUser(form))
            .then(() => {
                onNewSettings();
                setSuccessDialog(true);
            })
            .catch(() => {
                setErrorDialog(true);
            });
    };

    const requestNotificationPermission = async () => {
        if (Notification.permission !== "granted") {
            return Notification.requestPermission().then((perm) => perm === "granted");
        } else {
            return Notification.permission === "granted";
        }
    };

    const handlePushRequest = async () => {
        const isPushAllowed = await requestNotificationPermission();
        setForceDisablePush(!isPushAllowed);
        return isPushAllowed;
    };

    const handlePreferenceChange = (categoryId) => (channels) => {
        setPreferenceMap((prev) => {
            const updated = { ...prev };
            const prefEntries = Object.entries(channels);
            for (const [channelId, enabled] of prefEntries) {
                if (!updated[categoryId]) {
                    updated[categoryId] = {};
                }
                if (channelId === "push" && updated[categoryId]["push"] !== enabled) {
                    if (enabled) {
                        if (fcm) {
                            getToken(fcm, {
                                vapidKey: process.env.NEXT_PUBLIC_VAPID_KEY,
                            })
                                .then((token) => {
                                    subscribeToPushCategory(categoryId, token).then((res) => {
                                        if (res.ok) {
                                            setCookie(`push_token_${categoryId}_${tenantIndex}`, token);
                                        }
                                    });
                                })
                                .catch(console.error);
                        } else {
                            console.warn("Firebase Messaging is not initialized!");
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
                    }
                } else {
                    updated[categoryId][channelId] = enabled;
                }
            }
            return updated;
        });
    };

    return (
        <div className="bordered-container boxshadow relative offerWrap flex flex-1 max-w-[600px]">
            <form onSubmit={handleSubmit} className="relative bg-navy-accent flex flex-1 flex-col items-stretch">
                <div className="font-bold text-2xl flex items-center glowNormal p-5 ">
                    <div className="flex flex-1 font-bold">NOTIFICATIONS</div>
                </div>
                <div className="flex w-full flex-row ml-auto p-5 mt-auto">
                    <div className="block basis-full flex flex-col gap-5">
                        <div className="flex flex-col gap-1">
                            <label htmlFor="email">Email address for notifications</label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                value={form.email}
                                onChange={handleChange}
                                className="bg-app-bg autofill:bg-app-bg py-1 px-2 border-app-success rounded-md offerWrap"
                            />
                            {!session.email && (
                                <small className="text-app-error">Required to enable the email notifications</small>
                            )}
                        </div>
                        <div className="flex flex-col gap-1">
                            <label htmlFor="phone">Phone with country code</label>
                            <input
                                id="phone"
                                name="phoneNumberE164"
                                type="tel"
                                pattern="^\+[0-9]{0,15}$"
                                value={form.phoneNumberE164}
                                onChange={handleChange}
                                className="bg-app-bg autofill:bg-app-bg py-1 px-2 border-app-success rounded-md offerWrap"
                            />
                            {!session.phoneNumberE164 && (
                                <small className="text-app-error">Required to enable the SMS notifications</small>
                            )}
                        </div>
                    </div>
                </div>
                <div className="border-b border-b-navy-accent pb-4">
                    <table>
                        <thead className="card-table-header">
                            <tr>
                                <th className="font-bold text-sm text-left sm:py-4 sm:pl-5 sm:pr-2">
                                    <span>TYPE</span>
                                </th>
                                {notificationOptions.channels.map((channel) => (
                                    <th
                                        key={channel.id}
                                        className="font-bold text-sm text-left sm:text-center sm:py-4 sm:px-2"
                                    >
                                        <span className="uppercase">{channel.id}</span>
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {notificationOptions.categories.map((category) => (
                                <NotificationPreferenceRow
                                    onPushRequest={handlePushRequest}
                                    disabledKeys={disabledNotificationChannels}
                                    selection={preferenceMap[category.id] ?? {}}
                                    key={category.id}
                                    channels={notificationOptions.channels}
                                    category={category}
                                    onChange={handlePreferenceChange(category.id)}
                                />
                            ))}
                        </tbody>
                    </table>
                </div>
                <div className="mb-8 mx-auto">
                    <UniButton size="xs" isWide text="Update" type={ButtonTypes.BASE} />
                </div>
            </form>
            <GenericModal
                isOpen={successDialog}
                title={<span className="text-app-success">Success</span>}
                content="Your notification preferences and settings has been saved."
                closeModal={() => setSuccessDialog(false)}
            />
            <GenericModal
                isOpen={errorDialog}
                title={<span className="text-app-error">Error</span>}
                content="There was an error while saving the settings. Please try again later."
                closeModal={() => setErrorDialog(false)}
            />
        </div>
    );
}

NotificationsSettings.propTypes = {
    session: PropTypes.shape({
        email: PropTypes.string,
        phoneNumberE164: PropTypes.string,
    }).isRequired,
    onNewSettings: PropTypes.func.isRequired,
};
