interface QRScannerProps {
  items: string[];
  active: string;
  onClick: (value: string) => void;
  className?: string;
}

export default function QRScanner({
  items,
  active,
  onClick,
  className,
}: QRScannerProps) {
  return (
    <ul className={className}>
      {items.map((item) => (
        <li key={item}>
          <button
            type="button"
            data-active={active === item}
            onClick={() => onClick(item)}
          >
            {item}
          </button>
        </li>
      ))}
    </ul>
  );
}
