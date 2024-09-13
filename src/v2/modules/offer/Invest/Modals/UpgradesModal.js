import { IoDiamond } from "react-icons/io5";

import { Button } from "@/v2/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/v2/components/ui/dialog";

export default function CalculateModal() {
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button size="small" variant="outline" className="p-0 w-10 h-10 lg:py-1.5 lg:px-6 lg:w-auto">
                    <span className="hidden lg:inline">Use upgrades</span>
                    <IoDiamond className="lg:ml-2" />
                </Button>
            </DialogTrigger>

            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Use upgrade</DialogTitle>
                </DialogHeader>

                <div className="h-[400px] text-white bg-blue-900">
                  content
                </div>

                <DialogFooter className="flex items-center">
                    <div className="flex items-center gap-2">
                        <Button variant="outline">Buy upgrades</Button>
                        <Button>Use upgrade</Button>
                    </div>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
