import { ExternalLinks } from "@/routes";
import { IconButton } from "@/components/Button/IconButton";
import IconInfo from "@/assets/svg/Info.svg";

export default function BasedStaking({ account }) {
    return (
        <div
            className={`rounded-xl boxshadow relative offerWrap flex flex-1 max-w-[600px]`}
        >
            <div
                className={` rounded-xl relative bg-navy-accent flex flex-1 flex-col p-5 `}
            >
                <div className="font-bold text-2xl flex items-center glowNormal">
                    <div className={"flex flex-1"}>STAKING</div>
                    {/*<a href={ExternalLinks.STAKING} target={"_blank"}>*/}
                    {/*    <IconButton zoom={1.1} size={'w-8'} icon={<IconInfo/>} noBorder={true}/>*/}
                    {/*</a>*/}
                </div>
                <div className={"flex flex-1 justify-center items-center"}>
                    Available soon
                </div>
            </div>
        </div>
    );
}
