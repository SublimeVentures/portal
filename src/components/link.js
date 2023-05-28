import Link from "@/assets/svg/link.svg";

export const LinkerLinks = {
    INVESTMENT_RETURN: "https://3vcfund.notion.site/Return-from-the-investment-0656411b2d4c44078c675d3f87e8b136",
    BOOKING_SYSTEM: "https://3vcfund.notion.site/Allocation-Booking-System-2f93893f882c49d0ab305159aa7099c4",
    OFFER_PHASES: "https://3vcfund.notion.site/Offer-phases-cf284a30c16f4586a8f2fa6b49df1e8d",
    AFTER_INVESTMENT: "https://3vcfund.notion.site/After-investment-7a44086b917545029d95574c53c66a7d",
    WHALE_CLUB: "https://3vcfund.notion.site/3VC-Whale-Club-5fea374623c1493d8af2b4b04914ab3e",
    SUPPORTED_NETWORKS: "https://3vcfund.notion.site/Supported-networks-safe-gas-3d50096070d54efebae0590d02acbcdb",
    HOW_TO_ACCESS: "https://3vcfund.notion.site/How-to-access-3VC-f40a1142d93f4b0ba38e13114189a877",
    DELEGATED_ACCESS: "https://3vcfund.notion.site/Delegated-access-dc60abd8a5654641a7bd77d537256aa7",
}

function Linker({url, text}) {
    return (
        <span className={"link outline-0"}>
            <div className={"flex flex-row no-wrap"}>
                   <a href={url} target={"_blank"} className={"outline-0"}>{text ? text : "Read more"}</a>
                    <Link className={"w-5 -mt-2"}></Link>
            </div>

        </span>
    )
}

export default Linker
