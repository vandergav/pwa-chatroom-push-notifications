var USERNAME = "Default"
var MESSAGE = "Default"
//exports.username = USERNAME;

const publicVapidKey =
    "BEJee6t9Gh31_caMnvRVLDfKklnrPkMYqJluia9QalSz5_1vp5-p8EbhvMFcyGYUzkXYBTp2d9fbZB8QC56rxKY";

// Check for service worker
if ("serviceWorker" in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker
            .register('/worker.js')
            .then(reg => console.log('Service Worker: Registered'))
            .catch(err => console.log(`Service Worker: Error: ${err}`));
    });
    startingup().catch(err => console.error(err));
}

// Register SW, Register Push, Send Push
async function send(username, message) {
    // Register Service Worker

    USERNAME = username
    MESSAGE = message
    console.log("From Index.html Vue: " + USERNAME + " & " + MESSAGE)

    console.log("Registering service worker...");
    const register = await navigator.serviceWorker.register("/worker.js", {
        scope: "/"
    });
    console.log("Service Worker Registered...");

    // Register Push
    console.log("Registering Push...");
    const subscription = await register.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(publicVapidKey),
    });
    console.log("Push Registered...");

    // Send Push Notification
    await fetch("/message_send", {
        method: "POST",
        body: JSON.stringify({ subscription: subscription, USERNAME: USERNAME, MESSAGE: MESSAGE }), // sending to index.js here...
        headers: {
            "content-type": "application/json"
        }
    })
        .then((message) => console.log("Send Push Notification in client.js response" + message))
        .catch(err => console.error(err));
    console.log("Push Sent...");
}

// Register SW, Register Push, Send Push
async function startingup() {
    // Register Service Worker
    console.log("Registering service worker...");
    const register = await navigator.serviceWorker.register("/worker.js", {
        scope: "/"
    });
    console.log("Service Worker Registered...");

    // Register Push
    console.log("Registering Push...");
    const subscription = await register.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(publicVapidKey)
    });
    console.log("Push Registered...");

    // Send Push Notification
    console.log("Sending Push...");
    await fetch("/subscribe", {
        method: "POST",
        body: JSON.stringify(subscription),
        headers: {
            "content-type": "application/json"
        }
    });
    console.log("Push Sent...");
}

function urlBase64ToUint8Array(base64String) {
    const padding = "=".repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
        .replace(/\-/g, "+")
        .replace(/_/g, "/");

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
}
