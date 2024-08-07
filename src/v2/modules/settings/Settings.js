import { useState, useEffect } from "react";

import Notifications from "./Notifications";
import Staking from "./Staking";
import Wallet from "./Wallet";
import General from "./General";
import useMediaQuery, { breakpoints } from "@/v2/hooks/useMediaQuery";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/v2/components/ui/tabs";
import Referals from "@/v2/modules/settings/Referals";

export const mobileTabs = [
    {
        id: "staking",
        name: "Staking",
        component: Staking,
    },
    {
        id: "notification",
        name: "Notification",
        component: Notifications,
    },
    {
        id: "wallet",
        name: "Wallet",
        component: Wallet,
    },
    {
        id: "mobile-referals",
        name: "Referals",
        component: Referals,
    },
];

export const desktopTabs = [
    {
        id: "general",
        name: "General settings",
        component: General,
    },
    {
        id: "referals",
        name: "Referals",
        component: Referals,
    },
];

export default function Settings({ session, wallets }) {
    const isDesktop = useMediaQuery(breakpoints.md);
    const tabs = isDesktop ? desktopTabs : mobileTabs;
    const [activeTab, setActiveTab] = useState(isDesktop ? "general" : "staking");

    useEffect(() => setActiveTab(isDesktop ? "general" : "staking"), [isDesktop]);

    return (
        <div className="p-4 mt-15 md:px-16 md:h-[calc(100vh_-_250px)] overflow-y-auto">
            <Tabs className="h-full" value={activeTab} onValueChange={setActiveTab}>
                <div className="flex justify-between items-center">
                    <TabsList aria-label="Settings tabs" className="pb-0">
                        {tabs.map((tab) => (
                            <TabsTrigger key={tab.name} value={tab.id}>
                                {tab.name}
                            </TabsTrigger>
                        ))}
                    </TabsList>
                    <button className="bg-turquoise text-white font-light text-nowrap py-2 px-6 rounded" type="button">
                        Save Settings
                    </button>
                </div>

                {tabs.map(({ id, component: Comp }) => (
                    <TabsContent key={id} className="mt-4" value={id}>
                        <Comp session={session} wallets={wallets} />
                    </TabsContent>
                ))}
            </Tabs>
        </div>
    );
}
