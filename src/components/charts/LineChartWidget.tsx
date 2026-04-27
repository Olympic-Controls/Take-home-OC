import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { DataPoint, LineChartConfig } from "../../types";

type LineChartWidgetProps = {
  data: DataPoint[];
  config: LineChartConfig;
};
export default function LineChartWidget({
  data,
  config,
}: LineChartWidgetProps) {
  return (
    <ResponsiveContainer
      initialDimension={{ width: 100, height: 50 }}
      width="100%"
      height="100%"
    >
      <LineChart
        height={"100%"}
        width={"100%"}
        data={data}
        margin={{ top: 8, right: 8, bottom: 0, left: -16 }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
        <XAxis dataKey="label" tick={{ fontSize: 12 }} />
        <YAxis tick={{ fontSize: 12 }} />
        <Tooltip />
        <Line
          type={config.curved ? "monotone" : "linear"}
          dataKey="value"
          stroke="#6366f1"
          strokeWidth={2}
          dot={{ r: 3 }}
          activeDot={{ r: 5 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
