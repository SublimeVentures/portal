import { Form } from "@/v2/components/ui/form";

export default function InvestForm({ children, form, onSubmit }) {
    return (
        <Form {...form}>
            <form onSubmit={onSubmit} className="w-full flex flex-col space-y-6">
                {children}
            </form>
        </Form>
    );
};
