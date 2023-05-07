import Link from "next/link";
import {Fragment} from "react";
import {Transition} from '@headlessui/react'
import {useState} from "react";
import { useRouter } from "next/router";
import {signOut} from "next-auth/react";
import IconDashboard from "@/assets/svg/Dashboard.svg";
import IconVault from "@/assets/svg/Vault.svg";
import IconLight from "@/assets/svg/Light.svg";
import IconExchange from "@/assets/svg/Exchange.svg";
import IconBell from "@/assets/svg/Bell.svg";
import IconDiscord from "@/assets/svg/Discord.svg";
import IconWiki from "@/assets/svg/Wiki.svg";
import IconLogout from "@/assets/svg/Logout.svg";
import IconSetting from "@/assets/svg/Setting.svg";

import PAGE from "@/routes";
import dynamic from "next/dynamic";
const ChangeNetwork = dynamic(() => import('@/components/Navigation/ChangeNetwork'), {ssr: false,})
const ChangeAddress = dynamic(() => import('@/components/Navigation/ChangeAddress'), {ssr: false,})


export default function Sidebar() {
    let [isMobileOpen, setIsMobileOpen] = useState(false)
    const router = useRouter();

    const toggleMobile = (e) => {
        e?.preventDefault();
        if(e) {
            setIsMobileOpen(isMobileOpen => !isMobileOpen)
        } else {
            setIsMobileOpen(false)
        }
    }

    const openDiscord = (e) => {
        e.preventDefault();
        window.open("https://discord.gg/3SaqVVdzUH", '_blank');
        setIsMobileOpen(false)
    }

    const openNotion = (e) => {
        e.preventDefault();
        window.open("https://discord.gg/3SaqVVdzUH", '_blank');
        setIsMobileOpen(false)
    }

    const logout = () => {
        setIsMobileOpen(false)
        signOut({callbackUrl: "/"})
    }

    const menu = {
        groupUser: [
            {name: 'Dashboard', link: PAGE.App, icon: <IconDashboard className="w-8 mr-3"/>},
            {name: 'Vault', link: PAGE.Vault, icon: <IconVault className="w-8 mr-3"/>},
            {name: 'Opportunities', link: PAGE.Opportunities, icon: <IconLight className="w-8 mr-3"/>},
            {name: 'OTC', link: PAGE.OTC, icon: <IconExchange className="w-8 mr-3"/>},
            {name: 'Notifications', link: PAGE.Notifs, disabled: true, icon: <IconBell className="w-8 mr-3"/>},
        ],
        groupHelp: [
            {name: 'Community', icon: <IconDiscord className="w-6 ml-1 mr-3"/>, action: true, handler: openDiscord},
            {name: 'Wiki', icon: <IconWiki className="w-6 ml-1 mr-3"/>, action: true, handler: openNotion},
        ],
        groupProfile: [
            {name: 'Settings', link: PAGE.Settings, icon: <IconSetting className="w-8 mr-3"/>},
            {name: 'Log out', icon: <IconLogout className="w-8 mr-3"/>, action: true, handler: logout},
        ]
    }

    const generateLink = (group) => {
        return group.map(el => {
            if (el.action) return <div key={el.name}
                                       className={`flex cursor-pointer items-center px-5 py-2 rounded-xl sidebar-item select-none ${el.disabled ? 'disabled' : ''}`}
                                       onClick={el.handler}>{el.icon}{el.name}</div>
            else return <Link href={el.link} key={el.name} onClick={() => {toggleMobile()}}
                              className={`flex items-center px-5 py-2 rounded-xl sidebar-item select-none ${el.disabled ? 'disabled' : ''} ${router.asPath === el.link ? "arl" : ""}`}>{el.icon}{el.name}</Link>

        })
    }

    return (
        <aside className="flex sticky top-0 z-20 collap:relative">
            <div
                className="p-7 flex flex-col border-r border-app-bg-split text-app-white max-h-screen sticky top-0 hidden collap:flex">
                <div className="flex justify-between">
                    <Link href={PAGE.App}>
                        <div className="flex">
                            <img className="w-15 " src="/img/logo.png"/>
                        </div>
                    </Link>
                    <ChangeNetwork/>
                    <ChangeAddress/>

                </div>
                <nav className="flex flex-col pt-10 flex-1 font-accent text-md font-medium">
                    <div className="flex flex-col gap-2">
                        {generateLink(menu.groupUser)}
                    </div>
                    <div className="flex flex-col gap-2 mt-auto">
                        {generateLink(menu.groupHelp)}
                    </div>
                    <div className="flex flex-col gap-2 mt-12">
                        {generateLink(menu.groupProfile)}
                    </div>
                </nav>
            </div>
            <div
                className={`p-5 flex blurredBgColor flex flex-1 -mt-1  border-b border-app-bg-split hamburger transition-colors duration-300 collap:hidden ${isMobileOpen ? '!bg-navy-accent' : ''}`}>
                <div className="mt-1 flex flex-row flex-1">
                    <Link href={PAGE.App}>
                        <div className="flex">
                            <img className="w-15 " src="/img/logo.png"/>
                        </div>
                    </Link>
                    <div className="flex flex-1 justify-end hamburger">
                        <div onClick={toggleMobile}>
                            <div className={` burger ${isMobileOpen && 'opened'}`}>
                                <div></div>
                            </div>
                            <label>
                                <input type="checkbox" id="check" defaultChecked={isMobileOpen}/>
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
                        className="blurredBgColor border-b border-app-bg-split absolute top-[72px] text-app-white bg-navy-accent flex flex-col w-full left-0 text-center py-10 px-12 text-uppercase tracking-widest">
                        <div className="flex flex-col gap-2">
                            {generateLink(menu.groupUser)}

                        </div>
                        <div className="flex flex-col gap-2 mt-5">
                            {generateLink(menu.groupHelp)}
                        </div>
                        <div className="flex flex-col gap-2 mt-5">
                            {generateLink(menu.groupProfile)}
                        </div>
                    </div>
                </Transition.Child>
            </Transition>
        </aside>
    )
}


