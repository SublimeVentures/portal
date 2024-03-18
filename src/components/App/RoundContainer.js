export default function RoundContainer({ isSuccess, icon, content, forcedClass }) {
    return (
        <div className={`w-full ${isSuccess ? "text-black" : ""} ${forcedClass}`}>
            <div
                className={`rounded-xl bg-navy-accent flex flex-1 flex-col justify-center items-center relative h-full ${isSuccess ? "!bg-app-success" : ""}`}
            >
                <div
                    className={`absolute bg-navy-accent rounded-full circleFloat w-18 h-18 justify-center items-center flex ${isSuccess ? "!bg-app-success" : ""}`}
                >
                    {icon}
                </div>
                {content}
            </div>
        </div>
    );
}
