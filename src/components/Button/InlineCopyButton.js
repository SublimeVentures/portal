import PropTypes from "prop-types";
import { IoCheckmarkOutline, IoClipboard, IoClipboardOutline } from "react-icons/io5";
import { useEffect, useState } from "react";

export default function InlineCopyButton({ copiable, className }) {
    const [isCheckmark, setIsCheckmark] = useState(false);
    const [hover, setHover] = useState(false);
    const [timerId, setTimerId] = useState(/** @type {Timeout} */ null);

    useEffect(() => {
        return () => {
            if (timerId !== null) {
                clearTimeout(timerId);
                setTimerId(null);
            }
        };
    }, [timerId]);

    const onCopy = async (ev) => {
        const copiable = ev.currentTarget.dataset.copiable;
        await window.navigator.clipboard.writeText(copiable);
        setIsCheckmark(true);
        setTimerId(
            setTimeout(() => {
                setIsCheckmark(false);
            }, 1000),
        );
    };

    return (
        <button
            onMouseOut={() => setHover(false)}
            onMouseOver={() => setHover(true)}
            onClick={onCopy}
            data-copiable={copiable}
        >
            {isCheckmark ? (
                <IoCheckmarkOutline className={className} />
            ) : hover ? (
                <IoClipboard className={className} />
            ) : (
                <IoClipboardOutline className={className} />
            )}
        </button>
    );
}

InlineCopyButton.propTypes = {
    copiable: PropTypes.string.isRequired,
    className: PropTypes.string,
};
