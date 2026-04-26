import {
  Bar,
  BarChart,
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
      <BarChart height="100%" width="100%" data={data}>
        <XAxis dataKey="label" fontSize={12} />
        <YAxis tick={{ fontSize: 12 }} />
        <Tooltip />
        <Legend />
        <Bar dataKey="value" fill={config.colorSchema} />
      </BarChart>
    </ResponsiveContainer>
  );
}
