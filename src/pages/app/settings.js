import LayoutApp from '@/components/Layout/LayoutApp';
import {verifyID} from "@/lib/authHelpers";
import routes from "@/routes";
import CitCapAccount from "@/components/App/Settings/CitCapAccount";


export default function AppSettings({account}) {

    return (
        <div className="grid grid-cols-12 gap-y-5 mobile:gap-y-10 mobile:gap-10">
            <div className="col-span-12 sm:col-span-8 xl:col-span-6 flex flex-row gap-x-5 mobile:gap-10">
                <CitCapAccount account={account}/>
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
                destination: `/app/auth?callbackUrl=${routes.Settings}`
            }
        }
    }

    if(!account.auth){
        return {
            redirect: {
                permanent: true,
                destination: `/login?callbackUrl=${routes.Settings}`
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
