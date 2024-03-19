import { Fragment, useEffect, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { ButtonIconSize } from "@/components/Button/RoundButton";
import { IoCloseCircleOutline as CancelIcon } from "react-icons/io5";
import { isBased } from "@/lib/utils";

export default function GenericRightModal({ isOpen, closeModal, title, content, persistent, noClose }) {
    const [isShake, setShake] = useState(false);

    const closeModalOnBg = () => {
        if (!persistent) closeModal();
        else {
            setShake(true);
            setTimeout(function () {
                setShake(false);
            }, 1000);
        }
    };

    useEffect(() => {
        const handleKeyDown = (event) => {
            if (event.key === "Escape") {
                if (!persistent) {
                    closeModal();
                }
            }
        };

        // Add event listener
        window.addEventListener("keydown", handleKeyDown);

        // Remove event listener on cleanup
        return () => {
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, [isOpen]);

    return (
        <Transition appear show={isOpen} as={Fragment}>
            <Dialog as="div" className="relative z-30 " onClose={() => closeModalOnBg()}>
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 blurred5 bg-opacity-5" />
                </Transition.Child>

                <div className="fixed inset-0 overflow-y-auto min-h-full">
                    <div className="flex min-h-full items-center justify-end text-center ">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 scale-95"
                            enterTo="opacity-100 scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 scale-100"
                            leaveTo="opacity-0 scale-95"
                        >
                            <Dialog.Panel
                                className={`dialogWrap flex flex-col min-h-screen glareBg w-full min-h-full sm:max-w-md transform overflow-hidden  glareBg text-white p-10 bg-app-bg text-start transition-all ${isShake ? "shake" : ""} ${isBased ? "" : "font-accent"}`}
                            >
                                <Dialog.Title as="h3" className="text-3xl font-bold pb-5 pt-5">
                                    <span className={`${isBased ? "" : "font-light"}`}>{title}</span>
                                    {!noClose && (
                                        <div
                                            className={`absolute top-[20px] right-[0px] cursor-pointer`}
                                            onClick={closeModal}
                                        >
                                            <CancelIcon className={ButtonIconSize.hero} />
                                        </div>
                                    )}
                                </Dialog.Title>
                                {content}
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition>
    );
}
