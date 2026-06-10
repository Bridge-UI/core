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
import { Modal } from "@/Components/Modal";
import {
  LAYER_STACK_BASE_Z_INDEX,
  resetLayerStackForTests,
} from "@bridge-ui/core";

afterEach(() => {
  cleanup();
  resetLayerStackForTests();
  document.body.innerHTML = "";
  document.body.style.overflow = "";
});

function NestedModals({
  onOuterChange,
  onInnerChange,
}: {
  onInnerChange?: (show: boolean) => void;
  onOuterChange?: (show: boolean) => void;
}) {
  const [outerOpen, setOuterOpen] = useState(true);
  const [innerOpen, setInnerOpen] = useState(true);

  return (
    <Modal
      show={outerOpen}
      transition="none"
      onShowChange={(show) => {
        setOuterOpen(show);
        onOuterChange?.(show);
      }}
    >
      <Modal
        show={innerOpen}
        transition="none"
        onShowChange={(show) => {
          setInnerOpen(show);
          onInnerChange?.(show);
        }}
      >
        Inner
      </Modal>
    </Modal>
  );
}

test("it should not render when show is false", () => {
  render(<Modal show={false}>Hidden</Modal>);

  expect(screen.queryByRole("dialog")).toBeNull();
});

test("it should render in a portal when show is true", () => {
  render(<Modal show>Modal body</Modal>);

  expect(screen.getByRole("dialog")).toBeTruthy();
  expect(document.body.textContent).toContain("Modal body");
});

test("it should call onShowChange when the backdrop is clicked", () => {
  const onShowChange = vi.fn();

  render(
    <Modal show transition="none" onShowChange={onShowChange}>
      Content
    </Modal>,
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
    <Modal show transition="none" onClose={onClose}>
      Content
    </Modal>,
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
    <Modal show persistent onShowChange={onShowChange}>
      Persistent
    </Modal>,
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
    <Modal show onShowChange={onShowChange}>
      <button type="button">Inner</button>
    </Modal>,
  );

  fireEvent.click(screen.getByRole("button", { name: "Inner" }));

  expect(onShowChange).not.toHaveBeenCalled();
});

test("it should apply size classes on the panel from sm breakpoint", () => {
  render(
    <Modal show size="lg">
      Sized
    </Modal>,
  );

  const panel = document.body.querySelector('[role="dialog"]');

  expect(panel?.className).toContain("sm:max-w-lg");
});

test("it should apply blur classes on the overlay", () => {
  render(
    <Modal show blur="md">
      Blur
    </Modal>,
  );

  const overlay = document.body.querySelector(".bg-black\\/50");

  expect(overlay?.className).toContain("backdrop-blur-md");
});

test("it should apply align classes on the wrapper", () => {
  render(
    <Modal show align="top-start">
      Align
    </Modal>,
  );

  const wrapper = document.body.querySelector(".flex.min-h-full.w-full");

  expect(wrapper?.className).toContain("sm:items-start");
  expect(wrapper?.className).toContain("sm:justify-start");
});

test("it should apply middle-end align classes on the wrapper", () => {
  render(
    <Modal show align="middle-end">
      Align
    </Modal>,
  );

  const wrapper = document.body.querySelector(".flex.min-h-full.w-full");

  expect(wrapper?.className).toContain("sm:justify-end");
  expect(wrapper?.className).toContain("sm:items-center");
});

test("it should apply fade transition classes by default", () => {
  render(<Modal show>Animated</Modal>);

  const overlay = document.body.querySelector('[data-modal-part="overlay"]');

  expect(overlay?.className).toContain("duration-300");
  expect(overlay?.className).toContain("data-[state=open]:opacity-100");
});

test("it should not call onClose when show is set to false by the parent", () => {
  const onClose = vi.fn();
  const onShowChange = vi.fn();

  const { rerender } = render(
    <Modal show transition="none" onClose={onClose} onShowChange={onShowChange}>
      Content
    </Modal>,
  );

  rerender(
    <Modal
      show={false}
      transition="none"
      onClose={onClose}
      onShowChange={onShowChange}
    >
      Content
    </Modal>,
  );

  expect(onClose).not.toHaveBeenCalled();
  expect(onShowChange).toHaveBeenCalledWith(false);
});

test("it should render a Card as children", () => {
  render(
    <Modal show>
      <Card title="In modal">Body</Card>
    </Modal>,
  );

  expect(document.body.textContent).toContain("In modal");
  expect(document.body.textContent).toContain("Body");
});

test("it should render nested modals with separate dialog layers", () => {
  render(<NestedModals />);

  expect(screen.getAllByRole("dialog")).toHaveLength(2);
});

test("it should close only the topmost sibling modals on escape", () => {
  const onOuterChange = vi.fn();
  const onInnerChange = vi.fn();

  function SiblingModals() {
    const [outerOpen, setOuterOpen] = useState(true);
    const [innerOpen, setInnerOpen] = useState(true);

    return (
      <>
        <Modal
          show={outerOpen}
          transition="none"
          onShowChange={(show) => {
            setOuterOpen(show);
            onOuterChange(show);
          }}
        >
          Outer
        </Modal>
        <Modal
          show={innerOpen}
          transition="none"
          onShowChange={(show) => {
            setInnerOpen(show);
            onInnerChange(show);
          }}
        >
          Inner
        </Modal>
      </>
    );
  }

  render(<SiblingModals />);

  act(() => {
    window.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" }));
  });

  expect(onInnerChange).toHaveBeenCalledWith(false);
  expect(onOuterChange).not.toHaveBeenCalled();
});

test("it should close only the topmost nested modal on escape", () => {
  const onOuterChange = vi.fn();
  const onInnerChange = vi.fn();

  render(
    <NestedModals
      onOuterChange={onOuterChange}
      onInnerChange={onInnerChange}
    />,
  );

  act(() => {
    window.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" }));
  });

  expect(onInnerChange).toHaveBeenCalledWith(false);
  expect(onOuterChange).not.toHaveBeenCalled();
});

test("it should keep body scroll locked when an inner modal closes", () => {
  const onInnerChange = vi.fn();

  render(<NestedModals onInnerChange={onInnerChange} />);

  expect(document.body.style.overflow).toBe("hidden");

  act(() => {
    window.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" }));
  });

  expect(onInnerChange).toHaveBeenCalledWith(false);
  expect(document.body.style.overflow).toBe("hidden");
});

test("it should assign incremental z-index to nested modals", async () => {
  render(<NestedModals />);

  await waitFor(() => {
    const zIndexes = [
      ...document.body.querySelectorAll<HTMLElement>(
        ".fixed.inset-0.overflow-y-auto",
      ),
    ]
      .map((root) => Number(root.style.zIndex))
      .sort((left, right) => left - right);

    expect(zIndexes).toEqual([
      LAYER_STACK_BASE_Z_INDEX,
      LAYER_STACK_BASE_Z_INDEX + 1,
    ]);
  });
});

test("it should refresh z-index when a sibling modal unmounts", async () => {
  const onInnerChange = vi.fn();

  function ThreeModals() {
    const [outerOpen] = useState(true);
    const [middleOpen] = useState(true);
    const [innerOpen, setInnerOpen] = useState(true);

    return (
      <>
        <Modal show={outerOpen} transition="none">
          Outer
        </Modal>
        <Modal show={middleOpen} transition="none">
          Middle
        </Modal>
        <Modal
          show={innerOpen}
          transition="none"
          onShowChange={(show) => {
            setInnerOpen(show);
            onInnerChange(show);
          }}
        >
          Inner
        </Modal>
      </>
    );
  }

  render(<ThreeModals />);

  await waitFor(() => {
    expect(document.body.querySelectorAll('[role="dialog"]')).toHaveLength(3);
  });

  act(() => {
    window.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" }));
  });

  await waitFor(() => {
    expect(onInnerChange).toHaveBeenCalledWith(false);
  });

  await waitFor(() => {
    const zIndexes = [
      ...document.body.querySelectorAll<HTMLElement>(
        ".fixed.inset-0.overflow-y-auto",
      ),
    ]
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
    <Modal show hideBackdrop>
      Hidden backdrop
    </Modal>,
  );

  expect(document.body.querySelector(".bg-black\\/50")).toBeNull();
});

test("it should skip scroll lock when disableScrollLock is true", () => {
  render(
    <Modal show disableScrollLock>
      Scrollable page
    </Modal>,
  );

  expect(document.body.style.overflow).not.toBe("hidden");
});

test("it should keep dialog mounted when keepMounted is true", async () => {
  const { rerender } = render(
    <Modal show keepMounted transition="none">
      Kept
    </Modal>,
  );

  rerender(
    <Modal show={false} keepMounted transition="none">
      Kept
    </Modal>,
  );

  await waitFor(() => {
    expect(document.body.querySelector('[role="dialog"]')).not.toBeNull();
  });
});

test("it should scroll inside panel when scroll is paper", () => {
  render(
    <Modal show scroll="paper">
      Paper scroll
    </Modal>,
  );

  const panel = document.body.querySelector('[role="dialog"]');

  expect(panel?.className).toContain("overflow-y-auto");
  expect(panel?.className).toContain("max-h-[calc(100dvh-2rem)]");
});
