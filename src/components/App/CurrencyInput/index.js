import {Transition} from '@headlessui/react'
import {debounce} from "debounce";
import {Fragment, useEffect, useState} from "react";
import IconCancel from "@/assets/svg/Cancel.svg";
import Dropdown from "@/components/App/Dropdown";


export default function CurrencyInput({type, placeholder, max, min, currencies, setStatus, shareInput, shareCurrency}) {
    const [input, setInput] = useState(null)
    const [inputFormatted, setInputFormatted] = useState("")
    const [showInfo, setShowInfo] = useState(false)
    const [showClean, setShowClean] = useState(false)
    let [isError, setIsError] = useState({})

    const checkIfNumber = (event) => {
        if (event.key.length === 1 && /\D/.test(event.key)) {
            return;
        }
    }



    const setValue = (data) => {
        // console.log("odpalam", data)
        if (!Number.isInteger(data)) {
            data = data.replace(/[^0-9]/g, '')
        }
        setInput(data)
        shareInput(data)
        let formatted = Number(data).toLocaleString()
        // console.log("formatted",formatted)
        if(formatted==0) {
            formatted = ""
        }
        setInputFormatted(formatted)
        // console.log("input - ", data)
    }

    const dbc = debounce(function (e) {
        this.checkRequirements()
    }, 1500)

    const checkRequirements = () => {
        // console.log("debounce", input)
        if (max && input > max) {
            return false
        }
        if (min && input < min) {
            return false
        }
        return true
    }

    const isActive = () => {
        if (type === 'number') {
            return input > 0
        }
    }

    const onInputChange = (event) => {
        setValue(event.target.value)
    }

    useEffect(() => {
        if (type === "number" && min) {
            setValue(min)
        }
    }, []);

    useEffect(() => {
        if (input < min) {
            setStatus(true)
            return setIsError({state: true, msg: `Minimum investment: $${min.toLocaleString()}`})
        } else if (input > max) {
            setStatus(true)
            return setIsError({state: true, msg: `Maximum investment: $${max.toLocaleString()}`})
        } else {
            if(input % 100 > 0) {
                setStatus(true)
                return setIsError({state: true, msg: `Allocation has to be divisible by $100`})
            }
            setStatus(false)
            return setIsError({state: false, msg: `Minimum investment: $${min.toLocaleString()}`})
        }

    }, [input]);

    useEffect(() => {
        if (showInfo) {
            setShowClean(showInfo)
        } else {
            setTimeout(() => {
                setShowClean(showInfo)
            }, 500);
        }
    }, [showInfo]);

    return (
        <div className="currency-input-group relative">
            <div className={`relative centr ${input > 0 ? 'active' : ''}`}>
                <label className="absolute text-accent block">{placeholder}</label>
                <input tabIndex="0"
                       value={inputFormatted}
                       onChange={onInputChange}
                       onKeyDown={checkIfNumber}
                       onFocus={() => setShowInfo(true)}
                       onBlur={() => setShowInfo(false)}
                       className={`h-17 text-xl px-4 ${isActive ? 'highlight' : ''} ${input >= min && input <= max ? 'valid' : ''} ${input < min || input > max ? 'invalid' : ''}`}
                />

                <Transition appear show={showClean} as={Fragment}>
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <div className="absolute top-5 right-5 cursor-pointer " onClick={() => {
                            setValue(min)
                        }}><IconCancel className="w-6 opacity-70"/></div>
                    </Transition.Child>
                </Transition>
            </div>
            <Dropdown options={currencies} classes={'customSize'} propSelected={shareCurrency}/>
            <Transition appear show={showInfo} as={Fragment}>
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div
                        className={`select-none absolute px-4 py-2 status text-sm ${isError?.state ? 'error' : ''}`}>{isError?.msg}</div>
                </Transition.Child>
            </Transition>

        </div>
    )
}
