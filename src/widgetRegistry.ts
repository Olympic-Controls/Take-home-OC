import type { ComponentType } from "react";
import type {
  BarChartConfig,
  ChartType,
  DataPoint,
  LineChartConfig,
} from "./types";
import BarChartWidget from "./components/charts/BarChartWidget";
import { BarChart3, TrendingUp } from "lucide-react";
import LineChartWidget from "./components/charts/LineChartWidget";
export type WidgetRegistryEntry = {
  component: ComponentType<{
    data: DataPoint[];
    config: BarChartConfig | LineChartConfig;
  }>;
  label: string;
  icon: ComponentType<{ className?: string }>;
  defaultSize: { w: number; h: number };
};

export const WIDGET_REGISTRY: Record<ChartType, WidgetRegistryEntry> = {
  bar: {
    component: BarChartWidget as WidgetRegistryEntry["component"],
    label: "Bar Chart",
    icon: BarChart3,
    defaultSize: { w: 4, h: 3 },
  },
  line: {
    component: LineChartWidget as WidgetRegistryEntry["component"],
    label: "Line chart",
    defaultSize: { w: 4, h: 3 },
    icon: TrendingUp,
  },
};
