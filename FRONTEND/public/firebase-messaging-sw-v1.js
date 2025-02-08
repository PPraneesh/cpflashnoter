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
  console.log("[Service Worker] Received background message", payload);

  const notificationTitle = payload.notification.title || "CPNoter";
  const notificationOptions = {
    body: payload.notification.body || "Stay ahead with daily DSA revision!",
    icon: "/logo.png",  // Add your app logo here
    badge: "/logo-96x96.png",  // Small icon for the status bar
    // image: payload.notification.image || "/icons/banner.png", // Banner image
    actions: [
      { action: "open_app", title: "Open CPNoter" },
      { action: "dismiss", title: "Dismiss" }
    ],
    vibrate: [200, 100, 200], // Custom vibration pattern
    requireInteraction: true, // Keep the notification until user interacts
    data: {
      url: payload.data.url || "https://cpnoter.site", // Open this URL when clicked
    },
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});

// Handle notification click event
self.addEventListener("notificationclick", (event) => {
  event.notification.close(); // Close the notification

  if (event.action === "open_app") {
    event.waitUntil(
      self.clients.openWindow(event.notification.data.url) // Open app on click
    );
  }
});
