import { views } from "./index";
import { Button } from "@/v2/components/ui/button";
import ArrowIcon from "@/v2/assets/svg/arrow.svg";

const TimelineView = ({ setView }) => {
    return (
        <>
            <div className="w-full pb-2 pt-4 px-8 flex items-center justify-between">
                <h3 className="text-lg font-medium text-white">Timeline</h3>
                <Button variant="link" onClick={() => setView(views.details)}>
                    <span>Go back</span>
                    <ArrowIcon className="ml-1" />
                </Button>
            </div>

            <div className="mb-2 mt-4 py-4 px-8 flex flex-col gap-4 bg-white/10 rounded">
                <dl className="flex justify-between items-center">
                    <dt className="text-md font-light text-white leading-none">Claimed</dt>
                    <dd className="text-lg font-medium text-white leading-none">12.04.2024</dd>
                </dl>

                <p className="text-md text-white leading-none">20 GMRX</p>
                <div variant="link" className="flex items-end text-xxs text-start text-white/25 leading-none">
                    <span>Claimed 2nd payout on BNB chain</span>
                    <ArrowIcon className="ml-1" />
                </div>
            </div>

            <div className="mb-2 mt-4 py-4 px-8 flex flex-col gap-4 bg-white/10 rounded">
                <dl className="flex justify-between items-center">
                    <dt className="text-md font-light text-white leading-none">OTC Buy</dt>
                    <dd className="text-lg font-medium text-white leading-none">12.04.2024</dd>
                </dl>

                <p className="text-md text-white leading-none">20 GMRX</p>
                <div variant="link" className="flex items-end text-xxs text-start text-white/25 leading-none">
                    <span>See on Block Explorer</span>
                    <ArrowIcon className="ml-1" />
                </div>
            </div>

            <div className="mb-2 mt-4 py-4 px-8 flex flex-col gap-4 bg-white/10 rounded">
                <dl className="flex justify-between items-center">
                    <dt className="text-md font-light text-white leading-none">MysteryBox obtained</dt>
                    <dd className="text-lg font-medium text-white leading-none">12.04.2024</dd>
                </dl>
            </div>

            <div className="mb-2 mt-4 py-4 px-8 flex flex-col gap-4 bg-white/10 rounded">
                <dl className="flex justify-between items-center">
                    <dt className="text-md font-light text-white leading-none">Invested</dt>
                    <dd className="text-lg font-medium text-white leading-none">12.04.2024</dd>
                </dl>

                <p className="text-md text-white leading-none">Invested $250</p>
                <div variant="link" className="flex items-end text-xxs text-start text-white/10 leading-none">
                    <span>See on Block Explorer</span>
                    <ArrowIcon className="ml-1" />
                </div>
            </div>

            <div className="mb-2 mt-4 py-4 px-8 flex flex-col gap-4 bg-white/10 rounded">
                <dl className="flex justify-between items-center">
                    <dt className="text-md font-light text-white leading-none">Acquired premium</dt>
                    <dd className="text-lg font-medium text-white leading-none">12.04.2024</dd>
                </dl>

                <p className="text-md text-white leading-none">Increased Allocation</p>
            </div>
        </>
    );
};

export default TimelineView;
