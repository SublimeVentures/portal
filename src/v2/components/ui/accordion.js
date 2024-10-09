import * as RadixAccordion from "@radix-ui/react-accordion";
import PropTypes from "prop-types";
import { forwardRef } from "react";
import { ChevronDownIcon } from "@radix-ui/react-icons";

/**
 * @param {import("@radix-ui/react-accordion").AccordionSingleProps.type | import("@radix-ui/react-accordion").AccordionMultipleProps.type} type
 * @param {{value: string}[]} items
 * @param props
 */
const Accordion = forwardRef(({ type, children, ...props }, ref) => {
    return (
        <RadixAccordion.Root type={type} {...props} ref={ref} collapsible className="flex flex-col gap-2">
            {children}
        </RadixAccordion.Root>
    );
});

Accordion.displayName = "Accordion";

const AccordionItem = forwardRef(({ children, title, ...props }, ref) => {
    return (
        <RadixAccordion.Item {...props} ref={ref} className="text-white">
            <RadixAccordion.Header className="px-4 bg-foreground/[.05]">
                <RadixAccordion.Trigger className="accordion-trigger md:py-2 flex items-center w-full text-left justify-between">
                    <span>{title}</span>
                    <ChevronDownIcon className="accordion-chevron" aria-hidden />
                </RadixAccordion.Trigger>
            </RadixAccordion.Header>
            <RadixAccordion.Content className="mt-2">{children}</RadixAccordion.Content>
        </RadixAccordion.Item>
    );
});

AccordionItem.displayName = "AccordionItem";

Accordion.propTypes = {
    children: PropTypes.node,
    type: PropTypes.string.isRequired,
};

export { Accordion, AccordionItem };
