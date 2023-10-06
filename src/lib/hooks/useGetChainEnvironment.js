import { useEffect, useState } from "react";
import {useNetwork} from "wagmi";


const useGetChainEnvironment = (currencies, diamonds) => {
    const {chain} = useNetwork()
    const [environment, setEnvironment] = useState({});


    useEffect(() => {
        const selectedChain = chain?.id ? chain.id : Object.keys(currencies)[0]
        const currencyList = currencies[selectedChain] ? Object.keys(currencies[selectedChain]).map(el => {
            let currency = currencies[selectedChain][el]
            currency.address = el
            return currency
        }) : [{}]
        const currencyNames = currencyList.map(el => el.symbol)
        const diamond = diamonds[selectedChain]
        setEnvironment({selectedChain, currencyList, currencyNames, diamond})

        return () => setEnvironment({})
    }, [chain?.id, diamonds, currencies]);

    return environment;
};

export default useGetChainEnvironment;
