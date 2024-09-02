import * as RadixAccordion from "@radix-ui/react-accordion";
import PropTypes from "prop-types";
import { forwardRef } from "react";
import { ChevronDownIcon } from "@radix-ui/react-icons";

/**
 * @param {import("@radix-ui/react-accordion").AccordionSingleProps.type | import("@radix-ui/react-accordion").AccordionMultipleProps.type} type
 * @param {{value: string}[]} items
 * @param props
 * @returns {JSX.Element}
 * @constructor
 */
const Accordion = forwardRef(({ type, children, ...props }, ref) => {
    return (
        <RadixAccordion.Root type={type} {...props} ref={ref} collapsible>
            {children}
        </RadixAccordion.Root>
    );
});

Accordion.displayName = "Accordion";

const AccordionItem = forwardRef(({ children, title, ...props }, ref) => {
    return (
        <RadixAccordion.Item {...props} ref={ref} className="text-white">
            <RadixAccordion.Header>
                <RadixAccordion.Trigger className="accordion-trigger py-3 md:py-2 flex items-center w-full text-left justify-between">
                    <span>{title}</span>
                    <ChevronDownIcon className="accordion-chevron" aria-hidden />
                </RadixAccordion.Trigger>
            </RadixAccordion.Header>
            <RadixAccordion.Content>{children}</RadixAccordion.Content>
        </RadixAccordion.Item>
    );
});

AccordionItem.displayName = "AccordionItem";

Accordion.propTypes = {
    children: PropTypes.node,
    type: PropTypes.string.isRequired,
};

export { Accordion, AccordionItem };
