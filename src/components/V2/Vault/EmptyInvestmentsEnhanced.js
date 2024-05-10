import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { IconButton } from "@/components/ui/icon-button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import ArrowIcon from "@/assets/v2/svg/arrow.svg";

const EmptyInvestmentsEnhanced = () => {
    return (
        <Card variant="none" border="none" className="h-full w-full flex flex-col items-center justify-center gap-4 grow bg-empty-investment-top-pattern bg-cover bg-center bg-no-repeat">
            <CardTitle className="text-4xl text-center">No investments found</CardTitle>
            <CardDescription className="max-w-2xl text-11xl font-semibold text-center">Explore elite investment avenues curated for the astute investor</CardDescription>
            <div className="my-8 flex flex-col items-center gap-4 collap:flex-row">
                <Button className="w-full collap:w-auto" variant="outline">OTC market</Button>
                <Button className="w-full collap:w-auto">Opportunities</Button>
            </div> 

            <div className="p-3.5 flex flex-col items-center gap-4 bg-navy-800 rounded collap:flex-row collap:gap-12">
                <Avatar variant="block" className="bg-black size-[72px]">
                    <AvatarImage src="" />
                    <AvatarFallback>CN</AvatarFallback>
                </Avatar>
                <div className="text-center collap:text-start">
                    <h4 className="text-3xl font-medium text-foreground">$Block</h4>
                    <p className="text-md font-light text-foreground">BlockGames</p>
                </div>
                <p className="max-w-[20ch] text-2xl text-foreground italic text-center collap:text-left">Latest exclusive investment opportunity</p>
                <IconButton name="Upgrade" shape="circle" variant="accent" icon={ArrowIcon} />
            </div>
        </Card>
    )
}

export default EmptyInvestmentsEnhanced;
