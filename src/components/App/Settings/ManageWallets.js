import { useState } from "react";
import { AiOutlineInfoCircle as IconInfo } from "react-icons/ai";
import { ButtonTypes, UniButton } from "@/components/Button/UniButton";
import { ButtonIconSize } from "@/components/Button/RoundButton";
import DynamicIcon from "@/components/Icon";
import { ICONS } from "@/lib/icons";
import WalletRemoveModal from "@/components/App/Settings/WalletRemoveModal";
import { IconButton } from "@/components/Button/IconButton";
import { useEnvironmentContext } from "@/lib/context/EnvironmentContext";
import { getTenantConfig } from "@/lib/tenantHelper";

const { externalLinks } = getTenantConfig();

export default function ManageWallets({ walletProps }) {
    const { updateEnvironmentProps } = useEnvironmentContext();
    const { wallets } = walletProps;
    const [walletRemove, setWalletRemove] = useState(false);

    const maxWallets = 2;

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
            <div className="bordered-container boxshadow relative offerWrap flex flex-1 max-w-[600px]">
                <div className="relative bg-navy-accent flex flex-1 flex-col">
                    <div className="font-bold text-2xl flex items-center glowNormal p-5 ">
                        <div className="flex flex-1 font-bold">WALLETS</div>
                        <a href={externalLinks.DELEGATED_ACCESS} target={"_blank"} rel="noreferrer">
                            <IconButton
                                zoom={1.1}
                                size={"w-8"}
                                icon={<IconInfo className="h-8 w-8" />}
                                noBorder={true}
                            />
                        </a>
                    </div>
                    <div>
                        <table>
                            <thead className="card-table-header">
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
