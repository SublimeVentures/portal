import { forwardRef } from "react";
import { Cross1Icon } from "@radix-ui/react-icons";

import { IconButton } from "@/v2/components/ui/icon-button";
import { Button } from "@/v2/components/ui/button";
import { cn } from "@/lib/cn";
import SearchIcon from "@/v2/assets/svg/search.svg";

const Search = forwardRef(({ name, className, isOpen, onClick, onClose, ...props }, ref) => {
    return (
        <div
            className={cn(
                "py-2 px-4 flex justify-between border border-navy-100/[.5] bg-foreground/[.1] rounded",
                className,
            )}
        >
            <div className="w-full flex items-center gap-2">
                <SearchIcon className="size-3 shrink-0 text-foreground/50" />
                <input
                    ref={ref}
                    type="text"
                    placeholder={name}
                    className="grow text-base text-light bg-transparent text-foreground placeholder:text-extralight placeholder:text-foreground/[.5] focus-visible:outline-none disabled:cursor-not-allowed"
                    onClick={onClick}
                    {...props}
                />

                <IconButton variant="transparent" size="8" name="Close popover" icon={Cross1Icon} onClick={onClose} className={cn("hidden", { "block": isOpen })} />
                <Button variant="gradient" size="small" onClick={onClick}>
                    Search
                </Button>
            </div>
        </div>
    );
});
Search.displayName = "Search";

export default Search;
