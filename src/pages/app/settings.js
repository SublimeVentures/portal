import LayoutApp from '@/components/Layout/LayoutApp';
import RoundBanner from "@/components/App/RoundBanner";
import {ButtonIconSize, RoundButton} from "@/components/Button/RoundButton";
import ReadIcon from "@/assets/svg/Read.svg";
import {verifyID} from "@/lib/authHelpers";
import routes from "@/routes";
import Account from "@/components/App/Settings/Account";


export default function AppSettings({account}) {

    return (
        <div className="grid grid-cols-12 gap-y-5 mobile:gap-y-10 mobile:gap-10">
            {/*<div className="col-span-8 flex flex-col flex-1">*/}
            {/*    <RoundBanner title={'Swim safely!'} subtitle={'All our investments are insured!'}*/}
            {/*                 action={<RoundButton text={'Learn more'} isWide={true}*/}
            {/*                                      size={'text-sm sm'}*/}
            {/*                                      icon={<ReadIcon className={ButtonIconSize.hero}/>}/>}*/}
            {/*    />*/}
            {/*</div>*/}
            <div className="col-span-12 sm:col-span-8 xl:col-span-6 flex flex-row gap-x-5 mobile:gap-10">
                <Account account={account}/>
            </div>
        </div>


    )
}


export const getServerSideProps = async({res}) => {
    const account = await verifyID(res.req)

    if(account.exists){
        return {
            redirect: {
                permanent: true,
                destination: `/app/auth?callbackUrl=${routes.App}`
            }
        }
    }

    if(!account.auth){
        return {
            redirect: {
                permanent: true,
                destination: `/login?callbackUrl=${routes.App}`
            }
        }
    }

    return {
        props: {
            account: account.user
        }
    }
}

AppSettings.getLayout = function (page) {
    return <LayoutApp>{page}</LayoutApp>;
};
