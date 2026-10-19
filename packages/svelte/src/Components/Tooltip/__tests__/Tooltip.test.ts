// ** External Imports
import { fireEvent, render } from "@testing-library/svelte";
import { tick } from "svelte";
import { afterEach, expect, test, vi } from "vitest";

// ** Core Imports
import { resetLayerStackForTests } from "@bridge-ui/core/Layer";

// ** Local Imports
import { Tooltip } from "@/Components/Tooltip";
import { textSnippet } from "@/Utils/__tests__/textSnippet";

afterEach(() => {
  resetLayerStackForTests();
});

function getTooltip() {
  return document.body.querySelector('[role="tooltip"]');
}

test("it should stay hidden until the trigger is hovered", async () => {
  const { container } = render(Tooltip, {
    props: { openDelay: 0, content: "Hint", trigger: textSnippet("Hover") },
  });

  expect(getTooltip()).toBeNull();

  await fireEvent.pointerEnter(container.querySelector("span")!.parentElement!);

  expect(getTooltip()?.textContent).toContain("Hint");
});

test("it should portal the panel to the body", async () => {
  const { container } = render(Tooltip, {
    props: { show: true, content: "Hint", trigger: textSnippet("Hover") },
  });

  await tick();

  expect(container.querySelector('[role="tooltip"]')).toBeNull();
  expect(getTooltip()?.parentElement).toBe(document.body);
});

test("it should keep the panel in place when teleportTo is false", async () => {
  const { container } = render(Tooltip, {
    props: {
      show: true,
      content: "Hint",
      teleportTo: false,
      trigger: textSnippet("Hover"),
    },
  });

  await tick();

  expect(container.querySelector('[role="tooltip"]')).not.toBeNull();
});

test("it should describe the trigger while visible", async () => {
  const { container } = render(Tooltip, {
    props: { show: true, content: "Hint", trigger: textSnippet("Hover") },
  });

  await tick();

  const tooltipId = getTooltip()?.id;

  expect(tooltipId).toBeTruthy();
  expect(
    container
      .querySelector("[aria-describedby]")
      ?.getAttribute("aria-describedby"),
  ).toBe(tooltipId);
});

test("it should close on Escape and call onShowChange", async () => {
  const onShowChange = vi.fn();
  const { container } = render(Tooltip, {
    props: {
      show: true,
      onShowChange,
      content: "Hint",
      trigger: textSnippet("Hover"),
    },
  });

  await fireEvent.keyDown(container.querySelector("[aria-describedby]")!, {
    key: "Escape",
  });

  expect(onShowChange).toHaveBeenCalledWith(false);
  expect(getTooltip()).toBeNull();
});

test("it should prefer children over content", async () => {
  render(Tooltip, {
    props: {
      show: true,
      content: "Plain",
      children: textSnippet("Rich"),
      trigger: textSnippet("Hover"),
    },
  });

  await tick();

  expect(getTooltip()?.textContent).toContain("Rich");
  expect(getTooltip()?.textContent).not.toContain("Plain");
});

test("it should not open when disabled", async () => {
  const { container } = render(Tooltip, {
    props: {
      disabled: true,
      openDelay: 0,
      content: "Hint",
      trigger: textSnippet("Hover"),
    },
  });

  await fireEvent.pointerEnter(container.querySelector("span")!.parentElement!);

  expect(getTooltip()).toBeNull();
});
