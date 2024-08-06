import { cn } from "@/lib/cn";

export default function Card({ children, className }) {
    return (
        <div
            className={cn(
                "text-white px-7 3xl:px-11 py-4 3xl:py-6 bg-white/5 backdrop-blur-2xl rounded-md flex flex-col gap-5 3xl:flex-row 3xl:items-center",
                className,
            )}
        >
            {children}
        </div>
    );
}
