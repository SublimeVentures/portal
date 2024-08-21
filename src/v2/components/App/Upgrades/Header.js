import { UpgradeBanner } from "@/v2/components/App/Vault";
import { cn } from "@/lib/cn";
import Title from "@/v2/modules/opportunities/Title";

export default function UpgradesHeader({ title, children, affix, className, count }) {
    return (
        <header className={cn("flex flex-col gap-7 3xl:gap-4 md:flex-row md:items-center md:gap-5", className)}>
            <div className="flex items-center justify-between gap-4">
                <Title count={count}>{title}</Title>
                {affix}
            </div>
            {children}
            <UpgradeBanner className="w-full md:w-auto md:ml-auto" variant="vertical" />
        </header>
    );
}
