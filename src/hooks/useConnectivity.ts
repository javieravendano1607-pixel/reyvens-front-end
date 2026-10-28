import { useEffect, useState } from "react";

export function useConnectivity() {
  const [isOnline, setIsOnline] = useState(() => typeof navigator === "undefined" || navigator.onLine);
  const [wasOffline, setWasOffline] = useState(false);

  useEffect(() => {
    const handleOffline = () => {
      setIsOnline(false);
      setWasOffline(true);
    };
    const handleOnline = () => setIsOnline(true);

    window.addEventListener("offline", handleOffline);
    window.addEventListener("online", handleOnline);
    return () => {
      window.removeEventListener("offline", handleOffline);
      window.removeEventListener("online", handleOnline);
    };
  }, []);

  useEffect(() => {
    if (!isOnline || !wasOffline) return;
    const timeout = window.setTimeout(() => setWasOffline(false), 4500);
    return () => window.clearTimeout(timeout);
  }, [isOnline, wasOffline]);

  return { isOnline, showRestoredNotice: isOnline && wasOffline };
}
