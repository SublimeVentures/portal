import { stepNetwork } from './network/stepState'
import { stepLiquidity } from './liquidity/stepState'
import { stepAllowance } from './allowance/stepState'
import { stepPrerequisite } from './prerequisite/stepState'
import { stepTransaction } from './transaction/stepState'
import { STEPS } from './enums'

const stepConfigurations = {
    [STEPS.NETWORK]: stepNetwork,
    [STEPS.LIQUIDITY]: stepLiquidity,
    [STEPS.ALLOWANCE]: stepAllowance,
    [STEPS.PREREQUISITE]: stepPrerequisite,
    [STEPS.TRANSACTION]: stepTransaction,
};

export function getStepState(step, state, data) {
    return stepConfigurations[step](state, data);
}
