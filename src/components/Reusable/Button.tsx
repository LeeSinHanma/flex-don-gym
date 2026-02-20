import React from 'react';
import { IonButton, IonIcon } from '@ionic/react';
import './Button.css';

interface ButtonProps {
  text: string;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  color?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'light' | 'dark';
  fill?: 'clear' | 'outline' | 'solid';
  expand?: 'full' | 'block';
  size?: 'small' | 'default' | 'large';
  disabled?: boolean;
  icon?: string;
  iconSlot?: 'start' | 'end' | 'icon-only';
  className?: string;
}

const Button: React.FC<ButtonProps> = ({
  text,
  onClick,
  type = 'button',
  color = 'primary',
  fill = 'solid',
  expand,
  size = 'default',
  disabled = false,
  icon,
  iconSlot = 'start',
  className = '',
}) => {
  return (
    <IonButton
      type={type}
      color={color}
      fill={fill}
      expand={expand}
      size={size}
      disabled={disabled}
      onClick={onClick}
      className={`fdg-button ${className}`}
    >
      {icon && iconSlot !== 'icon-only' && <IonIcon slot={iconSlot} icon={icon} />}
      {iconSlot === 'icon-only' ? <IonIcon icon={icon} /> : text}
    </IonButton>
  );
};

export default Button;
