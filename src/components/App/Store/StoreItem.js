import Image from "next/image";
import {isBased} from "@/lib/utils";
import {ButtonTypes, UniButton} from "@/components/Button/UniButton";
import {ExternalLinks} from "@/routes";
import ReadIcon from "@/assets/svg/Read.svg";
import {ButtonIconSize} from "@/components/Button/RoundButton";


export default function StoreItem({item, cdn, setOrder, currency}) {
    let {id, name, description, price, availability, img} = item

    const status = !availability ? "closed disabled" : "inprogress"
    console.log("currency",currency)
    return (
        <div
            className={`
            ${isBased ? "rounded-xl" : ""}
            bg-navy-accent flex flex-col text-center col-span-12
            border-transparent border offerItem ${status}
            md:col-span-6 collap:col-span-12 lg:!col-span-6 xl:!col-span-4`}
            >
            <div className={`flex flex-1 flex-col bg-navy-accent ${isBased ? "rounded-xl" : ""}`}>
                <div className="bg-center relative min-h-[300px]">
                    <div className={'image-container min-h-[300px]'}>
                        <Image src={`${cdn}/webapp/store/${img}`} fill className={`imageOfferList ${isBased ? "rounded-tl-xl rounded-tr-xl" : ""}  `} alt={name} sizes="(max-width: 768px) 100vw"/>
                    </div>
                </div>
                <div className={"flex flex-row z-10 "}>
                    <div className={"flex flex-1 items-end text-sm pb-5 "}>
                        <div className={"offerTime w-full px-5 flex justify-between h-8 items-center color"}>
                            <div>{id === 1 ? "Non-stackable" : "Stackable"}</div>
                            <div>Price: {price} {isBased ? "USD" : currency.symbol}</div>
                        </div>
                    </div>
                </div>
                <div className="flex flex-1 flex-col text-left ">
                    <div className={"px-10 flex flex-1 flex-col "}>
                        <div className="text-xl font-bold flex  glow pt-2">{name}</div>
                        <div className="text-sm flex flex-1 mt-2 pb-5 color ">{description}</div>
                        <div className={"pb-5 flex items-center justify-center"}>
                            <div>
                                <UniButton type={ButtonTypes.BASE} text={'BUY'} isWide={true}
                                           isLarge={false}
                                           size={'text-sm xs'}
                                           handler={()=> { if(availability>0) setOrder(item) }}
                                />
                            </div>

                        </div>
                    </div>

                    <div
                        className={`color uppercase font-bold offerBottom text-center py-2 text-xs w-full mt-auto  ${isBased ? "border-b-xl" : ""}`}>
                        {availability ? `Available (${availability})` : "Sold out"}
                    </div>
                </div>
            </div>

        </div>

    )
}
