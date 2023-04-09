import LayoutApp from '@/components/Layout/LayoutApp';
import OfferItem from "@/components/App/Offer/OfferItem";



export default function AppOffer() {

    const investments = [
        {
            id:1,
            name: "LandX",
            description: "The emerging blockchain sector of decentralized finance based on real world assets (RWA), also called #RealFi, offers financial products backed by existing economic production and value. By bringing productive, though previously isolated assets to the blockchain, RealFi creates new opportunities for businesses and investors via products that are generally a lesser volatile means of fahe emerging blockchain sector of decentralized finance based on real world assets (RWA), also called #RealFi, offers financial products backed by existing economic production and value. By bringing productive, though previously isolated assets to the blockchain, RealFi creates new opportunities for businesses and investors via products that are generally a lesser volatile means of fa",
            starts: 1673365325,
            ends: 1673367325,
            image: 'https://citcap-public.s3.us-east-2.amazonaws.com/landx_logo.jpg'
        },
        {
            id:2,
            name: "Nillion",
            description: "Nillion allows nodes in a decentralized network to work in a different non-blockchain way, and is a generational leap from a predecessor technology known as Secure Multi-Party Computation (SMPC/MPC). Unlike blockchain, network nodes do not run immutable ledgers designed to store transaction data. Unlike traditional SMPC, nodes do not have to communicate with one another.",
            starts: 1673365325,
            ends: 1673367325,
            image: 'https://citcap-public.s3.us-east-2.amazonaws.com/nillion2_logo.jpg'
        },
        {
            id:3,
            name: "Nillion",
            description: "Nillion allows nodes in a decentralized network to work in a different non-blockchain way, and is a generational leap from a predecessor technology known as Secure Multi-Party Computation (SMPC/MPC). Unlike blockchain, network nodes do not run immutable ledgers designed to store transaction data. Unlike traditional SMPC, nodes do not have to communicate with one another.",
            starts: 1673365325,
            ends: 1673367325,
            image: 'https://citcap-public.s3.us-east-2.amazonaws.com/nillion2_logo.jpg'
        }
    ]


    return (
        <div className="grid grid-cols-12 gap-y-10 mobile:gap-10">
            {investments.map(el =>
                    <OfferItem offer={el} key={el.id}/>
            )}
        </div>

    )
}


AppOffer.getLayout = function (page) {
    return <LayoutApp>{page}</LayoutApp>;
}
;
