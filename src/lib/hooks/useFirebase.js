import { initializeApp } from "firebase/app";
import { getMessaging, getToken, onMessage } from "firebase/messaging";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import NotificationToast from "@/v2/components/Notification/NotificationToast";

const firebaseConfig = {
    apiKey: "AIzaSyAO8LMDvud_ol6HsbjA0B_Z1Ogd3X_HL4c",
    authDomain: "based-9d4af.firebaseapp.com",
    projectId: "based-9d4af",
    storageBucket: "based-9d4af.appspot.com",
    messagingSenderId: "648728636195",
    appId: "1:648728636195:web:f2862e3050dfa587957a96",
    measurementId: "G-Y7218FVJRG",
};

class Firebase {
    static #INSTANCE = null;

    constructor() {
        throw new Error("This class cannot be instantiated");
    }

    /**
     * @returns {import("firebase/app").FirebaseApp}
     */
    static getInstance() {
        if (this.#INSTANCE === null) {
            this.#INSTANCE = initializeApp(firebaseConfig);
        }
        return this.#INSTANCE;
    }
}

/**
 * @param {import("firebase/messaging").Messaging | null} fcmInstance
 * @returns {Promise<boolean>}
 */
async function requestPushPermission(fcmInstance) {
    if (!fcmInstance) {
        return false;
    }
    return Notification.permission === "granted";
}

export function useFirebase() {
    const [firebase, setFirebase] = useState(/** @type {import("firebase/app").FirebaseApp | null} */ null);

    const setupPushNotifications = async () => {
        if (firebase) {
            const messaging = getMessaging(firebase);
            const allowed = await requestPushPermission(messaging);
            if (allowed) {
                return getToken(messaging, { vapidKey: process.env.NEXT_PUBLIC_VAPID_KEY }).then((token) => {
                    console.log("[FCM] Token received on hook");
                    return token ?? null;
                });
            } else {
                console.log("[FCM] Token blocked on hook");
            }
        }
        return null;
    };

    useEffect(() => {
        setFirebase(Firebase.getInstance());
    }, []);

    const getFCM = () => {
        if (!firebase) return null;
        const fcm = getMessaging(firebase);
        onMessage(fcm, (payload) => {
            console.log("[FCM] onMessage fired");
            toast.custom((t) => <NotificationToast t={t} notification={payload.notification} />, {
                duration: Infinity,
            });
        });
        console.log("[FCM] onMessage hook is set up");
        return fcm;
    };

    return {
        fcm: getFCM(),
        setupPushNotifications,
    };
}
