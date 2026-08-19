// ** External Imports
import {
  act,
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import { useState } from "react";
import { afterEach, expect, test, vi } from "vitest";

// ** Local Imports
import { Card } from "@/Components/Card";
import { Drawer } from "@/Components/Drawer";
import {
  LAYER_STACK_BASE_Z_INDEX,
  resetLayerStackForTests,
} from "@bridge-ui/core/Layer";

afterEach(() => {
  cleanup();
  resetLayerStackForTests();
  document.body.innerHTML = "";
  document.body.style.overflow = "";
});

function NestedDrawers({
  onOuterChange,
  onInnerChange,
}: {
  onInnerChange?: (show: boolean) => void;
  onOuterChange?: (show: boolean) => void;
}) {
  const [outerOpen, setOuterOpen] = useState(true);
  const [innerOpen, setInnerOpen] = useState(true);

  return (
    <Drawer
      show={outerOpen}
      transition="none"
      onShowChange={(show) => {
        setOuterOpen(show);
        onOuterChange?.(show);
      }}
    >
      <Drawer
        show={innerOpen}
        transition="none"
        onShowChange={(show) => {
          setInnerOpen(show);
          onInnerChange?.(show);
        }}
      >
        Inner
      </Drawer>
    </Drawer>
  );
}

test("it should not render when show is false", () => {
  render(<Drawer show={false}>Hidden</Drawer>);

  expect(screen.queryByRole("dialog")).toBeNull();
});

test("it should render in a portal when show is true", () => {
  render(<Drawer show>Drawer body</Drawer>);

  expect(screen.getByRole("dialog")).toBeTruthy();
  expect(document.body.textContent).toContain("Drawer body");
});

test("it should call onShowChange when the backdrop is clicked", () => {
  const onShowChange = vi.fn();

  render(
    <Drawer show transition="none" onShowChange={onShowChange}>
      Content
    </Drawer>,
  );

  const backdrop = document.body.querySelector(".flex.min-h-full.w-full");

  if (backdrop) {
    fireEvent.click(backdrop);
  }

  expect(onShowChange).toHaveBeenCalledWith(false);
});

test("it should call onClose when the backdrop is clicked", () => {
  const onClose = vi.fn();

  render(
    <Drawer show transition="none" onClose={onClose}>
      Content
    </Drawer>,
  );

  const backdrop = document.body.querySelector(".flex.min-h-full.w-full");

  if (backdrop) {
    fireEvent.click(backdrop);
  }

  expect(onClose).toHaveBeenCalledTimes(1);
});

test("it should not call onShowChange on overlay click when persistent", () => {
  const onShowChange = vi.fn();

  render(
    <Drawer show persistent onShowChange={onShowChange}>
      Persistent
    </Drawer>,
  );

  const overlay = document.body.querySelector(".bg-black\\/50");

  if (overlay) {
    fireEvent.click(overlay);
  }

  expect(onShowChange).not.toHaveBeenCalled();
});

test("it should not call onShowChange when clicking inside the panel", () => {
  const onShowChange = vi.fn();

  render(
    <Drawer show onShowChange={onShowChange}>
      <button type="button">Inner</button>
    </Drawer>,
  );

  fireEvent.click(screen.getByRole("button", { name: "Inner" }));

  expect(onShowChange).not.toHaveBeenCalled();
});

test("it should apply size classes on the panel for the horizontal axis by default", () => {
  render(
    <Drawer show size="lg">
      Sized
    </Drawer>,
  );

  const panel = document.body.querySelector('[role="dialog"]');

  expect(panel?.className).toContain("w-96");
});

test("it should apply size classes on the panel for the vertical axis when placement is bottom", () => {
  render(
    <Drawer show size="lg" placement="bottom">
      Sized
    </Drawer>,
  );

  const panel = document.body.querySelector('[role="dialog"]');

  expect(panel?.className).toContain("h-80");
});

test("it should apply blur classes on the overlay", () => {
  render(
    <Drawer show blur="md">
      Blur
    </Drawer>,
  );

  const overlay = document.body.querySelector(".bg-black\\/50");

  expect(overlay?.className).toContain("backdrop-blur-md");
});

test("it should apply left placement classes on the wrapper by default", () => {
  render(<Drawer show>Placement</Drawer>);

  const wrapper = document.body.querySelector(".flex.min-h-full.w-full");

  expect(wrapper?.className).toContain("items-stretch");
  expect(wrapper?.className).toContain("justify-start");
});

test("it should apply right placement classes on the wrapper", () => {
  render(
    <Drawer show placement="right">
      Placement
    </Drawer>,
  );

  const wrapper = document.body.querySelector(".flex.min-h-full.w-full");

  expect(wrapper?.className).toContain("justify-end");
});

test("it should apply top placement classes on the wrapper", () => {
  render(
    <Drawer show placement="top">
      Placement
    </Drawer>,
  );

  const wrapper = document.body.querySelector(".flex.min-h-full.w-full");

  expect(wrapper?.className).toContain("items-start");
  expect(wrapper?.className).toContain("justify-stretch");
});

test("it should apply slide transition classes by default", () => {
  render(<Drawer show>Animated</Drawer>);

  const overlay = document.body.querySelector('[data-drawer-part="overlay"]');

  expect(overlay?.className).toContain("duration-300");
  expect(overlay?.className).toContain("data-[state=open]:opacity-100");

  const panel = document.body.querySelector('[data-drawer-part="panel"]');

  expect(panel?.className).toContain("-translate-x-full");
});

test("it should not call onClose when show is set to false by the parent", () => {
  const onClose = vi.fn();
  const onShowChange = vi.fn();

  const { rerender } = render(
    <Drawer
      show
      transition="none"
      onClose={onClose}
      onShowChange={onShowChange}
    >
      Content
    </Drawer>,
  );

  rerender(
    <Drawer
      show={false}
      transition="none"
      onClose={onClose}
      onShowChange={onShowChange}
    >
      Content
    </Drawer>,
  );

  expect(onClose).not.toHaveBeenCalled();
  expect(onShowChange).toHaveBeenCalledWith(false);
});

test("it should render a Card as children", () => {
  render(
    <Drawer show>
      <Card title="In drawer">Body</Card>
    </Drawer>,
  );

  expect(document.body.textContent).toContain("Body");
  expect(document.body.textContent).toContain("In drawer");
});

test("it should render nested drawers with separate dialog layers", () => {
  render(<NestedDrawers />);

  expect(screen.getAllByRole("dialog")).toHaveLength(2);
});

test("it should close only the topmost sibling drawers on escape", () => {
  const onOuterChange = vi.fn();
  const onInnerChange = vi.fn();

  function SiblingDrawers() {
    const [outerOpen, setOuterOpen] = useState(true);
    const [innerOpen, setInnerOpen] = useState(true);

    return (
      <>
        <Drawer
          show={outerOpen}
          transition="none"
          onShowChange={(show) => {
            setOuterOpen(show);
            onOuterChange(show);
          }}
        >
          Outer
        </Drawer>
        <Drawer
          show={innerOpen}
          transition="none"
          onShowChange={(show) => {
            setInnerOpen(show);
            onInnerChange(show);
          }}
        >
          Inner
        </Drawer>
      </>
    );
  }

  render(<SiblingDrawers />);

  act(() => {
    window.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" }));
  });

  expect(onOuterChange).not.toHaveBeenCalled();
  expect(onInnerChange).toHaveBeenCalledWith(false);
});

test("it should close only the topmost nested drawer on escape", () => {
  const onOuterChange = vi.fn();
  const onInnerChange = vi.fn();

  render(
    <NestedDrawers
      onOuterChange={onOuterChange}
      onInnerChange={onInnerChange}
    />,
  );

  act(() => {
    window.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" }));
  });

  expect(onOuterChange).not.toHaveBeenCalled();
  expect(onInnerChange).toHaveBeenCalledWith(false);
});

test("it should keep body scroll locked when an inner drawer closes", () => {
  const onInnerChange = vi.fn();

  render(<NestedDrawers onInnerChange={onInnerChange} />);

  expect(document.body.style.overflow).toBe("hidden");

  act(() => {
    window.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" }));
  });

  expect(onInnerChange).toHaveBeenCalledWith(false);
  expect(document.body.style.overflow).toBe("hidden");
});

test("it should assign incremental z-index to nested drawers", async () => {
  render(<NestedDrawers />);

  await waitFor(() => {
    const zIndexes = [
      ...document.body.querySelectorAll<HTMLElement>(".fixed.inset-0"),
    ]
      .filter((root) => root.style.zIndex !== "")
      .map((root) => Number(root.style.zIndex))
      .sort((left, right) => left - right);

    expect(zIndexes).toEqual([
      LAYER_STACK_BASE_Z_INDEX,
      LAYER_STACK_BASE_Z_INDEX + 1,
    ]);
  });
});

test("it should not render backdrop when hideBackdrop is true", () => {
  render(
    <Drawer show hideBackdrop>
      Hidden backdrop
    </Drawer>,
  );

  expect(document.body.querySelector(".bg-black\\/50")).toBeNull();
});

test("it should skip scroll lock when disableScrollLock is true", () => {
  render(
    <Drawer show disableScrollLock>
      Scrollable page
    </Drawer>,
  );

  expect(document.body.style.overflow).not.toBe("hidden");
});

test("it should keep dialog mounted when keepMounted is true", async () => {
  const { rerender } = render(
    <Drawer show keepMounted transition="none">
      Kept
    </Drawer>,
  );

  rerender(
    <Drawer keepMounted show={false} transition="none">
      Kept
    </Drawer>,
  );

  await waitFor(() => {
    expect(document.body.querySelector('[role="dialog"]')).not.toBeNull();
  });
});

test("it should scroll inside panel when scroll is paper by default", () => {
  render(<Drawer show>Paper scroll</Drawer>);

  const panel = document.body.querySelector('[role="dialog"]');

  expect(panel?.className).toContain("overflow-y-auto");
  expect(panel?.className).toContain("bridge-scroll-fade-y");
  expect(panel?.className).toContain("bridge-hide-scrollbar");
});

test("it should not scroll inside panel when scroll is body", () => {
  render(
    <Drawer show scroll="body">
      Body scroll
    </Drawer>,
  );

  const panel = document.body.querySelector('[role="dialog"]');

  expect(panel?.className).not.toContain("overflow-y-auto");
});
