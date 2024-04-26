import { useRouter } from "next/router";
import Link from "next/link";

import { IconButton } from "@/components/ui/icon-button";
import { IoBookOutline as IconWiki } from "react-icons/io5";
import { FaDiscord as IconDiscord } from "react-icons/fa";
import PAGE, { ExternalLinks } from "@/routes";
import { cn } from "@/lib/cn";

// @Todo
// Should add?
// <ChangeNetwork />
// <ChangeAddress session={session} />

const Sidebar = () => {
    const router = useRouter();

    const handleExternalLinkOpen = (evt, path) => {
        evt.preventDefault();
        window.open(path, "_blank");
    }

    const generateMenu = (name, items) => {
        return (
            <>
                <h2 className="p-8 text-xxs text-foreground">{name}</h2>
                <ul className="flex flex-col gap-2">
                    {items.map(({ name, path }) => (
                        <li key={path} className={cn("text-xl py-2 font-light text-foreground hover:bg-[#164062] rounded cursor-pointer", { "cardGradientLight": router.pathname === path } )}>
                            <Link href={path} className="px-8">{name}</Link>
                        </li>
                    ))}
                </ul>
            </>
        )
    };

    return (
      <aside>
          <div className='hidden p-6 min-h-screen h-full w-max bg-sidebar collap:flex collap:flex-col collap:gap-2'>
              <div className='px-8 mb-10 flex flex-col'>
                  <h1 className="text-8xl font-semibold text-foreground">based.vc</h1>
                  <p className="text-md font-light text-foreground">VC for all</p>
              </div>

              <nav>
                  {generateMenu("Menu", menu.groupUser)}
                  {generateMenu("Account", menu.groupProfile)}
              </nav>

              <div className="mt-auto flex flex-col items-center">
                  <h2 className="text-xxs font-light text-[#AEB3B8]">Community</h2>
                  <ul className="flex items-center gap-4">
                      {socialMenu.map(({ icon, name, path }) => (
                          <li key={name} className="pt-4">
                              <IconButton
                                    variant="transparent"
                                    shape="circle"
                                    name={name}
                                    icon={icon}
                                    className="w-[36px] h-[36px]"
                                    onClick={(evt) => handleExternalLinkOpen(evt, path)}
                                />
                          </li>
                      ))}
                  </ul>
              </div>
          </div>
      </aside>
    )
}

const menu = {
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
}

const socialMenu = [
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
]

export default Sidebar;
