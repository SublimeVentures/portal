import IconArrow from "@/assets/svg/Arrow.svg";
import VanillaTilt from "vanilla-tilt";
import {useEffect, useRef} from "react";

export default function VaultItem({item}) {
    const {name, date, allocation, tge, vested, nextUnlock, url } = item;
    const tilt = useRef(null);

    useEffect(() => {
        VanillaTilt.init(tilt.current, {scale: 1.1, speed: 1000, max: 10});
    }, []);

    return <div className="timeline flex col-span-12 lg:col-span-6">
        <div
            className="relative rounded-tl-xl rounded-bl-xl bg-navy-accent flex flex-1 flex-col p-5 rounded-tr-xl rounded-br-xl sm:rounded-tr-none sm:rounded-br-none lg:!rounded-tr-xl lg:!rounded-br-xl xl:!rounded-tr-none xl:!rounded-br-none">
            <div className="font-bold text-2xl flex items-center">
                {name}
                <div className="ml-auto">
                    <div className="bg-app-success2 rounded-3xl text-black px-2 py-1 text-sm font-bold">ACTIVE
                    </div>
                </div>

            </div>
            <div className="pt-1 text-xs text-gray">Participated {date}</div>

            <div className="text-md  pt-2 w-full flex">Invested <span
                className="ml-auto font-bold">${allocation}</span></div>
            <div className="text-md   w-full flex">TGE profit <span
                className="ml-auto font-bold text-app-success">+{tge}%</span></div>
            <div className="text-md   w-full flex">Vested <span className="ml-auto font-bold">{vested}%</span>
            </div>
            <div className="text-md   w-full flex">Next unlock <span
                className="ml-auto font-bold">{nextUnlock}</span></div>
            <div
                className="moreVault  cursor-pointer opacity-0 absolute -bottom-5 mx-auto left-0 right-0 text-center">
                <div className="flex items-center justify-center moreVaultIcon">
                    <div className="icon z-10 w-15 h-15">
                        <IconArrow className="w-8"/>
                    </div>
                </div>

            </div>
        </div>
        <div
            className="rounded-tr-xl rounded-br-xl flex w-[200px] bg-cover cursor-pointer hidden sm:flex lg:hidden xl:!flex"
            style={{backgroundImage: `url(${url}) `}} ref={tilt}></div>
    </div>
}
