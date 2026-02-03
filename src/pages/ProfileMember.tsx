import React from "react";
import { useHistory } from "react-router-dom";

const MemberProfilePage: React.FC = () => {
  const history = useHistory();

  return (
    <div className="manage-member-container">
      <div className="main-container">
        <div className="top-header">
          <h2>Manage Member</h2>
          <div className="search-bar">
            <input className="search-input" type="text" placeholder="Search" />
          </div>
        </div>
        <div className="member-info">
          <h2 className="member-name">Juan</h2>
          <div className="member-details">
            <h4 className="member-type">Member</h4>
            <h4 className="member-duration">10 months left</h4>
          </div>
        </div>
        <div className="history-details"></div>
        <div className="pos-container">
          <div className="pos-nav-container">
            <div className="pos-container">
              <h3>POS</h3>
            </div>
            <div className="qr-container">
              <h3 onClick={() => history.push("/qr")}>QR Scanner</h3>
            </div>
            <div className="status-container">
              <h3 onClick={() => history.push("/status-member")}>Status</h3>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MemberProfilePage;
