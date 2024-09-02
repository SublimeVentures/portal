import Image from "next/image";

import { Checkbox } from "@/v2/components/ui/checkbox";
import { Button } from "@/v2/components/ui/button";
import { Input } from "@/v2/components/ui/input";
import ArrowRightIcon from "@/v2/assets/svg/arrow-right.svg";
import { IconButton } from "@/v2/components/ui/icon-button";

export default function ConnectionField({
    id,
    name,
    placeholder,
    isConnected = false,
    value,
    onConnect,
    onDisconnect,
    onChange,
}) {
    return (
        <div className="p-4 bg-foreground/[.05] rounded shadow-lg">
            <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center">
                    <Image
                        src={`/img/icons/${id}.png`}
                        alt={`Image shows ${name} notification icon`}
                        width={50}
                        height={50}
                    />
                    <div className="ml-4 text-white">
                        <h4 className="text-sm font-medium">{name}</h4>
                        <p className="text-sm font-light text-foreground">
                            {isConnected ? `Connected: ${value}` : "Not found"}
                        </p>
                    </div>
                </div>

                <Checkbox id={id} onCheckedChange={onChange} />
            </div>

            {isConnected ? (
                <Button variant="outline" className="w-full" onClick={onDisconnect}>
                    Disconnect
                </Button>
            ) : (
                <div className="relative flex items-center justify-center">
                    <Input type="text" placeholder={placeholder} className="w-full" />
                    <IconButton
                        variant="primary"
                        name="Connect"
                        icon={ArrowRightIcon}
                        className="p-0 absolute top-3 right-2 w-6 h-6"
                        onClick={onConnect}
                    />
                </div>
            )}
        </div>
    );
}
