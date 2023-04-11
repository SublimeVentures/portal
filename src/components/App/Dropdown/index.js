
import {Fragment, useEffect, useState} from "react";


export default function Dropdown({options, classes}) {
    const [isOpen, setIsOpen] = useState(false)
    const [selected, setSelected] = useState(0)
    const [direction, setDirection] = useState(0)
    const [moved, setMoved] = useState(0)


    const changeOption = (index) => {
        console.log("aaaa", index)
        setMoved(index * -62)
        let _selected = selected
        setSelected(index)
        setDirection(_selected < index ? -1 : 1)
        setTimeout(() => {
            setDirection(0)
            setIsOpen(false)
        }, 500);
    }


    return (
        <div
            className={`select-menu text-xl ${isOpen ? 'open' : ''} ${direction === -1 ? 'tilt-down' : ''} ${direction === 1 ? 'tilt-up' : ''} ${classes ? classes : ''}`}
            onClick={() => {
                setIsOpen(true)
            }}
        >
            <select data-menu="">
                {options.map((el, i) => {
                    return <option key={i} selected={i === selected}>{ el }</option>
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
