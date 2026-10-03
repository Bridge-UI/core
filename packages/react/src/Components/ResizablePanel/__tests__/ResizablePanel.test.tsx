// ** External Imports
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, expect, test, vi } from "vitest";

// ** Local Imports
import { Resizable } from "@/Components/Resizable";
import { ResizableHandle } from "@/Components/ResizableHandle";
import { ResizablePanel } from "@/Components/ResizablePanel";

afterEach(() => {
  cleanup();
});

function panelOf(name: string) {
  return screen.getByText(name).closest("[data-part='panel']") as HTMLElement;
}

test("it should start collapsed when collapsed is true", () => {
  render(
    <Resizable>
      <ResizablePanel collapsed collapsible minSize={20}>
        One
      </ResizablePanel>
      <ResizableHandle />
      <ResizablePanel>Two</ResizablePanel>
    </Resizable>,
  );

  expect(panelOf("One").style.flex).toBe("0 1 0px");
  expect(panelOf("One").hasAttribute("data-collapsed")).toBe(true);
  expect(panelOf("Two").style.flex).toBe("100 1 0px");
});

test("it should follow the collapsed prop", () => {
  const onCollapsedChange = vi.fn();

  function Example({ collapsed }: { collapsed: boolean }) {
    return (
      <Resizable>
        <ResizablePanel
          collapsible
          minSize={20}
          defaultSize={30}
          collapsed={collapsed}
          onCollapsedChange={onCollapsedChange}
        >
          One
        </ResizablePanel>
        <ResizableHandle />
        <ResizablePanel>Two</ResizablePanel>
      </Resizable>
    );
  }

  const { rerender } = render(<Example collapsed={false} />);

  expect(panelOf("One").style.flex).toBe("30 1 0px");

  rerender(<Example collapsed />);

  expect(panelOf("One").style.flex).toBe("0 1 0px");
  expect(onCollapsedChange).toHaveBeenLastCalledWith(true);

  rerender(<Example collapsed={false} />);

  expect(panelOf("One").style.flex).toBe("30 1 0px");
  expect(onCollapsedChange).toHaveBeenLastCalledWith(false);
});

test("it should call onResize when its size changes", () => {
  const onResize = vi.fn();

  render(
    <Resizable>
      <ResizablePanel onResize={onResize}>One</ResizablePanel>
      <ResizableHandle />
      <ResizablePanel>Two</ResizablePanel>
    </Resizable>,
  );

  expect(onResize).not.toHaveBeenCalled();

  fireEvent.keyDown(screen.getByRole("separator"), { key: "ArrowLeft" });

  expect(onResize).toHaveBeenLastCalledWith(40);
});

test("it should keep minSize and maxSize", () => {
  render(
    <Resizable>
      <ResizablePanel minSize={45} maxSize={55}>
        One
      </ResizablePanel>
      <ResizableHandle />
      <ResizablePanel>Two</ResizablePanel>
    </Resizable>,
  );

  const handle = screen.getByRole("separator");

  fireEvent.keyDown(handle, { key: "Home" });

  expect(panelOf("One").style.flex).toBe("45 1 0px");

  fireEvent.keyDown(handle, { key: "End" });

  expect(panelOf("One").style.flex).toBe("55 1 0px");
});
