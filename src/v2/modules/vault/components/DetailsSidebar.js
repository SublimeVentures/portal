import { useState } from "react";
import Image from "next/image";
import { useQuery } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";

import { useEnvironmentContext } from "@/lib/context/EnvironmentContext";
import { fetchInvestmentPayout } from "@/fetchers/payout.fetcher";

import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetBody,
  SheetTitle,
} from "@/v2/components/ui/sheet";
import { IconButton } from "@/v2/components/ui/icon-button";
import GoBackIcon from "@/v2/assets/svg/go-back.svg";
import { Button } from "@/v2/components/ui/button";

import DetailsView from "./DetailsView";
import DetailsTimeline from "./DetailsTimeline";
import useTimelineData from "../logic/useTimelineData";

export const views = Object.freeze({ details: 'details', timeline: 'timeline' })

const variants = {
  initial: direction => ({
      x: direction === views.details ? 250 : -250,
      opacity: 0,
  }),
  animate: {
      x: 0,
      opacity: 1,
      transition: { duration: 0.2 },
  },
  exit: direction => ({
      x: direction === views.details ? -250 : 250,
      opacity: 0,
      transition: { duration: 0.2 },
  }),
};

export default function DetailsSidebar({ isModalOpen, setIsModalOpen, claimModalProps, userId }) {
    const { cdn } = useEnvironmentContext();

    const {
        id: offerId,
        name,
        slug,
        participated,
        tgeParsed,
        vestedPercentage,
        nextSnapshot,
        nextClaim,
        nextUnlock,
        isManaged,
        ticker,
        refetchVault,
        vaultData,
        invested,
        createdAt,
    } = claimModalProps;

    const { notifications } = useTimelineData(offerId)

    const { isSuccess: isSuccessPayouts, data: payouts, refetch: refetchPayouts } = useQuery({
        queryKey: ["userPayouts", userId, offerId],
        queryFn: () => fetchInvestmentPayout(offerId),
        refetchOnMount: false,
        refetchOnWindowFocus: false,
        cacheTime: 5 * 60 * 1000,
        staleTime: 1 * 30 * 1000,
        enabled: offerId > 0,
    });

    const availablePayouts = isSuccessPayouts ? payouts.reduce((acc, obj) => acc + obj.amount, 0) : 0;
    const isNextPayout = isSuccessPayouts && payouts.length > 0;
    const nextPayout = isNextPayout ? payouts[0] : null;
    const { currencySymbol, precision, chainId } = nextPayout || {};
    const symbol = currencySymbol || (isManaged ? "USD" : ticker);
    const currency = { symbol, precision: precision ?? null, chainId: chainId ?? null };
    
    const claimed = offerId > 0 ? vaultData.find((el) => el.id === offerId)?.claimed : 0;
    const performance = (claimed / invested) * 100;

    const viewProps = {
      [views.details]: {
        vestedPercentage,
        invested,
        claimed,
        currency,
        isManaged,
        tgeParsed,
        availablePayouts,
        performance,
        participated,
        nextUnlock,
        nextSnapshot,
        nextClaim,
        ticker,
        createdAt,
        notifications,
      },
      [views.timeline]: {
        notifications,
      }
    }

    const [currentView, setCurrentView] = useState(views.details);

    const renderView = (view, props) => {
        switch (view) {
            case views.details:
                return <DetailsView setView={setCurrentView} {...props} />;
            case views.timeline:
                return <DetailsTimeline setView={setCurrentView} {...props} />;
            default:
                return null;
        }
    };

    return (
        <Sheet open={isModalOpen} onOpenChange={setIsModalOpen}>
          <SheetContent className="h-full flex flex-col rounded-t-lg">
              <SheetHeader className="min-h-48">
                  <div className="rounded-lg">
                      <Image
                          src={`${cdn}/research/${slug}/icon.jpg`}
                          className="p-1 rounded-full boxshadow"
                          alt={slug}
                          width={100}
                          height={100}
                      />
                  </div>
                  <SheetTitle>{name}</SheetTitle>
                  <SheetDescription>{ticker}</SheetDescription>

                  <IconButton
                      name={currentView === views.details ? "Go to timeline" : "Go to token details"}
                      variant="primary"
                      shape="circle"
                      icon={GoBackIcon}
                      className="absolute -top-1 -right-1 sm:hidden"
                  />
              </SheetHeader>

              <SheetBody className='relative'>
                  <AnimatePresence mode="wait">
                      <motion.div
                          key={currentView}
                          custom={currentView}
                          initial="initial"
                          animate="animate"
                          exit="exit"
                          variants={variants}
                          className="absolute w-full"
                      >
                          <div className="mx-10 my-4 sm:px-10">
                              {renderView(currentView, viewProps[currentView])}
                          </div>
                      </motion.div>
                  </AnimatePresence>
              </SheetBody>

              <SheetFooter>
                  <SheetClose asChild>
                      <Button variant="accent" type="submit">Claim</Button>
                  </SheetClose>
                  
                  <p className="text-xxs text-foreground/[.5]">You will automatically receive {ticker} token after settlement.</p>
              </SheetFooter> 
          </SheetContent>
      </Sheet>
    );
}
