import PropTypes from "prop-types";
import { IoCheckmarkOutline, IoClipboard, IoClipboardOutline } from "react-icons/io5";
import { useEffect, useRef, useState } from "react";

export default function InlineCopyButton({ copiable = "", className }) {
    const [isCheckmark, setIsCheckmark] = useState(false);
    const [hover, setHover] = useState(false);
    const timerId = useRef(/** @type {Timeout} */ null);
    const btnRef = useRef(/** @type {HTMLButtonElement} */ null);

    useEffect(() => {
        return () => {
            if (timerId !== null) {
                clearTimeout(timerId.current);
                timerId.current = null;
            }
        };
    }, [timerId]);

    const onCopy = async (ev) => {
        const copiable = ev.currentTarget.dataset.copiable;
        await window.navigator.clipboard.writeText(copiable);
        setIsCheckmark(true);
        timerId.current = setTimeout(() => {
            setIsCheckmark(false);
        }, 1000);
    };

    const btnListeners = {
        onMouseOver: () => setHover(true),
        onMouseOut: () => setHover(false),
        onBlur: () => setHover(false),
        onFocus: () => setHover(true),
        onMouseEnter: () => setHover(true),
        onMouseLeave: () => setHover(false),
        onClick: onCopy,
    };

    return (
        <button ref={btnRef} {...btnListeners} data-copiable={copiable}>
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
