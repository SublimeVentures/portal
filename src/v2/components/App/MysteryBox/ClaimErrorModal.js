import { ExternalLinks } from "@/routes";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/v2/components/ui/dialog";
import ExternalLink from "@/v2/components/ui/external-link";

export default function ClaimErrorModal({ model, setter, errorMessage }) {
    return (
        <Dialog open={model}>
            <DialogContent handleClose={setter}>
                <DialogHeader>
                    <DialogTitle>Claim error</DialogTitle>
                </DialogHeader>
                <p className="text-lg text-white">
                    {errorMessage} <ExternalLink href={ExternalLinks.LOOTBOX} />
                </p>
            </DialogContent>
        </Dialog>
    );
}
