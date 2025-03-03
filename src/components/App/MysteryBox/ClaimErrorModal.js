import GenericModal from "@/components/Modal/GenericModal";
import Linker from "@/components/link";
import { getTenantConfig } from "@/lib/tenantHelper";

const { externalLinks } = getTenantConfig();

export default function ClaimErrorModal({ model, setter, errorMessage }) {
    const title = () => {
        return (
            <>
                Claim <span className="text-app-error">error</span>
            </>
        );
    };

    const content = () => {
        return (
            <>
                <div className="mb-5">{errorMessage}.</div>
                <div>
                    <Linker url={externalLinks.LOOTBOX} />
                </div>
            </>
        );
    };

    return <GenericModal isOpen={model} closeModal={setter} title={title()} content={content()} />;
}
