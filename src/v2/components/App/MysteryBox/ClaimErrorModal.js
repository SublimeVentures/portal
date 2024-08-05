import Link from "next/link";
import { ExternalLinks } from "@/routes";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/v2/components/ui/dialog";

export default function ClaimErrorModal({ model, setter, errorMessage }) {
    return (
        <Dialog open={model}>
            <DialogContent handleClose={setter}>
                <DialogHeader>
                    <DialogTitle>Claim error</DialogTitle>
                </DialogHeader>
                <p className="text-lg text-white">
                    {errorMessage} <Link href={ExternalLinks.LOOTBOX}>Read more</Link>.
                </p>
            </DialogContent>
        </Dialog>
    );
}
