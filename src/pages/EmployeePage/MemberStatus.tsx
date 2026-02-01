import React from "react";
import { StatusCard } from "../../components/Reusable/MemberStatusCard";

const MemberStatusPage: React.FC = () => {
  return (
    <div className="main-status-container">
      <div className="main-container">
        <h1 className="member-title">Manage Members</h1>
        <div className="search-bar">Search</div>
        <div className="carouel-container">nav, ul</div>
        <div className="status-cards">
          <StatusCard
            title="Available"
            subtitle="Membership Active"
            description="Expires on: 2024-12-31"
            isActive={true}
          ></StatusCard>
        </div>
      </div>
      <h1>Member Status Page</h1>
    </div>
  );
};

export default MemberStatusPage;
