import React from "react";
import "./OfflineBanner.css";

export type BannerStatus = "offline" | "syncing" | "complete";

interface OfflineBannerProps {
  status?: BannerStatus;
  visible?: boolean;
}

export function OfflineBanner({
  status = "offline",
  visible = true,
}: OfflineBannerProps) {
  if (!visible) return null;

  const getStatusText = () => {
    switch (status) {
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
    <div className={`offline-banner offline-banner-${status}`}>
      <span className="offline-banner-text">{getStatusText()}</span>
    </div>
  );
}
