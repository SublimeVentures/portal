import {useEffect} from "react";

export default function Empty({text, maxSize}) {
    useEffect(() => {
        import('@lottiefiles/lottie-player');
    }, []);

    return (
        <div className="max-h-3-4 text-center contents">
                <lottie-player
                    autoplay
                    loop
                    style={{position:"relative", width:'auto', height:'100%', maxHeight: `${maxSize ? maxSize : 700}px`, maxWidth:`${maxSize ? maxSize : 700}px`, margin: '0 auto'}}
                    mode="normal"
                    src="/static/lottie/empty2.json"
                />
                <div className="text-2xl uppercase text-hero font-medium !text-3xl tracking-wider">{text ? text : 'More opportunities soon...'}</div>

         </div>


    )
}
