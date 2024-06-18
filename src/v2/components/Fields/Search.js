import { BiSearchAlt } from "react-icons/bi";

// import { Button } from "@/v2/components/ui/button";
import { cn } from "@/lib/cn";

const Search = ({ name, className, ...props }) => {
    return (
        <div className={cn("py-2 px-4 flex justify-between border border-navy-100/[.5] bg-foreground/[.1] rounded", className)}>
            <div className="w-full flex items-center">
                <BiSearchAlt className="mr-4 text-foreground/[.5]" />
                <input
                    type="text"
                    placeholder={name}
                    className="w-full bg-transparent text-foreground placeholder:text-foreground/[.5] focus-visible:outline-none disabled:cursor-not-allowed"
                    {...props}
                />
            </div>

            {/* <Button type="submit" variant="gradient">Search</Button> */}
        </div>
    )
}
 
export default Search;
