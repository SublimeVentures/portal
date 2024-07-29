import Image from "next/image";
import Link from "next/link";
import { IoPricetagOutline } from "react-icons/io5";
import { MdOutlineAttachMoney } from "react-icons/md";
import { HiOutlineBuildingLibrary } from "react-icons/hi2";

import { useEnvironmentContext } from "@/lib/context/EnvironmentContext";
import { routes } from "@/v2/routes";
import { cn } from "@/lib/cn";

export default function SingleMarket({ name, genre, slug, currentMarket }) {
    const { cdn } = useEnvironmentContext();
    const isSelected = currentMarket ? currentMarket.slug === slug : false;

    return (
        <Link
            shallow
            href={{
                pathname: routes.OTC,
                query: {
                  market: slug,
                  view: "offers"
                }
            }}
            className={cn("h-24 p-4 mr-2 flex items-center bg-foreground/[0.03] transition-hover hover:bg-foreground/[0.09] md:flex-row", { "bg-foreground/[0.15] hover:bg-foreground/[0.15]": isSelected })}
        >
            <Image
                src={`${cdn}/research/${slug}/icon.jpg`}
                className="rounded"
                alt={slug}
                width={70}
                height={70}
            />

          <div className="ml-4 flex flex-col gap-2">
              <h4 className="text-[16px] font-semibold text-foreground leading-none">{name}</h4>
              <p className="text-[14px] text-foreground/[.5] leading-none">{genre}</p>
              
              <div className="flex items-center gap-1">
                  <div className="size-5 flex items-center justify-center rounded-full border border-foreground/50">
                      <HiOutlineBuildingLibrary className="text-foreground size-2" />
                  </div>
                  <div className="size-5 flex items-center justify-center rounded-full border border-foreground/50">
                      <MdOutlineAttachMoney className="text-foreground size-2" />
                  </div>
                  <div className="size-5 flex items-center justify-center rounded-full border border-foreground/50">
                      <IoPricetagOutline className="text-foreground size-2" />
                  </div>
              </div>
            </div>
        </Link>
    );
};
