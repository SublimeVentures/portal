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
import { reserveMysterybox } from "@/fetchers/mysterbox.fetcher";

const isNetworkAvailable = tenantIndex !== TENANT.basedVC;

export const blockchainPrerequisite = async (params) => {
    const { tenant, network, amount, contract } = params;
    const { chainId } = network;
    const transaction = await reserveMysterybox({ tenant, chainId, network, amount, contract });
    if (transaction.ok) {
        return {
            ok: true,
            data: transaction,
        };
    } else {
        return {
            ok: false,
            error: "Error generating hash",
        };
    }
};

const ModalContent = ({ order, transactionSuccessful, setTransactionSuccessful, onClose, open, userId }) => {
    const { account, activeDiamond, network, getCurrencyStore } = useEnvironmentContext();

    const [selectedCurrency, setSelectedCurrency] = useState({});
    const dropdownCurrencyOptions = getCurrencyStore();

    useEffect(() => {
        if (dropdownCurrencyOptions[0]) {
            setSelectedCurrency(dropdownCurrencyOptions[0]);
        }
    }, [network.chainId]);

    useEffect(() => {
        const value = dropdownCurrencyOptions[0]?.symbol || "";
        const isValidCurrency = value && value !== "...";

        if (!selectedCurrency & isValidCurrency) {
            setSelectedCurrency(value);
        }
    }, [dropdownCurrencyOptions]);

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

                userId,
                prerequisiteTextWaiting: "Sign transaction",
                prerequisiteTextProcessing: "Signing transaction",
                prerequisiteTextSuccess: "Signing transaction obtained",
                prerequisiteTextError: "Couldn't sign transaction",
            },
            token,
            setTransactionSuccessful,
        };
    }, [open, activeDiamond, order.price, selectedCurrency?.contract, price, amount]);

    const { getBlockchainStepButtonProps, getBlockchainStepsProps } = useBlockchainStep({
        data: blockchainInteractionData,
        deps: [open],
    });

    const contentSuccess = () => {
        return (
            <Success.Content>
                <Success.Kicker>Success!</Success.Kicker>
                <Success.Title>Thank you for purchasing</Success.Title>
                <Success.Description>
                    Open your {order.name} to see what treasures you have discovered. Save your redemption code to claim
                    your treasures.
                </Success.Description>
                <Success.Article>
                    <div className="flex items-center gap-5 grow w-full md:w-auto">
                        <Success.Image src="/img/icon-chest.webp" alt={order.name} />
                        <div className="grow">
                            <h1 className="text-sm font-medium md:text-xl">{order.name}</h1>
                            <span className="text-xs font-light md:text-sm">Mystery Box</span>
                        </div>
                    </div>
                    <Button className="w-full md:w-auto" onClick={onClose}>
                        Mystery Box
                    </Button>
                </Success.Article>
                <Success.Footer>You can find your Mystery Box in Mystery Box page</Success.Footer>
            </Success.Content>
        );
    };

    const contentSteps = () => {
        return (
            <>
                <Image
                    src="/img/mysterybox.webp"
                    alt={order.name}
                    placeholder="blur"
                    blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEASABIAAD/4QCgRXhpZgAATU0AKgAAAAgABQEaAAUAAAABAAAASgEbAAUAAAABAAAAUgEoAAMAAAABAAIAAAEyAAIAAAAUAAAAWodpAAQAAAABAAAAbgAAAAAAAABIAAAAAQAAAEgAAAABMjAyNDowOTowMiAxNToyNDowNQAAA6ABAAMAAAABAAEAAKACAAMAAAABAAoAAKADAAMAAAABAAoAAAAAAAD/4QtCaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wLwA8P3hwYWNrZXQgYmVnaW49Iu+7vyIgaWQ9Ilc1TTBNcENlaGlIenJlU3pOVGN6a2M5ZCI/PiA8eDp4bXBtZXRhIHhtbG5zOng9ImFkb2JlOm5zOm1ldGEvIiB4OnhtcHRrPSJYTVAgQ29yZSA1LjUuMCI+IDxyZGY6UkRGIHhtbG5zOnJkZj0iaHR0cDovL3d3dy53My5vcmcvMTk5OS8wMi8yMi1yZGYtc3ludGF4LW5zIyI+IDxyZGY6RGVzY3JpcHRpb24gcmRmOmFib3V0PSIiIHhtbG5zOnBob3Rvc2hvcD0iaHR0cDovL25zLmFkb2JlLmNvbS9waG90b3Nob3AvMS4wLyIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RFdnQ9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZUV2ZW50IyIgcGhvdG9zaG9wOkNvbG9yTW9kZT0iMyIgcGhvdG9zaG9wOklDQ1Byb2ZpbGU9InNSR0IgSUVDNjE5NjYtMi4xIiB4bXA6TW9kaWZ5RGF0ZT0iMjAyNC0wOS0wMlQxNToyNDowNSswMjowMCIgeG1wOk1ldGFkYXRhRGF0ZT0iMjAyNC0wOS0wMlQxNToyNDowNSswMjowMCI+IDx4bXBNTTpIaXN0b3J5PiA8cmRmOlNlcT4gPHJkZjpsaSBzdEV2dDphY3Rpb249InByb2R1Y2VkIiBzdEV2dDpzb2Z0d2FyZUFnZW50PSJBZmZpbml0eSBQaG90byAyIDIuNS41IiBzdEV2dDp3aGVuPSIyMDI0LTA5LTAyVDE1OjI0OjA1KzAyOjAwIi8+IDwvcmRmOlNlcT4gPC94bXBNTTpIaXN0b3J5PiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8P3hwYWNrZXQgZW5kPSJ3Ij8+/+0ALFBob3Rvc2hvcCAzLjAAOEJJTQQlAAAAAAAQ1B2M2Y8AsgTpgAmY7PhCfv/iAmRJQ0NfUFJPRklMRQABAQAAAlRsY21zBDAAAG1udHJSR0IgWFlaIAfoAAkAAgAMAAkAJGFjc3BBUFBMAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD21gABAAAAANMtbGNtcwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAC2Rlc2MAAAEIAAAAPmNwcnQAAAFIAAAATHd0cHQAAAGUAAAAFGNoYWQAAAGoAAAALHJYWVoAAAHUAAAAFGJYWVoAAAHoAAAAFGdYWVoAAAH8AAAAFHJUUkMAAAIQAAAAIGdUUkMAAAIQAAAAIGJUUkMAAAIQAAAAIGNocm0AAAIwAAAAJG1sdWMAAAAAAAAAAQAAAAxlblVTAAAAIgAAABwAcwBSAEcAQgAgAEkARQBDADYAMQA5ADYANgAtADIALgAxAABtbHVjAAAAAAAAAAEAAAAMZW5VUwAAADAAAAAcAE4AbwAgAGMAbwBwAHkAcgBpAGcAaAB0ACwAIAB1AHMAZQAgAGYAcgBlAGUAbAB5WFlaIAAAAAAAAPbWAAEAAAAA0y1zZjMyAAAAAAABDEIAAAXe///zJQAAB5MAAP2Q///7of///aIAAAPcAADAblhZWiAAAAAAAABvoAAAOPUAAAOQWFlaIAAAAAAAACSfAAAPhAAAtsNYWVogAAAAAAAAYpcAALeHAAAY2XBhcmEAAAAAAAMAAAACZmYAAPKnAAANWQAAE9AAAApbY2hybQAAAAAAAwAAAACj1wAAVHsAAEzNAACZmgAAJmYAAA9c/9sAQwABAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEB/9sAQwEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEB/8AAEQgACgAKAwERAAIRAQMRAf/EABQAAQAAAAAAAAAAAAAAAAAAAAn/xAAgEAACAwEAAgIDAAAAAAAAAAABBAIDBQYHEQAIIVGR/8QAGAEBAAMBAAAAAAAAAAAAAAAABgMEBQf/xAAnEQADAQABAwQABwEAAAAAAAABAgMEBRESIQAGBxMIFCIjMUFCYf/aAAwDAQACEQMRAD8AF3V8kfVHzzg1999yd3oa/JGZzLamw7zOL1m323e7dMa0+f1di3Q6jJ4ulbF5ykIrRxjjllnLzIawdcZ1LhL8r8l8lZd6y9k4OLb7W49Bu5fTL6WCYYHYnYqmke+zzCVK6qAjWPy01TK9S/4ePaPxdxPtfLLn7cqwW/OWrj4t9KiSaOc3vic0uL/Y6SVvsjOMImVMrJqrQ6UkKIyUiAYVynEgGMzG8GcSPYkRGUgDIej6EpAe/QJH5+LDfjiSa7xOpP7k1rDtnT/aDukG6K3VR3AN0HkdfWt2c6v6c3DWtnHjPZp1DViPEqMF0lQzp2sQpKgnwenpHmsvM1/onh9zrZyOp2uhuUov9hoqLu9S8ks7vJrqOdAzXbrMq0KJpq0r3NzqqWVWohCNVFUY831aNFffWbLW9qZUxXdM1Ku8EdEmEZYsxmrIPCsFBUeAQPS7FlzYvam18eeGRzsRS+aM4MVoWpRS0lQkUoS7jr0ZyWbqST6LD0P0P4Pi/wBU1J7R5P8AA/v/AJ6//9k="
                />
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
                    <BlockchainSteps {...getBlockchainStepsProps()} />
                    <ModalButton className="w-full mt-4" {...getBlockchainStepButtonProps()} />
                </Content>
            </>
        );
    };
    return transactionSuccessful ? contentSuccess() : contentSteps();
};

export default function BuyMysteryBoxModal({ onClose, open, buyModalProps, userId }) {
    const [transactionSuccessful, setTransactionSuccessful] = useState(false);

    const handleClose = () => {
        onClose();
        buyModalProps?.setOrder(null);
        setTransactionSuccessful(false);
    };

    return (
        <Modal
            open={open}
            onClose={handleClose}
            variant={transactionSuccessful ? "pattern" : "default"}
            forceMount={true}
        >
            <ModalContent
                {...buyModalProps}
                userId={userId}
                transactionSuccessful={transactionSuccessful}
                setTransactionSuccessful={setTransactionSuccessful}
                open={open}
                onClose={handleClose}
            />
        </Modal>
    );
}
