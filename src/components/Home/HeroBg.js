export default function HeroBg({ subtitle, title, content, extraClass }) {
    return (
        <div className={`min-h-screen bg-app-bg`}>
            <div className="bg min-h-screen"></div>
            <div className="text-white " style={{ marginTop: "calc(-100vh)" }}>
                <div className="flex flex-col w-full md:max-w-[80%] md:mx-auto xl:max-w-[1200px] pt-28 uppercase">
                    <div className="flex flex-col p-10 font-medium md:max-w-[600px] md:justify-center">
                        <div className="f-work text-xs ml-1">{subtitle}</div>
                        <div className="text-hero">{title}</div>
                    </div>
                </div>
                <div
                    className={`flex flex-1 p-10 md:max-w-[80%] md:mx-auto xl:max-w-[1200px] ${extraClass ? extraClass : ""}`}
                >
                    {content}
                </div>
            </div>
        </div>
    );
}
