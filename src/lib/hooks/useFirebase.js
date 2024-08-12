import { initializeApp } from "firebase/app";
import { getMessaging } from "firebase/messaging";

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
    static #INSTANCE;

    constructor() {
        throw new Error("This class cannot be instantiated");
    }

    static getInstance() {
        if (this.#INSTANCE === null) {
            this.#INSTANCE = initializeApp(firebaseConfig);
        }
        return this.#INSTANCE;
    }
}

export default function useFirebase() {
    const app = Firebase.getInstance();
    if (typeof window !== "undefined" && "serviceWorker" in navigator) {
        return {
            fcm: getMessaging(app),
        };
    }
    return {
        fcm: null,
    };
}
