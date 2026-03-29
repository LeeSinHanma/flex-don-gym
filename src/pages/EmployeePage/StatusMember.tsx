import React, { useEffect, useMemo, useState } from "react";
import { useHistory } from "react-router-dom";
import "./StatusMember.css";
import PosNav from "../../components/Reusable/NavItems";
import { BackButton } from "../../components/Reusable/BackButton";
import { IonIcon, IonSkeletonText } from "@ionic/react";
import { arrowBack, menu } from "ionicons/icons";
import { getMembers, Member } from "../../logicHandlers/memberCrud";
import { getMembershipTypeById } from "../../logicHandlers/membershipCrud";
import Menu from "../../components/Reusable/Menu";
import { Button } from "../../components/Reusable/Button";

const StatusMemberPage: React.FC = () => {
  const history = useHistory();

  const [allMembers, setAllMembers] = useState<Member[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [membershipNames, setMembershipNames] = useState<
    Record<number, string>
  >({});
  const [showEmployeeMenu, setShowEmployeeMenu] = useState(false);

  const formatDateDash = (dateString: string | null) => {
    if (!dateString) return "No Expiry";

    const datePart = dateString.split("T")[0];
    const [yyyy, mm, dd] = datePart.split("-");
    return `${mm}-${dd}-${yyyy}`;
  };

  const getMembershipLabel = (member: Member) => {
    if (
      member.membership_plan_id !== null &&
      member.membership_plan_id !== undefined
    ) {
      return `Plan ID: ${member.membership_plan_id}`;
    }

    return "No Plan";
  };

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const data = await getMembers();
        setAllMembers(data);

        const map: Record<number, string> = {};

        for (const m of data) {
          if (
            m.membership_plan_id !== null &&
            m.membership_plan_id !== undefined &&
            !map[m.membership_plan_id]
          ) {
            const membership = await getMembershipTypeById(
              m.membership_plan_id,
            );
            map[m.membership_plan_id] = membership.name || "Unknown";
          }
        }

        setMembershipNames(map);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  const filteredMembers = useMemo(() => {
    const q = (search ?? "").trim().toLowerCase();
    if (!q) return allMembers;

    return allMembers.filter((m) => {
      const first = (m.first_name ?? "").toLowerCase();
      const last = (m.last_name ?? "").toLowerCase();
      const email = (m.email ?? "").toLowerCase();
      const fullName = `${first} ${last}`.trim();

      return (
        first.includes(q) ||
        last.includes(q) ||
        fullName.includes(q) ||
        email.includes(q)
      );
    });
  }, [search, allMembers]);

  return (
    <div className="manage-member-container">
      <div className="main-container">
        <div className="top-header">
          <div className="status-header-row">
            <BackButton
              className="status-page-back"
              type="button"
              onClick={() => history.push("/qr")}
            >
              <IonIcon icon={arrowBack} />
            </BackButton>

            <h2>Manage Member</h2>

            <button
              type="button"
              className="icon-button"
              onClick={() => setShowEmployeeMenu(true)}
              aria-label="Open menu"
            >
              <IonIcon icon={menu} />
            </button>
          </div>

          <div className="search-bar">
            <input
              className="search-input"
              type="text"
              placeholder="Search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="nav-carousel">
            <div className="nav-item">Active</div>
            <div className="nav-item">Inactive</div>
            <div className="nav-item">All</div>
          </div>
        </div>

        <div className="cards-container">
          {loading ? (
            [1, 2, 3, 4, 5, 6, 7].map((i) => (
              <div key={i} className="status-card">
                <div className="status-info">
                  <div className="left-info">
                    <h2 className="client-name">
                      <IonSkeletonText animated style={{ width: "150px", display: "block" }} />
                    </h2>
                    <div className="client-details">
                      <p className="client-type">
                        <IonSkeletonText animated style={{ width: "100px", display: "block" }} />
                      </p>
                      <p className="client-duration">
                        <IonSkeletonText animated style={{ width: "80px", display: "block" }} />
                      </p>
                    </div>
                  </div>
                </div>
                <div className="client-status">
                  <IonSkeletonText animated style={{ width: "50px", display: "block" }} />
                </div>
              </div>
            ))
          ) : filteredMembers.length === 0 ? (
            <p style={{ textAlign: "center" }}>No members found.</p>
          ) : (
            filteredMembers.map((m) => (
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
                        {m.membership_plan_id !== null &&
                        membershipNames[m.membership_plan_id]
                          ? membershipNames[m.membership_plan_id]
                          : "No Plan"}
                      </p>
                      <p className="client-duration">
                        {formatDateDash(m.membership_expiry)}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="client-status">
                  {m.is_active ? "active" : "inactive"}
                </div>
              </div>
            ))
          )}
        </div>
        <div className="bottom-container">
          <Button
            className="btn btn-submit"
            type="button"
            onClick={() => history.push("/member")}
          >
            Add New Member
          </Button>
        </div>
      </div>

      <Menu
        isOpen={showEmployeeMenu}
        onClose={() => setShowEmployeeMenu(false)}
      />
    </div>
  );
};

export default StatusMemberPage;
