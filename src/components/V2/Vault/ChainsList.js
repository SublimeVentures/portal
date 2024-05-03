import IconEthSelected from "@/assets/v2/svg/eth_selected.svg";
import IconEthUnselected from "@/assets/v2/svg/eth_unselected.svg";

import IconAvaxSelected from "@/assets/v2/svg/avax_selected.svg";
import IconAvaxUnselected from "@/assets/v2/svg/avax_unselected.svg";

import IconPolySelected from "@/assets/v2/svg/poly_selected.svg";
import IconPolyUnselected from "@/assets/v2/svg/poly_unselected.svg";

import IconConnextSelected from "@/assets/v2/svg/connext_selected.svg";
import IconConnextUnselected from "@/assets/v2/svg/connext_unselected.svg";

import IconBaseSelected from "@/assets/v2/svg/base_selected.svg";
import IconBaseUnselected from "@/assets/v2/svg/base_unselected.svg";

import SingleChain from "./SingleChain";

const activeChain = "eth";

const ChainsList = () => {
    return (
        <div className="relative h-[43px]">
            <svg className="absolute z-0" xmlns="http://www.w3.org/2000/svg" width="263.001" height="43" viewBox="0 0 263.001 43">
                <path id="Union_6" data-name="Union 6" d="M233.851,41.574a.774.774,0,0,1-.081-.006c-3.653-.472-11.538-7.053-19.859-7.184a28.778,28.778,0,0,0-11.588,3c-.7.408.112-.046-1.721,1-.747.426-1.966,1.033-3.147,1.6a21.448,21.448,0,0,1-19.877,1.068c-4.01-1.4-11.161-6.763-18.666-6.88a28.786,28.786,0,0,0-11.589,3c-.7.408.113-.046-1.72,1-.431.246-1.02.552-1.667.876a21.448,21.448,0,0,1-20.084,2.518.779.779,0,0,1-.081-.006c-3.654-.472-11.538-7.053-19.859-7.184a28.786,28.786,0,0,0-11.589,3c-.7.408.113-.046-1.721,1-.747.426-1.966,1.033-3.148,1.6A21.32,21.32,0,0,1,76.5,43h-.452l-.081,0h-.056l-.077,0-.055,0-.078,0-.055,0-.079,0-.052,0-.081,0-.053,0-.083,0-.047,0-.1-.006-.032,0-.264-.018-.032,0-.1-.008-.036,0-.1-.008-.042,0-.089-.008-.045,0-.085-.008-.047,0-.085-.009-.045,0-.089-.01-.039,0-.1-.011-.034,0-.1-.013-.025,0q-.264-.034-.526-.074l-.019,0-.111-.017-.025,0-.105-.017-.026,0-.105-.018-.025,0-.106-.019-.024,0-.11-.02-.017,0-.12-.023-.008,0q-.392-.075-.778-.165l-.012,0-.116-.027-.015,0L71.4,42.39l-.017,0-.111-.027-.017,0-.111-.028-.016,0-.116-.03-.01,0q-.317-.084-.63-.177l-.019-.006-.1-.031-.031-.01-.09-.028-.037-.011L70.014,42l-.04-.013-.08-.026-.044-.014-.075-.025-.047-.015-.071-.024-.051-.017-.065-.022-.056-.019-.05-.018c-.173-.061-.347-.124-.518-.188l0,0-.108-.041h0c-.026,0-.053,0-.08-.006-3.653-.471-11.538-7.053-19.858-7.183a28.771,28.771,0,0,0-11.588,3c-.7.408.112-.046-1.721,1-.746.425-1.96,1.03-3.139,1.6A21.486,21.486,0,1,1,21.452,0,21.325,21.325,0,0,1,34.482,4.419l1.071.608c1.833,1.046,1.021.591,1.721,1a28.771,28.771,0,0,0,11.588,3c6.43-.1,12.6-4.054,16.756-6.062q.88-.52,1.813-.957l.007,0,.228-.105.011,0,.224-.1.017-.008.223-.1.017-.007.221-.092.024-.01.219-.088.024-.01.107-.042.006,0,.106-.041.027-.01L69,1.351h0l.109-.04.028-.01.1-.035.016-.006.1-.037.036-.013.089-.031.019-.007.105-.036.033-.011.091-.031.021-.007.105-.035.034-.011.088-.028L70,1l.1-.033L70.141.96l.087-.027.026-.008.105-.032.037-.011.083-.025L70.507.85l.1-.03.041-.012.074-.021.04-.011.1-.027.043-.012.074-.02.038-.01.1-.027.039-.01.079-.02.036-.009.1-.026L71.42.606,71.5.587l.036-.009.106-.025.037-.009.08-.018L71.8.518,71.9.495l.036-.008.083-.018.035-.007.108-.022L72.2.432l.086-.017.034-.007.109-.021L72.462.38l.086-.016.033-.006.111-.02.032-.006.088-.015L72.848.31l.11-.019.032-.005.087-.014.036-.006.111-.017.031,0,.089-.013L73.38.226l.11-.016.033,0L73.61.194l.038-.005L73.76.174l.026,0,.1-.012.034,0L74.03.141l.025,0,.1-.011.034,0L74.3.112l.024,0,.1-.01.034,0,.115-.011.024,0,.1-.008.036,0,.116-.009h.02l.1-.007.034,0,.119-.008h.014l.109-.007.031,0,.12-.006h.013l.11-.005h.032l.12,0h.013l.109,0h.034l.121,0h.007l.116,0H76.1l.246,0H76.5A21.331,21.331,0,0,1,89.527,4.417l1.074.611c1.833,1.046,1.021.591,1.721,1a28.785,28.785,0,0,0,11.589,3c6.427-.1,12.593-4.05,16.751-6.06a21.454,21.454,0,0,1,19.3-1.254l.031-.076.8.451a21.42,21.42,0,0,1,2.549,1.443c.83.47,1.655.939,2.265,1.286,1.832,1.046,1.02.591,1.72,1a28.771,28.771,0,0,0,11.589,3c7.5-.117,14.654-5.483,18.665-6.88a21.439,21.439,0,0,1,21.952,2.474l1.074.611c1.832,1.046,1.021.591,1.721,1a28.777,28.777,0,0,0,11.588,3c6.427-.1,12.594-4.05,16.751-6.06A21.486,21.486,0,1,1,241.548,43,21.355,21.355,0,0,1,233.851,41.574Z" fill="#0d2b3a"/>
            </svg>

            <ul className="relative flex items-center h-full justify-center w-max gap-3">
                {chainList.map(({ name, selectedIcon, unselectedIcon }) => {
                    const isChainActive = activeChain === name;

                    return (
                        <li key={name}>
                            <SingleChain icon={isChainActive ? selectedIcon : unselectedIcon} active={isChainActive} />
                        </li>
                    )
                })}
            </ul>
        </div>
    )
}

const chainList = [
    {
        name: "eth",
        selectedIcon: IconEthSelected,
        unselectedIcon: IconEthUnselected,
    },
    {
        name: "avax",
        selectedIcon: IconAvaxSelected,
        unselectedIcon: IconAvaxUnselected,
    },
    {
        name: "poly",
        selectedIcon: IconPolySelected,
        unselectedIcon: IconPolyUnselected,
    },
    {
        name: "connext",
        selectedIcon: IconConnextSelected,
        unselectedIcon: IconConnextUnselected,
    },
    {
        name: "base",
        selectedIcon: IconBaseSelected,
        unselectedIcon: IconBaseUnselected,
    },
]

export default ChainsList;
