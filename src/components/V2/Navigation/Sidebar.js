import { useRouter } from "next/router";
import Link from "next/link";

import ChangeNetwork from "@/components/Navigation/ChangeNetwork";
import ChangeAddress from "@/components/Navigation/ChangeAddress";
import { IconButton } from "@/components/ui/icon-button";
import { cn } from "@/lib/cn";
import { mainMenu, socialMenu } from "@/config";

const Sidebar = ({ session }) => {
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
          <div className='hidden p-6 min-h-screen h-full w-max bg-sidebar-gradient collap:flex collap:flex-col collap:gap-2'>
              <div className="flex justify-between">
                  <Link href={PAGE.App} className='px-8 mb-10 flex flex-col'>
                      <h1 className="text-8xl font-semibold text-foreground">based.vc</h1>
                      <p className="text-md font-light text-foreground">VC for all</p>
                  </Link>
                  <ChangeNetwork />
                  <ChangeAddress session={session} />
              </div>

              <nav>
                  {generateMenu("Menu", mainMenu.groupUser)}
                  {generateMenu("Account", mainMenu.groupProfile)}
              </nav>

              <div className="mt-auto flex flex-col items-center">
                  <h2 className="text-xxs font-light text-gray-100">Community</h2>
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

export default Sidebar;
