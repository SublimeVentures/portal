import { initializeApp } from "firebase/app";
import { getMessaging, getToken } from "firebase/messaging";
import { useEffect, useState } from "react";

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
    if (Notification.permission !== "granted") {
        return Notification.requestPermission().then((perm) => perm === "granted");
    }
    return true;
}

async function setupPushNotifications(fcmInstance) {
    const allowed = await requestPushPermission(fcmInstance);
    if (allowed) {
        return getToken(fcmInstance, { vapidKey: process.env.NEXT_PUBLIC_VAPID_KEY }).then((token) => {
            return token ?? null;
        });
    }
    return null;
}

export default function useFirebase() {
    const [fcm, setFCM] = useState(null);
    const [setup, setSetupFunction] = useState(/** @type {() => Promise<string | null>} */ Promise.resolve(null));

    useEffect(() => {
        if (typeof window !== "undefined" && "serviceWorker" in navigator) {
            const app = Firebase.getInstance();
            const fcm = getMessaging(app);
            setFCM(fcm);
            setSetupFunction(() => setupPushNotifications(fcm));
        }
    }, []);

    return {
        fcm,
        setup,
    };
}
