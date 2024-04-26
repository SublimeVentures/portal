import { ArrowTopRightIcon } from "@radix-ui/react-icons";

import { Button } from "@/components/ui/button";
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
} from "@/components/ui/sheet";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
 
const TokenDetails = () => {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline">Open</Button>
      </SheetTrigger>

      <SheetContent className="h-full flex flex-col">
          <SheetHeader>
              <Avatar size="large" classNama="bg-black">
                  <AvatarImage src="" />
                  <AvatarFallback>CN</AvatarFallback>
              </Avatar>
              <SheetTitle>Gaimin</SheetTitle>
              <SheetDescription>GMRX</SheetDescription>
          </SheetHeader>

          <SheetBody>
              <h3 className="pb-2 pt-4 px-8 text-lg font-medium text-foreground">Status</h3>
              <dl className='py-4 px-8 flex flex-col gap-4 bg-foreground/[.02]'>
                  <div className="flex justify-between items-center">
                      <dt className="text-md font-light text-foreground">Progress</dt>
                      <dd className="text-lg font-medium text-foreground">10%</dd>
                  </div>
                  <div className="flex justify-between items-center">
                      <dt className="text-md font-light text-foreground">Invested</dt>
                      <dd className="text-lg font-medium text-foreground">5000,00 USD</dd>
                  </div>
                  <div className="flex justify-between items-center">
                      <dt className="text-md font-light text-foreground">Vested</dt>
                      <dd className="text-lg font-medium text-foreground">3834,00 USD</dd>
                  </div>
              </dl>
              
              <h3 className="pb-2 pt-4 px-8 text-lg font-medium text-foreground">Performance</h3>
              <dl className='py-4 px-8 flex flex-col gap-4 bg-foreground/[.02]'>
                <div className="flex justify-between items-center">
                    <dt className="text-md font-light text-foreground">TGE gain</dt>
                    <dd className="text-lg font-medium text-foreground">TBA</dd>
                </div>
                <div className="flex justify-between items-center">
                    <dt className="text-md font-light text-foreground">Return</dt>
                    <dd className="text-lg font-medium text-foreground text-green-500">+76,68%</dd>
                </div>
              </dl>

              <h3 className="pb-2 pt-4 px-8 text-lg font-medium text-foreground">Dates</h3>
              <dl className='py-4 px-8 flex flex-col gap-4 bg-foreground/[.02]'>
                <div className="flex justify-between items-center">
                      <dt className="text-md font-light text-foreground">Participated</dt>
                      <dd className="text-lg font-medium text-foreground">03.04.2023</dd>
                  </div>
                  <div className="flex justify-between items-center">
                      <dt className="text-md font-light text-foreground">Next Unlock</dt>
                      <dd className="text-lg font-medium text-foreground">TBA</dd>
                  </div>
                  <div className="flex justify-between items-center">
                      <dt className="text-md font-light text-foreground">Allocation Snapshot</dt>
                      <dd className="text-lg font-medium text-foreground">TBA</dd>
                  </div>
                  <div className="flex justify-between items-center">
                      <dt className="text-md font-light text-foreground">Claim Date</dt>
                      <dd className="text-lg font-medium text-foreground">TBA</dd>
                  </div>
                </dl>

              <div className="pb-2 pt-4 px-8 flex items-center">
                  <h3 className="mr-4 text-lg font-medium text-foreground">Timeline</h3>
                  <Button variant="link">
                      <span>See all</span>
                      <ArrowTopRightIcon className="ml-1" />
                  </Button>
              </div>

              <div className='py-4 px-8 flex flex-col gap-4 bg-foreground/[.1]'>
                <dl className="flex justify-between items-center">
                      <dt className="text-md font-light text-foreground">Claimed</dt>
                      <dd className="text-lg font-medium text-foreground">12.04.2024</dd>
                </dl>

                  <p className="text-md text-foreground">20 GMRX</p>
                  <p className="text-xxs text-foreground/[.25]">Claimed 2nd payout on BNB chain</p>
              </div>
          </SheetBody>

          <SheetFooter>
              <SheetClose asChild>
                  <Button variant="accent" type="submit">Claim</Button>
              </SheetClose>
              
              <p className="text-xxs text-foreground/[.5]">You will automatically receive GMRX token after settlement.</p>
          </SheetFooter> 
      </SheetContent>
    </Sheet>
  );
};

export default TokenDetails;
