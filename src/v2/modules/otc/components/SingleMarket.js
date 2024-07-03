import Image from "next/image";
import Link from "next/link";

import { useEnvironmentContext } from "@/lib/context/EnvironmentContext";
import { routes } from "@/v2/routes";
import { cn } from "@/lib/cn";

export default function SingleMarket({ name, genre, slug, selectedMarket }) {
    const { cdn } = useEnvironmentContext();
    const isSelected = selectedMarket.slug === slug;

    return (
        <Link
            shallow
            href={`${routes.OTC}?market=${slug}`}
            className={cn("p-4 flex items-center bg-foreground/[0.03] transition-hover hover:bg-foreground/[0.09] md:flex-row", { "bg-foreground/[0.15] hover:bg-foreground/[0.15]": isSelected })}
        >
            <Image
                src={`${cdn}/research/${slug}/icon.jpg`}
                className="size-20 rounded"
                alt={slug}
                width={100}
                height={100}
            />

          <div className="ml-4 flex flex-col gap-2">
              <h4 className="font-semibold text-foreground leading-none">{name}</h4>
              <p className="text-foreground/[.5] leading-none">{genre}</p>
              
              <div className="flex items-center gap-1">
                  <div className="w-6 h-6 rounded-full border border-foreground/[.5]" />
                  <div className="w-6 h-6 rounded-full border border-foreground/[.5]" />
                  <div className="w-6 h-6 rounded-full border border-foreground/[.5]" />
              </div>
            </div>
        </Link>
    );
};
