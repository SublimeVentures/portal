import {
    getPrerequisite,
    getTransaction
} from "@/components/App/BlockchainSteps/config";
import {useEffect} from "react";
import {useBlockchainContext} from "@/components/App/BlockchainSteps/BlockchainContext";


const mapResponseToUpdatePaths = (responseData) => {
    return Object.keys(responseData).flatMap(key => [
        { path: `data.transaction.params.${key}`, value: responseData[key] },
        { path: `data.prerequisite.${key}`, value: responseData[key] }
    ]);
};


export default function PrerequisiteStep() {
    const {blockchainProps, stepsIsReady, updateBlockchainProps} = useBlockchainContext();
    const {data, state} = blockchainProps

    const {transaction: transactionData, prerequisite: prerequisiteData} = data
    const {prerequisite: isReady} = stepsIsReady
    const {isFinished} = state.prerequisite
    const {type: transactionType, params: transactionParams} = transactionData
    const {textProcessing, textError} = prerequisiteData


    const processPrerequisite = async () => {
        //loading
        updateBlockchainProps([
            {path: 'state.prerequisite.isLoading', value: true},
            {path: 'data.button.customLockState', value: true},
            {path: 'data.button.customLockText', value: textProcessing},
        ], "prerequiste loading")
        const processPrerequisite = await getPrerequisite(transactionType, prerequisiteData)

        //success
        if (processPrerequisite.ok) {
            const dynamicUpdates = mapResponseToUpdatePaths(processPrerequisite.data);

            updateBlockchainProps([
                {path: 'state.prerequisite.isFinished', value: true},
                {path: 'state.prerequisite.isLoading', value: false},
                {path: 'state.prerequisite.isError', value: false},
                {path: 'state.prerequisite.error', value: false},
                {path: 'result.prerequisite', value: processPrerequisite.data},
                {path: 'data.transaction.params.hash', value: processPrerequisite.data.hash},
                {path: 'data.button.customLockState', value: false},
                {path: 'data.button.customLockText', value: ""},
                ...dynamicUpdates
            ], "prerequisits suscces")
            //failure
        } else {
            updateBlockchainProps([
                {path: 'state.prerequisite.isFinished', value: false},
                {path: 'state.prerequisite.isLoading', value: false},
                {path: 'state.prerequisite.isError', value: true},
                {path: 'state.prerequisite.error', value: textError},
                {path: 'state.prerequisite.lock', value: true},
                {path: 'result.prerequisite', value: {}},
                {path: 'data.button.customLockState', value: false},
                {path: 'data.button.customLockText', value: ""},
            ], "prerequsite failure")

        }
    }

    useEffect(() => {
        console.log("IQZ :: PREREQUISITE R/F", isReady, isFinished)
        if (!isReady && !isFinished) return;
        processPrerequisite().catch(e => {
            console.log("e", e)
        })
    }, [isReady])


    useEffect(() => {
        if (isFinished) {
            const {validation, method} = getTransaction(transactionType, transactionParams)
            console.log("IQZ :: PREREQUISITE - set method",transactionType,transactionParams, isFinished, validation, method)

            if (validation) {
                updateBlockchainProps([
                    {path: 'state.prerequisite.isError', value: false},
                    {path: 'state.prerequisite.error', value: false},
                    {path: 'data.transaction.method', value: method},
                    {path: 'data.transaction.ready', value: true},
                ], "prerequsite validation successful")
            } else {
                updateBlockchainProps([
                    {path: 'state.prerequisite.isFinished', value: false},
                    {path: 'state.prerequisite.isError', value: true},
                    {path: 'state.prerequisite.error', value: "Validation failed"},
                    {path: 'state.prerequisite.lock', value: true},
                    {path: 'data.transaction.method', value: {}},
                    {path: 'data.transaction.ready', value: false},
                ], "preqrequsite validation failed")
            }
        }

    }, [isFinished])

    return (<></>)
}

