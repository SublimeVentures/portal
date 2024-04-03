import { tenantIndex } from "@/lib/utils";
import { TENANT } from "@/lib/tenantHelper";

export default function Loader() {
    switch (tenantIndex) {
        case TENANT.basedVC:
            return (
                <div id="load">
                    <div>G</div>
                    <div>N</div>
                    <div>I</div>
                    <div>D</div>
                    <div>A</div>
                    <div>O</div>
                    <div>L</div>
                </div>
            );
        default:
            return (
                <img
                    src={"https://cdn.citizencapital.fund/webapp/load.gif"}
                    className={"max-w-[400px] max-h-[300px] absolute-center-loading"}
                    alt="citizencapitaloader"
                />
            );
    }
}
