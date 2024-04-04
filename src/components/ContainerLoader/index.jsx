import React from "react";
import { tenantIndex } from "@/lib/utils";
import { TENANT } from "@/lib/tenantHelper";
import BaseContainerLoader from "@/components/ContainerLoader/BaseContainerLoader";

const ContainerLoader = ({ currentPathName, containerUrl, ...props }) => {
    switch (tenantIndex) {
        case TENANT.basedVC: {
            return <BaseContainerLoader currentPathName={currentPathName} containerUrl={containerUrl} {...props} />;
        }
        default:
            return <BaseContainerLoader currentPathName={currentPathName} containerUrl={containerUrl} {...props} />;
    }
};

export default ContainerLoader;
