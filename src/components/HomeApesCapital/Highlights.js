export default function Highlights() {
    return (
        <div className="highlightGradient uppercase flex flex-col items-center justify-center text-white md:pt-10 ">
            <div className={" max-w-[80%] mx-auto flex flex-col items-center justify-center accentFont"}>
                <div className={" font-bold text-4xl pt-10 text-center"}>The APES+ Venture Capital arm</div>
                <div className={"mt-[90px] text-xl text-center"}>
                    Providing the Yacht Club access to venture capital investment opportunities. <br />
                    Made for Apes by APES
                </div>
                <div className={"mt-10 text-xl text-center text-app-capital"}>Bored & Mutant Ape exclusive</div>
                <div className={"-mb-10"}>
                    <img src={"https://cdn.basedvc.fund/webapp/logo_alt_19.png"} />
                </div>
            </div>
        </div>
    );
}
