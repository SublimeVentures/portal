import { useState } from "react";

import TwoChainsIcon from "@/assets/v2/svg/two-chains.svg";
import gridIcon from "@/assets/v2/svg/grid.svg";
import listIcon from "@/assets/v2/svg/list.svg";
import SingleChain from "../Vault/SingleChain";

const LayoutRadio = () => {
    const [activeRadio, setActiveRadio] = useState("layout-radio-1");

    return (
        <div className="relative h-[43px]">
            <TwoChainsIcon className="absolute z-0" />

            <div className="relative flex items-center h-full justify-center w-max gap-3">
                <label htmlFor="layout-radio-1" className="cursor-pointer">
                    <input
                        type="radio"
                        id="layout-radio-1"
                        name="layout-radio-1"
                        value="layout-radio-1"
                        checked={activeRadio === "layout-radio-1"}
                        className="absolute opacity-0"
                        onChange={() => setActiveRadio("layout-radio-1")}
                    />
                    <SingleChain icon={gridIcon} active={activeRadio === "layout-radio-1"} />
                </label>
                <label htmlFor="layout-radio-2" className="cursor-pointer">
                    <input
                        type="radio"
                        id="layout-radio-2"
                        name="layout-radio-2"
                        value="layout-radio-2"
                        className="absolute opacity-0"
                        checked={activeRadio === "layout-radio-2"}
                        onChange={() => setActiveRadio("layout-radio-2")}
                    />
                    <SingleChain icon={listIcon} active={activeRadio === "layout-radio-2"} />
                </label>
            </div>
        </div>
    )
}

export default LayoutRadio;
