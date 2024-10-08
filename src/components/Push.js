import { useEffect } from "react";
import { useFirebase } from "@/lib/hooks/useFirebase";

export default function Push() {
    const { fcm } = useFirebase();

    useEffect(() => {
        if (fcm?.app) {
            console.debug("FCM app name:", fcm.app.name);
        }
    }, [fcm]);

    return null;
}
