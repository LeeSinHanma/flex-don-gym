import { useEffect, useState } from "react";
import { Network, ConnectionStatus } from "@capacitor/network";

export type BannerStatus = "offline" | "syncing" | "complete";

export function useNetworkStatus() {
  const [status, setStatus] = useState<BannerStatus>("offline");
  const [isOffline, setIsOffline] = useState(false);

  useEffect(() => {
    let timer: any;
    let isMounted = true;

    const updateStatus = async () => {
      const currentStatus = await Network.getStatus();
      if (isMounted) handleStatusChange(currentStatus);
    };

    const handleStatusChange = (status: ConnectionStatus) => {
      if (status.connected) {
        setStatus("complete");
        setIsOffline(false);
      } else {
        setStatus("offline");
        setIsOffline(true);
      }
    };

    // Initial check
    updateStatus();

    // Listen for changes
    const listenerPromise = Network.addListener("networkStatusChange", (status) => {
      if (isMounted) handleStatusChange(status);
    });

    return () => {
      isMounted = false;
      listenerPromise.then(h => h.remove());
    };
  }, []);

  return { status, isOffline };
}
