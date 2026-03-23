import React, { useState } from "react";
import { IonIcon } from "@ionic/react";
import { arrowBackOutline, menuOutline } from "ionicons/icons";
import { useHistory } from "react-router-dom";
import { BackButton } from "../../components/Reusable/BackButton";
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

  const activeMembers = 248;
  const checkInsToday = 43;

  const monthlyRevenue = 184950;
  const revenueChange = 8.4;

  const revenueTrendLabels = ["W1", "W2", "W3", "W4", "W5", "W6"];
  const revenueTrendData = [28000, 26500, 31000, 29700, 33350, 36400];

  const revenueSources = [
    { label: "Gym Access", amount: 122500, percent: 66 },
    { label: "Products", amount: 62450, percent: 34 },
  ];

  const latestPayments = [
    { date: "22-03-2026", type: "New Member", amount: 1600 },
    { date: "22-03-2026", type: "Monthly Renewal", amount: 1200 },
    { date: "21-03-2026", type: "Product Purchase", amount: 850 },
    { date: "20-03-2026", type: "Student Plan", amount: 900 },
    { date: "20-03-2026", type: "Yearly Plan", amount: 9800 },
  ];

  const membershipPlans = [
    { label: "Prepaid", count: 72 },
    { label: "Monthly", count: 109 },
    { label: "Yearly", count: 41 },
    { label: "Student", count: 26 },
  ];

  const membershipColors = ["#14b8a6", "#22c55e", "#38bdf8", "#f59e0b"];

  const bestSellers = [
    { name: "Whey Protein 2lb", sales: 24600 },
    { name: "Creatine Monohydrate", sales: 18400 },
    { name: "Resistance Bands Set", sales: 13950 },
    { name: "Shaker Bottle", sales: 9250 },
    { name: "Lifting Straps", sales: 8100 },
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
        borderRadius: 10,
        borderSkipped: false,
        barThickness: 22,
      },
      {
        label: "Products",
        data: [revenueSources[1].amount],
        backgroundColor: "#34d399",
        borderRadius: 10,
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
            const pct = Math.round((context.parsed / membershipTotal) * 100);
            return `${context.label || "Plan"}: ${context.parsed} (${pct}%)`;
          },
        },
      },
    },
  };

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
          <div className="ad-stats-row">
            <section className="ad-stat-card ad-stat-card-dark">
              <span className="ad-card-label">Active Members</span>
              <strong className="ad-stat-value">{activeMembers}</strong>
            </section>

            <section className="ad-stat-card ad-stat-card-dark">
              <span className="ad-card-label">Check-ins Today</span>
              <strong className="ad-stat-value">{checkInsToday}</strong>
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
                <option value="Weekly">Weekly</option>
                <option value="Monthly">Monthly</option>
                <option value="Quarterly">Quarterly</option>
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
              <Bar data={stackedSourceData} options={stackedSourceOptions} />
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
                    const percentage = Math.round(
                      (plan.count / membershipTotal) * 100,
                    );
                    return (
                      <li
                        key={plan.label}
                        className="ad-membership-legend-item"
                      >
                        <div className="ad-legend-title-wrap">
                          <span
                            className="ad-legend-dot"
                            aria-hidden="true"
                            style={{ backgroundColor: membershipColors[index] }}
                          />
                          <span>{plan.label}</span>
                        </div>
                        <span className="ad-legend-count">{plan.count}</span>
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
          </div>
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
