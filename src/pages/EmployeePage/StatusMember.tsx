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

import { Network } from "@capacitor/network";
import { getAllMembers } from "../../repositories/memberRepository";
import { getAllMembershipTypes } from "../../repositories/membershipRepository";
import StatusModal from "../../components/Reusable/StatusModal";

const StatusMemberPage: React.FC = () => {
  const history = useHistory();

  const [allMembers, setAllMembers] = useState<Member[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [membershipNames, setMembershipNames] = useState<
    Record<number, string>
  >({});
  const [selectedFilter, setSelectedFilter] = useState<number | string>("All");
  const [showEmployeeMenu, setShowEmployeeMenu] = useState(false);

  const [showStatusModal, setShowStatusModal] = useState(false);
  const [statusTitle, setStatusTitle] = useState("");
  const [statusMessage, setStatusMessage] = useState("");
  const [statusType, setStatusType] = useState<
    "success" | "error" | "warning" | "info"
  >("info");

  const openStatusModal = (
    title: string,
    message: string,
    type: "success" | "error" | "warning" | "info" = "info",
  ) => {
    setStatusTitle(title);
    setStatusMessage(message);
    setStatusType(type);
    setShowStatusModal(true);
  };

  const formatDateDash = (dateString: string | null) => {
    if (!dateString) return "No Expiry";

    const datePart = dateString.split("T")[0];
    const [yyyy, mm, dd] = datePart.split("-");
    const formatted = `${mm}-${dd}-${yyyy}`;
    return formatted === "null-undefined-undefined" ? "No Expiry" : formatted;
  };

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const status = await Network.getStatus();
        let membersData: Member[] = [];
        const mNamesMap: Record<number, string> = {};

        if (status.connected) {
          try {
            membersData = await getMembers();

            for (const m of membersData) {
              if (
                m.membership_plan_id !== null &&
                m.membership_plan_id !== undefined &&
                !mNamesMap[m.membership_plan_id]
              ) {
                try {
                  const membership = await getMembershipTypeById(
                    m.membership_plan_id,
                  );
                  mNamesMap[m.membership_plan_id] = membership.name || "Unknown";
                } catch (apiErr) {
                   console.warn(`Failed to fetch membership ${m.membership_plan_id} from API, skipping...`);
                }
              }
            }
          } catch (apiErr) {
            console.warn("API member fetch failed, falling back to local...");
            const localMembers = await getAllMembers();
            membersData = localMembers.map(m => ({
              ...m,
              is_active: m.is_active === 1,
              email: m.email || "",
              contact_number: m.contact_number || "",
              first_name: m.first_name || "",
              last_name: m.last_name || "",
              membership_type: m.membership_type || 0,
              membership_plan_id: m.membership_plan_id || 0,
              credits: m.credits || 0,
              registered_by: m.registered_by || "unknown",
              created_at: m.created_at || "",
              updated_at: m.updated_at || "",
            }));

            const localPlans = await getAllMembershipTypes();
            localPlans.forEach(p => {
              mNamesMap[p.membership_id] = p.name || "Unknown";
            });
          }
        } else {
          const localMembers = await getAllMembers();
          membersData = localMembers.map(m => ({
            ...m,
            is_active: m.is_active === 1,
            email: m.email || "",
            contact_number: m.contact_number || "",
            first_name: m.first_name || "",
            last_name: m.last_name || "",
            membership_type: m.membership_type || 0,
            membership_plan_id: m.membership_plan_id || 0,
            credits: m.credits || 0,
            registered_by: m.registered_by || "unknown",
            created_at: m.created_at || "",
            updated_at: m.updated_at || "",
          }));

          const localPlans = await getAllMembershipTypes();
          localPlans.forEach(p => {
            mNamesMap[p.membership_id] = p.name || "Unknown";
          });
        }

        setAllMembers(membersData);
        setMembershipNames(mNamesMap);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  const handleMemberClick = async (memberId: string) => {
    const status = await Network.getStatus();
    if (!status.connected) {
      openStatusModal(
        "Currently Offline",
        "You are currently offline, please try again when network is available.",
        "warning"
      );
      return;
    }
    history.push(`/manage-status/${memberId}`);
  };

  const filteredMembers = useMemo(() => {
    let filtered = allMembers;

    // Filter by membership plan if selected
    if (selectedFilter !== "All") {
      if (selectedFilter === "Active") {
        filtered = filtered.filter((m) => m.is_active);
      } else if (selectedFilter === "Inactive") {
        filtered = filtered.filter((m) => !m.is_active);
      } else if (selectedFilter === "Valid") {
        filtered = filtered.filter((m) => {
          if (!m.membership_expiry) return true;
          return new Date(m.membership_expiry) >= new Date();
        });
      } else if (selectedFilter === "Expired") {
        filtered = filtered.filter((m) => {
          if (!m.membership_expiry) return false;
          return new Date(m.membership_expiry) < new Date();
        });
      } else {
        // Assume selectedFilter is a membership plan ID (number)
        filtered = filtered.filter((m) => m.membership_plan_id === selectedFilter);
      }
    }

    const q = (search ?? "").trim().toLowerCase();
    if (!q) return filtered;

    return filtered.filter((m) => {
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
  }, [search, allMembers, selectedFilter]);

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
            <div
              className={`nav-item ${selectedFilter === "All" ? "active" : ""}`}
              onClick={() => setSelectedFilter("All")}
            >
              All
            </div>
            <div
              className={`nav-item ${selectedFilter === "Valid" ? "active" : ""}`}
              onClick={() => setSelectedFilter("Valid")}
            >
              Valid
            </div>
            <div
              className={`nav-item ${selectedFilter === "Expired" ? "active" : ""}`}
              onClick={() => setSelectedFilter("Expired")}
            >
              Expired
            </div>
            {Object.entries(membershipNames).map(([id, name]) => (
              <div
                key={id}
                className={`nav-item ${selectedFilter === Number(id) ? "active" : ""}`}
                onClick={() => setSelectedFilter(Number(id))}
              >
                {name}
              </div>
            ))}
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
                onClick={() => handleMemberClick(m.member_id)}
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

                <div className={`client-status ${(() => {
                  if (!m.membership_expiry) return "status-valid";
                  const expiryDate = new Date(m.membership_expiry);
                  const now = new Date();
                  return expiryDate >= now ? "status-valid" : "status-expired";
                })()}`}>
                  {(() => {
                    if (!m.membership_expiry) return "Valid";
                    const expiryDate = new Date(m.membership_expiry);
                    const now = new Date();
                    return expiryDate >= now ? "Valid" : "Expired";
                  })()}
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

      <StatusModal
        isOpen={showStatusModal}
        title={statusTitle}
        message={statusMessage}
        type={statusType}
        onClose={() => setShowStatusModal(false)}
      />
    </div>
  );
};

export default StatusMemberPage;
