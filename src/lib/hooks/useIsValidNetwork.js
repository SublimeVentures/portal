import { useEffect } from "react";

function useIsValidNetwork(value) {
    useEffect(() => {
        // Your code that should run when 'value' changes
        console.log("Value has changed:", value);

        // Optional cleanup function
        return () => {
            // Cleanup code, if needed, runs before the next effect or when the component unmounts
        };
    }, [value]); // Dependency array containing the value that should trigger the effect
}

export default useIsValidNetwork;
