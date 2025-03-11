import InternalErrorPage from "@/components/ErrorPage/components/InternalServerErrorPage";
import UnexpectedErrorPage from "@/components/ErrorPage/components/UnexpectedErrorPage";

const ErrorPage = ({ statusCode }) => {
    switch (statusCode) {
        case 500:
            return <InternalErrorPage />;
        default:
            return <UnexpectedErrorPage />;
    }
};

export default ErrorPage;
