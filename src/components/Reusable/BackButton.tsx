import React from "react";

interface BackButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  onClick?: () => void;
}

export const BackButton: React.FC<BackButtonProps> = ({
  children,
  onClick,
  className,
}) => {
  return (
    <button onClick={onClick} className={className}>
      {children}
    </button>
  );
};
