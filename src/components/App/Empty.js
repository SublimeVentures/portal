import {useEffect} from "react";

export default function Empty() {
    useEffect(() => {
        import('@lottiefiles/lottie-player');
    }, []);

    return (
        <div className="h-full text-center">
            <lottie-player
                autoplay
                loop
                style={{width:'100%', height:'100%', maxHeight: '700px', maxWidth:'700px', margin: '0 auto'}}
                mode="normal"
                src="/static/lottie/empty.json"
            />
            <div className="text-2xl -mt-10">More opportunities soon...</div>
        </div>


    )
}
