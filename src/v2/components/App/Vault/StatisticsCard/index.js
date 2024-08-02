import StatisticCard from "./StatisticCard";
import { partiallyApply } from "@/v2/helpers/partiallyApply";

import pieSvg from "@/v2/assets/svg/pie.svg";
import diamondSvg from "@/v2/assets/svg/diamond.svg";
import courtSvg from "@/v2/assets/svg/court.svg";
import balanceSvg from "@/v2/assets/svg/account-balance.svg";

export const SizeStatisticCard = partiallyApply(StatisticCard, { title: "Projects Invested", icon: pieSvg });
export const ReturnStatisticCard = partiallyApply(StatisticCard, { title: "Returns", icon: courtSvg });
export const InvestedStatisticCard = partiallyApply(StatisticCard, { title: "Portfolio Size", icon: diamondSvg });
export const PartnersStatisticCard = partiallyApply(StatisticCard, { title: "Partners", icon: courtSvg });
export const RaisedStatisticCard = partiallyApply(StatisticCard, { title: "Raised", icon: diamondSvg });

export const RewardStatisticCard = partiallyApply(StatisticCard, { title: "Total Rewards", icon: balanceSvg });

export const InvitersStatisticCard = partiallyApply(StatisticCard, { title: "Total Inviters", icon: diamondSvg });

export const DiscountsStatisticCard = partiallyApply(StatisticCard, { title: "Discounts", icon: diamondSvg });

export default StatisticCard;
