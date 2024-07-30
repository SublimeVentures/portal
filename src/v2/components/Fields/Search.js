import { forwardRef } from "react";
import { BiSearchAlt } from "react-icons/bi";

import { Button } from "@/v2/components/ui/button";
import { cn } from "@/lib/cn";

const Search = forwardRef(({ name, className, onClick, ...props }, ref) => {
    return (
        <div className={cn("py-2 px-4 flex justify-between border border-navy-100/[.5] bg-foreground/[.1] rounded", className)}>
            <div className="w-full flex items-center">
                <BiSearchAlt className="mr-4 text-foreground/50" />
                <input
                    ref={ref}
                    type="text"
                    placeholder={name}
                    className="w-full bg-transparent text-foreground placeholder:text-foreground/[.5] focus-visible:outline-none disabled:cursor-not-allowed"
                    {...props}
                />

                <Button variant="gradient" size="small" onClick={onClick}>Search</Button>
            </div>
        </div>
    );
});
 
export default Search;
