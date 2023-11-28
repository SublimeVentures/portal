import {useRef, useState} from "react";
import useOnClickOutside from "@/lib/hooks/useOnClickOutside";
import {useEffect} from "react";

export default function Select({options, classes, propSelected, position, isSmall}) {
    const [isOpen, setIsOpen] = useState(false)
    const [selected, setSelected] = useState(0)
    const [direction, setDirection] = useState(0)
    const [moved, setMoved] = useState(0)
    const ref = useRef();

    const changeOption = (index) => {
        setMoved(index * (isSmall ? -35 : -62))
        let _selected = selected
        setSelected(index)
        propSelected(index)
        setDirection(_selected < index ? -1 : 1)
        setTimeout(() => {
            setDirection(0)
            setIsOpen(false)
        }, 500);
    }

    useOnClickOutside(ref, () => setIsOpen(false));

    useEffect(() => {
        if (position !== selected) changeOption(0)
    }, [position])

    return (
        <div
            className={`select-menu text-xl ${isOpen ? 'open' : ''} ${direction === -1 ? 'tilt-down' : ''} ${direction === 1 ? 'tilt-up' : ''} ${classes ? classes : ''} ${isSmall ? "small" : ""}`}
            onClick={() => {
                setIsOpen(true)
            }}
            ref={ref}
        >
            <select data-menu="">
                {options.map((el, i) => {
                    return <option key={i} defaultValue={i === selected ? 'selected' : ''}>{el}</option>
                })}

            </select>
            <div className="button">
                <em></em>
                <ul style={{transform: `translateY(${moved}px)`}}>
                    {options.map((el, i) => {
                        return <li key={i}>{el}</li>
                    })}

                </ul>
            </div>
            <ul style={{transform: `translateY(${moved}px)`}}>
                {options.map((el, i) => {
                    return <li key={i} onClick={() => {
                        changeOption(i)
                    }}>{el}</li>
                })
                }
            </ul>

        </div>
    )
}
