import React from 'react';
import { getStaticContentForInitPage, getStaticStylesForInitPage } from "@/components/InitPage/helper";

const InitPage = () => (
    <div id="initPage" style={getStaticStylesForInitPage()}>
        {getStaticContentForInitPage()}
    </div>
)

export default InitPage;
