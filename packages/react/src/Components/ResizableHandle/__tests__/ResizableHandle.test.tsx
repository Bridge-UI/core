// ** External Imports
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, expect, test } from "vitest";

// ** Local Imports
import { Resizable } from "@/Components/Resizable";
import { ResizableHandle } from "@/Components/ResizableHandle";
import { ResizablePanel } from "@/Components/ResizablePanel";

afterEach(() => {
  cleanup();
});

test("it should render a grip with withHandle", () => {
  const { container } = render(
    <Resizable>
      <ResizablePanel>One</ResizablePanel>
      <ResizableHandle withHandle classes={{ grip: "bg-primary-500" }} />
      <ResizablePanel>Two</ResizablePanel>
    </Resizable>,
  );

  const grip = container.querySelector("[data-part='grip']");

  expect(grip?.getAttribute("aria-hidden")).toBe("true");
  expect(grip?.className).toContain("bg-primary-500");
});

test("it should render the grip slot", () => {
  render(
    <Resizable>
      <ResizablePanel>One</ResizablePanel>
      <ResizableHandle withHandle slots={{ grip: "⋮" }} />
      <ResizablePanel>Two</ResizablePanel>
    </Resizable>,
  );

  expect(screen.getByText("⋮").getAttribute("data-part")).toBe("grip");
});

test("it should not render a grip by default", () => {
  const { container } = render(
    <Resizable>
      <ResizablePanel>One</ResizablePanel>
      <ResizableHandle />
      <ResizablePanel>Two</ResizablePanel>
    </Resizable>,
  );

  expect(container.querySelector("[data-part='grip']")).toBeNull();
});

test("it should toggle a collapsible panel with Enter", () => {
  render(
    <Resizable>
      <ResizablePanel collapsible minSize={20} defaultSize={40}>
        One
      </ResizablePanel>
      <ResizableHandle />
      <ResizablePanel>Two</ResizablePanel>
    </Resizable>,
  );

  const handle = screen.getByRole("separator");

  fireEvent.keyDown(handle, { key: "Enter" });

  expect(handle.getAttribute("aria-valuenow")).toBe("0");

  fireEvent.keyDown(handle, { key: "Enter" });

  expect(handle.getAttribute("aria-valuenow")).toBe("40");
});

test("it should ignore keys on a disabled handle", () => {
  render(
    <Resizable>
      <ResizablePanel>One</ResizablePanel>
      <ResizableHandle disabled />
      <ResizablePanel>Two</ResizablePanel>
    </Resizable>,
  );

  const handle = screen.getByRole("separator");

  fireEvent.keyDown(handle, { key: "ArrowRight" });

  expect(handle.getAttribute("aria-valuenow")).toBe("50");
  expect(handle.hasAttribute("data-disabled")).toBe(true);
});

test("it should keep a custom aria-label", () => {
  render(
    <Resizable>
      <ResizablePanel>One</ResizablePanel>
      <ResizableHandle aria-label="Resize sidebar" />
      <ResizablePanel>Two</ResizablePanel>
    </Resizable>,
  );

  expect(screen.getByRole("separator").getAttribute("aria-label")).toBe(
    "Resize sidebar",
  );
});
