import { Button } from "@/components/ui/button";
import ArrowIcon from "@/assets/v2/svg/arrow.svg";

import { views } from "./index";

const TimelineView = ({ setView }) => {
    return (
        <>
            <div className="w-full pb-2 pt-4 px-8 flex items-center justify-between">
                <h3 className="text-lg font-medium text-foreground">Timeline</h3>
                <Button variant="link" onClick={() => setView(views.details)}>
                    <span>Go back</span>
                    <ArrowIcon className="ml-1" />
                </Button>
            </div>

            <div className="mb-2 mt-4 py-4 px-8 flex flex-col gap-4 bg-foreground/[.1] rounded">
                <dl className="flex justify-between items-center">
                    <dt className="text-md font-light text-foreground leading-none">Claimed</dt>
                    <dd className="text-lg font-medium text-foreground leading-none">12.04.2024</dd>
                </dl>

                <p className="text-md text-foreground leading-none">20 GMRX</p>
                <div variant="link" className="flex items-end text-xxs text-start text-foreground/[.25] leading-none">
                  <span>Claimed 2nd payout on BNB chain</span>  
                  <ArrowIcon className="ml-1" />
                </div>
            </div>

            <div className="mb-2 mt-4 py-4 px-8 flex flex-col gap-4 bg-foreground/[.1] rounded">
                <dl className="flex justify-between items-center">
                    <dt className="text-md font-light text-foreground leading-none">OTC Buy</dt>
                    <dd className="text-lg font-medium text-foreground leading-none">12.04.2024</dd>
                </dl>

                <p className="text-md text-foreground leading-none">20 GMRX</p>
                <div variant="link" className="flex items-end text-xxs text-start text-foreground/[.25] leading-none">
                  <span>See on Block Explorer</span>  
                  <ArrowIcon className="ml-1" />
                </div>
            </div>

            <div className="mb-2 mt-4 py-4 px-8 flex flex-col gap-4 bg-foreground/[.1] rounded">
                <dl className="flex justify-between items-center">
                    <dt className="text-md font-light text-foreground leading-none">MysteryBox obtained</dt>
                    <dd className="text-lg font-medium text-foreground leading-none">12.04.2024</dd>
                </dl>
            </div>

            <div className="mb-2 mt-4 py-4 px-8 flex flex-col gap-4 bg-foreground/[.1] rounded">
                <dl className="flex justify-between items-center">
                    <dt className="text-md font-light text-foreground leading-none">Invested</dt>
                    <dd className="text-lg font-medium text-foreground leading-none">12.04.2024</dd>
                </dl>

                <p className="text-md text-foreground leading-none">Invested $250</p>
                <div variant="link" className="flex items-end text-xxs text-start text-foreground/[.25] leading-none">
                  <span>See on Block Explorer</span>  
                  <ArrowIcon className="ml-1" />
                </div>
            </div>

            <div className="mb-2 mt-4 py-4 px-8 flex flex-col gap-4 bg-foreground/[.1] rounded">
                <dl className="flex justify-between items-center">
                    <dt className="text-md font-light text-foreground leading-none">Acquired premium</dt>
                    <dd className="text-lg font-medium text-foreground leading-none">12.04.2024</dd>
                </dl>

                <p className="text-md text-foreground leading-none">Increased Allocation</p>
            </div>
        </>
    );
};

export default TimelineView;
