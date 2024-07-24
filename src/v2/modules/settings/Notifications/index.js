import { Card, CardTitle, CardDescription } from "@/v2/components/ui/card";
import { CheckboxField } from "@/v2/components/ui/checkbox";
import ConnectionField from "./ConnectionField";
import { CONNECTION_TYPE } from "./helpers";

export default function NotificationsSettings() {
    return (
        <Card variant="none" className="py-6 px-12 flex flex-col gap-8 h-full w-full bg-settings-gradient">
            <div>
                <CardTitle className="text-2xl font-medium text-foreground leading-10">Notifications Settings</CardTitle>
                <CardDescription className="text-md font-light">View and update your personal preference</CardDescription>
            </div>
            
            <div className="grid grid-cols-2 gap-8">
                <CheckboxField id="announcements">Announcements</CheckboxField>
                <CheckboxField id="offer_updates">Offer updates</CheckboxField>
                <CheckboxField id="payouts">Payouts</CheckboxField>
                <CheckboxField id="otc">OTC</CheckboxField>
            </div>

            <div className="flex flex-col gap-4">
                <ConnectionField isConnected name="Webpush" id={CONNECTION_TYPE.WEBPUSH} placeholder="Fill in username" />
                <ConnectionField isConnected name="Discord" id={CONNECTION_TYPE.DISCORD} placeholder="Fill in discord username" />
                <ConnectionField name="SMS" id={CONNECTION_TYPE.SMS} placeholder="Fill in phone number" />
                <ConnectionField name="Email" id={CONNECTION_TYPE.EMAIL} placeholder="Fill in email address" />
            </div>
            
            {/* Make element disabled for now */}
            <div className="absolute top-0 left-0 flex items-center justify-center w-full h-full bg-black/[.6] cursor-not-allowed select-none">
                <div className="bg-black/[.5] rounded p-4 text-white">Work in progress</div>
            </div>
        </Card>
    );
};
