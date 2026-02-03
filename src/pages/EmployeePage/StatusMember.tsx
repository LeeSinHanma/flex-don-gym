import React from "react";
import { useHistory } from "react-router-dom";
import QRScanner from "../../components/Reusable/QRScannerNav";
import "./StatusMember.css";
import { Button } from "../../components/Reusable/Button";

const StatusMemberPage: React.FC = () => {
  const history = useHistory();

  return (
    <div className="manage-member-container">
      <div className="main-container">
        <div className="top-header">
          <h2>Manage Member</h2>
          <div className="search-bar">
            <input className="search-input" type="text" placeholder="Search" />
          </div>
          <div className="nav-carousel">
            <div className="nav-item">Currently Active</div>
            <div className="nav-item">Member</div>
            <div className="nav-item">Casual</div>
            <div className="nav-item">All</div>
          </div>
        </div>
        <div className="cards-container">
          <div
            className="status-card"
            onClick={() => history.push("/manage-status")}
          >
            <div className="status-info">
              <div className="left-info">
                <h2 className="client-name">Juan</h2>
                <div className="client-details">
                  <p className="client-type">Member</p>
                  <p className="client-duration">1 month</p>
                </div>
              </div>
            </div>
            <div className="client-status">active</div>
          </div>
        </div>
        <div className="pos-container">
          <div className="stat pos-nav-container">
            <div className="pos-container">
              <h3>POS</h3>
            </div>
            <div className="stat qr-container">
              <h3 onClick={() => history.push("/qr")}>QR Scanner</h3>
            </div>
            <div className="stat status-container">
              <h3 onClick={() => history.push("/status-member")}>Status</h3>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatusMemberPage;
