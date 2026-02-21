import { IonSpinner } from "@ionic/react";
import { CSSProperties } from "react";

export function LoadingSpinner() {
  const containerStyle: CSSProperties = {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#04354F",
    width: "100%",
    height: "100%",
  };

  return (
    <div style={containerStyle}>
      <IonSpinner />
    </div>
  );
}
