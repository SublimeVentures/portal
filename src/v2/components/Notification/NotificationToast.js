import PropTypes from "prop-types";
import { toast } from "react-hot-toast";
import Image from "next/image";
import { IoCloseCircleOutline as CancelIcon } from "react-icons/io5";
import { cn } from "@/lib/cn";

export default function NotificationToast({ t, notification }) {
    return (
        <div
            className={cn(
                "bordered-container boxshadow relative offerWrap flex flex-1 max-w-md text-white",
                t.visible ? "animate-in" : "animate-out opacity-0",
            )}
        >
            <div className="flex-1 w-0 p-4">
                <div className="flex items-start">
                    {notification.image && (
                        <div className="flex-shrink-0 pt-0.5">
                            <Image
                                className="h-10 w-10 rounded-full"
                                src={notification.image}
                                alt=""
                                height={100}
                                width={100}
                            />
                        </div>
                    )}
                    <div className="ml-3 flex-1">
                        <p className="text-sm font-medium text-gray-900">{notification.title}</p>
                        <p className="mt-1 text-sm text-gray-500">{notification.body}</p>
                    </div>
                </div>
            </div>
            <div className="flex">
                <button
                    onClick={() => toast.dismiss(t.id)}
                    className="w-full border border-transparent rounded-none rounded-r-lg p-1 flex items-center justify-center text-sm font-medium text-indigo-600 hover:text-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                    <CancelIcon className="w-16 text-2xl text-white" />
                </button>
            </div>
        </div>
    );
}

NotificationToast.propTypes = {
    t: PropTypes.any,
    notification: PropTypes.shape({
        title: PropTypes.string.isRequired,
        body: PropTypes.string.isRequired,
        image: PropTypes.string,
    }),
};
