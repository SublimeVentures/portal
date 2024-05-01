import { useRouter } from "next/router";
import Link from "next/link";
import { SpeakerLoudIcon } from "@radix-ui/react-icons";

import PAGE from "@/routes";
import { IconButton } from "@/components/ui/icon-button";

const NavigationTabs = () => {
    const router = useRouter();

    return (
        <div className="bg-sidebar-gradient collap:hidden">
            <ul className="p-4 flex items-center justify-between gap-4">
                {menu.map(({ name, path, icon }) => (
                    <li key={name}>
                        <Link href={path}>
                            <IconButton shape="circle" variant={router.pathname === path ? "gradient" : "transparent"} icon={icon} />
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    )
};

const menu = [
    {
        name: "1",
        path: PAGE.App,
        icon: SpeakerLoudIcon,
    },
    {
        name: "2",
        path: "/",
        icon: SpeakerLoudIcon,
    },
    {
        name: "3",
        path: "/",
        icon: SpeakerLoudIcon,
    },
    {
        name: "4",
        path: "/",
        icon: SpeakerLoudIcon,
    },
];


export default NavigationTabs;
