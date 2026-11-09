// ** External Imports
import { renderHook } from "@testing-library/react";
import { createElement } from "react";
import { afterEach, expect, test, vi } from "vitest";

// ** Core Imports
import { resetLayerStackForTests } from "@bridge-ui/core/Layer";

// ** Local Imports
import {
  usePopover,
  type PopoverOwnProps,
  type PopoverProps,
} from "@/Components/Popover";

afterEach(() => {
  resetLayerStackForTests();
  document.body.innerHTML = "";
  document.body.style.overflow = "";
});

const libDefaults = {
  offset: 8,
  arrow: false,
  shadow: "md",
  rounded: "md",
  strategy: "fixed",
  teleportTo: "body",
  closeOnEscape: true,
  closeOnClickAway: true,
  disableScrollLock: true,
  placement: "bottom-start",
} as const satisfies Partial<PopoverOwnProps>;

function renderUsePopover(
  props: PopoverProps = {},
  options: Parameters<typeof usePopover>[2] = {},
) {
  return renderHook(() =>
    usePopover(props, libDefaults as Parameters<typeof usePopover>[1], options),
  );
}

test("it should return the library defaults", () => {
  const { result } = renderUsePopover();

  expect(result.current.merged.offset).toBe(8);
  expect(result.current.merged.arrow).toBe(false);
  expect(result.current.merged.placement).toBe("bottom-start");
});

test("it should override placement when prop is passed", () => {
  const { result } = renderUsePopover({ placement: "top-end" });

  expect(result.current.merged.placement).toBe("top-end");
});

test("it should expose dialog semantics on trigger and content binds", () => {
  const { result } = renderUsePopover(
    { slots: { trigger: createElement("span", null, "Open") } },
    { show: false },
  );

  expect(result.current.contentBind.role).toBe("dialog");
  expect(result.current.triggerBind["aria-expanded"]).toBe(false);
  expect(result.current.triggerBind["aria-haspopup"]).toBe("dialog");
  expect(result.current.triggerBind["aria-controls"]).toBeUndefined();
});

test("it should wire aria-labelledby only when a title is set", () => {
  const withTitle = renderUsePopover({ title: "Filters" });
  const withoutTitle = renderUsePopover();

  expect(withTitle.result.current.hasTitle).toBe(true);
  expect(withTitle.result.current.contentBind["aria-labelledby"]).toBe(
    withTitle.result.current.titleBind.id,
  );
  expect(
    withoutTitle.result.current.contentBind["aria-labelledby"],
  ).toBeUndefined();
});

test("it should return no arrow bind unless arrow is true", () => {
  const off = renderUsePopover();
  const on = renderUsePopover({ arrow: true });

  expect(off.result.current.arrowBind).toBeNull();
  expect(on.result.current.arrowBind?.["aria-hidden"]).toBe(true);
});

test("it should apply rounded and shadow token classes", () => {
  const { result } = renderUsePopover({ shadow: "xl", rounded: "lg" });

  expect(result.current.contentBind.className).toContain("rounded-lg");
  expect(result.current.contentBind.className).toContain("shadow-xl");
});

test("it should merge custom classes into the parts", () => {
  const { result } = renderUsePopover({
    title: "Filters",
    classes: { content: "w-80", title: "uppercase" },
  });

  expect(result.current.contentBind.className).toContain("w-80");
  expect(result.current.titleBind.className).toContain("uppercase");
});

test("it should pass close to the children render function", () => {
  const onClose = vi.fn();
  const onShowChange = vi.fn();
  const children = vi.fn(() => "Body");

  const { result } = renderUsePopover(
    { children },
    { onClose, show: true, onShowChange },
  );

  expect(result.current.children).toBe("Body");

  const [[renderProps]] = children.mock.calls as unknown as [
    [{ close: () => void }],
  ];

  renderProps.close();

  expect(onClose).toHaveBeenCalledOnce();
  expect(onShowChange).toHaveBeenCalledWith(false);
});

test("it should close with close even when persistent", () => {
  const onShowChange = vi.fn();

  const { result } = renderUsePopover(
    { persistent: true },
    { show: true, onShowChange },
  );

  result.current.close();

  expect(onShowChange).toHaveBeenCalledWith(false);
});

test("it should not call onShowChange from close while hidden", () => {
  const onShowChange = vi.fn();

  const { result } = renderUsePopover({}, { show: false, onShowChange });

  result.current.close();

  expect(onShowChange).not.toHaveBeenCalled();
});
