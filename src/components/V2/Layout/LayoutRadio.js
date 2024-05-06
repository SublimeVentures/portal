import { useState } from "react";

import gridIcon from "@/assets/v2/svg/grid.svg";
import SingleChain from "../Vault/SingleChain";

const LayoutRadio = () => {
    const [activeRadio, setActiveRadio] = useState("layout-radio-1");

    return (
        <div className="relative h-[43px]">
            <svg className="absolute z-0" xmlns="http://www.w3.org/2000/svg" width="97.953" height="43" viewBox="0 0 97.953 43">
              <path id="Union_6" data-name="Union 6" d="M233.851,41.574a.774.774,0,0,1-.081-.006c-3.653-.472-11.538-7.053-19.859-7.184a28.778,28.778,0,0,0-11.588,3c-.7.408.112-.046-1.721,1-.747.426-1.966,1.033-3.147,1.6A21.486,21.486,0,1,1,186.5,0a21.331,21.331,0,0,1,13.027,4.417l1.074.611c1.832,1.046,1.021.591,1.721,1a28.777,28.777,0,0,0,11.588,3c6.427-.1,12.594-4.05,16.751-6.06A21.486,21.486,0,1,1,241.548,43,21.355,21.355,0,0,1,233.851,41.574Z" transform="translate(-165.048)" fill="#0d2b3a"/>
            </svg>

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
                    <SingleChain icon={gridIcon} active={activeRadio === "layout-radio-2"} />
                </label>
            </div>
        </div>
    )
}

export default LayoutRadio;
