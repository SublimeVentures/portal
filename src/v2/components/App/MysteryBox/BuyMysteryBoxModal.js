import { useEffect, useState, useMemo } from "react";
import { tenantIndex } from "@/lib/utils";
import { useEnvironmentContext } from "@/lib/context/EnvironmentContext";
import { METHOD } from "@/components/BlockchainSteps/utils";
import useGetToken from "@/lib/hooks/useGetToken";
import { TENANT } from "@/lib/tenantHelper";

import BlockchainSteps from "@/v2/components/BlockchainSteps";
import Modal, {
    Image,
    Content,
    Title,
    Description,
    Grid,
    Button as ModalButton,
    Label,
    SelectCurrency,
    Kicker,
} from "@/v2/modules/upgrades/Modal";
import { Input } from "@/v2/components/ui/input";
import useBlockchainStep from "@/v2/components/BlockchainSteps/useBlockchainStep";
import Success from "@/v2/modules/upgrades/Success";
import { Button } from "@/v2/components/ui/button";

const isNetworkAvailable = tenantIndex !== TENANT.basedVC;

export default function BuyMysteryBoxModal({ model, setter, buyModalProps }) {
    const { order, setOrder } = buyModalProps;

    const { account, activeDiamond, network, getCurrencyStore } = useEnvironmentContext();
    const [transactionSuccessful, setTransactionSuccessful] = useState(false);

    const [selectedCurrency, setSelectedCurrency] = useState({});
    const dropdownCurrencyOptions = getCurrencyStore();

    useEffect(() => {
        if (dropdownCurrencyOptions[0]) {
            setSelectedCurrency(dropdownCurrencyOptions[0]);
        }
    }, [network.chainId]);

    const closeModal = () => {
        setter();
        setTimeout(() => {
            setOrder(null);
            setTransactionSuccessful(false);
        }, 400);
    };

    const token = useGetToken(selectedCurrency?.contract);

    const [amount, setAmount] = useState(1);
    const price = order?.price * amount;

    const blockchainInteractionData = useMemo(() => {
        return {
            steps: {
                network: isNetworkAvailable,
                liquidity: true,
                allowance: true,
                transaction: true,
            },
            params: {
                requiredNetwork: selectedCurrency.chainId,
                account: account.address,
                buttonText: "Buy Mystery Box",
                liquidity: Number(price),
                allowance: Number(price),
                amount: amount,
                spender: activeDiamond,
                contract: activeDiamond,
                transactionType: METHOD.MYSTERYBOX,
            },
            token,
            setTransactionSuccessful,
        };
    }, [model, activeDiamond, order.price, selectedCurrency?.contract, price, amount]);

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
                    <div className="flex items-center gap-5 grow w-full 3xl:w-auto">
                        <Success.Image src="/img/icon-chest.webp" alt={order.name} />
                        <div className="grow">
                            <h1 className="text-[14px] 3xl:text-2xl">{order.name}</h1>
                            <span className="text-[12px] 3xl:text-md">Mystery Box</span>
                        </div>
                    </div>
                    <Button className="w-full 3xl:w-auto" onClick={closeModal}>
                        Check inventory
                    </Button>
                </Success.Article>
                <Success.Footer>You can find your upgrade in your inventory</Success.Footer>
            </Success.Content>
        );
    };
    const contentSteps = () => {
        return (
            <>
                <Image src="/img/modal-mystery-box.webp" alt={order.name} />
                <Content>
                    <Kicker>Mystery Box</Kicker>
                    <Title className="text-primary">{order.name}</Title>
                    <Description>{order.description}</Description>
                    <Grid>
                        <div className="col-span-2">
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
                            <Label>Select token</Label>
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
                    {model && <BlockchainSteps {...getBlockchainStepsProps()} />}
                    <ModalButton className="w-full mt-4" {...getBlockchainStepButtonProps()} />
                </Content>
            </>
        );
    };

    const content = () => {
        return transactionSuccessful ? contentSuccess() : contentSteps();
    };

    return (
        <Modal open={model} onClose={closeModal} variant={transactionSuccessful ? "pattern" : "default"}>
            {content()}
        </Modal>
    );
}
