import Select, { components } from "react-select";

import { RoundButton } from "@/components/Button/RoundButton";
import useLoginFlow from "@/components/Login/useLoginFlow";
import LoginModal from "@/components/SignupFlow/LoginModal";

const CustomOption = (props) => {
    return (
        <div className="relative" id="aa">
            <components.Option {...props}>
                <div className={`flex flex-row items-center relative ${props.data.isDisabled ? "text-white" : ""} `}>
                    <div>
                        <img
                            src={props.data.logo}
                            style={{
                                width: 25,
                                height: "auto",
                                marginRight: 8,
                            }}
                            alt=""
                        />
                    </div>
                    <div className={"pl-1"}>{props.data.label}</div>
                    {props.data.isNew && (
                        <div className="right-2 absolute rounded-xl bg-outline px-2 py-1 text-xxs !text-white">NEW</div>
                    )}
                </div>
            </components.Option>
        </div>
    );
};

const CustomSingleValue = (props) => {
    return (
        <components.SingleValue {...props}>
            <div className="flex flex-row items-center">
                <div>
                    <img src={props.data.logo} style={{ width: 25, height: "auto", marginRight: 8 }} alt="" />
                </div>
                <div className="pl-1">{props.data.label}</div>
            </div>
        </components.SingleValue>
    );
};

export default function LoginGlobal({ ssrData }) {
    const dataSorted = ssrData.sort((a, b) => a.displayOrder - b.displayOrder);
    const loginOptions = dataSorted.map((el) => ({
        value: el.id,
        label: el.name,
        logo: el.logo,
        isNew: el.isNewLabel,
    }));

    const { isLoginLoading, handleConnect, setPartner, loginData } = useLoginFlow(loginOptions[0].value);

    const handlePartnerChange = (option) => setPartner(option.value);

    return (
        <>
            <div className="min-h-screen">
                <div className="bg-[url(https://cdn.basedvc.fund/webapp/bg.jpg)] bg-cover min-h-screen"></div>
                <div
                    className="text-white flex pt-20  flex-grow min-h-screen flex-col justify-center sm:flex-row"
                    style={{ marginTop: "calc(-100vh)" }}
                >
                    <div className={"mx-auto px-0 py-10 sm:mx-0 sm:px-10 flex flex-col justify-center"}>
                        <div className=" flex flex-col px-6 py-10 sm:p-10 blurred glareBg  w-full sm:w-auto min-w-[340px] shadow shadow-white/10 sm:shadow-white/25 backdrop-blur-md">
                            <div className="text-3xl font-bold">
                                <span className={"text-app-success"}>Login</span> with
                            </div>
                            <div className={"mt-10 relative select"}>
                                <Select
                                    options={loginOptions}
                                    id="selectPartner"
                                    instanceId="selectPartnerID"
                                    inputId="selectPartnerID"
                                    isSearchable={true}
                                    defaultValue={loginOptions[0]}
                                    onChange={handlePartnerChange}
                                    components={{
                                        Input: (props) => (
                                            <components.Input {...props} aria-activedescendant={undefined} />
                                        ),
                                        Option: CustomOption,
                                        SingleValue: CustomSingleValue,
                                        Menu: (props) => <components.Menu {...props} className="menu" />,
                                    }}
                                    styles={{
                                        menu: (provided) => ({
                                            ...provided,
                                            backgroundColor: "#101d2d",
                                            boxShadow: "0 0 40px -10px #729db0",
                                        }),

                                        control: (provided, state) => ({
                                            ...provided,
                                            borderWidth: "1px",
                                            height: "50px", // Set the height of the select control
                                            minHeight: "50px",
                                            backgroundColor: "#101d2d",
                                            outline: "none",
                                            "&:focus": {
                                                outline: "none",
                                            },
                                            "&:hover": {
                                                boxShadow: "none",
                                            },
                                            boxShadow: state.isFocused ? "none" : provided.boxShadow,
                                            borderColor: state.isFocused ? "#c0c0c0" : "#c0c0c0",
                                        }),
                                        option: (provided, state) => ({
                                            ...provided,
                                            borderBottom: "1px solid #12151e",
                                            color: state.isSelected ? "#b1e365" : "white", // Color for selected and other options
                                            background: state.isFocused
                                                ? "#12151e"
                                                : state.isSelected
                                                  ? "#12151e"
                                                  : "#101d2d", // Background color for selected option
                                            ":active": {
                                                ...provided[":active"],
                                                backgroundColor: "#12151e", // Color when the option is clicked
                                            },
                                        }),
                                        input: (provided) => ({
                                            ...provided,
                                            color: "white", // Color for input text
                                        }),
                                        singleValue: (provided) => ({
                                            ...provided,
                                            color: "white", // Color for the selected item text
                                        }),
                                    }}
                                />
                            </div>
                            <div className="flex-1 items-end pt-10 fullWidthButton btn-narrow">
                                <RoundButton
                                    text="CONNECT WALLET"
                                    isLoading={isLoginLoading}
                                    isLoadingWithIcon={true}
                                    isWide={true}
                                    zoom={1.1}
                                    size="text-sm sm w-full border border-white rounded-full text-white h-16 px-7 uppercase tracking-[0.5rem] font-light shadow shadow-white/25"
                                    handler={handleConnect}
                                />
                            </div>
                            <div className="my-10 h-px w-full barHor bg-gradient-to-r from-transparent via-white/50 via-50% to-transparent"></div>
                            <div className="flex-1 items-end fullWidthButton btn-narrow disabled">
                                <RoundButton
                                    text="Discord"
                                    isLoadingWithIcon={true}
                                    isWide={true}
                                    zoom={1.1}
                                    size="text-sm sm w-full border border-white/25 rounded-full text-white/25 h-16 px-7 uppercase tracking-[0.5rem] font-light shadow shadow-white/10 pointer-events-none"
                                />
                            </div>
                            <div className="flex-1 items-end pt-2 fullWidthButton btn-narrow disabled">
                                <RoundButton
                                    text="E-mail"
                                    isLoadingWithIcon={true}
                                    isWide={true}
                                    zoom={1.1}
                                    size="text-sm sm w-full border border-white/35 rounded-full text-white/25 h-16 px-7 uppercase tracking-[0.5rem] font-light shadow shadow-white/10 pointer-events-none"
                                />
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-1"></div>
                </div>
            </div>

            <LoginModal loginModalProps={loginData} />
        </>
    );
}
