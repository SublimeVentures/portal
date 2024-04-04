import { useCallback } from "react";

export default function StepInput({ step, min, max, value, setValue, ...rest }) {
    const handleUpdateValue = useCallback(
        (step) => {
            setValue((currentValue) => {
                const newValue = currentValue + step;
                return Math.min(Math.max(newValue, min), max);
            });
        },
        [setValue, min, max],
    );

    const handleKeyDown = useCallback(
        (evt) => {
            if (["ArrowUp", "ArrowDown"].includes(evt.key)) {
                evt.preventDefault();
                handleUpdateValue(evt.key === "ArrowUp" ? step : -step);
            }
        },
        [handleUpdateValue, step],
    );

    return (
        <div className="flex justify-between items-center gap-x-1 bg-transparent border border-gray-700 rounded-lg focus-within:ring-2 focus-within:ring-blue-500">
            <input
                type="text"
                value={value}
                min={min}
                max={max}
                step={step}
                className="w-18 px-2 py-0 bg-transparent border-0 text-white outline-none"
                onKeyDown={handleKeyDown}
                {...rest}
            />

            <div className="flex items-center divide-x divide-gray-200 border-s divide-gray-700 border-gray-700">
                <button
                    type="button"
                    aria-label="Decrease value"
                    className="p-2 bg-transparent text-white hover:bg-gray-800 focus:outline-none focus:ring-1 focus:ring-gray-600"
                    onClick={() => handleUpdateValue(-step)}
                >
                    <svg
                        className="flex-shrink-0 size-3.5"
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                    >
                        <path d="M5 12h14" />
                    </svg>
                </button>
                <button
                    type="button"
                    aria-label="Increase value"
                    className="p-2 bg-transparent text-white hover:bg-gray-800 focus:outline-none focus:ring-1 focus:ring-gray-600"
                    onClick={() => handleUpdateValue(step)}
                >
                    <svg
                        className="flex-shrink-0 size-3.5"
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                    >
                        <path d="M5 12h14" />
                        <path d="M12 5v14" />
                    </svg>
                </button>
            </div>
        </div>
    );
}
