import Content from "./Content";
import { Sheet, SheetContent, SheetTrigger } from "@/v2/components/ui/sheet";

export default function ClaimModal({ children, data }) {
    return (
        <Sheet>
            <SheetTrigger asChild>{children}</SheetTrigger>
            <SheetContent className="flex flex-col max-h-dvh">
                <Content data={data} />
            </SheetContent>
        </Sheet>
    );
}
