importScripts("https://www.gstatic.com/firebasejs/8.10.0/firebase-app.js");
importScripts(
  "https://www.gstatic.com/firebasejs/8.10.0/firebase-messaging.js"
);

const firebaseConfig = {
    apiKey: "AIzaSyDGr-in8FtdNdYXNyMv4vkNJAioFc7WttM",
    authDomain: "authkey-34c7a.firebaseapp.com",
    databaseURL: "https://authkey-34c7a-default-rtdb.firebaseio.com",
    projectId: "authkey-34c7a",
    storageBucket: "authkey-34c7a.appspot.com",
    messagingSenderId: "579740271342",
    appId: "1:579740271342:web:bfc2c14dc9c72dd75469ff"
  };

firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log(
    "[firebase-messaging-sw.js] Received background message ",
    payload
  );
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: payload.notification.image,
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});