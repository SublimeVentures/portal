import { cn } from "@/lib/cn";

export default function History({ className }) {
    return (
        <div className={cn("p-6 rounded bg-[#12202C]", className)}>
            <h2>History</h2>
        </div>
    );
}
