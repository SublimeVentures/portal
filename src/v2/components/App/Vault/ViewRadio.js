import SingleChain from "../Vault/SingleChain";
import TwoChainsIcon from "@/v2/assets/svg/two-chains.svg";
import gridIcon from "@/v2/assets/svg/grid.svg";
import listIcon from "@/v2/assets/svg/list.svg";

const VIEW_ICON_MAP = {
    grid: gridIcon,
    list: listIcon,
};

const ViewRadio = ({ name = "view", options, value, onChange }) => {
    return (
        <div className="relative h-[43px]">
            <TwoChainsIcon
                className="absolute z-0"
                style={{ "--start-color": "rgba(13, 43, 58, .22)", "--end-color": "rgba(165, 210, 255, .22)" }}
            />
            <div className="relative flex items-center h-full justify-center w-max gap-3">
                {options.map((option) => (
                    <label htmlFor={option} key={option} className="cursor-pointer">
                        <input
                            type="radio"
                            id={option}
                            name={name}
                            value={option}
                            checked={value === option}
                            className="absolute opacity-0"
                            onChange={(evt) => onChange(evt.target.value)}
                        />
                        <SingleChain icon={VIEW_ICON_MAP[option]} active={value === option} />
                    </label>
                ))}
            </div>
        </div>
    );
};

export default ViewRadio;
