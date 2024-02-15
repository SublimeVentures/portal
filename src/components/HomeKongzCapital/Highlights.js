
export default function Highlights() {
  return (
      <div className="highlightGradient uppercase flex flex-col items-center justify-center text-white md:pt-10 ">
        <div className={" max-w-[80%] mx-auto flex flex-col items-center justify-center accentFont"}>
          <div className={" font-bold text-4xl kongzNeon text-center"}>The CyberKongz community led VC fund.</div>
          <div className={"mt-10 text-xl text-center"}>A community led initiative founded for the purpose of providing the CyberKongz community access to Venture Capital investments.</div>
          <div className={"flex justify-center items-center gap-10 mt-10 text-kongping font-bold font-accent flex-col md:flex-row"}>
            <div>$BANANA powered</div>
            <div className={"hidden md:block"}>-</div>
            <div>NFT gated</div>
            <div className={"hidden md:block"}>-</div>
            <div>Exclusive</div>
          </div>
            <div className={"-mb-10"}>
                <img src={"https://vc-cdn.s3.eu-central-1.amazonaws.com/webapp/logo_alt_14.png"} />
            </div>
        </div>
      </div>

  )}
