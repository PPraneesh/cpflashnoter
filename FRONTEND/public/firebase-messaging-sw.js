// Import the Firebase scripts needed for messaging
importScripts("https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js");

// Initialize Firebase (use the same config as your app)
self.firebase.initializeApp({
  apiKey: "AIzaSyCJiyeZDBmraWzpIBM0435ew1PbsalmmzM",
  authDomain: "cpflashnoter.firebaseapp.com",
  projectId: "cpflashnoter",
  storageBucket: "cpflashnoter.firebasestorage.app",
  messagingSenderId: "517950584365",
  appId: "1:517950584365:web:c5e81dd19f382383afeaa4",
  measurementId: "G-2WCF3M7KWF",
});

const messaging = self.firebase.messaging();

// Handle background notifications
messaging.onBackgroundMessage((payload) => {
  console.log("Received background message: ", payload);

  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
