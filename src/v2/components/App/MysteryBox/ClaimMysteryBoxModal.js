import Link from "next/link";
import { MYSTERY_TYPES } from "@/lib/enum/store";
import Success from "@/v2/modules/upgrades/Success";
import Modal from "@/v2/modules/upgrades/Modal";

export default function ClaimMysteryBoxModal({ model, setter, claimData }) {
    const rewardType = (type, item) => {
        switch (type) {
            case MYSTERY_TYPES.NFT: {
                return (
                    <>
                        To redeem your NFT, all you need to do is head over to our Discord and create ticket.
                        <br />
                        <span className="text-primary">
                            Make sure to include your redeem code in the ticket message!
                        </span>
                        <br />
                        It's a one-time-use code to claim your shiny new NFT,
                        <br />
                        so don't share it with anyone - you risk losing your prize.
                    </>
                );
            }
            case MYSTERY_TYPES.Discount: {
                return (
                    <>
                        To redeem your discount, all you need to do is head over <br />
                        to our Discord and create ticket.
                        <br />
                        <span className="text-primary">
                            Make sure to include your redeem code in the ticket message!
                        </span>
                        <br />
                        It's a one-time-use code that ensures <strong>{item.discount}%</strong> discount on floor price
                        <br />
                        of the <strong>{item.item}</strong>, so don't share it with anyone - you risk losing your prize.
                    </>
                );
            }
            case MYSTERY_TYPES.Upgrade: {
                return (
                    <div>
                        The Upgrade was assigned to your vault.
                        <br />
                        Read more how it works <Link href="">here</Link>.
                    </div>
                );
            }
            case MYSTERY_TYPES.Allocation: {
                return <div>The allocation was assigned to your vault.</div>;
            }
        }
    };
    return (
        <Modal open={model} onClose={setter} variant="pattern">
            <Success.Content>
                <Success.Kicker>Congratulations!</Success.Kicker>
                <Success.Title>{claimData.name}</Success.Title>
                <Success.Description>{rewardType(claimData.type, claimData)}</Success.Description>
                {claimData?.code && (
                    <>
                        <Success.Article>
                            <code className="font-mono text-lg text-center w-full">#{claimData.code}</code>
                        </Success.Article>
                        <Success.Footer className="text-red-500">
                            The redeem code won't appear again, save it before closing!
                        </Success.Footer>
                    </>
                )}
            </Success.Content>
        </Modal>
    );
}
