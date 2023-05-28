// import Link from "@/assets/svg/link.svg";

function Linker({url, text}) {
    return (
        <span className={"link outline-0"}>
            <div className={"flex flex-row no-wrap"}>
                   <a href={url} target={"_blank"} className={"outline-0"}>{text ? text : "Read more"}
                       {/*<Link className={"w-5 -mt-2"}></Link>*/}
                   </a>

            </div>

        </span>
    )
}

export default Linker
