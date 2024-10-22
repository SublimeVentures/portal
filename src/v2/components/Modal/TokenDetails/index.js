import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

import DetailsView from "./DetailsView";
import TimelineView from "./TimelineView";
import { Button } from "@/v2/components/ui/button";
import { Avatar } from "@/v2/components/ui/avatar";
import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetDescription,
    SheetFooter,
    SheetHeader,
    SheetBody,
    SheetTitle,
    SheetTrigger,
} from "@/v2/components/ui/sheet";

import { IconButton } from "@/v2/components/ui/icon-button";
import GoBackIcon from "@/v2/assets/svg/go-back.svg";

export const views = Object.freeze({ details: "details", timeline: "timeline" });

const variants = {
    initial: (direction) => ({
        x: direction === views.details ? 250 : -250,
        opacity: 0,
    }),
    animate: {
        x: 0,
        opacity: 1,
        transition: { duration: 0.2 },
    },
    exit: (direction) => ({
        x: direction === views.details ? -250 : 250,
        opacity: 0,
        transition: { duration: 0.2 },
    }),
};

const TokenDetails = () => {
    const [currentView, setCurrentView] = useState(views.details);

    const renderView = (view) => {
        switch (view) {
            case views.details:
                return <DetailsView setView={setCurrentView} />;
            case views.timeline:
                return <TimelineView setView={setCurrentView} />;
            default:
                return null;
        }
    };

    return (
        <Sheet>
            <SheetTrigger asChild>
                <Button variant="outline">Open</Button>
            </SheetTrigger>

            <SheetContent className="h-full flex flex-col rounded-t-lg">
                <SheetHeader>
                    <Avatar session={null} />
                    <SheetTitle>Gaimin</SheetTitle>
                    <SheetDescription>GMRX</SheetDescription>

                    <IconButton
                        name={currentView === views.details ? "Go to timeline" : "Go to token details"}
                        variant="primary"
                        shape="circle"
                        icon={GoBackIcon}
                        className="absolute -top-1 -right-1 sm:hidden"
                    />
                </SheetHeader>

                <SheetBody>
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
                            <div className="mx-10 my-4 sm:px-10">{renderView(currentView)}</div>
                        </motion.div>
                    </AnimatePresence>
                </SheetBody>

                <SheetFooter>
                    <SheetClose asChild>
                        <Button variant="secondary" type="submit">
                            Claim
                        </Button>
                    </SheetClose>

                    <p className="text-xxs text-white/50">
                        You will automatically receive GMRX token after settlement.
                    </p>
                </SheetFooter>
            </SheetContent>
        </Sheet>
    );
};

export default TokenDetails;
