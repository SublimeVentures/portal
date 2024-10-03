import { CONNECTION_TYPE } from "./helpers";
import ConnectionField from "./ConnectionField";
import { Card, CardTitle, CardDescription } from "@/v2/components/ui/card";
import { CheckboxField } from "@/v2/components/ui/checkbox";

export default function NotificationsSettings() {
    return (
        <Card variant="none" className="h-full w-full flex flex-col grow bg-settings-gradient overflow-hidden">
            <div className="flex flex-col grow gap-12 block-scrollbar overflow-y-auto px-4">
                <div>
                    <CardTitle className="text-base font-medium text-white 3xl:text-lg">
                        Notifications <span className="hidden md:inline">Settings</span>
                    </CardTitle>
                    <CardDescription className="hidden lg:block text-xs 3xl:text-sm font-light">
                        View and update your personal preference
                    </CardDescription>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-1 3xl:grid-cols-2 gap-8 sm:gap-2 3xl:gap-8">
                    <CheckboxField id="announcements">Announcements</CheckboxField>
                    <CheckboxField id="offer_updates">Offer updates</CheckboxField>
                    <CheckboxField id="payouts">Payouts</CheckboxField>
                    <CheckboxField id="otc">OTC</CheckboxField>
                </div>

                <div className="flex flex-col gap-4">
                    <ConnectionField
                        isConnected
                        name="Webpush"
                        id={CONNECTION_TYPE.WEBPUSH}
                        placeholder="Fill in username"
                    />
                    <ConnectionField
                        isConnected
                        name="Discord"
                        id={CONNECTION_TYPE.DISCORD}
                        placeholder="Fill in discord username"
                    />
                    <ConnectionField name="SMS" id={CONNECTION_TYPE.SMS} placeholder="Fill in phone number" />
                    <ConnectionField name="Email" id={CONNECTION_TYPE.EMAIL} placeholder="Fill in email address" />
                </div>
            </div>

            {/* Make element disabled for now */}
            <div className="absolute top-0 left-0 flex items-center justify-center w-full h-full bg-black/[.6] cursor-not-allowed select-none">
                <div className="bg-black/[.5] rounded p-4 text-white">Work in progress</div>
            </div>
        </Card>
    );
}
