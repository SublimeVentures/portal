import {is3VC} from "@/lib/seoConfig";

export default function About() {
  return (
  <div className="aboutGradient flex flex-col justify-center text-white pt-10 relative">
    <div className="aboutBg w-[70%] h-[100%] right-0 absolute opacity-30 z-0"></div>
    <div className="w-full z-10">
      <div className="px-10 py-25 flex flex-col gap-10 flex-1 lg:flex-row md:mx-auto md:justify-between lg:flex-row xl:max-w-[1400px] ">
        <div className="lg:max-w-[350px] flex flex-col">
          <div className="font-accent text-xs ml-1 uppercase">what we believe</div>
          <div className=" leading-snug text-3xl font-medium h-[42px]">ABOUT US</div>
          <div className={`font-accent mt-10 font-light flex flex-1`}>We are led by a team with decades of experience advising, investing and consulting in web3. Our team of analysts, researchers, advisors and consultants work hard to bring you the most exclusive opportunities.</div>
        </div>
        <div className="lg:max-w-[350px] flex flex-col">
          <div className="font-accent text-xl font-md mt-15 flex items-end h-[58px] lg:mt-0">Equality</div>
          <div className={`font-accent  mt-10 font-light flex flex-1`}>We believe investments should
            be accessible to everyone. Our mission is to democratize VC investment as well as create a fair, inclusive and equitable investment environment.</div>
        </div>
        <div className="lg:max-w-[350px] flex flex-col">
          <div className="font-accent text-xl font-md mt-15 flex items-end h-[58px] lg:mt-0">Trust</div>
          <div className={`font-accent mt-10 font-light flex flex-1`}>The anon, degen world of web3 is built upon trust.
            We strive to gain your trust through transparency, on-chain transactions and by standing behind our investments and our VC fund.</div>
        </div>
      </div>
    </div>
  </div>
  )}

