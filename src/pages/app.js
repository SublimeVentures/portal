import {signOut} from "next-auth/react";
import LayoutApp from '@/components/Layout/LayoutApp';
import {getServerSession} from "next-auth/next";

// export const getServerSideProps = async(context) => {
//     const session = await getServerSession(context.req, context.res)
//     console.log("seesion", session)
//     if(!session){
//         return {
//             redirect: {
//                 permanent: false,
//                 destination: "/login"
//             }
//         }
//     }
//
// }

export default function ProtectedApp() {
  return (
    <>

        <div className={"h-[500px] w-[500px] mt-10"}>
            <button className={'cursor cursor-pointer'} onClick={()=>{signOut({ callbackUrl: "/" })}}>logout</button>

        </div>
    </>
  )
}


ProtectedApp.getLayout = function(page) {
    return <LayoutApp>{page}</LayoutApp>;
};
