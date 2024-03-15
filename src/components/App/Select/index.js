import {useState, Fragment} from "react";
import {Listbox, Transition} from '@headlessui/react'
import { PiCaretUpDown as IconUpDown } from "react-icons/pi";
import { IoCheckmark as IconSuccess } from "react-icons/io5";
import {useEffect} from "react";


export default function Select({label, options, setter}) {
    const [selected, setSelected] = useState({})
    useEffect(() => {
        if(options.length>0) {
            setSelected(options[0])

        }
    }, [options]);


    useEffect(() => {
        setter(selected);
    }, [selected, selected?.label]);

    return (
        <div className="relative select h-[62px]">
            {label && <label className="absolute text-accent block z-10 -top-2 bg-outline">{label}</label>}
            <Listbox value={selected} onChange={setSelected}>
                <div className="relative ">
                    <Listbox.Button
                        className="relative w-full cursor-default rounded-lg bg-slides py-2 pl-3 pr-10 text-left shadow-md focus:outline-none h-[60px]">
                        <span className="block truncate">{selected?.label}</span>
                        <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                              <IconUpDown
                                  className="h-5 w-5 "
                                  aria-hidden="true"
                              />
                        </span>
                    </Listbox.Button>
                    <Transition
                        as={Fragment}
                        leave="transition ease-in duration-200"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <Listbox.Options
                            className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-slides py-1 text-base shadow-lg ring-1 ring-black/5 z-10">
                            {options.map((option, optionIndex) => (
                                <Listbox.Option
                                    key={optionIndex}
                                    className={({active}) =>
                                        `relative cursor-default select-none py-2 pl-10 pr-4 ${
                                            active ? 'bg-outline text-white' : 'text-gray'
                                        }`
                                    }
                                    value={option}
                                >
                                    {({selected}) => (
                                        <>
                                          <span
                                              className={`block truncate ${
                                                  selected ? 'font-medium' : 'font-normal'
                                              }`}
                                          >
                                            {option.label}
                                          </span>
                                            {selected ? (
                                                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-app-success">
                                                  <IconSuccess className="h-5 w-5" aria-hidden="true"/>
                                                </span>
                                            ) : null}
                                        </>
                                    )}
                                </Listbox.Option>
                            ))}
                        </Listbox.Options>
                    </Transition>
                </div>
            </Listbox>
        </div>
    )
}
