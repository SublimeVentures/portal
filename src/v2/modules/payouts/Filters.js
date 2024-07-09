import { useRouter } from "next/router";
import { FilterButton, exclude } from "@/v2/components/App/Vault/InvestmentsFilters";
import {
    DropdownMenu,
    DropdownMenuButton,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuLabelReset,
    DropdownMenuCheckboxItem,
} from "@/v2/components/ui/dropdown-menu";
import FilterAltIcon from "@/v2/assets/svg/filter-alt.svg";
import { cn } from "@/lib/cn";

const FILTERS = {
    IS_UPCOMING: "isUpcoming",
    IS_PENDING: "isPending",
    Is_SOON: "isSoon",
};

const FILTERS_LABELS = {
    IS_UPCOMING: "Upcoming",
    IS_PENDING: "Pending",
    Is_SOON: "Soon",
};

const Filters = ({ className }) => {
    const router = useRouter();
    const { query } = router;
    return (
        <div className={cn("flex items-center flex-wrap gap-2 md:gap-4", className)}>
            <DropdownMenu>
                <DropdownMenuButton variant="tertiary" icon={FilterAltIcon}>
                    Filters
                </DropdownMenuButton>
                <DropdownMenuContent>
                    <DropdownMenuLabel>
                        Filters
                        <DropdownMenuLabelReset
                            onClick={() => {
                                router.replace({ query: exclude(query, ...Object.values(FILTERS)) });
                            }}
                        >
                            Reset
                        </DropdownMenuLabelReset>
                    </DropdownMenuLabel>
                    {Object.keys(FILTERS).map((key) => {
                        return (
                            <DropdownMenuCheckboxItem
                                key={key}
                                checked={query[FILTERS[key]] ? true : false}
                                onCheckedChange={(checked) => {
                                    router.replace({
                                        query: {
                                            ...exclude(query, FILTERS[key]),
                                            ...(checked ? { [FILTERS[key]]: true } : {}),
                                        },
                                    });
                                }}
                            >
                                {FILTERS_LABELS[key]}
                            </DropdownMenuCheckboxItem>
                        );
                    })}
                </DropdownMenuContent>
            </DropdownMenu>
            {Object.keys(FILTERS).map((key) => {
                if (query[FILTERS[key]]) {
                    return (
                        <FilterButton
                            key={key}
                            onClick={() => {
                                router.replace({ query: exclude(query, FILTERS[key]) });
                            }}
                        >
                            {FILTERS_LABELS[key]}
                        </FilterButton>
                    );
                }
                return null;
            })}
        </div>
    );
};

export default Filters;
