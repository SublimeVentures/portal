import { Fragment, useEffect, useState } from "react";
import { IoCloseCircleOutline as CancelIcon } from "react-icons/io5";
import { Dialog, Transition } from "@headlessui/react";
import { ButtonIconSize } from "@/components/Button/RoundButton";
import { cn } from "@/lib/cn";

export default function GenericRightModal({ isOpen, closeModal, title, content, persistent, noClose, withTopMargin }) {
    const [isShake, setShake] = useState(false);

    const triggerShake = () => {
        setShake(true);
        setTimeout(() => setShake(false), 1000);
    };

    const closeModalOnBg = () => (persistent ? triggerShake() : closeModal());

    useEffect(() => {
        const handleKeyDown = (event) => {
            if (event.key === "Escape") {
                if (!persistent) {
                    closeModal();
                }
            }
        };

        window.addEventListener("keydown", handleKeyDown);

        return () => {
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, [isOpen]);

    const top = withTopMargin ? `top-[80px]` : `top-[20px]`;

    return (
        <Transition appear show={isOpen} as={Fragment}>
            <Dialog as="div" className="relative z-30" onClose={closeModalOnBg}>
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

                <div className="fixed inset-0 overflow-y-auto min-h-full overflow-hidden">
                    <div className="flex min-h-full items-center justify-end text-center">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 scale-95"
                            enterTo="opacity-100 scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 scale-100"
                            leaveTo="opacity-0 scale-95"
                        >
                            <div className="bg-app-bg">
                                <Dialog.Panel
                                    className={cn(
                                        `dialogWrap flex flex-col min-h-screen glareBg w-full sm:max-w-md transform overflow-hidden text-white p-10 bg-app-bg text-start transition-all`,
                                        {
                                            shake: isShake,
                                            "pt-[calc(2.5rem+60px)]": withTopMargin,
                                        },
                                    )}
                                >
                                    <Dialog.Title as="h3" className="text-3xl font-bold pb-5 pt-5">
                                        <span>{title}</span>
                                        {!noClose && (
                                            <div
                                                className={cn("absolute right-[0px] cursor-pointer", top)}
                                                onClick={closeModal}
                                            >
                                                <CancelIcon className={ButtonIconSize.default} />
                                            </div>
                                        )}
                                    </Dialog.Title>
                                    {content}
                                </Dialog.Panel>
                            </div>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition>
    );
}
