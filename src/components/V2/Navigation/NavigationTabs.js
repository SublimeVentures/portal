import { useRouter } from "next/router";
import Link from "next/link";

import PAGE from "@/routes";
import { IconButton } from "@/components/ui/icon-button";
import NounStatisticsIcon from "@/assets/v2/svg/noun-statistics.svg";
import NounVaultIcon from "@/assets/v2/svg/noun-vault.svg";
import CourtIcon from "@/assets/v2/svg/court.svg";
import DiamondIcon from "@/assets/v2/svg/diamond.svg";

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
        icon: NounStatisticsIcon,
    },
    {
        name: "2",
        path: "/",
        icon: NounVaultIcon,
    },
    {
        name: "3",
        path: "/",
        icon: CourtIcon,
    },
    {
        name: "4",
        path: "/",
        icon: DiamondIcon,
    },
];

export default NavigationTabs;
