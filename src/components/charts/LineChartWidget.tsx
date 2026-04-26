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
      <LineChart height="100%" width={"100%"} data={data}>
        {/* ps(hyaovi): might need to add some margin values in here */}
        <CartesianGrid strokeDasharray={"3 3"} />
        <XAxis dataKey={"label"} />
        <YAxis />
        <Tooltip />
        <Line type={config.curved ? "monotone" : "linear"} dataKey={"value"} />
      </LineChart>
    </ResponsiveContainer>
  );
}
