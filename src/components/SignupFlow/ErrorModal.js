import GenericModal from "@/components/Modal/GenericModal";
import Linker from "@/components/link";
import { ExternalLinks } from "@/routes";
import { TENANT } from "@/lib/tenantHelper";
import { LoginErrorsEnum } from "@/constants/enum/login.enum";

const TENANTS_ERROR = (model) => {
    if (model === LoginErrorsEnum.GEOLOCATION_ERROR) {
        return (
            <>
                <div className="mb-5">
                    Service is not available in your country
                    <p className="pt-5 pb-2 text-app-success font-bold text-center">Inaccessible Regions:</p>
                    <p className="text-app-success text-center">
                        United States, Canada, China, Hong Kong, Singapore, United States Minor Outlying Islands, United
                        Kingdom, Cuba, Afghanistan, Republic of the Congo, Ethiopia, Iran, Iraq, Lebanon, Libya,
                        Somalia, South Korea, Russia, Syria, Sudan, Venezuela, British Virgin Islands, Yemen
                    </p>
                </div>
            </>
        );
    }

    switch (Number(process.env.NEXT_PUBLIC_TENANT)) {
        case TENANT.basedVC: {
            return (
                <>
                    <div className="mb-5">
                        Connected account does not hold any:
                        <ul className={"list-disc ml-5"}>
                            <li className={"text-app-success font-bold"}>basedVC Whale ID</li>
                            <li className={"text-app-success"}>basedVC Partner's NFT</li>
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
                        <div className={"text-app-error"}>Neo Tokyo Citizen NFT not detected...</div>
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
                        <div className={"text-app-error"}>CyberKongz NFT not detected...</div>
                    </div>
                    <div>
                        <Linker url={ExternalLinks.HOW_TO_ACCESS} />
                    </div>
                </>
            );
        }
        case TENANT.BAYC: {
            return (
                <>
                    <div className="mb-5">
                        You were stopped by <strong>APE GUARD</strong>.<br />
                        <div className="text-app-error">BAYC / MAYC NFT not detected...</div>
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

    return <GenericModal isOpen={!!model} closeModal={setter} title={title()} content={TENANTS_ERROR(model)} />;
}
