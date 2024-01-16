import {
    getPrerequisite,
    getTransaction
} from "@/components/App/BlockchainSteps/config";
import {useEffect} from "react";
import {useBlockchainContext} from "@/components/App/BlockchainSteps/BlockchainContext";
import {useEnvironmentContext} from "@/components/App/BlockchainSteps/EnvironmentContext";


const mapResponseToUpdatePaths = (responseData) => {
    return Object.keys(responseData).flatMap(key => [
        { path: `data.${key}`, value: responseData[key] }
    ]);
};


export default function PrerequisiteStep() {
    const {network, activeDiamond, activeOtcContract, activeChainCurrency} = useEnvironmentContext();

    const {blockchainProps, stepsIsReady, updateBlockchainProps} = useBlockchainContext();
    const {data, state} = blockchainProps
    const {isFinished} = state.prerequisite
    const {prerequisite: isReady} = stepsIsReady

    const {transactionType, prerequisiteTextProcessing,prerequisiteTextError, currency } = data


    const processPrerequisite = async () => {
        console.log("loading",data, network.chainId, transactionType)

        //loading
        updateBlockchainProps([
            {path: 'state.prerequisite.isLoading', value: true},
            {path: 'data.buttonCustomLock', value: true},
            {path: 'data.buttonCustomText', value: prerequisiteTextProcessing},
        ], "prerequiste loading")
        const interactWith = activeDiamond ? activeDiamond : activeOtcContract

        const finalData= {...data, chainId: network.chainId, interactWith}

        const processPrerequisite = await getPrerequisite(transactionType, finalData)

        //success
        if (processPrerequisite.ok) {
            console.log("preqrequsites ok",processPrerequisite, finalData)
            const dynamicUpdates = mapResponseToUpdatePaths(processPrerequisite.data);
            console.log("dynamic prerequisits", dynamicUpdates)
            console.log("!!dupppa",!!data.currencyDetails ? data.currencyDetails : activeChainCurrency[currency])
            updateBlockchainProps([
                {path: 'state.prerequisite.isFinished', value: true},
                {path: 'state.prerequisite.isLoading', value: false},
                {path: 'state.prerequisite.isError', value: false},
                {path: 'state.prerequisite.error', value: false},
                {path: 'result.prerequisite', value: processPrerequisite.data},
                {path: 'data.hash', value: processPrerequisite.data.hash},
                {path: 'data.chainId', value: network.chainId},
                {path: 'data.contract', value: interactWith},
                {path: 'data.currencyDetails', value: data.currencyDetails?.address ? data.currencyDetails : activeChainCurrency[currency]},
                {path: 'data.buttonCustomLock', value: false},
                {path: 'data.buttonCustomText', value: ""},
                ...dynamicUpdates
            ], "prerequisits suscces")
            //failure
        } else {
            console.log("preqrequsites failed",processPrerequisite)
            updateBlockchainProps([
                {path: 'state.prerequisite.isFinished', value: false},
                {path: 'state.prerequisite.isLoading', value: false},
                {path: 'state.prerequisite.isError', value: true},
                {path: 'state.prerequisite.error', value: prerequisiteTextError},
                {path: 'state.prerequisite.lock', value: true},
                {path: 'result.prerequisite', value: {}},
                {path: 'data.buttonCustomLock', value: false},
                {path: 'data.buttonCustomText', value: ""},
            ], "prerequsite failure")

        }
    }

    useEffect(() => {
        console.log("IQZ :: PREREQUISITE R/F", isReady, isFinished)
        if (!isReady || isFinished) return;
        processPrerequisite().catch(e => {
            console.log("e", e)
        })
    }, [isReady])


    useEffect(() => {
        if (isFinished) {
            const {validation, method} = getTransaction(transactionType, data)
            console.log("IQZ :: PREREQUISITE - set method",transactionType,data, isFinished, validation, method)

            if (validation) {
                updateBlockchainProps([
                    {path: 'state.prerequisite.isError', value: false},
                    {path: 'state.prerequisite.error', value: false},
                    {path: 'data.transactionMethod', value: method},
                    {path: 'data.transactionReady', value: true},
                ], "prerequsite validation successful")
            } else {
                updateBlockchainProps([
                    {path: 'state.prerequisite.isFinished', value: false},
                    {path: 'state.prerequisite.isError', value: true},
                    {path: 'state.prerequisite.error', value: "Please try again..."},
                    {path: 'state.prerequisite.lock', value: true},
                    {path: 'data.transactionMethod', value: {}},
                    {path: 'data.transactionReady', value: false},
                ], "preqrequsite validation failed")
            }
        }

    }, [isFinished])

    return (<></>)
}

