import React from "react";

interface NumberInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  allowDecimal?: boolean;
  prefix?: string;
  formatWithCommas?: boolean;
}

const NumberInput: React.FC<NumberInputProps> = ({
  value,
  onChange,
  placeholder,
  className,
  allowDecimal = false,
  prefix,
  formatWithCommas = false,
}) => {
  const formatNumber = (raw: string) => {
    if (!raw) return "";

    if (allowDecimal) {
      const parts = raw.split(".");
      const integerPart = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
      return parts.length > 1 ? `${integerPart}.${parts[1]}` : integerPart;
    }

    return raw.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  const handleChange = (input: string) => {
    const raw = input.replace(/,/g, "");

    if (raw === "") {
      onChange("");
      return;
    }

    const regex = allowDecimal ? /^\d*\.?\d*$/ : /^\d*$/;
    if (!regex.test(raw)) return;

    if (!allowDecimal && raw.length > 1 && raw.startsWith("0")) {
      onChange(String(Number(raw)));
      return;
    }

    onChange(raw);
  };

  const displayValue = formatWithCommas ? formatNumber(value) : value;

  return (
    <div style={{ position: "relative", width: "100%" }}>
      {prefix && (
        <span
          style={{
            position: "absolute",
            left: "10px",
            top: "50%",
            transform: "translateY(-50%)",
            color: "#555",
            zIndex: 1,
          }}
        >
          {prefix}
        </span>
      )}

      <input
        type="text"
        inputMode={allowDecimal ? "decimal" : "numeric"}
        className={className}
        placeholder={placeholder}
        value={displayValue}
        onChange={(e) => handleChange(e.target.value)}
        style={{
          paddingLeft: prefix ? "28px" : undefined,
        }}
      />
    </div>
  );
};

export default NumberInput;
