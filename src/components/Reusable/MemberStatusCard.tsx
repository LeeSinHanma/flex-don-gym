import React from "react";
import "./MemberStatus.css";

type StatusCardProps = React.HTMLAttributes<HTMLDivElement> & {
  title: string;
  subtitle?: string;
  description?: string;
  isActive: boolean;
};

export const StatusCard: React.FC<StatusCardProps> = ({
  title,
  subtitle,
  description,
  isActive,
  onClick,
  className = "",
  ...props
}) => {
  return (
    <div
      className={`member-status ${isActive ? "active" : "inactive"} ${className}`}
      onClick={onClick}
      {...props}
    >
      <h3 className="member-status-title">{title}</h3>
      {subtitle && <p className="member-status-subtitle">{subtitle}</p>}
      {description && (
        <p className="member-status-description">{description}</p>
      )}
    </div>
  );
};

export default StatusCard;
