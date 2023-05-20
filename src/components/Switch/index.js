import {Switch} from "@headlessui/react";

export default function SwitchGeneric({checked, setChecked}) {

    return (<Switch
        checked={checked}
        onChange={(val) => {
            setChecked(!val)
        }}
        className={`${checked ? 'bg-app-error' : 'bg-app-success'}
           bg-opacity-70 relative inline-flex h-[32px] w-[68px] outline-0 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-0  focus-visible:ring-white focus-visible:ring-opacity-75`}
    >
                <span
                    aria-hidden="true"
                    className={`${checked ? 'translate-x-9' : 'translate-x-0'}
             pointer-events-none inline-block -mt-[0px] h-[28px] w-[28px] transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out`}
                >
                </span>
    </Switch>)
}
