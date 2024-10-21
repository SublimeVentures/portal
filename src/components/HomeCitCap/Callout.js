import { IoAddCircleOutline as PlusIcon } from "react-icons/io5";
import { FaXTwitter as TwitterIcon } from "react-icons/fa6";
import { FaDiscord as DiscordIcon } from "react-icons/fa";
import { ButtonIconSize, RoundButton } from "@/components/Button/RoundButton";
import { getTenantConfig } from "@/lib/tenantHelper";

const { externalLinks } = getTenantConfig();

export default function Investors() {
    return (
        <div className="bg-black flex flex-col justify-center text-white pt-10">
            <div className="px-10 py-25 pb-35 flex flex-col gap-10 flex-1 mx-auto xl:max-w-[1400px]">
                <div className="flex flex-col text-white font-medium uppercase text-center w-full">
                    <div className="font-heading text-xs ml-1">join us</div>
                    <div className="font-heading leading-snug text-3xl">LET'S WORK TOGETHER</div>
                </div>
                <div className={`font-heading text-center font-light`}>
                    Join our discord to learn more and gain access to VC deal flow.
                </div>
                <div className="flex flex-col items-center mx-auto gap-10 md:flex-row">
                    <a href={externalLinks.DISCORD} target="_blank" rel="noreferrer">
                        <RoundButton
                            text={"Join"}
                            is3d={true}
                            isPrimary={false}
                            isWide={true}
                            zoom={1.1}
                            size={
                                "text-sm border border-white rounded-full text-white h-16 px-14 uppercase tracking-[0.5rem] font-light shadow shadow-white/25"
                            }
                            icon={<DiscordIcon className={ButtonIconSize.hero} />}
                        />
                    </a>

                    <PlusIcon className="text-2xl text-white" />

                    <a href={externalLinks.TWITTER} target="_blank" rel="noreferrer">
                        <RoundButton
                            text={"Follow"}
                            is3d={true}
                            isPrimary={false}
                            isWide={true}
                            zoom={1.1}
                            size={
                                "text-sm border border-white rounded-full text-white h-16 px-14 uppercase tracking-[0.5rem] font-light shadow shadow-white/25"
                            }
                            icon={<TwitterIcon className={ButtonIconSize.hero} />}
                        />
                    </a>
                </div>
            </div>
        </div>
    );
}
