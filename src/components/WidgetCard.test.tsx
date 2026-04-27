import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { WidgetCard } from "./WidgetCard";
import { useDashboardStore } from "../stores";

// Mock recharts to avoid rendering real SVG charts in jsdom
vi.mock("recharts", () => ({
  ResponsiveContainer: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="responsive-container">{children}</div>
  ),
  BarChart: () => <div data-testid="bar-chart" />,
  LineChart: () => <div data-testid="line-chart" />,
  Bar: () => null,
  Line: () => null,
  XAxis: () => null,
  YAxis: () => null,
  CartesianGrid: () => null,
  Tooltip: () => null,
}));

describe("WidgetCard", () => {
  it("returns null for a missing widget id", () => {
    const { container } = render(<WidgetCard id="nonexistent" />);
    expect(container.innerHTML).toBe("");
  });

  it("renders widget title and dataset label", () => {
    useDashboardStore.getState().addWidget("bar");
    const id = useDashboardStore.getState().widgetIds[0];

    render(<WidgetCard id={id} />);

    expect(screen.getByText("Bar Chart")).toBeInTheDocument();
    expect(screen.getByText("Revenue")).toBeInTheDocument();
  });

  it("calls removeWidget when remove button is clicked", async () => {
    const user = userEvent.setup();
    useDashboardStore.getState().addWidget("bar");
    const id = useDashboardStore.getState().widgetIds[0];

    render(<WidgetCard id={id} />);

    const removeBtn = screen.getByRole("button", {
      name: /remove bar chart/i,
    });
    await user.click(removeBtn);

    expect(useDashboardStore.getState().widgets[id]).toBeUndefined();
    expect(useDashboardStore.getState().widgetIds).not.toContain(id);
  });

  it("title edit propagates to updateWidgetTitle", async () => {
    const user = userEvent.setup();
    useDashboardStore.getState().addWidget("bar");
    const id = useDashboardStore.getState().widgetIds[0];

    render(<WidgetCard id={id} />);

    // Click title to enter edit mode
    await user.click(screen.getByText("Bar Chart"));
    const input = screen.getByRole("textbox");
    await user.clear(input);
    await user.type(input, "Sales Overview");
    await user.keyboard("{Enter}");

    expect(useDashboardStore.getState().widgets[id].title).toBe(
      "Sales Overview",
    );
  });
});
