import { api } from "../api/axios";
import { messaging, getToken, deleteToken } from "../services/firebaseConfig";

const requestPermission = async () => {
  try {
    const permission = await Notification.requestPermission();
    if (permission === "granted") {
      console.log("Notification permission granted.");
      const swRegistration = await navigator.serviceWorker.register(
        "/firebase-messaging-sw.js"
      );  
      const token = await getToken(messaging, {
        vapidKey: "BH5JkTGTa5OyUotLXkZiL0N365S8z88_fnOuPamMt2tJCBcR-MIwYfng4xIRQcYCG4Td3ifWIHQKiKZz6JOKH0c",
        serviceWorkerRegistration: swRegistration,
      });

      console.log("FCM Token:", token);
      api.post("/notification_token", { token })
      .then((res)=>{
        if(res.data.status)
          return true;
      })
      .catch((error)=>{
            console.error("Error sending FCM token to server:", error);
            return false;
        });
    } else {
      console.log("Notification permission denied.");
    }
  } catch (error) {
    console.error("Error getting notification permission:", error);
  }
};

const removeNotificationToken = async (currentToken) => {
  try {
    await deleteToken(messaging, currentToken);
    await api.get("/remove_notification_token");
  }
  catch (error) {
    console.error("Error deleting notification token:", error);
  }
}
export {requestPermission, removeNotificationToken};
