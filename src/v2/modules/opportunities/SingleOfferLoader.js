import { Card } from "@/v2/components/ui/card";
import { Skeleton } from "@/v2/components/ui/skeleton";

export default function SingleOfferLoader() {
    return (
        <Card variant="dark" className="h-full flex flex-col">
            <div className="grow">
                <div className="relative flex gap-2 lg:mb-12">
                    <div className="rounded lg:absolute lg:left-4 lg:-bottom-12">
                        <Skeleton className="h-24 w-24 lg:p-10 lg:border lg:shadow-2xl" />
                    </div>
                    <Skeleton className="h-24 lg:h-32" />
                </div>
                
                <div className="my-4 mx-8">
                    <Skeleton />
                </div>
            </div>

            <div className="m-4">
                <Skeleton count={2} className='my-2' />
            </div>
        </Card>
    );
};
