import React from "react";

const GlobalBanner = ({ message, isVisible }) => {
    if (!isVisible) return null;

    return (
        <div className=" top-0 bg-yellow-400 text-black font-medium z-50 flex items-center justify-between py-2 px-6 mx-[-40px] mt-[-40px]">
            <div className="flex-grow text-center">{message}</div>
        </div>
    );
};

export default GlobalBanner;
