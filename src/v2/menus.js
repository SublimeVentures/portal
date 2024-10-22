import { IoPersonAdd as ReferralIcon } from "react-icons/io5";
import PAGE, { ExternalLinks } from "@/routes";

import NounStatisticsIcon from "@/v2/assets/svg/noun-statistics.svg";
import NounVaultIcon from "@/v2/assets/svg/noun-vault.svg";
import CourtIcon from "@/v2/assets/svg/court.svg";
import DiamondIcon from "@/v2/assets/svg/diamond.svg";

import DiscordIcon from "@/v2/assets/svg/discord.svg";
import GitbookIcon from "@/v2/assets/svg/gitbook.svg";
import TwitterIcon from "@/v2/assets/svg/twitter.svg";

export const mainMenu = [
    {
        name: "Vault",
        path: PAGE.App,
        icon: NounStatisticsIcon,
    },
    {
        name: "Opportunities",
        path: PAGE.Opportunities,
        icon: NounVaultIcon,
    },
    {
        name: "OTC Market",
        path: PAGE.OTC,
        icon: CourtIcon,
    },
    {
        name: "Upgrades",
        path: PAGE.Upgrades,
        icon: DiamondIcon,
    },
    {
        name: "Referrals",
        path: PAGE.Referral,
        icon: DiamondIcon,
    },
];

export const profileMenu = [
    {
        name: "Mystery Box",
        path: PAGE.Mysterybox,
    },
    {
        name: "Settings",
        path: PAGE.Settings,
    },
    {
        name: "History",
        path: PAGE.Notifications,
    },
];

export const tabletMenu = [...mainMenu, ...profileMenu];

export const socialMenu = [
    {
        name: "discord",
        path: ExternalLinks.DISCORD,
        icon: DiscordIcon,
    },
    {
        name: "gitbook",
        path: ExternalLinks.WIKI,
        icon: GitbookIcon,
    },
    {
        name: "twitter-x",
        path: ExternalLinks.TWITTER,
        icon: TwitterIcon,
    },
];
