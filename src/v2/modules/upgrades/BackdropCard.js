import { cn } from "@/lib/cn";

export default function Card({ children, className }) {
    return (
        <div
            className={cn("text-white px-11 py-6 bg-white/5 backdrop-blur-2xl rounded-md flex items-center", className)}
        >
            {children}
        </div>
    );
}
