import { useEffect, useState } from "react";
import { ButtonTypes, UniButton } from "@/components/Button/UniButton";
import { fetchNotificationChannels } from "@/fetchers/notifications.fetcher";
import NotificationPreferenceRow from "@/components/App/Settings/Notifications/NotificationPreferenceRow";

export default function NotificationsSettings() {
    const [notificationOptions, setNotificationOptions] = useState({
        channels: [],
        categories: [],
    });

    const [form, setForm] = useState({
        email: "",
        phone: "",
    });

    const [preferences, setPreferences] = useState({});

    useEffect(() => {
        fetchNotificationChannels().then(setNotificationOptions);
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
        const entries = Object.entries(preferences).filter(([_k, val]) => val);
        console.log(entries);
    };

    const handlePreferenceChange = (categoryId) => (channels) => {
        setPreferences((prev) => {
            for (const [key, val] of Object.entries(channels)) {
                prev[`${categoryId}_${key}`] = val;
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
                        <UniButton handler={void 0} size="xs" isWide text="Update" type={ButtonTypes.BASE} />
                    </form>
                </div>
            </div>
        </div>
    );
}
