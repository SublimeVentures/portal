import VanillaTilt from "vanilla-tilt";
import { useEffect, useRef } from "react";
import { IoRocket as RocketIcon } from "react-icons/io5";
import { ButtonIconSize, RoundButton } from "@/components/Button/RoundButton";

export default function LatestInvestment({ isSuccess, icon, content }) {
    const tiltAvatar = useRef(null);

    useEffect(() => {
        VanillaTilt.init(tiltAvatar.current, {
            scale: 1.1,
            speed: 1000,
            max: 10,
        });
    }, []);

    return (
        <div className="flex flex-1 bg-navy-accent rounded-xl shadow-md">
            <div className="w-[150px]">timeline</div>
            <div className="px-10 py-5 flex flex-col flex-1">
                <div className="font-accent text-xs ml-1 font-medium uppercase">Latest Offer</div>
                <div className="flex flex-1 flex-col">
                    <div className="text-3xl font-bold mb-2 ">Heroes of Mavia</div>
                    <div>asdsadas</div>
                    <div className="flex flex-1 justify-center items-end">
                        <RoundButton
                            text={"Read more"}
                            isWide={true}
                            size={"text-sm sm"}
                            icon={<RocketIcon className={ButtonIconSize.hero} />}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
