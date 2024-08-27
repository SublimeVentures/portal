import { views } from "./index";
import { Button } from "@/v2/components/ui/button";
import ArrowIcon from "@/v2/assets/svg/arrow.svg";

const DetailsView = ({ setView }) => {
    return (
        <>
            <h3 className="pb-2 pt-4 px-8 text-lg font-medium text-foreground">Status</h3>

            <dl className="py-4 px-8 flex flex-col gap-4 bg-foreground/[.02]">
                <div className="flex justify-between items-center">
                    <dt className="text-md font-light text-foreground">Progress</dt>
                    <dd className="text-lg font-medium text-foreground">10%</dd>
                </div>
                <div className="flex justify-between items-center">
                    <dt className="text-md font-light text-foreground">Invested</dt>
                    <dd className="text-lg font-medium text-foreground">5000,00 USD</dd>
                </div>
                <div className="flex justify-between items-center">
                    <dt className="text-md font-light text-foreground">Vested</dt>
                    <dd className="text-lg font-medium text-foreground">3834,00 USD</dd>
                </div>
            </dl>

            <h3 className="pb-2 pt-4 px-8 text-lg font-medium text-foreground">Performance</h3>
            <dl className="py-4 px-8 flex flex-col gap-4 bg-foreground/[.02]">
                <div className="flex justify-between items-center">
                    <dt className="text-md font-light text-foreground">TGE gain</dt>
                    <dd className="text-lg font-medium text-foreground">TBA</dd>
                </div>
                <div className="flex justify-between items-center">
                    <dt className="text-md font-light text-foreground">Return</dt>
                    <dd className="text-lg font-medium text-foreground text-success-500">+76,68%</dd>
                </div>
            </dl>

            <h3 className="pb-2 pt-4 px-8 text-lg font-medium text-foreground">Dates</h3>
            <dl className="py-4 px-8 flex flex-col gap-4 bg-foreground/[.02]">
                <div className="flex justify-between items-center">
                    <dt className="text-md font-light text-foreground">Participated</dt>
                    <dd className="text-lg font-medium text-foreground">03.04.2023</dd>
                </div>
                <div className="flex justify-between items-center">
                    <dt className="text-md font-light text-foreground">Next Unlock</dt>
                    <dd className="text-lg font-medium text-foreground">TBA</dd>
                </div>
                <div className="flex justify-between items-center">
                    <dt className="text-md font-light text-foreground">Allocation Snapshot</dt>
                    <dd className="text-lg font-medium text-foreground">TBA</dd>
                </div>
                <div className="flex justify-between items-center">
                    <dt className="text-md font-light text-foreground">Claim Date</dt>
                    <dd className="text-lg font-medium text-foreground">TBA</dd>
                </div>
            </dl>

            <div className="pb-2 pt-4 px-8 flex items-center">
                <h3 className="mr-4 text-lg font-medium text-foreground">Timeline</h3>
                <Button variant="link" onClick={() => setView(views.timeline)}>
                    <span>See all</span>
                    <ArrowIcon className="ml-1" />
                </Button>
            </div>

            <div className="py-4 px-8 flex flex-col gap-4 bg-foreground/[.1] rounded">
                <dl className="flex justify-between items-center">
                    <dt className="text-md font-light text-foreground">Claimed</dt>
                    <dd className="text-lg font-medium text-foreground">12.04.2024</dd>
                </dl>

                <p className="text-md text-foreground">20 GMRX</p>
                <p className="text-xxs text-foreground/[.25]">Claimed 2nd payout on BNB chain</p>
            </div>
        </>
    );
};

export default DetailsView;
