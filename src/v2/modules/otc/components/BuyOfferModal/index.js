import Image from "next/image";
import { ChevronRightIcon } from "@radix-ui/react-icons";

import { Button } from "@/v2/components/ui/button";
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
import DefinitionItem from "@/v2/components/Definition/DefinitionItem";
import AnalyserTool from "../AnalyserTool";

const icon = `https://cdn.basedvc.fund/research/blockgames/icon.jpg`

// @TODO - Decide when the designs will be done - Section wrapper, background component 
const BuyOfferModalContent = () => {
    return (
        <div className="mx-10 my-4 sm:px-10">
            <div className="definition-section">
                <h3 className="text-2xl font-medium text-foreground text-center">OTC Offer</h3>
                <p className="mb-2 text-md text-foreground text-center">Are you sure you want to sell your allocation to buy this offer?</p>
                <dl className="definition-grid">
                    <DefinitionItem term="Market">Gunzilla</DefinitionItem>
                    <DefinitionItem term="Type" className="text-green-500">Buy</DefinitionItem>
                    <DefinitionItem term="Blockchain">
                        <Image src={icon} className="inline mx-2 rounded-full" alt="" width={20} height={20} />
                        <span>Ethereum</span>
                    </DefinitionItem>
                    <DefinitionItem term="Amount">$200</DefinitionItem>
                    <DefinitionItem term="Price">$10</DefinitionItem>
                    <DefinitionItem term="Fees">$30</DefinitionItem>
                </dl>
            </div>
            <AnalyserTool />

            <div>
                <h3 className="pb-2 pt-4 px-8 text-lg font-medium text-foreground">Overview</h3>
                <div className='py-4 px-8 flex justify-between items-center bg-foreground/[.1]'>
                    <div className="flex items-center">
                        <Image src={icon} className="inline mx-2 rounded-full" alt="Cover image of ${name} token" width={35} height={35} />
                        <dl>
                            <DefinitionItem term="You Pay">$30</DefinitionItem>
                        </dl>
                    </div>
                    <ChevronRightIcon className="text-foreground"/>
                    <div className="flex items-center">
                        <Image src={icon} className="inline mx-2 rounded-full" alt="Cover image of ${name} token" width={35} height={35} />
                        <dl>
                            <DefinitionItem DefinitionItem term="You Recieve">30</DefinitionItem>
                        </dl>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default function BuyOfferModal() {
    return (
      <Sheet>
          <SheetTrigger asChild>
              <Button variant="outline">Open</Button>
          </SheetTrigger>

          <SheetContent className="h-full flex flex-col rounded-t-lg">
              <SheetHeader>
                  <Image
                    src={icon}
                    className="inline mx-2 rounded-full"
                    alt=""
                    width={100}
                    height={100}
                  />
                  <SheetTitle>Gunzilla</SheetTitle>
                  <SheetDescription>Gamify</SheetDescription>
              </SheetHeader>

              <SheetBody>
                  <BuyOfferModalContent />
              </SheetBody>

              <SheetFooter>
                  <SheetClose asChild>
                      <Button variant="accent" type="submit">Buy</Button>
                  </SheetClose>
                  
                  <p className="text-xxs text-foreground/[.5]">You will automatically receive $GUN tokens after settlement.</p>
              </SheetFooter> 
          </SheetContent>
      </Sheet>
    );
}
