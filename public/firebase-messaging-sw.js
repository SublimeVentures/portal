importScripts("https://www.gstatic.com/firebasejs/10.13.1/firebase-app.js");
importScripts("https://www.gstatic.com/firebasejs/10.13.1/firebase-messaging.js");

// Initialize the Firebase app in the service worker by passing in
// your app's Firebase config object.
// https://firebase.google.com/docs/web/setup#config-object
firebase.initializeApp({
    apiKey: "AIzaSyAO8LMDvud_ol6HsbjA0B_Z1Ogd3X_HL4c",
    authDomain: "based-9d4af.firebaseapp.com",
    projectId: "based-9d4af",
    storageBucket: "based-9d4af.appspot.com",
    messagingSenderId: "648728636195",
    appId: "1:648728636195:web:f2862e3050dfa587957a96",
    measurementId: "G-Y7218FVJRG",
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
    self.registration
        .showNotification(payload.notification.title, {
            icon: payload.notification.image,
            body: payload.notification.body,
            requireInteraction: false,
        })
        .then(() => {
            console.log("FCM BG MESSAGE RECEIVED", payload);
        });
});

console.log("[FCM] Firebase Cloud Messaging is listening on background messages.");
