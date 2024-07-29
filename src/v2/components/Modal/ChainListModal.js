// import ChainsList from "@/v2/components/App/Vault/ChainsList";
import { Button } from "@/v2/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/v2/components/ui/dialog";
 
const ChainListModal = () => {
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button>Open chain list modal</Button>
            </DialogTrigger>

            <DialogContent>
                <DialogHeader>
                <DialogTitle className="text-center">Chain not supported</DialogTitle>
                    <DialogDescription className="text-center">
                        Currently our platform supports 5 chains. <br />
                        Please switch to one of these to continue
                    </DialogDescription>
                </DialogHeader>
                
                <div className="flex items-center justify-center">
                    {/* <ChainsList /> */}
                </div>

                <p className="text-xxs text-white/[.7] text-center">Current selection: Ethereum</p>
            </DialogContent>
        </Dialog>
    );
};

export default ChainListModal;
