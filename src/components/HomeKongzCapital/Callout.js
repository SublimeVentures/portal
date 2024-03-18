import { ButtonIconSize, RoundButton } from "@/components/Button/RoundButton";
import PlusIcon from "@/assets/svg/Plus.svg";
import DiscordIcon from "@/assets/svg/Discord.svg";
import TwitterIcon from "@/assets/svg/Twitter.svg";
import { ExternalLinks } from "@/routes";

export default function Investors() {
    return (
        <div className="calloutGradient flex flex-col justify-center text-white pt-10">
            <div className="px-10 py-25 pb-35 flex flex-col gap-10 flex-1 mx-auto xl:max-w-[1400px]">
                <div className="flex flex-col items-center mx-auto gap-5 md:flex-row">
                    <a href={ExternalLinks.DISCORD} target="_blank">
                        <RoundButton
                            text={"Join"}
                            is3d={true}
                            isPrimary={false}
                            isWide={true}
                            zoom={1.1}
                            size={"text-sm sm"}
                            icon={<DiscordIcon className={ButtonIconSize.hero} />}
                        />
                    </a>

                    <PlusIcon className="w-8 text-white" />

                    <a href={ExternalLinks.TWITTER} target="_blank">
                        <RoundButton
                            text={"Follow"}
                            is3d={true}
                            isPrimary={false}
                            isWide={true}
                            zoom={1.1}
                            size={"text-sm sm"}
                            icon={<TwitterIcon className={ButtonIconSize.hero} />}
                        />
                    </a>
                </div>
            </div>
        </div>
    );
}
