import { UpgradeBanner } from "@/v2/components/App/Vault";
import { cn } from "@/lib/cn";
import Title from "@/v2/modules/opportunities/Title";

export default function UpgradesHeader({ title, children, affix, className, count, bannerClassName }) {
    return (
        <header className={cn("flex flex-col gap-4 lg:gap-5 3xl:gap-4 lg:flex-row lg:items-center", className)}>
            <div className="flex items-center justify-between gap-4">
                <Title count={count}>{title}</Title>
                {affix}
            </div>
            {children}
            <UpgradeBanner
                className={cn("w-full lg:ml-auto sm:order-first lg:order-none", bannerClassName)}
                variant="vertical"
            />
        </header>
    );
}
