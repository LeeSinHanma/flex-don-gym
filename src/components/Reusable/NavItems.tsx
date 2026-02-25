import React from "react";
import { useHistory } from "react-router-dom";
import "./NavItems.css";

interface NavItem {
  label: string;
  path: string;
  className?: string;
}

interface PosNavProps {
  items?: NavItem[];
  containerClassName?: string;
}

const defaultNavItems: NavItem[] = [
  { label: "POS", path: "/pos", className: "nav-item-container" },
  { label: "QR Scanner", path: "/", className: "nav-item-container" },
  {
    label: "Status",
    path: "/status-member",
    className: "nav-item-container",
  },
];

const PosNav: React.FC<PosNavProps> = ({
  items = defaultNavItems,
  containerClassName = "pos-nav-container",
}) => {
  const history = useHistory();

  return (
    <div className={containerClassName}>
      {items.map((item, index) => (
        <div key={index} className={item.className}>
          <h3 onClick={() => history.push(item.path)}>{item.label}</h3>
        </div>
      ))}
    </div>
  );
};

export default PosNav;
