import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import QRScanner from "../../components/Reusable/QRScannerNav";
import "./StatusMember.css";
import { Button } from "../../components/Reusable/Button";
import { searchOutline } from "ionicons/icons";
import { IonIcon } from "@ionic/react";
import PosNav from "../../components/Reusable/NavItems";
import { getMembers, Member } from "../../logicHandlers/memberCrud";

const StatusMemberPage: React.FC = () => {
  const history = useHistory();
  const [members, setMembers] = useState<Member[]>([]);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await getMembers();
        setMembers(data);
      } catch (e) {
        console.error(e);
      }
    };
    load();
  }, []);

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
          {members.map((m) => (
            <div
              key={m.member_id}
              className="status-card"
              onClick={() => history.push(`/manage-status/${m.member_id}`)}
            >
              <div className="status-info">
                <div className="left-info">
                  <h2 className="client-name">
                    {m.first_name} {m.last_name}
                  </h2>
                  <div className="client-details">
                    <p className="client-type">
                      {m.membership_type === 0 ? "Member" : "Casual"}
                    </p>
                    <p className="client-duration">
                      {m.membership_expiry ? m.membership_expiry : "No Expiry"}
                    </p>
                  </div>
                </div>
              </div>

              <div className="client-status">{m.is_active ? "active" : "inactive"}</div>
            </div>
          ))}
        </div>

        <div className="pos-footer">
          <PosNav
            items={[
              { label: "POS", path: "/pos" },
              { label: "QR Scanner", path: "/qr" },
              { label: "Status", path: "/status-member" },
            ]}
          />
        </div>
      </div>
    </div>
  );
};

export default StatusMemberPage;
