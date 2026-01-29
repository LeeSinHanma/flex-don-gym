import React from "react";

interface UsernameInputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

export const UsernameInput: React.FC<UsernameInputProps> = (props) => {
  return <input type="text" {...props} />;
};
