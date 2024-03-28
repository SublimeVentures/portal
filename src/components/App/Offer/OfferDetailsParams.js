import OfferDetailsProgress from "@/components/App/Offer/OfferDetailsProgress";

export const OfferDetailsParams = ({ paramsParams }) => {
    const { offer, allocation, userInvested, phaseIsClosed } = paramsParams;
    let { ticker, ppu, tge, t_cliff, t_vesting } = offer;
    let { alloTotal } = allocation;
    let { booked, invested } = userInvested;
    const normalized_ppu = Number(ppu)?.toLocaleString();
    const normalized_tge = Number(tge)?.toLocaleString();
    const normalized_tgeDiff = Number((100 * (tge - ppu)) / ppu)?.toLocaleString(undefined, {
        minimumFractionDigits: 2,
    });
    const normalized_total = Number(alloTotal)?.toLocaleString();
    const normalized_invested = Number(invested)?.toLocaleString();
    const normalized_booked = Number(booked)?.toLocaleString();
    const isSoldOut = allocation?.alloFilled >= alloTotal - 50 || phaseIsClosed;

    return (
        <>
            <div className="offerWrap bordered-container font-accent">
                <div className="flex flex-col rounded-xl bg-navy-accent p-6 justify-start flex-1">
                    <div className="uppercase">
                        {isSoldOut ? (
                            <div className={"text-sm bg-app-success w-fit px-2 py-1 rounded-xl text-app-bg"}>
                                Sold out
                            </div>
                        ) : (
                            <div className={"text-sm text-outline"}>Fundraise goal</div>
                        )}
                    </div>
                    <div className="text-5xl font-bold flex flex-1 glow font-light py-2">${normalized_total}</div>

                    <div className="py-2">
                        {/* <OfferDetailsProgress allocations={allocation} isSoldOut={isSoldOut} /> */}
                        <OfferDetailsProgress
                            allocations={{
                                alloFilled: 90000,
                                alloGuaranteed: 5000,
                                alloRes: 5000,
                                alloTotal: 100000,
                                isPaused: false,
                                isRefund: false,
                                isSettled: true,
                            }}
                            isSoldOut={false}
                        />

                        <OfferDetailsProgress
                            allocations={{
                                alloFilled: 50386,
                                alloGuaranteed: 21491,
                                alloRes: 8763,
                                alloTotal: 100000,
                                isPaused: false,
                                isRefund: false,
                                isSettled: true,
                            }}
                            isSoldOut={false}
                        />
                        <OfferDetailsProgress
                            allocations={{
                                alloFilled: 90000,
                                alloGuaranteed: 15000,
                                alloRes: 15000,
                                alloTotal: 100000,
                                isPaused: false,
                                isRefund: false,
                                isSettled: true,
                            }}
                            isSoldOut={false}
                        />
                        <OfferDetailsProgress
                            allocations={{
                                alloFilled: 90000,
                                alloGuaranteed: 10000,
                                alloRes: 0,
                                alloTotal: 100000,
                                isPaused: false,
                                isRefund: false,
                                isSettled: true,
                            }}
                            isSoldOut={false}
                        />
                        <OfferDetailsProgress
                            allocations={{
                                alloFilled: 90000,
                                alloGuaranteed: 0,
                                alloRes: 10000,
                                alloTotal: 100000,
                                isPaused: false,
                                isRefund: false,
                                isSettled: true,
                            }}
                            isSoldOut={false}
                        />
                        <OfferDetailsProgress
                            allocations={{
                                alloFilled: 90000,
                                alloGuaranteed: 10000,
                                alloRes: 10000,
                                alloTotal: 100000,
                                isPaused: false,
                                isRefund: false,
                                isSettled: true,
                            }}
                            isSoldOut={false}
                        />

                        <OfferDetailsProgress
                            allocations={{
                                alloFilled: 10000,
                                alloGuaranteed: 5000,
                                alloRes: 5000,
                                alloTotal: 100000,
                                isPaused: false,
                                isRefund: false,
                                isSettled: true,
                            }}
                            isSoldOut={false}
                        />
                        <OfferDetailsProgress
                            allocations={{
                                alloFilled: 10000,
                                alloGuaranteed: 10000,
                                alloRes: 0,
                                alloTotal: 100000,
                                isPaused: false,
                                isRefund: false,
                                isSettled: true,
                            }}
                            isSoldOut={false}
                        />
                        <OfferDetailsProgress
                            allocations={{
                                alloFilled: 10000,
                                alloGuaranteed: 0,
                                alloRes: 10000,
                                alloTotal: 100000,
                                isPaused: false,
                                isRefund: false,
                                isSettled: true,
                            }}
                            isSoldOut={false}
                        />
                        <OfferDetailsProgress
                            allocations={{
                                alloFilled: 10000,
                                alloGuaranteed: 10000,
                                alloRes: 10000,
                                alloTotal: 100000,
                                isPaused: false,
                                isRefund: false,
                                isSettled: true,
                            }}
                            isSoldOut={false}
                        />
                        <OfferDetailsProgress
                            allocations={{
                                alloFilled: 10000,
                                alloGuaranteed: 15000,
                                alloRes: 15000,
                                alloTotal: 100000,
                                isPaused: false,
                                isRefund: false,
                                isSettled: true,
                            }}
                            isSoldOut={false}
                        />

                        <OfferDetailsProgress
                            allocations={{
                                alloFilled: 85986,
                                alloGuaranteed: 13652,
                                alloRes: 362,
                                alloTotal: 100000,
                                isPaused: true,
                                isRefund: false,
                                isSettled: false,
                            }}
                            isSoldOut={false}
                        />
                        <OfferDetailsProgress
                            allocations={{
                                alloFilled: 35895,
                                alloGuaranteed: 13642,
                                alloRes: 50463,
                                alloTotal: 100000,
                                isPaused: true,
                                isRefund: true,
                                isSettled: true,
                            }}
                            isSoldOut={false}
                        />
                        <OfferDetailsProgress
                            allocations={{
                                alloFilled: 7578,
                                alloGuaranteed: 55809,
                                alloRes: 36613,
                                alloTotal: 100000,
                                isPaused: true,
                                isRefund: true,
                                isSettled: false,
                            }}
                            isSoldOut={true}
                        />
                        <OfferDetailsProgress
                            allocations={{
                                alloFilled: 90594,
                                alloGuaranteed: 2926,
                                alloRes: 6480,
                                alloTotal: 100000,
                                isPaused: false,
                                isRefund: false,
                                isSettled: true,
                            }}
                            isSoldOut={false}
                        />
                        <OfferDetailsProgress
                            allocations={{
                                alloFilled: 17200,
                                alloGuaranteed: 7827,
                                alloRes: 74973,
                                alloTotal: 100000,
                                isPaused: false,
                                isRefund: true,
                                isSettled: false,
                            }}
                            isSoldOut={true}
                        />
                        <OfferDetailsProgress
                            allocations={{
                                alloFilled: 99472,
                                alloGuaranteed: 358,
                                alloRes: 170,
                                alloTotal: 100000,
                                isPaused: false,
                                isRefund: true,
                                isSettled: true,
                            }}
                            isSoldOut={false}
                        />
                        <OfferDetailsProgress
                            allocations={{
                                alloFilled: 45000,
                                alloGuaranteed: 15000,
                                alloRes: 40000,
                                alloTotal: 100000,
                                isPaused: true,
                                isRefund: false,
                                isSettled: true,
                            }}
                            isSoldOut={false}
                        />
                        <OfferDetailsProgress
                            allocations={{
                                alloFilled: 60000,
                                alloGuaranteed: 20000,
                                alloRes: 20000,
                                alloTotal: 100000,
                                isPaused: true,
                                isRefund: true,
                                isSettled: false,
                            }}
                            isSoldOut={true}
                        />
                        <OfferDetailsProgress
                            allocations={{
                                alloFilled: 30000,
                                alloGuaranteed: 50000,
                                alloRes: 20000,
                                alloTotal: 100000,
                                isPaused: false,
                                isRefund: false,
                                isSettled: false,
                            }}
                            isSoldOut={false}
                        />
                        <OfferDetailsProgress
                            allocations={{
                                alloFilled: 25000,
                                alloGuaranteed: 25000,
                                alloRes: 50000,
                                alloTotal: 100000,
                                isPaused: true,
                                isRefund: true,
                                isSettled: true,
                            }}
                            isSoldOut={true}
                        />
                        <OfferDetailsProgress
                            allocations={{
                                alloFilled: 70000,
                                alloGuaranteed: 15000,
                                alloRes: 15000,
                                alloTotal: 100000,
                                isPaused: false,
                                isRefund: false,
                                isSettled: true,
                            }}
                            isSoldOut={false}
                        />
                        <OfferDetailsProgress
                            allocations={{
                                alloFilled: 85000,
                                alloGuaranteed: 5000,
                                alloRes: 10000,
                                alloTotal: 100000,
                                isPaused: true,
                                isRefund: false,
                                isSettled: false,
                            }}
                            isSoldOut={true}
                        />
                        <OfferDetailsProgress
                            allocations={{
                                alloFilled: 40000,
                                alloGuaranteed: 30000,
                                alloRes: 30000,
                                alloTotal: 100000,
                                isPaused: false,
                                isRefund: true,
                                isSettled: true,
                            }}
                            isSoldOut={false}
                        />
                        <OfferDetailsProgress
                            allocations={{
                                alloFilled: 20000,
                                alloGuaranteed: 40000,
                                alloRes: 40000,
                                alloTotal: 100000,
                                isPaused: true,
                                isRefund: true,
                                isSettled: false,
                            }}
                            isSoldOut={true}
                        />
                        <OfferDetailsProgress
                            allocations={{
                                alloFilled: 10000,
                                alloGuaranteed: 60000,
                                alloRes: 30000,
                                alloTotal: 100000,
                                isPaused: false,
                                isRefund: false,
                                isSettled: false,
                            }}
                            isSoldOut={false}
                        />
                    </div>
                    <div className="flex flex-col gap-2 mt-5">
                        {booked > 0 && (
                            <div className={"detailRow text-app-error"}>
                                <p>Reserved</p>
                                <hr className={"spacer"} />
                                <p>${normalized_booked}</p>
                            </div>
                        )}
                        {invested > 0 && (
                            <div className={"detailRow text-app-success"}>
                                <p>My Investment</p>
                                <hr className={"spacer"} />
                                <p>${normalized_invested}</p>
                            </div>
                        )}
                        <div className={"detailRow"}>
                            <p>Ticker</p>
                            <hr className={"spacer"} />
                            <p>${ticker}</p>
                        </div>
                        <div className={"detailRow"}>
                            <p>Price</p>
                            <hr className={"spacer"} />
                            <p>{ppu === 0 ? "TBA" : `$${normalized_ppu}`}</p>
                        </div>
                        {tge && (
                            <div className={"detailRow text-app-success"}>
                                <p>TGE</p>
                                <hr className={"spacer"} />
                                <p>
                                    ({normalized_tgeDiff}%) ${normalized_tge}
                                </p>
                            </div>
                        )}
                        <div className={"detailRow"}>
                            <p>Cliff</p>
                            <hr className={"spacer"} />
                            <p>{t_cliff ? <>{t_cliff}</> : <>TBA</>}</p>
                        </div>
                        <div className={"detailRow"}>
                            <p>Vesting</p>
                            <hr className={"spacer"} />
                            <p>{t_vesting ? <>{t_vesting}</> : <>TBA</>}</p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};
