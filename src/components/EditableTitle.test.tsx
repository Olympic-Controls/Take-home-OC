import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { EditableTitle } from "./EditableTitle";

describe("EditableTitle", () => {
  it("renders the value as text in view mode", () => {
    render(<EditableTitle value="My Title" onChange={() => {}} />);
    expect(screen.getByText("My Title")).toBeInTheDocument();
    expect(screen.queryByRole("textbox")).not.toBeInTheDocument();
  });

  it("enters edit mode on click", async () => {
    const user = userEvent.setup();
    render(<EditableTitle value="My Title" onChange={() => {}} />);

    await user.click(screen.getByText("My Title"));
    expect(screen.getByRole("textbox")).toBeInTheDocument();
  });

  it("enters edit mode on Enter key", async () => {
    const user = userEvent.setup();
    render(<EditableTitle value="My Title" onChange={() => {}} />);

    screen.getByText("My Title").focus();
    await user.keyboard("{Enter}");
    expect(screen.getByRole("textbox")).toBeInTheDocument();
  });

  it("enters edit mode on Space key", async () => {
    const user = userEvent.setup();
    render(<EditableTitle value="My Title" onChange={() => {}} />);

    screen.getByText("My Title").focus();
    await user.keyboard(" ");
    expect(screen.getByRole("textbox")).toBeInTheDocument();
  });

  it("commits trimmed value on blur", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<EditableTitle value="My Title" onChange={onChange} />);

    await user.click(screen.getByText("My Title"));
    const input = screen.getByRole("textbox");
    await user.clear(input);
    await user.type(input, "  Updated  ");
    await user.tab(); // trigger blur

    expect(onChange).toHaveBeenCalledWith("Updated");
  });

  it("commits on Enter", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<EditableTitle value="My Title" onChange={onChange} />);

    await user.click(screen.getByText("My Title"));
    const input = screen.getByRole("textbox");
    await user.clear(input);
    await user.type(input, "New Name");
    await user.keyboard("{Enter}");

    expect(onChange).toHaveBeenCalledWith("New Name");
  });

  it("reverts and exits on Escape without calling onChange", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<EditableTitle value="My Title" onChange={onChange} />);

    await user.click(screen.getByText("My Title"));
    const input = screen.getByRole("textbox");
    await user.clear(input);
    await user.type(input, "Nope");
    await user.keyboard("{Escape}");

    expect(onChange).not.toHaveBeenCalled();
    expect(screen.getByText("My Title")).toBeInTheDocument();
    expect(screen.queryByRole("textbox")).not.toBeInTheDocument();
  });

  it("reverts on empty/whitespace-only input", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<EditableTitle value="My Title" onChange={onChange} />);

    await user.click(screen.getByText("My Title"));
    const input = screen.getByRole("textbox");
    await user.clear(input);
    await user.type(input, "   ");
    await user.tab(); // blur

    expect(onChange).not.toHaveBeenCalled();
    expect(screen.getByText("My Title")).toBeInTheDocument();
  });
});
