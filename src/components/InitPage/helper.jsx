import React from "react";
import Image from 'next/image';
import { TENANT } from "@/lib/tenantHelper";
import { tenantIndex } from "@/lib/utils";

const commonStyles = {
    position: 'fixed',
    top: 0,
    left: 0,
    alignItems: 'center',
    justifyContent: 'center',
    height: '100vh',
    width: '100vw',
    display: 'flex',
    zIndex: '1000',
}

export const getStaticStylesForInitPage = () => {
    switch (tenantIndex) {
        case (TENANT.basedVC): return {
            ...commonStyles,
            background: 'linear-gradient(to bottom, rgba(16, 19, 27, 1) 0%, rgba(16, 19, 27, 1) 85%, rgba(14, 17, 24, 1) 100%)'
        }
        case (TENANT.NeoTokyo): return {
            ...commonStyles,
            background: 'linear-gradient(to bottom, rgba(16, 19, 27, 1) 0%, rgba(16, 19, 27, 1) 85%, rgba(14, 17, 24, 1) 100%)'
        }
        case (TENANT.CyberKongz): return {
            ...commonStyles,
            background: 'linear-gradient(to bottom, rgba(16, 19, 27, 1) 0%, rgba(16, 19, 27, 1) 85%, rgba(14, 17, 24, 1) 100%)'
        }
        default: return {
            ...commonStyles,
            background: 'linear-gradient(to bottom, rgba(13, 15, 21, 1) 0%, rgba(13, 15, 21, 1) 85%, rgba(9, 11, 15, 1) 100%)'
        }
    }
}

export const getStaticContentForInitPage = () => {
    switch (tenantIndex) {
        case (TENANT.basedVC): return <Image src="/logo_1.svg" width="500" height="500" alt=""/>
        case (TENANT.NeoTokyo): return <Image src="/logo_6.svg" width="500" height="500" alt=""/>
        case (TENANT.CyberKongz): return <Image src="/logo_14.svg" width="500" height="500" alt=""/>
        default: return <Image src="/logo_1.svg" width="500" height="500" alt="" />
    }
}
