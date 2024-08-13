import { useEffect, useState } from "react";
import { ButtonTypes, UniButton } from "@/components/Button/UniButton";
import {
    fetchNotificationChannels,
    fetchNotificationPreferences,
    updateNotificationPreferences,
} from "@/fetchers/notifications.fetcher";
import NotificationPreferenceRow from "@/components/App/Settings/Notifications/NotificationPreferenceRow";

/**
 * @typedef {{ [channelId]: boolean }} ChannelStatus
 */

/**
 * @typedef {{ [categoryId]: ChannelStatus }} NotificationPreferences
 */

/**
 * @typedef {{ channelId: string; categoryId: string; enabled: boolean; }[]} NotificationPreferenceUpdates
 */

export default function NotificationsSettings({ userData }) {
    const [submitState, setSubmitState] = useState("idle");
    const [disabledNotificationChannels, setDisabledNotificationChannels] = useState([]);
    const [notificationOptions, setNotificationOptions] = useState({
        channels: [],
        categories: [],
    });

    const [form, setForm] = useState({
        email: userData.email ?? "",
        phone: userData.phoneNumberE164 ?? "",
    });

    const [preferenceMap, setPreferenceMap] = useState(/** @type NotificationPreferences */ {});

    useEffect(() => {
        if (!form.email) {
            setDisabledNotificationChannels((prev) => {
                if (!prev.includes("email")) {
                    prev.push("email");
                }
                return prev;
            });
        }
        if (!form.phone) {
            setDisabledNotificationChannels((prev) => {
                if (!prev.includes("sms")) {
                    prev.push("sms");
                }
                return prev;
            });
        }
        fetchNotificationChannels().then(setNotificationOptions);
        fetchNotificationPreferences().then(setPreferenceMap);
    }, []);

    const handleChange = (ev) => {
        const { checked, name, value, type } = ev.target;
        if (type === "checkbox") {
            setForm((prev) => ({ ...prev, [name]: checked }));
        } else {
            setForm((prev) => ({ ...prev, [name]: value }));
        }
    };

    const handleSubmit = (ev) => {
        ev.preventDefault();
        setSubmitState("pending");
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
            .then(() => {
                setSubmitState("fulfilled");
            })
            .catch((_err) => {
                setSubmitState("rejected");
            })
            .finally(() => {
                setTimeout(() => {
                    setSubmitState("idle");
                }, 1500);
            });
    };

    const handlePreferenceChange = (categoryId) => (channels) => {
        setPreferenceMap((prev) => {
            const prefEntries = Object.entries(channels);
            for (const [channelId, enabled] of prefEntries) {
                if (!prev[categoryId]) {
                    prev[categoryId] = {};
                }
                prev[categoryId][channelId] = enabled;
            }
            return prev;
        });
    };

    return (
        <div className="bordered-container boxshadow relative offerWrap flex flex-1 max-w-[600px]">
            <div className="relative bg-navy-accent flex flex-1 flex-col items-stretch">
                <div className="font-bold text-2xl flex items-center glowNormal p-5 ">
                    <div className="flex flex-1 font-bold">NOTIFICATIONS</div>
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
                <div className="flex w-full flex-row ml-auto p-5 mt-auto">
                    <form onSubmit={handleSubmit} className="block basis-full flex flex-col gap-5">
                        <h3 className="font-bold uppercase text-xl">Settings</h3>
                        <div className="flex flex-col gap-1">
                            <label htmlFor="email">Email address for notifications</label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                value={form.email}
                                onChange={handleChange}
                                className="bg-app-bg py-1 px-2 border-app-success rounded-md"
                            />
                        </div>
                        <div className="flex flex-col gap-1">
                            <label htmlFor="phone">Phone with country code</label>
                            <input
                                id="phone"
                                name="phone"
                                type="tel"
                                pattern="^\+[0-9]{0,15}$"
                                value={form.phone}
                                onChange={handleChange}
                                className="bg-app-bg py-1 px-2 border-app-success rounded-md"
                            />
                        </div>
                        <UniButton
                            size="xs"
                            isWide
                            text="Update"
                            type={ButtonTypes.BASE}
                            isLoading={submitState === "pending"}
                        />
                    </form>
                </div>
            </div>
        </div>
    );
}
