export const LinkerTypes = {
    Red: "red",
    Gold: "gold",
};

function Linker({ url, text, type }) {
    return (
        <span className={`link outline-0 ${type ? type : ""}`}>
            <div className={"flex flex-row no-wrap"}>
                <a href={url} target={"_blank"} className={"outline-0 outline-none"}>
                    {text ? text : "Read more"}
                </a>
            </div>
        </span>
    );
}

export default Linker;
