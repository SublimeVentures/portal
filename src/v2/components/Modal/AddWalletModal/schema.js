import * as z from "zod";

import { isAddressValid } from "./utils";

export const createFormSchema = (networkList) => {
  return z.object({
    network: z.string(),
    address: z.string(),
  }).superRefine(({ address, network }, ctx) => {
    if (!isAddressValid[network](address)) {
      const selectedNetwork = networkList.find(n => n.id === network);

      ctx.addIssue({
        code: "custom",
        message: `Invalid address for the ${selectedNetwork.name} network.`,
        path: ['address'],
      });
    }
  });
};
