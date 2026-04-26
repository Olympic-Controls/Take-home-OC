import type { DataPoint } from "./types";

export const DATASETS: Record<string, { label: string; data: DataPoint[] }> = {
  revenue: {
    label: "revenue",
    data: [
      { label: "Jan", value: 100 },
      { label: "Feb", value: 200 },
      { label: "Mar", value: 300 },
      { label: "Apr", value: 400 },
      { label: "May", value: 500 },
      { label: "Jun", value: 600 },
    ],
  },
  users: {
    label: "Active Users",
    data: [
      { label: "Jan", value: 10 },
      { label: "Feb", value: 20 },
      { label: "Mar", value: 30 },
      { label: "Apr", value: 4 },
      { label: "May", value: 5 },
      { label: "Jun", value: 6 },
    ],
  },
  sessions: {
    label: "Sessions",
    data: [
      { label: "Jan", value: 10 },
      { label: "Feb", value: 20 },
      { label: "Mar", value: 30 },
      { label: "Apr", value: 4 },
      { label: "May", value: 5 },
      { label: "Jun", value: 6 },
      { label: "Jul", value: 10 },
      { label: "Aug", value: 20 },
    ],
  },
  orders: {
    label: "Orders",
    data: [
      { label: "Jan", value: 10 },
      { label: "Feb", value: 20 },
      { label: "Mar", value: 30 },
      { label: "Apr", value: 4 },
      { label: "May", value: 5 },
      { label: "Jun", value: 6 },
      { label: "Jul", value: 10 },
    ],
  },
};
