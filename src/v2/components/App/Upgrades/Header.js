import { UpgradeBanner } from "@/v2/components/App/Vault";
import { cn } from "@/lib/cn";

export default function UpgradesHeader({ title, children, affix, className }) {
    return (
        <header className={cn("flex flex-col gap-4 md:flex-row md:items-center md:gap-5", className)}>
            <div className="flex items-center justify-between gap-4">
                <h3 className="text-2xl font-bold text-foreground lg:font-normal">{title}</h3>
                {affix}
            </div>
            {children}
            <UpgradeBanner className="hidden ml-auto 2xl:block" />
        </header>
    );
}
