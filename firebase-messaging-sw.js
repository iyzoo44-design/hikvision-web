
importScripts("https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.12.0/firebase-messaging-compat.js");

firebase.initializeApp({
  apiKey: "AIzaSyC7GngQFP1JhnqIb8h_FcFEWAza1nvPFg0",
  authDomain: "dongne-bakery.firebaseapp.com",
  databaseURL: "https://dongne-bakery-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "dongne-bakery",
  storageBucket: "dongne-bakery.firebasestorage.app",
  messagingSenderId: "835419452184",
  appId: "1:835419452184:web:e710137926fc24ffd8646d"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage(function(payload) {
  const title = payload.notification.title || "행복한 빵집";
  const options = {
    body: payload.notification.body || "",
    icon: "https://iyzoo44-design.github.io/hikvision-web/icon.png",
    vibrate: [300, 150, 300],
    tag: "dongne-turn",
    requireInteraction: true
  };
  self.registration.showNotification(title, options);
});

self.addEventListener("notificationclick", function(event) {
  event.notification.close();
  event.waitUntil(
    clients.matchAll({ type: "window" }).then(function(clientList) {
      for (const client of clientList) {
        if (client.url.includes("hikvision-web") && "focus" in client) {
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow("https://iyzoo44-design.github.io/hikvision-web/");
      }
    })
  );
});
