import React from "react";
import "./BackButton.css";

interface BackButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  onClick?: () => void;
}

export const BackButton: React.FC<BackButtonProps> = ({
  children,
  onClick,
  className,
}) => {
  return (
    <button
      onClick={onClick}
      className={`back-button-base ${className ?? ""}`.trim()}
    >
      {children}
    </button>
  );
};
