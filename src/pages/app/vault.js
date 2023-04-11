import LayoutApp from '@/components/Layout/LayoutApp';
import RoundBanner from "@/components/App/RoundBanner";
import {ButtonIconSize, RoundButton} from "@/components/Button/RoundButton";
import ReadIcon from "@/assets/svg/Read.svg";
import VaultItem from "@/components/App/Vault/VaultItem";


export default function AppVault() {

    const investmentActivityLog = [
        {type: 'details', step: 'Project details', date: '', icon: "vote"},
        {type: 'pledge', step: 'Pledged', date: '2022-10-15', icon: "vote"},
        {type: 'buy', step: 'Invested', date: '2022-10-16', icon: "vote"},
        {type: 'notpassed', step: 'Cancelled', date: '2022-10-19', icon: "vote"},
        {type: 'refund0', step: 'Refund available', date: '2022-10-16', icon: "vote"},
        {type: 'refund01', step: 'Refund claimed', date: '2022-10-16', icon: "vote"},
        {type: 'claim0', step: 'Tokens to claim', date: '2022-10-16', icon: "vote"},
        {type: 'claim1', step: 'Tokens claimed', date: '2022-10-16', icon: "vote"},
    ]
    const vault = [
        {
            date: "2022-10-15",//
            name: "Heroes of Mavia",//
            allocation: 4500,//
            vested: 65,
            nextUnlock: "2022-10-15",
            nextUnlockSize: 653300,
            tge: 1.6,//
            url: "https://citcap-public.s3.us-east-2.amazonaws.com/mavia_logo.jpeg"//
        },
        {
            date: "2022-10-15",
            name: "Heroes of Mavia",
            allocation: 4500,
            vested: 65,
            nextUnlock: "2022-10-15",
            nextUnlockSize: 653300,
            tge: 1.6,
            url: "https://citcap-public.s3.us-east-2.amazonaws.com/mavia_logo.jpeg"
        },

    ]


    return (
        <div className="grid grid-cols-12 gap-y-5 mobile:gap-y-10 mobile:gap-10">
            <div className="col-span-12 flex">
                <RoundBanner title={'Vault'} subtitle={'All your investments in one place.'}
                             action={<RoundButton text={'Learn more'} isWide={true}
                                                  size={'text-sm sm'}
                                                  icon={<ReadIcon className={ButtonIconSize.hero}/>}/>}
                />
            </div>
            {vault.map((el, i) => {
                return <VaultItem item={el} key={i} />
            })}

        </div>

    )
}


AppVault.getLayout = function (page) {
    return <LayoutApp>{page}</LayoutApp>;
}
;
