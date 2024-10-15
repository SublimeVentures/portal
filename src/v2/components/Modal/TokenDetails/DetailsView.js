import { views } from "./index";
import { Button } from "@/v2/components/ui/button";
import ArrowIcon from "@/v2/assets/svg/arrow.svg";

const DetailsView = ({ setView }) => {
    return (
        <>
            <h3 className="pb-2 pt-4 px-8 text-lg font-medium text-white">Status</h3>

            <dl className="py-4 px-8 flex flex-col gap-4 bg-white/[.02]">
                <div className="flex justify-between items-center">
                    <dt className="text-md font-light text-white">Progress</dt>
                    <dd className="text-lg font-medium text-white">10%</dd>
                </div>
                <div className="flex justify-between items-center">
                    <dt className="text-md font-light text-white">Invested</dt>
                    <dd className="text-lg font-medium text-white">5000,00 USD</dd>
                </div>
                <div className="flex justify-between items-center">
                    <dt className="text-md font-light text-white">Vested</dt>
                    <dd className="text-lg font-medium text-white">3834,00 USD</dd>
                </div>
            </dl>

            <h3 className="pb-2 pt-4 px-8 text-lg font-medium text-white">Performance</h3>
            <dl className="py-4 px-8 flex flex-col gap-4 bg-white/[.02]">
                <div className="flex justify-between items-center">
                    <dt className="text-md font-light text-white">TGE gain</dt>
                    <dd className="text-lg font-medium text-white">TBA</dd>
                </div>
                <div className="flex justify-between items-center">
                    <dt className="text-md font-light text-white">Return</dt>
                    <dd className="text-lg font-medium text-white text-success-500">+76,68%</dd>
                </div>
            </dl>

            <h3 className="pb-2 pt-4 px-8 text-lg font-medium text-white">Dates</h3>
            <dl className="py-4 px-8 flex flex-col gap-4 bg-white/[.02]">
                <div className="flex justify-between items-center">
                    <dt className="text-md font-light text-white">Participated</dt>
                    <dd className="text-lg font-medium text-white">03.04.2023</dd>
                </div>
                <div className="flex justify-between items-center">
                    <dt className="text-md font-light text-white">Next Unlock</dt>
                    <dd className="text-lg font-medium text-white">TBA</dd>
                </div>
                <div className="flex justify-between items-center">
                    <dt className="text-md font-light text-white">Allocation Snapshot</dt>
                    <dd className="text-lg font-medium text-white">TBA</dd>
                </div>
                <div className="flex justify-between items-center">
                    <dt className="text-md font-light text-white">Claim Date</dt>
                    <dd className="text-lg font-medium text-white">TBA</dd>
                </div>
            </dl>

            <div className="pb-2 pt-4 px-8 flex items-center">
                <h3 className="mr-4 text-lg font-medium text-white">Timeline</h3>
                <Button variant="link" onClick={() => setView(views.timeline)}>
                    <span>See all</span>
                    <ArrowIcon className="ml-1" />
                </Button>
            </div>

            <div className="py-4 px-8 flex flex-col gap-4 bg-white/10 rounded">
                <dl className="flex justify-between items-center">
                    <dt className="text-md font-light text-white">Claimed</dt>
                    <dd className="text-lg font-medium text-white">12.04.2024</dd>
                </dl>

                <p className="text-md text-white">20 GMRX</p>
                <p className="text-xxs text-white/25">Claimed 2nd payout on BNB chain</p>
            </div>
        </>
    );
};

export default DetailsView;
