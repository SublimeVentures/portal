import Image from "next/image";

const icon = `https://cdn.basedvc.fund/research/blockgames/icon.jpg`

// @TODO - Values will be adjusted when the backend will be ready
export default function OtcMessage({ action, values }) {
    return (
        <>
            {`${action} ${values.otcDeal?.amount} ${values.payout?.currencySymbol}`}
            <span className="rounded-lg">
                <Image
                    src={icon}
                    className="inline mx-2 rounded-full"
                    alt=""
                    width={25}
                    height={25}
                />
            </span>
            {` units at $${values.otcDeal?.price.toFixed(2)} each.`}
        </>
    )
}
