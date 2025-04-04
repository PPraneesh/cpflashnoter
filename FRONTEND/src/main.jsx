import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { Toaster } from 'react-hot-toast';

if ('serviceWorker' in navigator) {
  window.addEventListener('load', async () => {
    try {
      await navigator.serviceWorker.register('/firebase-messaging-sw-v1.js', {
        scope: '/'
      });
      
    } catch (error) {
      console.error('ServiceWorker registration failed:', error);
    }
  });
}

window.navigator.serviceWorker.getRegistration().then((registration) => {
  if (registration) {
    if(registration.active.scriptURL.includes('firebase-messaging-sw.js')) {
      registration.unregister().then((success) => {
        if (success) {
          window.location.reload();
        }
      });
    }else{
      registration.update();
    }
  }
});
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
    <Toaster />
  </StrictMode>,
)
