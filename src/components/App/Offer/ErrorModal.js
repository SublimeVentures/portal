import GenericModal from "@/components/Modal/GenericModal";

export default function ErrorModal({model, setter, code}) {

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
                    <div className="mt-5"><a href="#" target="_blank">Read more.</a></div>
                </>}
            </div>
        )
    }

    return (<GenericModal isOpen={model} closeModal={setter} title={title()} content={content()}/>)
}

