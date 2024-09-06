import { Metadata, AppLayout } from "@/v2/components/Layout";
import { processServerSideData } from "@/lib/serverSideHelpers";
import routes from "@/routes";

export default function AppVault() {
    return (
        <>
            <Metadata title="Vault" />
        </>
    );
}

export const getServerSideProps = async ({ req, res }) => await processServerSideData(req, res, routes.App);

AppVault.getLayout = (page) => <AppLayout title="Vault Dashboard">{page}</AppLayout>;
