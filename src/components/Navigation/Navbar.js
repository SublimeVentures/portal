import {useEffect, useState} from "react";
import Link from 'next/link';
import useScrollPosition from "@/lib/hooks/useScrollPosition";
import {isBased} from "@/lib/utils";
import {ExternalLinks} from "@/routes";
import {CitCapGlitchButton} from "@/components/Button/CitCapGlitchButton";
import Logo from "@/assets/svg/logo.svg";
import dynamic from "next/dynamic";
const LogoCitCap = dynamic(() => import('@/assets/svg/logoCitCap.svg'))



export default function Navbar() {
    const [isMobileOpen, setIsMobileOpen] = useState(false)
    const [isOnTop, setIsOnTop] = useState(false)
    const scrollPosition = useScrollPosition();
    const menu = isBased ? [
        {name: 'APPLY', link: ExternalLinks.APPLY, isExternal: true},
        {name: 'DOCS', link: ExternalLinks.WIKI, isExternal: true},
        {name: 'INVESTMENTS', link: 'investments'},
    ] : [
        {name: 'APPLY', link: ExternalLinks.APPLY, isExternal: true},
        {name: 'DOCS', link: ExternalLinks.WIKI, isExternal: true},
        {name: 'TOKENOMICS', link: 'tokenomics'},
    ]

    const toggleMobile = (e) => {
        e.preventDefault();
        setIsMobileOpen(isMobileOpen => !isMobileOpen)
    }

    const disableMobile = () => setIsMobileOpen(false)


    const buildLinks = (el,i) =>{
        if(isBased) {
            if (!el.isExternal) return <Link href={el.link} key={i}
                                             className="mx-5 cursor-pointer underlineHover">{el.name}</Link>
            else return <a href={el.link} key={i} target="_blank"
                           className="mx-5 cursor-pointer underlineHover">{el.name}</a>
        } else {
            if (!el.isExternal) return <Link href={el.link} key={i}
                                             className="mx-3 cursor-pointer ">
                <CitCapGlitchButton text={`_${el.name}`} />
            </Link>
            else return <a href={el.link} key={i} target="_blank"
                           className="mx-3 cursor-pointer ">
                <CitCapGlitchButton text={`_${el.name}`} />
            </a>
        }

    }

    useEffect(() => {
        setIsOnTop(scrollPosition < 50);
    }, [scrollPosition])

    return (
        <div className="fixed w-full z-20 text-uppercase tracking-widest">
            <div
                className={`
                ${isBased ? "py-7" : "py-2"} 
                ${!isOnTop || isMobileOpen ? 'blurredBG' : ''} 
                flex flex-row items-center w-full  px-10 navShadow `}>
                <Link href="/" onClick={disableMobile} className={`${isBased ? "absolute" : ""} z-20`}>
                    <div className={`flex`}>
                        {isBased ? <Logo  className={"w-17 text-white "}/> : <LogoCitCap className={"w-17"}/>}
                    </div>
                </Link>
                <div className={`text-end relative flex flex-1 justify-end hidden md:flex md:text-end md:pr-5 `}>
                    {menu.map((el, i) => {
                        return buildLinks(el,i)
                    })}
                </div>

                <div className="md:hidden flex flex-1 justify-end hamburger">
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
            {isMobileOpen && <div className={`absolute ${isBased ? "blurred2" : "blurredBgColor gap-5"} flex flex-col w-full left-0 text-center py-5`}>
                {menu.map((el, i) => {
                    return buildLinks(el,i)
                })}
            </div>
            }
        </div>
    )
}
