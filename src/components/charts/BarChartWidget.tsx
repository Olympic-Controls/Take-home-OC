import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { BarChartConfig, DataPoint } from "../../types";

type BarChartWidgetProps = {
  data: DataPoint[];
  config: BarChartConfig;
};
export default function BarChartWidget({ data, config }: BarChartWidgetProps) {
  return (
    <ResponsiveContainer
      width="100%"
      height="100%"
      initialDimension={{ width: 100, height: 50 }}
    >
      <BarChart
        height={"100%"}
        width={"100%"}
        data={data}
        margin={{ top: 8, right: 8, bottom: 0, left: -16 }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
        <XAxis dataKey="label" tick={{ fontSize: 12 }} />
        <YAxis tick={{ fontSize: 12 }} />
        <Tooltip />
        <Legend />
        <Bar dataKey="value" fill={config.colorScheme} radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
