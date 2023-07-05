import {is3VC} from "@/lib/seoConfig";

export default function Loader() {
    return (
        <div className="flex -ml-10 flex-1 relative">
            {is3VC ?  <div id="load">
                <div>G</div>
                <div>N</div>
                <div>I</div>
                <div>D</div>
                <div>A</div>
                <div>O</div>
                <div>L</div>
            </div> :
                <img src={"https://cdn.3vc.fund/webapp/load.gif"} className={"max-w-[400px] max-h-[300px] mx-auto"} />
            }
        </div>
    )
}
