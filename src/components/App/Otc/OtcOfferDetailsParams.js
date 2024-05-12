export const OtcOfferDetailsParams = ({ paramsParams }) => {
    const { offer } = paramsParams;
    let { ticker, ppu, tge, t_cliff, t_vesting } = offer;
    const normalized_ppu = Number(ppu)?.toLocaleString();
    const normalized_tge = Number(tge)?.toLocaleString();
    const normalized_tgeDiff = Number((100 * (tge - ppu)) / ppu)?.toLocaleString(undefined, {
        minimumFractionDigits: 2,
    });
    const normalized_total = Number(0)?.toLocaleString();

    return (
        <>
            <div className="offerWrap bordered-container font-accent">
                <div className="flex flex-col rounded-xl bg-navy-accent p-6 justify-start flex-1">
                    <div className="uppercase">
                        <div className={"text-sm text-outline"}>My Allocation</div>
                    </div>
                    <div className="text-5xl font-bold flex flex-1 glow font-light py-2">${normalized_total}</div>

                    <div className="flex flex-col gap-2 mt-5">
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
