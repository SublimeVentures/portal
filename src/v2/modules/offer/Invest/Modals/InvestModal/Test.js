// Props
// buttonIcon: undefined -> Remove
// steps: {liquidity: true, allowance: true, transaction: true

export default function Test({ ...props }) {
    // console.log('-test-', props)

    // console.log(` ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- TEST---- ---- ---- ---- ---- ---- ---- ---- ----  ---- ---- ---- `,
    //   props.content, props.steps, props.extraState, props.status
    //   )

    return (
        <div className="text-white">
            <button className="border-2 rounded px-8 py-2 text-pink-600 mb-4" onClick={props.run}>
                Run
            </button>
            <div className="text-[24px] font-bold text-pink-600">Current content (props.content)</div>
            {JSON.stringify(props.content)}
            <div className="mt-8 text-[24px] font-bold text-pink-600">Button</div>
            Text: {JSON.stringify(props.buttonText)} <br />
            Lock: {JSON.stringify(props.buttonLock)} <br />
            <div className="mt-8 text-[24px] font-bold text-pink-600">Status</div>
            {JSON.stringify(props.status)}
            <div className="mt-8 text-[24px] font-bold text-pink-600">Extra state</div>
            Network: {JSON.stringify(props.extraState.network)} <br /> <br />
            Liquidity: {JSON.stringify(props.extraState.liquidity)} <br /> <br />
            Allowance: {JSON.stringify(props.extraState.allowance)} <br /> <br />
            Prerequisite: {JSON.stringify(props.extraState.prerequisite)} <br /> <br />
            Transaction: {JSON.stringify(props.extraState.transaction)} <br /> <br />
        </div>
    );
}
