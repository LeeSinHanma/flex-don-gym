import React, { useState, useEffect, useCallback, useMemo } from "react";
import { IonIcon, IonSkeletonText } from "@ionic/react";
import { arrowBack, menu } from "ionicons/icons";
import { useHistory } from "react-router-dom";
import useResponsiveView from "../../hooks/useResponsiveView";
import { getMembershipDistribution } from "../../repositories/memberRepository";
import { getMembers } from "../../logicHandlers/memberCrud";
import { getMembershipTypes } from "../../logicHandlers/membershipCrud";
import {
  getAllTransactions,
  TransactionResponse,
} from "../../logicHandlers/transactionHandler";
import {
  getLowStockItems,
  InventoryItem,
} from "../../logicHandlers/itemInvCrud";
import { Capacitor } from "@capacitor/core";
import { useAppInitialization } from "../../hooks/useAppInitialization";
import { LoadingSpinner } from "../../components/Reusable/LoadingSpinner";
import { BackButton } from "../../components/Reusable/BackButton";
import {
  getRevenueLastDays,
  getRevenueLine,
  getRevenueSource,
  getRevenueGrowth,
  getTodayMetrics,
  getBestSellingProducts,
  BestSellingProduct,
} from "../../logicHandlers/graphHandler";
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
  const history = useHistory();
  const isMobileView = useResponsiveView();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState("Monthly");
  const [revenueSubtitle, setRevenueSubtitle] = useState(
    "Total monthly revenue",
  );
  const [currentRevenue, setCurrentRevenue] = useState(184950);

  const [checkInsToday, setCheckInsToday] = useState<number | null>(null);
  const [revenueToday, setRevenueToday] = useState<number | null>(null);

  const [revenueChange, setRevenueChange] = useState<{
    percentage: number;
    trend: string;
  } | null>(null);

  const [revenueTrend, setRevenueTrend] = useState<{
    labels: string[];
    data: number[];
  } | null>(null);
  const [revenueSources, setRevenueSources] = useState<
    { label: string; amount: number; percent: number }[] | null
  >(null);
  const sourceColors = ["#0f766e", "#34d399", "#3b82f6", "#f59e0b", "#8b5cf6"];

  const [latestPayments, setLatestPayments] = useState<
    { date: string; type: string; amount: number }[] | null
  >(null);

  const [membershipPlans, setMembershipPlans] = useState<
    { label: string; count: number }[] | null
  >(null);

  const membershipColors = ["#14b8a6", "#22c55e", "#38bdf8", "#f59e0b"];

  const [bestSellingProducts, setBestSellingProducts] = useState<
    BestSellingProduct[] | null
  >(null);

  const [lowOnStocks, setLowOnStocks] = useState<InventoryItem[] | null>(null);

  const membershipTotal = useMemo(
    () => membershipPlans?.reduce((total, plan) => total + plan.count, 0) ?? 0,
    [membershipPlans],
  );

  const lineChartData = {
    labels: revenueTrend?.labels || [],
    datasets: [
      {
        data: revenueTrend?.data || [],
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
    datasets: (revenueSources || []).map((source, index) => ({
      label: source.label,
      data: [source.amount],
      backgroundColor: sourceColors[index % sourceColors.length],
      borderRadius: 0,
      borderSkipped: false,
      barThickness: 22,
    })),
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
    labels: (membershipPlans || []).map((plan) => plan.label),
    datasets: [
      {
        data: (membershipPlans || []).map((plan) => plan.count),
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

      // Fetch transactions for both platforms since it hits the live API
      try {
        const transactions = await getAllTransactions({ limit: 5 });
        const formattedTransactions = transactions.map((t) => ({
          date: new Date(t.created_at)
            .toLocaleDateString("en-GB")
            .replace(/\//g, "-"),
          type: t.transaction_type,
          amount: t.total_price,
        }));
        setLatestPayments(formattedTransactions);
      } catch (err) {
        console.error("Failed to fetch latest payments:", err);
        setLatestPayments([]);
      }

      // Fetch today metrics
      try {
        const metrics = await getTodayMetrics();
        setCheckInsToday(metrics.check_ins_today);
        setRevenueToday(metrics.total_revenue_today);
      } catch (err) {
        console.error("Failed to fetch today metrics:", err);
      }

      // Fetch low stock items
      try {
        const lowStock = await getLowStockItems(10, 5);
        // Sort by quantity ascending so the lowest is Rank 1
        const sortedLowStock = lowStock.sort((a, b) => a.quantity - b.quantity);
        setLowOnStocks(sortedLowStock);
      } catch (err) {
        console.error("Failed to fetch low stock items:", err);
        setLowOnStocks([]);
      }

      try {
        const bestSelling = await getBestSellingProducts("all-time");
        const sortedBestSelling = [...bestSelling.products]
          .sort(
            (left, right) =>
              right.quantity_sold - left.quantity_sold ||
              right.revenue_generated - left.revenue_generated,
          )
          .slice(0, 5);
        setBestSellingProducts(sortedBestSelling);
      } catch (err) {
        console.error("Failed to fetch best selling products:", err);
        setBestSellingProducts([]);
      }

      if (platform === "web") {
        // Fetch from API on web
        const [members, types] = await Promise.all([
          getMembers(),
          getMembershipTypes(),
        ]);

        // Calculate distribution
        const distribution = types.map((type) => {
          const count = members.filter(
            (m) => m.membership_plan_id === type.membership_id,
          ).length;
          return { label: type.name || "Unknown", count };
        });

        setMembershipPlans(distribution);
      } else {
        // Fetch from SQLite on native
        const distribution = await getMembershipDistribution();
        if (distribution && distribution.length > 0) {
          setMembershipPlans(distribution);
        } else {
          setMembershipPlans([]);
        }
      }
    } catch (error) {
      console.error("Failed to fetch dashboard data:", error);
      setMembershipPlans([]);
      setLatestPayments([]);
    }
  }, [isReady]);

  useEffect(() => {
    if (!isReady) return;

    fetchDashboardData();

    // Set up polling for today metrics every 60 seconds
    const intervalId = setInterval(async () => {
      try {
        const metrics = await getTodayMetrics();
        setCheckInsToday(metrics.check_ins_today);
        setRevenueToday(metrics.total_revenue_today);
      } catch (err) {
        console.error("Polling error for today metrics:", err);
      }
    }, 60000);

    return () => {
      clearInterval(intervalId);
    };
  }, [isReady, fetchDashboardData]);

  useEffect(() => {
    setRevenueChange(null);
    const range =
      selectedPeriod === "Weekly"
        ? "7d"
        : selectedPeriod === "Monthly"
        ? "30d"
        : "365d";

    getRevenueLastDays(range)
      .then((res) => {
        setRevenueSubtitle(
          `Total revenue for the last ${res.period_days} days`,
        );
        setCurrentRevenue(res.total_revenue);
      })
      .catch(console.error);

    getRevenueLine(range)
      .then((res) => {
        setRevenueTrend({
          labels: res.points.map((p) => p.label),
          data: res.points.map((p) => p.revenue),
        });
      })
      .catch(console.error);

    getRevenueSource(range)
      .then((res) => {
        setRevenueSources(
          res.sources.map((s) => ({
            label: s.source,
            amount: s.amount,
            percent: s.share,
          })),
        );
      })
      .catch(console.error);

    getRevenueGrowth(range)
      .then((res) => {
        setRevenueChange({
          percentage: res.change.percentage,
          trend: res.change.trend,
        });
      })
      .catch(console.error);
  }, [selectedPeriod]);

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
            onClick={() => history.push("/admin-page")}
          >
            <IonIcon icon={arrowBack} />
          </BackButton>

          <h2>Dashboard</h2>

          {isMobileView && (
            <button
              type="button"
              className="icon-button"
              onClick={handleMenuClick}
              aria-label="Open menu"
            >
              <IonIcon icon={menu} />
            </button>
          )}
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

              <div className="ad-bento-grid">
                <div className="ad-top-grid">
                  <section className="ad-dashboard-card ad-revenue-card">
                    <div className="ad-section-head">
                      <div>
                        <h2>Revenue</h2>
                        <p className="ad-section-subtitle">{revenueSubtitle}</p>
                      </div>

                      <select
                        className="ad-period-select"
                        value={selectedPeriod}
                        onChange={(event) =>
                          setSelectedPeriod(event.target.value)
                        }
                        aria-label="Revenue period selector"
                      >
                        <option value="Weekly">Last 7 days</option>
                        <option value="Monthly">Last 30 days</option>
                        <option value="Quarterly">Last 365 days</option>
                      </select>
                    </div>

                    <div className="ad-revenue-summary-row">
                      <strong className="ad-revenue-total">
                        {formatPeso(currentRevenue)}
                      </strong>
                      {revenueChange === null ? (
                        <IonSkeletonText
                          animated={true}
                          style={{
                            width: "45px",
                            height: "20px",
                            borderRadius: "12px",
                          }}
                        />
                      ) : (
                        <span
                          className={`ad-change-badge ${
                            revenueChange.trend === "up"
                              ? "ad-positive"
                              : revenueChange.trend === "down"
                              ? "ad-negative"
                              : "ad-neutral"
                          }`}
                        >
                          {revenueChange.trend === "up" ? "+" : ""}
                          {Number(revenueChange.percentage).toFixed(2)}%
                        </span>
                      )}
                    </div>

                    <div className="ad-chart-container ad-revenue-chart">
                      {revenueTrend === null ? (
                        <IonSkeletonText
                          animated={true}
                          style={{
                            width: "100%",
                            height: "220px",
                            borderRadius: "8px",
                          }}
                        />
                      ) : (
                        <Line data={lineChartData} options={lineChartOptions} />
                      )}
                    </div>
                  </section>

                  <section className="ad-dashboard-card ad-source-card">
                    <div className="ad-section-head">
                      <h2>Source</h2>
                    </div>

                    <div className="ad-chart-container ad-source-chart">
                      {revenueSources === null ? (
                        <IonSkeletonText
                          animated={true}
                          style={{
                            width: "100%",
                            height: "100px",
                            borderRadius: "8px",
                          }}
                        />
                      ) : (
                        <Bar
                          data={stackedSourceData}
                          options={stackedSourceOptions}
                        />
                      )}
                    </div>

                    <ul className="ad-source-list">
                      {revenueSources === null
                        ? [1, 2, 3].map((i) => (
                            <li
                              key={`source-skeleton-${i}`}
                              className="ad-source-item"
                            >
                              <IonSkeletonText
                                animated={true}
                                style={{ width: "40%", height: "14px" }}
                              />
                              <IonSkeletonText
                                animated={true}
                                style={{ width: "25%", height: "14px" }}
                              />
                              <IonSkeletonText
                                animated={true}
                                style={{ width: "15%", height: "14px" }}
                              />
                            </li>
                          ))
                        : revenueSources.map((source, index) => (
                            <li
                              key={`${source.label}-${index}`}
                              className="ad-source-item"
                            >
                              <span className="ad-source-name">
                                {source.label}
                              </span>
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
                          {latestPayments === null
                            ? [1, 2, 3, 4, 5].map((i) => (
                                <tr key={`payment-skeleton-${i}`}>
                                  <td>
                                    <IonSkeletonText
                                      animated={true}
                                      style={{ width: "80px" }}
                                    />
                                  </td>
                                  <td>
                                    <IonSkeletonText
                                      animated={true}
                                      style={{ width: "60px" }}
                                    />
                                  </td>
                                  <td>
                                    <IonSkeletonText
                                      animated={true}
                                      style={{ width: "70px" }}
                                    />
                                  </td>
                                </tr>
                              ))
                            : latestPayments.map((payment, index) => (
                                <tr
                                  key={`${payment.date}-${payment.type}-${index}`}
                                >
                                  <td>{payment.date}</td>
                                  <td>{payment.type}</td>
                                  <td>{formatPeso(payment.amount)}</td>
                                </tr>
                              ))}
                        </tbody>
                      </table>
                    </div>

                    <button
                      type="button"
                      className="ad-ghost-action-btn"
                      onClick={() => history.push("/admin-transactions")}
                    >
                      View All Transactions
                    </button>
                  </section>
                </div>

                <div className="ad-bottom-grid">
                  <section className="ad-dashboard-card ad-membership-card">
                    <div className="ad-section-head">
                      <h2>Membership Plan Distribution</h2>
                    </div>

                    <div className="ad-membership-layout">
                      <ul className="ad-membership-legend">
                        {membershipPlans === null
                          ? [1, 2, 3, 4].map((i) => (
                              <li
                                key={`plan-skeleton-${i}`}
                                className="ad-membership-legend-item"
                              >
                                <div className="ad-legend-title-wrap">
                                  <span
                                    className="ad-legend-dot"
                                    style={{ backgroundColor: "#e0e0e0" }}
                                  />
                                  <IonSkeletonText
                                    animated={true}
                                    style={{ width: "60px" }}
                                  />
                                </div>
                                <IonSkeletonText
                                  animated={true}
                                  style={{ width: "30px" }}
                                />
                                <IonSkeletonText
                                  animated={true}
                                  style={{ width: "40px" }}
                                />
                              </li>
                            ))
                          : membershipPlans.map((plan, index) => {
                              const percentage =
                                membershipTotal > 0
                                  ? Math.round(
                                      (plan.count / membershipTotal) * 100,
                                    )
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
                                        backgroundColor:
                                          membershipColors[
                                            index % membershipColors.length
                                          ],
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
                        {membershipPlans === null ? (
                          <IonSkeletonText
                            animated={true}
                            style={{
                              width: "150px",
                              height: "150px",
                              borderRadius: "50%",
                            }}
                          />
                        ) : (
                          <Doughnut data={donutData} options={donutOptions} />
                        )}
                      </div>
                    </div>
                  </section>

                  <section className="ad-dashboard-card ad-best-sellers-card">
                    <div className="ad-section-head">
                      <h2>Best Selling Products</h2>
                    </div>

                    <ol className="ad-best-sellers-list">
                      {bestSellingProducts === null ? (
                        [1, 2, 3, 4, 5].map((i) => (
                          <li
                            key={`best-selling-skeleton-${i}`}
                            className="ad-best-seller-item"
                          >
                            <span className="ad-seller-rank">{i}</span>
                            <IonSkeletonText
                              animated={true}
                              style={{ width: "55%", height: "14px" }}
                            />
                            <IonSkeletonText
                              animated={true}
                              style={{ width: "20%", height: "14px" }}
                            />
                          </li>
                        ))
                      ) : bestSellingProducts.length === 0 ? (
                        <p
                          style={{
                            textAlign: "center",
                            color: "#666",
                            padding: "10px",
                          }}
                        >
                          No best selling products found
                        </p>
                      ) : (
                        bestSellingProducts.map((item, index) => (
                          <li key={item.item_id} className="ad-best-seller-item">
                            <span className="ad-seller-rank">{index + 1}</span>
                            <span className="ad-seller-name">
                              {item.item_name}
                            </span>
                            <span className="ad-best-seller-meta">
                              <span className="ad-seller-sales">
                                {item.quantity_sold} sold
                              </span>
                              <span className="ad-seller-sales">
                                {formatPeso(item.revenue_generated)}
                              </span>
                            </span>
                          </li>
                        ))
                      )}
                    </ol>
                  </section>

                  <section className="ad-dashboard-card ad-low-stock-card">
                    <div className="ad-section-head">
                      <h2>Low On Stocks</h2>
                    </div>

                    <ol className="ad-best-sellers-list">
                      {lowOnStocks === null ? (
                        [1, 2, 3, 4, 5].map((i) => (
                          <li
                            key={`low-stock-skeleton-${i}`}
                            className="ad-best-seller-item"
                          >
                            <span className="ad-seller-rank">{i}</span>
                            <IonSkeletonText
                              animated={true}
                              style={{ width: "60%", height: "14px" }}
                            />
                            <IonSkeletonText
                              animated={true}
                              style={{ width: "20%", height: "14px" }}
                            />
                          </li>
                        ))
                      ) : lowOnStocks.length === 0 ? (
                        <p
                          style={{
                            textAlign: "center",
                            color: "#666",
                            padding: "10px",
                          }}
                        >
                          No low stock items
                        </p>
                      ) : (
                        lowOnStocks.map((item, index) => (
                          <li
                            key={item.item_id}
                            className="ad-best-seller-item"
                          >
                            <span className="ad-seller-rank">{index + 1}</span>
                            <span className="ad-seller-name">
                              {item.item_name}
                            </span>
                            <span className="ad-seller-sales">
                              {item.quantity}
                            </span>
                          </li>
                        ))
                      )}
                    </ol>
                  </section>
                </div>
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
