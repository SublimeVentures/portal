import {ButtonIconSize, RoundButton} from "@/components/Button/RoundButton";
import GenericModal from "@/components/Modal/GenericModal";
import Image from "next/image";

import {useConnect} from 'wagmi'

export default function ErrorModal({isPartner, model, setter}) {

    const title = () => {
        return (<>Login <span className="text-app-error">error</span></>)
    }

    const content = () => {
        return (<>
                <div className=" ">
                    Connected account does not hold any of:
                    <ul className={"list-disc ml-5"}>
                        <li className={"text-app-success font-bold"}>3VC Whale ID</li>
                        <li className={"text-app-success"}>3VC Partner's NFT</li>
                    </ul>
                </div>
                <div className={"fullWidth"}></div>
                    <a href="#" target="_blank" className="text-app-error mt-5 outline-0">Read more.</a>
                </>
        )
    }

  return (<GenericModal isOpen={model} closeModal={setter} title={title()} content={content()} />)
}

