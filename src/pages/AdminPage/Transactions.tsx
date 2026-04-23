import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { IonIcon } from "@ionic/react";
import { arrowBack, menu } from "ionicons/icons";
import { BackButton } from "../../components/Reusable/BackButton";
import Menu from "../../components/Reusable/Menu";
import { Modal } from "../../components/Reusable/Modals";
import {
  getAllTransactions,
  TransactionResponse,
  getTransactionById,
} from "../../logicHandlers/transactionHandler";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { Capacitor } from "@capacitor/core";
import { Filesystem, Directory } from "@capacitor/filesystem";
import { Share } from "@capacitor/share";
import "./AdminDashboard.css";
import useResponsiveView from "../../hooks/useResponsiveView";

const Transactions: React.FC = () => {
  const history = useHistory();
  const isMobileView = useResponsiveView();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [transactions, setTransactions] = useState<TransactionResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTx, setSelectedTx] = useState<TransactionResponse | null>(
    null,
  );
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("All");
  const itemsPerPage = 10;

  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [exportStartDate, setExportStartDate] = useState("");
  const [exportEndDate, setExportEndDate] = useState("");
  const [exportType, setExportType] = useState("All");

  const arrayBufferToBase64 = (buffer: ArrayBuffer): string => {
    let binary = "";
    const bytes = new Uint8Array(buffer);
    const chunkSize = 0x8000;

    for (let i = 0; i < bytes.length; i += chunkSize) {
      const chunk = bytes.subarray(i, i + chunkSize);
      binary += String.fromCharCode(...chunk);
    }

    return btoa(binary);
  };

  const handleExportPDF = async () => {
    const doc = new jsPDF();

    // Title
    doc.setFontSize(18);
    doc.setTextColor("#04354f");
    doc.text("Dondon's Fitness Gym Records", 14, 22);

    // Subtitle
    doc.setFontSize(11);
    doc.setTextColor(100);
    doc.text(`Generated on: ${new Date().toLocaleString()}`, 14, 30);

    // Filters setup
    let dateFilterText = "All Time";
    if (exportStartDate && exportEndDate) {
      dateFilterText = `${exportStartDate} to ${exportEndDate}`;
    } else if (exportStartDate) {
      dateFilterText = `From ${exportStartDate}`;
    } else if (exportEndDate) {
      dateFilterText = `Until ${exportEndDate}`;
    }

    doc.setFontSize(10);
    doc.setTextColor(50);
    doc.text(
      `Type: ${
        exportType === "All" ? "All Types" : exportType
      } | Date limit: ${dateFilterText}`,
      14,
      36,
    );

    const exportData = transactions.filter((t) => {
      let matchType = exportType === "All" || t.transaction_type === exportType;
      let matchDate = true;
      const txDate = new Date(t.created_at);
      if (exportStartDate) {
        matchDate = matchDate && txDate >= new Date(exportStartDate);
      }
      if (exportEndDate) {
        const end = new Date(exportEndDate);
        end.setHours(23, 59, 59, 999);
        matchDate = matchDate && txDate <= end;
      }
      return matchType && matchDate;
    });

    let totalAmount = 0;
    const summary: Record<string, number> = {};

    const tableColumn = ["ID", "Date", "Type", "Handled By", "Amount"];
    const tableRows = exportData.map((t) => {
      totalAmount += t.total_price;
      const type = t.transaction_type;
      summary[type] = (summary[type] || 0) + t.total_price;

      return [
        t.transaction_id,
        new Date(t.created_at).toLocaleDateString(),
        t.transaction_type,
        t.transacted_by || "N/A",
        "PHP " +
          t.total_price.toLocaleString("en-US", {
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
          }),
      ];
    });

    // Write the summary section
    doc.setFontSize(10);
    doc.setTextColor(0);
    doc.text("Summary Breakdown:", 14, 44);

    let summaryY = 50;
    Object.entries(summary).forEach(([type, amount]) => {
      doc.text(
        `${type}: PHP ${amount.toLocaleString("en-US", {
          minimumFractionDigits: 0,
          maximumFractionDigits: 0,
        })}`,
        14,
        summaryY,
      );
      summaryY += 5;
    });

    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      foot: [
        [
          "",
          "",
          "",
          "TOTAL:",
          "PHP " +
            totalAmount.toLocaleString("en-US", {
              minimumFractionDigits: 0,
              maximumFractionDigits: 0,
            }),
        ],
      ],
      showFoot: "lastPage",
      startY: summaryY + 4,
      headStyles: { fillColor: "#04354f" },
      footStyles: {
        fillColor: "#e2e8f0",
        textColor: "#0f172a",
        fontStyle: "bold",
      },
      columnStyles: {
        0: { cellWidth: 55 }, // ID
        1: { cellWidth: 28 }, // Date
        2: { cellWidth: 35 }, // Type
        3: { cellWidth: 40 }, // Handled By
        4: { cellWidth: 32, halign: "right" }, // Amount
      },
    });

    const fileName = "transactions_report.pdf";

    try {
      if (Capacitor.isNativePlatform()) {
        const pdfBuffer = doc.output("arraybuffer");
        const base64Pdf = arrayBufferToBase64(pdfBuffer);

        const savedFile = await Filesystem.writeFile({
          path: fileName,
          data: base64Pdf,
          directory: Directory.Documents,
          recursive: true,
        });

        await Share.share({
          title: "Transactions Report",
          text: "Transactions PDF report",
          url: savedFile.uri,
          dialogTitle: "Share Transactions Report",
        });
      } else {
        doc.save(fileName);
      }
    } catch (error) {
      console.error("Failed to export PDF:", error);
      alert("Failed to export PDF. Please try again.");
    } finally {
      setIsExportModalOpen(false);
    }
  };

  useEffect(() => {
    const loadTransactions = async () => {
      try {
        setLoading(true);
        // You might want to filter or limit these as needed
        const data = await getAllTransactions();
        // Option to sort by date descending
        const sortedData = data.sort(
          (a, b) =>
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
        );
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

  const filteredTransactions = transactions.filter((t) => {
    const q = searchQuery.toLowerCase();
    const dateStr = new Date(t.created_at).toLocaleDateString().toLowerCase();
    const typeStr = t.transaction_type.toLowerCase();
    const amountStr = formatPeso(t.total_price).toLowerCase();
    const matchesSearch =
      dateStr.includes(q) || typeStr.includes(q) || amountStr.includes(q);

    if (filterType === "All") return matchesSearch;
    return matchesSearch && t.transaction_type === filterType;
  });

  const transactionTypes = [
    "All",
    ...Array.from(new Set(transactions.map((t) => t.transaction_type))),
  ];

  const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentItems = filteredTransactions.slice(
    startIndex,
    startIndex + itemsPerPage,
  );

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

    return Array.from(
      { length: Math.max(0, endPage - startPage + 1) },
      (_, i) => startPage + i,
    );
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

          {isMobileView && (
            <IonIcon
              icon={menu}
              className="menu-icon"
              onClick={handleMenuClick}
            />
          )}
        </div>

        <div className="admin-main-content">
          <section
            className="ad-dashboard-card ad-table-card"
            style={{
              height: "100%",
              width: "100%",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <div
              className="ad-section-head"
              style={{
                flexDirection: "column",
                alignItems: "flex-start",
                gap: "0.8rem",
                borderBottom: "1px solid #eef2f7",
                paddingBottom: "0.8rem",
                marginBottom: "0.6rem",
                width: "100%",
              }}
            >
              <h2 style={{ paddingLeft: "4px" }}>Transaction History</h2>
              <div
                style={{
                  display: "flex",
                  gap: "10px",
                  width: "100%",
                  boxSizing: "border-box",
                }}
              >
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
                    transition: "border-color 0.2s",
                  }}
                  onFocus={(e) => (e.target.style.borderColor = "#04354f")}
                  onBlur={(e) => (e.target.style.borderColor = "#cbd5e1")}
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
                    textOverflow: "ellipsis",
                  }}
                  onFocus={(e) => (e.target.style.borderColor = "#04354f")}
                  onBlur={(e) => (e.target.style.borderColor = "#cbd5e1")}
                >
                  {transactionTypes.map((type) => (
                    <option key={type} value={type}>
                      {type === "All" ? "All Types" : type}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div
              className="ad-table-wrapper"
              style={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
              }}
            >
              <table
                style={{
                  width: "100%",
                  minWidth: "auto",
                  tableLayout: "fixed",
                  height: currentItems.length > 0 ? "100%" : "auto",
                }}
              >
                <thead>
                  <tr>
                    <th
                      style={{ padding: "0.6rem 0.5rem", fontSize: "0.85rem" }}
                    >
                      Date
                    </th>
                    <th
                      style={{ padding: "0.6rem 0.5rem", fontSize: "0.85rem" }}
                    >
                      Type
                    </th>
                    <th
                      style={{ padding: "0.6rem 0.5rem", fontSize: "0.85rem" }}
                    >
                      Amount
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {loading ? (
                    <tr>
                      <td
                        colSpan={3}
                        style={{ textAlign: "center", padding: "1rem" }}
                      >
                        Loading transactions...
                      </td>
                    </tr>
                  ) : transactions.length === 0 ? (
                    <tr>
                      <td
                        colSpan={3}
                        style={{
                          textAlign: "center",
                          padding: "1rem",
                          color: "#666",
                        }}
                      >
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
                            const txDetails = await getTransactionById(
                              transaction.transaction_id,
                            );
                            setSelectedTx(txDetails);
                          } catch (err) {
                            console.error("Failed to load transaction:", err);
                            setIsModalOpen(false);
                          }
                        }}
                        style={{
                          cursor: "pointer",
                          transition: "background-color 0.2s",
                        }}
                        onMouseEnter={(e) =>
                          (e.currentTarget.style.backgroundColor = "#f8fafc")
                        }
                        onMouseLeave={(e) =>
                          (e.currentTarget.style.backgroundColor =
                            "transparent")
                        }
                      >
                        <td
                          style={{
                            padding: "0.6rem 0.5rem",
                            fontSize: "0.85rem",
                          }}
                        >
                          {new Date(
                            transaction.created_at,
                          ).toLocaleDateString()}
                        </td>
                        <td
                          style={{
                            padding: "0.6rem 0.5rem",
                            fontSize: "0.85rem",
                          }}
                        >
                          {transaction.transaction_type}
                        </td>
                        <td
                          style={{
                            padding: "0.6rem 0.5rem",
                            fontSize: "0.85rem",
                            fontWeight: "bold",
                            color: "#04354f",
                          }}
                        >
                          {formatPeso(transaction.total_price)}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
            {/* Pagination Controls Outside the List */}
            {!loading && filteredTransactions.length > 0 && (
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  padding: "1rem 0 0.5rem",
                  gap: "5px",
                  marginTop: "auto",
                }}
              >
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
                    className={`pagination-btn ${
                      currentPage === page ? "active" : ""
                    }`}
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

            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                padding: "0.5rem 0",
              }}
            >
              <button
                type="button"
                onClick={() => setIsExportModalOpen(true)}
                style={{
                  padding: "0.6rem 1rem",
                  borderRadius: "8px",
                  border: "none",
                  backgroundColor: "#04354f",
                  color: "white",
                  fontSize: "0.85rem",
                  cursor: "pointer",
                  whiteSpace: "nowrap",
                }}
              >
                Export PDF
              </button>
            </div>
          </section>
        </div>
      </div>

      <Menu isOpen={isMenuOpen} onClose={handleCloseMenu} />

      {/* Export Settings Modal */}
      <Modal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        title="Export PDF Settings"
        showCloseButton={true}
      >
        <div
          style={{
            padding: "1rem",
            color: "#0f172a",
            display: "flex",
            flexDirection: "column",
            gap: "1rem",
          }}
        >
          <div>
            <label
              style={{
                display: "block",
                marginBottom: "0.4rem",
                fontSize: "0.9rem",
                fontWeight: "bold",
              }}
            >
              Transaction Type
            </label>
            <select
              value={exportType}
              onChange={(e) => setExportType(e.target.value)}
              style={{
                width: "100%",
                padding: "0.6rem",
                borderRadius: "6px",
                border: "1px solid #cbd5e1",
              }}
            >
              {transactionTypes.map((type) => (
                <option key={type} value={type}>
                  {type === "All" ? "All Types" : type}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              style={{
                display: "block",
                marginBottom: "0.4rem",
                fontSize: "0.9rem",
                fontWeight: "bold",
              }}
            >
              Start Date (Optional)
            </label>
            <input
              type="date"
              value={exportStartDate}
              onChange={(e) => setExportStartDate(e.target.value)}
              style={{
                width: "100%",
                padding: "0.6rem",
                borderRadius: "6px",
                border: "1px solid #cbd5e1",
              }}
            />
          </div>

          <div>
            <label
              style={{
                display: "block",
                marginBottom: "0.4rem",
                fontSize: "0.9rem",
                fontWeight: "bold",
              }}
            >
              End Date (Optional)
            </label>
            <input
              type="date"
              value={exportEndDate}
              onChange={(e) => setExportEndDate(e.target.value)}
              style={{
                width: "100%",
                padding: "0.6rem",
                borderRadius: "6px",
                border: "1px solid #cbd5e1",
              }}
            />
          </div>

          <button
            onClick={handleExportPDF}
            style={{
              padding: "0.8rem",
              borderRadius: "8px",
              border: "none",
              backgroundColor: "#04354f",
              color: "white",
              fontSize: "1rem",
              cursor: "pointer",
              marginTop: "0.5rem",
            }}
          >
            Generate & Download
          </button>
        </div>
      </Modal>

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
            <div
              style={{ textAlign: "center", padding: "2rem", color: "#64748b" }}
            >
              Loading details...
            </div>
          ) : (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "0.85rem",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <strong>Date:</strong>{" "}
                <span>{new Date(selectedTx.created_at).toLocaleString()}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <strong>ID:</strong>{" "}
                <span
                  style={{
                    fontSize: "0.75rem",
                    color: "#64748b",
                    marginTop: "2px",
                  }}
                >
                  {selectedTx.transaction_id}
                </span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <strong>Type:</strong>{" "}
                <span>{selectedTx.transaction_type}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <strong>Handled By:</strong>{" "}
                <span>{selectedTx.transacted_by}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <strong>Method:</strong>{" "}
                <span style={{ textTransform: "capitalize" }}>
                  {selectedTx.payment_method}
                </span>
              </div>

              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  borderTop: "1px dashed #cbd5e1",
                  paddingTop: "0.85rem",
                  marginTop: "0.4rem",
                }}
              >
                <strong>Amount Given:</strong>{" "}
                <span style={{ fontWeight: "500" }}>
                  {formatPeso(selectedTx.amount_given)}
                </span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <strong>Total Price:</strong>{" "}
                <span
                  style={{
                    color: "#15803d",
                    fontWeight: "bold",
                    fontSize: "1.1rem",
                  }}
                >
                  {formatPeso(selectedTx.total_price)}
                </span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <strong>Change:</strong>{" "}
                <span style={{ color: "#04354f", fontWeight: "bold" }}>
                  {formatPeso(selectedTx.change)}
                </span>
              </div>
            </div>
          )}
        </div>
      </Modal>
    </div>
  );
};

export default Transactions;
