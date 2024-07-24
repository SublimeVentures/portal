import ReactMarkdown from "react-markdown";
import { Skeleton, SkeletonCircle } from "@/v2/components/ui/skeleton";
import { Button } from "@/v2/components/ui/button";
import { Card, CardTitle, CardDescription } from "@/v2/components/ui/card";
import { AvatarRoot, AvatarImage } from "@/v2/components/ui/avatar";
import { cn } from "@/lib/cn";
import ExclamationMark from "@/v2/assets/svg/exclamation-mark.svg";
import { AlertTitle, AlertDescription, AlertIcon } from "@/v2/components/ui/alert";
import logo from "@/assets/svg/logo_1.svg?url";

export const SkeletonPartnershipCard = ({ partnersCount = 1 }) => {
    return (
        <Card variant="static" className="p-14 pt-20 flex flex-col items-center gap-2">
            <div className="absolute top-0 translate-y-[-50%] flex -space-x-4">
                {Array.from({ length: partnersCount }, (_, index) => (
                    <SkeletonCircle key={index} className="size-24" />
                ))}
            </div>

            <Skeleton className="my-2 h-6 w-3/5" />
            <Skeleton count={3} className="h-4 w-3/4" />
        </Card>
    );
};

export const ErrorPartnershipCard = () => {
    return (
        <Card variant="static" className="pt-20 flex flex-col items-center gap-2">
            <div className="absolute top-0 translate-y-[-50%] flex -space-x-4">
                <AlertIcon icon={ExclamationMark} className="bg-destructive size-24 p-2 pb-3" />
            </div>

            <div className="p-4 pb-8 flex flex-col items-center bg-destructive-dark rounded">
                <AlertTitle className="">Error</AlertTitle>
                <AlertDescription className="mt-2 text-center">
                    Unable to fetch data. Please try again.
                </AlertDescription>
            </div>

            <Button variant="destructive" className="mt-auto w-full">
                Refetch
            </Button>
        </Card>
    );
};

const components = {
    a: ({ children, ...props }) => (
        <a className="text-sm font-light text-accent/[.47]" {...props}>
            {children}
        </a>
    ),
    strong: ({ children }) => <strong className="font-bold">{children}</strong>,
};

const PartnershipCard = ({ title, content, logos = [], isLoading, isError }) => {
    if (isLoading) return <SkeletonPartnershipCard />;
    if (isError) return <ErrorPartnershipCard />;
    logos = logos || [];
    if (logos.length !== 2) {
        logos = [...logos, logo];
    }
    return (
        <Card
            variant="static"
            className="p-8 pt-14 md:pt-8 md:p-8 3xl:p-14 3xl:pt-20 flex flex-col md:flex-row 3xl:flex-col items-center gap-3 md:gap-8 3xl:gap-3 mt-14 md:mt-0 3xl:mt-20 grow cursor-auto"
        >
            <ul className="scale-75 md:scale-100 absolute md:static 3xl:absolute top-0 translate-y-[-50%] md:translate-y-0 3xl:translate-y-[-50%] flex -space-x-2">
                {logos.map((logo, index) => (
                    <li key={logo}>
                        <AvatarRoot
                            size="large"
                            className={cn("shadow-[4px_3px_22px] p-4", {
                                "bg-black shadow-black": !!index,
                                "bg-gradient-to-b from-navy-200 to-[#0BB0C8] shadow-[#0BB0C8]": !index,
                            })}
                        >
                            <AvatarImage src={logo} alt="" />
                        </AvatarRoot>
                    </li>
                ))}
            </ul>
            <div>
                {title && (
                    <CardTitle className="text-md md:text-lg 3xl:text-2xl text-center md:text-left 3xl:text-center font-normal text-foreground mb-3">
                        {title}
                    </CardTitle>
                )}
                <ReactMarkdown
                    components={components}
                    className="text-sm md:text-md 3xl:text-sm font-light text-center md:text-left 3xl:text-center text-foreground/[.47]"
                >
                    {content}
                </ReactMarkdown>
            </div>
        </Card>
    );
};

export default PartnershipCard;
