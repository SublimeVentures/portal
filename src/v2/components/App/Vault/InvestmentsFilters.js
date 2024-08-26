import React from "react";
import { ViewRadio } from "@/v2/components/App/Vault";
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
import FilterAltIcon from "@/v2/assets/svg/filter-alt.svg";
import Header from "@/v2/components/App/Upgrades/Header";

const SORT_BY = {
    CREATED_AT: "createdAt",
    PERFORMANCE: "performance",
};

const DEFAULT_SORT_BY = SORT_BY.CREATED_AT;

export const exclude = (obj, ...keys) => {
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

export const FilterButton = ({ children, ...props }) => (
    <Button variant="secondary" className="px-3 gap-3 md:px-6 md:gap-3.5 flex items-center" {...props}>
        {children}
        <CrossIcon className="size-2 stroke-2" />
    </Button>
);

export default function InvestmentsList({ investments, views, query, onChange, className }) {
    const { view, sortBy = DEFAULT_SORT_BY } = query;
    return (
        <Header
            className={className}
            title="My Investments"
            count={investments.length + 1}
            bannerClassName="hidden sm:block"
            affix={<ViewRadio options={views} value={view} onChange={(view) => onChange({ ...query, view })} />}
        >
            <div className="flex items-center flex-wrap gap-2 sm:gap-4">
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
        </Header>
    );
}
