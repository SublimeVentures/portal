import { cn } from "@/lib/cn";

export default function Vesting({ className }) {
    return (
        <div className={cn("p-6 rounded bg-[#12202C]", className)}>
            <h2>Vesting</h2>
        </div>
    );
}
