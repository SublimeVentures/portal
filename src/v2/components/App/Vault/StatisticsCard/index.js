import StatisticCard from './StatisticCard'
import { partiallyApply } from '@/v2/helpers/partiallyApply';

import pieSvg from "@/v2/assets/svg/pie.svg";
import diamondSvg from "@/v2/assets/svg/diamond.svg";
import courtSvg from "@/v2/assets/svg/court.svg";

export const SizeStatisticCard = partiallyApply(StatisticCard, { title: "Portfolio Size", icon: pieSvg });
export const ReturnStatisticCard = partiallyApply(StatisticCard, { title: "Returns", icon: diamondSvg });
export const InvestedStatisticCard = partiallyApply(StatisticCard, { title: "Invested", icon: courtSvg });
export const PartnersStatisticCard = partiallyApply(StatisticCard, { title: "Partners", icon: courtSvg });
export const RaisedStatisticCard = partiallyApply(StatisticCard, { title: "Raised", icon: diamondSvg });

export default StatisticCard;
