import Image from "next/image";
import { useState, forwardRef } from "react";
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetBody,
    SheetTitle,
    SheetTrigger,
} from "@/v2/components/ui/sheet";
import { Button as ModalButton } from "@/v2/modules/upgrades/Modal";
import DefinitionItem from "@/v2/components/Definition/DefinitionItem";
import useBlockchainStep from "@/v2/components/BlockchainSteps/useBlockchainStep";
import BlockchainSteps from "@/v2/components/BlockchainSteps";
import { METHOD } from "@/components/BlockchainSteps/utils";
import { useEnvironmentContext } from "@/lib/context/EnvironmentContext";
import { formatCurrency, formatPercentage } from "@/v2/helpers/formatters";
import { cn } from "@/lib/cn";
import useGetToken from "@/lib/hooks/useGetToken";
import { useNotificationInfiniteQuery } from "@/v2/modules/notifications/logic/useNotificationInfiniteLoader";
import TimelineItem from "@/v2/components/Timeline/TimelineItem";
import { IconButton } from "@/v2/components/ui/icon-button";
import { Button } from "@/v2/components/ui/button";
import ArrowIcon from "@/v2/assets/svg/arrow.svg";
import ScheduleIcon from "@/v2/assets/svg/schedule.svg";

export default function PercentWrapper({ value }) {
    return (
        <span
            className={cn({
                "text-green-400": Number(value) > 0,
                "text-red-500": Number(value) < 0,
            })}
        >
            {Number(value) == 0 ? "TBA" : formatPercentage(value / 100, true)}
        </span>
    );
}
