import { useState } from "react";
import { ButtonTypes, UniButton } from "@/components/Button/UniButton";

export default function NotificationsSettings() {
    const [form, setForm] = useState({
        email: "",
        phone: "",
    });

    const handleChange = (ev) => {
        setForm((prev) => ({ ...prev, [ev.target.name]: ev.target.value }));
    };

    return (
        <div className="bordered-container boxshadow relative offerWrap flex flex-1 max-w-[600px]">
            <div className="relative bg-navy-accent flex flex-1 flex-col items-stretch">
                <div className="font-bold text-2xl flex items-center glowNormal p-5 ">
                    <div className="flex flex-1 font-bold">NOTIFICATIONS</div>
                </div>
                <div>
                    <table>
                        <thead className="card-table-header">
                            <tr>
                                <th className="font-bold text-sm text-left sm:py-4 sm:pl-5 sm:pr-2">
                                    <span>TYPE</span>
                                </th>
                                <th className="font-bold text-sm text-left sm:text-center sm:py-4 sm:px-2">
                                    <span>PUSH</span>
                                </th>
                                <th className="font-bold text-sm text-left sm:text-center sm:py-4 sm:px-2">
                                    <span>SMS</span>
                                </th>
                                <th className="font-bold text-sm text-left sm:text-center sm:py-4 sm:px-2">
                                    <span>EMAIL</span>
                                </th>
                            </tr>
                        </thead>
                        <tbody></tbody>
                    </table>
                </div>
                <div className="flex w-full flex-row ml-auto p-5 mt-auto">
                    <form className="block basis-full flex flex-col gap-5">
                        <h3 className="font-bold uppercase text-xl">Settings</h3>
                        <div className="flex flex-col">
                            <label htmlFor="email">Email address for notifications</label>
                            <input
                                id="email"
                                name="email"
                                type="text"
                                value={form.email}
                                onChange={handleChange}
                                className="bg-app-bg py-1 px-2 border-app-success rounded-md"
                            />
                        </div>
                        <div className="flex flex-col">
                            <label htmlFor="phone">Phone with country code</label>
                            <input
                                id="phone"
                                name="phone"
                                type="text"
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
