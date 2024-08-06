import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { useSwitchAccount } from "wagmi";
import GenericModal from "@/components/Modal/GenericModal";
import { UniButton } from "@/components/Button/UniButton";

export default function StakingCheckModal({ address, isOpen, onSuccess, userWallets, connector }) {
    const [stakingStatus, setStakingStatus] = useState(/** @type {"pending"|"nostake"|"stake"} */ "pending");
    const [validWallet, setValidWallet] = useState(null);
    const { switchAccount } = useSwitchAccount({
        address: validWallet,
        connector,
    });

    useEffect(() => {
        const currentWalletStaked = userWallets.find((w) => w.isStaked);
        if (currentWalletStaked.wallet.toLowerCase() !== address.toLowerCase()) {
            setValidWallet(currentWalletStaked.wallet);
        } else {
            setValidWallet(address);
        }
    }, [userWallets, address]);

    const ModalTitle = () => {
        return <span className="text-app-error">Checking staking...</span>;
    };

    const ModalContentPending = () => {
        return (
            <div className="min-w-[300px]">
                <p>Before unstaking, we need to check if you are currently on the account that has staked tokens.</p>
                <p>Checking...</p>
                <div className="animate-spin border-white border-4 border-b-transparent w-24 h-24"></div>
            </div>
        );
    };

    const handleAccountSwitch = () => {
        console.log(connector);
    };

    const ModalContentRejected = () => {
        return (
            <div className="min-w-[300px]">
                <div className="text-app-error">Your tokens are staked on a different account.</div>
                <div>Switch accounts to the one that has staked tokens.</div>
                <UniButton text="Switch account" handler={handleAccountSwitch} isLarge={true} isWider={true} />
            </div>
        );
    };

    const ModalContent = () => {
        switch (stakingStatus) {
            case "pending":
                return <ModalContentPending />;
            case "nostake":
                return <ModalContentRejected />;
            case "stake":
                return <></>;
        }
    };

    return <GenericModal isOpen={isOpen} closeModal={closeModal} title={<ModalTitle />} content={<ModalContent />} />;
}

StakingCheckModal.propTypes = {
    address: PropTypes.string,
    isOpen: PropTypes.bool,
};
