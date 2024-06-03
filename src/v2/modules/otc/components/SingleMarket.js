import Link from "next/link";

import { Avatar } from "@/v2/components/ui/avatar";
import { routes } from "@/v2/routes";
import { cn } from "@/lib/cn";

export default function SingleMarket({ name, genre, slug, selectedMarket }) {
    const isSelected = selectedMarket.slug === slug;

    return (
        <Link
            shallow
            href={`${routes.OTC}?market=${slug}`}
            className={cn("p-4 flex items-center bg-foreground/[0.03] transition-hover hover:bg-foreground/[0.09] md:flex-row", { "bg-foreground/[0.15] hover:bg-foreground/[0.15]": isSelected })}
        >
          <Avatar variant="block" className='size-20' />

          <div className="ml-2">
              <h4 className="font-semibold text-foreground leading-none">{name}</h4>
              <p className="mb-2 text-foreground/[.5]">{genre}</p>
              
              <div className="flex items-center gap-1">
                  <div className="w-6 h-6 rounded-full border border-foreground/[.5]" />
                  <div className="w-6 h-6 rounded-full border border-foreground/[.5]" />
                  <div className="w-6 h-6 rounded-full border border-foreground/[.5]" />
              </div>
            </div>
        </Link>
    );
};
