import { AppLayout, Metadata } from "@/v2/components/Layout";
import { VaultDashboard } from "@/v2/components/App/Vault";
import { processServerSideData } from "@/lib/serverSideHelpers";
import routes from "@/routes";

export const getServerSideProps = async ({ req, res }) => await processServerSideData(req, res, routes.App);

function IndexPage() {
    return (
        <>
            <Metadata title="Vault" />
            <div className="flex flex-col h-full">
                <VaultDashboard isLoading={false} viewOptions={{ views: ["dashboard"] }} />
            </div>
        </>
    );
}

IndexPage.getLayout = (page) => <AppLayout>{page}</AppLayout>;

export default IndexPage;
