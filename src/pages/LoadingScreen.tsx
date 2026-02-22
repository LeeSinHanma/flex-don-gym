// LoadingScreen.tsx
import React from "react";
import { LoadingSpinner } from "../components/Reusable/LoadingSpinner";

const LoadingScreen: React.FC = () => {
  return (
    <div style={overlayStyle}>
      <LoadingSpinner />
    </div>
  );
};

const overlayStyle = {
  position: "fixed" as const,
  inset: 0,
  background: "rgba(0,0,0,0.25)", // change 0.25 to lighter/darker
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  zIndex: 9999,
};

export default LoadingScreen;
