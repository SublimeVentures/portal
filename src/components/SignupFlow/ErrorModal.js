import React, { useMemo } from "react";
import GenericModal from "@/components/Modal/GenericModal";
import Linker from "@/components/link";
import { getTenantConfig, TENANT } from "@/lib/tenantHelper";
import { LoginErrorsEnum } from "@/constants/enum/login.enum";

const { externalLinks } = getTenantConfig();

const TENANTS_ERROR = () => {
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
                        <Linker url={externalLinks.HOW_TO_ACCESS} />
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
                        <Linker url={externalLinks.HOW_TO_ACCESS} />
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
                        <Linker url={externalLinks.HOW_TO_ACCESS} />
                    </div>
                </>
            );
        }
        case TENANT.BAYC: {
            return (
                <>
                    <div className="mb-5">
                        You were stopped by <strong>APE GUARD</strong>.<br />
                        <div className={"text-app-error"}>BAYC / MAYC NFT not detected...</div>
                    </div>
                    <div>
                        <Linker url={externalLinks.HOW_TO_ACCESS} />
                    </div>
                </>
            );
        }
    }
};

export default function ErrorModal({ isOpen, closeModal, errorMessage }) {
    const title = (
        <>
            Login <span className="text-app-error">error</span>
        </>
    );

    let content;
    if (errorMessage === LoginErrorsEnum.WALLET_ALREADY_ACTIVE) {
        content = <p className="text-app-success font-bold mb-5">Wallet already active.</p>;
    } else if (errorMessage === LoginErrorsEnum.WALLETS_LIMIT_REACHED) {
        content = <p className="text-app-success font-bold mb-5">Reached maximum wallets limit.</p>;
    } else {
        content = TENANTS_ERROR();
    }

    return <GenericModal isOpen={isOpen} closeModal={closeModal} title={title} content={content} />;
}
