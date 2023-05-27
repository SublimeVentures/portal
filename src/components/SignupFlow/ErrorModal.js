import GenericModal from "@/components/Modal/GenericModal";

export default function ErrorModal({isPartner, model, setter}) {

    const title = () => {
        return (<>Login <span className="text-app-error">error</span></>)
    }

    const content = () => {
        return (<>
                <div className=" ">
                    Connected account does not hold any:
                    <ul className={"list-disc ml-5"}>
                        <li className={"text-app-success font-bold"}>3VC Whale ID</li>
                        <li className={"text-app-success"}>3VC Partner's NFT</li>
                    </ul>
                </div>
                <div className={"fullWidth"}></div>
                    <a href="https://3vcfund.notion.site/How-to-access-3VC-f40a1142d93f4b0ba38e13114189a877" target="_blank" className="text-app-success mt-5 outline-0">Read more.</a>
                </>
        )
    }

  return (<GenericModal isOpen={model} closeModal={setter} title={title()} content={content()} />)
}

