import TwoChainsIcon from "@/v2/assets/svg/two-chains.svg";
import gridIcon from "@/v2/assets/svg/grid.svg";
import listIcon from "@/v2/assets/svg/list.svg";
import SingleChain from "../Vault/SingleChain";

const ViewRadio = ({ viewOptions: { views, activeView, handleChangeView } = {} }) => {
    const [firstView, secondView] = views;

    return (
        <div className="relative h-[43px]">
            <TwoChainsIcon className="absolute z-0" />

            <div className="relative flex items-center h-full justify-center w-max gap-3">
                <label htmlFor={firstView} className="cursor-pointer">
                    <input
                        type="radio"
                        id={firstView}
                        name={firstView}
                        value={firstView}
                        checked={activeView === firstView}
                        className="absolute opacity-0"
                        onChange={(evt) => handleChangeView(evt.target.value)}
                    />
                    <SingleChain icon={gridIcon} active={activeView === firstView} />
                </label>
                <label htmlFor={secondView} className="cursor-pointer">
                    <input
                        type="radio"
                        id={secondView}
                        name={secondView}
                        checked={activeView === secondView}
                        className="absolute opacity-0"
                        value={secondView}
                        onChange={(evt) => handleChangeView(evt.target.value)}
                    />
                    <SingleChain icon={listIcon} active={activeView === secondView} />
                </label>
            </div>
        </div>
    )
}

export default ViewRadio;
