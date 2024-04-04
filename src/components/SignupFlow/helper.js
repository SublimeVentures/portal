import { KNOWN_CONNECTORS } from "@/lib/blockchain";

export function getConnectorImage(connectorName) {
    if (KNOWN_CONNECTORS.includes(connectorName)) {
        return `${connectorName}.png`;
    }
    return "wallet.png";
}
