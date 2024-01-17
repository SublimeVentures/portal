import {Transition} from '@headlessui/react'
import {Fragment, useEffect, useState} from "react";
import IconCancel from "@/assets/svg/Cancel.svg";
import { isAddress } from 'web3-validator';

export default function Input({type, placeholder, max, min, setStatus, input, setInput, after, light, full, dividable, customClear, initialValue, customCss}) {
    const [inputFormatted, setInputFormatted] = useState("")
    const [showInfo, setShowInfo] = useState(false)
    const [showClean, setShowClean] = useState(false)
    let [isError, setIsError] = useState({})

    const checkIfNumber = (event) => {
        if (event.key.length === 1 && /\D/.test(event.key)) {
            return;
        }
    }

    const setValueNumber = (data) => {
        if (!Number.isInteger(data)) {
            data = data.replace(/[^0-9]/g, '')
        }
        setInput(data)

    }

    const setValueString = (data) => {
        setInput(data)
    }

    const isActive = () => {
        if (type === 'number') {
            return input > 0
        } else {
            return input?.length>0
        }
    }

    const onInputChange = (event) => {
        if (type === "number") {
            setValueNumber(event.target.value)
        } else {
            setValueString(event.target.value)
        }
    }


    const clearInput = () => {
        if (type === "number") {
            if(min) setValueNumber(min)
            else setValueNumber(0)
        } else {
            setValueString(customClear ? customClear : "")
        }
    }

    useEffect(() => {
        if (type === "number") {
            let formatted = Number(input).toLocaleString()
            if(formatted==0) {
                formatted = ""
            }
            setInputFormatted(formatted)
        } else {
            setInputFormatted(input)
        }
    }, [input]);

    useEffect(() => {
        if (type === "number" && min) {
            setValueNumber(min)
        } else {
            setValueString(initialValue)
        }
    }, []);

    useEffect(() => {
        if(type === "number") {
            if (min && input < min) {
                setStatus(true)
                return setIsError({state: true, msg: `Minimum amount: $${min.toLocaleString()}`})
            } else if (max && input > max) {
                setStatus(true)
                return setIsError({state: true, msg: `Maximum amount: $${max.toLocaleString()}`})
            } else {
                if(dividable && input % dividable > 0) {
                    setStatus(true)
                    return setIsError({state: true, msg: `Amount has to be divisible by $10`})
                }
                setStatus(false)
                if(max) {
                    return setIsError({state: false, msg: `Maximum amount: $${max.toLocaleString()}`})
                } else
                    return setIsError({state: false})

            }
        } else if(type === "wallet") {
            setStatus(!isAddress(input))
            return setIsError({state: !isAddress(input), msg: `Provided address is not valid`})
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
        <div className={`currency-input-group relative ${light ? 'light' : ''} ${full ? 'full' : ''} ${customCss && customCss}`}>
            <div className={`relative centr  ${isActive() ? 'active' : ''}`}>
                <label className="absolute text-accent block">{placeholder}</label>
                <input tabIndex="0"
                       type={type === "password" ? type :""}
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
                        <div className="absolute top-5 right-5 cursor-pointer" onClick={() => clearInput()}><IconCancel className="w-6 opacity-70"/></div>
                    </Transition.Child>
                </Transition>
            </div>
            {after && <div className={"after rounded-tr-md rounded-br-md px-5 flex justify-center items-center mt-[1px] mb-[1px]"}>{after}</div>}
            {isError?.state &&<Transition appear show={showInfo} as={Fragment}>
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
            </Transition>}

        </div>
    )
}
