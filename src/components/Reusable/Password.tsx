import React from "react";

interface PasswordInputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

export const PasswordInput: React.FC<PasswordInputProps> = (props) => {
  return <input type="password" {...props} />;
};
