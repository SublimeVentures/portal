import LayoutApp from '@/components/Layout/LayoutApp';
import RoundBanner from "@/components/App/RoundBanner";
import {ButtonIconSize, RoundButton} from "@/components/Button/RoundButton";
import ReadIcon from "@/assets/svg/Read.svg";
import VaultItem from "@/components/App/Vault/VaultItem";
import {useState} from "react";
import NotificationsSetting from "@/components/App/Settings/NotificationsSetting";


export default function AppSettings() {
    const [push, setPush] = useState(false)
    const [sms, setSms] = useState(false)
    const [email, setEmail] = useState(false)


    return (
        <div className="grid grid-cols-12 gap-y-5 mobile:gap-y-10 mobile:gap-10">
            <div className="col-span-8 flex flex-col flex-1">
                <RoundBanner title={'Swim safely!'} subtitle={'All our investments are insured!'}
                             action={<RoundButton text={'Learn more'} isWide={true}
                                                  size={'text-sm sm'}
                                                  icon={<ReadIcon className={ButtonIconSize.hero}/>}/>}
                />
            </div>
            <div className="col-span-8 flex flex-row  gap-x-5 mobile:gap-10">
                <NotificationsSetting/>
            </div>
        </div>


    )
}


AppSettings.getLayout = function (page) {
    return <LayoutApp>{page}</LayoutApp>;
}
;
