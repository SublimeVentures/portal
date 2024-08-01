import { CopyToClipboard } from "react-copy-to-clipboard";
import { useState } from "react";
import { CopyIcon, CheckIcon } from "@radix-ui/react-icons";

export default function Copy({ text }) {
    const [showCopiedMessage, setShowCopiedMessage] = useState(false);

    const handleCopy = () => {
        setShowCopiedMessage(true);
        setTimeout(() => {
            setShowCopiedMessage(false);
        }, 1000);
    };

    return (
        <CopyToClipboard text={text} onCopy={handleCopy}>
            <span className="flex">
                <span>{text}</span>{" "}
                {showCopiedMessage ? <CheckIcon className="w-6 h-6" /> : <CopyIcon className="w-6 h-6" />}
            </span>
        </CopyToClipboard>
    );
}
