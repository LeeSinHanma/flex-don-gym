import api from "../api/axios";

export interface RevenueLineResponse {
  range: string;
  timezone: string;
  summary: {
    total_revenue: number;
    point_count: number;
  };
  ticks: {
    index: number;
    label: string;
    date: string;
  }[];
  points: {
    index: number;
    date: string;
    label: string;
    revenue: number;
    period_start: string;
    period_end: string;
    month_label: string;
    bucket: number;
  }[];
  meta: {
    granularity: string;
    days: number;
    axis_tick_count: number;
    months: number;
    buckets_per_month: number;
  };
}

export const getRevenueLine = async (
  range: "7d" | "30d" | "365d"
): Promise<RevenueLineResponse> => {
  try {
    const response = await api.get(`/dashboard/revenue-line`, {
      params: { range },
    });

    return response.data;
  } catch (error) {
    console.error("Error fetching revenue line:", error);
    throw error;
  }
};

export interface RevenueGrowthResponse {
  range: string;
  timezone: string;
  first: {
    label: string;
    date: string;
    revenue: number;
  };
  last: {
    label: string;
    date: string;
    revenue: number;
  };
  change: {
    amount: number;
    percentage: number;
    trend: string; // e.g. "up", "down"
  };
}

export const getRevenueGrowth = async (
  range: "7d" | "30d" | "365d"
): Promise<RevenueGrowthResponse> => {
  try {
    const response = await api.get(`/dashboard/revenue-growth`, {
      params: { range },
    });

    return response.data;
  } catch (error) {
    console.error("Error fetching revenue growth:", error);
    throw error;
  }
};

export interface RevenueSourceResponse {
  range: string;
  timezone: string;
  total_revenue: number;
  sources: {
    source: string;
    amount: number;
    share: number;
  }[];
}

export const getRevenueSource = async (
  range: "7d" | "30d" | "365d"
): Promise<RevenueSourceResponse> => {
  try {
    const response = await api.get(`/dashboard/revenue-source`, {
      params: { range },
    });

    return response.data;
  } catch (error) {
    console.error("Error fetching revenue source:", error);
    throw error;
  }
};

export interface RevenueLastDaysResponse {
  total_revenue: number;
  period_days: number;
  timezone: string;
}

export const getRevenueLastDays = async (
  range: "7d" | "30d" | "365d"
): Promise<RevenueLastDaysResponse> => {
  try {
    const response = await api.get(`/dashboard/revenue-last-days`, {
      params: { range },
    });

    return response.data;
  } catch (error) {
    console.error("Error fetching revenue last days:", error);
    throw error;
  }
};

export interface TodayMetricsResponse {
  total_revenue_today: number;
  check_ins_today: number;
  date: string;
  timezone: string;
}

export const getTodayMetrics = async (): Promise<TodayMetricsResponse> => {
  try {
    const response = await api.get(`/dashboard/today-metrics`);
    return response.data;
  } catch (error) {
    console.error("Error fetching today metrics:", error);
    throw error;
  }
};

