import { useRouter } from "next/router";
import { IoDiamondOutline as IconPremium } from "react-icons/io5";
import { ButtonTypes, UniButton } from "@/components/Button/UniButton";
import routes from "@/routes";
import { ButtonIconSize } from "@/components/Button/RoundButton";
import { PremiumItemsENUM } from "@/lib/enum/store";

export default function PremiumSummary({ data }) {
    const router = useRouter();
    const guaranteed = data?.find((el) => el.id === PremiumItemsENUM.Guaranteed);
    const increased = data?.find((el) => el.id === PremiumItemsENUM.Increased);
    const mystery = data?.find((el) => el.id === PremiumItemsENUM.MysteryBox);

    return (
        <div
            className={`
                   bordered-container bg-app-accent banner
                   flex flex-1 flex-wrap items-center justify-between
                   px-10 py-5 gap-5
                   `}
        >
            <div className="flex flex-1 flex-col md:flex-row justify-center items-center">
                <div className="flex flex-1 text-3xl font-bold card-content-dedicated">Premium</div>
                {guaranteed?.amount > 0 || increased?.amount > 0 || mystery?.amount > 0 ? (
                    <div className="blurred2 px-4 py-2 mt-5 md:mt-0  bordered-container">
                        {guaranteed?.amount > 0 && (
                            <div className="detailRow">
                                <p>Guaranteed Allocation:</p>
                                <hr className="spacer min-w-[20px] opacity-0" />
                                <p>{guaranteed?.amount ? guaranteed.amount : 0}</p>
                            </div>
                        )}
                        {increased?.amount > 0 && (
                            <div className="detailRow">
                                <p>Increased Allocation:</p>
                                <hr className="spacer min-w-[20px] opacity-0" />
                                <p>{increased?.amount ? increased.amount : 0}</p>
                            </div>
                        )}
                        {mystery?.amount > 0 && (
                            <div className="detailRow">
                                <p>MysteryBox owned:</p>
                                <hr className="spacer min-w-[20px] opacity-0" />
                                <p>{mystery?.amount ? mystery.amount : 0}</p>
                            </div>
                        )}
                    </div>
                ) : (
                    <UniButton
                        type={ButtonTypes.BASE}
                        text="Get upgrades"
                        isWide={true}
                        size="text-sm sm"
                        handler={() => {
                            router.push(routes.Upgrades);
                        }}
                        icon={<IconPremium className={ButtonIconSize.hero} />}
                    />
                )}
            </div>
        </div>
    );
}
