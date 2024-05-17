import { IoBookOutline as IconWiki } from "react-icons/io5";
import { FaDiscord as IconDiscord } from "react-icons/fa";
import PAGE, { ExternalLinks } from "@/routes";

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
          path: "/",
      },
      {
          name: "Settings",
          path: PAGE.Settings,
      },
      {
          name: "History",
          path: "/",
      },
  ]
};

export const socialMenu = [
  {
      name: "discord",
      path: ExternalLinks.DISCORD,
      icon: IconDiscord,
  },
  {
      name: "gitbook",
      path: ExternalLinks.WIKI,
      icon: IconWiki,
  },
  {
      name: "twitter-x",
      path: "/",
      icon: IconDiscord,
  },
];
