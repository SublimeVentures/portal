import PropTypes from "prop-types";

export default function TimelineItem({ item }) {
    return <div>{JSON.stringify(item)}</div>;
}

TimelineItem.propTypes = {
    item: PropTypes.shape({
        id: PropTypes.number,
        userId: PropTypes.number,
        typeId: PropTypes.number,
        onchainId: PropTypes.number,
        offerId: PropTypes.number,
        tenantId: PropTypes.number,
        data: PropTypes.shape({
            amount: PropTypes.number,
        }),
        createdAt: PropTypes.string,
        updatedAt: "2024-04-04T13:10:34.861Z",
        notificationType: {
            name: "INVESTMENT",
        },
        onchain: {
            id: 62304,
            txID: "0xe8072fd40e70d0def1c7dbf55ac6218468371c87521dfda99afa298fb1e13fdd",
            from: "0xe3170FE2085de7ca34AA5E5C2790a74f3c71300d",
            to: "0xF70eE904aB1B0eFf736F0a9487758700772E3327",
            typeId: 9,
            chainId: 137,
            tenant: 1,
            userId: 2661,
            data: {
                amount: 600,
                offerId: 46,
                hash: "87b5a1",
                rpc: 137,
            },
            isConfirmed: true,
            isReverted: false,
            isRegistered: true,
            blockRegistered: "54655405",
            blockConfirmed: "54655435",
            blockReverted: null,
            createdAt: "2024-03-14T17:00:31.345Z",
            updatedAt: "2024-03-14T17:01:31.206Z",
            onchainType: {
                name: "Invest",
            },
        },
    }),
};
