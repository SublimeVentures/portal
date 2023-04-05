import {useEffect, useState} from "react";
import Link from 'next/link';
import useScrollPosition from "@/lib/hooks/useScrollPosition";

export default function Navbar() {
    const [isMobileOpen, setIsMobileOpen] = useState(false)
    const [isOnTop, setIsOnTop] = useState(false)
    const scrollPosition = useScrollPosition();
    const menu = [
        {name: 'DOCS', link: 'https://citizencapital.notion.site/', isExternal: true},
        {name: 'INVESTMENTS', link: 'investments'},
    ]

    const toggleMobile = (e) => {
        e.preventDefault();
        setIsMobileOpen(isMobileOpen => !isMobileOpen)
    }

    const disableMobile = () => setIsMobileOpen(false)

    useEffect(() => {
        setIsOnTop(scrollPosition < 50);
    }, [scrollPosition])

    return (
        <div className="fixed w-full z-20 text-uppercase tracking-widest">
            <div
                className={`flex flex-row items-center w-full py-7 px-10 navShadow hamburger ${!isOnTop || isMobileOpen ? 'blurredBG' : ''}`}>
                <Link href="/" onClick={disableMobile}>
                    <div className="f-work text-white text-2xl flex">
                        <img className="w-15 " src="/img/logo.png"/>
                    </div>
                </Link>
                <div className="text-end  flex flex-1 justify-end hidden md:flex md:text-end">
                    {menu.map((el, i) => {
                        if (!el.isExternal) return <Link href={el.link} key={i}
                                                         className="mx-5 cursor-pointer underlineHover">{el.name}</Link>
                        else return <a href={el.link} key={i} target="_blank"
                                       className="mx-5 cursor-pointer underlineHover">{el.name}</a>
                    })}
                </div>

                <div className="md:hidden flex flex-1 justify-end">
                    <div onClick={toggleMobile}>
                        <div className={` burger ${isMobileOpen ? 'opened' : ''}`}>
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
            {isMobileOpen && <div className="absolute blurred2 flex flex-col w-full left-0 text-center py-5">
                {menu.map((el, i) => {
                    if (!el.isExternal) return <Link href={el.link} key={i}
                                                     className="py-5 cursor-pointer"
                                                     onClick={disableMobile}>{el.name}</Link>
                    else return <a href={el.link} key={i} target="_blank"
                                   className="my-5 cursor-pointer underlineHover">{el.name}</a>
                })}
            </div>
            }
        </div>
    )
}
