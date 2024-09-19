import { useState, useEffect } from "react";

import Notifications from "./Notifications";
import Staking from "./Staking";
import Wallet from "./Wallet";
import General from "./General";
import useMediaQuery, { breakpoints } from "@/v2/hooks/useMediaQuery";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/v2/components/ui/tabs";
import Referrals from "@/v2/modules/settings/Referrals";

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
        name: "General settings",
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
                className="grow lg:overflow-hidden flex flex-col gap-3 lg:-mr-5 lg:pr-5"
                value={activeTab}
                onValueChange={setActiveTab}
            >
                <div className="relative flex justify-between items-center -mx-4 before:absolute before:inset-y-0 before:left-0 before:w-6 before:z-10 md:before:hidden before:pointer-events-none before:bg-gradient-to-r before:to-transparent before:from-primary-950 after:absolute after:inset-y-0 after:right-0 after:w-6 after:z-10 md:after:hidden after:pointer-events-none after:bg-gradient-to-l after:to-transparent after:from-primary-950 select-none">
                    <TabsList aria-label="Settings tabs" className="pb-0 px-4">
                        {tabs.map((tab) => (
                            <TabsTrigger key={tab.name} value={tab.id}>
                                {tab.name}
                            </TabsTrigger>
                        ))}
                    </TabsList>
                </div>

                {tabs.map(({ id, component: Comp }) => (
                    <TabsContent key={id} className="grow lg:overflow-x-auto lg:-mr-5 lg:pr-3 mt-0" value={id}>
                        <div className="lg:mt-3 lg:mb-6 3xl:my-0 3xl:pb-12 3xl:h-full">
                            <Comp session={session} />
                        </div>
                    </TabsContent>
                ))}
            </Tabs>
        </>
    );
}
