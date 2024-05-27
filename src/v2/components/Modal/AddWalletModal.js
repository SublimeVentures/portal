import { Button } from "@/v2/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/v2/components/ui/dialog";
 
const AddWalletModal = () => {
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button>Open add wallet modal</Button>
            </DialogTrigger>

            <DialogContent>
                <DialogHeader>
                <DialogTitle>Add Wallet</DialogTitle>
                    <DialogDescription>You can add up to 2 more wallets to your account. Switch to wallet you want to add, and sign mesage.</DialogDescription>
                </DialogHeader>
                
                <div className="flex items-center">
                    <div className="h-6 w-6 flex items-center justify-center bg-destructive/[.25] text-destructive rounded-full">!</div>
                    <p className="ml-2 text-lg font-light text-destructive">Wallet can be assigned only to one account.</p>
                </div>
                <Button variant="gradient">Add Wallet</Button>
            </DialogContent>
        </Dialog>
    );
};

export default AddWalletModal;
