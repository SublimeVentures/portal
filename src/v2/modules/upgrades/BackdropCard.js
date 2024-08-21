import { cn } from "@/lib/cn";

export default function Card({ children, className }) {
    return (
        <div
            className={cn(
                "text-white px-7 lg:px-11 py-4 lg:py-6 bg-white/5 backdrop-blur-2xl rounded-md flex flex-col gap-5 lg:flex-row lg:items-center",
                className,
            )}
        >
            {children}
        </div>
    );
}
