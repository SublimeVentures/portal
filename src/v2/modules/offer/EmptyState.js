import Link from "next/link";

import { cn } from "@/lib/cn";
import { Button } from "@/v2/components/ui/button";

export default function EmptyState({ heading, description, cta = null, secondaryCta = null, className = "" }) {
    return (
        <div className={cn("p-4 h-full flex flex-col items-center justify-center bg-white/5 gap-2", className)}>
            <h3 className="tracking-tight text-base md:text-lg font-medium text-white font-heading">{heading}</h3>
            <p className="max-w-2xl text-xs font-light text-white/70 text-center lg:text-sm">{description}</p>

            <div className="mt-6 w-full flex flex-col items-center gap-2 lg:w-max lg:flex-row lg:gap-4 empty:mt-0">
                {cta && (
                    <Button asChild className="w-full lg:w-max" variant={cta.variant ?? "default"}>
                        <Link href={cta.href}>{cta.text}</Link>
                    </Button>
                )}

                {secondaryCta && (
                    <Button asChild className="w-full lg:w-max" variant={secondaryCta.variant ?? "default"}>
                        <Link href={secondaryCta.href}>{secondaryCta.text}</Link>
                    </Button>
                )}
            </div>
        </div>
    );
}
