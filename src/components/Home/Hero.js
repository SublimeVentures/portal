import {RoundButton, ButtonIconSize} from '@/components/Button/RoundButton';
import PlayIcon from "@/svg/Play.svg";


export default function Hero() {
    const login = () => {

    }

    return (
        <div className="min-h-screen bg flex flex-col justify-center">
            <div className="flex flex-col w-full md:max-w-[80%] md:mx-auto xl:max-w-[1200px]">
                <div className="flex flex-col p-10 text-white font-medium uppercase md:max-w-[600px] md:justify-center">
                    <div className="font-accent text-xs ml-1">invest ground floor</div>
                    <div className="text-hero">
                        Don't be exit liquidity
                    </div>
                </div>

                <div
                    className="flex mx-auto mt-10 md:mt-0 md:items-center md:p-10 md:left-0 md:right-0 md:absolute md:bottom-20 md:mx-auto md:justify-center">
                    <RoundButton text={'invest'} is3d={true} isPrimary={false} isWider={true} zoom={1.1} size={'text-2xl lg'} onClick={login} icon={<PlayIcon className={ButtonIconSize.hero}/>}/>
                </div>
            </div>

        </div>)

}
