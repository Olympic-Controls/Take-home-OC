export type ChartType = "bar" | "line";

export type DataPoint = {
  label: string;
  value: number;
};
export type BarChartConfig = {
  colorSchema: string;
};

export type LineChartConfig = {
  curved: boolean;
};

export type WidgetBase = {
  id: string;
  title: string;
  datasetKey: string;
};
export type BarWidget = WidgetBase & { type: "bar"; config: BarChartConfig };
export type LineWidget = WidgetBase & { type: "line"; config: LineChartConfig };

export type Widget = BarWidget | LineWidget;

export type WidgetConfig<T extends ChartType> = T extends "bar"
  ? BarChartConfig
  : LineChartConfig;
