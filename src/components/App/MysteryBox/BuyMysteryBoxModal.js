import { useEffect, useState, useMemo } from "react";
import Lottie from "lottie-react";
import { useRouter } from "next/router";
import GenericModal from "@/components/Modal/GenericModal";
import PAGE, { API } from "@/routes";
import Linker from "@/components/link";
import { ButtonTypes, UniButton } from "@/components/Button/UniButton";
import { tenantIndex } from "@/lib/utils";
import lottieSuccess from "@/assets/lottie/success.json";
import Dropdown from "@/components/App/Dropdown";
import { useEnvironmentContext } from "@/lib/context/EnvironmentContext";
import { METHOD } from "@/components/BlockchainSteps/utils";
import useGetToken from "@/lib/hooks/useGetToken";
import BlockchainSteps from "@/components/BlockchainSteps";
import { getTenantConfig, TENANT } from "@/lib/tenantHelper";
import { reserveMysterybox } from "@/fetchers/mysterbox.fetcher";

const isNetworkAvailable = tenantIndex !== TENANT.basedVC;

const { externalLinks } = getTenantConfig();

export const blockchainPrerequisite = async (params) => {
    const { tenant, token, network } = params;
    const { chainId } = network
    const transaction = await reserveMysterybox({ tenant, chainId, token, network });
    if (transaction.ok) {
        return {
            ok: true,
            data: { hash: transaction.hash },
        };
    } else {
        return {
            ok: false,
            error: "Error generating hash",
        };
    }
};

export default function BuyMysteryBoxModal({ model, setter, buyModalProps, userId }) {

    const { order, setOrder } = buyModalProps;
    const router = useRouter();

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

    const redirect = () => {
        router.push(PAGE.Settings).then((e) => {
            closeModal();
        });
    };

    const token = useGetToken(selectedCurrency?.contract);

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
                buttonText: "Buy",
                liquidity: Number(order.price),
                allowance: Number(order.price),
                amount: 1,
                spender: activeDiamond,
                contract: activeDiamond,
                transactionType: METHOD.MYSTERYBOX,

                userId,
                prerequisiteTextWaiting: "Generate hash",
                prerequisiteTextProcessing: "Generating hash",
                prerequisiteTextSuccess: "Hash obtained",
                prerequisiteTextError: "Couldn't generate hash",
            },
            token,
            setTransactionSuccessful,
        };
    }, [model, activeDiamond, order.price, selectedCurrency?.contract]);

    const title = () => {
        return (
            <>
                {transactionSuccessful ? (
                    <>
                        Transaction <span className="text-app-success">successful</span>
                    </>
                ) : (
                    <>
                        <span className="text-app-success">Buy</span> MysteryBox
                    </>
                )}
            </>
        );
    };

    const contentSuccess = () => {
        return (
            <div className="flex flex-col flex-1">
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
                            size={"text-sm sm"}
                            handler={() => redirect()}
                        />
                    </div>
                </div>
                <div className="mt-auto">
                    What's next? <Linker url={externalLinks.LOOTBOX} />
                </div>
            </div>
        );
    };
    const contentSteps = () => {
        return (
            <div className="flex flex-1 flex-col">
                <div className="flex flex-col gap-2 mt-5 page-content-text">
                    <div className="detailRow">
                        <p>Item</p>
                        <hr className="spacer" />
                        <p>{order.name}</p>
                    </div>
                    <div className="detailRow">
                        <p>Total Cost</p>
                        <hr className="spacer" />
                        <div className="font-bold text-gold flex items-center">
                            <span className="mr-2">{order.price}</span>
                            {dropdownCurrencyOptions.length > 1 ? (
                                <Dropdown
                                    options={dropdownCurrencyOptions}
                                    selector="symbol"
                                    propSelected={setSelectedCurrency}
                                    isSmall={true}
                                />
                            ) : (
                                <>{dropdownCurrencyOptions[0]?.symbol}</>
                            )}
                        </div>
                    </div>
                </div>
                {model && <BlockchainSteps data={blockchainInteractionData} />}
            </div>
        );
    };

    const content = () => {
        return transactionSuccessful ? contentSuccess() : contentSteps();
    };

    return (
        <GenericModal isOpen={model} closeModal={closeModal} title={title()} content={content()} persistent={true} />
    );
}
