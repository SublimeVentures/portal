import React from "react";
import { ViewRadio, UpgradeBanner } from "@/v2/components/App/Vault";
import {
    DropdownMenu,
    DropdownMenuButton,
    DropdownMenuContent,
    DropdownMenuRadioItem,
    DropdownMenuRadioGroup,
    DropdownMenuLabel,
    DropdownMenuLabelReset,
    DropdownMenuCheckboxItem,
} from "@/v2/components/ui/dropdown-menu";
import { Button } from "@/v2/components/ui/button";
import CrossIcon from "@/v2/assets/svg/cross.svg";
import { cn } from "@/lib/cn";
import FilterAltIcon from "@/v2/assets/svg/filter-alt.svg";

const SORT_BY = {
    CREATED_AT: "createdAt",
    PERFORMANCE: "performance",
};

const DEFAULT_SORT_BY = SORT_BY.CREATED_AT;

const exclude = (obj, ...keys) => {
    const copy = { ...obj };
    keys.forEach((key) => delete copy[key]);
    return copy;
};

const FILTERS = {
    CAN_CLAIM: "canClaim",
    IS_UPCOMING: "isUpcoming",
};

const FILTERS_LABELS = {
    CAN_CLAIM: "Claim available",
    IS_UPCOMING: "Claim upcoming",
};

const FilterButton = ({ children, ...props }) => (
    <Button variant="secondary" className="px-3 gap-3 md:px-6 md:gap-3.5 flex items-center" {...props}>
        {children}
        <CrossIcon className="size-2 stroke-2" />
    </Button>
);

export default function InvestmentsList({ investments, views, query, onChange }) {
    const { view, sortBy = DEFAULT_SORT_BY } = query;
    return (
        <div className={cn("flex flex-col gap-4 md:flex-row md:items-center md:gap-5")}>
            <div className="flex items-center justify-between gap-4">
                <h3 className="text-2xl font-bold text-foreground lg:font-regular">
                    My Investments ({investments.length + 1})
                </h3>
                <ViewRadio options={views} value={view} onChange={(view) => onChange({ ...query, view })} />
            </div>
            <div className="flex items-center flex-wrap gap-2 md:gap-4">
                <DropdownMenu>
                    <DropdownMenuButton variant="tertiary">Sort by</DropdownMenuButton>
                    <DropdownMenuContent>
                        <DropdownMenuLabel>
                            Sort by
                            <DropdownMenuLabelReset
                                onClick={() => {
                                    onChange(exclude(query, "sortBy"));
                                }}
                            >
                                Reset
                            </DropdownMenuLabelReset>
                        </DropdownMenuLabel>
                        <DropdownMenuRadioGroup
                            value={sortBy}
                            onValueChange={(value) => {
                                onChange({ ...exclude(query, "sortBy"), sortBy: value });
                            }}
                        >
                            <DropdownMenuRadioItem value={SORT_BY.CREATED_AT}>Created At</DropdownMenuRadioItem>
                            <DropdownMenuRadioItem value={SORT_BY.PERFORMANCE}>Performance</DropdownMenuRadioItem>
                        </DropdownMenuRadioGroup>
                    </DropdownMenuContent>
                </DropdownMenu>
                <DropdownMenu>
                    <DropdownMenuButton variant="tertiary" icon={FilterAltIcon}>
                        Filters
                    </DropdownMenuButton>
                    <DropdownMenuContent>
                        <DropdownMenuLabel>
                            Filters
                            <DropdownMenuLabelReset
                                onClick={() => {
                                    onChange(exclude(query, ...Object.values(FILTERS)));
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
                                        onChange({
                                            ...exclude(query, FILTERS[key]),
                                            ...(checked ? { [FILTERS[key]]: true } : {}),
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
                                    onChange(exclude(query, FILTERS[key]));
                                }}
                            >
                                {FILTERS_LABELS[key]}
                            </FilterButton>
                        );
                    }
                    return null;
                })}
            </div>
            <UpgradeBanner className="hidden ml-auto 2xl:block" />
        </div>
    );
}
