// ** External Imports
import { act, renderHook } from "@testing-library/react";
import { createElement } from "react";
import { expect, test } from "vitest";

// ** Local Imports
import {
  useTooltip,
  type TooltipOwnProps,
  type TooltipProps,
} from "@/Components/Tooltip";
import { BridgeUIProvider } from "@/Provider";

const libDefaults = {
  offset: 8,
  size: "md",
  arrow: true,
  color: "dark",
  rounded: "md",
  closeDelay: 0,
  openDelay: 200,
  placement: "top",
  strategy: "fixed",
  teleportTo: "body",
} as const satisfies Partial<TooltipOwnProps>;

function renderUseTooltip(
  props: TooltipProps = {},
  options: {
    registryColor?: TooltipOwnProps["color"];
    show?: boolean;
  } = {},
) {
  return renderHook(
    () =>
      useTooltip(props, libDefaults, {
        show: options.show,
      }),
    {
      wrapper: ({ children }) => {
        if (!("registryColor" in options)) {
          return children;
        }

        return createElement(BridgeUIProvider, {
          children,
          components: {
            Tooltip: {
              defaultProps: { color: options.registryColor },
            },
          },
        });
      },
    },
  );
}

test("it should merge default placement as top", () => {
  const { result } = renderUseTooltip();

  expect(result.current.merged.placement).toBe("top");
});

test("it should merge default arrow as true", () => {
  const { result } = renderUseTooltip();

  expect(result.current.merged.arrow).toBe(true);
});

test("it should expose null arrowBind when arrow is false", () => {
  const { result } = renderUseTooltip({ arrow: false });

  expect(result.current.arrowBind).toBeNull();
});

test("it should set role tooltip on contentBind", () => {
  const { result } = renderUseTooltip({}, { show: true });

  expect(result.current.contentBind.role).toBe("tooltip");
});

test("it should expose children as panelBody when present", () => {
  const { result } = renderUseTooltip({
    content: "Plain",
    children: "Panel body",
    slots: { trigger: "Trigger" },
  });

  expect(result.current.panelBody).toBe("Panel body");
});

test("it should fall back to content prop for panelBody", () => {
  const { result } = renderUseTooltip({
    content: "Plain",
    slots: { trigger: "Trigger" },
  });

  expect(result.current.panelBody).toBe("Plain");
});

test("it should detect hasTrigger from slots.trigger", () => {
  const without = renderUseTooltip({ children: "Body" });
  const withTrigger = renderUseTooltip({
    children: "Body",
    slots: { trigger: "Trigger" },
  });

  expect(without.result.current.hasTrigger).toBe(false);
  expect(withTrigger.result.current.hasTrigger).toBe(true);
});

test("it should resolve color from BridgeUIProvider defaultProps", () => {
  const { result } = renderUseTooltip({}, { registryColor: "primary" });

  expect(result.current.merged.color).toBe("primary");
});

test("it should mark isPortaled when teleportTo is body", () => {
  const { result } = renderUseTooltip();

  expect(result.current.isPortaled).toBe(true);
});

test("it should not portal when teleportTo is false", () => {
  const { result } = renderUseTooltip({ teleportTo: false });

  expect(result.current.isPortaled).toBe(false);
});

test("it should mount content when show is true", () => {
  const { result } = renderUseTooltip({}, { show: true });

  expect(result.current.mounted).toBe(true);
  expect(result.current.show).toBe(true);
});

test("it should stay unmounted when show is false", () => {
  const { result } = renderUseTooltip({}, { show: false });

  expect(result.current.mounted).toBe(false);
  expect(result.current.show).toBe(false);
});

test("it should include pointer-events-none on contentBind", () => {
  const { result } = renderUseTooltip({}, { show: true });

  expect(result.current.contentBind.className).toContain("pointer-events-none");
});

test("it should open uncontrolled after pointer enter with openDelay 0", () => {
  const { result } = renderUseTooltip({
    openDelay: 0,
    content: "Hi",
    slots: { trigger: "Trigger" },
  });

  expect(result.current.show).toBe(false);

  act(() => {
    result.current.triggerBind.onPointerEnter?.({} as never);
  });

  expect(result.current.show).toBe(true);
});
