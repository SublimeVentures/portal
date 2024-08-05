import { UpgradeBanner } from "@/v2/components/App/Vault";
import { cn } from "@/lib/cn";

export default function UpgradesHeader({ title, children, affix, className }) {
    return (
        <header
            className={cn(
                "flex flex-col gap-7 3xl:gap-4 md:flex-row md:items-center md:gap-5 mt-7 3xl:mt-0",
                className,
            )}
        >
            <div className="flex items-center justify-between gap-4">
                <h3 className="text-[14px] 3xl:text-2xl font-light 3xl:font-normal text-foreground/50 3xl:text-foreground lg:font-normal">
                    {title}
                </h3>
                {affix}
            </div>
            {children}
            <UpgradeBanner className="w-full md:w-auto md:ml-auto" variant="vertical" />
        </header>
    );
}
