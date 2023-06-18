import {RoundButton, ButtonIconSize} from '@/components/Button/RoundButton';
import {useRouter} from 'next/router'
import {singIn} from "@/fetchers/login.fetcher";
import PAGE from "@/routes";
import PlayIcon from "@/assets/svg/Play.svg";
import {fetchWrapper, retrieveToken} from "@/lib/fetchHandler";
import {signOutQuery} from "@/lib/authHelpers";


export default function Hero({account}) {
    const router = useRouter()
    const login = () => {
        if (!!account) {
            router.push(PAGE.App)
        } else {
            router.push(PAGE.Login)
        }
    }


    const protect = async () => {
        const response = await fetchWrapper.get('/api/secure/test')
        console.log("protected",response)
        // const parsed = await response.json()
        // console.log("post - parsed",parsed)
        // setAccessToken(parsed.accessToken)
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

                <div className={"bg-app-success flex flex-col gap-5"}>
                    <button onClick={() => {
                        singIn()
                    }}>Login
                    </button>
                    <button onClick={() => {
                        protect()
                    }}>Protected
                    </button>

                    <div>user:  {JSON.stringify(account)}</div>
                    <button onClick={()=>{const a =retrieveToken(); console.log("a",a)}}>test</button>
                    <button onClick={()=>{signOutQuery()}}>Logout</button>
                    {/*<button onClick={()=>{refresh()}}>Refresh</button>*/}
                </div>

                <div
                    className="flex mx-auto mt-10 md:mt-0 md:items-center md:p-10 md:left-0 md:right-0 md:absolute md:bottom-20 md:mx-auto md:justify-center">
                    <RoundButton text={'invest'} is3d={true} isPrimary={false} isWider={true} zoom={1.1}
                                 size={'text-2xl lg'} handler={login}
                                 icon={<PlayIcon className={ButtonIconSize.hero}/>}/>
                </div>
            </div>

        </div>)

}
