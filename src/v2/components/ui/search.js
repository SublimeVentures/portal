import { forwardRef } from "react";
import { BiSearch } from "react-icons/bi";
import { IoClose } from "react-icons/io5";

import { IconButton } from "@/v2/components/ui/icon-button";
import { Input } from "@/v2/components/ui/input";
import { Button } from "@/v2/components/ui/button";
import { cn } from "@/lib/cn";

const Search = forwardRef(({ className, placehoder = "Search", btnText = "Search", isActive = false, ...props }, ref) => {
    return (
        <div className="relative">
            <BiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground/[.5]" />
            <Input type="search" placeholder={placehoder} className="pl-9" {...props} />
            
            <div className="absolute right-2 top-1/2 -translate-y-1/2" >
                {isActive
                    ? <IconButton name="Exit" icon={IoClose} size={8} className={cn({ "bg-foreground/[.1] hover:bg-red-500": props["aria-invalid"]})} />
                    : <Button type="submit" variant={props["aria-invalid"] ? "destructive" : "gradient"}>{placehoder}</Button>
                }
            </div>
        </div>
    );
})

Search.displayName = "Search";

export { Search };
