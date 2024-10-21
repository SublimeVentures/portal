import { Card, CardDescription, CardTitle } from "@/v2/components/ui/card";
import Copy from "@/v2/components/Copy";
import { shortenAddress } from "@/v2/lib/helpers";
import ExternalLink from "@/v2/components/ui/external-link";
import routes, { ExternalLinks } from "@/routes";

const Title = ({ children }) => <div className="text-nowrap text-sm md:text-base text-foreground">{children}</div>;

const Description = ({ children }) => (
    <div className="text-xs md:text-sm text-[#C4C4C4] whitespace-pre-line font-light">{children}</div>
);

const Bullet = ({ children }) => (
    <div className="w-8 h-8 opacity-100 step-gradient flex items-center justify-center rounded-3xl text-white text-xs md:text-sm">
        {children}
    </div>
);

const mockedAddress = "0x12dA9c45B7f8a34EF1234560eF";
const mockedTenantName = "based.VC";

export default function ReferalsSteps() {
    return (
        <Card
            variant="none"
            className="h-full w-full flex flex-col grow bg-settings-gradient overflow-hidden cursor-default"
        >
            <div className="flex flex-col grow gap-4 block-scrollbar overflow-y-auto px-4">
                <CardTitle className="text-base md:text-lg font-medium text-white mb-1">
                    Join Based Referral Program
                </CardTitle>
                <CardDescription className="text-xs md:text-sm font-light">
                    Get free discounts and earn allocations. For more information, please read the{" "}
                    <ExternalLink href={ExternalLinks.REFERRAL_PROGRAM}>referral program</ExternalLink> details.
                </CardDescription>

                <div className="mt-8 mb-4 sm:p-4 sm:bg-foreground/[.06] sm:rounded sm:py-10 sm:px-8 flex flex-col grow">
                    <div className="flex">
                        <div className="flex flex-col items-center">
                            <Bullet>1</Bullet>
                            <div className="h-5 md:h-10 bg-gray-500 w-px my-7" />
                            <Bullet>2</Bullet>
                            <div className="h-5 md:h-10 bg-gray-500 w-px my-7" />
                            <Bullet>3</Bullet>
                        </div>

                        <div>
                            <div className="px-10 h-26 md:h-32">
                                <Title>Send Invitation</Title>
                                <Description>Send your referral link to your friends.</Description>
                            </div>
                            <div className="px-10 h-26 md:h-32">
                                <Title>Register and Trade</Title>
                                <Description>Let them register and trade through your ID.</Description>
                            </div>
                            <div className="px-10 h-26 md:h-32">
                                <Title>Earn Rewards</Title>
                                <Description>Once they trade, you both will recieve the rewards.</Description>
                            </div>
                        </div>
                    </div>

                    <div className="mt-auto py-2 flex justify-center text-foreground rounded cursor-pointer bg-gradient-to-r from-primary to-primary-600">
                        <Copy value={mockedAddress} text={`${shortenAddress(mockedAddress)}/${mockedTenantName}`} />
                    </div>
                </div>
            </div>
        </Card>
    );
}
