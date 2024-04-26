import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
 
const WalletErrorModal = () => {
    return (
        <Dialog>
            <DialogTrigger asChild>
              <Button>Open wallet error modal</Button>
            </DialogTrigger>

            <DialogContent >
              <DialogHeader>
                <DialogTitle>Wallet Error</DialogTitle>
                <DialogDescription>
                  You've changed the wallet account. You can only use wallets approved in the {" "}
                  <Link href="/">settings page</Link>
                </DialogDescription>
              </DialogHeader>

              <div className="py-4 px-6 flex justify-between bg-destructive/[.25] rounded">
                <div>
                  <h3 className="text-destructive font-medium text-lg">Unknown Wallet</h3>
                  <p className="text-md text-destructive ">0x12d56441e8A34f751954fFB7f02F9B42d6Ee90eF</p>
                </div>
                <Button variant="destructive">Logout</Button>
              </div>
            </DialogContent>
        </Dialog>
    )
}

export default WalletErrorModal;
