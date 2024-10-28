import { initializeApp } from "firebase/app";
import { getMessaging,onMessage} from "firebase/messaging";

const firebaseConfig = {
  apiKey: "AIzaSyDGr-in8FtdNdYXNyMv4vkNJAioFc7WttM",
  authDomain: "authkey-34c7a.firebaseapp.com",
  databaseURL: "https://authkey-34c7a-default-rtdb.firebaseio.com",
  projectId: "authkey-34c7a",
  storageBucket: "authkey-34c7a.appspot.com",
  messagingSenderId: "579740271342",
  appId: "1:579740271342:web:bfc2c14dc9c72dd75469ff"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);

export const messaging = getMessaging(app);
onMessage(messaging, (payload) => {
  console.log('Foreground notification received:', payload);

  // Display the notification manually
  const notificationTitle = payload.data.title;
  const notificationOptions = {
    body: payload.data.body,
    icon: payload.data.icon,
  };

  if (Notification.permission === 'granted') {
    const notification = new Notification(notificationTitle, notificationOptions);

    notification.onclick = (event) => {
      event.preventDefault();
      window.open(payload.data.click_action, '_blank');
    };
  }
});