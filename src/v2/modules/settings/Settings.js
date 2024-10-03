import { useState, useEffect } from "react";

import Notifications from "./Notifications";
import Staking from "./Staking";
import Wallet from "./Wallet";
import General from "./General";
import useMediaQuery, { breakpoints } from "@/v2/hooks/useMediaQuery";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/v2/components/ui/tabs";
import Referrals from "@/v2/modules/settings/Referrals";
import { cn } from "@/lib/cn";

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
        id: "mobile-referrals",
        name: "Referrals",
        component: Referrals,
    },
];

export const desktopTabs = [
    {
        id: "general",
        name: "General Settings",
        component: General,
    },
    {
        id: "referrals",
        name: "Referrals",
        component: Referrals,
    },
];

export default function Settings({ session }) {
    const isDesktop = useMediaQuery(breakpoints.md);
    const tabs = isDesktop ? desktopTabs : mobileTabs;
    const [activeTab, setActiveTab] = useState(isDesktop ? "general" : "staking");

    useEffect(() => setActiveTab(isDesktop ? "general" : "staking"), [isDesktop]);

    return (
        <>
            <Tabs
                value={activeTab}
                onValueChange={setActiveTab}
                className="relative grow flex flex-col gap-4 xl:mb-12 xl:overflow-hidden"
            >
                <div className="-mx-4 relative flex justify-between items-center before:absolute before:inset-y-0 before:left-0 before:w-6 before:z-10 sm:before:hidden before:pointer-events-none before:bg-gradient-to-r before:to-transparent before:from-primary-950 after:absolute after:inset-y-0 after:right-0 after:w-6 after:z-10 sm:after:hidden after:pointer-events-none after:bg-gradient-to-l after:to-transparent after:from-primary-950 select-none">
                    <TabsList aria-label="Settings tabs" className="pb-0 px-4">
                        {tabs.map((tab) => (
                            <TabsTrigger key={tab.name} value={tab.id}>
                                {tab.name}
                            </TabsTrigger>
                        ))}
                    </TabsList>
                </div>

                {tabs.map(({ id, component: Comp }) => (
                    <TabsContent
                        key={id}
                        value={id}
                        className={cn("flex flex-col gap-8 h-full  xl:overflow-hidden", { hidden: activeTab !== id })}
                    >
                        <Comp session={session} />
                    </TabsContent>
                ))}
            </Tabs>
        </>
    );
}
