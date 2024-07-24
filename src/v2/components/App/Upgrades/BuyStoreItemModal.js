import { useEffect, useState, useMemo } from "react";
import Image from "next/image";
import { useEnvironmentContext } from "@/lib/context/EnvironmentContext";
import BlockchainSteps from "@/v2/components/BlockchainSteps";
import useGetToken from "@/lib/hooks/useGetToken";
import { METHOD } from "@/components/BlockchainSteps/utils";
import { tenantIndex } from "@/lib/utils";
import { TENANT } from "@/lib/tenantHelper";
import { Dialog, DialogContent } from "@/v2/components/ui/dialog";
import useBlockchainStep from "@/v2/components/BlockchainSteps/useBlockchainStep";
import BlockchainStepButton from "@/v2/components/BlockchainSteps/BlockchainStepButton";
import { Label as FormLabel } from "@/v2/components/ui/label";
import { SelectSimple as Select, SelectItem as Option } from "@/v2/components/ui/select";
import { Input } from "@/v2/components/ui/input";
import { cn } from "@/lib/cn";
import USDCIcon from "@/v2/assets/svg/usdc.svg";
import USDTIcon from "@/v2/assets/svg/usdt.svg";
import { Button } from "@/v2/components/ui/button";

const isBaseVCTenant = tenantIndex === TENANT.basedVC;

const UpgradeSymbol = ({ className }) => (
    <span className={cn("rounded-full size-4 inline-block shrink-0", className)}></span>
);

const UpgradeCurrency = ({ className, icon: Icon }) => (
    <span className={cn("rounded size-5 inline-block p-1 shrink-0", className)}>
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

const Label = ({ children, className }) => (
    <FormLabel className={cn("block text-md leading-5 mb-3", className)}>{children}</FormLabel>
);

const UpgradeButton = ({ run, buttonLock, buttonText, className, variant }) => (
    <Button variant={variant} className={cn(className)} onClick={run} disabled={buttonLock}>
        {buttonText}
    </Button>
);

export default function BuyStoreItemModal({ model, setter, buyModalProps }) {
    const { order, setOrder } = buyModalProps;
    const { getCurrencyStore, account, activeDiamond, network, cdn } = useEnvironmentContext();
    const [transactionSuccessful, setTransactionSuccessful] = useState(false);

    const [selectedCurrency, setSelectedCurrency] = useState({});
    const [amount, setAmount] = useState(1);
    const price = order?.price * amount;
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
                liquidity: Number(price),
                allowance: Number(price),
                amount: amount,
                upgradeId: order.id,
                spender: activeDiamond,
                contract: activeDiamond,
                transactionType: METHOD.UPGRADE,
            },
            token,
            setTransactionSuccessful,
        };
    }, [model, token?.contract, activeDiamond, selectedCurrency?.contract, amount]);

    const { getBlockchainStepButtonProps, getBlockchainStepsProps } = useBlockchainStep({
        data: blockchainInteractionData,
    });

    const contentSuccess = () => {
        return (
            <div className="flex flex-col items-center justify-center">
                <h1 className="text-lg text-center leading-6 mb-3">Success!</h1>
                <p className="text-9xl text-center leading-11 mb-4 font-semibold">Thank you for purchasing</p>
                <p className="text-md text-center leading-6 mb-10 w-8/12">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore
                    et dolore magna aliqua.
                </p>
                <article className="flex bg-white/5 rounded py-3.5 px-5 gap-5 items-center w-8/12 mb-6">
                    <Image
                        src={`${cdn}/webapp/store/${order.img}`}
                        className="rounded size-18"
                        alt={order.name}
                        width={72}
                        height={72}
                    />
                    <div className="grow">
                        <h1 className="text-2xl">{order.name}</h1>
                    </div>
                    <Button variant={order.id === 1 ? "accent" : "default"}>Upgrade store</Button>
                </article>
                <p className="text-md text-white/50 text-center">You can find your upgrade in your inventory</p>
            </div>
        );
    };
    const contentSteps = () => {
        return (
            <>
                <Image
                    src="/img/upgrade-dialog-premium.png"
                    width={423}
                    height={556}
                    alt="Upgrade"
                    className="-ml-13 -my-8 rounded-l"
                />
                <div>
                    <h1
                        className={cn("text-6xl mb-6", {
                            "text-accent": order.id === 1,
                            "text-primary": order.id === 2,
                        })}
                    >
                        {order.name}
                    </h1>
                    <p className="text-md mb-10">{order.description}</p>
                    <div className="grid grid-cols-2 gap-5 mb-6">
                        <div>
                            <Label>Upgrade type</Label>
                            <Select placeholder="Select upgrade type" className="w-full" value={order.id} size="sm">
                                <Option value={order.id}>
                                    <span className="flex items-center gap-3">
                                        <UpgradeSymbol
                                            className={cn({
                                                "bg-accent": order.id === 1,
                                                "bg-primary": order.id === 2,
                                            })}
                                        />
                                        <span className="overflow-hidden truncate">{order.name}</span>
                                    </span>
                                </Option>
                            </Select>
                        </div>
                        <div>
                            <Label>Quantity</Label>
                            <Input
                                type="number"
                                className="flex w-full"
                                min={1}
                                max={order.availability > 5 ? 5 : order.availability}
                                value={amount}
                                readOnly={order.id === 1}
                                onValueChange={setAmount}
                                size="sm"
                            />
                        </div>
                        <div>
                            <Label>Price</Label>
                            <Select
                                placeholder="Select currency"
                                className="w-full"
                                onChange={setSelectedCurrency}
                                value={selectedCurrency}
                                size="sm"
                            >
                                {dropdownCurrencyOptions.map((currency) => {
                                    return (
                                        <Option value={currency} key={currency.symbol}>
                                            <span className="flex items-center gap-3">
                                                <UpgradeCurrencyPicker symbol={currency.symbol} />
                                                <span className="overflow-hidden truncate">{currency.symbol}</span>
                                            </span>
                                        </Option>
                                    );
                                })}
                            </Select>
                        </div>
                        <div>
                            <Label>Total</Label>
                            <Input readOnly className="w-full text-center" value={price} size="sm" />
                        </div>
                    </div>
                    {model && <BlockchainSteps {...getBlockchainStepsProps()} />}
                    <UpgradeButton
                        className="w-full mt-4"
                        variant={order.id === 1 ? "accent" : "default"}
                        {...getBlockchainStepButtonProps()}
                    />
                </div>
            </>
        );
    };

    const content = () => {
        return transactionSuccessful ? contentSuccess() : contentSteps();
    };

    return (
        <Dialog open={model}>
            <DialogContent
                handleClose={closeModal}
                className={cn("flex max-w-[950px] gap-13 text-white min-h-[556px]")}
                variant={transactionSuccessful ? "pattern" : "default"}
            >
                {content()}
            </DialogContent>
        </Dialog>
    );
}
