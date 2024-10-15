import PropTypes from "prop-types";
import { toast } from "react-hot-toast";
import Image from "next/image";
import { IoCloseCircleOutline as CancelIcon } from "react-icons/io5";

export default function NotificationToast({ t, notification }) {
    return (
        <div className="group/card py-3.5 px-5 mr-2 mt-2 rounded lg:rounded-r-xl transition-base cursor-pointer border-secondary min-w-32 basis-full md:basis-2/3 lg:basis-1/2 2xl:basis-1/3 shadow-lg shadow-navy lg:shadow-none w-auto flex items-center 3xl:mr-5 3xl:mt-5 3xl:rounded-r-[27px]">
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
                        <p className="text-sm font-medium text-app-white">{notification.title}</p>
                        <p className="mt-1 text-sm text-app-white">{notification.body}</p>
                    </div>
                </div>
            </div>
            <div className="flex">
                <button
                    onClick={() => toast.dismiss(t.id)}
                    className="w-full border border-transparent rounded-none rounded-r-lg p-1 flex items-start justify-end text-sm font-medium focus:outline-none text-white focus:text-gray"
                >
                    <CancelIcon className="w-16 text-2xl" />
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
