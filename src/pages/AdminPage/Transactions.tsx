import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { IonIcon } from "@ionic/react";
import { arrowBack, menu } from "ionicons/icons";
import { BackButton } from "../../components/Reusable/BackButton";
import Menu from "../../components/Reusable/Menu";
import { Modal } from "../../components/Reusable/Modals";
import { getAllTransactions, TransactionResponse, getTransactionById } from "../../logicHandlers/transactionHandler";
import "./AdminDashboard.css";

const Transactions: React.FC = () => {
  const history = useHistory();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [transactions, setTransactions] = useState<TransactionResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTx, setSelectedTx] = useState<TransactionResponse | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("All");
  const itemsPerPage = 10;

  useEffect(() => {
    const loadTransactions = async () => {
      try {
        setLoading(true);
        // You might want to filter or limit these as needed
        const data = await getAllTransactions();
        // Option to sort by date descending
        const sortedData = data.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
        setTransactions(sortedData);
      } catch (error) {
        console.error("Failed to load transactions:", error);
      } finally {
        setLoading(false);
      }
    };
    loadTransactions();
  }, []);

  const handleMenuClick = () => {
    setIsMenuOpen(true);
  };

  const handleCloseMenu = () => {
    setIsMenuOpen(false);
  };

  const formatPeso = (value: number) =>
    new Intl.NumberFormat("en-PH", {
      style: "currency",
      currency: "PHP",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);

  const filteredTransactions = transactions.filter(t => {
    const q = searchQuery.toLowerCase();
    const dateStr = new Date(t.created_at).toLocaleDateString().toLowerCase();
    const typeStr = t.transaction_type.toLowerCase();
    const amountStr = formatPeso(t.total_price).toLowerCase();
    const matchesSearch = dateStr.includes(q) || typeStr.includes(q) || amountStr.includes(q);
    
    if (filterType === "All") return matchesSearch;
    return matchesSearch && t.transaction_type === filterType;
  });

  const transactionTypes = ["All", ...Array.from(new Set(transactions.map(t => t.transaction_type)))];

  const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentItems = filteredTransactions.slice(startIndex, startIndex + itemsPerPage);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const getVisiblePages = () => {
    const maxVisible = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisible / 2));
    let endPage = startPage + maxVisible - 1;

    if (endPage > totalPages) {
      endPage = totalPages;
      startPage = Math.max(1, endPage - maxVisible + 1);
    }

    return Array.from({ length: Math.max(0, endPage - startPage + 1) }, (_, i) => startPage + i);
  };
  const visiblePages = getVisiblePages();

  return (
    <div className="admin-dashboard-container">
      <div className="admin-main-container">
        <div className="admin-top-header">
          <BackButton
            className="btn"
            type="button"
            onClick={() => history.push("/admin-dashboard")}
          >
            <IonIcon icon={arrowBack} />
          </BackButton>

          <h1>All Transactions</h1>

          <IonIcon
            icon={menu}
            className="menu-icon"
            onClick={handleMenuClick}
          />
        </div>

        <div className="admin-main-content">
          <section className="ad-dashboard-card ad-table-card" style={{ height: "100%", width: "100%", display: "flex", flexDirection: "column" }}>
            <div className="ad-section-head" style={{ flexDirection: "column", alignItems: "flex-start", gap: "0.8rem", borderBottom: "1px solid #eef2f7", paddingBottom: "0.8rem", marginBottom: "0.6rem", width: "100%" }}>
              <h2 style={{ paddingLeft: "4px" }}>Transaction History</h2>
              <div style={{ display: "flex", gap: "10px", width: "100%", boxSizing: "border-box" }}>
                <input
                  type="text"
                  placeholder="Search by date, type, or amount..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setCurrentPage(1); // Reset to first page on search
                  }}
                  style={{
                    flex: 1,
                    minWidth: 0,
                    padding: "0.6rem 1rem",
                    borderRadius: "8px",
                    border: "1px solid #cbd5e1",
                    fontSize: "0.85rem",
                    outline: "none",
                    backgroundColor: "#f8fafc",
                    color: "#0f172a",
                    transition: "border-color 0.2s"
                  }}
                  onFocus={(e) => e.target.style.borderColor = "#04354f"}
                  onBlur={(e) => e.target.style.borderColor = "#cbd5e1"}
                />
                <select
                  value={filterType}
                  onChange={(e) => {
                    setFilterType(e.target.value);
                    setCurrentPage(1);
                  }}
                  style={{
                    padding: "0.6rem 1rem",
                    borderRadius: "8px",
                    border: "1px solid #cbd5e1",
                    fontSize: "0.85rem",
                    outline: "none",
                    backgroundColor: "#f8fafc",
                    color: "#0f172a",
                    cursor: "pointer",
                    transition: "border-color 0.2s",
                    maxWidth: "150px",
                    textOverflow: "ellipsis"
                  }}
                  onFocus={(e) => e.target.style.borderColor = "#04354f"}
                  onBlur={(e) => e.target.style.borderColor = "#cbd5e1"}
                >
                  {transactionTypes.map(type => (
                    <option key={type} value={type}>
                      {type === "All" ? "All Types" : type}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="ad-table-wrapper" style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
              <table style={{ width: "100%", minWidth: "auto", tableLayout: "fixed", height: currentItems.length > 0 ? "100%" : "auto" }}>
                <thead>
                  <tr>
                    <th style={{ padding: "0.6rem 0.5rem", fontSize: "0.85rem" }}>Date</th>
                    <th style={{ padding: "0.6rem 0.5rem", fontSize: "0.85rem" }}>Type</th>
                    <th style={{ padding: "0.6rem 0.5rem", fontSize: "0.85rem" }}>Amount</th>
                  </tr>
                </thead>

                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan={3} style={{ textAlign: "center", padding: "1rem" }}>
                        Loading transactions...
                      </td>
                    </tr>
                  ) : transactions.length === 0 ? (
                    <tr>
                      <td colSpan={3} style={{ textAlign: "center", padding: "1rem", color: "#666" }}>
                        No transactions found.
                      </td>
                    </tr>
                  ) : (
                    currentItems.map((transaction, index) => (
                      <tr 
                        key={`${transaction.transaction_id}-${index}`}
                        onClick={async () => {
                          try {
                            setSelectedTx(null); // Reset before showing
                            setIsModalOpen(true);
                            const txDetails = await getTransactionById(transaction.transaction_id);
                            setSelectedTx(txDetails);
                          } catch (err) {
                            console.error("Failed to load transaction:", err);
                            setIsModalOpen(false);
                          }
                        }}
                        style={{ cursor: "pointer", transition: "background-color 0.2s" }}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#f8fafc"}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "transparent"}
                      >
                        <td style={{ padding: "0.6rem 0.5rem", fontSize: "0.85rem" }}>{new Date(transaction.created_at).toLocaleDateString()}</td>
                        <td style={{ padding: "0.6rem 0.5rem", fontSize: "0.85rem" }}>{transaction.transaction_type}</td>
                        <td style={{ padding: "0.6rem 0.5rem", fontSize: "0.85rem", fontWeight: "bold", color: "#04354f" }}>{formatPeso(transaction.total_price)}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
            {/* Pagination Controls Outside the List */}
            {!loading && filteredTransactions.length > 0 && (
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '1rem 0 0.5rem', gap: '5px', marginTop: 'auto' }}>
                <button
                  type="button"
                  className="pagination-btn"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  &lt;
                </button>
                {visiblePages.map((page) => (
                  <button
                    key={page}
                    type="button"
                    className={`pagination-btn ${currentPage === page ? 'active' : ''}`}
                    onClick={() => handlePageChange(page)}
                  >
                    {page}
                  </button>
                ))}
                <button
                  type="button"
                  className="pagination-btn"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === Math.max(1, totalPages)}
                >
                  &gt;
                </button>
              </div>
            )}
          </section>
        </div>
      </div>

      <Menu isOpen={isMenuOpen} onClose={handleCloseMenu} />

      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setTimeout(() => setSelectedTx(null), 300);
        }}
        title="Transaction Details"
        showCloseButton={true}
      >
        <div style={{ padding: "1rem", color: "#0f172a" }}>
          {!selectedTx ? (
            <div style={{ textAlign: "center", padding: "2rem", color: "#64748b" }}>
              Loading details...
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "0.85rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <strong>Date:</strong> <span>{new Date(selectedTx.created_at).toLocaleString()}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <strong>ID:</strong> <span style={{ fontSize: "0.75rem", color: "#64748b", marginTop: "2px" }}>{selectedTx.transaction_id}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <strong>Type:</strong> <span>{selectedTx.transaction_type}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <strong>Handled By:</strong> <span>{selectedTx.transacted_by}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <strong>Method:</strong> <span style={{ textTransform: "capitalize" }}>{selectedTx.payment_method}</span>
              </div>

              <div style={{ display: "flex", justifyContent: "space-between", borderTop: "1px dashed #cbd5e1", paddingTop: "0.85rem", marginTop: "0.4rem" }}>
                <strong>Amount Given:</strong> <span style={{ fontWeight: "500" }}>{formatPeso(selectedTx.amount_given)}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <strong>Total Price:</strong> <span style={{ color: "#15803d", fontWeight: "bold", fontSize: "1.1rem" }}>{formatPeso(selectedTx.total_price)}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <strong>Change:</strong> <span style={{ color: "#04354f", fontWeight: "bold" }}>{formatPeso(selectedTx.change)}</span>
              </div>
            </div>
          )}
        </div>
      </Modal>
    </div>
  );
};

export default Transactions;
