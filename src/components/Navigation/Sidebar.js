import Link from "next/link";
import { Fragment } from "react";
import { Transition } from "@headlessui/react";
import { useState } from "react";
import { useRouter } from "next/router";
import {
    BsLightningCharge as IconLight,
    BsSafe as IconVault
} from "react-icons/bs";
import { MdOutlineCurrencyExchange as IconExchange } from "react-icons/md";
import {
    IoLogoDiscord as IconDiscord,
    IoNotificationsOutline as IconBell,
    IoBookOutline as IconWiki,
    IoLogOutOutline as IconLogout,
    IoSettingsOutline as IconSetting,
    IoDiamondOutline as IconPremium
} from "react-icons/io5";
import { PiPlantFill as IconGrowth } from "react-icons/pi";
import IconMysteryBox from "@/assets/svg/MysteryBox.svg";
import IconNT from "@/assets/svg/NT.svg";
import PAGE, { ExternalLinks } from "@/routes";
import { isBased } from "@/lib/utils";
import { useEnvironmentContext } from "@/lib/context/EnvironmentContext";
import ChangeNetwork from "@/components/Navigation/ChangeNetwork";
import ChangeAddress from "@/components/Navigation/ChangeAddress";
import { TENANT } from "@/lib/tenantHelper";
import DynamicIcon from "@/components/Icon";
import { getCopy } from "@/lib/seoConfig";

const TENANT_LOGO = () => {
    switch (Number(process.env.NEXT_PUBLIC_TENANT)) {
        case TENANT.basedVC: {
            return (
                <>
                    <DynamicIcon name={`logo_${process.env.NEXT_PUBLIC_TENANT}`} style={"w-17 text-white"} />{" "}
                    <div className={"text-2xl ml-2"}>{getCopy("NAME")}</div>
                </>
            );
        }
        case TENANT.NeoTokyo: {
            return (
                <>
                    <DynamicIcon name={`logo_${process.env.NEXT_PUBLIC_TENANT}`} style={"w-17 text-white"} />{" "}
                    <div className={"font-accent text-sm ml-3"}>{getCopy("NAME")}</div>
                </>
            );
        }
        case TENANT.CyberKongz: {
            return (
                <>
                    <img
                        src={"https://vc-cdn.s3.eu-central-1.amazonaws.com/webapp/hero_14.png"}
                        className={"max-w-[210px]"}
                    />
                </>
            );
        }
    }
};

export default function Sidebar({ session }) {
    const { environmentCleanup, settings } = useEnvironmentContext();

    let [isMobileOpen, setIsMobileOpen] = useState(false);
    const router = useRouter();
    const toggleMobile = (e) => {
        e?.preventDefault();
        if (e) {
            setIsMobileOpen((isMobileOpen) => !isMobileOpen);
        } else {
            setIsMobileOpen(false);
        }
    };

    const openDiscord = (e) => {
        e?.preventDefault();
        window.open(ExternalLinks.DISCORD, "_blank");
        setIsMobileOpen(false);
    };

    const openNotion = (e) => {
        e?.preventDefault();
        window.open(ExternalLinks.WIKI, "_blank");
        setIsMobileOpen(false);
    };

    const logout = () => {
        environmentCleanup();
    };

    const menu = {
        groupUser: [
            {
                name: "Vault",
                link: PAGE.App,
                icon: <IconVault className="w-8 mr-3" />,
            },
            {
                name: "Opportunities",
                link: PAGE.Opportunities,
                icon: <IconLight className="w-8 mr-3" />,
            },
            {
                name: "Accelerator",
                link: PAGE.Accelerator,
                icon: isBased ? <IconGrowth className="w-7 mr-4" /> : <IconNT className="w-8 mr-[0.91rem]" />,
            },
            {
                name: "OTC",
                link: PAGE.OTC,
                icon: <IconExchange className="w-8 mr-3" />,
            },
            {
                name: "Upgrades",
                link: PAGE.Upgrades,
                icon: <IconPremium className="w-8 mr-3" />,
            },
            {
                name: "Notifications",
                link: PAGE.Notifs,
                disabled: true,
                icon: <IconBell className="w-8 mr-3" />,
            },
        ],
        groupHelp: [
            {
                name: "Community",
                icon: <IconDiscord className="w-6 ml-1 mr-3" />,
                action: true,
                handler: openDiscord,
            },
            {
                name: "Wiki",
                icon: <IconWiki className="w-6 ml-1 mr-3" />,
                action: true,
                handler: openNotion,
            },
        ],
        groupProfile: [
            {
                name: "Settings",
                link: PAGE.Settings,
                icon: <IconSetting className="w-8 mr-3" />,
            },
            {
                name: "Log out",
                icon: <IconLogout className="w-8 mr-3" />,
                action: true,
                handler: logout,
            },
        ],
    };

    if (settings.isMysteryboxEnabled) {
        const upgradeIndex = menu.groupUser.findIndex((item) => item.name === "Upgrades");
        if (upgradeIndex !== -1) {
            menu.groupUser.splice(upgradeIndex, 0, {
                name: "MysteryBox",
                link: PAGE.Mysterybox,
                icon: <IconMysteryBox className="w-8 mr-3" />,
            });
        }
    }

    const generateLink = (group) => {
        return group.map((el) => {
            if (el.action)
                return (
                    <div
                        key={el.name}
                        className={`flex cursor-pointer items-center px-5 py-2 ${isBased ? "rounded-xl" : ""} sidebar-item select-none ${el.disabled ? "disabled" : ""}`}
                        onClick={el.handler}
                    >
                        {el.icon}
                        {el.name}
                    </div>
                );
            else
                return (
                    <Link
                        href={el.link}
                        key={el.name}
                        onClick={() => {
                            toggleMobile();
                        }}
                        className={`flex items-center px-5 py-2  ${isBased ? "rounded-xl" : ""}  sidebar-item select-none ${el.disabled ? "disabled" : ""} ${router.asPath === el.link ? "arl" : ""}`}
                    >
                        {el.icon}
                        {el.name}
                    </Link>
                );
        });
    };

    return (
        <aside className="flex sticky top-0 z-20 collap:relative">
            <div className="p-7 flex flex-col border-r border-app-bg-split boxshadow text-app-white sticky top-0 hidden collap:flex overflow-y-auto">
                <div className="flex justify-between">
                    <Link href={PAGE.App}>
                        <div className="flex items-center">{TENANT_LOGO()}</div>
                    </Link>
                    <ChangeNetwork />
                    <ChangeAddress session={session} />
                </div>
                <nav className={`flex flex-col pt-10 flex-1 font-accent text-md ${isBased ? "font-medium" : ""}`}>
                    <div className="flex flex-col gap-2">{generateLink(menu.groupUser)}</div>
                    <div className="flex flex-col gap-2 mt-auto">{generateLink(menu.groupHelp)}</div>
                    <div className="flex flex-col gap-2 mt-12">{generateLink(menu.groupProfile)}</div>
                </nav>
            </div>
            <div
                className={`p-5 flex blurredBgColor flex flex-1  border-b border-app-bg-split hamburger transition-colors duration-300 collap:hidden ${isMobileOpen ? "!bg-app-bg" : ""}`}
            >
                <div className=" flex flex-row flex-1">
                    <Link href={PAGE.App} className={`absolute top-[4px]`}>
                        <div className="flex items-center">{TENANT_LOGO()}</div>
                    </Link>
                    <div className="flex flex-1 justify-end hamburger items-center">
                        <div onClick={toggleMobile}>
                            <div className={` burger ${isMobileOpen && "opened"}`}>
                                <div></div>
                            </div>
                            <label>
                                <input type="checkbox" id="check" defaultChecked={isMobileOpen} />
                                <span></span>
                                <span></span>
                                <span></span>
                            </label>
                        </div>
                    </div>
                </div>
            </div>
            <Transition appear show={isMobileOpen} as={Fragment}>
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div
                        className={`blurredBgColor border-b border-app-bg-split absolute top-[72px] text-app-white bg-app-bg flex flex-col w-full left-0 text-center py-10 px-12 text-uppercase tracking-widest font-accent  ${isBased ? "font-medium" : ""}`}
                    >
                        <div className="flex flex-col gap-2">{generateLink(menu.groupUser)}</div>
                        <div className="flex flex-col gap-2 mt-5">{generateLink(menu.groupHelp)}</div>
                        <div className="flex flex-col gap-2 mt-5">{generateLink(menu.groupProfile)}</div>
                    </div>
                </Transition.Child>
            </Transition>
        </aside>
    );
}
