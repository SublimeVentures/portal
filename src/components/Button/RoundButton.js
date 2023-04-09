import {useEffect, useRef, useState} from "react";
import VanillaTilt from 'vanilla-tilt';


export const ButtonIconSize = {
    hero: "w-8 mr-5",
    small: "w-8",
}


export function RoundButton({text, isLoading, isDisabled, showParticles, is3d, isPrimary, isWide, isWider, size, zoom, slot, icon, handler}) {
    const [isActive, setIsActive] = useState(false)
    const [isExecuting, setExecuting] = useState(false)
    const tilt = useRef(null);

    useEffect(() => {
        VanillaTilt.init(tilt.current, {scale: zoom ? zoom : 1, speed: 1000, max: is3d ? 10 : 1});
    }, [zoom]);

    const animate = async () => {
        if(isExecuting) return;
        setExecuting(true)
        if (showParticles) {
            setIsActive(true)
            setTimeout(function () {
                setIsActive(false)
            }, 2000);
        }
        if(handler) {
            await handler()
        }
        setExecuting(false)
    }


    return (
        <div className={`v-align ${isActive ? 'active' : ''}`}>
            <div className={`
              btn-wrap
              ${showParticles && "particles"}
              ${isPrimary && "full-btn"}
              ${!isPrimary && "out-btn"}
              ${isLoading || isDisabled || isExecuting && "disabled"}  
            `}>
                    <button className={`btn ${size}`} onClick={animate} ref={tilt}>
                    <div className={`
                      flex items-center justify-center relative
                      ${isWide && "ls-md"}
                      ${isWider && "ls-lg"}
                    `}>
                        {icon}
                        {text}
                        {isLoading && <div  className={`
                          flex items-center justify-center absolute w-full
                          ${isPrimary && "bg-gold"}
                          ${!isPrimary && "bg-navy2"}
                        `}>
                            Loading...
                        </div>}
                    </div>
                </button>

                {showParticles && <div>
                    <span className='particles-circle'></span>
                    <span className='particles-circle'></span>
                    <span className='particles-circle'></span>
                    <span className='particles-circle'></span>
                    <span className='particles-circle'></span>
                    <span className='particles-circle'></span>
                    <span className='particles-circle'></span>
                    <span className='particles-circle'></span>
                    <span className='particles-circle'></span>
                    <span className='particles-circle'></span>
                    <span className='particles-circle'></span>
                    <span className='particles-circle'></span>
                    <span className='particles-circle'></span>
                    <span className='particles-circle'></span>
                    <span className='particles-circle'></span>
                    <span className='particles-circle'></span>
                    <span className='particles-circle'></span>
                    <span className='particles-circle'></span>
                    <span className='particles-circle'></span>
                    <span className='particles-circle'></span>
                    <span className='particles-circle'></span>
                    <span className='particles-circle'></span>
                    <span className='particles-circle'></span>
                    <span className='particles-circle'></span>
                    <span className='particles-circle'></span>
                    <span className='particles-circle'></span>
                    <span className='particles-circle'></span>
                    <span className='particles-circle'></span>
                    <span className='particles-circle'></span>
                    <span className='particles-circle'></span>
                    <span className='particles-circle'></span>
                    <span className='particles-circle'></span>
                    <span className='particles-circle'></span>
                    <span className='particles-circle'></span>
                    <span className='particles-circle'></span>
                </div>}
            </div>
        </div>
    )
}
