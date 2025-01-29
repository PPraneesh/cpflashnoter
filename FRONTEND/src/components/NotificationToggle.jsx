import { useState } from "react";
import requestPermission from "../utils/notifications";

const NotificationToggle = () => {
  const [isEnabled, setIsEnabled] = useState(false);

  const toggleNotifications = () => {
    if (!isEnabled) {
      requestPermission();
    } else {
      console.log("Notifications turned off.");
    }
    setIsEnabled(!isEnabled);
  };

  return (
    <div className="bg-neutral-700/30 p-3 rounded-md border border-neutral-700/30 hover:border-neutral-600/50 transition-all">
      <div className="flex items-center justify-between text-white">
        <span>Notifications</span>
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={isEnabled}
            onChange={toggleNotifications}
            className="sr-only peer"
          />
          <div className="w-11 h-6 bg-neutral-600 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-neutral-600 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-500"></div>
        </label>
      </div>
    </div>
  );
};

export default NotificationToggle;
