export default function OtcOfferVesting() {
    return (
        <div className="flex flex-col flex-1 justify-center items-center relative backdrop-blur-md rounded-xl">
            <div className="card-content-dedicated relative  uppercase text-2xl p-8 text-center rounded-xl">
                Present Vesting <br />
                (starting from TGE)
                {/*mark user's transactions, and grey out the vestings that are already snapshotted*/}
            </div>
        </div>
    );
}
