import { useState } from "react";
import { CopyIcon, CheckIcon } from "@radix-ui/react-icons";
import { CopyToClipboard } from "react-copy-to-clipboard";

export default function Copy({ value, text }) {
    const [showCopiedMessage, setShowCopiedMessage] = useState(false);

    {
        /* Button disabled because of mocked address */
    }
    const handleCopy = () => {
        return;

        setShowCopiedMessage(true);
        setTimeout(() => {
            setShowCopiedMessage(false);
        }, 1000);
    };

    return (
        <CopyToClipboard text={value} onCopy={handleCopy}>
            <span className="text-sm flex items-center gap-3">
                <span>{text}</span>{" "}
                {showCopiedMessage ? <CheckIcon className="w-6 h-6" /> : <CopyIcon className="w-6 h-6" />}
            </span>
        </CopyToClipboard>
    );
}
