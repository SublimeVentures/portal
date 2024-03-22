import LayoutFullscreen from "@/components/Layout/LayoutFullscreen";
import ErrorPage from "@/components/ErrorPage";

function Error({ statusCode }) {
    return <ErrorPage statusCode={statusCode} />;
}

Error.getInitialProps = ({ err }) => {
    return { statusCode: err.statusCode, message: err.message };
};

Error.getLayout = function (page) {
    return <LayoutFullscreen>{page}</LayoutFullscreen>;
};

export default Error;
