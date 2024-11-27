import StakingDetailsInfo from "./StakingDetailsInfo";
import { stakingPeriodOptions } from "./utils";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/v2/components/ui/form";

import { Input } from "@/v2/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/v2/components/ui/select";
import { DialogDescription, DialogTitle, DialogFooter } from "@/v2/components/ui/dialog";
import { Button } from "@/v2/components/ui/button";
import BlockchainSteps from "@/v2/components/BlockchainSteps";
import BlockchainStepButton from "@/v2/components/BlockchainSteps/BlockchainStepButton";

export default function StakingDoubleSided({ session, stakingData, stakingCurrency }) {
    const { transactionSuccessful, form, getBlockchainStepsProps, getBlockchainStepButtonProps } = stakingData;

    return (
        <div className="flex flex-col gap-4">
            <DialogTitle asChild className="w-full text-center text-lg md:text-xl">
                <h3>Staking ${stakingCurrency?.symbol} + ETH</h3>
            </DialogTitle>

            <DialogDescription className="mb-4 text-center md:text-center">
                {/* To partake in <span className="text-success-500">{tenantName}</span> investments, every */}
                {/* investor must stake minimum <span className="text-success-500">{stakeReq}$</span> token. */}
                Stake <span className="text-success-500">Based</span> Tokens and{" "}
                <span className="text-success-500">ETH</span> into a liquidity pool. Earn higher APY and LP rewards.
            </DialogDescription>

            <StakingDetailsInfo session={session} />

            <Form {...form}>
                <form className="w-full flex flex-col space-y-2">
                    <FormField
                        name="based"
                        control={form.control}
                        render={({ field }) => (
                            <FormItem className="relative w-full">
                                <FormLabel htmlFor="based">Amount</FormLabel>
                                <FormControl>
                                    <Input
                                        {...field}
                                        id="based"
                                        // onChange={(evt) => handleChange(evt, field.onChange)}
                                        // value={formatNumber(amount || "")}
                                        // aria-invalid={errors.investmentAmount ? "true" : "false"}
                                        className="w-full bg-white/5 text-sm 2xl:text-base"
                                    />
                                </FormControl>
                                <div className="absolute right-4 top-[37px] text-white text-sm 2xl:text-base">
                                    BASED
                                </div>
                            </FormItem>
                        )}
                    />
                    <FormField
                        name="eth"
                        control={form.control}
                        render={({ field }) => (
                            <FormItem className="relative w-full">
                                <FormControl>
                                    <Input
                                        {...field}
                                        id="eth"
                                        // onChange={(evt) => handleChange(evt, field.onChange)}
                                        // value={formatNumber(amount || "")}
                                        // aria-invalid={errors.investmentAmount ? "true" : "false"}
                                        className="w-full bg-white/5 text-sm 2xl:text-base"
                                    />
                                </FormControl>
                                <div className="absolute right-4 top-1.5 text-white text-sm 2xl:text-base">ETH</div>
                            </FormItem>
                        )}
                    />
                    <FormField
                        name="staking-period"
                        control={form.control}
                        render={({ field }) => (
                            <FormItem className="relative w-full">
                                <FormControl>
                                    <Select {...field} className="">
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder="Staking period" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {stakingPeriodOptions.map((opt) => (
                                                <SelectItem key={opt.id} value={opt.value}>
                                                    {opt.value}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </FormControl>
                            </FormItem>
                        )}
                    />
                </form>
            </Form>

            {transactionSuccessful ? (
                <DialogFooter className="items-center">
                    <Button className="w-full md:w-64">Close</Button>
                </DialogFooter>
            ) : (
                <>
                    <BlockchainSteps {...getBlockchainStepsProps()} />
                    <DialogFooter className="items-center">
                        <BlockchainStepButton className="w-full md:w-64" {...getBlockchainStepButtonProps()} />
                    </DialogFooter>
                </>
            )}
        </div>
    );
}
