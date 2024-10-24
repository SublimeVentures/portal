import { forwardRef, createRef } from "react";
import { cva, cx } from "class-variance-authority";
import { cn } from "@/lib/cn";

const baseVariants = cva([
    "inline-flex text-white rounded whitespace-nowrap cursor-pointer outline-none",
    "transition-hover transition-colors border",
    "bg-white/5 border border-primary/30 hover:border-primary focus:border-primary",
    "data-[invalid]:bg-[#3F2334] data-[invalid]:border-[#D53839]",
]);

const readOnlyVariants = cva("", {
    variants: {
        readOnly: {
            true: "border-transparent hover:border-transparent focus:border-transparent",
        },
        disabled: {
            true: "text-white/20 border-transparent hover:border-transparent focus:border-transparent",
        },
    },
});

const controlsSize = cva("", {
    variants: {
        size: {
            sm: "py-2 px-3 !leading-6 text-sm",
            md: "py-2 px-3 text-base !leading-8",
        },
    },
    defaultVariants: {
        size: "md",
    },
});

const buttonReadOnly = cva("", {
    variants: {
        readOnly: {
            true: "text-white/20",
        },
    },
});

const buttonVariants = (props) => cx(buttonReadOnly(props));

const controlVariants = (props) => {
    return cx(baseVariants(props), readOnlyVariants(props), controlsSize(props));
};

const wrapperVariants = (props) => cx(baseVariants(props), readOnlyVariants(props));

const InputNumber = forwardRef(
    ({ className, size, readOnly, value, min, max, step, onValueChange, disabled, ...props }, ref) => {
        const sizeClasses = controlsSize({ size });
        ref = ref || createRef();
        const handleStepUp = () => {
            if (ref.current) {
                ref.current.stepUp();
                onValueChange?.(Number(ref.current.value));
            }
        };

        const handleStepDown = () => {
            if (ref.current) {
                ref.current.stepDown();
                onValueChange?.(Number(ref.current.value));
            }
        };

        return (
            <div className={cn("text-center", wrapperVariants({ size, readOnly, disabled }), className)}>
                <button
                    className={cn(
                        sizeClasses,
                        buttonVariants({ size, readOnly: readOnly || min === value || disabled }),
                    )}
                    onClick={handleStepDown}
                    disabled={readOnly || disabled}
                >
                    -
                </button>
                <input
                    type="number"
                    ref={ref}
                    readOnly={readOnly}
                    onChange={(e) => {
                        const value = Number(e.target.value);
                        onValueChange?.(value < min ? min : value > max ? max : value);
                    }}
                    min={min}
                    max={max}
                    step={step}
                    value={value}
                    disabled={disabled}
                    {...props}
                    className={cn(
                        "bg-transparent w-full border-0 cursor-pointer outline-none text-center",
                        sizeClasses,
                        { "cursor-not-allowed": disabled },
                    )}
                />
                <button
                    className={cn(
                        "text-center",
                        sizeClasses,
                        buttonVariants({ size, readOnly: readOnly || max === value || disabled }),
                    )}
                    onClick={handleStepUp}
                    disabled={readOnly || disabled}
                >
                    +
                </button>
            </div>
        );
    },
);

const InputFunds = forwardRef(
    (
        { className, size, readOnly, value, min = 0, max, step = 10, icon, onValueChange, label, after, ...props },
        ref,
    ) => {
        ref = ref || createRef();

        return (
            <div
                className={cn(
                    "text-center px-6 py-3 items-center w-full",
                    wrapperVariants({ size, readOnly }),
                    className,
                )}
            >
                {icon}
                <label className="flex flex-col items-baseline w-full">
                    <div className="text-sm">{label}</div>
                    <input
                        type="number"
                        ref={ref}
                        readOnly={readOnly}
                        onWheel={(e) => e.target.blur()}
                        onChange={(e) => onValueChange?.(Number(e.target.value))}
                        min={min}
                        max={max}
                        step={step}
                        value={`${value}`}
                        {...props}
                        className="bg-transparent w-full border-0 cursor-pointer outline-none font-light"
                    />
                </label>
                {after}
            </div>
        );
    },
);

InputNumber.displayName = "InputNumber";

InputFunds.displayName = "InputFunds";

const Input = forwardRef(({ className, type, size, readOnly, ...props }, ref) => {
    if (type === "number") {
        return <InputNumber ref={ref} className={className} size={size} readOnly={readOnly} {...props} />;
    }
    if (type === "fund") {
        return <InputFunds ref={ref} className={className} size={size} readOnly={readOnly} {...props} />;
    }

    return (
        <input
            type={type}
            className={cn(controlVariants({ size, readOnly }), className)}
            ref={ref}
            readOnly={readOnly}
            {...props}
        />
    );
});

Input.displayName = "Input";

export { Input, controlVariants };
