import moment from "moment";
import { useEffect, useState, Fragment } from "react";
import { Transition } from "@headlessui/react";
import debounce from "lodash.debounce";
import { IoCloseCircleOutline as IconCancel } from "react-icons/io5";
import { ButtonIconSize } from "@/components/Button/RoundButton";
import "@leenguyen/react-flip-clock-countdown/dist/index.css";
import { PhaseId } from "@/lib/phases";
import { fetchHash } from "@/fetchers/invest.fetcher";
import ErrorModal from "@/components/App/Offer/ErrorModal";
import UpgradesModal from "@/components/App/Offer/UpgradesModal";
import InvestModal from "@/components/App/Offer/InvestModal";
import RestoreHashModal from "@/components/App/Offer/RestoreHashModal";
import CalculateModal from "@/components/App/Offer/CalculateModal";
import Dropdown from "@/components/App/Dropdown";
import { ButtonTypes, UniButton } from "@/components/Button/UniButton";
import { checkIfNumberKey, tenantIndex } from "@/lib/utils";
import { IconButton } from "@/components/Button/IconButton";
import { Tooltiper, TooltipType } from "@/components/Tooltip";
import { buttonInvestState, tooltipInvestState, userInvestmentState } from "@/lib/investment";
import Linker from "@/components/link";
import { ExternalLinks } from "@/routes";
import { useEnvironmentContext } from "@/lib/context/EnvironmentContext";
import DynamicIcon from "@/components/Icon";
import { ICONS } from "@/lib/icons";
import { useInvestContext } from "@/components/App/Offer/InvestContext";
import { TENANT } from "@/lib/tenantHelper";

const isBaseVCTenant = tenantIndex === TENANT.basedVC;

export default function OfferDetailsInvestPhases({ paramsInvestPhase }) {
    const {
        offer,
        phaseCurrent,
        session,
        refetchOfferAllocation,
        refetchUserAllocation,
        allocation,
        userInvested,
        userAllocationState,
        upgradesUse,
        premiumData,
        refetchPremiumData,
    } = paramsInvestPhase;
    const { network, getCurrencySettlement } = useEnvironmentContext();
    const { clearBooking, bookingDetails, setBooking, getSavedBooking } = useInvestContext();

    const [isInvestModal, setInvestModal] = useState(false);
    const [isCalculateModal, setCalculateModal] = useState(false);
    const [isUpgradeModal, setUpgradeModal] = useState(false);

    const [isRestoreModal, setRestoreModal] = useState({
        open: false,
        amount: 0,
    });
    const [isErrorModal, setErrorModal] = useState({ open: false, code: null });

    const [investmentAmount, setInvestmentAmount] = useState(0);
    const [investmentAmountFormatted, setInvestmentAmountFormatted] = useState("");
    const [showInputInfo, setShowInputInfo] = useState(false);
    const [showClean, setShowClean] = useState(false);
    const [investButtonDisabled, setInvestButtonDisabled] = useState(false);
    const [isError, setIsError] = useState({});

    const [allocationData, setAllocationData] = useState({
        allocationUser_max: 0,
        allocationUser_min: 0,
        allocationUser_left: 0,
        allocationUser_invested: 0,
        allocationOffer_left: 0,
        allocationUser_guaranteed: 0,
        offer_isProcessing: false,
        offer_isSettled: false,
    });

    const [isButtonLoading, setButtonLoading] = useState(false); //done
    const [investButtonText, setInvestButtonText] = useState("");
    const isStakeLock = session?.stakingEnabled ? !session.isStaked : false;
    const investmentLocked = investButtonDisabled || isStakeLock;

    const displayGuaranteed =
        !!upgradesUse.guaranteedUsed &&
        phaseCurrent.phase != PhaseId.Unlimited &&
        upgradesUse?.guaranteedUsed?.alloUsed != upgradesUse?.guaranteedUsed?.alloMax;

    const [selectedCurrency, setSelectedCurrency] = useState({});
    const dropdownCurrencyOptions = getCurrencySettlement();

    const setValue = (data) => {
        try {
            if (!Number.isInteger(data)) {
                data = data.replace(/[^0-9]/g, "");
            }
            setInvestmentAmount(data);

            let formatted = Number(data).toLocaleString();
            if (formatted == 0) {
                formatted = "";
            }

            setInvestmentAmountFormatted(formatted);
        } catch (error) {
            // Error handling: do nothing or log the error if needed
            console.error("Error in setValue:", error);
        }
    };
    const isInputActive = () => {
        return investmentAmount > 0;
    };
    const onInputChange = (event) => {
        setValue(event.target.value);
    };
    const getInvestmentButtonIcon = () => {
        switch (phaseCurrent.phase) {
            case PhaseId.Pending: {
                return <DynamicIcon name={ICONS.WAIT} style={ButtonIconSize.invest} fill={"white"} />;
            }
            case PhaseId.Open:
            case PhaseId.FCFS:
            case PhaseId.Unlimited: {
                return <DynamicIcon name={ICONS.WHALE} style={ButtonIconSize.invest} />;
            }
            case PhaseId.Closed: {
                return <DynamicIcon name={ICONS.LOCK} style={ButtonIconSize.invest} />;
            }
        }
    };

    const openInvestmentModal = () => {
        if (isStakeLock) {
            return;
        }
        setInvestModal(true);
    };

    const startInvestmentProcess = async () => {
        if (
            (investmentAmount > 0 &&
                allocationData.allocationUser_max > 0 &&
                allocationData.allocationUser_min > 0 &&
                allocationData.allocationUser_left > 0 &&
                investmentAmount <= allocationData.allocationUser_left) ||
            userInvested?.invested.total - userInvested?.invested.invested > 0
        ) {
            setButtonLoading(true);
            const response = await fetchHash(offer.id, investmentAmount, selectedCurrency?.contract, network.chainId);
            if (!response.ok) {
                await clearBooking();
                setErrorModal({ open: true, code: response.code });
                refetchOfferAllocation();
            } else if (response.hash?.length > 5) {
                const confirmedAmount = Number(response.amount);
                setValue(confirmedAmount);
                setBooking(response);
                openInvestmentModal();
            }
            setButtonLoading(false);
        }
    };

    const processExistingSession = async () => {
        setButtonLoading(true);
        try {
            const savedTimestamp = bookingDetails.expires;
            const savedAmount = bookingDetails.amount;
            if (savedTimestamp < moment.utc().unix()) {
                clearBooking();
                await startInvestmentProcess();
            } else if (savedAmount === Number(investmentAmount)) {
                openInvestmentModal();
            } else {
                console.log("restore ", savedAmount);
                setRestoreModal({
                    open: true,
                    amount: savedAmount,
                });
            }
        } catch (e) {
            await clearBooking();
            await startInvestmentProcess();
        }
        setButtonLoading(false);
    };

    const makeInvestment = async () => {
        const test = getSavedBooking();
        if (getSavedBooking().ok) {
            await processExistingSession();
        } else {
            await startInvestmentProcess();
        }
    };

    const debouncedMakeInvestment = debounce(makeInvestment, 5000, {
        leading: true,
        trailing: false,
    });

    const bookingRestore = async () => {
        const amount = getSavedBooking().amount;
        setRestoreModal({ open: false, amount: amount });
        setValue(amount);
        openInvestmentModal();
    };

    const bookingCreateNew = async () => {
        setButtonLoading(true);
        setRestoreModal({ open: false, amount: 0 });
        clearBooking();
        await startInvestmentProcess();
    };

    const bookingExpire = async () => {
        setRestoreModal({ open: false, amount: 0 });
        setInvestModal(false);
        await afterInvestmentCleanup();
    };

    const afterInvestmentCleanup = async () => {
        setButtonLoading(true);
        clearBooking();
        await Promise.all([refetchUserAllocation(), refetchOfferAllocation()]);

        setButtonLoading(false);
    };

    useEffect(() => {
        setSelectedCurrency(dropdownCurrencyOptions[0]);
    }, [network?.chainId]);

    useEffect(() => {
        if (allocationData?.allocationUser_min) {
            setValue(allocationData.allocationUser_min);
        } else {
            setValue(offer.alloMin);
        }
    }, [allocationData?.allocationUser_min]);

    useEffect(() => {
        if (showInputInfo) {
            setShowClean(showInputInfo);
        } else {
            setTimeout(() => {
                setShowClean(showInputInfo);
            }, 500);
        }
    }, [showInputInfo]);

    useEffect(() => {
        if (!offer) return;
        const allocations = userInvestmentState(
            session,
            offer,
            phaseCurrent,
            upgradesUse,
            userInvested?.invested?.total,
            allocation ? allocation : {},
        );
        setAllocationData({ ...allocations });
        const { allocation: allocationIsValid, message } = tooltipInvestState(offer, allocations, investmentAmount);
        setIsError({ state: !allocationIsValid, msg: message });
        const { isDisabled, text } = buttonInvestState(
            allocation ? allocation : {},
            phaseCurrent,
            investmentAmount,
            allocationIsValid,
            allocations,
            isStakeLock,
            userInvested?.invested,
        );

        setInvestButtonDisabled(isDisabled);
        setInvestButtonText(text);
    }, [
        allocation?.alloFilled,
        allocation?.alloRes,
        upgradesUse?.increasedUsed?.amount,
        upgradesUse?.guaranteedUsed?.amount,
        upgradesUse?.guaranteedUsed?.alloUsed,
        userInvested?.invested?.total,
        investmentAmount,
        phaseCurrent?.phase,
    ]);

    const restoreModalProps = {
        allocationOld: isRestoreModal.amount,
        investmentAmount,
        bookingExpire,
        bookingRestore,
        bookingCreateNew,
    };
    const errorModalProps = {
        code: isErrorModal.code,
    };
    const upgradesModalProps = {
        phaseCurrent,
        offer: offer,
        refetchUserAllocation,
        userAllocationState,
        upgradesUse,
        premiumData,
        refetchPremiumData,
        allocationUserLeft: allocationData.allocationUser_left,
    };
    const calculateModalProps = {
        investmentAmount,
        allocationData,
        offer,
    };
    const investModalProps = {
        investmentAmount,
        offer,
        selectedCurrency,
        bookingExpire,
        afterInvestmentCleanup,
    };

    return (
        <div className="flex flex-1 flex-col items-center justify-center relative">
            <div className={"absolute right-5 top-5"}>
                <div className={"flex flex-row items-center text-gold"}>
                    {displayGuaranteed && (
                        <div className={"mr-3 font-bold glow select-none"}>
                            <Tooltiper
                                wrapper={`GUARANTEED`}
                                text={`$${allocationData.allocationUser_guaranteed} left`}
                                type={TooltipType.Primary}
                            />
                        </div>
                    )}
                    <div className="flex gap-2 flex-row justify-center align-center items-center">
                        <IconButton
                            zoom={1.1}
                            size="w-12 p-3"
                            noBorder={!isBaseVCTenant}
                            icon={<DynamicIcon name={ICONS.CALCULATOR} style="background-text-dedicated" />}
                            handler={() => setCalculateModal(true)}
                        />
                        {!offer?.isLaunchpad && (
                            <IconButton
                                zoom={1.1}
                                size="w-12 p-3"
                                noBorder={!isBaseVCTenant}
                                icon={<DynamicIcon name={ICONS.DIAMOND} style="background-text-dedicated" />}
                                handler={() => setUpgradeModal(true)}
                            />
                        )}
                    </div>
                </div>
            </div>
            <div className="lg:mt-auto">
                <div className="currency-input-group relative mt-20 ">
                    <div className={`relative centr ${investmentAmount > 0 ? "active" : ""}`}>
                        <label className="absolute text-accent block">Investment size</label>
                        <input
                            tabIndex="0"
                            value={investmentAmountFormatted}
                            onChange={onInputChange}
                            onKeyDown={checkIfNumberKey}
                            onFocus={() => setShowInputInfo(true)}
                            onBlur={() => setShowInputInfo(false)}
                            className={`h-17 text-xl px-4 ${isInputActive ? "highlight" : ""} ${investmentAmount >= allocationData.allocationUser_min && investmentAmount <= allocationData.allocationUser_max ? "valid" : ""} ${investmentAmount < allocationData.allocationUser_min || investmentAmount > allocationData.allocationUser_max ? "invalid" : ""}`}
                        />

                        <Transition appear show={showClean} as={Fragment}>
                            <Transition.Child
                                as={Fragment}
                                enter="ease-out duration-300"
                                enterFrom="opacity-0"
                                enterTo="opacity-100"
                                leave="ease-in duration-200"
                                leaveFrom="opacity-100"
                                leaveTo="opacity-0"
                            >
                                <div
                                    className="absolute top-5 right-5 cursor-pointer "
                                    onClick={() => {
                                        setValue(allocationData.allocationUser_min);
                                    }}
                                >
                                    <IconCancel className="w-6 h-6 opacity-70" />
                                </div>
                            </Transition.Child>
                        </Transition>
                    </div>
                    <Dropdown
                        options={dropdownCurrencyOptions}
                        selector={"symbol"}
                        classes={"customSize"}
                        propSelected={setSelectedCurrency}
                    />
                    <Transition appear show={showInputInfo} as={Fragment}>
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0"
                            enterTo="opacity-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100"
                            leaveTo="opacity-0"
                        >
                            <div
                                className={`select-none absolute px-4 py-2 status text-sm ${isError?.state ? "error" : ""}`}
                            >
                                {isError?.msg}
                            </div>
                        </Transition.Child>
                    </Transition>
                </div>
            </div>
            <div className={"text-app-success text-center min-h-[68px] py-5 px-2"}>
                {allocationData.offer_isProcessing && allocationData.allocationUser_guaranteed === 0 && (
                    <div>
                        All spots booked! Awaiting blockchain confirmations. <br />
                        <Linker url={ExternalLinks.LOOTBOX} text={"Check back soon."} />
                    </div>
                )}
            </div>
            <div className="flex flex-row flex-wrap justify-center gap-2 pb-10 px-2 items-center">
                <div className={investmentLocked ? "disabled" : ""}>
                    <UniButton
                        type={ButtonTypes.BASE}
                        text={investButtonText}
                        isPrimary={true}
                        state={"success"}
                        showParticles={true}
                        isLoading={isButtonLoading}
                        is3d={true}
                        isWide={true}
                        zoom={1.1}
                        handler={debouncedMakeInvestment}
                        size={"text-sm sm"}
                        icon={getInvestmentButtonIcon()}
                    />
                </div>
                {investmentLocked && userInvested?.invested.total - userInvested?.invested.invested > 0 && (
                    <UniButton
                        type={ButtonTypes.BASE}
                        text={"Restore"}
                        isPrimary={true}
                        state={"success"}
                        showParticles={true}
                        isLoading={isButtonLoading}
                        is3d={true}
                        isWide={true}
                        zoom={1.1}
                        handler={debouncedMakeInvestment}
                        size={"text-sm sm"}
                        icon={getInvestmentButtonIcon()}
                    />
                )}
            </div>

            <CalculateModal
                calculateModalProps={calculateModalProps}
                model={isCalculateModal}
                setter={() => {
                    setCalculateModal(false);
                }}
            />
            <UpgradesModal
                upgradesModalProps={upgradesModalProps}
                model={isUpgradeModal}
                setter={() => {
                    setUpgradeModal(false);
                }}
            />
            <RestoreHashModal
                restoreModalProps={restoreModalProps}
                model={isRestoreModal.open}
                setter={() => {
                    setRestoreModal({ open: false, amount: 0 });
                }}
            />
            <ErrorModal
                errorModalProps={errorModalProps}
                model={isErrorModal.open}
                setter={() => {
                    setErrorModal({ open: false, code: null });
                }}
            />
            {network?.isSupported && selectedCurrency && (
                <InvestModal
                    investModalProps={investModalProps}
                    model={isInvestModal}
                    setter={() => {
                        setInvestModal(false);
                    }}
                />
            )}
        </div>
    );
}
