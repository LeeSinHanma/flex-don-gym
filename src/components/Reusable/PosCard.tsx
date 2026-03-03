// POSCard.tsx
import React, { useState } from "react";
import "./PosCard.css";

type CardVariant = "default" | "highlighted" | "inactive";

interface POSCardProps {
  productName: string;
  price: string | number;
  initialCount?: number;
  minCount?: number;
  maxCount?: number;
  onCountChange?: (count: number) => void;
  onClick?: () => void;
  className?: string;
  variant?: CardVariant;
  buttonLabel?: string;
  buttonIcon?: React.ReactNode;
  onButtonClick?: () => void;
  topRight?: React.ReactNode;
  footer?: React.ReactNode;
  children?: React.ReactNode;
}

const variantClass: Record<CardVariant, string> = {
  default: "",
  highlighted: "pos-status-card--highlighted",
  inactive: "pos-status-card--inactive",
};

const POSCard: React.FC<POSCardProps> = ({
  productName,
  price,
  initialCount = 0,
  minCount = 0,
  maxCount = 99,
  onCountChange,
  onClick,
  className = "",
  variant = "default",
  buttonLabel = "Select",
  buttonIcon,
  onButtonClick,
  topRight,
  footer,
  children,
}) => {
  const [count, setCount] = useState(initialCount);

  const handleIncrement = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (count >= maxCount) return;
    const next = count + 1;
    setCount(next);
    onCountChange?.(next);
  };

  const handleDecrement = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (count <= minCount) return;
    const next = count - 1;
    setCount(next);
    onCountChange?.(next);
  };

  const renderRightSide = () => {
    if (topRight) return topRight;

    // if counter props are provided, show counter
    if (onCountChange !== undefined) {
      return (
        <div className="pos-card-counter">
          <button
            className="pos-counter-btn"
            onClick={handleDecrement}
            disabled={count <= minCount}
          >
            −
          </button>
          <span className="pos-counter-value">{count}</span>
          <button
            className="pos-counter-btn"
            onClick={handleIncrement}
            disabled={count >= maxCount}
          >
            +
          </button>
        </div>
      );
    }

    // otherwise show button
    return (
      <div className="pos-card-top-right">
        {initialCount !== undefined && initialCount > 0 && (
          <span className="pos-card-count">{initialCount}</span>
        )}
        <button
          className="pos-card-btn"
          onClick={(e) => {
            e.stopPropagation();
            onButtonClick?.();
          }}
        >
          {buttonIcon && (
            <span className="pos-card-btn-icon">{buttonIcon}</span>
          )}
          {buttonLabel}
        </button>
      </div>
    );
  };

  return (
    <div className={`pos-card-item ${className}`}>
      <div className="pos-cards-container">
        <div
          className={`pos-status-card ${variantClass[variant]}`}
          onClick={onClick}
        >
          <div className="pos-status-info">
            <div className="pos-left-info">
              <h2 className="pos-card-product-name">{productName}</h2>
              <p className="pos-card-product-price">
                ₱
                {Number(price).toLocaleString("en-PH", {
                  minimumFractionDigits: 2,
                })}
              </p>
            </div>
            <div className="pos-card-top-right">{renderRightSide()}</div>
          </div>

          {children}
          {footer && <div className="pos-card-footer">{footer}</div>}
        </div>
      </div>
    </div>
  );
};

export default POSCard;
