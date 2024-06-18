import { Skeleton } from "@/v2/components/ui/skeleton";

export default function SkeletonTable({ span = 6, count = 5 }) {
    return (
        <tr>
            <td colSpan={span}>
                <div className="p-4">{Array.from({ length: count }).map((_, index) => <Skeleton key={index} className="h-20 my-4" /> )}</div>
            </td>
        </tr>
    );
};
