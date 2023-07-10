import GenericModal from "@/components/Modal/GenericModal";
import Linker from "@/components/link";
import {ExternalLinks} from "@/routes";
import {is3VC} from "@/lib/utils";

export default function ErrorModal({model, setter}) {

    const title = () => {
        return (<>Login <span className="text-app-error">error</span></>)
    }

    const contentBased = () => {
        return (<>

                <div className="mb-5">
                    Connected account does not hold any:
                    <ul className={"list-disc ml-5"}>
                        <li className={"text-app-success font-bold"}>3VC Whale ID</li>
                        <li className={"text-app-success"}>3VC Partner's NFT</li>
                    </ul>
                </div>
                <div>
                    <Linker url={ExternalLinks.HOW_TO_ACCESS}/>

                </div>
                </>
        )
    }
    const contentCitCap = () => {
        return (<>
                    <div className="mb-5">
                        You were stopped by <strong>THE FIREWALL</strong>.<br/>
                        <i>You filthy meatbag, only chosen ones can pass!</i><br/><br/>
                        <div className={"text-app-error"}>Neo Tokyo Citizen NFT not detected...</div>
                    </div>
                    <div>
                        <Linker url={ExternalLinks.HOW_TO_ACCESS}/>
                    </div>
                </>
        )
    }

    const content = () => {
        return is3VC ? contentBased() : contentCitCap()
    }

  return (<GenericModal isOpen={model} closeModal={setter} title={title()} content={content()} />)
}

