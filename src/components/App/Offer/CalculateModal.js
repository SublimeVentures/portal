import GenericModal from "@/components/Modal/GenericModal";
import {useState} from "react";
import Input from "@/components/App/Input";
import {IconButton} from "@/components/Button/IconButton";
import IconMinus from "@/assets/svg/MinusZ.svg";
import IconPlus from "@/assets/svg/PlusZ.svg";

export default function CalculateModal({model, setter, calculateModalProps}) {
    const { maxAllocation, offer } = calculateModalProps

    const [amount, setAmount] = useState(0)
    const [price, setPrice] = useState(0)
    const [multiplier, setMultiplier] = useState(20)


    const [statusAmount, setStatusAmount] = useState(false)

    const multiplierParsed = multiplier.toFixed(2)


    const setAmountHandler = (amt) => {
        setAmount(amt)
        if(amt) calcPrice(multiplier, amt)
    }

    const calcPrice = (multi, amt) => {setPrice(Number(Number(amt * (100 - offer.tax)/100  * multi - amt ).toFixed(2)))}


    const setMultiplierHandler = (add) => {
        if(add) {
            setMultiplier((current) => {
                calcPrice(current+5, amount)
                return current+5
            })
        } else {
            setMultiplier((current) => {
                if(current-5 <0) {
                    return 1
                } else {
                    calcPrice(current-5, amount)
                    return current-5
                }
            })
        }
    }

    const title = () => {
        return (
            <>
                <span className="text-app-success">Profit</span> calculator
            </>
        )
    }

    const content = () => {
        return (
            <div className=" flex flex-1 flex-col">
                <div className={'pt-10'}>
                    <Input type={'number'}
                           placeholder={'Buying allocation'}
                           max={maxAllocation}
                           min={offer.alloMin}
                           setStatus={setStatusAmount}
                           setInput={setAmountHandler}
                           input={amount}
                           light={true}
                           full={true}
                           dividable={10}
                           after={"USD"}
                    />
                </div>
                <div className={"py-10 flex flex-row justify-center items-center select-none"}>
                    <IconButton zoom={1.1} size={''} noBorder={true} icon={<IconMinus className={"w-8"}/>} handler={() => setMultiplierHandler(false)}/>
                    <div className={`px-6 font-bold tabular-nums transition-colors duration-300 text-2xl ${multiplier>1 ? ' text-app-success' : ' text-app-error'}`}>x<span className={"text-5xl"}>{multiplierParsed}</span></div>
                    <IconButton zoom={1.1} size={''} noBorder={true} icon={<IconPlus className={"w-8"}/>} handler={() => setMultiplierHandler(true)}/>
                </div>
                <div>
                    <Input type={'number'}
                           placeholder={'Profit from selling'}
                           input={price}
                           light={true}
                           setInput={() => {}}
                           setStatus={() => {}}
                           full={true}
                           after={"USD"}
                    />
                </div>


                <div className="text-app-error pt-10">Usual multiplier for seed investment is between 20-50x. Read more here.</div>
            </div>
        )
    }

    return (<GenericModal isOpen={model} closeModal={setter} title={title()} content={content()}/>)
}

