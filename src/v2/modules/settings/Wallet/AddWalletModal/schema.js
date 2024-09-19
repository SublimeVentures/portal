import * as z from "zod";

import { isAddressValid } from "./utils";

export const createFormSchema = (networkList) => {
    return z
        .object({
            network: z.number(),
            address: z.string(),
        })
        .superRefine(({ address, network }, ctx) => {
            if (network) {
                const isNetworkAddressValid = isAddressValid[network];
                if (!isNetworkAddressValid) {
                    ctx.addIssue({
                        code: "custom",
                        message: "Unsupported network.",
                        path: ["address"],
                    });
                    return;
                }
                if (!isNetworkAddressValid(address)) {
                    const selectedNetwork = networkList.find((n) => n.chainId === network);

                    ctx.addIssue({
                        code: "custom",
                        message: `Invalid address for the ${selectedNetwork.name} network.`,
                        path: ["address"],
                    });
                }
            }
        });
};
