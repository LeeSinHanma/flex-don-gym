import React, { useEffect, useState } from "react";
import { useNetworkStatus, BannerStatus } from "../../hooks/useNetworkStatus";
import "./OfflineBanner.css";

interface OfflineBannerProps {
  status?: BannerStatus;
  visible?: boolean;
}

export function OfflineBanner({
  status: propStatus,
  visible: propVisible,
}: OfflineBannerProps) {
  const { status: internalStatus, isOffline } = useNetworkStatus();
  const [internalVisible, setInternalVisible] = useState(false);

  useEffect(() => {
    let timer: any;

    if (!isOffline) {
      // Hide after 3 seconds when online
      timer = setTimeout(() => {
        setInternalVisible(false);
      }, 3000);
    } else {
      // Clear any existing timers when going offline
      if (timer) clearTimeout(timer);
      setInternalVisible(true);
    }

    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [isOffline]);

  // Use props if provided, otherwise use internal state
  const currentStatus = propStatus || internalStatus;
  const isVisible = propVisible !== undefined ? propVisible : internalVisible;

  if (!isVisible) return null;

  const getStatusText = () => {
    switch (currentStatus) {
      case "offline":
        return "Currently Offline";
      case "syncing":
        return "Syncing";
      case "complete":
        return "Syncing Complete";
      default:
        return "Currently Offline";
    }
  };

  return (
    <div className={`offline-banner offline-banner-${currentStatus}`}>
      <span className="offline-banner-text">{getStatusText()}</span>
    </div>
  );
}
