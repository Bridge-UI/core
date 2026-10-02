// ** External Imports
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, expect, test, vi } from "vitest";

// ** Local Imports
import { Resizable } from "@/Components/Resizable";
import { ResizableHandle } from "@/Components/ResizableHandle";
import { ResizablePanel } from "@/Components/ResizablePanel";

beforeEach(() => {
  vi.spyOn(HTMLElement.prototype, "getBoundingClientRect").mockReturnValue({
    x: 0,
    y: 0,
    top: 0,
    left: 0,
    width: 400,
    right: 400,
    height: 200,
    bottom: 200,
    toJSON: () => ({}),
  });
});

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

function panelFlex(name: string) {
  return (screen.getByText(name).closest("[data-part='panel']") as HTMLElement)
    .style.flex;
}

test("it should share the space evenly", () => {
  render(
    <Resizable>
      <ResizablePanel>One</ResizablePanel>
      <ResizableHandle />
      <ResizablePanel>Two</ResizablePanel>
    </Resizable>,
  );

  expect(panelFlex("One")).toBe("50 1 0px");
  expect(panelFlex("Two")).toBe("50 1 0px");
});

test("it should honor defaultSize", () => {
  render(
    <Resizable>
      <ResizablePanel defaultSize={25}>One</ResizablePanel>
      <ResizableHandle />
      <ResizablePanel>Two</ResizablePanel>
    </Resizable>,
  );

  expect(panelFlex("One")).toBe("25 1 0px");
  expect(panelFlex("Two")).toBe("75 1 0px");
});

test("it should describe the handle as a separator", () => {
  render(
    <Resizable>
      <ResizablePanel id="sidebar" minSize={10} maxSize={80}>
        One
      </ResizablePanel>
      <ResizableHandle />
      <ResizablePanel>Two</ResizablePanel>
    </Resizable>,
  );

  const handle = screen.getByRole("separator");

  expect(handle.getAttribute("tabindex")).toBe("0");
  expect(handle.getAttribute("aria-valuemin")).toBe("10");
  expect(handle.getAttribute("aria-valuemax")).toBe("80");
  expect(handle.getAttribute("aria-valuenow")).toBe("50");
  expect(handle.getAttribute("aria-controls")).toBe("sidebar");
  expect(handle.getAttribute("aria-label")).toBe("Resize panels");
  expect(handle.getAttribute("aria-orientation")).toBe("vertical");
});

test("it should resize with the arrow keys", () => {
  const onLayoutChange = vi.fn();

  render(
    <Resizable keyboardStep={5} onLayoutChange={onLayoutChange}>
      <ResizablePanel>One</ResizablePanel>
      <ResizableHandle />
      <ResizablePanel>Two</ResizablePanel>
    </Resizable>,
  );

  fireEvent.keyDown(screen.getByRole("separator"), { key: "ArrowRight" });

  expect(panelFlex("One")).toBe("55 1 0px");
  expect(onLayoutChange).toHaveBeenLastCalledWith([55, 45]);
});

test("it should resize by dragging a handle", () => {
  render(
    <Resizable>
      <ResizablePanel>One</ResizablePanel>
      <ResizableHandle />
      <ResizablePanel>Two</ResizablePanel>
    </Resizable>,
  );

  const handle = screen.getByRole("separator");

  fireEvent.pointerDown(handle, { button: 0, clientX: 200 });

  expect(handle.hasAttribute("data-dragging")).toBe(true);

  fireEvent.pointerMove(window, { clientX: 240 });

  expect(panelFlex("One")).toBe("60 1 0px");
  expect(panelFlex("Two")).toBe("40 1 0px");

  fireEvent.pointerUp(window);

  expect(handle.hasAttribute("data-dragging")).toBe(false);
});

test("it should stack panels when vertical", () => {
  const { container } = render(
    <Resizable orientation="vertical">
      <ResizablePanel>One</ResizablePanel>
      <ResizableHandle />
      <ResizablePanel>Two</ResizablePanel>
    </Resizable>,
  );

  const root = container.firstElementChild as HTMLElement;
  const handle = screen.getByRole("separator");

  expect(root.className).toContain("flex-col");
  expect(root.getAttribute("data-orientation")).toBe("vertical");
  expect(handle.getAttribute("aria-orientation")).toBe("horizontal");

  fireEvent.keyDown(handle, { key: "ArrowDown" });

  expect(panelFlex("One")).toBe("60 1 0px");
});

test("it should lock every handle when disabled", () => {
  render(
    <Resizable disabled>
      <ResizablePanel>One</ResizablePanel>
      <ResizableHandle />
      <ResizablePanel>Two</ResizablePanel>
    </Resizable>,
  );

  const handle = screen.getByRole("separator");

  fireEvent.keyDown(handle, { key: "ArrowRight" });

  expect(panelFlex("One")).toBe("50 1 0px");
  expect(handle.getAttribute("tabindex")).toBe("-1");
  expect(handle.getAttribute("aria-disabled")).toBe("true");
});
