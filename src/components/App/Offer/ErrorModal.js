import GenericModal from "@/components/Modal/GenericModal";

export default function ErrorModal({model, setter, errorModalProps}) {
    const {code} = errorModalProps
    const title = () => {
        return (
            <>
                Booking <span className="text-app-error">error</span>
            </>
        )
    }

    const content = () => {
        return (
            <div>
                {code === "BAD_CURRENCY" && <>
                    Your transaction could not be processed.<br/>
                    Encountered error while processing payment currency.<br/><br/> Please report issue on Discord.
                </>}
                {code === "OVERALLOCATED" && <>
                    There are some <span className="text-gold">pending transactions</span> that booked the remaining allocation.
                    <br/><br/><div className="font-bold">There is still a chance!</div>Bookings are expiring after 15 minutes.<br/>Please wait for button to enable back again!
                    <div className="mt-5"><a href="https://3vcfund.notion.site/Allocation-Booking-System-2f93893f882c49d0ab305159aa7099c4" target="_blank">Read more</a></div>
                </>}
                {code === "IS_PAUSED" && <>
                    Investment is <span className="text-gold">currently paused</span>.
                    <br/><br/>Please wait for the Discord update from the staff.
                    <div className="mt-5"><a href="https://3vcfund.notion.site/Offer-phases-cf284a30c16f4586a8f2fa6b49df1e8d" target="_blank">Read more</a></div>
                </>}
                {code === "NOT_OPEN" && <>
                    Investment is <span className="text-gold">not yet open</span>.
                    <br/><br/>Don't cheat the timer!
                    <div className="mt-5"><a href="https://3vcfund.notion.site/Offer-phases-cf284a30c16f4586a8f2fa6b49df1e8d" target="_blank">Read more</a></div>
                </>}
            </div>
        )
    }

    return (<GenericModal isOpen={model} closeModal={setter} title={title()} content={content()}/>)
}

