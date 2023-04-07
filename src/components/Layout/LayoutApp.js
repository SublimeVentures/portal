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

export default function Layout({ children }) {
    return (
        <>
            <header>Website2</header>
            <main>{children}</main>
            <aside>Sidebar</aside>
            <footer>&copy; Website</footer>
        </>
    );
}
