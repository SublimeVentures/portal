import PAGE, { ExternalLinks } from "@/routes";

import DiscordIcon from "@/v2/assets/svg/discord.svg";
import GitbookIcon from "@/v2/assets/svg/gitbook.svg";
import TwitterIcon from "@/v2/assets/svg/twitter.svg";

export const mainMenu = {
    groupUser: [
        {
            name: "Vault",
            path: PAGE.App,
        },
        {
            name: "Opportunities",
            path: PAGE.Opportunities,
        },
        {
            name: "OTC Market",
            path: PAGE.OTC,
        },
        {
            name: "Upgrades",
            path: PAGE.Upgrades,
        },
    ],
    groupProfile: [
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
    ],
};

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
        path: "/",
        icon: TwitterIcon,
    },
];
