import { cn } from "@/lib/cn";

const SingleChain = ({ icon: Icon, active }) => {
    return (
        <div className="relative h-[43px]">
            <svg className="absolute" xmlns="http://www.w3.org/2000/svg" width="42.905" height="43" viewBox="0 0 42.905 43">
                <path id="Union_6" data-name="Union 6" d="M241.548,0A21.5,21.5,0,1,1,220.1,21.5,21.476,21.476,0,0,1,241.548,0Z" transform="translate(-220.096)" fill="#0d2b3a"/>
            </svg>
                
            <div className="relative flex items-center h-full justify-center w-max gap-3">
                <div className={cn("mx-1.5 flex items-center justify-center w-[31px] h-[31px] rounded-full bg-[#113651]", {
                    "bg-primary-light-gradient": active
                })}>
                    <Icon className="p-2" />
                </div>
            </div>
        </div>
    )
}

export default SingleChain;
