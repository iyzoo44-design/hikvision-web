importScripts("https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.12.0/firebase-messaging-compat.js");

firebase.initializeApp({
  apiKey: "AIzaSyC7GngQFP1JhnqIb8h_FcfEWA2a1nvPFg0",
  authDomain: "dongne-bakery.firebaseapp.com",
  databaseURL: "https://dongne-bakery-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "dongne-bakery",
  storageBucket: "dongne-bakery.firebasestorage.app",
  messagingSenderId: "835419452184",
  appId: "1:835419452184:web:e710137926fc24ffd8646d"
});

const messaging = firebase.messaging();
const RTDB = "https://dongne-bakery-default-rtdb.asia-southeast1.firebasedatabase.app";

// ── 진단 기록 (2026-09-22 추가) ──
// 이 파일은 화면이 꺼져 있거나 다른 앱을 보고 있어도, "폰이 알림을 실제로 받았을 때"만 실행됩니다.
// index.html의 진단 기록과는 완전히 독립적이라, "폰까지 알림이 왔는지"를 확실하게 보여줍니다.
// 이 기록은 Realtime Database의 swLog 항목에 쌓이고, Firebase 콘솔에서 바로 볼 수 있습니다.
function swlog(msg){
  try{
    fetch(RTDB + "/swLog.json", {
      method: "POST",
      body: JSON.stringify({ t: Date.now(), when: new Date().toString(), msg: msg })
    }).catch(function(e){});
  }catch(e){}
}

messaging.onBackgroundMessage(function(payload) {
  swlog("onBackgroundMessage 도착: title=" + (payload && payload.notification && payload.notification.title));
  const title = payload.notification.title || "행복한 빵집";
  const options = {
    body: payload.notification.body || "",
    icon: "https://iyzoo44-design.github.io/hikvision-web/icon.png",
    vibrate: [400, 200, 400, 200, 400],
    tag: "dongne-turn",
    renotify: true,
    requireInteraction: true
  };
  self.registration.showNotification(title, options)
    .then(function(){ swlog("showNotification 성공"); })
    .catch(function(e){ swlog("showNotification 실패: " + e); });
});

self.addEventListener("push", function(event){
  // FCM 라이브러리를 거치기 전, 안드로이드/구글이 이 폰에 푸시를 배달한 바로 그 순간을 기록합니다.
  // 이 기록조차 안 남으면, 문제는 이 웹사이트 코드가 아니라 그 이전 단계(구글/안드로이드 배달)에 있는 것입니다.
  swlog("push 이벤트 수신 (raw)");
});

self.addEventListener("notificationclick", function(event) {
  swlog("알림 클릭됨");
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
