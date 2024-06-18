import Image from "next/image";
import { ChevronDownIcon } from "@radix-ui/react-icons";

import { RadioGroup, RadioGroupItem } from "@/v2/components/ui/radio-group";
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

const CreateOfferModalContent = () => {
    return (
        <div className="mx-10 my-4 sm:px-10">
            <div className="mb-2 mt-4 py-4 px-2 flex flex-col gap-4 bg-foreground/[.02] rounded">
                <h3 className="pt-4 px-8 text-lg font-medium text-foreground">Market</h3>
                <div className="py-2 px-8 flex flex-col gap-4 bg-foreground/[.06] rounded">
                  <div className="flex items-center">
                      <Image src={icon} className="inline mr-2 rounded-full" alt="" width={40} height={40} />
                      <div>
                          <p className="text-lg font-medium text-foreground">Gunzilla</p>
                          <p className="text-md font-light text-foreground/[.9]">$GUN</p>
                      </div>
                  </div>
                </div>

                <div className="pt-4 px-8">
                    <h3 className="mb-4 text-lg font-medium text-foreground">Type</h3>
                    <RadioGroup defaultValue="option-one">
                        <div className="flex items-center cursor-pointer">
                            <RadioGroupItem value="option-one" id="option-one" />
                            <label htmlFor="option-one" className="ml-8">
                                <span className="block text-lg text-foreground">Buying</span>
                                <span className="text-md text-foreground">You want to buy Tokens</span>
                            </label>
                        </div>
                        <div className="flex items-center cursor-pointer">
                            <RadioGroupItem value="option-two" id="option-two" />
                            <label htmlFor="option-two" className="ml-8">
                                <span className="block text-lg text-foreground">Selling</span>
                                <span className="text-md text-foreground">You want to sell your tokens</span>
                            </label>
                        </div>
                    </RadioGroup>
                </div>

                <h3 className="pt-4 px-8 text-lg font-medium text-foreground">Your offer</h3>
                <div className="py-2 px-8 flex flex-col gap-4 bg-foreground/[.06] rounded">
                  <div className="flex items-center">
                      <Image src={icon} className="inline mr-2 rounded-full" alt="" width={40} height={40} />
                      <div>
                          <p className="text-md font-light text-foreground/[.9]">You Offer</p>
                          <p className="text-lg font-medium text-foreground">20 $GUN</p>
                      </div>
                  </div>
                </div>
                <div className="py-2 px-8 flex flex-col gap-4 bg-foreground/[.06] rounded">
                  <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        <Image src={icon} className="inline mr-2 rounded-full" alt="" width={40} height={40} />
                        <div>
                            <p className="text-md font-light text-foreground/[.9]">You Receive</p>
                            <p className="text-lg font-medium text-foreground">$30</p>
                        </div>
                      </div>
                      <ChevronDownIcon className="text-foreground" />
                  </div>
                </div>
                
            </div>

            <AnalyserTool />
        </div>
    )
}

export default function CreateOfferModal() {
  return (
    <Sheet>
      <SheetTrigger asChild>
          <Button variant="outline">Open</Button>
      </SheetTrigger>

      <SheetContent className="h-full flex flex-col rounded-t-lg">
          <SheetHeader>
              <SheetTitle>Create Offer</SheetTitle>
              <SheetDescription>OTC Marketplace</SheetDescription>
          </SheetHeader>

          <SheetBody>
              <CreateOfferModalContent />
          </SheetBody>

          <SheetFooter>
              <SheetClose asChild>
                  <Button variant="accent" type="submit">Create Offer</Button>
              </SheetClose>
              
              <p className="text-xxs text-foreground/[.5]">Read more before making an offer.</p>
          </SheetFooter> 
      </SheetContent>
  </Sheet>
  );
}
