import { saveTransaction } from "@/fetchers/otc.fetcher";

export const blockchainPrerequisite = async (params) => {
    const { market, price, amount, isSeller, account, network } = params;
    const transaction = await saveTransaction(market.id, network?.chainId, price, amount, isSeller, account);

    if (transaction.ok) {
        return {
            ok: true,
            data: { hash: transaction.hash },
        };
    } else {
        return {
            ok: false,
            error: "Error generating hash",
        };
    }
};
