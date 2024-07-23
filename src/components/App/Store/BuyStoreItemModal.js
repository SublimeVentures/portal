import { useEffect, useState, useMemo } from "react";
import Lottie from "lottie-react";
import { useRouter } from "next/router";
import Image from "next/image";
import GenericModal from "@/components/Modal/GenericModal";
import PAGE, { ExternalLinks } from "@/routes";
import Linker from "@/components/link";
import { ButtonTypes, UniButton } from "@/components/Button/UniButton";
import lottieSuccess from "@/assets/lottie/success.json";
import Dropdown from "@/components/App/Dropdown";
import { useEnvironmentContext } from "@/lib/context/EnvironmentContext";
import BlockchainSteps from "@/v2/components/BlockchainSteps";
import useGetToken from "@/lib/hooks/useGetToken";
import { METHOD } from "@/components/BlockchainSteps/utils";
import { tenantIndex } from "@/lib/utils";
import { TENANT } from "@/lib/tenantHelper";
import { Dialog, DialogContent } from "@/v2/components/ui/dialog";
import useBlockchainStep from "@/v2/components/BlockchainSteps/useBlockchainStep";
import BlockchainStepButton from "@/v2/components/BlockchainSteps/BlockchainStepButton";
import { Label } from "@/v2/components/ui/label";
import { SelectSimple as Select, SelectItem as Option } from "@/v2/components/ui/select";
import { Input } from "@/v2/components/ui/input";
import { cn } from "@/lib/cn";
import USDCIcon from "@/v2/assets/svg/usdc.svg";
import USDTIcon from "@/v2/assets/svg/usdt.svg";

const isBaseVCTenant = tenantIndex === TENANT.basedVC;

const UpgradeSymbol = ({ className }) => (
    <span className={cn("rounded-full size-4 inline-block mr-3 align-text-top", className)}></span>
);

const UpgradeCurrency = ({ className, icon: Icon }) => (
    <span className={cn("rounded size-4 inline-block mr-3 align-text-top p-0.5", className)}>
        <Icon />
    </span>
);

const CURRENCY_ICON = {
    USDC: USDCIcon,
    USDT: USDTIcon,
};

const CURRENCY_BG_COLOR = {
    USDC: "bg-[#2775CA]",
    USDT: "bg-[#53AE94]",
};

const UpgradeCurrencyPicker = ({ symbol }) => {
    return <UpgradeCurrency className={cn(CURRENCY_BG_COLOR[symbol])} icon={CURRENCY_ICON[symbol]} />;
};

export default function BuyStoreItemModal({ model, setter, buyModalProps }) {
    const { order, setOrder } = buyModalProps;
    const router = useRouter();
    const { getCurrencyStore, account, activeDiamond, network } = useEnvironmentContext();
    const [transactionSuccessful, setTransactionSuccessful] = useState(false);

    const [selectedCurrency, setSelectedCurrency] = useState({});
    const dropdownCurrencyOptions = getCurrencyStore();

    useEffect(() => {
        setSelectedCurrency(dropdownCurrencyOptions[0]);
    }, [network.chainId]);

    const closeModal = () => {
        setter();
        setTimeout(() => {
            setOrder(null);
            setTransactionSuccessful(false);
        }, 400);
    };

    const redirect = () => {
        router.push(PAGE.Settings).then((e) => {
            closeModal();
        });
    };

    const token = useGetToken(selectedCurrency?.contract);

    const blockchainInteractionData = useMemo(() => {
        return {
            steps: {
                network: !isBaseVCTenant,
                liquidity: true,
                allowance: true,
                transaction: true,
            },
            params: {
                requiredNetwork: selectedCurrency.chainId,
                account: account.address,
                buttonText: "Buy this upgrade",
                liquidity: Number(order.price),
                allowance: Number(order.price),
                amount: 1,
                upgradeId: order.id,
                spender: activeDiamond,
                contract: activeDiamond,
                transactionType: METHOD.UPGRADE,
            },
            token,
            setTransactionSuccessful,
        };
    }, [model, token?.contract, activeDiamond, selectedCurrency?.contract]);

    const { resetState, getBlockchainStepButtonProps, getBlockchainStepsProps } = useBlockchainStep({
        data: blockchainInteractionData,
    });
    console.log(blockchainInteractionData);
    const title = () => {
        return (
            <>
                {transactionSuccessful ? (
                    <>
                        Transaction <span className="text-app-success">successful</span>
                    </>
                ) : (
                    <>
                        <span className="text-app-success">Buy</span> Upgrade
                    </>
                )}
            </>
        );
    };

    const contentSuccess = () => {
        return (
            <div className=" flex flex-col flex-1">
                <div>
                    Congratulations! You have successfully bought{" "}
                    <span className="text-app-success font-bold">{order.name}</span>.
                </div>
                <Lottie
                    animationData={lottieSuccess}
                    loop={true}
                    autoplay={true}
                    style={{ width: "320px", margin: "30px auto 0px" }}
                />

                <div className="flex flex-1 justify-center items-center py-10 fullWidth">
                    <div className="w-full fullWidth">
                        <UniButton
                            type={ButtonTypes.BASE}
                            text="Check PROFILE"
                            state="danger"
                            isLoading={false}
                            isDisabled={false}
                            is3d={false}
                            isWide={true}
                            zoom={1.1}
                            size="text-sm sm"
                            handler={() => redirect()}
                        />
                    </div>
                </div>
                <div className="mt-auto">
                    What's next? <Linker url={ExternalLinks.UPGRADES} />
                </div>
            </div>
        );
    };
    const contentSteps = () => {
        console.log(dropdownCurrencyOptions);
        return (
            <>
                <h1 className="text-accent text-6xl mb-6">{order.name}</h1>
                <p className="text-md mb-10">{order.description}</p>
                <div className="grid grid-cols-2 gap-5">
                    <div className="">
                        <Label className="block">Upgrade type</Label>
                        <Select placeholder="Select upgrade type" className="flex w-full">
                            <Option value="one">
                                <UpgradeSymbol className="bg-accent" />
                                Guaranted
                            </Option>
                            <Option value="two">
                                <UpgradeSymbol className="bg-primary" />
                                Ungarented
                            </Option>
                        </Select>
                    </div>
                    <div>
                        <Label>Quantitiy</Label>
                    </div>
                    <div>
                        <Label className="block">Price</Label>
                        <Select
                            placeholder="Select currency"
                            className="flex w-full"
                            onChange={setSelectedCurrency}
                            value={selectedCurrency}
                        >
                            {dropdownCurrencyOptions.map((currency) => {
                                return (
                                    <Option value={currency} key={currency.symbol}>
                                        <UpgradeCurrencyPicker symbol={currency.symbol} />
                                        {currency.symbol}
                                    </Option>
                                );
                            })}
                        </Select>
                    </div>
                    <div>
                        <Label className="block">Total</Label>
                        <Input />
                    </div>
                </div>
                {model && <BlockchainSteps {...getBlockchainStepsProps()} />}
                <BlockchainStepButton className="w-full" {...getBlockchainStepButtonProps()} />
            </>
        );
    };

    const content = () => {
        return transactionSuccessful ? contentSuccess() : contentSteps();
    };

    return (
        <Dialog open={model}>
            <DialogContent open={true} className="flex max-w-[950px] gap-13">
                <Image
                    src="/img/upgrade-dialog-premium.png"
                    width={423}
                    height={556}
                    alt="Upgrade"
                    className="-ml-13 -my-8 rounded-l"
                />
                <div className="text-white">
                    {title()}
                    {content()}
                </div>
            </DialogContent>
        </Dialog>
    );
}
