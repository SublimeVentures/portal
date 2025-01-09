import { useEffect, useState } from "react";
import Link from "next/link";
import useScrollPosition from "@/lib/hooks/useScrollPosition";
import { tenantIndex } from "@/lib/utils";
import { CitCapGlitchButton } from "@/components/Button/CitCapGlitchButton";
import { getTenantConfig, TENANT } from "@/lib/tenantHelper";
import DynamicIcon from "@/components/Icon";

const isBaseVCTenant = tenantIndex === TENANT.basedVC;

const { externalLinks } = getTenantConfig();

const TENANT_MENU = () => {
    switch (Number(process.env.NEXT_PUBLIC_TENANT)) {
        case TENANT.basedVC: {
            return [];
        }
        case TENANT.NeoTokyo: {
            return [
                { name: "APPLY", link: externalLinks.APPLY, isExternal: true },
                { name: "DOCS", link: externalLinks.WIKI, isExternal: true },
                { name: "TOKENOMICS", link: "tokenomics" },
            ];
        }
        case TENANT.BAYC: {
            return [
                { name: "DOCS", link: externalLinks.WIKI, isExternal: true },
                { name: "INVESTMENTS", link: "investments" },
            ];
        }
        default: {
            return [
                { name: "DOCS", link: externalLinks.WIKI, isExternal: true },
                { name: "TOKENOMICS", link: "tokenomics" },
            ];
        }
    }
};

export default function Navbar() {
    const [isMobileOpen, setIsMobileOpen] = useState(false);
    const [isOnTop, setIsOnTop] = useState(false);
    const scrollPosition = useScrollPosition();

    const toggleMobile = (e) => {
        e.preventDefault();
        setIsMobileOpen((isMobileOpen) => !isMobileOpen);
    };

    const disableMobile = () => setIsMobileOpen(false);

    const buildLinks = (el, i) => {
        if (isBaseVCTenant) {
            if (!el.isExternal)
                return (
                    <Link href={el.link} key={i} className="mx-5 cursor-pointer underlineHover">
                        {el.name}
                    </Link>
                );
            else
                return (
                    <a
                        href={el.link}
                        key={i}
                        target="_blank"
                        className="mx-5 cursor-pointer underlineHover"
                        rel="noreferrer"
                    >
                        {el.name}
                    </a>
                );
        } else {
            if (!el.isExternal)
                return (
                    <Link href={el.link} key={i} className="mx-3 cursor-pointer ">
                        <CitCapGlitchButton text={`${process.env.NEXT_PUBLIC_TENANT == "6" ? "_" : ""}${el.name}`} />
                    </Link>
                );
            else
                return (
                    <a href={el.link} key={i} target="_blank" className="mx-3 cursor-pointer " rel="noreferrer">
                        <CitCapGlitchButton text={`${process.env.NEXT_PUBLIC_TENANT == "6" ? "_" : ""}${el.name}`} />
                    </a>
                );
        }
    };

    useEffect(() => {
        setIsOnTop(scrollPosition < 50);
    }, [scrollPosition]);

    return (
        <div className="fixed w-full z-20 text-uppercase tracking-widest">
            <div
                className={`
                ${!isOnTop || isMobileOpen ? "blurredBG" : ""} 
                flex flex-row items-center w-full px-10 navShadow py-4`}
            >
                <Link href="/" onClick={disableMobile}>
                    <div className={`flex`}>
                        <DynamicIcon name={`logo_${process.env.NEXT_PUBLIC_TENANT}`} style={"w-17 text-white"} />
                    </div>
                </Link>
                <div className={`text-end relative flex flex-1 justify-end hidden md:flex md:text-end md:pr-5 `}>
                    {TENANT_MENU().map((el, i) => {
                        return buildLinks(el, i);
                    })}
                </div>

                <div className="md:hidden flex flex-1 justify-end hamburger">
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
            {isMobileOpen && (
                <div className="absolute flex flex-col w-full left-0 text-center py-5">
                    {TENANT_MENU().map((el, i) => {
                        return buildLinks(el, i);
                    })}
                </div>
            )}
        </div>
    );
}
