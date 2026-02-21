import React from "react";
import { LoadingSpinner } from "../components/Reusable/LoadingSpinner";

const LoadingScreen: React.FC = () => {
  return (
    <div className="login-register-container">
      <div className="main-container">
        <LoadingSpinner />
      </div>
    </div>
  );
};
export default LoadingScreen;
