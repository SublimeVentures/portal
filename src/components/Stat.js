function Stat({ color, title, value, icon }) {
    return (
        <div className="bg-border-gradient from-[#06162E] via-[#184A66] to-[#06162E] bg-angle-80 rounded border-2 border-gradient-[#1296A8] border-angle-130 hover:to-[#164062] hover:from-[#099FB7] hover:bg-angle-140 hover:border-gradient-[#E5BE83] transition-all py-3.5 pl-5 flex">
            <div className="">{icon}</div>
            <div className="flex">
                <div className="title page-content-text">{title}</div>
                <div className={"glowNormal font-bold uppercase text-xl"}>{value}</div>
            </div>
        </div>
    );
}

export default Stat;
