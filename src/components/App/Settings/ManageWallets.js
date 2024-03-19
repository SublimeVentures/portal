import { useState } from "react";
import { ButtonTypes, UniButton } from "@/components/Button/UniButton";
import { isBased } from "@/lib/utils";
import { ButtonIconSize } from "@/components/Button/RoundButton";
import WalletAddModal from "@/components/App/Settings/WalletAddModal";
import DynamicIcon from "@/components/Icon";
import { ICONS } from "@/lib/icons";
import WalletRemoveModal from "@/components/App/Settings/WalletRemoveModal";
import { ExternalLinks } from "@/routes";
import { IconButton } from "@/components/Button/IconButton";
import IconInfo from "@/assets/svg/Info.svg";
import { useEnvironmentContext } from "@/lib/context/EnvironmentContext";

export default function ManageWallets({ walletProps }) {
    const { updateEnvironmentProps } = useEnvironmentContext();
    const { wallets } = walletProps;
    const [walletAdd, setWalletAdd] = useState(false);
    const [walletRemove, setWalletRemove] = useState(false);

    const maxWallets = 3;

    const openWalletAdd = () => {
        if (wallets.length >= maxWallets) return;
        setWalletAdd(true);
        updateEnvironmentProps([{ path: "walletGuard", value: false }]);
    };
    const openWalletRemove = () => {
        if (wallets.length === 1) return;
        setWalletRemove(true);
        updateEnvironmentProps([{ path: "walletGuard", value: false }]);
    };

    const addProps = {
        ...walletProps,
        maxWallets,
    };

    return (
        <>
            <div className={`${isBased ? "rounded-xl" : ""} boxshadow relative offerWrap flex flex-1 max-w-[600px]`}>
                <div className={`${isBased ? "rounded-xl" : ""} relative bg-navy-accent flex flex-1 flex-col `}>
                    <div className="font-bold text-2xl flex items-center glowNormal p-5 ">
                        <div
                            className={`flex flex-1 ${isBased ? "" : "text-app-error font-accent glowRed  font-light text-2xl flex glowNormal"} `}
                        >
                            WALLETS
                        </div>
                        <a href={ExternalLinks.STAKING} target={"_blank"}>
                            <IconButton zoom={1.1} size={"w-8"} icon={<IconInfo />} noBorder={true} />
                        </a>
                    </div>
                    <div>
                        <table>
                            <thead className={`${isBased ? "bg-navy-2" : "bg-slides"}`}>
                                <tr>
                                    <th className="font-bold text-sm text-left sm:py-4 sm:pl-5 sm:pr-2">
                                        <label>WALLET</label>
                                    </th>
                                    <th className="font-bold text-sm text-left sm:text-center sm:py-4 sm:px-2">
                                        <label>STAKING</label>
                                    </th>
                                    <th className="font-bold text-sm text-left sm:text-center sm:py-4 sm:px-2">
                                        <label>DELEGATED</label>
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {wallets.map((el) => {
                                    return (
                                        <tr
                                            key={el.wallet}
                                            className="hoverTable transition-all duration-300 hover:text-black"
                                        >
                                            <td
                                                className={`text-app-error font-bold text-sm text-right px-5 py-1 sm:text-left sm:px-2 sm:py-4 sm:pl-5 sm:pr-2`}
                                                data-label="WALLET"
                                            >
                                                {`${el.wallet.slice(0, 3)}...${el.wallet.slice(el.wallet.length - 3, el.wallet.length)}`}
                                            </td>
                                            <td
                                                className="text-sm text-right px-5 py-1 sm:text-center  sm:px-2 sm:py-4 sm:px-2"
                                                data-label="STAKING"
                                            >
                                                {el.isStaking ? (
                                                    <DynamicIcon
                                                        name={ICONS.SUCCESS}
                                                        style={ButtonIconSize.hero3center}
                                                    />
                                                ) : (
                                                    <>-</>
                                                )}
                                            </td>
                                            <td
                                                className="text-sm text-right px-5 py-1 sm:text-center sm:px-2 sm:py-4 sm:px-2"
                                                data-label="DELEGATED"
                                            >
                                                {el.isDelegate ? (
                                                    <DynamicIcon
                                                        name={ICONS.SUCCESS}
                                                        style={ButtonIconSize.hero3center}
                                                    />
                                                ) : (
                                                    <>-</>
                                                )}
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                    <div className={"flex flex-row gap-5 ml-auto p-5 mt-auto"}>
                        <UniButton
                            type={ButtonTypes.BASE}
                            text={"ADD"}
                            size={"text-sm xs"}
                            isWide={true}
                            isLarge={true}
                            isDisabled={wallets.length >= maxWallets}
                            handler={() => {
                                openWalletAdd();
                            }}
                        />
                        {wallets.length > 1 && (
                            <UniButton
                                type={ButtonTypes.BASE}
                                text={"REMOVE"}
                                size={"text-sm xs"}
                                isWide={true}
                                isLarge={true}
                                isDisabled={wallets.length === 1}
                                handler={() => {
                                    openWalletRemove();
                                }}
                            />
                        )}
                    </div>
                </div>
            </div>

            <WalletAddModal
                addProps={addProps}
                model={walletAdd}
                setter={async () => {
                    setWalletAdd(false);
                    updateEnvironmentProps([{ path: "walletGuard", value: true }]);
                    // await refreshSession()
                }}
            />
            <WalletRemoveModal
                addProps={addProps}
                model={walletRemove}
                setter={async () => {
                    setWalletRemove(false);
                    updateEnvironmentProps([{ path: "walletGuard", value: true }]);
                    // await refreshSession()
                }}
            />
        </>
    );
}
