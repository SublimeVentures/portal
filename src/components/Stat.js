import { Skeleton } from "@/components/Skeleton";

function Stat({ color, title, value, icon, isLoading }) {
    return (
        <div className={`stat ${color} flex flex-1`}>
            <div className="icon">{icon}</div>
            <div className="text-right">
                <div className="title page-content-text">{title}</div>
                {isLoading
                    ? <Skeleton className="h-6 w-[60px] skeleton glowNormal inline-block" />
                    : <div className="glowNormal font-bold uppercase text-xl">{value}</div>
                }
            </div>
        </div>
    );
}

export default Stat;
