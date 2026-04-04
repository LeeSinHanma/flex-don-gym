import React, { useState, useEffect, useCallback } from "react";
import { IonIcon, IonSkeletonText } from "@ionic/react";
import { arrowBackOutline, menuOutline } from "ionicons/icons";
import { useHistory } from "react-router-dom";
import { getMembershipDistribution } from "../../repositories/memberRepository";
import { getMembers } from "../../logicHandlers/memberCrud";
import { getMembershipTypes } from "../../logicHandlers/membershipCrud";
import {
  getAllTransactions,
  TransactionResponse,
} from "../../logicHandlers/transactionHandler";
import { Capacitor } from "@capacitor/core";
import { useAppInitialization } from "../../hooks/useAppInitialization";
import { LoadingSpinner } from "../../components/Reusable/LoadingSpinner";
import { BackButton } from "../../components/Reusable/BackButton";
import {
  connectCheckInsWS,
  disconnectCheckInsWS,
  connectRevenueWS,
  disconnectRevenueWS,
} from "../../logicHandlers/webSocket";
import Menu from "../../components/Reusable/Menu";
import {
  ArcElement,
  BarElement,
  CategoryScale,
  ChartOptions,
  Chart as ChartJS,
  Filler,
  Legend,
  LineElement,
  LinearScale,
  PointElement,
  TooltipItem,
  Tooltip,
} from "chart.js";
import { Bar, Doughnut, Line } from "react-chartjs-2";
import "./AdminDashboard.css";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Tooltip,
  Legend,
  Filler,
);

const AdminDashboard: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState("Monthly");
  const history = useHistory();

  const [checkInsToday, setCheckInsToday] = useState<number | null>(null);
  const [revenueToday, setRevenueToday] = useState<number | null>(null);

  const monthlyRevenue = 184950;
  const revenueChange = 8.4;

  const revenueTrendLabels = ["W1", "W2", "W3", "W4", "W5", "W6"];
  const revenueTrendData = [28000, 26500, 31000, 29700, 33350, 36400];

  const revenueSources = [
    { label: "Gym Access", amount: 122500, percent: 66 },
    { label: "Products", amount: 62450, percent: 34 },
  ];

  const [latestPayments, setLatestPayments] = useState<
    { date: string; type: string; amount: number }[]
  >([]);

  const [membershipPlans, setMembershipPlans] = useState<
    { label: string; count: number }[]
  >([
    { label: "Prepaid", count: 0 },
    { label: "Monthly", count: 0 },
    { label: "Yearly", count: 0 },
    { label: "Student", count: 0 },
  ]);

  const membershipColors = ["#14b8a6", "#22c55e", "#38bdf8", "#f59e0b"];

  const bestSellers = [
    { name: "Whey Protein 2lb", sales: 24600 },
    { name: "Creatine Monohydrate", sales: 18400 },
    { name: "Resistance Bands Set", sales: 13950 },
    { name: "Shaker Bottle", sales: 9250 },
    { name: "Lifting Straps", sales: 8100 },
  ];

  const lowOnStocks = [
    { name: "Whey Protein 2lb", stock: 3 },
    { name: "Creatine Monohydrate", stock: 5 },
    { name: "Resistance Bands Set", stock: 2 },
    { name: "Shaker Bottle", stock: 8 },
    { name: "Lifting Straps", stock: 1 },
  ];

  const membershipTotal = membershipPlans.reduce(
    (total, plan) => total + plan.count,
    0,
  );

  const lineChartData = {
    labels: revenueTrendLabels,
    datasets: [
      {
        data: revenueTrendData,
        borderColor: "#18a65a",
        backgroundColor: "rgba(24, 166, 90, 0.12)",
        borderWidth: 3,
        tension: 0.35,
        fill: true,
        pointRadius: 0,
        pointHoverRadius: 4,
        pointHoverBackgroundColor: "#18a65a",
      },
    ],
  };

  const lineChartOptions: ChartOptions<"line"> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (context: TooltipItem<"line">) =>
            formatPeso(context.parsed.y ?? 0),
        },
      },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { color: "#6b7280", font: { size: 11 } },
      },
      y: {
        grid: { color: "#eef2f7" },
        ticks: {
          color: "#9ca3af",
          font: { size: 10 },
          callback: (value: string | number) => `₱${Number(value) / 1000}k`,
        },
      },
    },
  };

  const stackedSourceData = {
    labels: ["Revenue Sources"],
    datasets: [
      {
        label: "Gym Access",
        data: [revenueSources[0].amount],
        backgroundColor: "#0f766e",
        borderRadius: 25,
        borderSkipped: false,
        barThickness: 22,
      },
      {
        label: "Products",
        data: [revenueSources[1].amount],
        backgroundColor: "#34d399",
        borderRadius: 5,
        borderSkipped: false,
        barThickness: 22,
      },
    ],
  };

  const stackedSourceOptions: ChartOptions<"bar"> = {
    indexAxis: "y" as const,
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (context: TooltipItem<"bar">) =>
            `${context.dataset.label || "Source"}: ${formatPeso(
              context.parsed.x ?? 0,
            )}`,
        },
      },
    },
    scales: {
      x: {
        stacked: true,
        grid: { color: "#eef2f7" },
        ticks: {
          color: "#9ca3af",
          callback: (value: string | number) => `₱${Number(value) / 1000}k`,
        },
      },
      y: {
        stacked: true,
        grid: { display: false },
        ticks: { display: false },
      },
    },
  };

  const donutData = {
    labels: membershipPlans.map((plan) => plan.label),
    datasets: [
      {
        data: membershipPlans.map((plan) => plan.count),
        backgroundColor: membershipColors,
        borderColor: "#ffffff",
        borderWidth: 3,
        hoverOffset: 3,
      },
    ],
  };

  const donutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: "68%",
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (context: { label?: string; parsed: number }) => {
            const pct =
              membershipTotal > 0
                ? Math.round((context.parsed / membershipTotal) * 100)
                : 0;
            return `${context.label || "Plan"}: ${context.parsed} (${pct}%)`;
          },
        },
      },
    },
  };

  const { isReady } = useAppInitialization();

  const fetchDashboardData = useCallback(async () => {
    if (!isReady) return;
    try {
      const platform = Capacitor.getPlatform();

      if (platform === "web") {
        // Fetch from API on web
        const [members, types, transactions] = await Promise.all([
          getMembers(),
          getMembershipTypes(),
          getAllTransactions({ limit: 5 }),
        ]);

        // Calculate distribution
        const distribution = types.map((type) => {
          const count = members.filter(
            (m) => m.membership_plan_id === type.membership_id,
          ).length;
          return { label: type.name || "Unknown", count };
        });

        setMembershipPlans(distribution);

        // Map transactions to table format
        const formattedTransactions = transactions.map((t) => ({
          date: new Date(t.created_at)
            .toLocaleDateString("en-GB")
            .replace(/\//g, "-"),
          type: t.transaction_type,
          amount: t.total_price,
        }));
        setLatestPayments(formattedTransactions);

        // Note: For checkInsToday on web, we would need a visits API that returns all visits.
        // For now, we'll leave it at 0 or fetch if available.
      } else {
        // Fetch from SQLite on native
        const distribution = await getMembershipDistribution();
        if (distribution && distribution.length > 0) {
          setMembershipPlans(distribution);
        }
      }
    } catch (error) {
      console.error("Failed to fetch dashboard data:", error);
    }
  }, [isReady]);

  useEffect(() => {
    if (!isReady) return;

    fetchDashboardData();

    connectCheckInsWS((count) => {
      setCheckInsToday(count);
    });

    connectRevenueWS((amount) => {
      setRevenueToday(amount);
    });

    return () => {
      disconnectCheckInsWS();
      disconnectRevenueWS();
    };
  }, [isReady, fetchDashboardData]);

  const handleMenuClick = () => {
    setIsMenuOpen(true);
  };

  const handleCloseMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <div className="admin-dashboard-container">
      <div className="admin-main-container">
        <div className="admin-top-header">
          <BackButton
            className="btn"
            type="button"
            onClick={() => history.push("/admin-page")}
          >
            <IonIcon icon={arrowBackOutline} />
          </BackButton>

          <h1>Dashboard</h1>

          <IonIcon
            icon={menuOutline}
            className="menu-icon"
            onClick={handleMenuClick}
          />
        </div>

        <div className="admin-main-content">
          {!isReady ? (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                height: "400px",
              }}
            >
              <LoadingSpinner />
              <p style={{ marginTop: "20px", color: "#666" }}>
                Preparing your dashboard...
              </p>
            </div>
          ) : (
            <>
              <div className="ad-stats-row">
                <section className="ad-stat-card ad-stat-card-dark">
                  <span className="ad-card-label">Check-ins Today</span>
                  {checkInsToday === null ? (
                    <IonSkeletonText
                      animated={true}
                      style={{
                        width: "60px",
                        height: "36px",
                        marginTop: "8px",
                        marginBottom: "4px",
                        borderRadius: "4px",
                        "--background": "rgba(56, 189, 248, 0.1)",
                        "--background-rgb": "56, 189, 248",
                      }}
                    />
                  ) : (
                    <strong className="ad-stat-value">{checkInsToday}</strong>
                  )}
                </section>
                <section className="ad-stat-card ad-stat-card-dark">
                  <span className="ad-card-label">Revenue Today</span>
                  {revenueToday === null ? (
                    <IonSkeletonText
                      animated={true}
                      style={{
                        width: "60px",
                        height: "36px",
                        marginTop: "8px",
                        marginBottom: "4px",
                        borderRadius: "4px",
                        "--background": "rgba(56, 189, 248, 0.1)",
                        "--background-rgb": "56, 189, 248",
                      }}
                    />
                  ) : (
                    <strong className="ad-stat-value">
                      {formatPeso(revenueToday)}
                    </strong>
                  )}
                </section>
              </div>

              <section className="ad-dashboard-card ad-revenue-card">
                <div className="ad-section-head">
                  <div>
                    <h2>Revenue</h2>
                    <p className="ad-section-subtitle">Total monthly revenue</p>
                  </div>

                  <select
                    className="ad-period-select"
                    value={selectedPeriod}
                    onChange={(event) => setSelectedPeriod(event.target.value)}
                    aria-label="Revenue period selector"
                  >
                    <option value="Weekly">Last 7 days</option>
                    <option value="Monthly">Last 30 days</option>
                    <option value="Quarterly">Last 365 days</option>
                  </select>
                </div>

                <div className="ad-revenue-summary-row">
                  <strong className="ad-revenue-total">
                    {formatPeso(monthlyRevenue)}
                  </strong>
                  <span className="ad-change-badge ad-positive">
                    +{revenueChange}%
                  </span>
                </div>

                <div className="ad-chart-container ad-revenue-chart">
                  <Line data={lineChartData} options={lineChartOptions} />
                </div>
              </section>

              <section className="ad-dashboard-card ad-source-card">
                <div className="ad-section-head">
                  <h2>Source</h2>
                </div>

                <div className="ad-chart-container ad-source-chart">
                  <Bar
                    data={stackedSourceData}
                    options={stackedSourceOptions}
                  />
                </div>

                <ul className="ad-source-list">
                  {revenueSources.map((source) => (
                    <li key={source.label} className="ad-source-item">
                      <span className="ad-source-name">{source.label}</span>
                      <span className="ad-source-amount">
                        {formatPeso(source.amount)}
                      </span>
                      <span className="ad-change-badge ad-neutral">
                        {source.percent}%
                      </span>
                    </li>
                  ))}
                </ul>
              </section>

              <section className="ad-dashboard-card ad-table-card">
                <div className="ad-section-head">
                  <h2>Latest Payments</h2>
                </div>

                <div className="ad-table-wrapper">
                  <table>
                    <thead>
                      <tr>
                        <th>Date</th>
                        <th>Type</th>
                        <th>Amount</th>
                      </tr>
                    </thead>

                    <tbody>
                      {latestPayments.map((payment, index) => (
                        <tr key={`${payment.date}-${payment.type}-${index}`}>
                          <td>{payment.date}</td>
                          <td>{payment.type}</td>
                          <td>{formatPeso(payment.amount)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <button type="button" className="ad-ghost-action-btn">
                  View All
                </button>
              </section>

              <div className="ad-bottom-grid">
                <section className="ad-dashboard-card ad-membership-card">
                  <div className="ad-section-head">
                    <h2>Membership Plan Distribution</h2>
                  </div>

                  <div className="ad-membership-layout">
                    <ul className="ad-membership-legend">
                      {membershipPlans.map((plan, index) => {
                        const percentage =
                          membershipTotal > 0
                            ? Math.round((plan.count / membershipTotal) * 100)
                            : 0;
                        return (
                          <li
                            key={plan.label}
                            className="ad-membership-legend-item"
                          >
                            <div className="ad-legend-title-wrap">
                              <span
                                className="ad-legend-dot"
                                aria-hidden="true"
                                style={{
                                  backgroundColor: membershipColors[index],
                                }}
                              />
                              <span>{plan.label}</span>
                            </div>
                            <span className="ad-legend-count">
                              {plan.count}
                            </span>
                            <span className="ad-change-badge ad-neutral">
                              {percentage}%
                            </span>
                          </li>
                        );
                      })}
                    </ul>

                    <div className="ad-chart-container ad-donut-chart">
                      <Doughnut data={donutData} options={donutOptions} />
                    </div>
                  </div>

                  <button type="button" className="ad-ghost-action-btn">
                    View Details
                  </button>
                </section>

                <section className="ad-dashboard-card ad-best-sellers-card">
                  <div className="ad-section-head">
                    <h2>Best Sellers</h2>
                  </div>

                  <ol className="ad-best-sellers-list">
                    {bestSellers.map((item, index) => (
                      <li key={item.name} className="ad-best-seller-item">
                        <span className="ad-seller-rank">{index + 1}</span>
                        <span className="ad-seller-name">{item.name}</span>
                        <span className="ad-seller-sales">
                          {formatPeso(item.sales)}
                        </span>
                      </li>
                    ))}
                  </ol>

                  <button type="button" className="ad-ghost-action-btn">
                    View Details
                  </button>
                </section>

                <section className="ad-dashboard-card ad-low-stock-card">
                  <div className="ad-section-head">
                    <h2>Low On Stocks</h2>
                  </div>

                  <ol className="ad-best-sellers-list">
                    {lowOnStocks.map((item, index) => (
                      <li key={item.name} className="ad-best-seller-item">
                        <span className="ad-seller-rank">{index + 1}</span>
                        <span className="ad-seller-name">{item.name}</span>
                        <span className="ad-seller-sales">{item.stock}</span>
                      </li>
                    ))}
                  </ol>

                  <button type="button" className="ad-ghost-action-btn">
                    View Details
                  </button>
                </section>
              </div>
            </>
          )}
        </div>
      </div>

      <Menu isOpen={isMenuOpen} onClose={handleCloseMenu} />
    </div>
  );
};

const formatPeso = (value: number) =>
  new Intl.NumberFormat("en-PH", {
    style: "currency",
    currency: "PHP",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);

export default AdminDashboard;
