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
import AnalyserTool from "../AnalyserTool";

const icon = `https://cdn.basedvc.fund/research/blockgames/icon.jpg`

const BuyOfferModalContent = () => {
    return (
        <div className="mx-10 my-4 sm:px-10">
            <div className="mb-2 mt-4 py-4 px-8 flex flex-col gap-4 bg-foreground/[.02] rounded">
                <h3 className="text-2xl font-medium text-foreground text-center">OTC Offer</h3>
                <p className="mb-2 text-md text-foreground text-center">Are you sure you want to sell your allocation to buy this offer?</p>
                <dl className="grid grid-cols-2">
                    <dt className="h-8 text-md font-light text-foreground leading-none">Market</dt>
                    <dd className="h-8 text-lg font-medium text-foreground leading-none justify-self-end">Gunzilla</dd>
                    <dt className="h-8 text-md font-light text-foreground leading-none">Type</dt>
                    <dd className="h-8 text-lg font-medium text-green-500 leading-none justify-self-end">Buy</dd>
                    <dt className="h-8 text-md font-light text-foreground leading-none">Blockchain</dt>
                    <dd className="h-8 text-lg font-medium text-foreground leading-none justify-self-end">
                      <Image src={icon} className="inline mx-2 rounded-full" alt="" width={20} height={20} />
                      <span>Ethereum</span>
                    </dd>
                    <dt className="h-8 text-md font-light text-foreground leading-none">Amount</dt>
                    <dd className="h-8 text-lg font-medium text-foreground leading-none justify-self-end">$200</dd>
                    <dt className="h-8 text-md font-light text-foreground leading-none">Price</dt>
                    <dd className="h-8 text-lg font-medium text-foreground leading-none justify-self-end">$10</dd>
                    <dt className="h-8 text-md font-light text-foreground leading-none">Fees</dt>
                    <dd className="h-8 text-lg font-medium text-foreground leading-none justify-self-end">$30</dd>
                </dl>
            </div>
            <AnalyserTool />

            <div>
              <h3 className="pb-2 pt-4 px-8 text-lg font-medium text-foreground">Overview</h3>
              <div className='py-4 px-8 flex justify-between items-center bg-foreground/[.1]'>
                <div className="flex items-center">
                    <Image
                      src={icon}
                      className="inline mx-2 rounded-full"
                      alt=""
                      width={35}
                      height={35}
                    />
                  <dl>
                    <dt className="text-md font-light text-foreground">You Pay</dt>
                    <dd className="text-lg font-medium text-foreground leading-none justify-self-end">$30</dd>
                  </dl>
                </div>
                <ChevronRightIcon className="text-foreground"/>
                <div className="flex items-center">
                  <Image
                    src={icon}
                    className="inline mx-2 rounded-full"
                    alt=""
                    width={35}
                    height={35}
                  />
                  <dl>
                    <dt className="text-md font-light text-foreground">You Recieve</dt>
                    <dd className="text-lg font-medium text-foreground leading-none justify-self-end">30</dd>
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
