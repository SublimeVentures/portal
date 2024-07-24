import { useState, useEffect } from "react";

import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/v2/components/ui/tabs";
import useMediaQuery, { breakpoints } from "@/v2/hooks/useMediaQuery";
import Notifications from "./Notifications";
import Staking from "./Staking";
import Wallet from "./Wallet";
import General from "./General";

const Referals = () => <div className="text-white">Referals view</div>

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
]

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
]

export default function Settings({ session, wallets }) {
    const isDesktop = useMediaQuery(breakpoints.md);
    const tabs = isDesktop ? desktopTabs : mobileTabs;
    const [activeTab, setActiveTab] = useState(isDesktop ? "general" : "staking");

    useEffect(() => setActiveTab(isDesktop ? "general" : "staking"), [isDesktop]);
    
    return (
        <div className="px-4 md:px-16 md:h-[calc(100vh_-_250px)] overflow-y-auto">
            <Tabs className="h-full" value={activeTab} onValueChange={setActiveTab}>
                <TabsList aria-label="Settings tabs">
                    {tabs.map(tab => (
                        <TabsTrigger key={tab.name} value={tab.id}>
                            {tab.name}
                        </TabsTrigger>
                    ))}
                </TabsList>

                {tabs.map(({ id, component: Comp }) => (
                    <TabsContent className="mt-4 h-full" value={id}>
                        <Comp session={session} wallets={wallets} />
                    </TabsContent>
                ))}
            </Tabs>
        </div>
    );
};
