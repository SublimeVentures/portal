import { PartnershipCard } from "@/v2/components/App/Vault";
import { cn } from "@/lib/cn";

const mockedPartnership = {
    title: "Based.VC & Steady Stack",
    description:
        "The partnership operates in the technology sector, specializing in developing software solutions for small businesses.",
    partners: [{ id: 1 }, { id: 2, styles: "bg-primary shadow-primary" }],
};

const Announcements = ({ className }) => {
    return (
        <div className={cn("flex flex-col", className)}>
            <h3 className="text-nowrap text-md md:text-2xl text-foreground md:hidden 2xl:block">
                Community Partnership
            </h3>
            <PartnershipCard
                title={mockedPartnership.title}
                description={mockedPartnership.description}
                partners={mockedPartnership.partners}
                isLoading={false}
            />
        </div>
    );
};

export default Announcements;
