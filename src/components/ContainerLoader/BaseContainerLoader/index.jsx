import PAGE from "@/routes";
import Loader from "@/components/App/Loader";
import BaseVaultContainerLoader from "@/components/ContainerLoader/BaseContainerLoader/components/BaseVaultContainerLoader";

const BaseContainerLoader = ({ currentPathName, containerUrl, ...props }) => {
    switch (containerUrl) {
        case PAGE.App: {
            if (currentPathName === PAGE.Landing) {
                return <Loader {...props} />;
            }
            return <BaseVaultContainerLoader {...props} />;
        }
        default:
            return <Loader {...props} />;
    }
};

export default BaseContainerLoader;
