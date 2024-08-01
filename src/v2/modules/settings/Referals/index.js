import Link from "next/link";
import { Card, CardDescription, CardTitle } from "@/v2/components/ui/card";
import ReferalSteps from "@/v2/modules/settings/Referals/ReferalSteps";

export default function Referals() {
    return (
        <div className="grid grid-cols-1 gap-5 h-full box-border 2xl:grid-cols-3">
            <div className="bg-gray-800 p-2 rounded-lg col-span-1 md:col-span-1 md:row-span-2">
                <Card variant="none" className="py-6 px-12 flex flex-col gap-8 h-full bg-settings-gradient pb-23">
                    <CardTitle className="text-2xl font-medium text-foreground leading-10">
                        Join Based Referral program
                    </CardTitle>
                    <CardDescription className="text-md font-light">
                        Get free discounts and earn allocations. For more information, please read the{" "}
                        <Link className="text-[#4BD4E7] font-medium" href="/#">
                            referral program
                        </Link>{" "}
                        details.
                    </CardDescription>
                    <ReferalSteps />
                </Card>
            </div>
            <div className="bg-gray-800 p-2 rounded-lg col-span-1 md:col-span-2"></div>
            <div className="bg-gray-800 p-2 rounded-lg col-span-1 md:col-span-2"></div>
        </div>
    );
}
