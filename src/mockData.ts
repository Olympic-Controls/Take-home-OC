import type { DataPoint } from "./types";

export const DATASETS: Record<string, { label: string; data: DataPoint[] }> = {
  revenue: {
    label: "Revenue",
    data: [
      { label: "Jan", value: 4200 },
      { label: "Feb", value: 3800 },
      { label: "Mar", value: 5100 },
      { label: "Apr", value: 4600 },
      { label: "May", value: 5400 },
      { label: "Jun", value: 6200 },
    ],
  },
  users: {
    label: "Active Users",
    data: [
      { label: "Jan", value: 1200 },
      { label: "Feb", value: 1350 },
      { label: "Mar", value: 1100 },
      { label: "Apr", value: 1580 },
      { label: "May", value: 1720 },
      { label: "Jun", value: 1900 },
    ],
  },
  sessions: {
    label: "Sessions",
    data: [
      { label: "Jan", value: 8200 },
      { label: "Feb", value: 7600 },
      { label: "Mar", value: 9100 },
      { label: "Apr", value: 8800 },
      { label: "May", value: 10200 },
      { label: "Jun", value: 11500 },
    ],
  },
  orders: {
    label: "Orders",
    data: [
      { label: "Jan", value: 320 },
      { label: "Feb", value: 280 },
      { label: "Mar", value: 410 },
      { label: "Apr", value: 390 },
      { label: "May", value: 450 },
      { label: "Jun", value: 520 },
    ],
  },
};

const datasetKeys = Object.keys(DATASETS);
let datasetIndex = 0;

export function getNextDatasetKey(): string {
  const key = datasetKeys[datasetIndex % datasetKeys.length];
  datasetIndex++;
  return key;
}

export function resetDatasetIndex(): void {
  datasetIndex = 0;
}
