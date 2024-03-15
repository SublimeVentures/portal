import Image from "next/image";
import { isBased } from "@/lib/utils";
import { PremiumItemsENUM } from "@/lib/enum/store";

export default function UpgradesModalItem({
    itemType,
    selected,
    setSelectedUpgrade,
    isRightPhase,
    owned,
    used,
    image,
    name,
    description,
}) {
    return (
        <div className={"relative"}>
            <div
                className={`flex flex-row upgrade ${isBased ? "rounded-xl" : ""} ${selected === itemType ? "active" : ""} ${!isRightPhase || (isRightPhase && itemType === PremiumItemsENUM.Guaranteed && used > 0) ? "blur disabled" : "cursor-pointer"} ${!owned ? "disabled" : ""}`}
                onClick={() => {
                    if (isRightPhase && owned > 0) setSelectedUpgrade(itemType);
                }}
            >
                <div className={"image-container min-w-[150px] min-h-[150px] max-w-[150px]"}>
                    <Image
                        src={`https://cdn.basedvc.fund/webapp/store/${image}`}
                        fill
                        style={{ objectFit: "cover" }}
                        className={` ${isBased ? "rounded-xl" : ""}  `}
                        alt={"img"}
                    />
                </div>
                <div className={"pl-5 py-2 flex flex-col"}>
                    <div className={"text-md font-bold flex  glow name"}>{name}</div>
                    <div className={"text-sm mb-auto"}>{description}</div>

                    <div className={"text-sm"}>
                        <div className={"detailRow mt-auto"}>
                            <p>Owned</p>
                            <hr className={"spacer"} />
                            <p>{owned ? owned : 0}</p>
                        </div>
                        {itemType === PremiumItemsENUM.Increased && used > 0 && (
                            <div className={"detailRow mt-auto"}>
                                <p>Used</p>
                                <hr className={"spacer"} />
                                <p>{used ? used : 0}</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
            {!isRightPhase && (
                <div className={"absolute top-0 bottom-0 left-0 right-0 flex justify-center items-center flex-col"}>
                    Can't use <span className={"text-gold glow"}>{name}</span> during investment.
                </div>
            )}
            {isRightPhase && itemType === PremiumItemsENUM.Guaranteed && used > 0 && (
                <div className={"absolute top-0 bottom-0 left-0 right-0 flex justify-center items-center flex-col"}>
                    <span className={"text-gold glow"}>{name}</span> can be used only once.
                </div>
            )}
        </div>
    );
}
