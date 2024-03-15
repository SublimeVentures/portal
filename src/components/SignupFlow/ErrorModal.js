import GenericModal from "@/components/Modal/GenericModal";
import Linker from "@/components/link";
import { ExternalLinks } from "@/routes";
import { TENANT } from "@/lib/tenantHelper";

const TENANTS_ERROR = () => {
    switch (Number(process.env.NEXT_PUBLIC_TENANT)) {
        case TENANT.basedVC: {
            return (
                <>
                    <div className="mb-5">
                        Connected account does not hold any:
                        <ul className={"list-disc ml-5"}>
                            <li className={"text-app-success font-bold"}>
                                basedVC Whale ID
                            </li>
                            <li className={"text-app-success"}>
                                basedVC Partner's NFT
                            </li>
                        </ul>
                    </div>
                    <div>
                        <Linker url={ExternalLinks.HOW_TO_ACCESS} />
                    </div>
                </>
            );
        }
        case TENANT.NeoTokyo: {
            return (
                <>
                    <div className="mb-5">
                        You were stopped by <strong>THE FIREWALL</strong>.<br />
                        <i>You filthy meatbag, only chosen ones can pass!</i>
                        <br />
                        <br />
                        <div className={"text-app-error"}>
                            Neo Tokyo Citizen NFT not detected...
                        </div>
                    </div>
                    <div>
                        <Linker url={ExternalLinks.HOW_TO_ACCESS} />
                    </div>
                </>
            );
        }
        case TENANT.CyberKongz: {
            return (
                <>
                    <div className="mb-5">
                        You were stopped by <strong>THE KONG</strong>.<br />
                        <div className={"text-app-error"}>
                            CyberKongz NFT not detected...
                        </div>
                    </div>
                    <div>
                        <Linker url={ExternalLinks.HOW_TO_ACCESS} />
                    </div>
                </>
            );
        }
    }
};

export default function ErrorModal({ model, setter }) {
    const title = () => {
        return (
            <>
                Login <span className="text-app-error">error</span>
            </>
        );
    };

    return (
        <GenericModal
            isOpen={model}
            closeModal={setter}
            title={title()}
            content={TENANTS_ERROR()}
        />
    );
}
