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
  MODAL_STACK_BASE_Z_INDEX,
  resetModalStackForTests,
} from "@bridge-ui/core";

afterEach(() => {
  cleanup();
  resetModalStackForTests();
  document.body.innerHTML = "";
  document.body.style.overflow = "";
});

function NestedModals({
  onOuterChange,
  onInnerChange,
}: {
  onOuterChange?: (show: boolean) => void;
  onInnerChange?: (show: boolean) => void;
}) {
  const [outerOpen, setOuterOpen] = useState(true);
  const [innerOpen, setInnerOpen] = useState(true);

  return (
    <Modal
      show={outerOpen}
      onShowChange={(show) => {
        setOuterOpen(show);
        onOuterChange?.(show);
      }}
    >
      <Modal
        show={innerOpen}
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
    <Modal show onShowChange={onShowChange}>
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
    <Modal show onClose={onClose}>
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

test("it should apply size classes on the wrapper from sm breakpoint", () => {
  render(
    <Modal show size="lg">
      Sized
    </Modal>,
  );

  const wrapper = document.body.querySelector(".mx-auto.flex.min-h-full");

  expect(wrapper?.className).toContain("sm:max-w-lg");
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
    <Modal show align="start">
      Align
    </Modal>,
  );

  const wrapper = document.body.querySelector(".mx-auto.flex.min-h-full");

  expect(wrapper?.className).toContain("sm:items-start");
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
          onShowChange={(show) => {
            setOuterOpen(show);
            onOuterChange(show);
          }}
        >
          Outer
        </Modal>
        <Modal
          show={innerOpen}
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
      MODAL_STACK_BASE_Z_INDEX,
      MODAL_STACK_BASE_Z_INDEX + 1,
    ]);
  });
});
