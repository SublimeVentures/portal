function Stat({ color, title, value, icon }) {
    return (
        <div className={`stat ${color} flex flex-1`}>
            <div className={"icon"}>{icon}</div>
            <div className={" text-right"}>
                <div className="title page-content-text">{title}</div>
                <div className={"glowNormal font-bold uppercase text-xl"}>{value}</div>
            </div>
        </div>
    );
}

export default Stat;
