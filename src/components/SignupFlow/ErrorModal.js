import GenericModal from "@/components/Modal/GenericModal";
import Linker from "@/components/link";
import {ExternalLinks} from "@/routes";

export default function ErrorModal({isPartner, model, setter}) {

    const title = () => {
        return (<>Login <span className="text-app-error">error</span></>)
    }

    const content = () => {
        return (<>
                <div className="mb-5">
                    Connected account does not hold any:
                    <ul className={"list-disc ml-5"}>
                        <li className={"text-app-success font-bold"}>3VC Whale ID</li>
                        <li className={"text-app-success"}>3VC Partner's NFT</li>
                    </ul>
                </div>
                    <Linker url={ExternalLinks.HOW_TO_ACCESS}/>
                </>
        )
    }

  return (<GenericModal isOpen={model} closeModal={setter} title={title()} content={content()} />)
}

