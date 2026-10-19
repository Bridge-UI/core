// ** External Imports
import { afterEach, expect, test, vi } from "vitest";

// ** Core Imports
import { resetLayerStackForTests } from "@bridge-ui/core/Layer";

// ** Local Imports
import { useTooltip, type TooltipProps } from "@/Components/Tooltip";
import { renderHook } from "@/Utils/__tests__/renderHook";

afterEach(() => {
  resetLayerStackForTests();
});

const libDefaults = {
  offset: 8,
  size: "md",
  arrow: true,
  color: "dark",
  rounded: "md",
  closeDelay: 0,
  openDelay: 0,
  placement: "top",
  strategy: "fixed",
  teleportTo: "body",
} as const;

function renderUseTooltip(props: TooltipProps = {}, initialShow = false) {
  let show = initialShow;
  const setShow = vi.fn((next: boolean) => {
    show = next;
  });

  const view = renderHook(
    (hookProps: () => TooltipProps) =>
      useTooltip(hookProps, libDefaults, {
        setShow,
        id: "tip",
        show: () => show,
      }),
    { props },
  );

  return { ...view, setShow };
}

test("it should merge library defaults", () => {
  const { result } = renderUseTooltip();

  expect(result.merged.placement).toBe("top");
  expect(result.merged.color).toBe("dark");
});

test("it should request open on focus and close on blur", () => {
  const { result, setShow } = renderUseTooltip();

  (result.triggerBind.onfocus as () => void)();
  (result.triggerBind.onblur as () => void)();

  expect(setShow).toHaveBeenNthCalledWith(1, true);
  expect(setShow).toHaveBeenNthCalledWith(2, false);
});

test("it should ignore open requests while disabled", () => {
  const { result, setShow } = renderUseTooltip({ disabled: true });

  (result.triggerBind.onpointerenter as () => void)();

  expect(setShow).not.toHaveBeenCalled();
});

test("it should drop the arrow bind when arrow is false", () => {
  expect(renderUseTooltip({ arrow: false }).result.arrowBind).toBeNull();
});

test("it should stack above the base layer while visible", () => {
  const { result } = renderUseTooltip({}, true);

  expect(result.contentBind.style).toMatch(/z-index: \d+/);
  expect(result.contentBind.id).toBe("tip");
});
