import { forwardRef } from "react";
import { cva } from "class-variance-authority";
import { cn } from "@/lib/cn";

const CommonStyleInput =
    "py-2 px-3 leading-8 inline-flex md:text-md text-white rounded transition-hover transition-colors whitespace-nowrap cursor-pointer bg-white/5 border border-primary-700 hover:border-primary focus:border-primary outline-none";
const CommonStyleInputInvalid = "data-[invalid]:border-[#D53839] data-[invalid]:bg-[#3F2334]";

const ControlVariants = cva({
    variants: {
        size: {
            md: "",
        },
    },
});

const Input = forwardRef(({ className, type, ...props }, ref) => {
    return (
        <input type={type} className={cn(CommonStyleInput, CommonStyleInputInvalid, className)} ref={ref} {...props} />
    );
});

Input.displayName = "Input";

export { Input, CommonStyleInput };
