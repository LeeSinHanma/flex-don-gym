import React, { useEffect, useState } from "react";
import { useNetworkStatus, BannerStatus } from "../../hooks/useNetworkStatus";
import { useAppInitialization } from "../../hooks/useAppInitialization";
import { isWebPlatform } from "../../util/platformAware";
import "./OfflineBanner.css";

interface OfflineBannerProps {
  status?: BannerStatus | "connecting";
  visible?: boolean;
}

export function OfflineBanner({
  status: propStatus,
  visible: propVisible,
}: OfflineBannerProps) {
  const { status: networkStatus, isOffline } = useNetworkStatus();
  const { isInitializing, isSyncing, isApiConnecting, error } = useAppInitialization();
  const [internalVisible, setInternalVisible] = useState(false);

  const isConnectingState = isInitializing || isSyncing || isApiConnecting;
  
  const isActuallyOffline = isOffline;
  const isServerUnreachable = !isOffline && error !== null;

  useEffect(() => {
    let timer: any;

    if (isActuallyOffline || isServerUnreachable || isConnectingState) {
      if (timer) clearTimeout(timer);
      setInternalVisible(true);
    } else {
      // Hide after 3 seconds when online and not syncing
      timer = setTimeout(() => {
        setInternalVisible(false);
      }, 3000);
    }

    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [isActuallyOffline, isServerUnreachable, isConnectingState]);

  // Determine actual status priority
  let currentStatus: BannerStatus | "connecting" = networkStatus;
  if (isActuallyOffline) {
    currentStatus = "offline";
  } else if (isConnectingState || isServerUnreachable) {
    currentStatus = "connecting";
  } else {
    // Falls back to networkStatus ("complete") if we're online and no errors
    currentStatus = networkStatus;
  }

  // Use props if provided, otherwise use calculated state
  if (propStatus) currentStatus = propStatus;
  const isVisible = propVisible !== undefined ? propVisible : internalVisible;

  if (!isVisible) return null;

  const getStatusText = () => {
    switch (currentStatus) {
      case "offline":
        return "Currently Offline";
      case "connecting":
        return "Connecting to Server";
      case "syncing":
        return "Syncing";
      case "complete":
        return isWebPlatform() ? "Connected to Server" : "Syncing Complete";
      default:
        return "Currently Offline";
    }
  };

  return (
    <div className={`offline-banner offline-banner-${currentStatus === "connecting" ? "syncing" : currentStatus}`}>
      <span className="offline-banner-text">{getStatusText()}</span>
    </div>
  );
}
