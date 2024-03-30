import LayoutFullscreen from "@/components/Layout/LayoutFullscreen";
import ErrorPage from "@/components/ErrorPage";
import * as Sentry from "@sentry/nextjs";

function Error({ statusCode }) {
    return <ErrorPage statusCode={statusCode} />;
}

Error.getInitialProps = async ({ err }) => {
    await Sentry.captureUnderscoreErrorException(err);

    return { statusCode: err.statusCode, message: err.message };
};

Error.getLayout = function (page) {
    return <LayoutFullscreen>{page}</LayoutFullscreen>;
};

export default Error;
