import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { useQueryClient } from "@tanstack/react-query";
import { useEnvironmentContext } from "@/lib/context/EnvironmentContext";
import BlockchainSteps from "@/v2/components/BlockchainSteps";
import useGetToken from "@/lib/hooks/useGetToken";
import { METHOD } from "@/components/BlockchainSteps/utils";
import { tenantIndex } from "@/lib/utils";
import { TENANT } from "@/lib/tenantHelper";
import useBlockchainStep from "@/v2/components/BlockchainSteps/useBlockchainStep";
import { SelectSimple as Select, SelectItem as Option } from "@/v2/components/ui/select";
import { Input } from "@/v2/components/ui/input";
import { cn } from "@/lib/cn";
import { Button } from "@/v2/components/ui/button";
import Modal, {
    Image,
    Content,
    Title,
    Description,
    Grid,
    Button as ModalButton,
    Label,
    Kicker,
    SelectCurrency,
} from "@/v2/modules/upgrades/Modal";
import Success from "@/v2/modules/upgrades/Success";
import PAGE from "@/routes";

const isBaseVCTenant = tenantIndex === TENANT.basedVC;

const UpgradeSymbol = ({ className }) => (
    <span className={cn("rounded-full size-4 inline-block shrink-0", className)}></span>
);

const ModalContent = ({ onClose, order, model, transactionSuccessful, setTransactionSuccessful }) => {
    const { getCurrencyStore, account, activeDiamond, network, cdn } = useEnvironmentContext();

    const [selectedCurrency, setSelectedCurrency] = useState({});
    const [amount, setAmount] = useState(1);
    const price = order?.price * amount;
    const dropdownCurrencyOptions = getCurrencyStore();

    useEffect(() => {
        setSelectedCurrency(dropdownCurrencyOptions[0]);
    }, [network.chainId]);

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
            <Success.Content>
                <Success.Kicker>Success!</Success.Kicker>
                <Success.Title>Thank you for purchasing</Success.Title>
                <Success.Description>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore
                    et dolore magna aliqua.
                </Success.Description>
                <Success.Article>
                    <div className="flex items-center gap-5 grow w-full md:w-auto">
                        <Success.Image src={`${cdn}/webapp/store/${order.img}`} alt={order.name} />
                        <div className="grow">
                            <h1 className="text-sm font-medium md:text-xl">{order.name}</h1>
                            <span className="text-xs font-light md:text-sm">Upgrade</span>
                        </div>
                    </div>
                    <Button className="w-full md:w-auto" variant={order.id === 1 ? "accent" : "default"} asChild>
                        <Link href={PAGE.Upgrades} onClick={onClose}>
                            Upgrades store
                        </Link>
                    </Button>
                </Success.Article>
                <Success.Footer>You can find your upgrade in your vault</Success.Footer>
            </Success.Content>
        );
    };
    const contentSteps = () => {
        return (
            <>
                <Image
                    src={order.id === 1 ? "/img/upgrade/guaranteed.jpg" : "/img/upgrade/increased.jpg"}
                    alt={order.name}
                />
                <Content>
                    <Kicker>Upgrade</Kicker>
                    <Title
                        className={cn({
                            "text-accent": order.id === 1,
                            "text-primary": order.id === 2,
                        })}
                    >
                        {order.name}
                    </Title>
                    <Description>{order.description}</Description>
                    <Grid>
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
                            <SelectCurrency
                                placeholder="Select currency"
                                onChange={setSelectedCurrency}
                                value={selectedCurrency}
                                size="sm"
                                options={dropdownCurrencyOptions}
                            />
                        </div>
                        <div>
                            <Label>Total</Label>
                            <Input readOnly className="w-full text-center" value={price} size="sm" />
                        </div>
                    </Grid>
                    <BlockchainSteps {...getBlockchainStepsProps()} />
                    <ModalButton
                        className="w-full mt-4"
                        variant={order.id === 1 ? "accent" : "default"}
                        {...getBlockchainStepButtonProps()}
                    />
                </Content>
            </>
        );
    };
    return transactionSuccessful ? contentSuccess() : contentSteps();
};

export default function BuyStoreItemModal({ model, setter, buyModalProps }) {
    const client = useQueryClient();
    const [transactionSuccessful, setTransactionSuccessful] = useState(false);
    const closeModal = () => {
        setter();
        setTransactionSuccessful(false);
    };

    const refetchBanner = async () => {
        const data = await client.refetchQueries({ queryKey: ["store-items", "owned"] });
        return data;
    };

    if (transactionSuccessful) {
        refetchBanner();
    }
    return (
        <Modal open={model} onClose={closeModal} variant={transactionSuccessful ? "pattern" : "default"}>
            <ModalContent
                onClose={closeModal}
                {...buyModalProps}
                model={model}
                transactionSuccessful={transactionSuccessful}
                setTransactionSuccessful={setTransactionSuccessful}
            />
        </Modal>
    );
}
